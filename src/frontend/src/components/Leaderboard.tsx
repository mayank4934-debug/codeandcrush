import { RefreshCw } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
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
}

// ── Domain filter options ─────────────────────────────────────────────────────

const DOMAIN_FILTERS = [
  { label: "Global", value: "global" },
  { label: "Python", value: "python" },
  { label: "Frontend", value: "frontend" },
  { label: "Data Science", value: "data-science" },
  { label: "C Prog.", value: "c-programming" },
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
  { name: "Dev Anand", domain: "frontend" },
  { name: "Nisha Kapoor", domain: "data-science" },
  { name: "Akash Tiwari", domain: "python" },
  { name: "Riya Joshi", domain: "frontend" },
  { name: "Manish Sinha", domain: "c-programming" },
  { name: "Divya Sharma", domain: "data-science" },
  { name: "Saurabh Mishra", domain: "python" },
  { name: "Komal Verma", domain: "frontend" },
  { name: "Varun Gupta", domain: "python" },
  { name: "Swati Reddy", domain: "data-science" },
];

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

function buildLeaderboard(
  username: string,
  xp: number,
  level: number,
  streak: number,
  domainFilter: string,
): LeaderboardEntry[] {
  const BASE_XPS = [
    980, 870, 760, 650, 530, 450, 380, 290, 180, 160, 140, 120, 100, 80, 60, 55,
    50, 45, 40, 35, 30, 25, 20, 15,
  ];

  const domainMocks = MOCK_NAMES.filter(
    (m) => domainFilter === "global" || m.domain === domainFilter,
  );

  const mocks: LeaderboardEntry[] = domainMocks.map((m, i) => {
    const baseXp = BASE_XPS[i % BASE_XPS.length];
    return {
      rank: 0,
      username: m.name,
      xp: baseXp + Math.floor(Math.random() * 30),
      level: Math.max(1, Math.floor(baseXp / 100) + 1),
      streak: 1 + Math.floor(Math.random() * 20),
      avatar: "",
      domain: m.domain,
      isCurrentUser: false,
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

// ── Component ─────────────────────────────────────────────────────────────────

interface LeaderboardProps {
  username: string;
  xp: number;
  level: number;
  streak: number;
}

const INITIAL_COUNT = 10;
const EXPANDED_COUNT = 25;

export default memo(function Leaderboard({
  username,
  xp,
  level,
  streak,
}: LeaderboardProps) {
  const { setPage } = useApp();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [showAll, setShowAll] = useState(false);
  const [domainFilter, setDomainFilter] = useState("global");

  const refresh = useCallback(() => {
    const board = buildLeaderboard(username, xp, level, streak, domainFilter);
    setEntries(board);
    setLastRefresh(Date.now());
  }, [username, xp, level, streak, domainFilter]);

  // Reload when filter changes; auto-refresh every 30s
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const currentUser = entries.find((e) => e.isCurrentUser);
  const leaderXp = entries[0]?.xp ?? 1;

  const percentile = useMemo(() => {
    if (!currentUser || entries.length === 0) return 0;
    return Math.round(
      ((entries.length - currentUser.rank) / entries.length) * 100,
    );
  }, [currentUser, entries]);

  const visibleEntries = entries.slice(
    0,
    showAll ? EXPANDED_COUNT : INITIAL_COUNT,
  );
  const hasMore = !showAll && entries.length > INITIAL_COUNT;

  const secondsAgo = Math.floor((Date.now() - lastRefresh) / 1000);
  const timeLabel =
    secondsAgo < 5
      ? "Just now"
      : secondsAgo < 60
        ? `${secondsAgo}s ago`
        : `${Math.floor(secondsAgo / 60)}m ago`;

  return (
    <div className="space-y-3" data-ocid="leaderboard.section">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Updated {timeLabel}
        </span>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-muted text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          aria-label="Refresh leaderboard"
          data-ocid="leaderboard.refresh_button"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      {/* Domain filter toggle — Global | Domain-specific */}
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
              setShowAll(false);
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
              {currentUser.xp} / {leaderXp} XP
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

      {/* Showing count */}
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

      {/* Leaderboard list */}
      <div className="space-y-1.5">
        {visibleEntries.map((entry) => {
          const xpPct = Math.min(100, (entry.xp / Math.max(leaderXp, 1)) * 100);
          return (
            <button
              key={`${entry.username}-${entry.rank}`}
              type="button"
              data-ocid={`leaderboard.item.${entry.rank}`}
              onClick={() => {
                if (!entry.isCurrentUser) {
                  localStorage.setItem("cc_viewingUser", entry.username);
                  setPage("profile");
                }
              }}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors text-left ${
                entry.isCurrentUser
                  ? "bg-primary/10 border-primary/30 shadow-sm cursor-default ring-1 ring-primary/20"
                  : "bg-muted/40 border-border hover:border-primary/40 hover:bg-muted/70 cursor-pointer"
              }`}
            >
              <div className="flex items-center justify-center w-7 shrink-0">
                <RankBadge rank={entry.rank} />
              </div>
              <InitialAvatar
                name={entry.username}
                isCurrentUser={entry.isCurrentUser}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm font-semibold truncate ${
                      entry.isCurrentUser ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {entry.username}
                    {entry.isCurrentUser && (
                      <span className="ml-1 text-[10px] font-bold text-primary/70">
                        (You)
                      </span>
                    )}
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
                    {entry.xp} XP
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
                <span className="text-[10px] text-orange-400">
                  🔥 {entry.streak}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Load More / Collapse */}
      {hasMore && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-5 py-2 rounded-full transition-colors"
            data-ocid="leaderboard.load_more_button"
          >
            Load More (Top {EXPANDED_COUNT})
          </button>
        </div>
      )}

      {showAll && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground border border-border bg-muted/40 hover:bg-muted/70 px-5 py-2 rounded-full transition-colors"
            data-ocid="leaderboard.collapse_button"
          >
            Show Less
          </button>
        </div>
      )}

      {!hasMore && !showAll && entries.length > 0 && (
        <p className="text-center text-xs text-muted-foreground pt-1">
          All {entries.length} learners shown
        </p>
      )}
    </div>
  );
});
