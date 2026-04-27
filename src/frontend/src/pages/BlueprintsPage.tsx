import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BLUEPRINT_CATEGORIES,
  BLUEPRINT_DOMAINS,
  type BlueprintDomain,
  type BlueprintNode,
} from "../data/blueprintsData";

// ─── Types ────────────────────────────────────────────────────────────────────
type NodeStatus = "not-started" | "in-progress" | "completed";
type DiffFilter = "all" | "beginner" | "intermediate" | "advanced";
type CategoryFilter = (typeof BLUEPRINT_CATEGORIES)[number]["id"];

interface NodeProgress {
  status: NodeStatus;
  bookmarked: boolean;
}

interface NodeComment {
  id: string;
  text: string;
  author: string;
  timestamp: number;
}

// ─── Progress utils ───────────────────────────────────────────────────────────
function getNodeProgress(domainId: string, nodeId: string): NodeProgress {
  try {
    const raw = localStorage.getItem(
      `blueprint_progress_${domainId}_${nodeId}`,
    );
    if (raw) return JSON.parse(raw) as NodeProgress;
  } catch {
    /* ignore */
  }
  return { status: "not-started", bookmarked: false };
}

function setNodeProgress(
  domainId: string,
  nodeId: string,
  progress: NodeProgress,
) {
  localStorage.setItem(
    `blueprint_progress_${domainId}_${nodeId}`,
    JSON.stringify(progress),
  );
}

function getDomainProgress(domain: BlueprintDomain): number {
  const total = domain.nodes.length;
  if (total === 0) return 0;
  const done = domain.nodes.filter(
    (n) => getNodeProgress(domain.id, n.id).status === "completed",
  ).length;
  return Math.round((done / total) * 100);
}

function getNodeComments(nodeId: string): NodeComment[] {
  try {
    const raw = localStorage.getItem(`blueprint_comments_${nodeId}`);
    if (raw) return JSON.parse(raw) as NodeComment[];
  } catch {
    /* ignore */
  }
  return [];
}

