import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CATEGORY_ICONS,
  FALLBACK_NEWS,
  NEWS_CATEGORY_COLORS,
  NEWS_FEED_URLS,
  type NewsArticle,
  type NewsCategory,
  type RssFeed,
  calcReadTime,
  detectCategory,
  stripHtml,
  timeAgo,
} from "@/data/techNewsData";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  ExternalLink,
  RefreshCw,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES: string[] = [
  "All",
  "AI & ML",
  "Cybersecurity",
  "Cloud",
  "Web Dev",
  "Open Source",
  "Mobile",
  "Research",
];
const PAGE_SIZE = 10;
const CACHE_KEY = "technews_cache";
const CACHE_TTL = 30 * 60 * 1000; // 30 min
const AUTO_REFRESH = 5 * 60 * 1000; // 5 min

interface CachedData {
  articles: NewsArticle[];
  fetchedAt: number;
}

// ─── RSS → Article mapping ────────────────────────────────────────────────────
function mapRssToArticles(feeds: RssFeed[], startId: number): NewsArticle[] {
  const articles: NewsArticle[] = [];
  let idx = startId;

  for (const feed of feeds) {
    if (feed.status !== "ok") continue;
    const domain = new URL(feed.feed.link).hostname.replace("www.", "");

    for (const item of feed.items) {
      const rawContent = item.content ?? item.description ?? "";
      const content = stripHtml(rawContent);
      const summary = content.slice(0, 220).trimEnd();
      const category = detectCategory(item.title, item.description ?? "");
      const image = item.thumbnail ?? item.enclosure?.link;

      articles.push({
        id: `live-${idx++}`,
        category,
        headline: item.title,
        summary: summary.length < content.length ? `${summary}…` : summary,
        source: domain,
        date: item.pubDate,
        readTime: calcReadTime(content),
        author: item.author || domain,
        tags: [category, domain],
        fullContent: content || summary,
        relatedIds: [],
        url: item.link,
        image,
        isLive: true,
      });
    }
  }

  return articles;
}

