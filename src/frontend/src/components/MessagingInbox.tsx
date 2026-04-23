import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Edit,
  Search,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

// ── Types ──────────────────────────────────────────────────────────────────────

interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastTimestamp: number;
  unreadCount: number;
}

// ── Simulated user list ────────────────────────────────────────────────────────

const SIMULATED_USERS = [
  { id: "user_alex", name: "Alex Chen", bio: "CS Student @ IIT Delhi" },
  { id: "user_priya", name: "Priya Sharma", bio: "Frontend Dev Intern" },
  { id: "user_rajan", name: "Rajan Mehta", bio: "DSA Enthusiast" },
  { id: "user_sara", name: "Sara Kim", bio: "Python & ML Track" },
  { id: "user_dev", name: "Dev Patel", bio: "Full Stack Dev" },
];

// ── Storage helpers ────────────────────────────────────────────────────────────

function getMessages(convId: string): DirectMessage[] {
  try {
    return JSON.parse(
      localStorage.getItem(`cc_dm_${convId}`) ?? "[]",
    ) as DirectMessage[];
  } catch {
    return [];
  }
}

function saveMessages(convId: string, msgs: DirectMessage[]) {
  localStorage.setItem(`cc_dm_${convId}`, JSON.stringify(msgs));
}

function getConversationId(userA: string, userB: string) {
  return [userA, userB].sort().join("__");
}

function getAllConversations(currentUserId: string): Conversation[] {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("cc_dm_"));
  const convos: Conversation[] = [];
  for (const key of keys) {
    const convId = key.replace("cc_dm_", "");
    if (!convId.includes(currentUserId)) continue;
    const msgs = getMessages(convId) as DirectMessage[];
    if (msgs.length === 0) continue;
    const otherUserId =
      convId.split("__").find((p) => p !== currentUserId) ?? "";
    const otherUser = SIMULATED_USERS.find((u) => u.id === otherUserId);
    const last = msgs[msgs.length - 1];
    const unreadCount = msgs.filter(
      (m) => !m.read && m.senderId !== currentUserId,
    ).length;
    convos.push({
      id: convId,
      participantId: otherUserId,
      participantName: otherUser?.name ?? otherUserId,
      lastMessage: last.content,
      lastTimestamp: last.timestamp,
      unreadCount,
    });
  }
  return convos.sort((a, b) => b.lastTimestamp - a.lastTimestamp);
}

