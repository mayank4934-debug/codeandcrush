/**
 * MessagingSystem — Instagram-style direct messaging with stories,
 * media sharing, emoji reactions, context menu, read receipts, saved messages.
 */

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  BookmarkCheck,
  Check,
  CheckCheck,
  Copy,
  Edit3,
  Flag,
  Forward,
  Heart,
  Image,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Play,
  Search,
  Send,
  Share2,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import {
  type DMMessage,
  type StoryData,
  useAddReaction,
  useCreateStory,
  useGetActiveStories,
  useGetConversations,
  useGetDirectMessages,
  useGetSavedMessages,
  useGetUnreadCount,
  useMarkMessagesRead,
  useRemoveReaction,
  useSaveMessage,
  useSendDirectMessage,
  useUnsaveMessage,
  useViewStory,
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

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😢", "👌", "🔥"];

// ─── Static user roster ────────────────────────────────────────────────────────

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

// ─── Avatar ────────────────────────────────────────────────────────────────────

function UserAvatar({
  name,
  online,
  size = "md",
  hasStory = false,
}: {
  name: string;
  online?: boolean;
  size?: "sm" | "md";
  hasStory?: boolean;
}) {
  const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  const dotDim = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  const ringClass = hasStory
    ? "ring-2 ring-offset-1 ring-offset-background ring-primary"
    : "";
  return (
    <div className="relative shrink-0">
      <div
        className={`${dim} ${ringClass} rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold`}
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

// ─── Story ring bubble ────────────────────────────────────────────────────────

function StoryRing({
  story,
  onClick,
  viewed,
}: { story: StoryData; onClick: () => void; viewed: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 shrink-0 focus-visible:outline-none"
      data-ocid={`messaging.story.${story.userId}`}
    >
      <div
        className={`w-14 h-14 rounded-full p-0.5 ${viewed ? "bg-muted" : "bg-gradient-to-tr from-primary via-pink-500 to-orange-400"}`}
      >
        <div className="w-full h-full rounded-full bg-background p-0.5">
          <div className="w-full h-full rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {initial(story.userName)}
          </div>
        </div>
      </div>
      <span className="text-[10px] text-foreground/70 w-14 truncate text-center">
        {story.userName.split(" ")[0]}
      </span>
    </button>
  );
}

// ─── Story viewer ─────────────────────────────────────────────────────────────

function StoryViewer({
  stories,
  startIndex,
  currentUserId,
  onClose,
}: {
  stories: StoryData[];
  startIndex: number;
  currentUserId: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const viewStory = useViewStory();
  const story = stories[idx];
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: idx drives the effect
  useEffect(() => {
    if (!story) return;
    viewStory.mutate({ storyId: story.id, userId: currentUserId });
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (idx < stories.length - 1) setIdx((i) => i + 1);
          else onClose();
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!story) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
      data-ocid="messaging.story_viewer"
    >
      <div className="flex gap-1 px-3 pt-3 pb-2 shrink-0">
        {stories.map((s, i) => (
          <div
            key={s.id}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width: i < idx ? "100%" : i === idx ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-3 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {initial(story.userName)}
          </div>
          <div>
            <p className="text-white text-xs font-semibold">{story.userName}</p>
            <p className="text-white/60 text-[10px]">
              {formatTs(story.timestamp)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          data-ocid="messaging.story_viewer.close_button"
          className="text-white p-1.5 rounded-full hover:bg-white/10"
          aria-label="Close story"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        {story.mediaType === "video" ? (
          <video
            src={story.mediaUrl}
            className="absolute inset-0 w-full h-full object-contain"
            autoPlay
            muted
            loop
          />
        ) : (
          <img
            src={story.mediaUrl}
            alt={story.caption ?? "Story"}
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
        <button
          type="button"
          className="absolute left-0 top-0 w-1/3 h-full"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          aria-label="Previous story"
        />
        <button
          type="button"
          className="absolute right-0 top-0 w-1/3 h-full"
          onClick={() => {
            if (idx < stories.length - 1) setIdx((i) => i + 1);
            else onClose();
          }}
          aria-label="Next story"
        />
      </div>
      {(story.caption || story.viewCount > 0) && (
        <div className="px-4 py-3 bg-gradient-to-t from-black/80 to-transparent shrink-0">
          {story.caption && (
            <p className="text-white text-sm mb-1">{story.caption}</p>
          )}
          <p className="text-white/50 text-[10px]">👁 {story.viewCount} views</p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Stories bar ──────────────────────────────────────────────────────────────

function StoriesBar({
  currentUserId,
  onCreateStory,
}: { currentUserId: string; onCreateStory: () => void }) {
  const { data: stories = [] } = useGetActiveStories();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStart, setViewerStart] = useState(0);
  const viewedRef = useRef<Set<string>>(new Set());
  return (
    <>
      <div className="shrink-0 border-b border-border bg-card">
        <ScrollArea className="overflow-x-auto">
          <div className="flex items-start gap-3 px-3 py-2.5">
            <button
              type="button"
              onClick={onCreateStory}
              data-ocid="messaging.story.create_button"
              className="flex flex-col items-center gap-1 shrink-0 focus-visible:outline-none"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors">
                <span className="text-primary text-2xl leading-none">+</span>
              </div>
              <span className="text-[10px] text-muted-foreground w-14 truncate text-center">
                Your story
              </span>
            </button>
            {stories.map((story, i) => (
              <StoryRing
                key={story.id}
                story={story}
                viewed={viewedRef.current.has(story.id)}
                onClick={() => {
                  setViewerStart(i);
                  setViewerOpen(true);
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      <AnimatePresence>
        {viewerOpen && (
          <StoryViewer
            stories={stories}
            startIndex={viewerStart}
            currentUserId={currentUserId}
            onClose={() => {
              for (const s of stories.slice(viewerStart)) {
                viewedRef.current.add(s.id);
              }
              setViewerOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Media tile ───────────────────────────────────────────────────────────────

function MediaTile({ msg, isMine }: { msg: DMMessage; isMine: boolean }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  if (!msg.mediaUrl) return null;
  return (
    <>
      <div
        className={`relative rounded-xl overflow-hidden max-w-[200px] cursor-pointer group ${isMine ? "rounded-br-sm" : "rounded-bl-sm"}`}
        onClick={() => msg.mediaType === "image" && setLightboxOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
        role={msg.mediaType === "image" ? "button" : undefined}
        tabIndex={msg.mediaType === "image" ? 0 : undefined}
      >
        {msg.mediaType === "video" ? (
          // biome-ignore lint/a11y/useMediaCaption: user-generated content
          <video
            src={msg.mediaUrl}
            className="w-full max-h-48 object-cover rounded-xl"
            controls
            preload="metadata"
          />
        ) : (
          <>
            <img
              src={msg.mediaUrl}
              alt="Shared media"
              className="w-full max-h-48 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
            </div>
          </>
        )}
        {msg.content && (
          <p
            className={`px-2 py-1 text-xs ${isMine ? "bg-primary/90 text-primary-foreground" : "bg-card/90 text-foreground"}`}
          >
            {msg.content}
          </p>
        )}
      </div>
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
            data-ocid="messaging.media_lightbox"
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              data-ocid="messaging.media_lightbox.close_button"
            >
              <X className="w-6 h-6" />
            </button>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: lightbox close on click */}
            <img
              src={msg.mediaUrl}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Reaction picker ──────────────────────────────────────────────────────────

function ReactionPicker({
  messageId,
  convId,
  userId,
  currentReaction,
  onClose,
  isMine,
}: {
  messageId: string;
  convId: string;
  userId: string;
  currentReaction: string | null;
  onClose: () => void;
  isMine: boolean;
}) {
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  const handle = (emoji: string) => {
    if (currentReaction === emoji)
      removeReaction.mutate({ convId, messageId, userId });
    else addReaction.mutate({ convId, messageId, emoji, userId });
    onClose();
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 4 }}
      transition={{ duration: 0.14 }}
      className={`absolute ${isMine ? "right-0" : "left-0"} bottom-full mb-2 bg-card border border-border rounded-2xl shadow-xl flex items-center gap-1 p-1.5 z-20`}
      data-ocid="messaging.reaction_picker"
    >
      {REACTION_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => handle(emoji)}
          data-ocid={`messaging.reaction_picker.${emoji}`}
          className={`w-9 h-9 text-xl rounded-full hover:bg-muted transition-all hover:scale-125 flex items-center justify-center ${currentReaction === emoji ? "bg-primary/20 ring-1 ring-primary" : ""}`}
          aria-label={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Context menu ─────────────────────────────────────────────────────────────

function MessageContextMenu({
  msg,
  isMine,
  convId,
  onClose,
  onForward,
}: {
  msg: DMMessage;
  isMine: boolean;
  convId: string;
  onClose: () => void;
  onForward: (msg: DMMessage) => void;
}) {
  const saveMessage = useSaveMessage();
  const unsave = useUnsaveMessage();
  const { data: savedIds = [] } = useGetSavedMessages();
  const isSaved = savedIds.includes(msg.id);
  type Action = {
    icon: React.ElementType;
    label: string;
    ocid: string;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
  };
  const actions: Action[] = [
    {
      icon: BookmarkCheck,
      label: isSaved ? "Unsave" : "Save",
      ocid: "messaging.context_menu.save_button",
      onClick: () => {
        if (isSaved) unsave.mutate(msg.id);
        else saveMessage.mutate(msg.id);
        toast.success(isSaved ? "Removed from saved" : "Saved!");
        onClose();
      },
    },
    {
      icon: Forward,
      label: "Forward",
      ocid: "messaging.context_menu.forward_button",
      onClick: () => {
        onForward(msg);
        onClose();
      },
    },
    {
      icon: Copy,
      label: "Copy Text",
      ocid: "messaging.context_menu.copy_button",
      disabled: !msg.content,
      onClick: () => {
        navigator.clipboard.writeText(msg.content).catch(() => {});
        toast.success("Copied!");
        onClose();
      },
    },
    {
      icon: Share2,
      label: "Share",
      ocid: "messaging.context_menu.share_button",
      onClick: () => {
        navigator.clipboard
          .writeText(
            `${window.location.origin}/messages?thread=${convId}&msg=${msg.id}`,
          )
          .catch(() => {});
        toast.success("Link copied!");
        onClose();
      },
    },
    ...(isMine
      ? [
          {
            icon: Trash2,
            label: "Delete",
            ocid: "messaging.context_menu.delete_button",
            danger: true,
            onClick: () => {
              const all = JSON.parse(
                localStorage.getItem(`cc_dm_${convId}`) ?? "[]",
              ) as DMMessage[];
              localStorage.setItem(
                `cc_dm_${convId}`,
                JSON.stringify(all.filter((m) => m.id !== msg.id)),
              );
              toast.success("Deleted");
              onClose();
            },
          },
        ]
      : [
          {
            icon: Flag,
            label: "Report",
            ocid: "messaging.context_menu.report_button",
            onClick: () => {
              toast.success("Reported");
              onClose();
            },
          },
        ]),
  ];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 4 }}
      transition={{ duration: 0.14 }}
      className={`absolute ${isMine ? "right-0" : "left-0"} top-full mt-1 bg-card border border-border rounded-2xl shadow-xl min-w-[160px] z-20 overflow-hidden`}
      data-ocid="messaging.context_menu"
    >
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          onClick={a.onClick}
          disabled={a.disabled}
          data-ocid={a.ocid}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left ${a.danger ? "text-destructive hover:bg-destructive/10" : "text-foreground"} disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <a.icon className="w-4 h-4 shrink-0" />
          {a.label}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isMine,
  participantName,
  convId,
  currentUserId,
  index,
  onForward,
}: {
  msg: DMMessage;
  isMine: boolean;
  participantName: string;
  convId: string;
  currentUserId: string;
  index: number;
  onForward: (msg: DMMessage) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  const saveMessage = useSaveMessage();
  const unsave = useUnsaveMessage();
  const { data: savedIds = [] } = useGetSavedMessages();
  const isSaved = savedIds.includes(msg.id);
  const myReaction =
    msg.reactions?.find((r) => r.userId === currentUserId)?.emoji ?? null;
  const reactionGroups: Record<string, number> = {};
  for (const r of msg.reactions ?? [])
    reactionGroups[r.emoji] = (reactionGroups[r.emoji] ?? 0) + 1;
  const statusIcon = () => {
    if (!isMine) return null;
    if (msg.status === "read" || msg.read)
      return <CheckCheck className="w-3 h-3 text-primary" />;
    if (msg.status === "delivered")
      return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
    return <Check className="w-3 h-3 text-muted-foreground" />;
  };
  useEffect(() => {
    if (!showReactions && !showMenu) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest("[data-msg-overlay]")) {
        setShowReactions(false);
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showReactions, showMenu]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex ${isMine ? "justify-end" : "justify-start"} items-end gap-2 mb-1.5 group`}
      data-ocid={`messaging.message.item.${index}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isMine && (
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px] shrink-0 mb-0.5">
          {initial(participantName)}
        </div>
      )}
      <div
        className={`flex flex-col max-w-[72%] relative ${isMine ? "items-end" : "items-start"}`}
        data-msg-overlay
      >
        <div
          className={`flex items-center gap-0.5 mb-1 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"} ${isMine ? "flex-row-reverse" : "flex-row"}`}
        >
          <button
            type="button"
            onClick={() => {
              setShowReactions((v) => !v);
              setShowMenu(false);
            }}
            className="w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-base transition-colors"
            aria-label="React"
          >
            😊
          </button>
          <button
            type="button"
            onClick={() => {
              if (isSaved) unsave.mutate(msg.id);
              else saveMessage.mutate(msg.id);
            }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isSaved ? "bg-primary/20 text-primary" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}
            aria-label={isSaved ? "Unsave" : "Save"}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-primary" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setShowMenu((v) => !v);
              setShowReactions(false);
            }}
            className="w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground transition-colors"
            aria-label="Options"
            data-ocid={`messaging.message.options.${index}`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
        <div
          className={`relative px-3 py-2 rounded-2xl text-sm leading-relaxed ${isMine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"}`}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowMenu(true);
            setShowReactions(false);
          }}
          onTouchStart={() => {
            timerRef.current = setTimeout(() => {
              setShowReactions(true);
              setShowMenu(false);
            }, 500);
          }}
          onTouchEnd={() => {
            if (timerRef.current) clearTimeout(timerRef.current);
          }}
        >
          {msg.mediaUrl ? (
            <MediaTile msg={msg} isMine={isMine} />
          ) : (
            <span className="break-words">{msg.content}</span>
          )}
        </div>
        {Object.keys(reactionGroups).length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(reactionGroups).map(([emoji, count]) => (
              <button
                key={emoji}
                type="button"
                onClick={() =>
                  myReaction === emoji
                    ? removeReaction.mutate({
                        convId,
                        messageId: msg.id,
                        userId: currentUserId,
                      })
                    : addReaction.mutate({
                        convId,
                        messageId: msg.id,
                        emoji,
                        userId: currentUserId,
                      })
                }
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-colors ${myReaction === emoji ? "bg-primary/20 border-primary/40 text-foreground" : "bg-muted border-border text-muted-foreground hover:bg-muted/80"}`}
              >
                {emoji}
                {count > 1 && <span>{count}</span>}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 mt-0.5 px-1">
          <span className="text-[9px] text-muted-foreground">
            {formatTime(msg.timestamp)}
          </span>
          {statusIcon()}
        </div>
        <AnimatePresence>
          {showReactions && (
            <ReactionPicker
              messageId={msg.id}
              convId={convId}
              userId={currentUserId}
              currentReaction={myReaction}
              isMine={isMine}
              onClose={() => setShowReactions(false)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showMenu && (
            <MessageContextMenu
              msg={msg}
              isMine={isMine}
              convId={convId}
              onClose={() => setShowMenu(false)}
              onForward={onForward}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Forward modal ────────────────────────────────────────────────────────────

function ForwardModal({
  msg,
  currentUserId,
  onClose,
}: { msg: DMMessage; currentUserId: string; onClose: () => void }) {
  const sendMsg = useSendDirectMessage();
  const [sent, setSent] = useState<string[]>([]);
  const forward = (peerId: string) => {
    sendMsg.mutate({
      convId: [currentUserId, peerId].sort().join("__"),
      senderId: currentUserId,
      receiverId: peerId,
      content: msg.mediaUrl ? "" : `↩ Forwarded: ${msg.content}`,
      ...(msg.mediaUrl
        ? { mediaUrl: msg.mediaUrl, mediaType: msg.mediaType }
        : {}),
    });
    setSent((p) => [...p, peerId]);
    toast.success("Forwarded!");
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black/60 flex items-end sm:items-center justify-center"
      onClick={onClose}
      data-ocid="messaging.forward.dialog"
    >
      <motion.div
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        exit={{ y: 30 }}
        className="bg-card rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">Forward to</h3>
          <button
            type="button"
            onClick={onClose}
            data-ocid="messaging.forward.close_button"
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          {PEER_USERS.filter((u) => u.id !== currentUserId).map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => forward(u.id)}
              disabled={sent.includes(u.id)}
              data-ocid={`messaging.forward.user.${u.id}`}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {initial(u.name)}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {u.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {u.bio}
                  </p>
                </div>
              </div>
              {sent.includes(u.id) ? (
                <Check className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Forward className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Create story modal ───────────────────────────────────────────────────────

function CreateStoryModal({
  currentUserId,
  currentUserName,
  onClose,
}: { currentUserId: string; currentUserName: string; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [caption, setCaption] = useState("");
  const createStory = useCreateStory();
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaType(file.type.startsWith("video") ? "video" : "image");
    setPreview(URL.createObjectURL(file));
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-black/70 flex items-end sm:items-center justify-center"
      onClick={onClose}
      data-ocid="messaging.create_story.dialog"
    >
      <motion.div
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        exit={{ y: 30 }}
        className="bg-card rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">
            Create Story
          </h3>
          <button
            type="button"
            onClick={onClose}
            data-ocid="messaging.create_story.close_button"
            className="text-muted-foreground hover:text-foreground p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {!preview ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            data-ocid="messaging.create_story.upload_button"
            className="w-full h-40 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
          >
            <Image className="w-8 h-8 text-primary/50" />
            <span className="text-sm text-muted-foreground">
              Select photo or video
            </span>
          </button>
        ) : (
          <div className="relative rounded-2xl overflow-hidden mb-3">
            {mediaType === "video" ? (
              // biome-ignore lint/a11y/useMediaCaption: user-generated content preview
              <video
                src={preview}
                className="w-full max-h-48 object-cover"
                controls
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-48 object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFile}
        />
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption…"
          data-ocid="messaging.create_story.caption_input"
          className="w-full bg-muted rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary mt-3"
        />
        <Button
          onClick={() => {
            if (!preview) return;
            createStory.mutate(
              {
                mediaUrl: preview,
                mediaType,
                caption: caption.trim() || undefined,
                userId: currentUserId,
                userName: currentUserName,
              },
              {
                onSuccess: () => {
                  toast.success("Story posted!");
                  onClose();
                },
              },
            );
          }}
          disabled={!preview || createStory.isPending}
          className="w-full mt-3 rounded-xl"
          data-ocid="messaging.create_story.submit_button"
        >
          {createStory.isPending ? "Posting…" : "Share Story"}
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Thread view ──────────────────────────────────────────────────────────────

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
  const [isTyping, setIsTyping] = useState(false);
  const [forwardMsg, setForwardMsg] = useState<DMMessage | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const peer = PEER_USERS.find((u) => u.id === participantId);
  const online = peer
    ? Date.now() - Number(localStorage.getItem(`cc_activity_${peer.id}`) ?? 0) <
      5 * 60_000
    : false;
  const markReadMutate = markRead.mutate;
  useEffect(() => {
    markReadMutate(convId, { onSuccess: () => onConvUpdated() });
  }, [convId, markReadMutate, onConvUpdated]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  });
  const triggerAutoReply = useCallback(() => {
    setIsTyping(true);
    setTimeout(
      () => {
        setIsTyping(false);
        const replies = [
          "That's awesome! Keep it up 🔥",
          "Haha yeah, same here!",
          "I'm working through DSA too",
          "Did you see the new problems section?",
          "Let's collab on a project!",
          "Have you tried the online test?",
        ];
        sendMsg.mutate(
          {
            convId,
            senderId: participantId,
            receiverId: currentUserId,
            content: replies[Math.floor(Math.random() * replies.length)],
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
  }, [convId, currentUserId, participantId, sendMsg, refetch, onConvUpdated]);
  const send = useCallback(
    (content: string, mediaUrl?: string, mediaType?: "image" | "video") => {
      if (!content.trim() && !mediaUrl) return;
      sendMsg.mutate(
        {
          convId,
          senderId: currentUserId,
          receiverId: participantId,
          content: content.trim(),
          mediaUrl,
          mediaType,
        },
        {
          onSuccess: () => {
            refetch();
            onConvUpdated();
            triggerAutoReply();
          },
        },
      );
      setInput("");
    },
    [
      convId,
      currentUserId,
      participantId,
      sendMsg,
      refetch,
      onConvUpdated,
      triggerAutoReply,
    ],
  );
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    send(
      "",
      URL.createObjectURL(file),
      file.type.startsWith("video") ? "video" : "image",
    );
    e.target.value = "";
  };
  const grouped: { date: string; items: DMMessage[] }[] = [];
  for (const m of msgs) {
    const label = formatDateGroup(m.timestamp);
    const last = grouped[grouped.length - 1];
    if (!last || last.date !== label) grouped.push({ date: label, items: [m] });
    else last.items.push(m);
  }
  return (
    <div className="flex flex-col h-full">
      <div className="bg-card border-b border-border px-3 py-2.5 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          data-ocid="messaging.thread.back.button"
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <UserAvatar name={participantName} online={online} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {participantName}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {isTyping ? (
              <span className="text-primary">typing…</span>
            ) : online ? (
              "Active now"
            ) : (
              `Last seen ${formatTs(Date.now() - 3 * 60 * 60_000)}`
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard
              .writeText(`${window.location.origin}/messages?thread=${convId}`)
              .catch(() => {});
            toast.success("Link copied!");
          }}
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Share"
          data-ocid="messaging.thread.share_button"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
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
              <div className="flex items-center gap-2 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground px-2 shrink-0">
                  {group.date}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              {group.items.map((m, i) => (
                <MessageBubble
                  key={m.id}
                  msg={m}
                  isMine={m.senderId === currentUserId}
                  participantName={participantName}
                  convId={convId}
                  currentUserId={currentUserId}
                  index={i + 1}
                  onForward={setForwardMsg}
                />
              ))}
            </div>
          ))}
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
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </ScrollArea>
      <div className="bg-background border-t border-border p-3 shrink-0">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-2 focus-within:border-primary/50 transition-colors max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            data-ocid="messaging.thread.media_upload_button"
            className="text-muted-foreground hover:text-primary transition-colors shrink-0"
            aria-label="Share media"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => setShowCreateStory(true)}
            data-ocid="messaging.thread.story_button"
            className="text-muted-foreground hover:text-primary transition-colors shrink-0"
            aria-label="Create story"
          >
            <Image className="w-4 h-4" />
          </button>
          <input
            data-ocid="messaging.thread.input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder={`Message ${participantName}…`}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[20px]"
          />
          <Button
            data-ocid="messaging.thread.send.button"
            onClick={() => send(input)}
            disabled={!input.trim()}
            size="sm"
            className="rounded-full w-8 h-8 p-0 bg-primary text-primary-foreground shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {forwardMsg && (
          <ForwardModal
            msg={forwardMsg}
            currentUserId={currentUserId}
            onClose={() => setForwardMsg(null)}
          />
        )}
        {showCreateStory && (
          <CreateStoryModal
            currentUserId={currentUserId}
            currentUserName="You"
            onClose={() => setShowCreateStory(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Saved messages panel ─────────────────────────────────────────────────────

function SavedMessagesPanel({ currentUserId }: { currentUserId: string }) {
  const { data: savedIds = [] } = useGetSavedMessages();
  const unsave = useUnsaveMessage();
  const savedMsgs: Array<{ msg: DMMessage; peerName: string }> = [];
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("cc_dm_"));
  for (const key of keys) {
    const convId = key.replace("cc_dm_", "");
    if (!convId.includes(currentUserId)) continue;
    const peerId = convId.split("__").find((p) => p !== currentUserId) ?? "";
    const peerName = PEER_USERS.find((u) => u.id === peerId)?.name ?? peerId;
    try {
      const msgs = JSON.parse(localStorage.getItem(key) ?? "[]") as DMMessage[];
      for (const msg of msgs) {
        if (savedIds.includes(msg.id)) savedMsgs.push({ msg, peerName });
      }
    } catch {
      /* skip */
    }
  }
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Saved Messages
          </h3>
          {savedMsgs.length > 0 && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {savedMsgs.length}
            </span>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1">
        {savedMsgs.length === 0 ? (
          <div
            className="text-center py-14 px-6"
            data-ocid="messaging.saved.empty_state"
          >
            <div className="text-4xl mb-3">🔖</div>
            <p className="text-sm font-semibold text-foreground mb-1">
              No saved messages
            </p>
            <p className="text-xs text-muted-foreground">
              Hold any message and tap the heart to save it
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {savedMsgs.map(({ msg, peerName }) => (
              <div
                key={msg.id}
                className="bg-card border border-border rounded-2xl p-3 flex gap-3 items-start"
                data-ocid={`messaging.saved.item.${msg.id}`}
              >
                {msg.mediaUrl && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    {msg.mediaType === "video" ? (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Video className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ) : (
                      <img
                        src={msg.mediaUrl}
                        alt="Saved"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">
                    From{" "}
                    <span className="text-foreground font-medium">
                      {peerName}
                    </span>{" "}
                    · {formatTs(msg.timestamp)}
                  </p>
                  {msg.content && (
                    <p className="text-sm text-foreground break-words line-clamp-3">
                      {msg.content}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => unsave.mutate(msg.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                  aria-label="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ─── Conversation row ─────────────────────────────────────────────────────────

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
  const { data: stories = [] } = useGetActiveStories();
  const hasStory = stories.some((s) => s.userId === conv.participantId);
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`messaging.conversation.item.${index}`}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${active ? "bg-primary/10 border-l-2 border-primary" : "border-l-2 border-transparent"}`}
    >
      <UserAvatar
        name={conv.participantName}
        online={online}
        hasStory={hasStory}
      />
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

// ─── New message modal ────────────────────────────────────────────────────────

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
              key={u.id}
              type="button"
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

// ─── Main MessagingSystem component ──────────────────────────────────────────

type InboxTab = "messages" | "saved";

interface MessagingSystemProps {
  onClose: () => void;
  /** Pre-open a conversation with this user ID on mount */
  initialUserId?: string;
  /** Display name for the pre-opened user */
  initialUserName?: string;
}

export default function MessagingSystem({
  onClose,
  initialUserId,
  initialUserName,
}: MessagingSystemProps) {
  const { user } = useApp();
  const currentUserId = user.deviceId || "local_user";
  const { data: conversations = [], refetch: refetchConvs } =
    useGetConversations(currentUserId);
  const markRead = useMarkMessagesRead();
  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    if (initialUserId) return [currentUserId, initialUserId].sort().join("__");
    return null;
  });
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(
    initialUserId ?? null,
  );
  const [activeParticipantName, setActiveParticipantName] = useState<
    string | null
  >(initialUserName ?? null);
  const [search, setSearch] = useState("");
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [inboxTab, setInboxTab] = useState<InboxTab>("messages");
  const [showCreateStory, setShowCreateStory] = useState(false);
  useEffect(() => {
    const t = setInterval(() => refetchConvs(), 5_000);
    return () => clearInterval(t);
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
    setShowNewMsg(false);
    openConv([currentUserId, userId].sort().join("__"), userId, userName);
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
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close messaging"
      />
      <div
        className="relative bg-background border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-[420px] h-[88dvh] sm:h-[640px] flex flex-col overflow-hidden"
        data-ocid="messaging.panel"
      >
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
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              data-ocid="messaging.close.button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex bg-card border-b border-border shrink-0">
          <button
            type="button"
            onClick={() => setInboxTab("messages")}
            data-ocid="messaging.tab.messages"
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${inboxTab === "messages" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chats
          </button>
          <button
            type="button"
            onClick={() => setInboxTab("saved")}
            data-ocid="messaging.tab.saved"
            className={`flex-1 py-2.5 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${inboxTab === "saved" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            Saved
          </button>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden relative">
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
          {inboxTab === "saved" ? (
            <SavedMessagesPanel currentUserId={currentUserId} />
          ) : (
            <>
              <StoriesBar
                currentUserId={currentUserId}
                onCreateStory={() => setShowCreateStory(true)}
              />
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
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showCreateStory && (
          <CreateStoryModal
            currentUserId={currentUserId}
            currentUserName="You"
            onClose={() => setShowCreateStory(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Hook: total unread count for nav badge ────────────────────────────────────

export function useMessagingUnreadCount(currentUserId: string): number {
  const { data } = useGetUnreadCount(currentUserId);
  return data ?? 0;
}
