import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CATEGORY_GRADIENTS,
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
  Bookmark,
  BookmarkCheck,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Share2,
  TrendingUp,
  Volume2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "All",
  "AI & ML",
  "Cybersecurity",
  "Cloud",
  "Web Dev",
  "Open Source",
  "Mobile",
  "Research",
  "Bookmarked",
] as const;
type TabCategory = (typeof CATEGORIES)[number];

const PAGE_SIZE = 20;
const CACHE_KEY = "technews_cache_v2";
const CACHE_TTL = 30 * 60 * 1000;
const AUTO_REFRESH = 5 * 60 * 1000;
const BOOKMARKS_KEY = "technews_bookmarks";
const VIEW_COUNTS_KEY = "technews_views";

interface CachedData {
  articles: NewsArticle[];
  fetchedAt: number;
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
function getBookmarks(): Set<string> {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}
function saveBookmarks(s: Set<string>) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...s]));
}
function getViewCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(VIEW_COUNTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}
function incrementViewCount(id: string) {
  const counts = getViewCounts();
  counts[id] = (counts[id] ?? 0) + 1;
  localStorage.setItem(VIEW_COUNTS_KEY, JSON.stringify(counts));
}

// ─── RSS mapping ──────────────────────────────────────────────────────────────
function mapRssToArticles(feeds: RssFeed[], startId: number): NewsArticle[] {
  const articles: NewsArticle[] = [];
  let idx = startId;
  for (const feed of feeds) {
    if (feed.status !== "ok") continue;
    let domain = feed.feed.link;
    try {
      domain = new URL(feed.feed.link).hostname.replace("www.", "");
    } catch {
      // keep raw
    }
    for (const item of feed.items) {
      const rawContent = item.content ?? item.description ?? "";
      const content = stripHtml(rawContent);
      const summary = content.slice(0, 240).trimEnd();
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
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
          <Skeleton className="h-3 w-3/6" />
        </div>
      </div>
    </div>
  );
}

// ─── Trending Sidebar ─────────────────────────────────────────────────────────
function TrendingSidebar({
  articles,
  onRead,
}: {
  articles: NewsArticle[];
  onRead: (a: NewsArticle) => void;
}) {
  const counts = getViewCounts();
  const trending = useMemo(() => {
    return [...articles]
      .sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0))
      .slice(0, 5);
  }, [articles, counts]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="font-bold text-sm text-foreground">Trending Now</h3>
      </div>
      {trending.map((article, i) => (
        <button
          key={article.id}
          type="button"
          onClick={() => onRead(article)}
          className="flex items-start gap-3 w-full text-left group hover:bg-muted/40 rounded-xl p-2 -mx-2 transition-colors"
          data-ocid={`technews.trending.item.${i + 1}`}
        >
          <span className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {article.headline}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {article.source} · {timeAgo(article.date)}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Full Article View ────────────────────────────────────────────────────────
function ArticleView({
  article,
  allArticles,
  onClose,
  onRelatedRead,
  isBookmarked,
  onToggleBookmark,
}: {
  article: NewsArticle;
  allArticles: NewsArticle[];
  onClose: () => void;
  onRelatedRead: (a: NewsArticle) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}) {
  const catColor =
    NEWS_CATEGORY_COLORS[article.category] ??
    "bg-primary/10 text-primary border-primary/20";
  const icon = CATEGORY_ICONS[article.category] ?? "📰";
  const gradient =
    CATEGORY_GRADIENTS[article.category] ?? "from-sky-600 to-blue-700";

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  function handleReadAloud() {
    if (!("speechSynthesis" in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const text = `${article.headline}. ${article.fullContent}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  function handleShare() {
    const url = article.url ?? window.location.href;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="bg-background w-full sm:max-w-2xl lg:max-w-3xl rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl"
        data-ocid="technews.dialog"
      >
        {/* Hero banner */}
        <div
          className={`px-5 pt-5 pb-4 bg-gradient-to-br ${gradient} shrink-0`}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
              {article.image ? (
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
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
              <h2 className="font-extrabold text-white text-base leading-snug">
                {article.headline}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/70 hover:text-white bg-white/15 hover:bg-white/25 rounded-xl p-1.5 shrink-0 transition-colors"
              data-ocid="technews.modal.close_button"
              aria-label="Close article"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 flex-wrap text-xs text-white/80">
            <span className="font-bold text-white">{article.source}</span>
            <span>·</span>
            <span>{article.author}</span>
            <span>·</span>
            <span>{timeAgo(article.date)}</span>
            <span className="flex items-center gap-1 ml-auto text-white/70">
              <Clock className="w-3 h-3" /> {article.readTime}
            </span>
          </div>
        </div>

        {/* Action bar */}
        <div className="shrink-0 border-b border-border px-4 py-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleReadAloud}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              isSpeaking
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/80"
            }`}
            data-ocid="technews.modal.read_aloud_button"
          >
            <Volume2 className="w-3.5 h-3.5" />
            {isSpeaking ? "Stop" : "Read aloud"}
          </button>
          <button
            type="button"
            onClick={() => onToggleBookmark(article.id)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              isBookmarked
                ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
                : "bg-muted text-muted-foreground border-border hover:text-foreground"
            }`}
            data-ocid="technews.modal.bookmark_button"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-3.5 h-3.5" />
            ) : (
              <Bookmark className="w-3.5 h-3.5" />
            )}
            {isBookmarked ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border bg-muted text-muted-foreground border-border hover:text-foreground transition-colors"
            data-ocid="technews.modal.share_button"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? "Copied!" : "Share"}
          </button>
          <div className="ml-auto">
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
                data-ocid="technews.modal.read_original"
              >
                <ExternalLink className="w-3 h-3" /> Original
              </a>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-5 py-5 space-y-5">
            {/* Summary quote */}
            <p className="text-sm font-medium text-foreground leading-relaxed border-l-4 border-primary pl-4 py-1 bg-primary/5 rounded-r-xl">
              {article.summary}
            </p>

            {/* Full content */}
            <div className="space-y-4">
              {article.fullContent
                .trim()
                .split("\n\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p
                    key={`p-${i}`}
                    className="text-sm text-foreground/85 leading-relaxed"
                  >
                    {para.trim()}
                  </p>
                ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[article.category, "Technology", "Computer Science"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ),
              )}
            </div>

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="pt-2 border-t border-border">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  Related Articles
                </h4>
                <div className="space-y-2">
                  {relatedArticles.map((rel) => (
                    <button
                      key={rel.id}
                      type="button"
                      onClick={() => onRelatedRead(rel)}
                      className="w-full flex items-start gap-3 text-left bg-muted/40 hover:bg-muted/60 rounded-xl p-3 transition-colors group"
                    >
                      <span className="text-lg shrink-0">
                        {CATEGORY_ICONS[rel.category] ?? "📰"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {rel.headline}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {rel.source} · {timeAgo(rel.date)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="h-4" />
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
  isBookmarked,
  onToggleBookmark,
}: {
  article: NewsArticle;
  index: number;
  onRead: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}) {
  const catColor =
    NEWS_CATEGORY_COLORS[article.category] ??
    "bg-primary/10 text-primary border-primary/20";
  const icon = CATEGORY_ICONS[article.category] ?? "📰";
  const gradient =
    CATEGORY_GRADIENTS[article.category] ?? "from-sky-600 to-blue-700";
  const [copied, setCopied] = useState(false);

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const url = article.url ?? window.location.href;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    onToggleBookmark(article.id);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group"
      data-ocid={`technews.item.${index + 1}`}
    >
      {/* Thumbnail strip */}
      {article.image ? (
        <div className="h-40 overflow-hidden">
          <img
            src={article.image}
            alt={article.headline}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLElement).parentElement!.style.display =
                "none";
            }}
          />
        </div>
      ) : (
        <div
          className={`h-24 bg-gradient-to-br ${gradient} flex items-center justify-center text-4xl`}
        >
          {icon}
        </div>
      )}

      <div className="p-4">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}
          >
            {article.category}
          </span>
          {article.isLive && (
            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700 px-1.5 py-0.5 rounded-full">
              LIVE
            </span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" /> {article.readTime}
          </span>
        </div>

        {/* Headline */}
        <button type="button" onClick={onRead} className="w-full text-left">
          <h3 className="font-bold text-foreground text-sm leading-snug mb-2 line-clamp-3 group-hover:text-primary transition-colors">
            {article.headline}
          </h3>
        </button>

        {/* Summary */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-3">
          {article.summary}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-semibold text-primary truncate">
              {article.source}
            </span>
            <span className="text-[10px] text-muted-foreground shrink-0">
              · {timeAgo(article.date)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              data-ocid={`technews.bookmark_button.${index + 1}`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-3.5 h-3.5" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Share"
              data-ocid={`technews.share_button.${index + 1}`}
            >
              {copied ? (
                <span className="text-[9px] font-bold text-primary">✓</span>
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={onRead}
              className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-colors"
              data-ocid={`technews.read_button.${index + 1}`}
            >
              Read
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TechNewsPage({ onBack }: { onBack: () => void }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<TabCategory>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(getBookmarks);
  const [, forceUpdate] = useState(0);
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
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
              setLastUpdated(new Date(cached.fetchedAt));
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
          NEWS_FEED_URLS.map((url) =>
            fetch(url, { signal: AbortSignal.timeout(8000) }).then(
              (r) => r.json() as Promise<RssFeed>,
            ),
          ),
        );
        const feeds: RssFeed[] = [];
        for (const r of results) {
          if (r.status === "fulfilled") feeds.push(r.value);
        }
        if (feeds.length === 0) throw new Error("All feeds failed");

        const live = mapRssToArticles(feeds, 1);
        const merged = dedupeByTitle(
          [...live].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        );

        const now = Date.now();
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ articles: merged, fetchedAt: now }),
          );
        } catch {
          /* quota */
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
    autoRefreshRef.current = setInterval(
      () => void fetchArticles(true),
      AUTO_REFRESH,
    );
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current);
    };
  }, [fetchArticles]);

  // ── Bookmark helpers ─────────────────────────────────────────────────────
  function toggleBookmark(id: string) {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveBookmarks(next);
      return next;
    });
  }

  // ── Derived lists ─────────────────────────────────────────────────────────
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: articles.length,
      Bookmarked: bookmarks.size,
    };
    for (const a of articles) {
      counts[a.category] = (counts[a.category] ?? 0) + 1;
    }
    return counts;
  }, [articles, bookmarks.size]);

  const filtered = useMemo(() => {
    let base =
      activeTab === "All"
        ? articles
        : activeTab === "Bookmarked"
          ? articles.filter((a) => bookmarks.has(a.id))
          : articles.filter((a) => a.category === (activeTab as NewsCategory));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      base = base.filter(
        (a) =>
          a.headline.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q),
      );
    }
    return base;
  }, [articles, activeTab, searchQuery, bookmarks]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // ── Open article ──────────────────────────────────────────────────────────
  function openArticle(article: NewsArticle) {
    incrementViewCount(article.id);
    forceUpdate((n) => n + 1);
    setSelectedArticle(article);
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex-1 min-h-0 bg-background flex flex-col overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
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
        {lastUpdated && (
          <p className="text-[10px] text-white/60 hidden sm:block shrink-0">
            Updated {timeAgo(lastUpdated.toISOString())}
          </p>
        )}
        <button
          type="button"
          onClick={() => void fetchArticles(false)}
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

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 pb-28">
          {/* Search + status row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search articles by title, source…"
                className="pl-9 rounded-xl bg-card border-border text-sm"
                data-ocid="technews.search_input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {usingFallback ? (
                <Badge
                  variant="outline"
                  className="text-[10px] shrink-0 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
                >
                  Cached
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-[10px] shrink-0 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300"
                >
                  Live
                </Badge>
              )}
            </div>
          </div>

          {/* Category tabs */}
          <div
            className="flex gap-2 overflow-x-auto pb-2 mb-4"
            style={{ scrollbarWidth: "none" }}
            data-ocid="technews.category.filter"
          >
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] ?? 0;
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveTab(cat);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border transition-colors shrink-0 min-h-[34px] ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                  data-ocid={`technews.filter.${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                >
                  {cat}
                  {count > 0 && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main grid + sidebar */}
          <div className="flex gap-6 items-start">
            {/* Articles column */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div
                  data-ocid="technews.loading_state"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={`sk-${i}`} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div
                  className="text-center py-20 text-muted-foreground"
                  data-ocid="technews.empty_state"
                >
                  <div className="text-5xl mb-4">
                    {searchQuery
                      ? "🔍"
                      : activeTab === "Bookmarked"
                        ? "🔖"
                        : "📭"}
                  </div>
                  <p className="font-bold text-base text-foreground mb-1">
                    {searchQuery
                      ? "No results found"
                      : activeTab === "Bookmarked"
                        ? "No bookmarks yet"
                        : "No articles in this category"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : activeTab === "Bookmarked"
                        ? "Tap the bookmark icon on any article to save it here"
                        : "Check back later for new articles"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground">
                      Showing{" "}
                      <strong className="text-foreground">
                        {Math.min(visibleCount, filtered.length)}
                      </strong>{" "}
                      of{" "}
                      <strong className="text-foreground">
                        {filtered.length}
                      </strong>{" "}
                      articles
                      {searchQuery && (
                        <span>
                          {" "}
                          for &ldquo;<em>{searchQuery}</em>&rdquo;
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visible.map((article, idx) => (
                      <NewsCard
                        key={article.id}
                        article={article}
                        index={idx}
                        onRead={() => openArticle(article)}
                        isBookmarked={bookmarks.has(article.id)}
                        onToggleBookmark={toggleBookmark}
                      />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="flex justify-center mt-6">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                        className="flex items-center gap-2 text-sm font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 px-6 py-3 rounded-full transition-colors"
                        data-ocid="technews.load_more_button"
                      >
                        Load{" "}
                        {Math.min(PAGE_SIZE, filtered.length - visibleCount)}{" "}
                        more articles
                      </button>
                    </div>
                  )}

                  {!hasMore && filtered.length > PAGE_SIZE && (
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      All {filtered.length} articles shown
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Sidebar — desktop only */}
            {!loading && articles.length > 0 && (
              <aside className="hidden lg:block w-72 shrink-0 space-y-4 sticky top-4">
                <TrendingSidebar articles={articles} onRead={openArticle} />

                {/* Category overview card */}
                <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
                  <h3 className="font-bold text-sm text-foreground mb-3">
                    By Category
                  </h3>
                  {Object.entries(categoryCounts)
                    .filter(([k]) => k !== "All" && k !== "Bookmarked")
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, count]) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setActiveTab(cat as TabCategory);
                          setVisibleCount(PAGE_SIZE);
                        }}
                        className="flex items-center gap-2 w-full hover:bg-muted/40 rounded-lg px-2 py-1.5 transition-colors group"
                      >
                        <span className="text-base">
                          {CATEGORY_ICONS[cat] ?? "📰"}
                        </span>
                        <span className="flex-1 text-xs text-foreground font-medium text-left group-hover:text-primary transition-colors">
                          {cat}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {count}
                        </span>
                      </button>
                    ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* ── Article Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleView
            article={selectedArticle}
            allArticles={articles}
            onClose={() => setSelectedArticle(null)}
            onRelatedRead={(a) => {
              incrementViewCount(a.id);
              setSelectedArticle(a);
            }}
            isBookmarked={bookmarks.has(selectedArticle.id)}
            onToggleBookmark={toggleBookmark}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
