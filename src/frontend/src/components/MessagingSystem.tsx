/**
 * MessagingSystem — LinkedIn-style direct messaging panel
 *
 * Features:
 * - Inbox with conversations sorted by latest message
 * - Online status (green dot) based on last-active timestamp
 * - Unread count badges per conversation
 * - Thread view: right-aligned user bubbles, left-aligned other
 * - Animated typing indicator
 * - Auto-scroll to latest message
 * - Mark-as-read on open
 * - "New Message" modal to pick any user
 * - Search filter on inbox
 * - Polls every 5 seconds for new messages
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Edit3,
  MessageSquare,
  Search,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  useGetConversations,
  useGetDirectMessages,
  useGetUnreadCount,
  useMarkMessagesRead,
  useSendDirectMessage,
} from "../hooks/useQueries";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DMConversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastTimestamp: number;
  unreadCount: number;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

// ─── Static user roster (simulated peer list) ──────────────────────────────────

export const PEER_USERS = [
  { id: "user_alex", name: "Alex Chen", bio: "CS @ IIT Delhi · DSA" },
  { id: "user_priya", name: "Priya Sharma", bio: "Frontend Intern · React" },
  { id: "user_rajan", name: "Rajan Mehta", bio: "Competitive Programmer" },
  { id: "user_sara", name: "Sara Kim", bio: "ML Track · Python" },
  { id: "user_dev", name: "Dev Patel", bio: "Full Stack Developer" },
  { id: "user_neha", name: "Neha Joshi", bio: "Cybersecurity Enthusiast" },
  { id: "user_aryan", name: "Aryan Singh", bio: "Backend Dev · Node.js" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function initial(name: string) {
  return name.charAt(0).toUpperCase();
}

function formatTs(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
  if (diff < 86_400_000)
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  return new Date(ts).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateGroup(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// ─── Avatar dot ─────────────────────────────────────────────────────────────────

function UserAvatar({
  name,
  online,
  size = "md",
}: {
  name: string;
  online?: boolean;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  const dotDim = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  return (
    <div className="relative shrink-0">
      <div
        className={`${dim} rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold`}
      >
        {initial(name)}
      </div>
      {online && (
        <span
          className={`absolute bottom-0 right-0 ${dotDim} bg-green-500 border-2 border-card rounded-full`}
        />
      )}
    </div>
  );
}

// ─── Conversation row ───────────────────────────────────────────────────────────

function ConvRow({
  conv,
  active,
  onClick,
  index,
}: {
  conv: DMConversation;
  active: boolean;
  onClick: () => void;
  index: number;
}) {
  const peer = PEER_USERS.find((u) => u.id === conv.participantId);
  const online = peer
    ? Date.now() - Number(localStorage.getItem(`cc_activity_${peer.id}`) ?? 0) <
      5 * 60_000
    : false;

  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`messaging.conversation.item.${index}`}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
        active
          ? "bg-primary/10 border-l-2 border-primary"
          : "border-l-2 border-transparent"
      }`}
    >
      <UserAvatar name={conv.participantName} online={online} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span
            className={`text-sm truncate ${conv.unreadCount > 0 ? "font-bold text-foreground" : "font-semibold text-foreground/80"}`}
          >
            {conv.participantName}
          </span>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {formatTs(conv.lastTimestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span
            className={`text-xs truncate ${conv.unreadCount > 0 ? "text-foreground/70 font-medium" : "text-muted-foreground"}`}
          >
            {conv.lastMessage}
          </span>
          {conv.unreadCount > 0 && (
            <span className="ml-1 shrink-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Thread view ───────────────────────────────────────────────────────────────

function ThreadView({
  convId,
  currentUserId,
  participantId,
  participantName,
  onBack,
  onConvUpdated,
}: {
  convId: string;
  currentUserId: string;
  participantId: string;
  participantName: string;
  onBack: () => void;
  onConvUpdated: () => void;
}) {
  const { data: msgs = [], refetch } = useGetDirectMessages(convId);
  const sendMsg = useSendDirectMessage();
  const markRead = useMarkMessagesRead();

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const peer = PEER_USERS.find((u) => u.id === participantId);
  const online = peer
    ? Date.now() - Number(localStorage.getItem(`cc_activity_${peer.id}`) ?? 0) <
      5 * 60_000
    : false;

  // Mark messages as read on open
  const markReadMutate = markRead.mutate;
  useEffect(() => {
    markReadMutate(convId, { onSuccess: () => onConvUpdated() });
  }, [convId, markReadMutate, onConvUpdated]);

  // Poll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => refetch(), 5_000);
    return () => clearInterval(timer);
  }, [refetch]);

  // Auto-scroll to latest — using a ref-based approach avoids the deps lint warning
  const scrollRef = useRef({ msgCount: 0, isTyping: false });
  scrollRef.current = { msgCount: msgs.length, isTyping };
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendMsg.mutate(
      {
        convId,
        senderId: currentUserId,
        receiverId: participantId,
        content: text,
      },
      {
        onSuccess: () => {
          refetch();
          onConvUpdated();
          // Simulate reply
          setIsTyping(true);
          setTimeout(
            () => {
              setIsTyping(false);
              const autoReplies = [
                "That's awesome! Keep it up 🔥",
                "Haha yeah, same here!",
                "I'm working through DSA right now too",
                "Did you see the new problems section?",
                "Let's collab on a project sometime!",
                "Have you tried the online test yet?",
              ];
              sendMsg.mutate(
                {
                  convId,
                  senderId: participantId,
                  receiverId: currentUserId,
                  content:
                    autoReplies[Math.floor(Math.random() * autoReplies.length)],
                },
                {
                  onSuccess: () => {
                    refetch();
                    onConvUpdated();
                  },
                },
              );
            },
            2_000 + Math.random() * 2_000,
          );
        },
      },
    );
  }, [
    input,
    convId,
    currentUserId,
    participantId,
    sendMsg,
    refetch,
    onConvUpdated,
  ]);

  // Group messages by date
  const grouped: { date: string; items: DirectMessage[] }[] = [];
  for (const m of msgs) {
    const label = formatDateGroup(m.timestamp);
    const last = grouped[grouped.length - 1];
    if (!last || last.date !== label) grouped.push({ date: label, items: [m] });
    else last.items.push(m);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-card border-b border-border px-3 py-2.5 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          data-ocid="messaging.thread.back.button"
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <UserAvatar name={participantName} online={online} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {participantName}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {online
              ? "Active now"
              : `Last seen ${formatTs(Date.now() - 3 * 60 * 60_000)}`}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1 max-w-lg mx-auto">
          {msgs.length === 0 && (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="messaging.thread.empty_state"
            >
              <p className="text-4xl mb-3">👋</p>
              <p className="text-sm font-semibold text-foreground">
                Start the conversation
              </p>
              <p className="text-xs mt-1">Say hello to {participantName}!</p>
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center gap-2 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground px-2 shrink-0">
                  {group.date}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {group.items.map((m, i) => {
                const isMine = m.senderId === currentUserId;
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`flex ${isMine ? "justify-end" : "justify-start"} items-end gap-2 mb-1.5`}
                    data-ocid={`messaging.message.item.${i + 1}`}
                  >
                    {!isMine && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] shrink-0 mb-0.5">
                        {initial(participantName)}
                      </div>
                    )}
                    <div
                      className={`flex flex-col max-w-[72%] ${isMine ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                          isMine
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card border border-border text-foreground rounded-bl-sm"
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
            </div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-2 mb-1.5"
                data-ocid="messaging.typing_indicator"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                  {initial(participantName)}
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3 py-2.5">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                        style={{ animationDelay: `${j * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {participantName} is typing…
                </span>
              </motion.div>
            )}
          </AnimatePresence>

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
            placeholder={`Message ${participantName}…`}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[20px]"
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

// ─── New message modal ──────────────────────────────────────────────────────────

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
  const filtered = PEER_USERS.filter(
    (u) =>
      u.id !== currentUserId &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.bio.toLowerCase().includes(search.toLowerCase())),
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
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="font-semibold text-foreground text-sm">New Message</h2>
      </div>
      <div className="p-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            data-ocid="messaging.new_message.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people to message…"
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-10">
            No users found
          </p>
        ) : (
          filtered.map((u) => (
            <button
              type="button"
              key={u.id}
              onClick={() => onSelect(u.id, u.name)}
              data-ocid={`messaging.new_message.user.${u.id}`}
              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {initial(u.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {u.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {u.bio}
                </p>
              </div>
            </button>
          ))
        )}
      </ScrollArea>
    </div>
  );
}

// ─── Main MessagingSystem component ───────────────────────────────────────────

interface MessagingSystemProps {
  onClose: () => void;
}

export default function MessagingSystem({ onClose }: MessagingSystemProps) {
  const { user } = useApp();
  const currentUserId = user.deviceId || "local_user";

  const { data: conversations = [], refetch: refetchConvs } =
    useGetConversations(currentUserId);
  const markRead = useMarkMessagesRead();

  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(
    null,
  );
  const [activeParticipantName, setActiveParticipantName] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState("");
  const [showNewMsg, setShowNewMsg] = useState(false);

  // Poll conversations every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => refetchConvs(), 5_000);
    return () => clearInterval(timer);
  }, [refetchConvs]);

  const filteredConvs = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(search.toLowerCase()),
  );

  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  const openConv = (
    convId: string,
    participantId: string,
    participantName: string,
  ) => {
    setActiveConvId(convId);
    setActiveParticipantId(participantId);
    setActiveParticipantName(participantName);
    setSearch("");
    markRead.mutate(convId, { onSuccess: () => refetchConvs() });
  };

  const handleNewMessage = (userId: string, userName: string) => {
    const convId = [currentUserId, userId].sort().join("__");
    setShowNewMsg(false);
    openConv(convId, userId, userName);
  };

  const handleBack = () => {
    setActiveConvId(null);
    setActiveParticipantId(null);
    setActiveParticipantName(null);
    refetchConvs();
  };

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
        aria-label="Close messaging"
      />

      {/* Panel */}
      <div
        className="relative bg-background border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-[400px] h-[88dvh] sm:h-[620px] flex flex-col overflow-hidden"
        data-ocid="messaging.panel"
      >
        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between shrink-0 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-foreground text-sm">Messages</h2>
            {totalUnread > 0 && (
              <span
                className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5"
                data-ocid="messaging.unread_count"
              >
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
              title="New message"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              data-ocid="messaging.close.button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Close messages"
              title="Close"
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
                transition={{ duration: 0.18 }}
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

          {/* Thread slide-in */}
          <AnimatePresence>
            {activeConvId && activeParticipantId && activeParticipantName && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-background z-10 flex flex-col"
              >
                <ThreadView
                  convId={activeConvId}
                  currentUserId={currentUserId}
                  participantId={activeParticipantId}
                  participantName={activeParticipantName}
                  onBack={handleBack}
                  onConvUpdated={refetchConvs}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search bar */}
          <div className="p-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                data-ocid="messaging.search_input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
              />
            </div>
          </div>

          {/* Conversation list */}
          <ScrollArea className="flex-1">
            {filteredConvs.length === 0 ? (
              <div
                className="text-center py-14 px-6"
                data-ocid="messaging.conversations.empty_state"
              >
                <div className="text-5xl mb-3">💬</div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  No conversations yet
                </p>
                <p className="text-xs text-muted-foreground mb-5">
                  Connect with other learners to start chatting
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
              <div>
                {filteredConvs.map((conv, i) => (
                  <ConvRow
                    key={conv.id}
                    conv={conv}
                    active={activeConvId === conv.id}
                    index={i + 1}
                    onClick={() =>
                      openConv(
                        conv.id,
                        conv.participantId,
                        conv.participantName,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Hook: total unread count for nav badge ─────────────────────────────────────

export function useMessagingUnreadCount(currentUserId: string): number {
  const { data } = useGetUnreadCount(currentUserId);
  return data ?? 0;
}
