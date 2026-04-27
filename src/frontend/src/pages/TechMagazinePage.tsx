import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CATEGORY_ICONS,
  FALLBACK_MAGAZINE,
  GRADIENTS,
  MAGAZINE_FEED_URLS,
  type MagazineArticle,
  NEWS_CATEGORY_COLORS,
  type RssFeed,
  calcReadTime,
  isWithin24h,
  stripHtml,
  timeAgo,
} from "@/data/techNewsData";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Clock,
  ExternalLink,
  Filter,
  Grid3X3,
  LayoutList,
  RefreshCw,
  Search,
  Share2,
  TrendingUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Constants ─────────────────────────────────────────────────────────────────
const MAGAZINE_CATEGORIES = [
  "Artificial Intelligence",
  "Computing",
  "Biotechnology",
  "Climate",
  "Connectivity",
  "Business",
  "Design",
];

const EXTRA_FALLBACK: MagazineArticle[] = [
  {
    id: "mx1",
    category: "Artificial Intelligence",
    headline: "AI Ethics in 2026: When Machines Make Moral Decisions",
    byline: "Dr. Faridah Osei",
    readTime: "11 min",
    date: "May 2026",
    teaser:
      "As autonomous AI agents gain decision-making authority in healthcare, law, and finance, the philosophical frameworks that guided human ethics are being tested in ways their authors never imagined.",
    gradient: "from-violet-600 to-indigo-700",
    icon: "⚖️",
    pullQuote:
      '"We are encoding value judgments into systems that will affect billions of people. The question of whose values — and whose exceptions — is not academic."',
    relatedTitles: [],
    body: [
      "In the summer of 2025, a triage AI system at a leading hospital network made a recommendation that contradicted the attending physician. The doctor deferred. The patient survived. But in the weeks that followed, the medical team was left with an uncomfortable question: had the right decision been made for the right reasons?",
      "These are not hypothetical dilemmas. AI systems are making high-stakes recommendations every day in emergency rooms, parole hearings, credit offices, and insurance companies. And the ethical frameworks we apply to human decision-makers translate poorly to machine learners trained on historical data.",
      "Dr. Faridah Osei of the Oxford Centre for Technology Ethics has spent three years studying how organizations document the value trade-offs embedded in their AI systems. Her finding: most cannot articulate them. The decisions are made implicitly during model training, dataset curation, and threshold selection — often by engineers who have no explicit ethics mandate.",
      "The European Union's AI Act addresses some of this through mandatory documentation requirements. High-risk AI systems must maintain detailed technical documentation, including descriptions of the intended purpose, known limitations, and performance metrics across demographic subgroups. But documentation is not accountability. It describes what a system does; it does not determine whether what it does is right.",
      '"We are encoding value judgments into systems that will affect billions of people. The question of whose values — and whose exceptions — is not academic," Osei argues. "It has immediate, material consequences for real people."',
      "The most contested terrain is where optimization objectives diverge from human welfare. A recidivism prediction model optimized for accuracy in aggregate may systematically disadvantage specific populations even if it is never explicitly designed to. A content recommendation system optimized for engagement may amplify content that generates negative emotional responses because outrage drives clicks.",
      "Some technologists argue that the problem can be solved through better measurement. If we can quantify fairness, they argue, we can optimize for it. But Osei and others contend that fairness is not a single dimension that can be maximized. Different conceptions of fairness are mathematically incompatible.",
    ].join("\n\n"),
  },
  {
    id: "mx2",
    category: "Computing",
    headline:
      "Quantum Supremacy at Scale: What 2026's Breakthroughs Actually Mean",
    byline: "Prof. Helena Varga",
    readTime: "12 min",
    date: "May 2026",
    teaser:
      "IBM and Google both claim quantum advantage milestones. Here is a sober look at what those claims mean, what the path to practical quantum computers actually looks like, and why 2030 is the year to watch.",
    gradient: "from-cyan-600 to-blue-700",
    icon: "⚛️",
    pullQuote:
      '"Quantum advantage on a benchmark is not quantum advantage in practice. But it is a necessary step toward it."',
    relatedTitles: [],
    body: [
      "When IBM announced in March 2026 that its 1,121-qubit Eagle system had demonstrated quantum advantage on a class of optimization problems, the press coverage ranged from breathless to dismissive. Both responses missed the point.",
      "Quantum advantage claims are carefully scoped. They say that a quantum computer, on a specific class of problems, under specific conditions, produced correct results faster than classical algorithms running on the best available hardware. They do not say that quantum computers are generally more powerful. They do not say that encryption is broken. They do not say that pharmaceutical companies should fire their computational chemists.",
      "What they do say is that the scaling curves are moving in the right direction.",
      "The fundamental barrier to practical quantum computing is error correction. Today's qubits decohere on timescales of microseconds to milliseconds. Useful computations require millions of error-free gate operations. Bridging this gap requires encoding many physical qubits into a single logical qubit, with the logical qubit's error rate dramatically lower than any of its physical components.",
      '"Quantum advantage on a benchmark is not quantum advantage in practice. But it is a necessary step toward it," says Prof. Helena Varga of ETH Zurich. "The question is whether the engineering path from here to fault-tolerant quantum computation is tractable. I believe it is, but it requires a decade of sustained investment."',
      "The commercial implications remain speculative. The applications most often cited — drug discovery, materials science, logistics optimization, financial modeling — are real potential use cases. But most of them require fault-tolerant quantum computers with millions of logical qubits. We have thousands of physical qubits today.",
      "2030 is the year most serious quantum researchers cite as the earliest plausible date for fault-tolerant quantum computation at modest scale. That is not soon enough for the companies that have already spent billions on quantum hardware development.",
    ].join("\n\n"),
  },
  {
    id: "mx3",
    category: "Biotechnology",
    headline: "The Lab That Is Growing Human Organs in Bioreactors",
    byline: "Chiara Moretti",
    readTime: "10 min",
    date: "Apr 2026",
    teaser:
      "A team at Wake Forest Institute for Regenerative Medicine has successfully transplanted a lab-grown kidney into a human patient. The field of regenerative medicine has crossed a threshold.",
    gradient: "from-pink-600 to-rose-700",
    icon: "🧬",
    pullQuote:
      '"Every year, seventeen people die on transplant waiting lists in the United States alone. Bioprinting cannot solve all of those deaths, but it could solve many of them."',
    relatedTitles: [],
    body: [
      "The patient had been on dialysis for seven years. Her kidneys had failed at 34 due to a hereditary condition. By 2025, she had received four donor organs, each rejected within months despite aggressive immunosuppression. She was running out of options.",
      "In November 2025, she received a kidney grown from her own cells in a bioreactor at Wake Forest Institute for Regenerative Medicine. Six months later, she has discontinued dialysis. Her creatinine levels are normal. There are no signs of rejection.",
      "A single successful transplant is not a revolution. Organ bioprinting has been attempted in clinical contexts before with mixed results. But the Wake Forest outcome is notable for its approach: the kidney was not 3D-printed from scratch but bioengineered using a decellularized donor scaffold — a natural kidney stripped of all its cells and repopulated with the patient's own stem cells.",
      "The decellularized scaffold approach sidesteps one of the central challenges in organ bioprinting: vasculature. Kidneys are extraordinarily complex organs threaded with networks of blood vessels at scales that no current bioprinter can replicate. The natural scaffold maintains that architecture; the repopulation process restores function.",
      '"Every year, seventeen people die on transplant waiting lists in the United States alone. Bioprinting cannot solve all of those deaths, but it could solve many of them," says Dr. Anthony Atala, director of Wake Forest Institute.',
      "The immunological advantage is significant. Because the scaffold is repopulated with the patient's own cells, the immune system recognizes the organ as self. Rejection is dramatically less likely than with donor transplants. The patient in the Wake Forest trial requires only minimal immunosuppression — a fraction of the drugs that standard transplant recipients take.",
    ].join("\n\n"),
  },
  {
    id: "mx4",
    category: "Climate",
    headline: "Fusion Energy Crosses the Breakeven Threshold — Now What?",
    byline: "Dr. Pradeep Mehta",
    readTime: "9 min",
    date: "Apr 2026",
    teaser:
      "NIF's ignition achievement has been followed by a wave of private investment in fusion startups. But the engineering distance between scientific ignition and grid-scale fusion electricity remains enormous.",
    gradient: "from-emerald-600 to-teal-700",
    icon: "☀️",
    pullQuote:
      '"Fusion has always been thirty years away. Now, for the first time, I would say twenty years."',
    relatedTitles: [],
    body: [
      "In December 2022, the National Ignition Facility achieved fusion ignition for the first time in history: it produced more energy from a fusion reaction than the laser energy delivered to the target. By 2025, NIF had achieved ignition in a dozen experiments, with yields improving in each iteration.",
      "The response from the private sector has been extraordinary. More than $7 billion has been invested in fusion startups since 2022. Commonwealth Fusion Systems raised $1.8 billion on the strength of its high-temperature superconducting magnet technology. TAE Technologies, Helion Energy, and General Fusion have all passed significant milestones.",
      "But there is an enormous distance between scientific ignition and commercial electricity. The NIF laser delivers about two megajoules of energy to its target. The target releases about three megajoules in fusion energy. That looks like gain, but the laser itself requires more than 400 megajoules of electricity to fire. The system efficiency is roughly 0.7%.",
      "Getting from scientific breakeven to engineering breakeven — where the full system produces more electricity than it consumes — requires improvements across every component of the system: the driver, the target fabrication, the heat capture, and the electricity conversion.",
      '"Fusion has always been thirty years away. Now, for the first time, I would say twenty years," says Dr. Pradeep Mehta of ITER. "But twenty years assumes sustained investment and no major surprises. Both of those assumptions are fragile."',
    ].join("\n\n"),
  },
  {
    id: "mx5",
    category: "Business",
    headline: "The Startup Ecosystem After the AI Investment Supercycle",
    byline: "Laila Nkosi",
    readTime: "8 min",
    date: "Mar 2026",
    teaser:
      "2023–2025 saw unprecedented venture capital flow into AI startups. The hangover is beginning. Which companies will survive, and what does the consolidation tell us about how value is actually created in AI?",
    gradient: "from-amber-500 to-orange-600",
    icon: "📈",
    pullQuote:
      '"The companies that survive the AI correction will be the ones that solved a specific problem so well that switching costs made them irreplaceable."',
    relatedTitles: [],
    body: [
      "Between 2022 and 2025, more than $300 billion was invested in AI companies globally. The volume of capital created an unusual dynamic: companies that were months old raised nine-figure rounds, and companies building identical products raised similar amounts simultaneously.",
      "The correction began in late 2025. Several high-profile AI startups that had raised at billion-dollar-plus valuations quietly reduced headcount or pivoted. Others were quietly acquired at prices well below their last funding rounds. The companies that raised the most aggressively in 2023 are not necessarily the ones best positioned today.",
      "What separates the survivors from the casualties? Data advantage, switching costs, and specificity. The AI startups that are growing in 2026 have typically done one of three things: developed proprietary training data that competitors cannot easily replicate, integrated deeply enough into customer workflows that switching is expensive, or built for a specific vertical where generic AI performs poorly.",
      '"The companies that survive the AI correction will be the ones that solved a specific problem so well that switching costs made them irreplaceable," says Laila Nkosi of Sequoia.',
      "The foundation model market is consolidating rapidly. Three or four large foundation model providers appear likely to dominate the base layer. The value creation that remains open is in applications — but only applications that are hard to build, specific enough to require specialized training data, and deeply integrated into workflows.",
    ].join("\n\n"),
  },
  {
    id: "mx6",
    category: "Connectivity",
    headline:
      "Low-Earth Orbit Internet: Starlink, OneWeb, and the New Space Race",
    byline: "Marcus Aurelius Reed",
    readTime: "7 min",
    date: "Mar 2026",
    teaser:
      "SpaceX's Starlink has changed internet access for millions in underserved regions. But the proliferation of LEO satellites is also creating a new problem: space traffic management.",
    gradient: "from-blue-600 to-indigo-700",
    icon: "🛰️",
    pullQuote:
      '"Starlink has done more for global internet access in three years than fiber expansion did in a decade. But we are heading toward a tragedy of the commons in low Earth orbit."',
    relatedTitles: [],
    body: [
      "By early 2026, Starlink has more than 7,000 satellites in orbit and serves over 4 million subscribers in 75 countries. For users in rural Alaska, the Amazon basin, sub-Saharan Africa, and remote Pacific islands, it has been transformative — often the difference between having broadband internet and having no internet at all.",
      "The performance numbers are real. Starlink delivers median download speeds of 100–200 Mbps in most markets, with latency of 20–40 milliseconds. That is comparable to cable internet and dramatically better than previous satellite internet options, which delivered latency measured in seconds.",
      '"Starlink has done more for global internet access in three years than fiber expansion did in a decade. But we are heading toward a tragedy of the commons in low Earth orbit," says Marcus Reed of the Space Policy Institute.',
      "The orbital environment is becoming crowded. There are currently approximately 9,000 active satellites in orbit. Starlink, OneWeb, Amazon's Kuiper, and China's Guowang constellation have filed regulatory applications for tens of thousands more. The risk of Kessler syndrome — a cascade of collisions that renders entire orbital shells unusable — is not hypothetical.",
      "The ITU and national space agencies are actively working on space traffic management frameworks. But enforcement is difficult, the regulatory structure was designed for a world with hundreds of satellites, and the commercial incentives favor launching before the rules tighten.",
    ].join("\n\n"),
  },
  {
    id: "mx7",
    category: "Design",
    headline:
      "The Interface After Touch: How AI Is Reinventing Human-Computer Interaction",
    byline: "Dr. Sofia Andersson",
    readTime: "8 min",
    date: "Feb 2026",
    teaser:
      "Voice, gesture, eye-tracking, and neural interfaces are converging. The next decade may see the most significant shift in how we interact with computers since the mouse.",
    gradient: "from-fuchsia-600 to-pink-700",
    icon: "🖐️",
    pullQuote:
      '"The ideal interface disappears. The computer does what you mean, not what you say."',
    relatedTitles: [],
    body: [
      "The touch interface paradigm has dominated for fifteen years. Every major computing device — smartphone, tablet, laptop, kiosk — has converged on a grammar of taps, swipes, and pinches that crosses cultures and age groups.",
      "But cracks are appearing. Screens have not grown as fast as content. Keyboards remain the fastest text input method, constraining voice assistants. Extended reality requires spatial interfaces that flat touchscreens cannot provide.",
      "The convergence that is beginning to emerge looks less like a single replacement modality and more like a context-adaptive layer. AI systems that understand intent — not just explicit commands — can route input through whatever channel is most efficient in the current context.",
      '"The ideal interface disappears. The computer does what you mean, not what you say," argues Dr. Sofia Andersson of the MIT Media Lab. "We are still very far from that. But the direction is clear."',
      "Neural interfaces represent the far frontier. Neuralink and Synchron have demonstrated that cortical signals can be decoded into cursor control and keyboard input with sufficient bandwidth for basic computer operation. The invasive procedure is currently justified only for patients with severe motor disabilities.",
      "The next five years are likely to see incremental improvement in each input modality, with AI doing more of the heavy lifting of interpreting ambiguous or combined signals. The decade after that may see the interface become genuinely ambient.",
    ].join("\n\n"),
  },
  {
    id: "mx8",
    category: "Computing",
    headline: "Open Source AI: The Battle for Foundation Model Governance",
    byline: "Amara Johnson",
    readTime: "9 min",
    date: "Jan 2026",
    teaser:
      "Meta's Llama 3, Mistral, and a wave of community models have complicated the story of AI safety. Open-source advocates and safety researchers are in open conflict.",
    gradient: "from-green-600 to-emerald-700",
    icon: "🔓",
    pullQuote:
      "Making a model open-source does not make it safe. It just makes it everyone's problem.",
    relatedTitles: [],
    body: [
      "In April 2024, Meta released Llama 3, a family of open-weight language models. The 70-billion-parameter version achieved performance comparable to GPT-4 on several benchmarks. Within a week, it was running on consumer hardware. Within a month, fine-tuned versions with safety guardrails removed were circulating on model-sharing platforms.",
      "This is the open-source AI paradox: the same release that democratizes access to powerful AI also removes the safety controls that proprietary providers have built.",
      "The debate has split the AI community sharply. Open-source advocates argue that transparency is essential for auditing AI systems, that diversity of development reduces the risk of monoculture failures, and that the compute and data advantages of frontier labs already ensure that the most capable systems remain proprietary.",
      "Safety researchers argue that the risk profile of a widely distributed powerful model is qualitatively different from a proprietary one. Removing safety guardrails from Llama 3 is not hard. The techniques for doing so are documented and require no specialized expertise.",
      "Making a model open-source does not make it safe. It just makes it everyone's problem, says Dr. Stuart Russell of UC Berkeley.",
      "The governance question has no easy resolution. No international treaty framework exists for AI capability restrictions. National regulatory approaches diverge significantly. And the technical community has no consensus on what restrictions would actually reduce risk without eliminating the benefits of openness.",
    ].join("\n\n"),
  },
];