function addNodeComment(nodeId: string, text: string): NodeComment[] {
  const existing = getNodeComments(nodeId);
  const comment: NodeComment = {
    id: `c${Date.now()}`,
    text,
    author: localStorage.getItem("cc_username") || "You",
    timestamp: Date.now(),
  };
  const updated = [...existing, comment];
  localStorage.setItem(`blueprint_comments_${nodeId}`, JSON.stringify(updated));
  return updated;
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
const DIFF_BADGE: Record<
  BlueprintNode["difficulty"],
  { cls: string; label: string }
> = {
  beginner: {
    cls: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
    label: "Beginner",
  },
  intermediate: {
    cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400",
    label: "Intermediate",
  },
  advanced: {
    cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    label: "Advanced",
  },
};

function DiffBadge({ level }: { level: BlueprintNode["difficulty"] }) {
  const d = DIFF_BADGE[level];
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${d.cls}`}
    >
      {d.label}
    </span>
  );
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  NodeStatus,
  { label: string; color: string; icon: string }
> = {
  "not-started": { label: "Not Started", color: "#94a3b8", icon: "○" },
  "in-progress": { label: "In Progress", color: "#3b82f6", icon: "◑" },
  completed: { label: "Completed", color: "#22c55e", icon: "●" },
};

// ─── Node type style ──────────────────────────────────────────────────────────
const NODE_TYPE_STYLE: Record<
  BlueprintNode["type"],
  { border: string; label: string }
> = {
  required: { border: "border-solid border-2", label: "Required" },
  optional: { border: "border-dashed border-2", label: "Optional" },
  bonus: { border: "border-dotted border-2", label: "Bonus" },
};

// ─── AI Recommendation Modal ──────────────────────────────────────────────────
function AIRecommendModal({
  onClose,
  onSelectDomain,
}: {
  onClose: () => void;
  onSelectDomain: (domain: BlueprintDomain) => void;
}) {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<BlueprintDomain[]>([]);

  const handleSubmit = useCallback(async () => {
    if (!goal.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const lower = goal.toLowerCase();
    const scored = BLUEPRINT_DOMAINS.map((d) => {
      let score = 0;
      if (lower.includes(d.name.toLowerCase())) score += 10;
      if (lower.includes("web") && d.category === "web") score += 5;
      if (lower.includes("mobile") && d.category === "mobile") score += 5;
      if (lower.includes("data") && d.category === "data") score += 5;
      if (lower.includes("security") && d.category === "security") score += 5;
      if (lower.includes("design") && d.category === "design") score += 5;
      if (lower.includes("cloud") && d.id === "cloud") score += 7;
      if (lower.includes("frontend") && d.id === "frontend") score += 8;
      if (lower.includes("backend") && d.id === "backend") score += 8;
      if (lower.includes("fullstack") || lower.includes("full stack")) {
        if (d.id === "fullstack") score += 10;
      }
      if (
        lower.includes("machine learning") ||
        lower.includes("ml") ||
        lower.includes("ai")
      ) {
        if (d.id === "ml") score += 8;
      }
      if (lower.includes("game") && d.id === "gamedev") score += 8;
      if (lower.includes("android") && d.id === "android") score += 8;
      if (lower.includes("ios") && d.id === "ios") score += 8;
      if (
        lower.includes("beginner") ||
        lower.includes("start") ||
        lower.includes("new")
      ) {
        if (d.difficulty === "beginner") score += 4;
      }
      score += Math.random() * 2;
      return { domain: d, score };
    });
    scored.sort((a, b) => b.score - a.score);
    setRecommendations(scored.slice(0, 3).map((s) => s.domain));
    setLoading(false);
  }, [goal]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-ocid="blueprints.ai_modal.dialog"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div
          className="px-6 py-5 border-b border-border"
          style={{
            background: "linear-gradient(135deg, #7c3aed20 0%, #4f46e510 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                🤖 AI Recommendation
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tell us your goal — we'll pick your path
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center text-muted-foreground transition-colors"
              aria-label="Close"
              data-ocid="blueprints.ai_modal.close_button"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label
              htmlFor="ai-goal-input"
              className="text-xs font-semibold text-foreground mb-1.5 block"
            >
              What is your goal?
            </label>
            <textarea
              id="ai-goal-input"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. I want to become a frontend developer, I want to learn machine learning, I'm a beginner wanting to build mobile apps..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary resize-none transition-colors"
              data-ocid="blueprints.ai_modal.goal_input"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!goal.trim() || loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            data-ocid="blueprints.ai_modal.submit_button"
          >
            {loading ? "Analyzing your goal…" : "Get My Roadmap"}
          </button>
          <AnimatePresence>
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Top Recommendations
                </p>
                {recommendations.map((domain, i) => (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => {
                      onSelectDomain(domain);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-muted/40 transition-colors text-left"
                    data-ocid={`blueprints.ai_modal.recommendation.${i + 1}`}
                  >
                    <span className="text-2xl">{domain.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">
                        {domain.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {domain.description}
                      </p>
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: domain.color }}
                    >
                      #{i + 1}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Node Detail Side Panel ───────────────────────────────────────────────────
function NodeDetailPanel({
  node,
  domain,
  onClose,
  onViewDocs,
}: {
  node: BlueprintNode;
  domain: BlueprintDomain;
  onClose: () => void;
  onViewDocs: () => void;
}) {
  const [progress, setProgress] = useState<NodeProgress>(() =>
    getNodeProgress(domain.id, node.id),
  );
  const [comments, setComments] = useState<NodeComment[]>(() =>
    getNodeComments(node.id),
  );
  const [commentText, setCommentText] = useState("");

  const handleStatusChange = (status: NodeStatus) => {
    const updated = { ...progress, status };
    setProgress(updated);
    setNodeProgress(domain.id, node.id, updated);
  };

  const handleBookmark = () => {
    const updated = { ...progress, bookmarked: !progress.bookmarked };
    setProgress(updated);
    setNodeProgress(domain.id, node.id, updated);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const updated = addNodeComment(node.id, commentText.trim());
    setComments(updated);
    setCommentText("");
  };

  const typeStyle = NODE_TYPE_STYLE[node.type];

  return (
    <motion.div
      key={node.id}
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 340, damping: 32 }}
      className="w-full max-w-sm bg-background border-l border-border flex flex-col overflow-hidden shadow-2xl"
      data-ocid="blueprints.node_detail.dialog"
    >
      {/* Header */}
      <div
        className="shrink-0 px-5 py-4 border-b border-border"
        style={{
          background: `linear-gradient(135deg, ${domain.color}18 0%, transparent 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <DiffBadge level={node.difficulty} />
              <span className="text-[11px] text-muted-foreground">
                ⏱ {node.estimatedTime}
              </span>
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded border"
                style={{
                  color: domain.color,
                  borderColor: `${domain.color}40`,
                  background: `${domain.color}10`,
                }}
              >
                {typeStyle.label}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-foreground leading-tight">
              {node.label}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              <span style={{ color: domain.color }}>{domain.name}</span> ·{" "}
              {node.section}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleBookmark}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                progress.bookmarked
                  ? "text-amber-500 bg-amber-100 dark:bg-amber-900/30"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              aria-label={progress.bookmarked ? "Remove bookmark" : "Bookmark"}
              data-ocid="blueprints.node_detail.bookmark_button"
            >
              {progress.bookmarked ? "★" : "☆"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center text-muted-foreground transition-colors"
              aria-label="Close"
              data-ocid="blueprints.node_detail.close_button"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-4 space-y-5 pb-8">
          <p className="text-sm text-foreground leading-relaxed">
            {node.description}
          </p>

          {/* Status selector */}
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              📋 Status
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {(
                ["not-started", "in-progress", "completed"] as NodeStatus[]
              ).map((s) => {
                const c = STATUS_CONFIG[s];
                const isActive = progress.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(s)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                    style={
                      isActive
                        ? {
                            background: `${c.color}20`,
                            borderColor: c.color,
                            color: c.color,
                          }
                        : {}
                    }
                    data-ocid={`blueprints.node_detail.status.${s}`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Concepts */}
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              🔑 Key Concepts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {node.keyConcepts.map((kc) => (
                <span
                  key={kc}
                  className="text-[11px] px-2.5 py-1 rounded-full border"
                  style={{
                    color: domain.color,
                    borderColor: `${domain.color}30`,
                    background: `${domain.color}10`,
                  }}
                >
                  {kc}
                </span>
              ))}
            </div>
          </div>

          {/* Type note */}
          <div
            className="rounded-xl px-4 py-3 text-xs leading-relaxed"
            style={{
              background: `${domain.color}10`,
              border: `1px solid ${domain.color}25`,
            }}
          >
            <span className="font-bold" style={{ color: domain.color }}>
              {typeStyle.label} topic
            </span>
            {node.type === "required" &&
              " — Essential for this learning path. Do not skip."}
            {node.type === "optional" &&
              " — Recommended to deepen your understanding."}
            {node.type === "bonus" && " — Nice-to-have for advanced learners."}
          </div>

          {/* View Docs CTA */}
          <button
            type="button"
            onClick={onViewDocs}
            className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 shadow-md hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${domain.color} 0%, ${domain.color}cc 100%)`,
            }}
            data-ocid="blueprints.node_detail.view_docs_button"
          >
            📖 View in Documentation
          </button>

          {/* Comments */}
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
              💬 Community ({comments.length})
            </p>
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No comments yet. Be the first!
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="bg-muted/40 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-foreground">
                        {c.author}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(c.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/80">{c.text}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddComment();
                }}
                placeholder="Add a comment…"
                className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                data-ocid="blueprints.node_detail.comment_input"
              />
              <button
                type="button"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-40"
                style={{ background: domain.color }}
                data-ocid="blueprints.node_detail.comment_submit_button"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Node Card ────────────────────────────────────────────────────────────────
function NodeCard({
  node,
  domainId,
  domainColor,
  onClick,
}: {
  node: BlueprintNode;
  domainId: string;
  domainColor: string;
  onClick: () => void;
}) {
  const [progress, setProgress] = useState(() =>
    getNodeProgress(domainId, node.id),
  );
  const typeStyle = NODE_TYPE_STYLE[node.type];
  const statusConfig = STATUS_CONFIG[progress.status];

  const handleFocus = () => {
    setProgress(getNodeProgress(domainId, node.id));
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onFocus={handleFocus}
      className={`
        group relative text-left w-full rounded-xl px-3.5 py-3 transition-all duration-150
        ${typeStyle.border}
        hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
      `}
      style={{
        borderColor: `${domainColor}60`,
        background:
          progress.status === "completed"
            ? `${domainColor}08`
            : progress.status === "in-progress"
              ? `${domainColor}05`
              : "var(--background)",
      }}
      data-ocid={`blueprints.node.${node.id}`}
      aria-label={`${node.label} — ${node.difficulty}`}
    >
      <div
        className="absolute top-2.5 right-2.5 w-4 h-4 flex items-center justify-center text-[11px]"
        style={{ color: statusConfig.color }}
        title={statusConfig.label}
      >
        {statusConfig.icon}
      </div>
      <div className="flex items-start gap-2 mb-1.5 pr-5">
        <span className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors flex-1">
          {node.label}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
        {node.description}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <DiffBadge level={node.difficulty} />
        <span className="text-[10px] text-muted-foreground">
          ⏱ {node.estimatedTime}
        </span>
        {progress.bookmarked && (
          <span className="text-amber-500 text-[11px]">★</span>
        )}
        <span
          className="ml-auto text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: domainColor }}
        >
          Details →
        </span>
      </div>
    </motion.button>
  );
}

// ─── Section connector ────────────────────────────────────────────────────────
function SectionConnector({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex flex-col items-center gap-0.5">
        <div
          className="w-0.5 h-3 rounded-full"
          style={{ background: `${color}60` }}
        />
        <div
          className="w-1.5 h-1.5 rounded-full border"
          style={{ borderColor: `${color}80`, background: `${color}30` }}
        />
        <div
          className="w-0.5 h-3 rounded-full"
          style={{ background: `${color}60` }}
        />
      </div>
    </div>
  );
}

// ─── Domain roadmap ───────────────────────────────────────────────────────────
function DomainRoadmap({
  domain,
  onNodeClick,
  progressKey,
}: {
  domain: BlueprintDomain;
  onNodeClick: (node: BlueprintNode) => void;
  progressKey: number;
}) {
  const sections = useMemo(() => {
    const map = new Map<string, BlueprintNode[]>();
    for (const node of domain.nodes) {
      const arr = map.get(node.section) ?? [];
      arr.push(node);
      map.set(node.section, arr);
    }
    return Array.from(map.entries());
  }, [domain.nodes]);

  return (
    <div
      className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-6 pb-4 pt-4"
      key={progressKey}
    >
      <div className="max-w-2xl mx-auto space-y-0">
        {sections.map(([sectionName, nodes], sIdx) => (
          <div key={sectionName}>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sIdx * 0.06 }}
              className="flex items-center gap-3 mb-3"
            >
              <div
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                style={{
                  background: `${domain.color}20`,
                  color: domain.color,
                  border: `1px solid ${domain.color}30`,
                }}
              >
                {sectionName}
              </div>
              <div
                className="flex-1 h-px opacity-20"
                style={{ background: domain.color }}
              />
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              {nodes.map((node, nIdx) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sIdx * 0.06 + nIdx * 0.04 }}
                >
                  <NodeCard
                    node={node}
                    domainId={domain.id}
                    domainColor={domain.color}
                    onClick={() => onNodeClick(node)}
                  />
                </motion.div>
              ))}
            </div>
            {sIdx < sections.length - 1 && (
              <SectionConnector color={domain.color} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Domain grid card ─────────────────────────────────────────────────────────
function DomainGridCard({
  domain,
  onClick,
}: {
  domain: BlueprintDomain;
  onClick: () => void;
}) {
  const pct = getDomainProgress(domain);
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-card border border-border rounded-2xl p-4 text-left hover:shadow-lg transition-all w-full flex flex-col h-full"
      data-ocid={`blueprints.domain_card.${domain.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{
            background: `${domain.color}20`,
            border: `1.5px solid ${domain.color}40`,
          }}
        >
          {domain.icon}
        </div>
        <div className="flex flex-col items-end gap-1">
          <DiffBadge level={domain.difficulty} />
          {pct > 0 && (
            <span
              className="text-[10px] font-semibold"
              style={{ color: domain.color }}
            >
              {pct}% done
            </span>
          )}
        </div>
      </div>
      <h3 className="font-bold text-foreground text-sm leading-tight mb-1">
        {domain.name}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3 flex-1">
        {domain.description}
      </p>
      {pct > 0 && (
        <div className="w-full bg-muted rounded-full h-1 mb-2">
          <div
            className="h-1 rounded-full transition-all"
            style={{ width: `${pct}%`, background: domain.color }}
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${domain.color}15`, color: domain.color }}
        >
          {domain.nodes.length} topics
        </span>
        <span className="text-[11px] text-muted-foreground">
          ~{domain.estimatedHours}h
        </span>
        <span className="text-xs text-muted-foreground ml-auto">Explore →</span>
      </div>
    </motion.button>
  );
}

// ─── Domain sidebar item ──────────────────────────────────────────────────────
function DomainSidebarItem({
  domain,
  isSelected,
  onClick,
}: {
  domain: BlueprintDomain;
  isSelected: boolean;
  onClick: () => void;
}) {
  const pct = getDomainProgress(domain);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
        isSelected ? "shadow-sm" : "hover:bg-muted/50"
      }`}
      style={
        isSelected
          ? {
              background: `${domain.color}15`,
              border: `1.5px solid ${domain.color}40`,
            }
          : { border: "1.5px solid transparent" }
      }
      data-ocid={`blueprints.sidebar.${domain.id}`}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
        style={{
          background: `${domain.color}20`,
          border: `1px solid ${domain.color}30`,
        }}
      >
        {domain.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-semibold truncate ${isSelected ? "" : "text-muted-foreground"}`}
          style={isSelected ? { color: domain.color } : {}}
        >
          {domain.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-[10px] text-muted-foreground">
            {domain.nodes.length} topics
          </p>
          {pct > 0 && (
            <div className="flex-1 bg-muted rounded-full h-0.5">
              <div
                className="h-0.5 rounded-full"
                style={{ width: `${pct}%`, background: domain.color }}
              />
            </div>
          )}
        </div>
      </div>
      {isSelected && (
        <div
          className="w-1.5 h-5 rounded-full shrink-0"
          style={{ background: domain.color }}
        />
      )}
    </button>
  );
}

// ─── Main BlueprintsPage ──────────────────────────────────────────────────────
export default function BlueprintsPage({
  onBack,
  onNavigateToRoadmap,
}: {
  onBack: () => void;
  onNavigateToRoadmap?: () => void;
}) {
  const [selectedDomain, setSelectedDomain] = useState<BlueprintDomain | null>(
    null,
  );
  const [selectedNode, setSelectedNode] = useState<BlueprintNode | null>(null);
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [showAIModal, setShowAIModal] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleNodeClose = useCallback(() => {
    setSelectedNode(null);
    setProgressKey((k) => k + 1);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: progressKey drives recalculation on status changes
  const domainProgress = useMemo(
    () => (selectedDomain ? getDomainProgress(selectedDomain) : 0),
    [selectedDomain, progressKey],
  );

  const filteredDomains = useMemo(() => {
    const q = search.toLowerCase();
    return BLUEPRINT_DOMAINS.filter((d) => {
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.nodes.some(
          (n) =>
            n.label.toLowerCase().includes(q) ||
            n.keyConcepts.some((k) => k.toLowerCase().includes(q)),
        );
      const matchDiff = diffFilter === "all" || d.difficulty === diffFilter;
      const matchCat =
        categoryFilter === "all" || d.category === categoryFilter;
      return matchSearch && matchDiff && matchCat;
    });
  }, [search, diffFilter, categoryFilter]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedNode) handleNodeClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedNode, handleNodeClose]);

  // Suppress unused ref warning
  void searchRef;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-background">
      {/* Top header */}
      <header
        className="shrink-0 px-4 py-3 flex items-center gap-3 border-b border-border/50"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
          aria-label="Back to Problems"
          data-ocid="blueprints.back_button"
        >
          ←
        </button>
        <span className="text-xl">🗺️</span>
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-white text-sm leading-tight">
            Blueprints
          </h1>
          <p className="text-white/70 text-[10px] truncate">
            {selectedDomain
              ? `${selectedDomain.name} · ${selectedDomain.nodes.length} topics`
              : `${BLUEPRINT_DOMAINS.length} interactive learning roadmaps`}
          </p>
        </div>
        {selectedDomain ? (
          <button
            type="button"
            onClick={() => {
              setSelectedDomain(null);
              setSelectedNode(null);
            }}
            className="text-white/80 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
            data-ocid="blueprints.all_domains_button"
          >
            All Domains
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAIModal(true)}
            className="text-white/90 hover:text-white text-xs font-semibold bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-lg transition-colors shrink-0 flex items-center gap-1"
            data-ocid="blueprints.ai_recommend_button"
          >
            🤖 AI Pick
          </button>
        )}
      </header>

      {/* Breadcrumb */}
      <div className="shrink-0 px-4 py-1.5 bg-muted/30 border-b border-border flex items-center gap-1.5 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-foreground transition-colors"
          data-ocid="blueprints.breadcrumb.problems"
        >
          Problems
        </button>
        <span>›</span>
        <button
          type="button"
          onClick={() => {
            setSelectedDomain(null);
            setSelectedNode(null);
          }}
          className={
            selectedDomain
              ? "hover:text-foreground transition-colors"
              : "text-foreground font-semibold"
          }
          data-ocid="blueprints.breadcrumb.blueprints"
        >
          Blueprints
        </button>
        {selectedDomain && (
          <>
            <span>›</span>
            <span className="text-foreground font-semibold truncate">
              {selectedDomain.name}
            </span>
          </>
        )}
      </div>

      {/* Main content */}
      {!selectedDomain ? (
        /* ─── LANDING GRID ─── */
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-screen-xl mx-auto px-3 sm:px-5 py-4 space-y-4 pb-nav-safe">
            {/* Hero */}
            <div
              className="rounded-2xl p-5 border"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed12 0%, #4f46e508 100%)",
                borderColor: "#7c3aed30",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-foreground mb-1">
                    🗺️ Explore Learning Blueprints
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Visual, interactive learning roadmaps for every career path.
                    Click any domain to explore its full topic graph, then click
                    any node for concepts, difficulty, and estimated time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAIModal(true)}
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  }}
                  data-ocid="blueprints.ai_recommend_banner_button"
                >
                  🤖 AI Suggest
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search domains, topics, or skills…"
                className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                data-ocid="blueprints.search_input"
              />
            </div>

            {/* Filters */}
            <div className="space-y-2">
              <div className="flex gap-1.5 flex-wrap">
                {(
                  [
                    "all",
                    "beginner",
                    "intermediate",
                    "advanced",
                  ] as DiffFilter[]
                ).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiffFilter(d)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      diffFilter === d
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/50"
                    }`}
                    data-ocid={`blueprints.filter.diff.${d}`}
                  >
                    {d === "all"
                      ? "All Levels"
                      : d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
              <div
                className="flex gap-1.5 overflow-x-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {BLUEPRINT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all shrink-0 ${
                      categoryFilter === cat.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/50"
                    }`}
                    data-ocid={`blueprints.filter.cat.${cat.id}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong className="text-foreground">
                {filteredDomains.length}
              </strong>{" "}
              of{" "}
              <strong className="text-foreground">
                {BLUEPRINT_DOMAINS.length}
              </strong>{" "}
              domains ·{" "}
              <strong className="text-foreground">
                {filteredDomains.reduce((a, d) => a + d.nodes.length, 0)}
              </strong>{" "}
              total topics
            </div>

            {/* Grid */}
            {filteredDomains.length === 0 ? (
              <div
                className="text-center py-16"
                data-ocid="blueprints.empty_state"
              >
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-semibold text-foreground">
                  No domains match your filters
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try clearing filters or searching a different keyword
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDiffFilter("all");
                    setCategoryFilter("all");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                  data-ocid="blueprints.clear_filters_button"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredDomains.map((domain, i) => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <DomainGridCard
                      domain={domain}
                      onClick={() => setSelectedDomain(domain)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ─── DOMAIN VIEW ─── */
        <div className="flex-1 min-h-0 flex overflow-hidden relative">
          {/* Desktop sidebar */}
          <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-card overflow-hidden">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter domains…"
                  className="w-full pl-7 pr-3 h-8 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                  data-ocid="blueprints.sidebar.search_input"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {BLUEPRINT_DOMAINS.filter(
                (d) =>
                  !search ||
                  d.name.toLowerCase().includes(search.toLowerCase()),
              ).map((domain) => (
                <DomainSidebarItem
                  key={domain.id}
                  domain={domain}
                  isSelected={selectedDomain.id === domain.id}
                  onClick={() => {
                    setSelectedDomain(domain);
                    setSelectedNode(null);
                  }}
                />
              ))}
            </div>
          </aside>

          {/* Center: domain banner + roadmap */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {/* Domain header */}
            <div
              className="shrink-0 px-4 py-3 border-b border-border/30"
              style={{
                background: `linear-gradient(135deg, ${selectedDomain.color}dd 0%, ${selectedDomain.color}99 100%)`,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{selectedDomain.icon}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-extrabold text-white text-sm truncate">
                    {selectedDomain.name}
                  </h2>
                  <p className="text-white/70 text-[11px] truncate">
                    {selectedDomain.description}
                  </p>
                </div>
                <DiffBadge level={selectedDomain.difficulty} />
              </div>
              {/* Progress */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-white transition-all duration-500"
                    style={{ width: `${domainProgress}%` }}
                  />
                </div>
                <span className="text-white/80 text-[11px] font-semibold shrink-0">
                  {domainProgress}%
                </span>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {(["required", "optional", "bonus"] as const).map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 text-[10px] text-white/80 font-medium"
                  >
                    <span
                      className={`w-3 h-3 rounded-sm inline-block border ${
                        t === "required"
                          ? "border-solid"
                          : t === "optional"
                            ? "border-dashed"
                            : "border-dotted"
                      }`}
                      style={{
                        borderColor: "white",
                        background:
                          t === "required"
                            ? "rgba(255,255,255,0.25)"
                            : "transparent",
                      }}
                    />
                    {NODE_TYPE_STYLE[t].label}
                  </span>
                ))}
                <span className="text-[10px] text-white/60 ml-auto">
                  Tap any node
                </span>
              </div>
            </div>

            {/* Mobile domain tabs */}
            <div
              className="md:hidden shrink-0 w-full bg-card border-b border-border overflow-x-auto flex gap-1.5 px-3 py-2"
              style={{ scrollbarWidth: "none" }}
            >
              {BLUEPRINT_DOMAINS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setSelectedDomain(d);
                    setSelectedNode(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 text-xs font-semibold border transition-colors ${
                    selectedDomain.id === d.id
                      ? "text-white"
                      : "bg-card text-muted-foreground border-border"
                  }`}
                  style={
                    selectedDomain.id === d.id
                      ? { background: d.color, borderColor: d.color }
                      : {}
                  }
                  data-ocid={`blueprints.tab.${d.id}`}
                >
                  <span>{d.icon}</span>
                </button>
              ))}
            </div>

            {/* Roadmap */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDomain.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex-1 min-h-0 flex flex-col overflow-hidden"
              >
                <DomainRoadmap
                  domain={selectedDomain}
                  onNodeClick={(node) => setSelectedNode(node)}
                  progressKey={progressKey}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Node detail panel */}
          <AnimatePresence>
            {selectedNode && (
              <div
                className="absolute inset-0 z-30 flex justify-end bg-black/40 backdrop-blur-sm md:relative md:inset-auto md:bg-transparent md:backdrop-blur-none"
                onClick={(e) => {
                  if (e.target === e.currentTarget) handleNodeClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") handleNodeClose();
                }}
                role="presentation"
              >
                <NodeDetailPanel
                  node={selectedNode}
                  domain={selectedDomain}
                  onClose={handleNodeClose}
                  onViewDocs={() => {
                    handleNodeClose();
                    onNavigateToRoadmap?.();
                  }}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* AI modal */}
      <AnimatePresence>
        {showAIModal && (
          <AIRecommendModal
            onClose={() => setShowAIModal(false)}
            onSelectDomain={(domain) => {
              setSelectedDomain(domain);
              setSelectedNode(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
