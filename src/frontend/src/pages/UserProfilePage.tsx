import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  Code,
  FileText,
  Grid3X3,
  Lock,
  MessageSquare,
  Pencil,
  Share2,
  Trophy,
  UserMinus,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import WhatsAppAvatar, {
  DEFAULT_AVATAR_CONFIG,
} from "../components/WhatsAppAvatar";
import { useApp } from "../context/AppContext";
import { CODING_PROBLEMS } from "../data/problems";

// ─── Constants ────────────────────────────────────────────────────────────────

const BADGE_META: Record<
  string,
  {
    icon: string;
    label: string;
    desc: string;
    color: string;
    unlockDate?: string;
  }
> = {
  "first-problem": {
    icon: "🚀",
    label: "First Steps",
    desc: "Solved your first problem",
    color: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
    unlockDate: "Jan 2026",
  },
  "streak-7": {
    icon: "🔥",
    label: "Week Warrior",
    desc: "7-day study streak",
    color:
      "from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400",
    unlockDate: "Feb 2026",
  },
  "code-master": {
    icon: "💻",
    label: "Code Master",
    desc: "Solved 25+ problems",
    color:
      "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
    unlockDate: "Mar 2026",
  },
  "love-call": {
    icon: "💖",
    label: "Love Call",
    desc: "First companion interaction",
    color: "from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400",
    unlockDate: "Jan 2026",
  },
  "hot-streak": {
    icon: "⚡",
    label: "Hot Streak",
    desc: "15-day streak achieved",
    color:
      "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400",
    unlockDate: "Apr 2026",
  },
  century: {
    icon: "💯",
    label: "Century",
    desc: "Solved 100 problems",
    color:
      "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
    unlockDate: "May 2026",
  },
  enrolled: {
    icon: "📚",
    label: "Scholar",
    desc: "Enrolled in a course",
    color: "from-teal-500/20 to-teal-600/20 border-teal-500/30 text-teal-400",
    unlockDate: "Jan 2026",
  },
  speedster: {
    icon: "🏎️",
    label: "Speedster",
    desc: "Solved 3 problems in a day",
    color: "from-red-500/20 to-red-600/20 border-red-500/30 text-red-400",
    unlockDate: "Feb 2026",
  },
};

const ALL_BADGES = Object.keys(BADGE_META);

const DOMAIN_META: Record<string, { icon: string; label: string }> = {
  frontend: { icon: "🌐", label: "Frontend Dev" },
  backend: { icon: "⚙️", label: "Backend Dev" },
  python: { icon: "🐍", label: "Python" },
  java: { icon: "☕", label: "Java" },
  "data-science": { icon: "📊", label: "Data Science" },
  ml: { icon: "🤖", label: "ML / AI" },
  "c-programming": { icon: "🔧", label: "Programming in C" },
  devops: { icon: "🚢", label: "DevOps" },
  cybersecurity: { icon: "🔐", label: "Cybersecurity" },
  cloud: { icon: "☁️", label: "Cloud" },
  android: { icon: "📱", label: "Android" },
  ios: { icon: "🍎", label: "iOS Dev" },
  blockchain: { icon: "⛓️", label: "Blockchain" },
  "game-dev": { icon: "🎮", label: "Game Dev" },
  "ui-ux": { icon: "🎨", label: "UI/UX Design" },
  "full-stack": { icon: "🏗️", label: "Full Stack" },
};

