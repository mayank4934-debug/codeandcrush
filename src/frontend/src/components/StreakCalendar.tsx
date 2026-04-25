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

// ── Color scale — GitHub-exact ───────────────────────────────────────────────
// 0 = empty, 1-2 = lightest green, 3-5 = medium, 6-9 = dark, 10+ = darkest

function cellBg(count: number): string {
  if (count === 0) return "#2d333b"; // dark neutral (matches dark theme card bg)
  if (count <= 2) return "#0e4429";
  if (count <= 5) return "#006d32";
  if (count <= 9) return "#26a641";
  return "#39d353";
}

function legendColor(level: 0 | 1 | 2 | 3 | 4): string {
  const map = {
    0: "#2d333b",
    1: "#0e4429",
    2: "#006d32",
    3: "#26a641",
    4: "#39d353",
  };
  return map[level];
}

// ── Month names ───────────────────────────────────────────────────────────────

const MONTH_NAMES = [
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

// Day labels shown on left for rows 0,2,4 (Mon, Wed, Fri)
const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

// ── Streak helpers ────────────────────────────────────────────────────────────

function computeStreaks(log: Record<string, number>) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let longestStreak = 0;
  let running = 0;
  const checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const key = checkDate.toISOString().split("T")[0];
    const active = (log[key] ?? 0) > 0;
    if (active) {
      running++;
      if (i === 0 || currentStreak > 0) currentStreak = running;
      longestStreak = Math.max(longestStreak, running);
    } else {
      if (running > 0) longestStreak = Math.max(longestStreak, running);
      running = 0;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return { currentStreak, longestStreak };
}

// ── Tooltip state ─────────────────────────────────────────────────────────────

interface TooltipState {
  x: number;
  y: number;
  text: string;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface CalendarCell {
  date: Date;
  count: number;
  dateStr: string;
}

type WeekColumn = (CalendarCell | null)[];

// ── Component ─────────────────────────────────────────────────────────────────

interface StreakCalendarProps {
  streak: number;
}

export default memo(function StreakCalendar({ streak }: StreakCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const {
    weeks,
    monthLabels,
    longestStreak,
    totalContributions,
    currentStreakCalc,
  } = useMemo(() => {
    const log = getActivityLog();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build 364 days back + today = 365 days total (52 full weeks + 1 day)
    // We want exactly 52 week columns. Start from the Sunday that began 52 weeks ago.
    // Find the most recent Sunday at or before today, then go back 51 more weeks.
    // Start date: go back so that we have 52 complete week columns
    // Each column = Mon..Sun. To align GitHub-style (Mon at top), we use ISO weekday.
    // ISO: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
    const isoTodayDay = (today.getDay() + 6) % 7; // Mon=0..Sun=6

    // Last full week ends today; go back 51 weeks from the start of this week
    // This week starts on Monday: today - isoTodayDay days
    const thisWeekMonday = new Date(today);
    thisWeekMonday.setDate(today.getDate() - isoTodayDay);

    const startDate = new Date(thisWeekMonday);
    startDate.setDate(thisWeekMonday.getDate() - 51 * 7); // 52 weeks total including current

    // Build all cells from startDate to today
    const allCells: CalendarCell[] = [];
    const cursor = new Date(startDate);
    while (cursor <= today) {
      const dateStr = cursor.toISOString().split("T")[0];
      allCells.push({
        date: new Date(cursor),
        count: log[dateStr] ?? 0,
        dateStr,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    // Group into 7-row columns (Mon=0 to Sun=6)
    // allCells[0] is always a Monday
    const weekCols: WeekColumn[] = [];
    for (let i = 0; i < allCells.length; i += 7) {
      const col: WeekColumn = allCells.slice(i, i + 7);
      // Pad to exactly 7 if last column is shorter (current partial week)
      while (col.length < 7) col.push(null);
      weekCols.push(col);
    }

    // Month labels: find first column where a new month starts
    const monthLabelMap: Map<number, string> = new Map();
    let lastSeenMonth = -1;
    for (let col = 0; col < weekCols.length; col++) {
      const week = weekCols[col];
      for (const cell of week) {
        if (cell) {
          const m = cell.date.getMonth();
          if (m !== lastSeenMonth) {
            lastSeenMonth = m;
            monthLabelMap.set(col, MONTH_NAMES[m]);
          }
          break;
        }
      }
    }

    const { currentStreak: cs, longestStreak: ls } = computeStreaks(log);
    const totalContributions = Object.values(log).reduce((s, v) => s + v, 0);

    return {
      weeks: weekCols,
      monthLabels: monthLabelMap,
      longestStreak: ls,
      totalContributions,
      currentStreakCalc: cs,
    };
  }, []);

  const displayStreak = streak > 0 ? streak : currentStreakCalc;

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    cell: CalendarCell | null,
  ) => {
    if (!cell) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top - 6;

    const formatted = cell.date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const countText =
      cell.count === 0
        ? "No contributions"
        : cell.count === 1
          ? "1 contribution"
          : `${cell.count} contributions`;
    setTooltip({ x, y, text: `${countText} on ${formatted}` });
  };

  return (
    <div className="space-y-4" data-ocid="streak-calendar.section">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{displayStreak > 0 ? "🔥" : "📅"}</span>
          <span
            className={`text-base font-bold ${displayStreak > 0 ? "text-orange-400" : "text-foreground"}`}
          >
            {displayStreak > 0
              ? `${displayStreak}-day streak!`
              : "Start your streak today!"}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {totalContributions.toLocaleString()} contributions this year
        </span>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-1.5">
          <span className="text-sm">🔥</span>
          <div>
            <p className="text-xs font-bold text-orange-400">
              {displayStreak} days
            </p>
            <p className="text-[10px] text-muted-foreground">Current streak</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-1.5">
          <span className="text-sm">📈</span>
          <div>
            <p className="text-xs font-bold text-green-400">
              {longestStreak} days
            </p>
            <p className="text-[10px] text-muted-foreground">Longest streak</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-1.5">
          <span className="text-sm">✅</span>
          <div>
            <p className="text-xs font-bold text-blue-400">
              {totalContributions}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Total contributions
            </p>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto pb-2"
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-20 pointer-events-none bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground shadow-xl whitespace-nowrap font-medium"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            {tooltip.text}
          </div>
        )}

        {/* The grid itself: day labels on left, months on top, cells in columns */}
        <div className="inline-flex gap-0">
          {/* Day labels column (Mon, "", Wed, "", Fri, "", "") */}
          <div className="flex flex-col mr-1.5" style={{ marginTop: 20 }}>
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-[9px] text-muted-foreground font-medium leading-none"
                style={{ height: 14, display: "flex", alignItems: "center" }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Week columns with month header row */}
          <div className="flex flex-col gap-0">
            {/* Month labels row */}
            <div className="flex gap-[3px] mb-1" style={{ height: 16 }}>
              {weeks.map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="text-[9px] text-muted-foreground font-semibold leading-none select-none"
                  style={{
                    width: 12,
                    minWidth: 12,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {monthLabels.get(colIdx) ?? ""}
                </div>
              ))}
            </div>

            {/* Grid rows (Mon=0 .. Sun=6) */}
            {[0, 1, 2, 3, 4, 5, 6].map((dayRow) => (
              <div
                key={dayRow}
                className="flex gap-[3px]"
                style={{ marginBottom: 2 }}
              >
                {weeks.map((week, colIdx) => {
                  const cell = week[dayRow] ?? null;
                  const bg = cell ? cellBg(cell.count) : "transparent";
                  return (
                    <div
                      key={colIdx}
                      onMouseEnter={(e) => handleMouseEnter(e, cell)}
                      aria-label={
                        cell
                          ? `${cell.count} contributions on ${cell.dateStr}`
                          : undefined
                      }
                      style={{
                        width: 12,
                        height: 12,
                        minWidth: 12,
                        minHeight: 12,
                        borderRadius: 2,
                        backgroundColor: bg,
                        cursor: cell ? "default" : "default",
                        transition: "transform 0.1s",
                        visibility: cell ? "visible" : "hidden",
                      }}
                      onMouseOver={(e) => {
                        if (cell)
                          (e.currentTarget as HTMLDivElement).style.transform =
                            "scale(1.3)";
                      }}
                      onFocus={() => {}}
                      onBlur={() => {}}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "scale(1)";
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        {([0, 1, 2, 3, 4] as const).map((lvl) => (
          <div
            key={lvl}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: legendColor(lvl),
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
});
