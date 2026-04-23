import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Code,
  Copy,
  Edit,
  Flame,
  MessageSquare,
  Share2,
  Star,
  Trophy,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import WhatsAppAvatar, {
  DEFAULT_AVATAR_CONFIG,
} from "../components/WhatsAppAvatar";
import { useApp } from "../context/AppContext";
import { CODING_PROBLEMS } from "../data/problems";

const BADGE_META: Record<
  string,
  { icon: string; label: string; color: string }
> = {
  "first-problem": {
    icon: "🚀",
    label: "First Steps",
    color:
      "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  "streak-7": {
    icon: "🔥",
    label: "Week Warrior",
    color:
      "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  },
  "code-master": {
    icon: "💻",
    label: "Code Master",
    color:
      "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  },
  "love-call": {
    icon: "💖",
    label: "Love Call",
    color:
      "text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
  },
  "hot-streak": {
    icon: "⚡",
    label: "Hot Streak",
    color:
      "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  },
  century: {
    icon: "💯",
    label: "Century",
    color:
      "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  enrolled: {
    icon: "📚",
    label: "Scholar",
    color:
      "text-teal-600 bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
  },
};

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

const DIFF_COLORS: Record<string, string> = {
  Easy: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  Medium:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  Hard: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

const SIMULATED_LEADERBOARD_XP = [
  4800, 4200, 3900, 3600, 3400, 3100, 2900, 2700, 2500, 2300, 2100, 1900, 1750,
  1600, 1450, 1300, 1200, 1100, 1000, 950, 900, 850, 780, 720, 680, 620, 580,
  520, 480, 440, 400, 370, 340, 310, 280, 250, 230, 210, 190, 170, 160, 150,
  130, 120, 110, 100, 90, 80, 70, 60,
];

function calcPercentile(xp: number): number {
  const total = SIMULATED_LEADERBOARD_XP.length + 1;
  const above = SIMULATED_LEADERBOARD_XP.filter((v) => v > xp).length;
  return Math.max(1, Math.min(99, Math.round(((total - above) / total) * 100)));
}

function getFollowersCount(username: string): number {
  const hash = username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (hash % 480) + 20;
}

function getFollowingCount(username: string): number {
  const hash = username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (hash % 250) + 10;
}

function getCourseProgress(courseId: string): number {
  try {
    const val = localStorage.getItem(`cc_course_progress_${courseId}`);
    if (val !== null) return Math.min(100, Math.max(0, Number(val)));
    const hash = courseId
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return (hash % 85) + 5;
  } catch {
    return 0;
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Jan 2025";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Jan 2025";
  }
}

// ─── Difficulty Ring SVG ──────────────────────────────────────────────────────

function DifficultyRing({
  label,
  solved,
  total,
  color,
  trackColor,
}: {
  label: string;
  solved: number;
  total: number;
  color: string;
  trackColor: string;
}) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(solved / total, 1) : 0;
  const dashOffset = circumference * (1 - pct);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 64 64"
          role="img"
          aria-label={`${label} difficulty ring: ${solved} of ${total}`}
        >
          <title>{`${label}: ${solved}/${total} solved`}</title>
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
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-extrabold text-foreground leading-none">
            {solved}
          </span>
          <span className="text-[9px] text-muted-foreground leading-none mt-0.5">
            /{total}
          </span>
        </div>
      </div>
      <span className="text-xs font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

// ─── User List Modal ──────────────────────────────────────────────────────────

function UserListModal({
  title,
  users,
  onClose,
  onViewProfile,
}: {
  title: string;
  users: string[];
  onClose: () => void;
  onViewProfile: (u: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      data-ocid="profile.user_list.dialog"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-card border border-border rounded-2xl w-full max-w-sm max-h-[70vh] flex flex-col shadow-xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h3 className="font-bold text-foreground">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="profile.user_list.close_button"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Users
                className="w-8 h-8 mx-auto mb-2 opacity-40"
                aria-hidden="true"
              />
              <p>No users yet</p>
            </div>
          ) : (
            users.map((u, i) => (
              <button
                type="button"
                key={u}
                onClick={() => {
                  onViewProfile(u);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                data-ocid={`profile.user_list.item.${i + 1}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {u[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="text-sm font-semibold text-foreground truncate">
                  {u}
                </span>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Tab type ─────────────────────────────────────────────────────────────────

type ProfileTab = "problems" | "badges" | "courses" | "posts";

// ─── Difficulty totals ────────────────────────────────────────────────────────
const TOTAL_EASY =
  CODING_PROBLEMS.filter((p) => p.difficulty === "Easy").length || 20;
const TOTAL_MEDIUM =
  CODING_PROBLEMS.filter((p) => p.difficulty === "Medium").length || 20;
const TOTAL_HARD =
  CODING_PROBLEMS.filter((p) => p.difficulty === "Hard").length || 10;

export default function UserProfilePage({
  targetUsername,
}: { targetUsername?: string }) {
  const { user, setPage } = useApp();

  const viewingUsername: string =
    targetUsername || localStorage.getItem("cc_viewingUser") || user.username;
  const isOwnProfile = !viewingUsername || viewingUsername === user.username;

  // ── Follow state ───────────────────────────────────────────────────────────
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

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("problems");

  // ── Counts ─────────────────────────────────────────────────────────────────
  const ownFollowing = useMemo(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("followingList") ?? "[]") as string[]
      ).length;
    } catch {
      return 0;
    }
  }, []);

  const displayFollowers = isOwnProfile
    ? getFollowersCount(user.username)
    : getFollowersCount(viewingUsername);
  const displayFollowing = isOwnProfile
    ? ownFollowing
    : getFollowingCount(viewingUsername);

  const followersList: string[] = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem(`cc_followers_list_${viewingUsername}`) ?? "[]",
      );
    } catch {
      return [];
    }
  }, [viewingUsername]);

  const followingList: string[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("followingList") ?? "[]");
    } catch {
      return [];
    }
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const followUser = () => {
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
    const url = `${window.location.href.split("?")[0]}?profile=${encodeURIComponent(viewingUsername)}`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Profile link copied! 🔗"))
      .catch(() => toast.info(`Profile: ${url}`));
  };

  const handleViewProfile = (username: string) => {
    localStorage.setItem("cc_viewingUser", username);
    setPage("profile");
  };

  // ── Profile data ───────────────────────────────────────────────────────────
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

  const totalXP = profileData.xp ?? 0;
  const level = profileData.level ?? 1;
  const streak = profileData.streak ?? 0;
  const xpInLevel = totalXP % 100;
  const percentile = calcPercentile(totalXP);

  const userPosts = useMemo(() => {
    try {
      const all = JSON.parse(
        localStorage.getItem("cc_user_experiences") ?? "[]",
      );
      return (
        all as Array<{
          authorName: string;
          id: string;
          company: string;
          role: string;
          outcome: string;
          date: string;
        }>
      ).filter(
        (e) => e.authorName?.toLowerCase() === viewingUsername.toLowerCase(),
      );
    } catch {
      return [];
    }
  }, [viewingUsername]);

  const TABS: { id: ProfileTab; label: string }[] = [
    { id: "problems", label: "Problems" },
    { id: "badges", label: "Badges" },
    { id: "courses", label: "Courses" },
    { id: "posts", label: "Posts" },
  ];

  return (
    <div
      className="h-screen bg-background flex flex-col overflow-hidden"
      data-ocid="profile.page"
    >
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            localStorage.removeItem("cc_viewingUser");
            setPage("dashboard");
          }}
          className="rounded-xl text-foreground shrink-0"
          data-ocid="profile.back_button"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-foreground text-base truncate">
            {isOwnProfile ? "My Profile" : `${viewingUsername}'s Profile`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isOwnProfile ? (
            <Button
              size="sm"
              variant={isFollowing ? "outline" : "default"}
              onClick={followUser}
              className="rounded-full gap-1.5 text-xs"
              data-ocid="profile.follow_button"
            >
              {isFollowing ? (
                <>
                  <UserMinus className="w-3.5 h-3.5" /> Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" /> Follow
                </>
              )}
            </Button>
          ) : (
            <span
              className="text-xs text-muted-foreground px-3 py-1.5 border border-border rounded-full flex items-center gap-1"
              data-ocid="profile.edit_label"
            >
              <Edit className="w-3 h-3" /> Your Profile
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={shareProfile}
            className="rounded-xl"
            data-ocid="profile.share_button"
            aria-label="Share profile"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-24">
          {/* Profile Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-5"
            data-ocid="profile.hero_card"
          >
            <div className="flex items-start gap-4">
              <WhatsAppAvatar
                config={profileData.avatarConfig ?? DEFAULT_AVATAR_CONFIG}
                size={72}
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-extrabold text-foreground text-xl truncate">
                  {profileData.username || "Anonymous"}
                </h2>
                <p className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Joined{" "}
                  {isOwnProfile && user.email ? formatDate() : "Jan 2025"}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="flex items-center gap-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    <Zap className="w-3 h-3" /> Level {level}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 px-2.5 py-1 rounded-full">
                    <Flame className="w-3 h-3" /> {streak} day streak
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3" /> {totalXP} XP
                  </span>
                </div>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Progress to Level {level + 1}</span>
                <span>{xpInLevel}/100 XP</span>
              </div>
              <Progress value={xpInLevel} className="h-2" />
            </div>

            {/* Followers / Following row — clickable */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => setShowFollowers(true)}
                className="text-center hover:text-primary transition-colors group"
                data-ocid="profile.followers_button"
              >
                <p className="text-base font-extrabold text-foreground group-hover:text-primary">
                  {displayFollowers}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Users className="w-3 h-3" /> Followers
                </p>
              </button>
              <div className="w-px h-8 bg-border" />
              <button
                type="button"
                onClick={() => setShowFollowing(true)}
                className="text-center hover:text-primary transition-colors group"
                data-ocid="profile.following_button"
              >
                <p className="text-base font-extrabold text-foreground group-hover:text-primary">
                  {displayFollowing}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <UserCheck className="w-3 h-3" /> Following
                </p>
              </button>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-base font-extrabold text-foreground">
                  {solvedProblems.length}
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Code className="w-3 h-3" /> Solved
                </p>
              </div>
              <button
                type="button"
                onClick={shareProfile}
                className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-border rounded-full px-3 py-1.5 transition-colors"
                data-ocid="profile.copy_link_button"
              >
                <Copy className="w-3 h-3" /> Copy Link
              </button>
            </div>
          </motion.div>

          {/* Peer Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4"
            data-ocid="profile.peer_comparison"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">
                  Peer Comparison
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  {isOwnProfile ? "You are" : `${viewingUsername} is`} in the{" "}
                  <span className="text-primary">
                    top {100 - percentile + 1}%
                  </span>{" "}
                  of learners on codeWithcrush
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Based on {totalXP} XP earned across all courses
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-extrabold text-primary">
                  #{percentile}
                </p>
                <p className="text-[10px] text-muted-foreground">Rank</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                <span>0 XP</span>
                <span>Top learners</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (totalXP / 5000) * 100)}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Difficulty Rings */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-card border border-border rounded-2xl p-5"
            data-ocid="profile.difficulty_rings"
          >
            <h3 className="font-bold text-foreground mb-4 text-sm flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" /> Problem Difficulty
              Breakdown
            </h3>
            <div className="flex items-center justify-around">
              <DifficultyRing
                label="Easy"
                solved={solvedByDiff.easy.length}
                total={TOTAL_EASY}
                color="#22c55e"
                trackColor="rgba(34,197,94,0.15)"
              />
              <DifficultyRing
                label="Medium"
                solved={solvedByDiff.medium.length}
                total={TOTAL_MEDIUM}
                color="#eab308"
                trackColor="rgba(234,179,8,0.15)"
              />
              <DifficultyRing
                label="Hard"
                solved={solvedByDiff.hard.length}
                total={TOTAL_HARD}
                color="#ef4444"
                trackColor="rgba(239,68,68,0.15)"
              />
            </div>
          </motion.div>

          {/* Tabbed Sections */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid="profile.tabs_section"
          >
            <div className="flex border-b border-border">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`profile.tab_${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-4">
              {/* Problems */}
              {activeTab === "problems" && (
                <div data-ocid="profile.problems_panel">
                  {solvedProblems.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground text-sm"
                      data-ocid="profile.problems.empty_state"
                    >
                      <Code className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p>No problems solved yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(
                        [
                          { label: "Easy", items: solvedByDiff.easy },
                          { label: "Medium", items: solvedByDiff.medium },
                          { label: "Hard", items: solvedByDiff.hard },
                        ] as const
                      ).map(
                        ({ label, items }) =>
                          items.length > 0 && (
                            <div key={label}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span
                                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${DIFF_COLORS[label]}`}
                                >
                                  {label}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {items.length} solved
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {items.slice(0, 8).map((p) => (
                                  <span
                                    key={p.id}
                                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg border border-border truncate max-w-[160px]"
                                    title={p.title}
                                  >
                                    {p.title}
                                  </span>
                                ))}
                                {items.length > 8 && (
                                  <span className="text-xs text-muted-foreground px-2 py-1">
                                    +{items.length - 8} more
                                  </span>
                                )}
                              </div>
                            </div>
                          ),
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* Badges */}
              {activeTab === "badges" && (
                <div data-ocid="profile.badges_panel">
                  {badges.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground text-sm"
                      data-ocid="profile.badges.empty_state"
                    >
                      <Trophy className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p>No badges yet — keep learning!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {badges.map((badgeId, idx) => {
                        const meta = BADGE_META[badgeId] ?? {
                          icon: "🏅",
                          label: badgeId,
                          color: "text-muted-foreground bg-muted border-border",
                        };
                        return (
                          <div
                            key={`${badgeId}-${idx}`}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border ${meta.color}`}
                            data-ocid={`profile.badge.${idx + 1}`}
                          >
                            <span className="text-2xl shrink-0">
                              {meta.icon}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">
                                {meta.label}
                              </div>
                              <div className="text-[10px] opacity-70">
                                Earned
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {/* Courses */}
              {activeTab === "courses" && (
                <div data-ocid="profile.courses_panel">
                  {enrolledCourses.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground text-sm"
                      data-ocid="profile.courses.empty_state"
                    >
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p>No courses enrolled yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {enrolledCourses.map((courseId, idx) => {
                        const meta = DOMAIN_META[courseId] ?? {
                          icon: "📘",
                          label: courseId,
                        };
                        const pct = getCourseProgress(courseId);
                        return (
                          <div
                            key={courseId}
                            className="flex items-center gap-3"
                            data-ocid={`profile.course.${idx + 1}`}
                          >
                            <span className="text-2xl shrink-0">
                              {meta.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-foreground truncate">
                                  {meta.label}
                                </span>
                                <span className="text-xs font-bold text-primary ml-2 shrink-0">
                                  {pct}%
                                </span>
                              </div>
                              <Progress value={pct} className="h-1.5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {/* Posts */}
              {activeTab === "posts" && (
                <div data-ocid="profile.posts_panel">
                  {userPosts.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground text-sm"
                      data-ocid="profile.posts.empty_state"
                    >
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p>No experiences shared yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userPosts.map(
                        (
                          post: {
                            id: string;
                            company: string;
                            role: string;
                            outcome: string;
                            date: string;
                          },
                          idx: number,
                        ) => (
                          <div
                            key={post.id}
                            className="bg-muted/40 border border-border rounded-xl p-3"
                            data-ocid={`profile.post.${idx + 1}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold text-foreground">
                                💼 {post.company}
                              </span>
                              <Badge variant="outline" className="text-[10px]">
                                {post.outcome}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {post.role} ·{" "}
                              {new Date(`${post.date}-01`).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" },
                              )}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Followers / Following Modals */}
      <AnimatePresence>
        {showFollowers && (
          <UserListModal
            title={`Followers (${displayFollowers})`}
            users={followersList}
            onClose={() => setShowFollowers(false)}
            onViewProfile={handleViewProfile}
          />
        )}
        {showFollowing && (
          <UserListModal
            title={`Following (${displayFollowing})`}
            users={followingList}
            onClose={() => setShowFollowing(false)}
            onViewProfile={handleViewProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
