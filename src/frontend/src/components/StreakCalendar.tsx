import { motion } from "motion/react";
import { memo, useMemo, useRef, useState } from "react";

// ── Activity log helpers ─────────────────────────────────────────────────────

export function getActivityLog(): Record<string, number> {
  try {
    const raw = localStorage.getItem("cc_activity_log");
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, number>;
  } catch {
    return {};
  }
}

export function incrementActivity(dateStr?: string) {
  const key = dateStr ?? new Date().toISOString().split("T")[0];
  const log = getActivityLog();
  log[key] = (log[key] ?? 0) + 1;
  localStorage.setItem("cc_activity_log", JSON.stringify(log));
}

// ── Color helpers ────────────────────────────────────────────────────────────

function activityColor(count: number): string {
  if (count === 0) return "bg-muted/40 border-muted/60";
  if (count <= 2) return "bg-green-900/60 border-green-700/50";
  if (count <= 5) return "bg-green-600/70 border-green-500/50";
  if (count <= 8) return "bg-green-500/80 border-green-400/60";
  return "bg-green-400 border-green-300/70";
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface TooltipState {
  x: number;
  y: number;
  text: string;
}

interface StreakCalendarProps {
  streak: number;
}

// ── Streak calculation ────────────────────────────────────────────────────────

function computeStreaks(log: Record<string, number>): {
  currentStreak: number;
  longestStreak: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let running = 0;
  let checkDate = new Date(today);

  // Walk backwards from today
  for (let i = 0; i < 365; i++) {
    const key = checkDate.toISOString().split("T")[0];
    const active = (log[key] ?? 0) > 0;

    if (active) {
      running++;
      if (i === 0 || currentStreak > 0) currentStreak = running;
      longestStreak = Math.max(longestStreak, running);
    } else {
      if (i === 0) {
        // No activity today — check if yesterday had activity for current streak
        running = 0;
      } else {
        if (running > 0) longestStreak = Math.max(longestStreak, running);
        running = 0;
      }
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return { currentStreak, longestStreak };
}

export default memo(function StreakCalendar({ streak }: StreakCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Build 12-week grid (84 days) ending today
  const { weeks, monthPositions, longestStreak, totalActiveDays } =
    useMemo(() => {
      const log = getActivityLog();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const WEEKS = 12;
      const totalDays = WEEKS * 7 - 1; // 83 days back + today = 84

      const cells: { date: Date; count: number; dateStr: string }[] = [];
      for (let i = totalDays; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        cells.push({ date: new Date(d), count: log[dateStr] ?? 0, dateStr });
      }

      // Pad start to align to Sunday
      const startDayOfWeek = cells[0].date.getDay();
      const paddedCells = [...Array(startDayOfWeek).fill(null), ...cells];

      // Group into weeks
      const weeksArr: ((typeof cells)[0] | null)[][] = [];
      for (let i = 0; i < paddedCells.length; i += 7) {
        weeksArr.push(
          paddedCells.slice(i, i + 7) as ((typeof cells)[0] | null)[],
        );
      }

      // Month labels: first appearance of each month in the grid
      const monthPos: { label: string; colIndex: number }[] = [];
      let lastMonth = -1;
      for (let col = 0; col < weeksArr.length; col++) {
        const week = weeksArr[col];
        for (const cell of week) {
          if (cell && cell.date.getMonth() !== lastMonth) {
            lastMonth = cell.date.getMonth();
            monthPos.push({ label: MONTH_LABELS[lastMonth], colIndex: col });
            break;
          }
        }
      }

      const { longestStreak: ls } = computeStreaks(log);
      const totalActiveDays = Object.values(log).filter((v) => v > 0).length;

      return {
        weeks: weeksArr,
        monthPositions: monthPos,
        longestStreak: ls,
        totalActiveDays,
      };
    }, []);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    cell: { date: Date; count: number } | null,
  ) => {
    if (!cell) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top - 4;
    const label = cell.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const countText =
      cell.count === 0
        ? "No activity"
        : cell.count === 1
          ? "1 activity"
          : `${cell.count} activities`;
    setTooltip({ x, y, text: `${label}: ${countText}` });
  };

  // Current streak — shown prominently
  const streakDisplay =
    streak > 0 ? `🔥 ${streak}-day streak!` : "Start your streak today!";

  return (
    <div className="space-y-3" data-ocid="streak-calendar.section">
      {/* Header with streak — prominent */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <motion.span
            animate={streak > 0 ? { scale: [1, 1.15, 1] } : {}}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-xl"
          >
            {streak > 0 ? "🔥" : "📅"}
          </motion.span>
          <span
            className={`text-base font-bold ${streak > 0 ? "text-orange-500" : "text-foreground"}`}
          >
            {streakDisplay}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Last 12 weeks</span>
      </div>

      {/* Streak stats row */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-1.5">
          <span className="text-sm">🔥</span>
          <div>
            <p className="text-xs font-bold text-orange-500">{streak} days</p>
            <p className="text-[10px] text-muted-foreground">Current streak</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-1.5">
          <span className="text-sm">📈</span>
          <div>
            <p className="text-xs font-bold text-green-500">
              {longestStreak} days
            </p>
            <p className="text-[10px] text-muted-foreground">Longest streak</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1.5">
          <span className="text-sm">✅</span>
          <div>
            <p className="text-xs font-bold text-blue-400">{totalActiveDays}</p>
            <p className="text-[10px] text-muted-foreground">Active days</p>
          </div>
        </div>
      </div>

      {/* Calendar grid — scrollable on mobile */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto pb-1"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-20 pointer-events-none bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground shadow-lg whitespace-nowrap font-medium"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            {tooltip.text}
          </div>
        )}

        <div className="inline-flex flex-col gap-0">
          {/* Month labels row */}
          <div className="flex gap-[3px] mb-1 pl-0">
            {weeks.map((_, colIdx) => {
              const mp = monthPositions.find((m) => m.colIndex === colIdx);
              return (
                <div
                  key={colIdx}
                  className="w-[11px] text-[8px] text-muted-foreground font-medium leading-none select-none"
                  style={{ minWidth: 11 }}
                >
                  {mp ? mp.label : ""}
                </div>
              );
            })}
          </div>

          {/* Day labels on left (Sun, Mon...) — just dots */}
          {[0, 1, 2, 3, 4, 5, 6].map((dayRow) => (
            <div key={dayRow} className="flex gap-[3px]">
              {weeks.map((week, colIdx) => {
                const cell = week[dayRow];
                return (
                  <div
                    key={colIdx}
                    className={`w-[11px] h-[11px] rounded-sm border transition-transform hover:scale-125 cursor-default ${
                      cell ? activityColor(cell.count) : "opacity-0"
                    }`}
                    onMouseEnter={(e) => handleMouseEnter(e, cell)}
                    aria-label={
                      cell
                        ? `${cell.dateStr}: ${cell.count} activities`
                        : undefined
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 2, 5, 8, 10].map((lvl) => (
          <div
            key={lvl}
            className={`w-[11px] h-[11px] rounded-sm border ${activityColor(lvl)}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
});