function isOnline(userId: string): boolean {
  const last = Number(localStorage.getItem(`cc_activity_${userId}`) ?? "0");
  return Date.now() - last < 5 * 60 * 1000;
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ConversationListItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const online = isOnline(conv.participantId);
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`messaging.conversation.item.${conv.id}`}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${isActive ? "bg-primary/10 border-l-2 border-primary" : "border-l-2 border-transparent"}`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
          {getInitial(conv.participantName)}
        </div>
        {online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground truncate">
            {conv.participantName}
          </span>
          <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
            {formatTime(conv.lastTimestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-xs text-muted-foreground truncate">
            {conv.lastMessage}
          </span>
          {conv.unreadCount > 0 && (
            <span className="ml-2 shrink-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function ThreadView({
  convId,
  currentUserId,
  participantName,
  participantId,
  onBack,
}: {
  convId: string;
  currentUserId: string;
  participantName: string;
  participantId: string;
  onBack: () => void;
}) {
  const [msgs, setMsgs] = useState<DirectMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const online = isOnline(participantId);

  // Load & mark read
  useEffect(() => {
    const load = () => {
      const all = getMessages(convId);
      const marked = all.map((m) =>
        m.senderId !== currentUserId && !m.read ? { ...m, read: true } : m,
      );
      saveMessages(convId, marked);
      setMsgs(marked);
    };
    load();
    const poll = setInterval(load, 10_000);
    return () => clearInterval(poll);
  }, [convId, currentUserId]);

  // Scroll to bottom whenever messages or typing changes
  const scrollKey = `${msgs.length}_${isTyping}`;
  const scrollKeyRef = useRef(scrollKey);
  if (scrollKeyRef.current !== scrollKey) {
    scrollKeyRef.current = scrollKey;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const msg: DirectMessage = {
      id: crypto.randomUUID(),
      senderId: currentUserId,
      receiverId: participantId,
      content: text,
      timestamp: Date.now(),
      read: false,
    };
    const updated = [...getMessages(convId), msg];
    saveMessages(convId, updated);
    setMsgs(updated);
    setInput("");
    // Simulate reply after 2-4s
    setIsTyping(true);
    const delay = 2000 + Math.random() * 2000;
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        "That's interesting! Tell me more 😊",
        "Haha yeah I know what you mean!",
        "Thanks for reaching out!",
        "Working on DSA right now, you?",
        "Cool! Let's study together sometime.",
        "I just cracked a hard LeetCode problem 🎉",
        "Have you checked the new roadmap modules?",
      ];
      const reply: DirectMessage = {
        id: crypto.randomUUID(),
        senderId: participantId,
        receiverId: currentUserId,
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: Date.now(),
        read: false,
      };
      const final = [...getMessages(convId), reply];
      saveMessages(convId, final);
      setMsgs(final);
    }, delay);
  }, [input, convId, currentUserId, participantId]);

  const lastSeen = `Last seen ${formatTime(Date.now() - 2 * 60 * 60 * 1000)}`;

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="bg-card border-b border-border px-3 py-2.5 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          data-ocid="messaging.thread.back.button"
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
            {getInitial(participantName)}
          </div>
          {online && (
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-card rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {participantName}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {online ? "Active now" : lastSeen}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-3">
        <div className="space-y-3 max-w-lg mx-auto">
          {msgs.length === 0 && (
            <div
              className="text-center py-12 text-muted-foreground text-sm"
              data-ocid="messaging.thread.empty_state"
            >
              No messages yet. Say hello! 👋
            </div>
          )}
          {msgs.map((m, i) => {
            const isMine = m.senderId === currentUserId;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i < 10 ? 0 : 0 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"} items-end gap-2`}
                data-ocid={`messaging.message.item.${i + 1}`}
              >
                {!isMine && (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] shrink-0 mb-0.5">
                    {getInitial(participantName)}
                  </div>
                )}
                <div
                  className={`max-w-[75%] flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                      isMine
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border border-border text-foreground rounded-tl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 px-1">
                    <span className="text-[9px] text-muted-foreground">
                      {formatTime(m.timestamp)}
                    </span>
                    {isMine && (
                      <span className="text-muted-foreground">
                        {m.read ? (
                          <CheckCheck className="w-3 h-3 text-primary" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
              data-ocid="messaging.typing_indicator"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                {getInitial(participantName)}
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-3 py-2.5">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">
                {participantName} is typing...
              </span>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-background border-t border-border p-3 shrink-0">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-2 focus-within:border-primary/50 transition-colors max-w-lg mx-auto">
          <input
            data-ocid="messaging.thread.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={`Message ${participantName}...`}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <Button
            data-ocid="messaging.thread.send.button"
            onClick={send}
            disabled={!input.trim()}
            size="sm"
            className="rounded-full w-8 h-8 p-0 bg-primary text-primary-foreground shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function NewMessageModal({
  currentUserId,
  onSelect,
  onClose,
}: {
  currentUserId: string;
  onSelect: (userId: string, userName: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = SIMULATED_USERS.filter(
    (u) =>
      u.id !== currentUserId &&
      u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="absolute inset-0 bg-background z-10 flex flex-col"
      data-ocid="messaging.new_message.dialog"
    >
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          data-ocid="messaging.new_message.close.button"
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="font-semibold text-foreground text-sm">New Message</h2>
      </div>
      <div className="p-3 border-b border-border shrink-0">
        <Input
          data-ocid="messaging.new_message.search_input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people..."
          className="bg-muted border-0 text-sm"
        />
      </div>
      <ScrollArea className="flex-1">
        {filtered.map((u) => (
          <button
            type="button"
            key={u.id}
            onClick={() => onSelect(u.id, u.name)}
            data-ocid={`messaging.new_message.user.${u.id}`}
            className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {getInitial(u.name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{u.name}</p>
              <p className="text-xs text-muted-foreground">{u.bio}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No users found
          </p>
        )}
      </ScrollArea>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface MessagingInboxProps {
  onClose: () => void;
}

export default function MessagingInbox({ onClose }: MessagingInboxProps) {
  const { user } = useApp();
  const currentUserId = user.deviceId || "local_user";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(
    null,
  );
  const [activeParticipantName, setActiveParticipantName] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState("");
  const [showNewMsg, setShowNewMsg] = useState(false);

  // Seed demo conversations on first load
  useEffect(() => {
    if (!localStorage.getItem("cc_dm_seeded")) {
      const p1 = getConversationId(currentUserId, "user_alex");
      const msgs1: DirectMessage[] = [
        {
          id: "1",
          senderId: "user_alex",
          receiverId: currentUserId,
          content: "Hey! Have you started the DSA roadmap?",
          timestamp: Date.now() - 30 * 60 * 1000,
          read: false,
        },
        {
          id: "2",
          senderId: currentUserId,
          receiverId: "user_alex",
          content: "Yes! Just finished Module 2 🔥",
          timestamp: Date.now() - 25 * 60 * 1000,
          read: true,
        },
        {
          id: "3",
          senderId: "user_alex",
          receiverId: currentUserId,
          content: "Nice! The binary trees section is tough",
          timestamp: Date.now() - 10 * 60 * 1000,
          read: false,
        },
      ];
      saveMessages(p1, msgs1);

      const p2 = getConversationId(currentUserId, "user_priya");
      const msgs2: DirectMessage[] = [
        {
          id: "4",
          senderId: "user_priya",
          receiverId: currentUserId,
          content: "Did you solve the Daily Challenge today?",
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          read: true,
        },
      ];
      saveMessages(p2, msgs2);

      localStorage.setItem("cc_dm_seeded", "1");
    }
    // Refresh activity timestamps
    localStorage.setItem(
      "cc_activity_user_alex",
      String(Date.now() - 2 * 60 * 1000),
    );
    localStorage.setItem(
      "cc_activity_user_priya",
      String(Date.now() - 10 * 60 * 1000),
    );
  }, [currentUserId]);

  // Load and poll conversations
  useEffect(() => {
    const load = () => setConversations(getAllConversations(currentUserId));
    load();
    const poll = setInterval(load, 10_000);
    return () => clearInterval(poll);
  }, [currentUserId]);

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(search.toLowerCase()),
  );

  const openConversation = (
    convId: string,
    participantId: string,
    participantName: string,
  ) => {
    setActiveConvId(convId);
    setActiveParticipantId(participantId);
    setActiveParticipantName(participantName);
    setSearch("");
  };

  const handleNewMessage = (userId: string, userName: string) => {
    const convId = getConversationId(currentUserId, userId);
    setShowNewMsg(false);
    openConversation(convId, userId, userName);
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 8 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close messaging panel"
      />

      {/* Panel */}
      <div
        className="relative bg-background border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-[380px] h-[88dvh] sm:h-[600px] flex flex-col overflow-hidden"
        data-ocid="messaging.panel"
      >
        {/* Panel header */}
        <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between shrink-0 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-foreground text-sm">Messages</h2>
            {totalUnread > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              data-ocid="messaging.new_message.open_modal_button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNewMsg(true)}
              className="w-8 h-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="New message"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              data-ocid="messaging.close.button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Close messaging"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Inner panels */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* New message overlay */}
          <AnimatePresence>
            {showNewMsg && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 z-10"
              >
                <NewMessageModal
                  currentUserId={currentUserId}
                  onSelect={handleNewMessage}
                  onClose={() => setShowNewMsg(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thread view */}
          <AnimatePresence>
            {activeConvId && activeParticipantId && activeParticipantName && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-background z-10 flex flex-col"
              >
                <ThreadView
                  convId={activeConvId}
                  currentUserId={currentUserId}
                  participantId={activeParticipantId}
                  participantName={activeParticipantName}
                  onBack={() => {
                    setActiveConvId(null);
                    setActiveParticipantId(null);
                    setActiveParticipantName(null);
                    setConversations(getAllConversations(currentUserId));
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conversation list */}
          <div className="p-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                data-ocid="messaging.search_input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredConversations.length === 0 ? (
              <div
                className="text-center py-12 px-4"
                data-ocid="messaging.conversations.empty_state"
              >
                <div className="text-4xl mb-3">💬</div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  No conversations yet
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Start a new message to connect with other learners
                </p>
                <Button
                  data-ocid="messaging.start_conversation.button"
                  size="sm"
                  onClick={() => setShowNewMsg(true)}
                  className="rounded-full"
                >
                  Start a conversation
                </Button>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conv={conv}
                  isActive={activeConvId === conv.id}
                  onClick={() =>
                    openConversation(
                      conv.id,
                      conv.participantId,
                      conv.participantName,
                    )
                  }
                />
              ))
            )}
          </ScrollArea>
        </div>
      </div>
    </motion.div>
  );
}

// ── Unread count hook (for use in StudyApp header) ─────────────────────────────

export function useUnreadCount(currentUserId: string): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const compute = () => {
      const convos = getAllConversations(currentUserId);
      setCount(convos.reduce((s, c) => s + c.unreadCount, 0));
    };
    compute();
    const poll = setInterval(compute, 30_000);
    return () => clearInterval(poll);
  }, [currentUserId]);
  return count;
}
