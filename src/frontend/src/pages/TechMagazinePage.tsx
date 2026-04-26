import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Clock, ExternalLink, RefreshCw, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ─────────────────────────────────────────────────────────────────
const MAGAZINE_CATEGORIES = [
  "Artificial Intelligence",
  "Computing",
  "Climate",
  "Biotechnology",
  "Connectivity",
  "Business",
];
const CACHE_KEY = "techmagazine_cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const AUTO_REFRESH = 5 * 60 * 1000;

interface CachedData {
  articles: MagazineArticle[];
  fetchedAt: number;
}

// ─── Magazine category detection ─────────────────────────────────────────────
function detectMagazineCategory(title: string, desc: string): string {
  const text = `${title} ${desc}`.toLowerCase();
  if (
    /\b(ai|artificial intelligence|machine learning|llm|gpt|neural)\b/.test(
      text,
    )
  )
    return "Artificial Intelligence";
  if (/\b(climate|carbon|energy|environment|emission|renewable)\b/.test(text))
    return "Climate";
  if (
    /\b(biotech|gene|crispr|protein|genome|drug|biology|medicine|medical)\b/.test(
      text,
    )
  )
    return "Biotechnology";
  if (
    /\b(business|economy|startup|investment|market|finance|venture)\b/.test(
      text,
    )
  )
    return "Business";
  if (/\b(5g|network|connectivity|wireless|telecom|bandwidth)\b/.test(text))
    return "Connectivity";
  return "Computing";
}

