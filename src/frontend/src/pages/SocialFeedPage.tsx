import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Heart,
  Link,
  MessageCircle,
  PlusCircle,
  Send,
  Share2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import {
  INTERVIEW_EXPERIENCES,
  type InterviewExperience,
} from "../data/interviewExperiences";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  replies?: Comment[];
}

interface CommunityPost {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  reactions: Record<string, number>;
  userReacted?: string;
}

// ─── localStorage helpers ────────────────────────────────────────────────────

function getComments(expId: string): Comment[] {
  try {
    return JSON.parse(localStorage.getItem(`cc_comments_${expId}`) ?? "[]");
  } catch {
    return [];
  }
}

function saveComments(expId: string, comments: Comment[]) {
  localStorage.setItem(`cc_comments_${expId}`, JSON.stringify(comments));
}

function getCommunityPosts(): CommunityPost[] {
  try {
    return JSON.parse(localStorage.getItem("cc_community_posts") ?? "[]");
  } catch {
    return [];
  }
}

function saveCommunityPosts(posts: CommunityPost[]) {
  localStorage.setItem("cc_community_posts", JSON.stringify(posts));
}

function getLikeCount(expId: string): number {
  try {
    const stored = localStorage.getItem(`cc_exp_likes_${expId}`);
    if (stored !== null) return Number(stored);
    const count = Math.floor(Math.random() * 40) + 5;
    localStorage.setItem(`cc_exp_likes_${expId}`, String(count));
    return count;
  } catch {
    return 0;
  }
}

function setLikeCount(expId: string, count: number) {
  localStorage.setItem(`cc_exp_likes_${expId}`, String(count));
}

function hasLiked(expId: string): boolean {
  return localStorage.getItem(`cc_exp_liked_${expId}`) === "1";
}

function getExpReactions(expId: string): {
  reactions: Record<string, number>;
  userReacted: string | null;
} {
  try {
    const reactions = JSON.parse(
      localStorage.getItem(`cc_exp_reactions_${expId}`) ??
        '{"👍":0,"💪":0,"🔥":0,"❤️":0,"🎉":0}',
    );
    const userReacted = localStorage.getItem(`cc_exp_userreact_${expId}`);
    return { reactions, userReacted };
  } catch {
    return {
      reactions: { "👍": 0, "💪": 0, "🔥": 0, "❤️": 0, "🎉": 0 },
      userReacted: null,
    };
  }
}

// ─── Constants ───────────────────────────────────────────────────────────────

const OUTCOME_STYLES: Record<
  InterviewExperience["outcome"],
  { label: string; cls: string }
