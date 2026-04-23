import { memo, useMemo, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface QuizScoreEntry {
  date: string;
  moduleName: string;
  score: number;
  total: number;
}

export function loadQuizScoreHistory(): QuizScoreEntry[] {
  try {
    const raw = localStorage.getItem("cc_quiz_history");
    if (!raw) return [];
    return JSON.parse(raw) as QuizScoreEntry[];
  } catch {
    return [];
  }
}

export function appendQuizScore(entry: QuizScoreEntry) {
  const history = loadQuizScoreHistory();
  history.push(entry);
  localStorage.setItem("cc_quiz_history", JSON.stringify(history));
}

// ── SVG chart ────────────────────────────────────────────────────────────────

const CHART_W = 560;
const CHART_H = 180;
const PAD_L = 36;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 28;
const INNER_W = CHART_W - PAD_L - PAD_R;
const INNER_H = CHART_H - PAD_T - PAD_B;

function yPos(score: number) {
  return PAD_T + INNER_H - (score / 100) * INNER_H;
}

function xPos(index: number, total: number) {
  if (total <= 1) return PAD_L + INNER_W / 2;
  return PAD_L + (index / (total - 1)) * INNER_W;
}

function scoreColor(pct: number): string {
  if (pct >= 80) return "oklch(0.75 0.18 145)"; // green
  if (pct >= 60) return "oklch(0.78 0.18 80)"; // yellow
  return "oklch(0.65 0.22 25)"; // red
}

interface HoveredPoint {
  x: number;
  y: number;
  label: string;
  svgX: number;
  svgY: number;
}

interface Props {
  filter?: string;
  onFilterChange?: (v: string) => void;
}

export default memo(function QuizScoreChart({
  filter = "all",
  onFilterChange,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<HoveredPoint | null>(null);

  const rawHistory = useMemo(() => loadQuizScoreHistory(), []);

  const moduleNames = useMemo(() => {
    const names = Array.from(new Set(rawHistory.map((e) => e.moduleName)));
    return names;
  }, [rawHistory]);

  const data = useMemo(() => {
    const filtered =
      filter === "all"
        ? rawHistory
        : rawHistory.filter((e) => e.moduleName === filter);
    // Last 30 attempts
    const sliced = filtered.slice(-30);
    return sliced.map((e, i) => {
      const pct = Math.round((e.score / Math.max(e.total, 1)) * 100);
      return {
        index: i,
        pct,
        label: `Quiz #${i + 1} — ${e.moduleName} — ${pct}%`,
        date: e.date,
      };
    });
  }, [rawHistory, filter]);

  // Build SVG polyline points
  const points = data.map((d) => ({
    x: xPos(d.index, data.length),
    y: yPos(d.pct),
    ...d,
  }));

  // Average score
  const avgPct = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.round(data.reduce((s, d) => s + d.pct, 0) / data.length);
  }, [data]);

  // Adaptive learning: last 3 scores all below 60%
  const showAdaptiveBanner = useMemo(() => {
    if (data.length < 3) return false;
    const last3 = data.slice(-3);
    return last3.every((d) => d.pct < 60);
  }, [data]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * CHART_W;
    let nearest = points[0];
    let minDist = Math.abs(points[0].x - mouseX);
    for (const p of points) {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }
    if (minDist > 30) {
      setHovered(null);
      return;
    }
    setHovered({
      x: (nearest.x / CHART_W) * rect.width + rect.left - rect.left,
      y: (nearest.y / CHART_H) * rect.height,
      label: nearest.label,
      svgX: nearest.x,
      svgY: nearest.y,
    });
  };

  if (rawHistory.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-10 rounded-xl bg-muted/30 border border-dashed border-border text-center"
        data-ocid="quiz-score-chart.empty_state"
      >
        <div className="text-3xl mb-2">📊</div>
        <p className="text-sm font-medium text-foreground">
          No quiz history yet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Complete your first quiz to see your score history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-ocid="quiz-score-chart.section">
      {/* Adaptive learning banner */}
      {showAdaptiveBanner && (
        <div
          className="flex items-center gap-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 px-4 py-2.5"
          data-ocid="quiz-score-chart.adaptive_banner"
        >
          <span className="text-lg shrink-0">⚠️</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
              Consider revisiting this topic
            </p>
            <p className="text-[11px] text-muted-foreground">
              Your last 3 scores are below 60%. Review the lesson before
              continuing.
            </p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">
          Filter:
        </span>
        <button
          type="button"
          onClick={() => onFilterChange?.("all")}
          className={`text-xs px-3 py-1 rounded-full border font-semibold transition-colors ${
            filter === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted text-muted-foreground border-border hover:border-primary/40"
          }`}
          data-ocid="quiz-score-chart.filter_all"
        >
          All Modules
        </button>
        {moduleNames.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onFilterChange?.(name)}
            className={`text-xs px-3 py-1 rounded-full border font-semibold transition-colors truncate max-w-[140px] ${
              filter === name
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:border-primary/40"
            }`}
            data-ocid={`quiz-score-chart.filter_${name}`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 rounded-xl bg-muted/30 border border-dashed border-border">
          <p className="text-xs text-muted-foreground">
            No quizzes for this module
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-border bg-card">
          {/* Hover tooltip */}
          {hovered && (
            <div
              className="absolute z-10 pointer-events-none bg-card border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground shadow-lg whitespace-nowrap"
              style={{
                left: hovered.x,
                top: hovered.y,
                transform: "translate(-50%, -110%)",
              }}
            >
              {hovered.label}
            </div>
          )}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHovered(null)}
            role="img"
            aria-label="Quiz score history chart"
          >
            {/* Background color zones */}
            {/* Red zone: 0-60% */}
            <rect
              x={PAD_L}
              y={yPos(60)}
              width={INNER_W}
              height={yPos(0) - yPos(60)}
              fill="rgba(239,68,68,0.06)"
            />
            {/* Yellow zone: 60-80% */}
            <rect
              x={PAD_L}
              y={yPos(80)}
              width={INNER_W}
              height={yPos(60) - yPos(80)}
              fill="rgba(234,179,8,0.06)"
            />
            {/* Green zone: 80-100% */}
            <rect
              x={PAD_L}
              y={PAD_T}
              width={INNER_W}
              height={yPos(80) - PAD_T}
              fill="rgba(34,197,94,0.06)"
            />

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((tick) => (
              <g key={tick}>
                <line
                  x1={PAD_L}
                  y1={yPos(tick)}
                  x2={PAD_L + INNER_W}
                  y2={yPos(tick)}
                  stroke="rgba(148,163,184,0.12)"
                  strokeWidth="1"
                />
                <text
                  x={PAD_L - 4}
                  y={yPos(tick) + 3.5}
                  textAnchor="end"
                  fontSize="9"
                  fill="rgba(148,163,184,0.6)"
                >
                  {tick}
                </text>
              </g>
            ))}

            {/* Average dashed line */}
            {data.length > 1 && (
              <g>
                <line
                  x1={PAD_L}
                  y1={yPos(avgPct)}
                  x2={PAD_L + INNER_W}
                  y2={yPos(avgPct)}
                  stroke="rgba(148,163,184,0.5)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
                <text
                  x={PAD_L + INNER_W + 2}
                  y={yPos(avgPct) + 3.5}
                  textAnchor="start"
                  fontSize="8"
                  fill="rgba(148,163,184,0.7)"
                >
                  avg
                </text>
              </g>
            )}

            {/* X axis labels */}
            {points.map((p, i) => {
              if (points.length > 10 && i % Math.ceil(points.length / 10) !== 0)
                return null;
              return (
                <text
                  key={i}
                  x={p.x}
                  y={CHART_H - PAD_B + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="rgba(148,163,184,0.6)"
                >
                  {i + 1}
                </text>
              );
            })}

            {/* Line — color segments by score */}
            {points.length > 1 &&
              points.slice(1).map((p, i) => {
                const prev = points[i];
                const midPct = (prev.pct + p.pct) / 2;
                return (
                  <line
                    key={i}
                    x1={prev.x}
                    y1={prev.y}
                    x2={p.x}
                    y2={p.y}
                    stroke={scoreColor(midPct)}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                );
              })}

            {/* Data points */}
            {points.map((p, i) => {
              const isHovered = hovered?.svgX === p.x && hovered?.svgY === p.y;
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5.5 : 3.5}
                  fill={scoreColor(p.pct)}
                  stroke="white"
                  strokeWidth={isHovered ? 2 : 1.5}
                  style={{ transition: "r 0.15s ease" }}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Score summary */}
      {data.length > 0 && (
        <div className="flex gap-3 text-xs flex-wrap">
          {[
            {
              label: "Best",
              value: `${Math.max(...data.map((d) => d.pct))}%`,
              color: "text-green-500",
            },
            {
              label: "Avg",
              value: `${avgPct}%`,
              color: "text-primary",
            },
            {
              label: "Worst",
              value: `${Math.min(...data.map((d) => d.pct))}%`,
              color: "text-red-400",
            },
            {
              label: "Quizzes",
              value: String(data.length),
              color: "text-muted-foreground",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-muted/40 border border-border px-3 py-1.5 flex items-center gap-1.5"
            >
              <span className="text-muted-foreground">{s.label}:</span>
              <span className={`font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zone legend */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500/30 inline-block" />
          Below 60%
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-yellow-500/30 inline-block" />
          60–80%
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-green-500/30 inline-block" />
          Above 80%
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 border-t-2 border-dashed border-muted-foreground/50 inline-block" />
          Average
        </div>
      </div>
    </div>
  );
});
