import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  buildYouTubeSearchUrl,
  validateYouTubeVideo,
} from "../utils/videoUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LazyYouTubeProps {
  videoId: string;
  title: string;
  /** Topic string used to generate the YouTube search fallback link */
  topic?: string;
  /** Alternative video IDs tried in order if primary is unavailable */
  fallbackVideos?: string[];
  className?: string;
  /** Load iframe immediately on mount without waiting for viewport */
  eager?: boolean;
}

type VideoState =
  | "validating" // oEmbed check in progress
  | "ready" // video confirmed valid, showing thumbnail
  | "active" // iframe rendered
  | "unavailable"; // all IDs exhausted, show search link

// ─── Shimmer Skeleton ─────────────────────────────────────────────────────────

function VideoSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-video w-full rounded-xl overflow-hidden bg-muted/40 ${className}`}
      aria-busy="true"
      aria-label="Loading video…"
    >
      {/* Shimmer sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Play icon ghost */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-muted/60" />
      </div>
      {/* Title bar ghost */}
      <div className="absolute bottom-3 left-3 right-3 h-3 rounded bg-muted/60" />
    </div>
  );
}

// ─── Search Fallback ──────────────────────────────────────────────────────────

function VideoSearchFallback({
  topic,
  title,
  className = "",
}: {
  topic: string;
  title: string;
  className?: string;
}) {
  const searchUrl = buildYouTubeSearchUrl(topic || title);
  return (
    <div
      className={`relative aspect-video w-full rounded-xl bg-muted/40 flex flex-col items-center justify-center gap-3 ${className}`}
      aria-label="Video unavailable"
    >
      {/* YouTube icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-card border border-border">
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-destructive"
          aria-hidden={true}
        >
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
      <div className="text-center px-4">
        <p className="text-sm font-semibold text-foreground">
          Video unavailable
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          This video can't be played right now
        </p>
      </div>
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="lazy-youtube.search_link"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive text-white text-xs font-semibold hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Search icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 fill-current"
          aria-hidden={true}
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        Watch on YouTube
      </a>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LazyYouTube({
  videoId,
  title,
  topic,
  fallbackVideos = [],
  className = "",
  eager = false,
}: LazyYouTubeProps) {
  // Track which video ID is currently being used (starts at primary)
  const [currentId, setCurrentId] = useState<string>("");
  const [fallbackIndex, setFallbackIndex] = useState<number>(-1); // -1 = primary
  const [videoState, setVideoState] = useState<VideoState>("validating");
  const [inViewport, setInViewport] = useState(eager);
  const containerRef = useRef<HTMLDivElement>(null);
  const validationAbortRef = useRef<AbortController | null>(null);

  // Strip accidental extra params from the raw videoId
  const allIds = useMemo(() => {
    function cleanVideoId(raw: string): string {
      return raw.split("?")[0].split("&")[0].trim();
    }
    return [videoId, ...fallbackVideos]
      .map(cleanVideoId)
      .filter((id) => id.length > 0 && id !== "undefined");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, fallbackVideos]);

  // ── IntersectionObserver — only start validating once visible ──────────────
  useEffect(() => {
    if (eager) {
      setInViewport(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInViewport(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [eager]);

  // ── Validation chain — tries primary then each fallback in order ───────────
  useEffect(() => {
    if (!inViewport) return;
    if (allIds.length === 0) {
      setVideoState("unavailable");
      return;
    }

    let cancelled = false;
    const ids = allIds; // capture stable reference for the closure

    async function tryId(index: number) {
      const id = ids[index];
      if (!id) {
        if (!cancelled) setVideoState("unavailable");
        return;
      }

      setVideoState("validating");
      const ok = await validateYouTubeVideo(id);
      if (cancelled) return;

      if (ok) {
        setCurrentId(id);
        setFallbackIndex(index - 1); // -1 = primary, 0+ = fallback
        setVideoState("ready");
      } else {
        // Try next
        tryId(index + 1);
      }
    }

    tryId(0);

    return () => {
      cancelled = true;
      validationAbortRef.current?.abort();
    };
  }, [inViewport, allIds]);

  const activate = useCallback(() => {
    if (videoState === "ready") setVideoState("active");
  }, [videoState]);

  // ── No valid IDs at all ────────────────────────────────────────────────────
  if (allIds.length === 0) {
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

  // ── Not yet in viewport — show skeleton ───────────────────────────────────
  if (!inViewport) {
    return (
      <div ref={containerRef}>
        <VideoSkeleton className={className} />
      </div>
    );
  }

  // ── Validating — shimmer skeleton ─────────────────────────────────────────
  if (videoState === "validating") {
    return (
      <div ref={containerRef}>
        <VideoSkeleton className={className} />
      </div>
    );
  }

  // ── All videos failed — show search link ──────────────────────────────────
  if (videoState === "unavailable") {
    return (
      <div ref={containerRef}>
        <VideoSearchFallback
          topic={topic ?? title}
          title={title}
          className={className}
        />
      </div>
    );
  }

  // ── Active — render iframe ─────────────────────────────────────────────────
  if (videoState === "active") {
    return (
      <div
        ref={containerRef}
        className={`relative aspect-video w-full ${className}`}
      >
        {/* Subtle badge when showing a fallback video */}
        {fallbackIndex >= 0 && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
            Alternative video
          </div>
        )}
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${currentId}?rel=0&modestbranding=1&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 w-full h-full border-0 rounded-xl"
        />
      </div>
    );
  }

  // ── Ready — thumbnail placeholder ─────────────────────────────────────────
  const thumbnailUrl = `https://img.youtube.com/vi/${currentId}/hqdefault.jpg`;

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 ${className}`}
      data-ocid="lazy-youtube.card"
    >
      {/* Fallback badge */}
      {fallbackIndex >= 0 && (
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium pointer-events-none">
          Alternative video
        </div>
      )}

      <button
        type="button"
        aria-label={`Play video: ${title}`}
        onClick={activate}
        data-ocid="lazy-youtube.play_button"
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

// ─── Helpers (re-exported for convenience) ────────────────────────────────────

/** Extract a YouTube video ID from a URL or bare ID string */
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  try {
    const shortMatch = urlOrId.match(/youtu\.be\/([^?&#/]+)/);
    if (shortMatch) return shortMatch[1];
    const watchMatch = urlOrId.match(/[?&]v=([^&#]+)/);
    if (watchMatch) return watchMatch[1];
    const embedMatch = urlOrId.match(/\/embed\/([^?&#/]+)/);
    if (embedMatch) return embedMatch[1];
    if (!urlOrId.includes("/") && !urlOrId.includes(".")) return urlOrId;
  } catch {
    // ignore
  }
  return "";
}

// Suppress unused import warning — React is needed for JSX in some TS configs
void React;