> = {
  selected: {
    label: "✅ Selected",
    cls: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  rejected: {
    label: "❌ Rejected",
    cls: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  },
  pending: {
    label: "⏳ Pending",
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  },
};

const DIFF_STYLES: Record<string, string> = {
  easy: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  medium:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  hard: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

const EMOJI_REACTIONS = ["👍", "💪", "🔥", "❤️", "🎉"];
const PAGE_SIZE = 5;
const WALL_PAGE_SIZE = 5;

// ─── Submit Experience Modal ──────────────────────────────────────────────────

function SubmitExperienceModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: localStorage.getItem("cc_username") ?? "",
    company: "",
    role: "",
    rounds: "3",
    difficulty: "medium",
    outcome: "selected",
    text: "",
    tips: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.company.trim() || !form.text.trim()) {
      toast.error("Please fill in Name, Company, and Experience");
      return;
    }
    const existing = JSON.parse(
      localStorage.getItem("cc_user_experiences") ?? "[]",
    );
    const newExp = {
      id: `user_${Date.now()}`,
      authorName: form.name.trim(),
      company: form.company.trim(),
      logo: "🏢",
      role: form.role.trim() || "Software Engineer",
      rounds: Number.parseInt(form.rounds) || 3,
      difficulty: form.difficulty,
      outcome: form.outcome,
      date: new Date().toISOString().slice(0, 7),
      experienceText: form.text.trim(),
      tags: ["Interview"],
      tips: form.tips
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    localStorage.setItem(
      "cc_user_experiences",
      JSON.stringify([newExp, ...existing]),
    );
    if (form.name.trim()) localStorage.setItem("cc_username", form.name.trim());
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        data-ocid="submit_exp.dialog"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground text-base">
            Share Your Interview Experience
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
            data-ocid="submit_exp.close_button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div
            className="px-5 py-10 text-center"
            data-ocid="submit_exp.success_state"
          >
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-bold text-foreground text-lg mb-1">
              Experience Submitted!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Thanks for helping the community prepare for interviews.
            </p>
            <Button
              onClick={onClose}
              className="rounded-full"
              data-ocid="submit_exp.confirm_button"
            >
              Back to Feed
            </Button>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="exp-name"
                  className="text-xs font-semibold text-muted-foreground mb-1 block"
                >
                  Your Name *
                </label>
                <Input
                  id="exp-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Priya S."
                  className="text-sm"
                  data-ocid="submit_exp.name_input"
                />
              </div>
              <div>
                <label
                  htmlFor="exp-company"
                  className="text-xs font-semibold text-muted-foreground mb-1 block"
                >
                  Company *
                </label>
                <Input
                  id="exp-company"
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                  placeholder="e.g. Google"
                  className="text-sm"
                  data-ocid="submit_exp.company_input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="exp-role"
                  className="text-xs font-semibold text-muted-foreground mb-1 block"
                >
                  Role
                </label>
                <Input
                  id="exp-role"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  placeholder="e.g. SDE Intern"
                  className="text-sm"
                  data-ocid="submit_exp.role_input"
                />
              </div>
              <div>
                <label
                  htmlFor="exp-rounds"
                  className="text-xs font-semibold text-muted-foreground mb-1 block"
                >
                  Rounds
                </label>
                <select
                  id="exp-rounds"
                  value={form.rounds}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, rounds: e.target.value }))
                  }
                  className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  data-ocid="submit_exp.rounds_select"
                >
                  {["1", "2", "3", "4", "5", "6"].map((n) => (
                    <option key={n} value={n}>
                      {n} rounds
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="exp-difficulty"
                  className="text-xs font-semibold text-muted-foreground mb-1 block"
                >
                  Difficulty
                </label>
                <select
                  id="exp-difficulty"
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, difficulty: e.target.value }))
                  }
                  className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  data-ocid="submit_exp.difficulty_select"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="exp-outcome"
                  className="text-xs font-semibold text-muted-foreground mb-1 block"
                >
                  Outcome
                </label>
                <select
                  id="exp-outcome"
                  value={form.outcome}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, outcome: e.target.value }))
                  }
                  className="w-full text-sm bg-muted border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  data-ocid="submit_exp.outcome_select"
                >
                  <option value="selected">Selected ✅</option>
                  <option value="rejected">Rejected ❌</option>
                  <option value="pending">Pending ⏳</option>
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="exp-text"
                className="text-xs font-semibold text-muted-foreground mb-1 block"
              >
                Your Experience *
              </label>
              <Textarea
                id="exp-text"
                value={form.text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, text: e.target.value }))
                }
                placeholder="Describe the interview process, what was asked, how you performed…"
                rows={4}
                className="resize-none text-sm"
                data-ocid="submit_exp.text_textarea"
              />
            </div>
            <div>
              <label
                htmlFor="exp-tips"
                className="text-xs font-semibold text-muted-foreground mb-1 block"
              >
                Tips (one per line)
              </label>
              <Textarea
                id="exp-tips"
                value={form.tips}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tips: e.target.value }))
                }
                placeholder="Tip 1&#10;Tip 2&#10;Tip 3"
                rows={3}
                className="resize-none text-sm"
                data-ocid="submit_exp.tips_textarea"
              />
            </div>
            <div className="flex gap-2 pt-1 pb-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-full"
                data-ocid="submit_exp.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 rounded-full"
                data-ocid="submit_exp.submit_button"
              >
                <Send className="w-4 h-4 mr-1.5" /> Submit
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Comment Thread ───────────────────────────────────────────────────────────