// ─── Deduplicate by title ─────────────────────────────────────────────────────
function dedupeByTitle(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter((a) => {
    const key = a.headline.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
    </div>
  );
}

// ─── Article Modal ────────────────────────────────────────────────────────────
function ArticleModal({
  article,
  onClose,
}: {
  article: NewsArticle;
  onClose: () => void;
}) {
  const catColor =
    NEWS_CATEGORY_COLORS[article.category] ??
    "bg-primary/10 text-primary border-primary/20";
  const icon = CATEGORY_ICONS[article.category] ?? "📰";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="bg-background w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
        data-ocid="technews.dialog"
      >
        {/* Hero */}
        <div
          className="px-5 py-4 flex items-start gap-3 shrink-0"
          style={{
            background: "linear-gradient(135deg,#0369a1 0%,#0284c7 100%)",
          }}
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
            {article.image ? (
              <img
                src={article.image}
                alt=""
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              icon
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span
              className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-1.5 ${catColor}`}
            >
              {article.category}
            </span>
            <h2 className="font-extrabold text-white text-sm leading-snug line-clamp-3">
              {article.headline}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/15 hover:bg-white/25 rounded-xl p-1.5 shrink-0 transition-colors"
            data-ocid="technews.modal.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-4">
            <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
              <span className="font-bold text-foreground">
                {article.source}
              </span>
              <span>·</span>
              <span>{article.author}</span>
              <span>·</span>
              <span>{timeAgo(article.date)}</span>
              <span className="flex items-center gap-1 ml-auto">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
            </div>

            <p className="text-sm font-medium text-foreground leading-relaxed border-l-4 border-primary pl-4 py-1">
              {article.summary}
            </p>

            <div className="space-y-3">
              {article.fullContent
                .trim()
                .split("\n\n")
                .map((para, i) => (
                  <p
                    key={`p-${i}`}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {para.trim()}
                  </p>
                ))}
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {[article.category, "Technology", "Computer Science"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground truncate">
            Source: {article.source}
          </span>
          <div className="flex gap-2 shrink-0">
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
                data-ocid="technews.modal.read_original"
              >
                <ExternalLink className="w-3 h-3" /> Read original
              </a>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              data-ocid="technews.modal.close_button"
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── News Card ────────────────────────────────────────────────────────────────
function NewsCard({
  article,
  index,
  onRead,
}: {
  article: NewsArticle;
  index: number;
  onRead: () => void;
}) {
  const catColor =
    NEWS_CATEGORY_COLORS[article.category] ??
    "bg-primary/10 text-primary border-primary/20";
  const icon = CATEGORY_ICONS[article.category] ?? "📰";

  return (
    <motion.button
      type="button"
      onClick={onRead}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="w-full bg-card border border-border rounded-2xl p-4 text-left hover:shadow-md transition-shadow"
      data-ocid={`technews.item.${index + 1}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0 overflow-hidden">
          {article.image ? (
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            icon
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}
            >
              {article.category}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {timeAgo(article.date)}
            </span>
            {article.isLive && (
              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700 px-1.5 py-0.5 rounded-full">
                LIVE
              </span>
            )}
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 ml-auto">
              <Clock className="w-2.5 h-2.5" /> {article.readTime}
            </span>
          </div>
          <p className="font-bold text-foreground text-sm leading-snug mb-1.5 line-clamp-2">
            {article.headline}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[10px] text-primary font-semibold truncate max-w-[60%]">
              {article.source}
            </p>
            <span className="text-xs text-primary font-medium flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Read More
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TechNewsPage({ onBack }: { onBack: () => void }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchArticles = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setIsRefreshing(true);

      // Check cache first
      if (!silent) {
        try {
          const raw = sessionStorage.getItem(CACHE_KEY);
          if (raw) {
            const cached: CachedData = JSON.parse(raw) as CachedData;
            if (Date.now() - cached.fetchedAt < CACHE_TTL) {
              setArticles(cached.articles);
              setLastUpdated(new Date(cached.fetchedAt));
              setUsingFallback(false);
              setLoading(false);
              return;
            }
          }
        } catch {
          // ignore cache errors
        }
      }

      try {
        const results = await Promise.allSettled(
          NEWS_FEED_URLS.map((url) =>
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

        const live = mapRssToArticles(feeds, 1);
        const merged = dedupeByTitle(
          [...live].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        ).slice(0, 30);

        const now = Date.now();
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ articles: merged, fetchedAt: now }),
          );
        } catch {
          // ignore storage quota
        }

        setArticles(merged);
        setLastUpdated(new Date(now));
        setUsingFallback(false);
      } catch {
        if (articles.length === 0) {
          setArticles(FALLBACK_NEWS);
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

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 min-h-0 bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header
        className="shrink-0 px-4 py-3 flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-xl text-white/80 hover:text-white hover:bg-white/15 shrink-0"
          data-ocid="technews.back_button"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white/20">
          📰
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-white text-base leading-tight truncate">
            Tech News
          </h1>
          <p className="text-[11px] text-white/70 truncate">{today}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            void fetchArticles(false);
          }}
          disabled={loading || isRefreshing}
          className="text-white/80 hover:text-white bg-white/15 hover:bg-white/25 rounded-xl p-1.5 transition-colors shrink-0 disabled:opacity-50"
          aria-label="Refresh news"
          data-ocid="technews.refresh_button"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-28 space-y-4 w-full">
          {/* Status row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {usingFallback ? (
                <span
                  className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700 px-2 py-0.5 rounded-full"
                  data-ocid="technews.fallback_badge"
                >
                  Showing cached news
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Live feed
                </span>
              )}
            </div>
            {lastUpdated && (
              <p className="text-[10px] text-muted-foreground">
                Updated {timeAgo(lastUpdated.toISOString())}
              </p>
            )}
          </div>

          {/* Category Tabs */}
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
            data-ocid="technews.category.filter"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors shrink-0 min-h-[36px] ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
                data-ocid={`technews.filter.${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading ? (
            <div data-ocid="technews.loading_state" className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={`sk-${i}`} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="technews.empty_state"
            >
              <div className="text-4xl mb-3">📭</div>
              <p className="font-semibold">No articles in this category</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <strong className="text-foreground">
                  {Math.min(visibleCount, filtered.length)}
                </strong>{" "}
                of{" "}
                <strong className="text-foreground">{filtered.length}</strong>{" "}
                articles
              </p>
              <div className="space-y-3">
                {visible.map((article, idx) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    index={idx}
                    onRead={() => setSelectedArticle(article)}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-full transition-colors"
                    data-ocid="technews.load_more_button"
                  >
                    Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)}{" "}
                    more articles
                  </button>
                </div>
              )}
              {!hasMore && filtered.length > PAGE_SIZE && (
                <p className="text-center text-xs text-muted-foreground pt-1">
                  All {filtered.length} articles shown
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
