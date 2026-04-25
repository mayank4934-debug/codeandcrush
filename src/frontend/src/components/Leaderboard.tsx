import { Check, MessageCircle, UserCheck, UserPlus } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  level: number;
  streak: number;
  avatar: string;
  domain?: string;
  isCurrentUser?: boolean;
  /** Stable mock user ID derived from username */
  userId: string;
  /** Mock follower count */
  followerCount: number;
}

// ── Domain filter options ─────────────────────────────────────────────────────

const DOMAIN_FILTERS = [
  { label: "Global", value: "global" },
  { label: "Python", value: "python" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Data Science", value: "data-science" },
  { label: "C Prog.", value: "c-programming" },
  { label: "System Design", value: "system-design" },
];

// ── Mock users ────────────────────────────────────────────────────────────────

const MOCK_NAMES = [
  { name: "Arjun Sharma", domain: "python" },
  { name: "Priya Mehta", domain: "frontend" },
  { name: "Rohan Verma", domain: "python" },
  { name: "Ananya Singh", domain: "data-science" },
  { name: "Kiran Patel", domain: "c-programming" },
  { name: "Sneha Gupta", domain: "frontend" },
  { name: "Vikram Rao", domain: "python" },
  { name: "Deepa Nair", domain: "data-science" },
  { name: "Aditya Kumar", domain: "frontend" },
  { name: "Meera Iyer", domain: "python" },
  { name: "Rahul Das", domain: "c-programming" },
  { name: "Kavya Reddy", domain: "data-science" },
  { name: "Suresh Pillai", domain: "frontend" },
  { name: "Pooja Bansal", domain: "python" },
  { name: "Dev Anand", domain: "backend" },
  { name: "Nisha Kapoor", domain: "data-science" },
  { name: "Akash Tiwari", domain: "python" },
  { name: "Riya Joshi", domain: "frontend" },
  { name: "Manish Sinha", domain: "c-programming" },
  { name: "Divya Sharma", domain: "data-science" },
  { name: "Saurabh Mishra", domain: "python" },
  { name: "Komal Verma", domain: "frontend" },
  { name: "Varun Gupta", domain: "backend" },
  { name: "Swati Reddy", domain: "data-science" },
  { name: "Nikhil Jain", domain: "system-design" },
  { name: "Anjali Rao", domain: "backend" },
  { name: "Tushar Singh", domain: "python" },
  { name: "Shreya Nair", domain: "frontend" },
  { name: "Harsh Agarwal", domain: "system-design" },
  { name: "Pallavi Dubey", domain: "data-science" },
  { name: "Rishabh Tiwari", domain: "backend" },
  { name: "Megha Chawla", domain: "python" },
  { name: "Abhinav Mehta", domain: "c-programming" },
  { name: "Sonam Gupta", domain: "frontend" },
  { name: "Yash Verma", domain: "system-design" },
  { name: "Kritika Joshi", domain: "data-science" },
  { name: "Pranav Sharma", domain: "backend" },
  { name: "Tanvi Reddy", domain: "python" },
  { name: "Gaurav Bhatia", domain: "c-programming" },
  { name: "Ishita Kapoor", domain: "frontend" },
  { name: "Mohit Yadav", domain: "backend" },
  { name: "Simran Kaur", domain: "data-science" },
  { name: "Arun Pillai", domain: "python" },
  { name: "Dhruv Bansal", domain: "system-design" },
  { name: "Neha Mishra", domain: "frontend" },
  { name: "Siddharth Kumar", domain: "backend" },
  { name: "Prachi Gupta", domain: "python" },
  { name: "Vivek Sinha", domain: "c-programming" },
  { name: "Roshni Das", domain: "data-science" },
  { name: "Kartik Iyer", domain: "system-design" },
];

// ── Mock follower counts (deterministic per username) ─────────────────────────

function mockFollowerCount(username: string): number {
  let seed = 0;
  for (let i = 0; i < username.length; i++) seed += username.charCodeAt(i);
  return 12 + ((seed * 37 + 13) % 980);
}

// ── userId from username (stable, no spaces) ─────────────────────────────────

function usernameToId(username: string): string {
  return `user_${username.toLowerCase().replace(/\s+/g, "_")}`;
}

// ── Follow state localStorage helpers ────────────────────────────────────────

function loadFollowedIds(): Set<string> {
  try {
    const raw = localStorage.getItem("cc_lb_followed_ids");
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveFollowedIds(ids: Set<string>) {
  localStorage.setItem("cc_lb_followed_ids", JSON.stringify([...ids]));
}

// ── Unread count helpers ──────────────────────────────────────────────────────

function getUnreadCountForUser(
  currentUserId: string,
  targetUserId: string,
): number {
  try {
    const convId = [currentUserId, targetUserId].sort().join("__");
    const msgs = JSON.parse(
      localStorage.getItem(`cc_dm_${convId}`) ?? "[]",
    ) as Array<{
      senderId: string;
      read: boolean;
    }>;
    return msgs.filter((m) => !m.read && m.senderId !== currentUserId).length;
  } catch {
    return 0;
  }
}

// ── Live ticker events ────────────────────────────────────────────────────────

const TICKER_DOMAINS = [
  "Python",
  "Frontend",
  "Backend",
  "Data Science",
  "C Prog.",
  "System Design",
];

function generateTickerEvents(entries: LeaderboardEntry[]): string[] {
  const top = entries.slice(0, 15);
  const events: string[] = [];
  const gains = [50, 75, 100, 125, 150, 175, 200, 250, 300];
  for (let i = 0; i < 8; i++) {
    const entry = top[i % top.length];
    if (!entry) continue;
    const gain = gains[Math.floor(Math.random() * gains.length)];
    const domain =
      TICKER_DOMAINS[Math.floor(Math.random() * TICKER_DOMAINS.length)];
    events.push(`${entry.username.split(" ")[0]} +${gain} XP in ${domain}`);
  }
  return events;
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function InitialAvatar({
  name,
  isCurrentUser,
}: { name: string; isCurrentUser?: boolean }) {
  const COLORS = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  const colorIndex = name.charCodeAt(0) % COLORS.length;
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ${
        isCurrentUser
          ? "ring-primary/60 bg-primary"
          : `${COLORS[colorIndex]} ring-transparent`
      }`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

// ── Build leaderboard ────────────────────────────────────────────────────────

function buildLeaderboard(
  username: string,
  xp: number,
  level: number,
  streak: number,
  domainFilter: string,
): LeaderboardEntry[] {
  const BASE_XPS = [
    2450, 2310, 2180, 2050, 1930, 1810, 1700, 1580, 1460, 1350, 1230, 1120,
    1010, 900, 810, 730, 660, 590, 530, 480, 420, 370, 320, 280, 240, 210, 185,
    160, 140, 120, 105, 92, 80, 70, 62, 55, 50, 46, 42, 38, 35, 32, 29, 27, 25,
    23, 21, 19, 17, 16,
  ];

  const domainMocks = MOCK_NAMES.filter(
    (m) => domainFilter === "global" || m.domain === domainFilter,
  );

  const mocks: LeaderboardEntry[] = domainMocks.map((m, i) => {
    const baseXp = BASE_XPS[i % BASE_XPS.length];
    return {
      rank: 0,
      username: m.name,
      xp: baseXp + Math.floor(Math.random() * 40),
      level: Math.max(1, Math.floor(baseXp / 200) + 1),
      streak: 1 + Math.floor(Math.random() * 30),
      avatar: "",
      domain: m.domain,
      isCurrentUser: false,
      userId: usernameToId(m.name),
      followerCount: mockFollowerCount(m.name),
    };
  });

  const userEntry: LeaderboardEntry = {
    rank: 0,
    username: username || "You",
    xp,
    level,
    streak,
    avatar: "",
    domain: domainFilter !== "global" ? domainFilter : undefined,
    isCurrentUser: true,
    userId: "local_user",
    followerCount: mockFollowerCount(username || "You"),
  };

  return [...mocks, userEntry]
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

// ── Rank medal ────────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-xl leading-none">🥇</span>;
  if (rank === 2) return <span className="text-xl leading-none">🥈</span>;
  if (rank === 3) return <span className="text-xl leading-none">🥉</span>;
  return (
    <span className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
      {rank}
    </span>
  );
}

// ── Follow Button ─────────────────────────────────────────────────────────────

function FollowButton({
  userId,
  username,
  isFollowing,
  onToggle,
}: {
  userId: string;
  username: string;
  isFollowing: boolean;
  onToggle: (userId: string, username: string, nowFollowing: boolean) => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`leaderboard.follow_button.${userId}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(userId, username, !isFollowing);
      }}
      className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-200 ${
        isFollowing
          ? "bg-primary/10 text-primary border-primary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          : "bg-muted text-muted-foreground border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30"
      }`}
      aria-label={isFollowing ? `Unfollow ${username}` : `Follow ${username}`}
    >
      {isFollowing ? (
        <>
          <Check className="w-3 h-3" />
          <span className="hidden sm:inline">Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3 h-3" />
          <span className="hidden sm:inline">Follow</span>
        </>
      )}
    </button>
  );
}

// ── Message Button ────────────────────────────────────────────────────────────

function MessageButton({
  userId,
  username,
  unreadCount,
  onMessage,
}: {
  userId: string;
  username: string;
  unreadCount: number;
  onMessage: (userId: string, username: string) => void;
}) {
  return (
    <button
      type="button"
      data-ocid={`leaderboard.message_button.${userId}`}
      onClick={(e) => {
        e.stopPropagation();
        onMessage(userId, username);
      }}
      className="relative flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-muted text-muted-foreground border-border hover:bg-accent/20 hover:text-foreground hover:border-accent/40 transition-all duration-200"
      aria-label={`Message ${username}`}
    >
      <MessageCircle className="w-3 h-3" />
      <span className="hidden sm:inline">Message</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center px-0.5">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}

// ── Leaderboard row ───────────────────────────────────────────────────────────

function LeaderboardRow({
  entry,
  leaderXp,
  index,
  isFollowing,
  unreadCount,
  onProfileClick,
  onFollowToggle,
  onMessageUser,
}: {
  entry: LeaderboardEntry;
  leaderXp: number;
  index: number;
  isFollowing: boolean;
  unreadCount: number;
  onProfileClick: (username: string) => void;
  onFollowToggle: (
    userId: string,
    username: string,
    nowFollowing: boolean,
  ) => void;
  onMessageUser: (userId: string, username: string) => void;
}) {
  const xpPct = Math.min(100, (entry.xp / Math.max(leaderXp, 1)) * 100);

  return (
    <div
      data-ocid={`leaderboard.item.${index + 1}`}
      className={`w-full rounded-xl border transition-colors ${
        entry.isCurrentUser
          ? "bg-primary/10 border-primary/30 shadow-sm ring-1 ring-primary/20"
          : "bg-muted/40 border-border hover:border-primary/40 hover:bg-muted/70"
      }`}
    >
      {/* Main row */}
      <button
        type="button"
        onClick={() => {
          if (!entry.isCurrentUser) onProfileClick(entry.username);
        }}
        className="w-full flex items-center gap-3 px-3 pt-2.5 pb-1.5 text-left"
      >
        <div className="flex items-center justify-center w-7 shrink-0">
          <RankBadge rank={entry.rank} />
        </div>
        <InitialAvatar
          name={entry.username}
          isCurrentUser={entry.isCurrentUser}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-sm font-semibold truncate ${
                entry.isCurrentUser ? "text-primary" : "text-foreground"
              }`}
            >
              {entry.username}
            </span>
            {entry.isCurrentUser && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                <UserCheck className="w-2.5 h-2.5" /> You
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] text-muted-foreground">
              {entry.followerCount.toLocaleString()} followers
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  entry.isCurrentUser ? "bg-primary" : "bg-primary/50"
                }`}
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {entry.xp.toLocaleString()} XP
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              entry.isCurrentUser
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            Lv {entry.level}
          </span>
          <span className="text-[10px] text-orange-400">🔥 {entry.streak}</span>
        </div>
      </button>

      {/* Action buttons row — only for non-current users */}
      {!entry.isCurrentUser && (
        <div className="flex items-center gap-2 px-3 pb-2.5 pt-0.5">
          <FollowButton
            userId={entry.userId}
            username={entry.username}
            isFollowing={isFollowing}
            onToggle={onFollowToggle}
          />
          <MessageButton
            userId={entry.userId}
            username={entry.username}
            unreadCount={unreadCount}
            onMessage={onMessageUser}
          />
        </div>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface LeaderboardProps {
  username: string;
  xp: number;
  level: number;
  streak: number;
  /** Called when user clicks Message on a leaderboard card */
  onMessageUser?: (userId: string, username: string) => void;
}

const PAGE_SIZE = 10;
const AUTO_REFRESH_MS = 10_000;

export default memo(function Leaderboard({
  username,
  xp,
  level,
  streak,
  onMessageUser,
}: LeaderboardProps) {
  const { setPage, user } = useApp();
  const currentUserId = user.deviceId || "local_user";

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [domainFilter, setDomainFilter] = useState("global");
  const [tickerEvents, setTickerEvents] = useState<string[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);

  // ── Follow state — persisted Set of userId strings ──────────────────────────
  const [followedIds, setFollowedIds] = useState<Set<string>>(() =>
    loadFollowedIds(),
  );

  const lastRefreshRef = useRef(Date.now());

  const refresh = useCallback(
    (showSpinner = false) => {
      if (showSpinner) setIsRefreshing(true);
      const board = buildLeaderboard(username, xp, level, streak, domainFilter);
      setEntries(board);
      setTickerEvents(generateTickerEvents(board));
      lastRefreshRef.current = Date.now();
      if (showSpinner) setTimeout(() => setIsRefreshing(false), 600);
    },
    [username, xp, level, streak, domainFilter],
  );

  // Auto-refresh every 10 seconds
  useEffect(() => {
    refresh();
    const interval = setInterval(() => refresh(false), AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  // Cycle ticker every 3 seconds
  useEffect(() => {
    if (tickerEvents.length === 0) return;
    const t = setInterval(
      () => setTickerIndex((i) => (i + 1) % tickerEvents.length),
      3000,
    );
    return () => clearInterval(t);
  }, [tickerEvents]);

  const currentUser = entries.find((e) => e.isCurrentUser);
  const leaderXp = entries[0]?.xp ?? 1;

  const percentile = useMemo(() => {
    if (!currentUser || entries.length === 0) return 0;
    return Math.round(
      ((entries.length - currentUser.rank) / entries.length) * 100,
    );
  }, [currentUser, entries]);

  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;
  const currentUserVisible = visibleEntries.some((e) => e.isCurrentUser);
  const showCurrentUserSeparate = !currentUserVisible && currentUser != null;

  const handleProfileClick = (uname: string) => {
    localStorage.setItem("cc_viewingUser", uname);
    setPage("profile");
  };

  const handleFollowToggle = useCallback(
    (targetUserId: string, targetUsername: string, nowFollowing: boolean) => {
      setFollowedIds((prev) => {
        const next = new Set(prev);
        if (nowFollowing) {
          next.add(targetUserId);
          // Mirror in the legacy followingList used by social feed
          try {
            const list: string[] = JSON.parse(
              localStorage.getItem("followingList") ?? "[]",
            );
            if (!list.includes(targetUsername)) {
              localStorage.setItem(
                "followingList",
                JSON.stringify([...list, targetUsername]),
              );
            }
          } catch {}
        } else {
          next.delete(targetUserId);
          try {
            const list: string[] = JSON.parse(
              localStorage.getItem("followingList") ?? "[]",
            );
            localStorage.setItem(
              "followingList",
              JSON.stringify(list.filter((u) => u !== targetUsername)),
            );
          } catch {}
        }
        saveFollowedIds(next);
        return next;
      });
    },
    [],
  );

  const handleMessageUser = useCallback(
    (targetUserId: string, targetUsername: string) => {
      if (onMessageUser) {
        onMessageUser(targetUserId, targetUsername);
      }
    },
    [onMessageUser],
  );

  return (
    <div className="space-y-3" data-ocid="leaderboard.section">
      {/* Header with LIVE badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-foreground">Leaderboard</h3>
          <div className="flex items-center gap-1 bg-green-500/15 border border-green-500/30 rounded-full px-2 py-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] font-bold text-green-400 tracking-wide">
              LIVE
            </span>
          </div>
        </div>
        <span
          className={`text-xs transition-colors ${isRefreshing ? "text-primary animate-pulse" : "text-muted-foreground"}`}
        >
          {isRefreshing ? "Refreshing..." : "Updates every 10s"}
        </span>
      </div>

      {/* Live ticker */}
      {tickerEvents.length > 0 && (
        <div
          className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2 overflow-hidden"
          data-ocid="leaderboard.ticker"
        >
          <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest whitespace-nowrap shrink-0">
            Live
          </span>
          <div className="relative flex-1 overflow-hidden h-4">
            <p
              key={tickerIndex}
              className="text-xs text-foreground font-medium truncate animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              🎯 {tickerEvents[tickerIndex]}
            </p>
          </div>
          <div className="flex gap-0.5 shrink-0">
            {tickerEvents.map((_, i) => (
              <span
                key={i}
                className={`w-1 h-1 rounded-full transition-colors ${
                  i === tickerIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Domain filter tabs */}
      <div
        className="flex items-center gap-1.5 flex-wrap"
        data-ocid="leaderboard.domain_filter"
      >
        {DOMAIN_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setDomainFilter(f.value);
              setVisibleCount(PAGE_SIZE);
            }}
            data-ocid={`leaderboard.filter_${f.value}.tab`}
            className={`text-xs px-3 py-1 rounded-full border font-semibold transition-colors ${
              domainFilter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Your rank pill */}
      {currentUser && (
        <div
          className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5"
          data-ocid="leaderboard.your_rank.card"
        >
          <InitialAvatar name={currentUser.username} isCurrentUser />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-foreground truncate block">
              Your Rank
            </span>
            <span className="text-xs text-primary font-medium">
              🎯 Top {100 - percentile}% of all learners
            </span>
          </div>
          <span className="text-sm font-bold text-primary shrink-0">
            #{currentUser.rank}
          </span>
        </div>
      )}

      {/* XP progress bar vs leader */}
      {currentUser && leaderXp > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Your XP vs Leader</span>
            <span>
              {currentUser.xp.toLocaleString()} / {leaderXp.toLocaleString()} XP
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500"
              style={{
                width: `${Math.min(100, (currentUser.xp / leaderXp) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Count info */}
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <strong className="text-foreground">{visibleEntries.length}</strong> of{" "}
        <strong className="text-foreground">{entries.length}</strong> learners
        {domainFilter !== "global" && (
          <span className="ml-1 text-primary font-medium">
            · {DOMAIN_FILTERS.find((f) => f.value === domainFilter)?.label}
          </span>
        )}
      </p>

      {/* List */}
      <div className="space-y-1.5">
        {visibleEntries.map((entry, i) => (
          <LeaderboardRow
            key={`${entry.userId}-${entry.rank}`}
            entry={entry}
            leaderXp={leaderXp}
            index={i}
            isFollowing={followedIds.has(entry.userId)}
            unreadCount={
              entry.isCurrentUser
                ? 0
                : getUnreadCountForUser(currentUserId, entry.userId)
            }
            onProfileClick={handleProfileClick}
            onFollowToggle={handleFollowToggle}
            onMessageUser={handleMessageUser}
          />
        ))}
      </div>

      {/* Current user shown below if not in visible list */}
      {showCurrentUserSeparate && (
        <>
          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 border-t border-dashed border-border" />
            <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
              Your position
            </span>
            <div className="flex-1 border-t border-dashed border-border" />
          </div>
          <LeaderboardRow
            entry={currentUser}
            leaderXp={leaderXp}
            index={currentUser.rank - 1}
            isFollowing={false}
            unreadCount={0}
            onProfileClick={handleProfileClick}
            onFollowToggle={handleFollowToggle}
            onMessageUser={handleMessageUser}
          />
        </>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((c) => Math.min(c + PAGE_SIZE, entries.length))
            }
            className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-5 py-2 rounded-full transition-colors"
            data-ocid="leaderboard.load_more_button"
          >
            Load More ({Math.min(PAGE_SIZE, entries.length - visibleCount)}{" "}
            more)
          </button>
        </div>
      )}

      {!hasMore && entries.length > 0 && (
        <p className="text-center text-xs text-muted-foreground pt-1">
          All {entries.length} learners shown
        </p>
      )}
    </div>
  );
});