const DIFF_COLORS = {
  Easy: "bg-green-500/15 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

const POST_GRADIENTS = [
  "from-blue-600 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-violet-600 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-green-500 to-emerald-600",
  "from-red-500 to-pink-600",
];

const SIMULATED_XP_POOL = [
  4800, 4200, 3900, 3600, 3400, 3100, 2900, 2700, 2500, 2300, 2100, 1900, 1750,
  1600, 1450, 1300, 1200, 1100, 1000, 950, 900, 850, 780, 720, 680, 620, 580,
  520, 480, 440, 400, 370, 340, 310, 280, 250, 230, 210, 190, 170,
];

function calcPercentile(xp: number): number {
  const total = SIMULATED_XP_POOL.length + 1;
  const above = SIMULATED_XP_POOL.filter((v) => v > xp).length;
  return Math.max(1, Math.min(99, Math.round(((total - above) / total) * 100)));
}

function deterministicCount(seed: string, max: number, min = 10): number {
  const hash = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (hash % (max - min)) + min;
}

function getCourseProgress(courseId: string): number {
  try {
    const val = localStorage.getItem(`cc_course_progress_${courseId}`);
    if (val !== null) return Math.min(100, Math.max(0, Number(val)));
    return deterministicCount(courseId, 90, 10);
  } catch {
    return 0;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileTab = "posts" | "solved" | "badges" | "notes";

interface HighlightItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

interface PostItem {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  diffColor?: string;
  icon?: string;
  type: "achievement" | "photo" | "solved";
  date?: string;
}

// ─── Story Highlight Viewer ───────────────────────────────────────────────────

function HighlightViewer({
  category,
  items,
  onClose,
}: {
  category: { icon: string; title: string };
  items: HighlightItem[];
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DURATION = 4000;

  const advance = useCallback(() => {
    setIdx((i) => {
      if (i >= items.length - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
  }, [items.length, onClose]);

  useMemo(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(advance, DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advance]);

  const current = items[idx];

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="profile.highlight_viewer.dialog"
      onClick={onClose}
    >
      <div className="absolute top-0 left-0 right-0 flex gap-1 px-3 pt-3 z-10">
        {items.map((_, i) => (
          <div
            key={`seg-${i}`}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            {i < idx && <div className="h-full bg-white w-full" />}
            {i === idx && (
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: DURATION / 1000, ease: "linear" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay click-stop */}
      <div
        className="absolute top-6 left-4 right-4 flex items-center gap-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">
          {category.icon}
        </div>
        <span className="text-white font-bold text-sm">{category.title}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-white/80 hover:text-white"
          data-ocid="profile.highlight_viewer.close_button"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {current ? (
        <motion.div
          key={current.id}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm mx-4 bg-card border border-border rounded-2xl p-6 text-center shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-5xl mb-4">{current.icon}</div>
          <h3 className="font-extrabold text-foreground text-lg mb-1">
            {current.title}
          </h3>
          <p className="text-muted-foreground text-sm">{current.subtitle}</p>
        </motion.div>
      ) : (
        <div className="text-muted-foreground text-sm">Nothing here yet</div>
      )}

      <button
        type="button"
        className="absolute left-0 top-0 bottom-0 w-1/3 z-20"
        onClick={(e) => {
          e.stopPropagation();
          setIdx((i) => Math.max(0, i - 1));
        }}
        aria-label="Previous story"
      />
      <button
        type="button"
        className="absolute right-0 top-0 bottom-0 w-1/3 z-20"
        onClick={(e) => {
          e.stopPropagation();
          advance();
        }}
        aria-label="Next story"
      />

      <div className="absolute bottom-8 text-white/50 text-xs">
        {idx + 1} / {items.length}
      </div>
    </motion.div>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

function EditProfileModal({
  user,
  onSave,
  onClose,
}: {
  user: { username: string; email: string };
  onSave: (data: {
    username: string;
    bio: string;
    displayName: string;
  }) => void;
  onClose: () => void;
}) {
  const [displayName, setDisplayName] = useState(user.username);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(
    () =>
      localStorage.getItem("cc_profile_bio") ??
      "CS enthusiast 💻 | Learning every day 🚀",
  );

  const handleSave = () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    onSave({
      username: username.trim(),
      bio: bio.trim(),
      displayName: displayName.trim(),
    });
    localStorage.setItem("cc_profile_bio", bio.trim());
    toast.success("Profile updated! ✨");
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="profile.edit_modal.dialog"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground text-base">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="profile.edit_modal.close_button"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label
              htmlFor="edit-display-name"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
            >
              Display Name
            </label>
            <input
              id="edit-display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Your display name"
              data-ocid="profile.edit_modal.display_name_input"
            />
          </div>
          <div>
            <label
              htmlFor="edit-username"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
            >
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                @
              </span>
              <input
                id="edit-username"
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/\s/g, "").toLowerCase())
                }
                className="w-full bg-muted border border-border rounded-xl pl-7 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="username"
                data-ocid="profile.edit_modal.username_input"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="edit-bio"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
            >
              Bio
            </label>
            <textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={150}
              className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Tell others about yourself..."
              data-ocid="profile.edit_modal.bio_textarea"
            />
            <div className="text-right text-xs text-muted-foreground mt-1">
              {bio.length}/150
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onClose}
            data-ocid="profile.edit_modal.cancel_button"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl"
            onClick={handleSave}
            data-ocid="profile.edit_modal.save_button"
          >
            Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Note Detail Modal ────────────────────────────────────────────────────────

function NoteModal({
  note,
  onClose,
}: {
  note: { title: string; content: string; topic: string; date: string };
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-ocid="profile.note_modal.dialog"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h3 className="font-bold text-foreground">{note.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {note.topic} · {note.date}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="profile.note_modal.close_button"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Post Grid Item ───────────────────────────────────────────────────────────

function PostGridItem({
  post,
  index,
  onClick,
}: {
  post: PostItem;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      className="relative aspect-square rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={`profile.post_grid.item.${index + 1}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        {post.icon && <div className="text-2xl mb-1">{post.icon}</div>}
        <div className="text-white text-[10px] font-bold text-center leading-tight line-clamp-2">
          {post.title}
        </div>
        {post.diffColor && (
          <div
            className={`mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${post.diffColor}`}
          >
            {post.subtitle}
          </div>
        )}
        {post.date && (
          <div className="mt-1 text-white/60 text-[9px]">{post.date}</div>
        )}
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 p-2"
          >
            <div className="text-white text-xs font-bold text-center leading-tight line-clamp-3">
              {post.title}
            </div>
            <div className="text-white/60 text-[10px]">{post.subtitle}</div>
            {post.date && (
              <div className="text-white/40 text-[9px]">{post.date}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Avatar Ring ──────────────────────────────────────────────────────────────

function AvatarRing({
  config,
  size = 88,
  active = false,
  onClick,
}: {
  config: Parameters<typeof WhatsAppAvatar>[0]["config"];
  size?: number;
  active?: boolean;
  onClick?: () => void;
}) {
  const ringStyle = active
    ? "bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"
    : "bg-muted";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full p-[3px] ${ringStyle} shrink-0 focus:outline-none focus:ring-2 focus:ring-primary`}
      style={{ width: size + 6, height: size + 6 }}
      aria-label="View profile avatar"
    >
      <div className="rounded-full bg-background p-[2px] w-full h-full flex items-center justify-center">
        <WhatsAppAvatar config={config} size={size} />
      </div>
    </button>
  );
}

// ─── Empty Posts State ────────────────────────────────────────────────────────

function EmptyPostsState({ isOwnProfile }: { isOwnProfile: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
      data-ocid="profile.posts.empty_state"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <Camera className="w-9 h-9 text-muted-foreground/50" />
      </div>
      <p className="font-bold text-foreground text-base mb-1">No posts yet</p>
      <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
        {isOwnProfile
          ? "Share your achievements and photos to see them here."
          : "This user hasn't posted anything yet."}
      </p>
      {isOwnProfile && (
        <Button
          size="sm"
          className="mt-4 rounded-full gap-2"
          data-ocid="profile.posts.upload_button"
          onClick={() => toast.info("Photo upload coming soon!")}
        >
          <Camera className="w-4 h-4" />
          Share a Photo
        </Button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TOTAL_EASY =
  CODING_PROBLEMS.filter((p) => p.difficulty === "Easy").length || 20;
const TOTAL_MEDIUM =
  CODING_PROBLEMS.filter((p) => p.difficulty === "Medium").length || 20;
const TOTAL_HARD =
  CODING_PROBLEMS.filter((p) => p.difficulty === "Hard").length || 10;

const POSTS_PER_PAGE = 12;

export default function UserProfilePage({
  targetUsername,
}: { targetUsername?: string }) {
  const { user, setUser, setPage } = useApp();

  const viewingUsername: string =
    targetUsername || localStorage.getItem("cc_viewingUser") || user.username;
  const isOwnProfile =
    !targetUsername &&
    (!localStorage.getItem("cc_viewingUser") ||
      localStorage.getItem("cc_viewingUser") === user.username);

  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    try {
      const list: string[] = JSON.parse(
        localStorage.getItem("followingList") ?? "[]",
      );
      return list.includes(viewingUsername);
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [postsVisible, setPostsVisible] = useState(POSTS_PER_PAGE);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [activeNote, setActiveNote] = useState<{
    title: string;
    content: string;
    topic: string;
    date: string;
  } | null>(null);

  const [profileBio] = useState(
    () =>
      localStorage.getItem("cc_profile_bio") ??
      "CS enthusiast 💻 | Learning every day 🚀",
  );

  const profileData = isOwnProfile
    ? user
    : {
        username: viewingUsername,
        xp: 320,
        level: 4,
        streak: 12,
        badges: ["first-problem", "streak-7"],
        solvedProblems: ["1", "2", "5", "8", "12"],
        enrolledCourses: ["frontend", "python"],
        avatarConfig: null,
      };

  const solvedProblems = profileData.solvedProblems ?? [];
  const enrolledCourses = profileData.enrolledCourses ?? [];
  const badges = profileData.badges ?? [];
  const totalXP = profileData.xp ?? 0;
  const level = profileData.level ?? 1;
  const percentile = calcPercentile(totalXP);

  const followersCount = isOwnProfile
    ? deterministicCount(user.username || "user", 480, 20)
    : deterministicCount(viewingUsername, 480, 20);
  const followingCount = isOwnProfile
    ? (() => {
        try {
          return (
            JSON.parse(
              localStorage.getItem("followingList") ?? "[]",
            ) as string[]
          ).length;
        } catch {
          return 0;
        }
      })()
    : deterministicCount(viewingUsername, 250, 10);

  // ── Solved by difficulty ────────────────────────────────────────────────────
  const solvedByDiff = useMemo(() => {
    const easy: typeof CODING_PROBLEMS = [];
    const medium: typeof CODING_PROBLEMS = [];
    const hard: typeof CODING_PROBLEMS = [];
    for (const id of solvedProblems) {
      const p = CODING_PROBLEMS.find((x) => String(x.id) === String(id));
      if (!p) continue;
      if (p.difficulty === "Easy") easy.push(p);
      else if (p.difficulty === "Medium") medium.push(p);
      else hard.push(p);
    }
    return { easy, medium, hard };
  }, [solvedProblems]);

  // ── Posts: only user-uploaded photos + earned achievements ─────────────────
  // User-uploaded photos from localStorage (set when user shares a photo)
  const uploadedPhotos = useMemo(() => {
    try {
      const key = `cc_photos_${viewingUsername}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) as Array<{
          id: string;
          title: string;
          date: string;
          gradient: string;
        }>;
      }
    } catch {}
    return [];
  }, [viewingUsername]);

  // Achievement posts: earned badges with unlock dates
  const achievementPosts: PostItem[] = useMemo(() => {
    return badges
      .map((badgeId, i) => {
        const meta = BADGE_META[badgeId];
        if (!meta) return null;
        const gradIdx = i % POST_GRADIENTS.length;
        return {
          id: `badge-${badgeId}`,
          title: meta.label,
          subtitle: meta.desc,
          gradient: POST_GRADIENTS[gradIdx],
          icon: meta.icon,
          type: "achievement" as const,
          date: meta.unlockDate,
        };
      })
      .filter(Boolean) as PostItem[];
  }, [badges]);

  // Photo posts from user uploads
  const photoPosts: PostItem[] = useMemo(() => {
    return uploadedPhotos.map((photo, i) => ({
      id: `photo-${photo.id}`,
      title: photo.title,
      subtitle: "Photo",
      gradient: photo.gradient ?? POST_GRADIENTS[i % POST_GRADIENTS.length],
      icon: "📸",
      type: "photo" as const,
      date: photo.date,
    }));
  }, [uploadedPhotos]);

  // Combined posts: photos first, then achievements — NO dummy solved problems in posts tab
  const allPosts: PostItem[] = useMemo(() => {
    return [...photoPosts, ...achievementPosts];
  }, [photoPosts, achievementPosts]);

  const postsCount = allPosts.length;

  // ── Notes ──────────────────────────────────────────────────────────────────
  const notes = useMemo(() => {
    try {
      const stored =
        localStorage.getItem(`cc_notes_${viewingUsername}`) ??
        (isOwnProfile ? localStorage.getItem("cc_notes_all") : null);
      if (stored)
        return JSON.parse(stored) as Array<{
          id: string;
          title: string;
          content: string;
          topic: string;
          date: string;
        }>;
    } catch {}
    return [];
  }, [viewingUsername, isOwnProfile]);

  // ── Highlights ─────────────────────────────────────────────────────────────
  const highlights = useMemo(
    () => ({
      solved: {
        icon: "🏆",
        title: "Solved",
        items: solvedProblems.slice(0, 10).map((id, i) => {
          const p = CODING_PROBLEMS.find((x) => String(x.id) === String(id));
          return {
            id: `s-${i}`,
            title: p?.title ?? `Problem #${id}`,
            subtitle: p?.difficulty ?? "Unknown",
            icon:
              p?.difficulty === "Hard"
                ? "🔥"
                : p?.difficulty === "Medium"
                  ? "⚡"
                  : "✅",
          };
        }),
      },
      badges: {
        icon: "🎖️",
        title: "Badges",
        items: badges.map((b, i) => {
          const meta = BADGE_META[b] ?? { label: b, desc: "", icon: "🏅" };
          return {
            id: `b-${i}`,
            title: meta.label,
            subtitle: meta.desc,
            icon: meta.icon,
          };
        }),
      },
      projects: {
        icon: "🚀",
        title: "Projects",
        items: enrolledCourses.slice(0, 5).map((c, i) => {
          const meta = DOMAIN_META[c] ?? { icon: "📘", label: c };
          const pct = getCourseProgress(c);
          return {
            id: `p-${i}`,
            title: meta.label,
            subtitle: `${pct}% complete`,
            icon: meta.icon,
          };
        }),
      },
      notes: {
        icon: "📝",
        title: "Notes",
        items: notes.slice(0, 5).map((n, i) => ({
          id: `n-${i}`,
          title: n.title,
          subtitle: n.topic,
          icon: "📝",
        })),
      },
    }),
    [solvedProblems, badges, enrolledCourses, notes],
  );

  const HIGHLIGHT_KEYS = ["solved", "badges", "projects", "notes"] as const;

  // ── Actions ────────────────────────────────────────────────────────────────
  const toggleFollow = () => {
    try {
      const list: string[] = JSON.parse(
        localStorage.getItem("followingList") ?? "[]",
      );
      const next = isFollowing
        ? list.filter((u) => u !== viewingUsername)
        : [...list, viewingUsername];
      localStorage.setItem("followingList", JSON.stringify(next));
      setIsFollowing(!isFollowing);
      toast.success(
        isFollowing
          ? `Unfollowed ${viewingUsername}`
          : `Following ${viewingUsername} 🎉`,
      );
    } catch {
      setIsFollowing(!isFollowing);
    }
  };

  const shareProfile = () => {
    const url = `${window.location.origin}?profile=${encodeURIComponent(viewingUsername)}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Profile link copied! 🔗"))
      .catch(() => toast.info(`Share: ${url}`));
  };

  const handleSaveProfile = (data: {
    username: string;
    bio: string;
    displayName: string;
  }) => {
    setUser({ username: data.username });
    localStorage.setItem("cc_profile_bio", data.bio);
  };

  // ── Tabs config ────────────────────────────────────────────────────────────
  const TABS: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "posts", label: "Posts", icon: <Grid3X3 className="w-4 h-4" /> },
    { id: "solved", label: "Solved", icon: <Code className="w-4 h-4" /> },
    { id: "badges", label: "Badges", icon: <Trophy className="w-4 h-4" /> },
    { id: "notes", label: "Notes", icon: <FileText className="w-4 h-4" /> },
  ];

  const visiblePosts = allPosts.slice(0, postsVisible);

  return (
    <div
      className="h-screen bg-background flex flex-col overflow-hidden"
      data-ocid="profile.page"
    >
      {/* ── Top Header ── */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            localStorage.removeItem("cc_viewingUser");
            setPage("dashboard");
          }}
          className="rounded-xl text-foreground shrink-0"
          data-ocid="profile.back_button"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Profile</p>
          <h1 className="font-bold text-foreground text-sm leading-none mt-0.5 truncate">
            @{isOwnProfile ? user.username || "you" : viewingUsername}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={shareProfile}
          className="rounded-xl text-muted-foreground"
          data-ocid="profile.share_button"
          aria-label="Share profile"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </header>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        {/* ── Profile Header ── */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-5 mb-4">
            <AvatarRing
              config={profileData.avatarConfig ?? DEFAULT_AVATAR_CONFIG}
              size={82}
              active={isOwnProfile}
              onClick={() => isOwnProfile && setShowEditProfile(true)}
            />

            <div className="flex-1 flex justify-around">
              <button
                type="button"
                className="flex flex-col items-center group"
                data-ocid="profile.stats.posts_button"
              >
                <span className="text-lg font-extrabold text-foreground leading-none">
                  {postsCount}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Posts
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center group"
                onClick={() => setShowFollowers(true)}
                data-ocid="profile.stats.followers_button"
              >
                <span className="text-lg font-extrabold text-foreground leading-none">
                  {followersCount}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">
                  Followers
                </span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center group"
                onClick={() => setShowFollowingModal(true)}
                data-ocid="profile.stats.following_button"
              >
                <span className="text-lg font-extrabold text-foreground leading-none">
                  {followingCount}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 group-hover:text-primary transition-colors">
                  Following
                </span>
              </button>
            </div>
          </div>

          {/* Name + Bio */}
          <div className="mb-3">
            <p className="font-extrabold text-foreground text-sm">
              {isOwnProfile
                ? user.username || "Code & Crush User"
                : viewingUsername}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs bg-primary/15 text-primary border border-primary/25 px-2 py-0.5 rounded-full font-semibold">
                Level {level}
              </span>
              <span className="text-xs bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                Top {100 - percentile + 1}%
              </span>
              <span className="text-xs text-yellow-400 font-bold">
                {totalXP} XP ⚡
              </span>
            </div>
            <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
              {profileBio}
            </p>
          </div>

          {/* Action buttons */}
          {isOwnProfile ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl font-semibold"
              onClick={() => setShowEditProfile(true)}
              data-ocid="profile.edit_profile_button"
            >
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                className="flex-1 rounded-xl font-semibold"
                onClick={toggleFollow}
                data-ocid="profile.follow_button"
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-3.5 h-3.5 mr-1.5" /> Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Follow
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 rounded-xl font-semibold"
                onClick={() => setPage("social-feed")}
                data-ocid="profile.message_button"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                Message
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-xl"
                onClick={shareProfile}
                data-ocid="profile.share_secondary_button"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* ── Story Highlights ── */}
        <div className="px-4 pb-4">
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
            {HIGHLIGHT_KEYS.map((key) => {
              const h = highlights[key];
              return (
                <button
                  type="button"
                  key={key}
                  className="flex flex-col items-center gap-1.5 shrink-0"
                  onClick={() => setActiveHighlight(key)}
                  data-ocid={`profile.highlight.${key}`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border-2 border-border flex items-center justify-center text-2xl hover:border-primary transition-colors">
                    {h.icon}
                  </div>
                  <span className="text-[11px] text-foreground/80 font-medium w-16 text-center truncate">
                    {h.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border mx-0" />

        {/* ── XP Progress bar ── */}
        <div className="px-4 py-3 bg-card/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" /> Level {level}
            </span>
            <span>
              {totalXP % 100}/100 XP to Level {level + 1}
            </span>
          </div>
          <Progress value={totalXP % 100} className="h-1.5" />
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex border-b border-border sticky top-0 bg-background z-10">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`profile.tab.${tab.id}`}
            >
              {tab.icon}
              <span className="text-[10px] font-semibold hidden sm:block">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="pb-28">
          {/* POSTS TAB — only uploaded photos + earned achievements */}
          {activeTab === "posts" && (
            <div data-ocid="profile.posts_panel">
              {allPosts.length === 0 ? (
                <EmptyPostsState isOwnProfile={isOwnProfile} />
              ) : (
                <>
                  {/* Section labels */}
                  {photoPosts.length > 0 && achievementPosts.length > 0 && (
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Photos &amp; Achievements
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-px bg-border">
                    {visiblePosts.map((post, i) => (
                      <PostGridItem
                        key={post.id}
                        post={post}
                        index={i}
                        onClick={() =>
                          toast.info(
                            `${post.type === "achievement" ? "🏆 " : "📸 "}${post.title}`,
                          )
                        }
                      />
                    ))}
                  </div>
                  {allPosts.length > postsVisible && (
                    <div className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full px-6"
                        onClick={() =>
                          setPostsVisible((v) => v + POSTS_PER_PAGE)
                        }
                        data-ocid="profile.posts.load_more_button"
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* SOLVED TAB */}
          {activeTab === "solved" && (
            <div
              className="px-4 py-4 space-y-5"
              data-ocid="profile.solved_panel"
            >
              {/* Difficulty rings */}
              <div className="flex justify-around py-4 bg-card border border-border rounded-2xl">
                {(["Easy", "Medium", "Hard"] as const).map((diff) => {
                  const items =
                    solvedByDiff[
                      diff.toLowerCase() as "easy" | "medium" | "hard"
                    ];
                  const total =
                    diff === "Easy"
                      ? TOTAL_EASY
                      : diff === "Medium"
                        ? TOTAL_MEDIUM
                        : TOTAL_HARD;
                  const radius = 26;
                  const circ = 2 * Math.PI * radius;
                  const pct = total > 0 ? Math.min(items.length / total, 1) : 0;
                  const color =
                    diff === "Easy"
                      ? "#22c55e"
                      : diff === "Medium"
                        ? "#eab308"
                        : "#ef4444";
                  const trackColor =
                    diff === "Easy"
                      ? "rgba(34,197,94,0.15)"
                      : diff === "Medium"
                        ? "rgba(234,179,8,0.15)"
                        : "rgba(239,68,68,0.15)";
                  return (
                    <div
                      key={diff}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="relative w-16 h-16">
                        <svg
                          className="w-full h-full -rotate-90"
                          viewBox="0 0 64 64"
                          role="img"
                          aria-label={`${diff}: ${items.length}/${total}`}
                        >
                          <title>{`${diff}: ${items.length}/${total}`}</title>
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            fill="none"
                            stroke={trackColor}
                            strokeWidth="6"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth="6"
                            strokeDasharray={circ}
                            strokeDashoffset={circ * (1 - pct)}
                            strokeLinecap="round"
                            style={{
                              transition: "stroke-dashoffset 0.8s ease",
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-base font-extrabold text-foreground leading-none">
                            {items.length}
                          </span>
                          <span className="text-[9px] text-muted-foreground">
                            /{total}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {diff}
                      </span>
                    </div>
                  );
                })}
              </div>

              {solvedProblems.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                  data-ocid="profile.solved.empty_state"
                >
                  <Code className="w-12 h-12 mb-3 opacity-30" />
                  <p className="font-semibold text-sm">
                    No Problems Solved Yet
                  </p>
                  <p className="text-xs mt-1">
                    Start solving in the Problems section
                  </p>
                </div>
              ) : (
                (["Easy", "Medium", "Hard"] as const).map((diff) => {
                  const items =
                    solvedByDiff[
                      diff.toLowerCase() as "easy" | "medium" | "hard"
                    ];
                  if (items.length === 0) return null;
                  return (
                    <div key={diff}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={`text-xs font-bold border ${DIFF_COLORS[diff]}`}
                          variant="outline"
                        >
                          {diff}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {items.length} solved
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {items.map((p, i) => (
                          <div
                            key={p.id}
                            className="flex items-center gap-3 px-3 py-2.5 bg-card border border-border rounded-xl"
                            data-ocid={`profile.solved.item.${i + 1}`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                diff === "Easy"
                                  ? "bg-green-500"
                                  : diff === "Medium"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                            <span className="flex-1 text-sm font-medium text-foreground truncate">
                              {p.title}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              #{p.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* BADGES TAB */}
          {activeTab === "badges" && (
            <div className="px-4 py-4" data-ocid="profile.badges_panel">
              {badges.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Earned Badges
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {badges.map((badgeId, idx) => {
                      const meta = BADGE_META[badgeId] ?? {
                        icon: "🏅",
                        label: badgeId,
                        desc: "",
                        color:
                          "from-muted/30 to-muted/50 border-border text-muted-foreground",
                        unlockDate: undefined,
                      };
                      return (
                        <div
                          key={`${badgeId}-${idx}`}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border bg-gradient-to-br ${meta.color}`}
                          data-ocid={`profile.badge.${idx + 1}`}
                        >
                          <span className="text-3xl shrink-0">{meta.icon}</span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate">
                              {meta.label}
                            </div>
                            <div className="text-[10px] opacity-70 mt-0.5 leading-tight">
                              {meta.desc}
                            </div>
                            {meta.unlockDate && (
                              <div className="text-[9px] opacity-50 mt-0.5">
                                Earned {meta.unlockDate}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {badges.length < ALL_BADGES.length && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Locked Badges
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {ALL_BADGES.filter((b) => !badges.includes(b)).map(
                      (badgeId, idx) => {
                        const meta = BADGE_META[badgeId] ?? {
                          icon: "🏅",
                          label: badgeId,
                          desc: "",
                        };
                        return (
                          <div
                            key={`locked-${badgeId}`}
                            className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-muted/20 opacity-50"
                            data-ocid={`profile.locked_badge.${idx + 1}`}
                          >
                            <div className="relative shrink-0">
                              <span className="text-3xl grayscale">
                                {meta.icon}
                              </span>
                              <Lock className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-muted-foreground bg-card rounded-full p-0.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate text-muted-foreground">
                                {meta.label}
                              </div>
                              <div className="text-[10px] text-muted-foreground/60 mt-0.5 leading-tight">
                                {meta.desc}
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              )}

              {badges.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                  data-ocid="profile.badges.empty_state"
                >
                  <Trophy className="w-12 h-12 mb-3 opacity-30" />
                  <p className="font-semibold text-sm">No Badges Yet</p>
                  <p className="text-xs mt-1 text-center max-w-[200px]">
                    Complete challenges and courses to earn badges
                  </p>
                </div>
              )}
            </div>
          )}

          {/* NOTES TAB */}
          {activeTab === "notes" && (
            <div
              className="px-4 py-4 space-y-3"
              data-ocid="profile.notes_panel"
            >
              {notes.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                  data-ocid="profile.notes.empty_state"
                >
                  <FileText className="w-12 h-12 mb-3 opacity-30" />
                  <p className="font-semibold text-sm">No Notes Yet</p>
                  <p className="text-xs mt-1">
                    Take notes while studying to see them here
                  </p>
                </div>
              ) : (
                <>
                  {(() => {
                    const grouped: Record<string, typeof notes> = {};
                    for (const n of notes) {
                      grouped[n.topic] = [...(grouped[n.topic] ?? []), n];
                    }
                    return Object.entries(grouped).map(
                      ([topic, topicNotes]) => (
                        <div key={topic}>
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                              {topic}
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {topicNotes.map((note, i) => (
                              <button
                                type="button"
                                key={note.id}
                                className="w-full text-left bg-card border border-border rounded-xl p-3.5 hover:border-primary/40 transition-colors"
                                onClick={() => setActiveNote(note)}
                                data-ocid={`profile.note.${i + 1}`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                      {note.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                      {note.content}
                                    </p>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                                    {note.date}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ),
                    );
                  })()}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {activeHighlight && (
          <HighlightViewer
            category={{
              icon: highlights[activeHighlight as keyof typeof highlights].icon,
              title:
                highlights[activeHighlight as keyof typeof highlights].title,
            }}
            items={highlights[activeHighlight as keyof typeof highlights].items}
            onClose={() => setActiveHighlight(null)}
          />
        )}
        {showEditProfile && isOwnProfile && (
          <EditProfileModal
            user={user}
            onSave={handleSaveProfile}
            onClose={() => setShowEditProfile(false)}
          />
        )}
        {activeNote && (
          <NoteModal note={activeNote} onClose={() => setActiveNote(null)} />
        )}
        {(showFollowers || showFollowingModal) && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowFollowers(false);
                setShowFollowingModal(false);
              }
            }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl"
              data-ocid="profile.followers_modal.dialog"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">
                  {showFollowers
                    ? `Followers (${followersCount})`
                    : `Following (${followingCount})`}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowFollowers(false);
                    setShowFollowingModal(false);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="profile.followers_modal.close_button"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 text-center text-muted-foreground text-sm py-8">
                <p className="text-xs">
                  User list is private. Connect with people in the community
                  feed!
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 rounded-full"
                  onClick={() => {
                    setShowFollowers(false);
                    setShowFollowingModal(false);
                    setPage("social-feed");
                  }}
                  data-ocid="profile.followers_modal.explore_button"
                >
                  Explore Community
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