// ─── RSS → MagazineArticle mapping ───────────────────────────────────────────
function mapRssToMagazine(feeds: RssFeed[]): MagazineArticle[] {
  const articles: MagazineArticle[] = [];
  let idx = 0;

  for (const feed of feeds) {
    if (feed.status !== "ok") continue;
    const domain = new URL(feed.feed.link).hostname.replace("www.", "");

    for (const item of feed.items) {
      const rawContent = item.content ?? item.description ?? "";
      const body = stripHtml(rawContent);
      const teaser = body.slice(0, 200).trimEnd();
      const category = detectMagazineCategory(
        item.title,
        item.description ?? "",
      );
      const image = item.thumbnail ?? item.enclosure?.link;
      const wordCount = body.split(/\s+/).length;
      void wordCount; // used for future ordering heuristics
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
        pullQuote: body.slice(0, 120).trimEnd(),
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

// ─── Reading Modal ────────────────────────────────────────────────────────────
function ReadingModal({
  article,
  allArticles,
  onClose,
  onSelect,
}: {
  article: MagazineArticle;
  allArticles: MagazineArticle[];
  onClose: () => void;
  onSelect: (a: MagazineArticle) => void;
}) {
  const related = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const catColor =
    NEWS_CATEGORY_COLORS[article.category] ??
    "bg-primary/10 text-primary border-primary/20";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-background w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl"
        data-ocid="techmagazine.dialog"
      >
        {/* Hero */}
        <div
          className={`shrink-0 bg-gradient-to-br ${article.gradient} px-5 py-5 flex items-start gap-4`}
        >
          <div className="flex-1 min-w-0">
            <span
              className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-2 ${catColor}`}
            >
              {article.category}
            </span>
            {article.isNew && (
              <span className="ml-2 text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                NEW
              </span>
            )}
            <h2 className="font-extrabold text-white text-base leading-snug mb-2 line-clamp-3">
              {article.headline}
            </h2>
            <div className="flex items-center gap-2 text-xs text-white/70 flex-wrap">
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
            <span className="text-4xl">{article.icon}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-4">
            <p className="text-sm font-semibold text-foreground leading-relaxed">
              {article.teaser}
            </p>

            {article.pullQuote && (
              <blockquote className="border-l-4 border-primary bg-primary/5 rounded-r-2xl px-4 py-3 text-sm italic text-foreground leading-relaxed">
                {article.pullQuote}
              </blockquote>
            )}

            <div className="space-y-3">
              {article.body
                .trim()
                .split("\n\n")
                .map((para, i) => (
                  <p
                    key={`body-${i}`}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {para.trim()}
                  </p>
                ))}
            </div>

            {related.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
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
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${rel.gradient} flex items-center justify-center text-lg shrink-0`}
                      >
                        {rel.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground line-clamp-2">
                          {rel.headline}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
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
        <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-between gap-3">
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

// ─── Article Card ──────────────────────────────────────────────────────────────
function ArticleCard({
  article,
  index,
  onRead,
}: {
  article: MagazineArticle;
  index: number;
  onRead: () => void;
}) {
  const catColor =
    NEWS_CATEGORY_COLORS[article.category] ??
    "bg-primary/10 text-primary border-primary/20";

  return (
    <motion.button
      type="button"
      onClick={onRead}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5) }}
      className="w-full bg-card border border-border rounded-2xl overflow-hidden text-left hover:shadow-md transition-shadow"
      data-ocid={`techmagazine.article.${index + 1}`}
    >
      {/* Gradient / image thumbnail */}
      <div
        className={`h-24 sm:h-28 bg-gradient-to-br ${article.gradient} flex items-center justify-center relative overflow-hidden`}
      >
        {article.image ? (
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover absolute inset-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        <span className="text-5xl relative z-10 drop-shadow">
          {article.icon}
        </span>
        {article.isNew && (
          <span className="absolute top-2 right-2 text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full z-10">
            NEW
          </span>
        )}
      </div>
      <div className="p-4">
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
        <p className="font-bold text-foreground text-sm leading-snug mb-1.5 line-clamp-2">
          {article.headline}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
          {article.teaser}
        </p>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="font-semibold text-foreground truncate max-w-[60%]">
            {article.byline}
          </span>
          <span>{article.date}</span>
        </div>
      </div>
    </motion.button>
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
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
          // ignore
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
          .slice(0, 12);

        if (live.length > 0) live[0].featured = true;

        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ articles: live, fetchedAt: Date.now() }),
          );
        } catch {
          // ignore
        }

        setArticles(live);
        setUsingFallback(false);
      } catch {
        if (articles.length === 0) {
          setArticles(FALLBACK_MAGAZINE);
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

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => !a.featured);

  // Editor picks: 3 articles with longest body (deepest reads)
  const editorPicks = [...rest]
    .sort((a, b) => b.body.length - a.body.length)
    .slice(0, 3);

  const remaining = activeCategory
    ? rest.filter((a) => a.category === activeCategory)
    : rest;

  return (
    <div className="flex-1 min-h-0 bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #be185d 0%, #e11d48 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
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
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white/20">
          📖
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-white text-base leading-tight truncate">
            Tech Magazine
          </h1>
          <p className="text-[11px] text-white/70 truncate">
            {usingFallback
              ? "Curated long-form articles"
              : "Live in-depth technology journalism"}
          </p>
        </div>
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
        <div className="max-w-screen-md mx-auto px-3 sm:px-4 py-4 pb-28 space-y-5 w-full">
          {/* Status */}
          {usingFallback && (
            <div
              data-ocid="techmagazine.fallback_badge"
              className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-full inline-block"
            >
              Showing cached articles
            </div>
          )}

          {/* Loading skeleton */}
          {loading ? (
            <div data-ocid="techmagazine.loading_state" className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
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
              {/* Featured / Cover Story */}
              {featured && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                    Cover Story
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedArticle(featured)}
                    className={`w-full bg-gradient-to-br ${featured.gradient} rounded-2xl p-6 text-left shadow-xl relative overflow-hidden`}
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
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="text-6xl shrink-0">{featured.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block text-[10px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                            {featured.category}
                          </span>
                          {featured.isNew && (
                            <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="font-extrabold text-white text-lg leading-snug mb-2 line-clamp-3">
                          {featured.headline}
                        </p>
                        <p className="text-white/75 text-xs leading-relaxed line-clamp-2 mb-3">
                          {featured.teaser}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <span className="font-semibold text-white/90">
                            {featured.byline}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {featured.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              )}

              {/* Editor's Picks */}
              {editorPicks.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
                    Editor's Picks
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {editorPicks.map((article) => (
                      <motion.button
                        key={article.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedArticle(article)}
                        className="bg-card border border-border rounded-xl overflow-hidden text-left hover:shadow-md transition-shadow"
                        data-ocid={`techmagazine.pick.${article.id}`}
                      >
                        <div
                          className={`h-16 bg-gradient-to-br ${article.gradient} flex items-center justify-center text-3xl relative overflow-hidden`}
                        >
                          {article.image && (
                            <img
                              src={article.image}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover opacity-50"
                              onError={(e) => {
                                (
                                  e.currentTarget as HTMLImageElement
                                ).style.display = "none";
                              }}
                            />
                          )}
                          <span className="relative z-10">{article.icon}</span>
                        </div>
                        <div className="p-2.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${NEWS_CATEGORY_COLORS[article.category] ?? "bg-primary/10 text-primary border-primary/20"}`}
                          >
                            {article.category}
                          </span>
                          <p className="text-xs font-bold text-foreground mt-1.5 line-clamp-2 leading-tight">
                            {article.headline}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {article.readTime}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
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
                    className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors shrink-0 min-h-[36px] ${
                      activeCategory === null
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                    }`}
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
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors shrink-0 min-h-[36px] ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                      }`}
                      data-ocid={`techmagazine.filter.${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Article Grid */}
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  <strong className="text-foreground">
                    {remaining.length}
                  </strong>{" "}
                  articles
                  {activeCategory ? ` in ${activeCategory}` : ""}
                </p>
                {remaining.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="techmagazine.empty_state"
                  >
                    <div className="text-4xl mb-3">📭</div>
                    <p className="font-semibold">
                      No articles in this category
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {remaining.map((article, idx) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        index={idx}
                        onRead={() => setSelectedArticle(article)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reading Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ReadingModal
            article={selectedArticle}
            allArticles={articles}
            onClose={() => setSelectedArticle(null)}
            onSelect={(a) => setSelectedArticle(a)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