const ALL_FALLBACK = [...FALLBACK_MAGAZINE, ...EXTRA_FALLBACK];

const CACHE_KEY = "techmagazine_v2_cache";
const CACHE_TTL = 60 * 60 * 1000;
const AUTO_REFRESH = 5 * 60 * 1000;
const PAGE_SIZE = 20;

type SortMode = "newest" | "popular" | "trending";
type ViewMode = "grid" | "list";

interface CachedData {
  articles: MagazineArticle[];
  fetchedAt: number;
}

// ─── Category detection ────────────────────────────────────────────────────────
function detectMagazineCategory(title: string, desc: string): string {
  const text = `${title} ${desc}`.toLowerCase();
  if (
    /\b(ai|artificial intelligence|machine learning|llm|gpt|neural)\b/.test(
      text,
    )
  )
    return "Artificial Intelligence";
  if (
    /\b(climate|carbon|energy|environment|emission|renewable|fusion|nuclear)\b/.test(
      text,
    )
  )
    return "Climate";
  if (
    /\b(biotech|gene|crispr|protein|genome|drug|biology|medicine|medical|organ)\b/.test(
      text,
    )
  )
    return "Biotechnology";
  if (
    /\b(business|economy|startup|investment|market|finance|venture|funding)\b/.test(
      text,
    )
  )
    return "Business";
  if (
    /\b(5g|network|connectivity|wireless|telecom|bandwidth|satellite)\b/.test(
      text,
    )
  )
    return "Connectivity";
  if (
    /\b(design|interface|ux|ui|typography|visual|aesthetic|product design)\b/.test(
      text,
    )
  )
    return "Design";
  return "Computing";
}

