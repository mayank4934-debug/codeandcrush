import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  BLUEPRINT_DOMAINS,
  type BlueprintDomain,
  type BlueprintNode,
} from "../data/blueprintsData";

// ─── Types ────────────────────────────────────────────────────────────────────
type NodeType = BlueprintNode["type"];
type Difficulty = BlueprintNode["difficulty"];

// ─── Node type visual config ──────────────────────────────────────────────────
const NODE_TYPE_STYLE: Record<
  NodeType,
  { border: string; bg: string; label: string }
> = {
  required: {
    border: "border-solid border-2",
    bg: "bg-card",
    label: "Required",
  },
  optional: {
    border: "border-dashed border-2",
    bg: "bg-muted/40",
    label: "Optional",
  },
  bonus: {
    border: "border-dotted border-2",
    bg: "bg-muted/20",
    label: "Bonus",
  },
};

const DIFF_BADGE: Record<Difficulty, string> = {
  beginner:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  intermediate:
    "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
};

// ─── Difficulty Badge ─────────────────────────────────────────────────────────
function DiffBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${DIFF_BADGE[level]}`}
    >
      {level}
    </span>
  );
}

// ─── Node Card ────────────────────────────────────────────────────────────────
function NodeCard({
  node,
  domainColor,
  onClick,
}: {
  node: BlueprintNode;
  domainColor: string;
  onClick: () => void;
}) {
  const typeStyle = NODE_TYPE_STYLE[node.type];
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        group relative text-left w-full rounded-xl px-3.5 py-3 transition-all duration-150
        ${typeStyle.border} ${typeStyle.bg}
        hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
      `}
      style={{ borderColor: `${domainColor}60` }}
      data-ocid={`blueprints.node.${node.id}`}
      aria-label={`${node.label} — ${node.difficulty}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
          {node.label}
        </span>
        <span
          className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border opacity-70"
          style={{
            color: domainColor,
            borderColor: `${domainColor}40`,
            background: `${domainColor}10`,
          }}
        >
          {typeStyle.label}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
        {node.description}
      </p>
      <div className="flex items-center gap-2">
        <DiffBadge level={node.difficulty} />
        <span className="text-[10px] text-muted-foreground">
          ⏱ {node.estimatedTime}
        </span>
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

// ─── Section Connector Line ───────────────────────────────────────────────────
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

// ─── Domain Roadmap View ──────────────────────────────────────────────────────
function DomainRoadmap({
  domain,
  onNodeClick,
}: {
  domain: BlueprintDomain;
  onNodeClick: (node: BlueprintNode) => void;
}) {
  // Group nodes by section, preserving order
  const sections = useMemo(() => {
    const sectionMap = new Map<string, BlueprintNode[]>();
    for (const node of domain.nodes) {
      const arr = sectionMap.get(node.section) ?? [];
      arr.push(node);
      sectionMap.set(node.section, arr);
    }
    return Array.from(sectionMap.entries());
  }, [domain.nodes]);

  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-3 sm:px-6 pb-nav-safe pt-4">
      <div className="max-w-2xl mx-auto space-y-0">
        {sections.map(([sectionName, nodes], sIdx) => (
          <div key={sectionName}>
            {/* Section header */}
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

            {/* Nodes in this section */}
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
                    domainColor={domain.color}
                    onClick={() => onNodeClick(node)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Connector between sections */}
            {sIdx < sections.length - 1 && (
              <SectionConnector color={domain.color} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Node Detail Drawer ───────────────────────────────────────────────────────
function NodeDetailDrawer({
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
  return (
    <AnimatePresence>
      <motion.div
        key={node.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        data-ocid="blueprints.node_detail.dialog"
      >
        <motion.div
          initial={{ x: 320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          className="w-full max-w-sm bg-background border-l border-border flex flex-col overflow-hidden shadow-2xl"
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
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <DiffBadge level={node.difficulty} />
                  <span className="text-[11px] text-muted-foreground">
                    ⏱ {node.estimatedTime}
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
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 w-8 h-8 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center text-muted-foreground transition-colors"
                aria-label="Close detail panel"
                data-ocid="blueprints.node_detail.close_button"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-4 space-y-5 pb-8">
              {/* Description */}
              <p className="text-sm text-foreground leading-relaxed">
                {node.description}
              </p>

              {/* Key Concepts */}
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                  🔑 Key Concepts
                </h3>
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
                  {NODE_TYPE_STYLE[node.type].label} topic
                </span>
                {node.type === "required" &&
                  " — Essential for this learning path. Do not skip."}
                {node.type === "optional" &&
                  " — Recommended to deepen your understanding."}
                {node.type === "bonus" &&
                  " — Nice-to-have for advanced learners."}
              </div>

              {/* View in docs */}
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
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Domain Sidebar Card ──────────────────────────────────────────────────────
function DomainSidebarItem({
  domain,
  isSelected,
  onClick,
}: {
  domain: BlueprintDomain;
  isSelected: boolean;
  onClick: () => void;
}) {
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
          className={`text-xs font-semibold truncate ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
          style={isSelected ? { color: domain.color } : {}}
        >
          {domain.name}
        </p>
        <p className="text-[10px] text-muted-foreground">
          {domain.nodes.length} topics
        </p>
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

// ─── Domain Grid Card ─────────────────────────────────────────────────────────
function DomainGridCard({
  domain,
  onClick,
}: {
  domain: BlueprintDomain;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-card border border-border rounded-2xl p-4 text-left hover:shadow-lg transition-shadow w-full"
      data-ocid={`blueprints.domain_card.${domain.id}`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
        style={{
          background: `${domain.color}20`,
          border: `1.5px solid ${domain.color}40`,
        }}
      >
        {domain.icon}
      </div>
      <h3 className="font-bold text-foreground text-sm leading-tight mb-1">
        {domain.name}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
        {domain.description}
      </p>
      <div className="flex items-center gap-2">
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: `${domain.color}15`, color: domain.color }}
        >
          {domain.nodes.length} topics
        </span>
        <span className="text-xs text-muted-foreground ml-auto">Explore →</span>
      </div>
    </motion.button>
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

  const filteredDomains = useMemo(
    () =>
      BLUEPRINT_DOMAINS.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.description.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

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
          <h1 className="font-extrabold text-white text-sm">Blueprints</h1>
          <p className="text-white/70 text-[10px]">
            {selectedDomain
              ? `${selectedDomain.name} · ${selectedDomain.nodes.length} topics`
              : `${BLUEPRINT_DOMAINS.length} interactive learning roadmaps`}
          </p>
        </div>
        {selectedDomain && (
          <button
            type="button"
            onClick={() => {
              setSelectedDomain(null);
              setSelectedNode(null);
            }}
            className="text-white/80 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg transition-colors"
            data-ocid="blueprints.all_domains_button"
          >
            All Domains
          </button>
        )}
      </header>

      {/* Breadcrumb */}
      <div className="shrink-0 px-4 py-1.5 bg-muted/30 border-b border-border flex items-center gap-1.5 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-foreground"
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
              ? "hover:text-foreground"
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

      {/* Main content — two layouts */}
      {!selectedDomain ? (
        /* ─── Domain Grid (no selection) ─────────────────────────────────── */
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-screen-lg mx-auto px-3 sm:px-5 py-4 space-y-4 pb-nav-safe">
            {/* Intro */}
            <div
              className="rounded-2xl p-4 border"
              style={{
                background:
                  "linear-gradient(135deg, #7c3aed12 0%, #4f46e508 100%)",
                borderColor: "#7c3aed30",
              }}
            >
              <p className="text-sm text-foreground leading-relaxed">
                🗺️ <strong>Blueprints</strong> gives you visual, interactive
                roadmaps for every domain — just like roadmap.sh. Select a
                domain to explore its topic graph, then click any node for key
                concepts, difficulty, and estimated time.
              </p>
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
                placeholder="Search domains..."
                className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                data-ocid="blueprints.search_input"
              />
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
                {BLUEPRINT_DOMAINS.reduce((a, d) => a + d.nodes.length, 0)}
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
                  No domains match
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different keyword
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredDomains.map((domain, i) => (
                  <motion.div
                    key={domain.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
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
        /* ─── Domain Selected: Sidebar + Roadmap ─────────────────────────── */
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Sidebar — hidden on mobile, shown on md+ */}
          <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-card overflow-y-auto">
            {/* Sidebar search */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter domains..."
                  className="w-full pl-7 pr-3 h-8 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                  data-ocid="blueprints.sidebar.search_input"
                />
              </div>
            </div>
            {/* Domain list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {BLUEPRINT_DOMAINS.filter((d) =>
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

          {/* Mobile domain tabs */}
          <div
            className="md:hidden shrink-0 w-full absolute bottom-16 left-0 right-0 z-10 bg-card border-t border-border overflow-x-auto flex gap-2 px-3 py-2"
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
                <span className="hidden sm:inline">{d.name}</span>
              </button>
            ))}
          </div>

          {/* Right main — domain roadmap */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {/* Domain header banner */}
            <div
              className="shrink-0 px-4 py-3 border-b border-border/30"
              style={{
                background: `linear-gradient(135deg, ${selectedDomain.color}dd 0%, ${selectedDomain.color}99 100%)`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedDomain.icon}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-extrabold text-white text-sm truncate">
                    {selectedDomain.name}
                  </h2>
                  <p className="text-white/70 text-[11px] truncate">
                    {selectedDomain.description}
                  </p>
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-3 mt-2.5 flex-wrap">
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
                  Tap any node to explore
                </span>
              </div>
            </div>

            {/* The roadmap */}
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
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Node Detail Drawer */}
      {selectedNode && selectedDomain && (
        <NodeDetailDrawer
          node={selectedNode}
          domain={selectedDomain}
          onClose={() => setSelectedNode(null)}
          onViewDocs={() => {
            setSelectedNode(null);
            onNavigateToRoadmap?.();
          }}
        />
      )}
    </div>
  );
}
