import React, { useCallback, useEffect, useRef, useState } from "react";

interface LazyYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
  /** If true the iframe is loaded immediately on mount (no observer needed) */
  eager?: boolean;
}

/**
 * LazyYouTube — shows a YouTube thumbnail placeholder until the element
 * enters the viewport (IntersectionObserver) OR is clicked.
 *
 * Once activated it renders a real youtube-nocookie iframe.
 * Only ONE iframe is ever added to the DOM per component instance.
 */
export default function LazyYouTube({
  videoId,
  title,
  className = "",
  eager = false,
}: LazyYouTubeProps) {
  const [active, setActive] = useState(eager);
  const containerRef = useRef<HTMLDivElement>(null);

  // Strip any accidental extra params that might be in a raw videoId
  const cleanId = videoId.split("?")[0].split("&")[0].trim();
  const isValidId = cleanId.length > 0 && cleanId !== "undefined";

  const activate = useCallback(() => setActive(true), []);

  useEffect(() => {
    if (active || eager || !isValidId) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate();
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [active, eager, isValidId, activate]);

  // ── "Video coming soon" placeholder ──────────────────────────────────────
  if (!isValidId) {
    return (
      <div
        className={`relative aspect-video w-full bg-muted/40 rounded-xl flex items-center justify-center ${className}`}
        aria-label="Video coming soon"
      >
        <div className="text-center text-muted-foreground">
          <div className="text-3xl mb-2">🎬</div>
          <p className="text-xs font-medium">Video coming soon</p>
        </div>
      </div>
    );
  }

  // ── Activated — show real iframe ──────────────────────────────────────────
  if (active) {
    return (
      <div className={`relative aspect-video w-full ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${cleanId}?rel=0&modestbranding=1&autoplay=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  // ── Placeholder — thumbnail + red play button ─────────────────────────────
  const thumbnailUrl = `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`;

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 ${className}`}
    >
      {/* Clickable overlay as button */}
      <button
        type="button"
        aria-label={`Play video: ${title}`}
        onClick={activate}
        className="absolute inset-0 w-full h-full group cursor-pointer border-0 bg-transparent p-0"
      >
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

        {/* Red YouTube-style play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600 group-hover:bg-red-500 shadow-lg transition-all duration-200 group-hover:scale-110">
            <div className="w-0 h-0 border-y-[9px] border-y-transparent border-l-[16px] border-l-white ml-1" />
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-xs font-medium truncate text-left">
            {title}
          </p>
        </div>
      </button>
    </div>
  );
}

/** Helper to extract a YouTube video ID from a URL or bare ID string */
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  try {
    const shortMatch = urlOrId.match(/youtu\.be\/([^?&#/]+)/);
    if (shortMatch) return shortMatch[1];
    const watchMatch = urlOrId.match(/[?&]v=([^&#]+)/);
    if (watchMatch) return watchMatch[1];
    const embedMatch = urlOrId.match(/\/embed\/([^?&#/]+)/);
    if (embedMatch) return embedMatch[1];
    // Bare ID — no slashes, no dots
    if (!urlOrId.includes("/") && !urlOrId.includes(".")) return urlOrId;
  } catch {
    // ignore
  }
  return "";
}

// Suppress unused import warning — React is needed for JSX in some TS configs
void React;