// ─── RSS → MagazineArticle mapping ───────────────────────────────────────────
function mapRssToMagazine(feeds: RssFeed[]): MagazineArticle[] {
  const articles: MagazineArticle[] = [];
  let idx = 0;
  for (const feed of feeds) {
    if (feed.status !== "ok") continue;
    let domain = "Unknown";
    try {
      domain = new URL(feed.feed.link).hostname.replace("www.", "");
    } catch {
      /* ignore */
    }
    for (const item of feed.items) {
      const rawContent = item.content ?? item.description ?? "";
      const body = stripHtml(rawContent);
      const teaser = body.slice(0, 300).trimEnd();
      const category = detectMagazineCategory(
        item.title,
        item.description ?? "",
      );
      const image = item.thumbnail ?? item.enclosure?.link;
      articles.push({
        id: `mag-live-${idx++}`,
        category,
        headline: item.title,
        byline: item.author || domain,
        readTime: calcReadTime(body),
        date: timeAgo(item.pubDate),
        teaser: teaser.length < body.length ? `${teaser}…` : teaser,
        gradient: GRADIENTS[idx % GRADIENTS.length],
        icon: CATEGORY_ICONS[category] ?? "📰",
        featured: idx === 1,
        body: body || teaser,
        pullQuote: body.slice(100, 220).trimEnd(),
        relatedTitles: [],
        url: item.link,
        image,
        isNew: isWithin24h(item.pubDate),
        isLive: true,
      });
    }
  }
  return articles;
}

