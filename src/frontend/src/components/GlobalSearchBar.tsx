import { ArrowLeft, Clock, Search, TrendingUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

const RECENT_KEY = "codeAndCrush_recentSearches";
const MAX_RECENT = 10;

const TRENDING = [
  "Python basics",
  "Binary search",
  "React hooks",
  "System design",
  "Dynamic programming",
];

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(searches: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(searches));
}

export function addToRecentSearches(term: string) {
  if (!term.trim()) return;
  const existing = getRecent().filter(
    (s) => s.toLowerCase() !== term.toLowerCase(),
  );
  const updated = [term, ...existing].slice(0, MAX_RECENT);
  saveRecent(updated);
}

interface GlobalSearchBarProps {
  onOpenSearch: (query: string) => void;
  isSearchOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchBar({
  onOpenSearch,
  isSearchOpen,
  onClose,
}: GlobalSearchBarProps) {
  const { user } = useApp();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const refreshRecent = useCallback(() => {
    setRecentSearches(getRecent());
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      refreshRecent();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen, refreshRecent]);

  const handleSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      addToRecentSearches(trimmed);
      refreshRecent();
      onOpenSearch(trimmed);
    },
    [onOpenSearch, refreshRecent],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(query);
    if (e.key === "Escape") onClose();
  };

  const removeRecent = (term: string) => {
    const updated = getRecent().filter((s) => s !== term);
    saveRecent(updated);
    setRecentSearches(updated);
  };

  const clearAllRecent = () => {
    saveRecent([]);
    setRecentSearches([]);
  };

  const greeting = user.username ? `Hi, ${user.username}` : "Code & Crush";

  return (
    <>
      {/* Compact search icon that appears in header — triggers open */}
      {!isSearchOpen && (
        <button
          type="button"
          data-ocid="search.open_modal_button"
          aria-label="Open search"
          onClick={() => onOpenSearch("")}
          className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Search className="w-4 h-4" />
        </button>
      )}

      {/* Full search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
            data-ocid="search.dialog"
          >
            {/* Search header */}
            <div className="bg-card border-b border-border px-3 py-2.5 flex items-center gap-2 shrink-0">
              <button
                type="button"
                data-ocid="search.close_button"
                aria-label="Close search"
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 flex items-center gap-2 bg-muted border border-input rounded-xl px-3 py-2 focus-within:border-primary/60 transition-colors">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  data-ocid="search.search_input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search people, topics, problems..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none min-w-0"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear query"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {query && (
                <button
                  type="button"
                  data-ocid="search.submit_button"
                  onClick={() => handleSearch(query)}
                  className="text-primary text-sm font-semibold shrink-0 hover:text-primary/80 transition-colors px-1"
                >
                  Search
                </button>
              )}
            </div>

            {/* Empty state: recent + trending */}
            {!query && (
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        Recent searches
                      </h3>
                      <button
                        type="button"
                        data-ocid="search.clear_recent.button"
                        onClick={clearAllRecent}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <div
                          key={term}
                          data-ocid={`search.recent.item.${i + 1}`}
                          className="flex items-center gap-1 bg-muted border border-border rounded-full px-3 py-1.5 text-sm text-foreground hover:border-primary/40 transition-colors group"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setQuery(term);
                              handleSearch(term);
                            }}
                            className="max-w-[160px] truncate"
                          >
                            {term}
                          </button>
                          <button
                            type="button"
                            aria-label={`Remove ${term}`}
                            onClick={() => removeRecent(term)}
                            className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Trending topics
                  </h3>
                  <div className="space-y-2">
                    {TRENDING.map((term, i) => (
                      <button
                        type="button"
                        key={term}
                        data-ocid={`search.trending.item.${i + 1}`}
                        onClick={() => {
                          setQuery(term);
                          handleSearch(term);
                        }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                      >
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          #{i + 1}
                        </span>
                        <span className="text-sm text-foreground">{term}</span>
                        <Search className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggested users hint */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Find people
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Search by username, e.g. "
                    {greeting.split(", ")[1] ?? "coder123"}"
                  </p>
                </div>
              </div>
            )}

            {/* Has query: show quick action to run full search */}
            {query && (
              <div className="flex-1 overflow-y-auto p-4">
                <button
                  type="button"
                  onClick={() => handleSearch(query)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors text-left mb-4"
                >
                  <Search className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      Search for "{query}"
                    </p>
                    <p className="text-xs text-muted-foreground">
                      See all results: People, Topics, Problems
                    </p>
                  </div>
                </button>

                {/* Recent matching */}
                {recentSearches
                  .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                  .slice(0, 3)
                  .map((term, i) => (
                    <button
                      type="button"
                      key={term}
                      data-ocid={`search.recent_match.item.${i + 1}`}
                      onClick={() => {
                        setQuery(term);
                        handleSearch(term);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                    >
                      <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground">{term}</span>
                    </button>
                  ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