function CommentThread({ expId }: { expId: string }) {
  const [comments, setComments] = useState<Comment[]>(() => getComments(expId));
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [authorName, setAuthorName] = useState(
    () => localStorage.getItem("cc_username") ?? "",
  );

  const handlePost = () => {
    const text = newComment.trim();
    if (!text) return;
    const author = authorName.trim() || "Anonymous";
    const comment: Comment = {
      id: `${expId}_${Date.now()}`,
      author,
      text,
      timestamp: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      replies: [],
    };
    const updated = [...comments, comment];
    setComments(updated);
    saveComments(expId, updated);
    setNewComment("");
    if (authorName.trim())
      localStorage.setItem("cc_username", authorName.trim());
  };

  const handleReply = (commentId: string) => {
    const text = replyText.trim();
    if (!text) return;
    const author = authorName.trim() || "Anonymous";
    const reply: Comment = {
      id: `reply_${Date.now()}`,
      author,
      text,
      timestamp: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = comments.map((c) =>
      c.id === commentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c,
    );
    setComments(updated);
    saveComments(expId, updated);
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      {comments.length > 0 && (
        <div className="space-y-3 mb-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px] shrink-0 mt-0.5">
                {c.author[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-foreground">
                    {c.author}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {c.timestamp}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 break-words leading-relaxed">
                  {c.text}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setReplyingTo(replyingTo === c.id ? null : c.id)
                  }
                  className="text-[10px] text-primary/70 hover:text-primary font-semibold mt-1 transition-colors"
                >
                  Reply
                </button>
                {/* Nested replies */}
                {(c.replies ?? []).length > 0 && (
                  <div className="mt-2 space-y-2 pl-3 border-l-2 border-border/50">
                    {(c.replies ?? []).map((r) => (
                      <div key={r.id} className="flex gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-accent border border-border flex items-center justify-center text-[9px] font-bold text-foreground shrink-0">
                          {r.author[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] font-semibold text-foreground">
                              {r.author}
                            </span>
                            <span className="text-[9px] text-muted-foreground">
                              {r.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-foreground/80 break-words leading-relaxed">
                            {r.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Reply input */}
                {replyingTo === c.id && (
                  <div className="flex gap-1.5 mt-2">
                    <input
                      type="text"
                      placeholder="Write a reply…"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleReply(c.id)}
                      className="flex-1 min-w-0 text-xs bg-muted border border-border rounded-lg px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                      data-ocid={`comments.reply_input.${c.id}`}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleReply(c.id)}
                      disabled={!replyText.trim()}
                      className="h-7 px-2.5 rounded-lg text-xs shrink-0"
                    >
                      <Send className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New comment composer */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full text-xs bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          data-ocid={`comments.name_input.${expId}`}
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePost()}
            className="flex-1 min-w-0 text-xs bg-muted border border-border rounded-lg px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            data-ocid={`comments.text_input.${expId}`}
          />
          <Button
            size="sm"
            onClick={handlePost}
            disabled={!newComment.trim()}
            className="h-8 px-3 rounded-lg text-xs shrink-0"
            data-ocid={`comments.post_button.${expId}`}
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Experience Card ──────────────────────────────────────────────────────────

function ExperienceCard({
  exp,
  onAuthorClick,
}: {
  exp: InterviewExperience;
  onAuthorClick?: (name: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(() => hasLiked(exp.id));
  const [likeCount, setLikeCountState] = useState(() => getLikeCount(exp.id));
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(
    () => getComments(exp.id).length,
  );
  const [{ reactions, userReacted }, setReactionState] = useState(() =>
    getExpReactions(exp.id),
  );

  const excerpt = exp.experienceText.slice(0, 200);
  const hasMore = exp.experienceText.length > 200;
  const outcomeStyle = OUTCOME_STYLES[exp.outcome];
  const diffStyle = DIFF_STYLES[exp.difficulty] ?? DIFF_STYLES.medium;

  const handleLike = () => {
    if (liked) return;
    const next = likeCount + 1;
    setLikeCountState(next);
    setLiked(true);
    setLikeCount(exp.id, next);
    localStorage.setItem(`cc_exp_liked_${exp.id}`, "1");
  };

  const handleReact = (emoji: string) => {
    if (userReacted) return;
    const updated = { ...reactions, [emoji]: (reactions[emoji] ?? 0) + 1 };
    localStorage.setItem(`cc_exp_reactions_${exp.id}`, JSON.stringify(updated));
    localStorage.setItem(`cc_exp_userreact_${exp.id}`, emoji);
    setReactionState({ reactions: updated, userReacted: emoji });
  };

  const handleShare = () => {
    const url = `${window.location.origin}#exp=${encodeURIComponent(exp.id)}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.info(`Share: ${url}`));
  };

  const initials = exp.authorName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm"
      data-ocid={`feed.card.${exp.id}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <button
          type="button"
          onClick={() => onAuthorClick?.(exp.authorName)}
          className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-extrabold text-sm shrink-0 hover:bg-primary/20 transition-colors"
          aria-label={`View ${exp.authorName}'s profile`}
        >
          {initials}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onAuthorClick?.(exp.authorName)}
              className="font-bold text-foreground text-sm hover:text-primary transition-colors"
              data-ocid={`feed.author_link.${exp.id}`}
            >
              {exp.authorName}
            </button>
            <span className="text-xs text-muted-foreground">
              {exp.date
                ? new Date(`${exp.date}-01`).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-foreground">
              {exp.logo} {exp.company}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground truncate">
              {exp.role}
            </span>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${outcomeStyle.cls}`}
        >
          {outcomeStyle.label}
        </span>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${diffStyle}`}
        >
          {exp.difficulty.charAt(0).toUpperCase() + exp.difficulty.slice(1)}
        </span>
        <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
          {exp.rounds} rounds
        </span>
        {exp.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[11px] text-primary/80 bg-primary/5 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Experience text */}
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-2">
        {expanded ? exp.experienceText : excerpt}
        {!expanded && hasMore && (
          <span className="text-muted-foreground">…</span>
        )}
      </p>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-primary font-semibold mb-3 hover:text-primary/80 transition-colors"
          data-ocid={`feed.expand.${exp.id}`}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> View full
            </>
          )}
        </button>
      )}

      {/* Tips (shown when expanded) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 mb-3 overflow-hidden"
          >
            <p className="text-xs font-bold text-primary mb-2">💡 Top Tips</p>
            <ul className="space-y-1.5">
              {exp.tips.map((tip, i) => (
                <li
                  key={i}
                  className="text-xs text-foreground/80 flex items-start gap-1.5"
                >
                  <span className="text-primary font-bold shrink-0 mt-px">
                    {i + 1}.
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji reactions bar */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {EMOJI_REACTIONS.map((emoji) => {
          const count = reactions[emoji] ?? 0;
          const isReacted = userReacted === emoji;
          return (
            <button
              type="button"
              key={emoji}
              onClick={() => handleReact(emoji)}
              disabled={!!userReacted}
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all ${
                isReacted
                  ? "bg-primary/15 border-primary/30 text-primary font-semibold scale-110"
                  : "bg-muted border-border text-muted-foreground hover:border-primary/30 hover:text-primary disabled:opacity-50"
              }`}
              aria-label={`React with ${emoji}`}
              data-ocid={`feed.react_${emoji.codePointAt(0)}.${exp.id}`}
            >
              <span>{emoji}</span>
              {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/50">
        <button
          type="button"
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            liked
              ? "text-red-500 cursor-default"
              : "text-muted-foreground hover:text-red-500"
          }`}
          data-ocid={`feed.like.${exp.id}`}
          aria-label={liked ? "Liked" : "Like this experience"}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500" : ""}`} />
          {likeCount}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowComments((v) => !v);
            setCommentCount(getComments(exp.id).length);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          data-ocid={`feed.comments_toggle.${exp.id}`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{commentCount}</span>
          {showComments ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors ml-auto"
          data-ocid={`feed.share.${exp.id}`}
          aria-label="Share experience"
        >
          <Link className="w-3.5 h-3.5" />
          Share
        </button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <CommentThread expId={exp.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Community Wall ───────────────────────────────────────────────────────────

function CommunityWall() {
  const [posts, setPosts] = useState<CommunityPost[]>(() =>
    getCommunityPosts(),
  );
  const [postText, setPostText] = useState("");
  const [postAuthor, setPostAuthor] = useState(
    () => localStorage.getItem("cc_username") ?? "",
  );
  const [visibleCount, setVisibleCount] = useState(WALL_PAGE_SIZE);

  const handlePost = () => {
    const text = postText.trim();
    if (!text) return;
    const author = postAuthor.trim() || "Anonymous";
    const post: CommunityPost = {
      id: `post_${Date.now()}`,
      author,
      text,
      timestamp: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      reactions: { "👍": 0, "💪": 0, "🔥": 0, "❤️": 0, "🎉": 0 },
    };
    const updated = [post, ...posts];
    setPosts(updated);
    saveCommunityPosts(updated);
    setPostText("");
    if (postAuthor.trim())
      localStorage.setItem("cc_username", postAuthor.trim());
  };

  const handleReact = (postId: string, emoji: string) => {
    const reactedKey = `cc_post_reacted_${postId}`;
    if (localStorage.getItem(reactedKey)) return;
    const updated = posts.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        reactions: {
          ...p.reactions,
          [emoji]: (p.reactions[emoji] ?? 0) + 1,
        },
        userReacted: emoji,
      };
    });
    setPosts(updated);
    saveCommunityPosts(updated);
    localStorage.setItem(reactedKey, emoji);
  };

  const visible = posts.slice(0, visibleCount);
  const hasMore = visibleCount < posts.length;

  return (
    <div className="space-y-4">
      {/* Post composer */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <p className="text-sm font-bold text-foreground">
          💬 Share something with the community
        </p>
        <input
          type="text"
          placeholder="Your name (optional)"
          value={postAuthor}
          onChange={(e) => setPostAuthor(e.target.value)}
          className="w-full text-sm bg-muted border border-border rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          data-ocid="wall.author_input"
        />
        <Textarea
          placeholder="What's on your mind? Share study tips, achievements, questions…"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          rows={3}
          className="resize-none text-sm bg-muted border-border rounded-xl"
          data-ocid="wall.post_textarea"
        />
        <div className="flex justify-end">
          <Button
            onClick={handlePost}
            disabled={!postText.trim()}
            className="rounded-xl gap-2 text-sm"
            data-ocid="wall.post_button"
          >
            <Send className="w-3.5 h-3.5" /> Post
          </Button>
        </div>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-12" data-ocid="wall.empty_state">
          <p className="text-3xl mb-2">🌱</p>
          <p className="font-semibold text-foreground text-sm">
            Be the first to post!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Share tips, wins, or questions with the community.
          </p>
        </div>
      )}

      {visible.map((post, i) => {
        const userReacted = localStorage.getItem(`cc_post_reacted_${post.id}`);
        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card border border-border rounded-2xl p-4"
            data-ocid={`wall.post.${i + 1}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {post.author[0]?.toUpperCase() ?? "A"}
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">
                  {post.author}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {post.timestamp}
                </span>
              </div>
            </div>

            <p className="text-sm text-foreground leading-relaxed break-words mb-3">
              {post.text}
            </p>

            <div className="flex flex-wrap gap-2">
              {EMOJI_REACTIONS.map((emoji) => {
                const count = post.reactions[emoji] ?? 0;
                const isReacted = userReacted === emoji;
                return (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => handleReact(post.id, emoji)}
                    disabled={!!userReacted}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all ${
                      isReacted
                        ? "bg-primary/15 border-primary/30 text-primary font-semibold"
                        : "bg-muted border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                    }`}
                    data-ocid={`wall.react_${emoji.codePointAt(0)}.${i + 1}`}
                    aria-label={`React with ${emoji}`}
                  >
                    <span>{emoji}</span>
                    {count > 0 && <span>{count}</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + WALL_PAGE_SIZE)}
            className="rounded-full gap-2 text-sm"
            data-ocid="wall.load_more_button"
          >
            <TrendingUp className="w-4 h-4" />
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = "experiences" | "wall";

export default function SocialFeedPage() {
  const { setPage } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("experiences");
  const [pageNum, setPageNum] = useState(1);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [expRefreshToken, setExpRefreshToken] = useState(0);

  const followingList = useMemo<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("followingList") ?? "[]");
    } catch {
      return [];
    }
  }, []);

  // Re-read user experiences when modal closes (expRefreshToken bumped on close)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userExperiences = useMemo(() => {
    void expRefreshToken; // intentional dependency for refresh
    try {
      return JSON.parse(localStorage.getItem("cc_user_experiences") ?? "[]");
    } catch {
      return [];
    }
  }, [expRefreshToken]);

  const allExperiences = useMemo(
    () => [...userExperiences, ...INTERVIEW_EXPERIENCES],
    [userExperiences],
  );

  const matchingExps = useMemo(() => {
    if (followingList.length === 0) return allExperiences;
    const filtered = allExperiences.filter((e) =>
      followingList.some((u) => u.toLowerCase() === e.authorName.toLowerCase()),
    );
    return filtered.length > 0 ? filtered : allExperiences;
  }, [followingList, allExperiences]);

  const showingAll =
    followingList.length === 0 ||
    !allExperiences.some((e) =>
      followingList.some((u) => u.toLowerCase() === e.authorName.toLowerCase()),
    );

  const sorted = useMemo(
    () =>
      [...matchingExps].sort((a, b) =>
        (b.date ?? "").localeCompare(a.date ?? ""),
      ),
    [matchingExps],
  );

  const visible = sorted.slice(0, pageNum * PAGE_SIZE);
  const hasMore = visible.length < sorted.length;

  const switchTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setPageNum(1);
  }, []);

  const handleAuthorClick = (authorName: string) => {
    localStorage.setItem("cc_viewingUser", authorName);
    setPage("profile");
  };

  return (
    <div
      className="h-screen bg-background flex flex-col overflow-hidden"
      data-ocid="feed.page"
    >
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPage("dashboard")}
          className="rounded-xl text-foreground shrink-0"
          data-ocid="feed.back_button"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-foreground text-base">Social Feed</h1>
          <p className="text-xs text-muted-foreground">
            Community · Interview Experiences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-full border border-border">
            <Users className="w-3.5 h-3.5" />
            {followingList.length} following
          </div>
          <Button
            size="sm"
            onClick={() => setShowSubmitModal(true)}
            className="rounded-full gap-1.5 text-xs"
            data-ocid="feed.share_experience_button"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share Experience</span>
            <span className="sm:hidden">Share</span>
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-card border-b border-border px-4 flex gap-1 shrink-0">
        <button
          type="button"
          onClick={() => switchTab("experiences")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "experiences"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="feed.experiences_tab"
        >
          Interview Experiences
        </button>
        <button
          type="button"
          onClick={() => switchTab("wall")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "wall"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          data-ocid="feed.wall_tab"
        >
          Community Wall
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-24 space-y-4">
          {/* Interview Experiences Tab */}
          {activeTab === "experiences" && (
            <>
              {/* Share button for mobile */}
              <Button
                variant="outline"
                onClick={() => setShowSubmitModal(true)}
                className="w-full rounded-xl gap-2 text-sm border-dashed border-primary/30 text-primary hover:bg-primary/5 sm:hidden"
                data-ocid="feed.share_exp_mobile_button"
              >
                <Share2 className="w-4 h-4" />
                Share Your Interview Experience
              </Button>

              {showingAll && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-start gap-2.5"
                  data-ocid="feed.hint_banner"
                >
                  <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    <strong className="text-primary">Follow users</strong> from
                    the Leaderboard to see their experiences here — showing all
                    experiences for now.
                  </p>
                </motion.div>
              )}

              {visible.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  onAuthorClick={handleAuthorClick}
                />
              ))}

              {hasMore && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setPageNum((p) => p + 1)}
                    className="rounded-full gap-2"
                    data-ocid="feed.load_more_button"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Load More Experiences
                  </Button>
                </div>
              )}

              {visible.length === 0 && (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="feed.empty_state"
                >
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold text-foreground">
                    No experiences found
                  </p>
                  <p className="text-sm mt-1">Be the first to share yours!</p>
                  <Button
                    className="mt-4 rounded-full gap-2"
                    onClick={() => setShowSubmitModal(true)}
                    data-ocid="feed.empty_share_button"
                  >
                    <PlusCircle className="w-4 h-4" /> Share Your Experience
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Community Wall Tab */}
          {activeTab === "wall" && <CommunityWall />}
        </div>
      </div>

      {/* Submit Experience Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <SubmitExperienceModal
            onClose={() => {
              setShowSubmitModal(false);
              setExpRefreshToken((t) => t + 1);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