// ─── Utility: share ───────────────────────────────────────────────────────────
function shareArticle(article: MagazineArticle) {
  const text = `${article.headline} — ${article.byline}`;
  if (navigator.share) {
    void navigator.share({
      title: article.headline,
      text,
      url: article.url ?? window.location.href,
    });
  } else {
    void navigator.clipboard.writeText(article.url ?? window.location.href);
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard({ tall = false }: { tall?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <Skeleton className={`${tall ? "h-48" : "h-28"} w-full rounded-none`} />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3.5 w-20 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

// ─── Reading Progress Bar ─────────────────────────────────────────────────────
function ReadingProgressBar({ scrollEl }: { scrollEl: HTMLDivElement | null }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!scrollEl) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      const pct =
        scrollHeight <= clientHeight
          ? 100
          : (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(Math.min(100, pct));
    };
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [scrollEl]);
  return (
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-border z-10">
      <div
        className="h-full bg-primary transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Reading Modal ────────────────────────────────────────────────────────────
function ReadingModal({
  article,
  allArticles,
  bookmarks,
  onClose,
  onSelect,
  onToggleBookmark,
}: {
  article: MagazineArticle;
  allArticles: MagazineArticle[];
  bookmarks: Set<string>;
  onClose: () => void;
  onSelect: (a: MagazineArticle) => void;
  onToggleBookmark: (id: string) => void;
}) {
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const fontSizeClass =
    fontSize === "sm" ? "text-xs" : fontSize === "lg" ? "text-base" : "text-sm";

  useEffect(() => {
    if (scrollRef.current) setScrollEl(scrollRef.current);
  }, []);

  const paragraphs = article.body.trim().split(/\n\n+/).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-background w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[94vh] shadow-2xl relative"
        data-ocid="techmagazine.dialog"
      >
        <ReadingProgressBar scrollEl={scrollEl} />

        {/* Hero */}
        <div
          className={`shrink-0 bg-gradient-to-br ${article.gradient} px-5 pt-6 pb-5`}
        >
          {article.image && (
            <div className="h-36 rounded-xl overflow-hidden mb-4 relative">
              <img
                src={article.image}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement)
                    .parentElement!.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-white/20 text-white border-white/30">
                  {article.category}
                </span>
                {article.isNew && (
                  <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <h2 className="font-extrabold text-white text-base leading-snug mb-2">
                {article.headline}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span className="font-semibold text-white/90">
                  {article.byline}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </span>
                <span>·</span>
                <span>{article.date}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="text-white/70 hover:text-white bg-white/15 hover:bg-white/25 rounded-xl p-1.5 transition-colors"
                data-ocid="techmagazine.modal.close_button"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-3xl">{article.icon}</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="shrink-0 border-b border-border px-5 py-2 flex items-center justify-between gap-3 bg-card">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground mr-1">
              Text:
            </span>
            {(["sm", "base", "lg"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFontSize(s)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${fontSize === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                data-ocid={`techmagazine.font_${s}`}
              >
                {s === "sm" ? "A−" : s === "base" ? "A" : "A+"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleBookmark(article.id)}
              className="text-muted-foreground hover:text-primary transition-colors p-1.5"
              data-ocid="techmagazine.modal.bookmark_button"
              aria-label="Bookmark article"
            >
              {bookmarks.has(article.id) ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => shareArticle(article)}
              className="text-muted-foreground hover:text-primary transition-colors p-1.5"
              data-ocid="techmagazine.modal.share_button"
              aria-label="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="px-5 py-5 space-y-5 max-w-prose mx-auto">
            {/* Teaser / lead */}
            <p
              className={`font-semibold text-foreground leading-relaxed ${fontSize === "lg" ? "text-base" : "text-sm"}`}
            >
              {article.teaser}
            </p>

            {article.pullQuote && (
              <blockquote className="border-l-4 border-primary bg-primary/5 rounded-r-2xl px-5 py-4 italic text-foreground leading-relaxed text-sm font-medium">
                {article.pullQuote}
              </blockquote>
            )}

            <div className="space-y-4">
              {paragraphs.map((para, i) => (
                <p
                  key={`body-${i}`}
                  className={`text-muted-foreground leading-relaxed ${fontSizeClass}`}
                >
                  {para.trim()}
                </p>
              ))}
            </div>

            {related.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Related Articles
                </p>
                <div className="space-y-2">
                  {related.map((rel) => (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={() => onSelect(rel)}
                      className="w-full flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/60 rounded-xl transition-colors text-left"
                      data-ocid={`techmagazine.related.${rel.id}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${rel.gradient} flex items-center justify-center text-xl shrink-0`}
                      >
                        {rel.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground line-clamp-2">
                          {rel.headline}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {rel.byline} · {rel.readTime}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-between gap-3 bg-card">
          <span className="text-xs text-muted-foreground truncate">
            {article.category} · {article.date}
          </span>
          <div className="flex gap-2 shrink-0">
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
                data-ocid="techmagazine.modal.read_original"
              >
                <ExternalLink className="w-3 h-3" /> Read original
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={onClose}
              data-ocid="techmagazine.modal.close_button"
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Article Card (grid) ───────────────────────────────────────────────────────
function ArticleCard({
  article,
  index,
  bookmarks,
  onRead,
  onToggleBookmark,
}: {
  article: MagazineArticle;
  index: number;
  bookmarks: Set<string>;
  onRead: () => void;
  onToggleBookmark: (id: string) => void;
}) {
  const catColor =
    NEWS_CATEGORY_COLORS[article.category] ??
    "bg-primary/10 text-primary border-primary/20";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
      data-ocid={`techmagazine.article.${index + 1}`}
    >
      <button
        type="button"
        onClick={onRead}
        className="flex-1 flex flex-col text-left cursor-pointer group"
      >
        <div
          className={`h-36 bg-gradient-to-br ${article.gradient} flex items-center justify-center relative overflow-hidden shrink-0`}
        >
          {article.image && (
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <span className="text-5xl relative z-10 drop-shadow">
            {article.icon}
          </span>
          {article.isNew && (
            <span className="absolute top-2 right-2 text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full z-10">
              NEW
            </span>
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}
            >
              {article.category}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
              <Clock className="w-2.5 h-2.5" />
              {article.readTime}
            </span>
          </div>
          <p className="font-bold text-foreground text-sm leading-snug mb-2 line-clamp-2 flex-1">
            {article.headline}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {article.teaser}
          </p>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="font-semibold text-foreground/80 truncate max-w-[65%]">
              {article.byline}
            </span>
            <span>{article.date}</span>
          </div>
        </div>
      </button>
      <div className="px-4 pb-3 flex items-center justify-end gap-1 border-t border-border/50 pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(article.id);
          }}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
          aria-label="Bookmark"
          data-ocid={`techmagazine.bookmark.${index + 1}`}
        >
          {bookmarks.has(article.id) ? (
            <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            shareArticle(article);
          }}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
          aria-label="Share"
          data-ocid={`techmagazine.share.${index + 1}`}
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Article List Item ────────────────────────────────────────────────────────
function ArticleListItem({
  article,
  index,
  bookmarks,
  onRead,
  onToggleBookmark,
}: {
  article: MagazineArticle;
  index: number;
  bookmarks: Set<string>;
  onRead: () => void;
  onToggleBookmark: (id: string) => void;
}) {
  const catColor =
    NEWS_CATEGORY_COLORS[article.category] ??
    "bg-primary/10 text-primary border-primary/20";
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="flex items-start gap-3 p-3 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow"
      data-ocid={`techmagazine.list_item.${index + 1}`}
    >
      <button
        type="button"
        onClick={onRead}
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${article.gradient} flex items-center justify-center text-2xl shrink-0 relative overflow-hidden`}
      >
        {article.image && (
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover absolute inset-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <span className="relative z-10">{article.icon}</span>
      </button>
      <button
        type="button"
        className="flex-1 min-w-0 text-left"
        onClick={onRead}
      >
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${catColor}`}
          >
            {article.category}
          </span>
          {article.isNew && (
            <span className="text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
              NEW
            </span>
          )}
          <span className="text-[9px] text-muted-foreground flex items-center gap-0.5 ml-auto">
            <Clock className="w-2 h-2" />
            {article.readTime}
          </span>
        </div>
        <p className="font-bold text-foreground text-xs sm:text-sm leading-snug line-clamp-2 mb-1">
          {article.headline}
        </p>
        <p className="text-[10px] text-muted-foreground line-clamp-1">
          {article.byline} · {article.date}
        </p>
      </button>
      <div className="flex flex-col gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onToggleBookmark(article.id)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
          aria-label="Bookmark"
        >
          {bookmarks.has(article.id) ? (
            <BookmarkCheck className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Bookmark className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Browse All Panel ─────────────────────────────────────────────────────────
function BrowseAllPanel({
  articles,
  bookmarks,
  onRead,
  onToggleBookmark,
  onClose,
}: {
  articles: MagazineArticle[];
  bookmarks: Set<string>;
  onRead: (a: MagazineArticle) => void;
  onToggleBookmark: (id: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = articles;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.headline.toLowerCase().includes(q) ||
          a.byline.toLowerCase().includes(q) ||
          a.teaser.toLowerCase().includes(q),
      );
    }
    if (category) list = list.filter((a) => a.category === category);
    if (sort === "newest")
      list = [...list].sort((a, b) => (a.id > b.id ? -1 : 1));
    if (sort === "popular")
      list = [...list].sort((a, b) => b.body.length - a.body.length);
    if (sort === "trending")
      list = [...list]
        .filter((a) => a.isNew)
        .concat(list.filter((a) => !a.isNew));
    return list;
  }, [articles, search, category, sort]);

  const shown = filtered.slice(0, page * PAGE_SIZE);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
      data-ocid="techmagazine.browse_panel"
    >
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border bg-card flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg transition-colors"
          data-ocid="techmagazine.browse.close_button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-foreground text-base">
            Browse All Articles
          </h2>
          <p className="text-xs text-muted-foreground">
            {filtered.length} articles
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="techmagazine.browse.view_toggle"
          >
            {view === "grid" ? (
              <LayoutList className="w-4 h-4" />
            ) : (
              <Grid3X3 className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            data-ocid="techmagazine.browse.filter_button"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 px-4 py-2 border-b border-border bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-background"
            data-ocid="techmagazine.browse.search_input"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden border-b border-border bg-card/50"
          >
            <div className="px-4 py-3 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Sort By
                </p>
                <div className="flex gap-2 flex-wrap">
                  {(["newest", "popular", "trending"] as SortMode[]).map(
                    (s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSort(s);
                          setPage(1);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors capitalize ${sort === s ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary"}`}
                        data-ocid={`techmagazine.sort.${s}`}
                      >
                        {s === "trending" && (
                          <TrendingUp className="inline w-3 h-3 mr-1" />
                        )}
                        {s}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Category
                </p>
                <div
                  className="flex gap-2 overflow-x-auto pb-1"
                  style={{ scrollbarWidth: "none" }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setCategory(null);
                      setPage(1);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors shrink-0 ${category === null ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary"}`}
                    data-ocid="techmagazine.browse.cat.all"
                  >
                    All
                  </button>
                  {MAGAZINE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat === category ? null : cat);
                        setPage(1);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors shrink-0 ${category === cat ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary"}`}
                      data-ocid={`techmagazine.browse.cat.${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Articles */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 pb-28">
        {filtered.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="techmagazine.browse.empty_state"
          >
            <div className="text-5xl mb-3">📭</div>
            <p className="font-semibold">No articles found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shown.map((a, i) => (
              <ArticleCard
                key={a.id}
                article={a}
                index={i}
                bookmarks={bookmarks}
                onRead={() => onRead(a)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {shown.map((a, i) => (
              <ArticleListItem
                key={a.id}
                article={a}
                index={i}
                bookmarks={bookmarks}
                onRead={() => onRead(a)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        )}

        {shown.length < filtered.length && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full px-6"
              data-ocid="techmagazine.browse.load_more"
            >
              <ChevronDown className="w-4 h-4 mr-2" />
              Load More ({filtered.length - shown.length} remaining)
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Category Section ─────────────────────────────────────────────────────────
function CategorySection({
  cat,
  articles,
  bookmarks,
  onRead,
  onToggleBookmark,
}: {
  cat: string;
  articles: MagazineArticle[];
  bookmarks: Set<string>;
  onRead: (a: MagazineArticle) => void;
  onToggleBookmark: (id: string) => void;
}) {
  if (articles.length === 0) return null;
  const catColor =
    NEWS_CATEGORY_COLORS[cat] ?? "bg-primary/10 text-primary border-primary/20";
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">{CATEGORY_ICONS[cat] ?? "📰"}</span>
        <h3 className="font-extrabold text-foreground text-sm tracking-wide">
          {cat}
        </h3>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor} ml-auto`}
        >
          {articles.length}
        </span>
      </div>
      {/* Horizontal scroll on mobile, 2-col grid on desktop */}
      <div
        className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-x-visible"
        style={{ scrollbarWidth: "none" }}
      >
        {articles.slice(0, 4).map((a, i) => (
          <div key={a.id} className="shrink-0 w-64 sm:w-auto">
            <ArticleCard
              article={a}
              index={i}
              bookmarks={bookmarks}
              onRead={() => onRead(a)}
              onToggleBookmark={onToggleBookmark}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TechMagazinePage({ onBack }: { onBack: () => void }) {
  const [articles, setArticles] = useState<MagazineArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] =
    useState<MagazineArticle | null>(null);
  const [showBrowse, setShowBrowse] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      return new Set(
        JSON.parse(
          localStorage.getItem("magazine_bookmarks") ?? "[]",
        ) as string[],
      );
    } catch {
      return new Set();
    }
  });
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem("magazine_bookmarks", JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const fetchArticles = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);

      if (!silent) {
        try {
          const raw = sessionStorage.getItem(CACHE_KEY);
          if (raw) {
            const cached: CachedData = JSON.parse(raw) as CachedData;
            if (Date.now() - cached.fetchedAt < CACHE_TTL) {
              setArticles(cached.articles);
              setUsingFallback(false);
              setLoading(false);
              return;
            }
          }
        } catch {
          /* ignore */
        }
      }

      try {
        const results = await Promise.allSettled(
          MAGAZINE_FEED_URLS.map((url) =>
            fetch(url, { signal: AbortSignal.timeout(8000) }).then(
              (r) => r.json() as Promise<RssFeed>,
            ),
          ),
        );
        const feeds: RssFeed[] = [];
        for (const result of results) {
          if (result.status === "fulfilled") feeds.push(result.value);
        }
        if (feeds.length === 0) throw new Error("All feeds failed");
        const live = mapRssToMagazine(feeds)
          .filter(
            (a, i, arr) =>
              arr.findIndex((b) => b.headline === a.headline) === i,
          )
          .slice(0, 40);
        if (live.length > 0) live[0].featured = true;
        const merged = [...live, ...ALL_FALLBACK];
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ articles: merged, fetchedAt: Date.now() }),
          );
        } catch {
          /* ignore */
        }
        setArticles(merged);
        setUsingFallback(false);
      } catch {
        if (articles.length === 0) {
          setArticles(ALL_FALLBACK);
          setUsingFallback(true);
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [articles.length],
  );

  useEffect(() => {
    void fetchArticles(false);
    autoRefreshRef.current = setInterval(() => {
      void fetchArticles(true);
    }, AUTO_REFRESH);
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [fetchArticles]);

  const allArticles = useMemo(() => {
    return articles.length > 0 ? articles : ALL_FALLBACK;
  }, [articles]);

  const featured = allArticles.find((a) => a.featured) ?? allArticles[0];

  const latestIssue = useMemo(
    () => [...allArticles].filter((a) => a.id !== featured?.id).slice(0, 4),
    [allArticles, featured],
  );

  const editorPicks = useMemo(
    () =>
      [...allArticles]
        .filter((a) => a.id !== featured?.id)
        .sort((a, b) => b.body.length - a.body.length)
        .slice(0, 3),
    [allArticles, featured],
  );

  const byCategory = useMemo(() => {
    const map: Record<string, MagazineArticle[]> = {};
    for (const cat of MAGAZINE_CATEGORIES) {
      map[cat] = allArticles.filter(
        (a) => a.category === cat && a.id !== featured?.id,
      );
    }
    return map;
  }, [allArticles, featured]);

  const filteredForGrid = activeCategory
    ? allArticles.filter((a) => a.category === activeCategory)
    : allArticles.filter((a) => a.id !== featured?.id);

  const openArticle = useCallback((a: MagazineArticle) => {
    setSelectedArticle(a);
    setShowBrowse(false);
  }, []);

  return (
    <div className="flex-1 min-h-0 bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 flex items-center gap-3 shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, #be185d 0%, #9f1239 50%, #881337 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl text-white/80 hover:text-white hover:bg-white/15 shrink-0"
          data-ocid="techmagazine.back_button"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white/20 shadow-inner">
          📖
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-white text-base leading-tight truncate">
            Tech Magazine
          </h1>
          <p className="text-[11px] text-white/70 truncate">
            {usingFallback
              ? "Curated long-form technology journalism"
              : "Live in-depth technology journalism"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBrowse(true)}
          className="text-white/80 hover:text-white hover:bg-white/15 rounded-xl text-xs font-semibold shrink-0 px-3"
          data-ocid="techmagazine.browse_all_button"
        >
          Browse All
        </Button>
        <button
          type="button"
          onClick={() => {
            void fetchArticles(false);
          }}
          disabled={loading || isRefreshing}
          className="text-white/80 hover:text-white bg-white/15 hover:bg-white/25 rounded-xl p-1.5 transition-colors shrink-0 disabled:opacity-50"
          aria-label="Refresh magazine"
          data-ocid="techmagazine.refresh_button"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-screen-lg mx-auto px-3 sm:px-4 py-4 pb-28 w-full space-y-8">
          {usingFallback && (
            <div
              data-ocid="techmagazine.fallback_badge"
              className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-full inline-block"
            >
              Showing curated articles
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div data-ocid="techmagazine.loading_state" className="space-y-6">
              <SkeletonCard tall />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* ── Hero / Cover Story ─────────────────────────────────────── */}
              {featured && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Cover Story
                    </p>
                    <Badge variant="outline" className="text-[10px]">
                      {new Date().toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      Issue
                    </Badge>
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => openArticle(featured)}
                    className={`w-full bg-gradient-to-br ${featured.gradient} rounded-2xl p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden`}
                    data-ocid="techmagazine.featured"
                  >
                    {featured.image && (
                      <img
                        src={featured.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-20"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    )}
                    <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="text-6xl sm:text-8xl shrink-0 leading-none">
                        {featured.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-block text-[10px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                            {featured.category}
                          </span>
                          {featured.isNew && (
                            <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="font-extrabold text-white text-xl sm:text-2xl leading-snug mb-3 line-clamp-3">
                          {featured.headline}
                        </p>
                        <p className="text-white/75 text-sm leading-relaxed line-clamp-3 mb-4">
                          {featured.teaser}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                          <span className="font-semibold text-white/90">
                            {featured.byline}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {featured.readTime}
                          </span>
                          <span className="ml-auto bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
                            Read now →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </section>
              )}

              {/* ── Latest Issue ───────────────────────────────────────────── */}
              {latestIssue.length > 0 && (
                <section>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Latest Issue
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {latestIssue.map((a, i) => (
                      <motion.button
                        key={a.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openArticle(a)}
                        className="bg-card border border-border rounded-xl overflow-hidden text-left hover:shadow-md transition-shadow"
                        data-ocid={`techmagazine.latest.${i + 1}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div
                          className={`h-20 bg-gradient-to-br ${a.gradient} flex items-center justify-center text-3xl relative overflow-hidden`}
                        >
                          {a.image && (
                            <img
                              src={a.image}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover opacity-60"
                              onError={(e) => {
                                (
                                  e.currentTarget as HTMLImageElement
                                ).style.display = "none";
                              }}
                            />
                          )}
                          <span className="relative z-10">{a.icon}</span>
                          {a.isNew && (
                            <span className="absolute top-1.5 right-1.5 text-[8px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full z-10">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="p-2.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${NEWS_CATEGORY_COLORS[a.category] ?? "bg-primary/10 text-primary border-primary/20"}`}
                          >
                            {a.category}
                          </span>
                          <p className="text-xs font-bold text-foreground mt-1.5 line-clamp-2 leading-tight">
                            {a.headline}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {a.readTime}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Editor's Picks ──────────────────────────────────────────── */}
              {editorPicks.length > 0 && (
                <section>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Editor's Picks
                  </p>
                  <div className="space-y-3">
                    {editorPicks.map((a, i) => (
                      <ArticleListItem
                        key={a.id}
                        article={a}
                        index={i}
                        bookmarks={bookmarks}
                        onRead={() => openArticle(a)}
                        onToggleBookmark={toggleBookmark}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* ── Category Filter ─────────────────────────────────────────── */}
              <section>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Browse by Category
                </p>
                <div
                  className="flex gap-2 overflow-x-auto pb-1"
                  style={{ scrollbarWidth: "none" }}
                  data-ocid="techmagazine.category.filter"
                >
                  <button
                    type="button"
                    onClick={() => setActiveCategory(null)}
                    className={`text-xs px-3 py-2 rounded-full font-medium border transition-colors shrink-0 min-h-[36px] ${activeCategory === null ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"}`}
                    data-ocid="techmagazine.filter.all"
                  >
                    All
                  </button>
                  {MAGAZINE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setActiveCategory(cat === activeCategory ? null : cat)
                      }
                      className={`text-xs px-3 py-2 rounded-full font-medium border transition-colors shrink-0 min-h-[36px] ${activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"}`}
                      data-ocid={`techmagazine.filter.${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {CATEGORY_ICONS[cat]} {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Category-specific sections (no filter active) ───────────── */}
              {!activeCategory && (
                <div className="space-y-8">
                  {MAGAZINE_CATEGORIES.map((cat) => (
                    <CategorySection
                      key={cat}
                      cat={cat}
                      articles={byCategory[cat] ?? []}
                      bookmarks={bookmarks}
                      onRead={openArticle}
                      onToggleBookmark={toggleBookmark}
                    />
                  ))}
                </div>
              )}

              {/* ── Filtered grid ───────────────────────────────────────────── */}
              {activeCategory && (
                <section>
                  <p className="text-xs text-muted-foreground mb-4">
                    <strong className="text-foreground">
                      {filteredForGrid.length}
                    </strong>{" "}
                    articles in {activeCategory}
                  </p>
                  {filteredForGrid.length === 0 ? (
                    <div
                      className="text-center py-12 text-muted-foreground"
                      data-ocid="techmagazine.empty_state"
                    >
                      <div className="text-4xl mb-3">📭</div>
                      <p className="font-semibold">
                        No articles in {activeCategory}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredForGrid.map((a, idx) => (
                        <ArticleCard
                          key={a.id}
                          article={a}
                          index={idx}
                          bookmarks={bookmarks}
                          onRead={() => openArticle(a)}
                          onToggleBookmark={toggleBookmark}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* ── Browse All CTA ───────────────────────────────────────────── */}
              <div className="text-center pt-2">
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-3 font-semibold"
                  onClick={() => setShowBrowse(true)}
                  data-ocid="techmagazine.browse_all_cta"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Browse Full Library ({allArticles.length} articles)
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reading Modal */}
      <AnimatePresence>
        {selectedArticle && !showBrowse && (
          <ReadingModal
            article={selectedArticle}
            allArticles={allArticles}
            bookmarks={bookmarks}
            onClose={() => setSelectedArticle(null)}
            onSelect={openArticle}
            onToggleBookmark={toggleBookmark}
          />
        )}
      </AnimatePresence>

      {/* Browse All Panel */}
      <AnimatePresence>
        {showBrowse && (
          <BrowseAllPanel
            articles={allArticles}
            bookmarks={bookmarks}
            onRead={openArticle}
            onToggleBookmark={toggleBookmark}
            onClose={() => setShowBrowse(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
