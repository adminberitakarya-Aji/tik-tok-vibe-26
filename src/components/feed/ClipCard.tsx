import { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  Play,
  Volume2,
  VolumeX,
  AlertTriangle,
} from "lucide-react";
import type { Clip } from "@/data/feed";
import { cn } from "@/lib/utils";

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

// Global mute preference shared across all clips
const MUTE_KEY = "rippl:muted";
const muteListeners = new Set<(m: boolean) => void>();
let globalMuted = true;
if (typeof window !== "undefined") {
  globalMuted = window.localStorage.getItem(MUTE_KEY) !== "0";
}
function setGlobalMuted(m: boolean) {
  globalMuted = m;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  }
  muteListeners.forEach((fn) => fn(m));
}
function useGlobalMuted() {
  const [m, setM] = useState(globalMuted);
  useEffect(() => {
    muteListeners.add(setM);
    return () => {
      muteListeners.delete(setM);
    };
  }, []);
  return [m, setGlobalMuted] as const;
}

export function ClipCard({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeBurst, setLikeBurst] = useState(0);
  const [floatHearts, setFloatHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [muted, setMuted] = useGlobalMuted();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio > 0.6),
      { threshold: [0, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (visible && !paused && !errored) v.play().catch(() => {});
    else v.pause();
  }, [visible, paused, muted, errored]);

  const toggleLike = () => {
    setLiked(true);
    setLikeBurst((b) => b + 1);
  };

  const togglePlay = () => setPaused((p) => !p);

  const handleDoubleTap = (e: React.MouseEvent<HTMLVideoElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setFloatHearts((arr) => [...arr, { id, x, y }]);
    setTimeout(() => setFloatHearts((arr) => arr.filter((h) => h.id !== id)), 900);
    toggleLike();
  };

  const retry = () => {
    setErrored(false);
    setLoaded(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <div
      ref={containerRef}
      className="snap-item relative h-full min-h-full w-full overflow-hidden bg-black md:h-full [.md\\:hidden_&]:h-[100dvh]"
    >
      <video
        key={retryKey}
        ref={videoRef}
        src={clip.videoUrl}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
        onLoadedData={() => setLoaded(true)}
        onError={() => setErrored(true)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress((v.currentTime / v.duration) * 100);
        }}
        className="h-full w-full object-cover"
      />

      {/* Loading skeleton */}
      {!loaded && !errored && (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-secondary via-card to-secondary" />
      )}

      {/* Error state */}
      {errored && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 px-6 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" aria-hidden />
          <p className="text-sm text-foreground/90">Gagal memuat video.</p>
          <button
            onClick={retry}
            className="rounded-full bg-tikpink px-5 py-2 text-sm font-semibold text-primary-foreground active:scale-95"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Floating hearts on double-tap */}
      {floatHearts.map((h) => (
        <Heart
          key={h.id}
          aria-hidden
          className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 fill-tikpink text-tikpink animate-pulse-heart drop-shadow-2xl"
          style={{ left: h.x, top: h.y }}
        />
      ))}

      {paused && !errored && (
        <button
          onClick={togglePlay}
          aria-label="Putar"
          className="absolute inset-0 flex items-center justify-center bg-black/20"
        >
          <Play className="h-20 w-20 fill-white text-white drop-shadow-lg" />
        </button>
      )}

      {/* Mute toggle */}
      <button
        onClick={() => setMuted(!muted)}
        aria-label={muted ? "Suarakan" : "Bisukan"}
        aria-pressed={!muted}
        className="absolute right-3 top-20 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-foreground backdrop-blur active:scale-90"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Bottom: caption & meta */}
      <div className="absolute inset-x-0 bottom-20 px-4 pr-20 text-foreground">
        <div className="text-lg font-bold tracking-tight">{clip.handle}</div>
        <p className="mt-1 line-clamp-3 text-sm leading-snug">
          {clip.caption}{" "}
          {clip.tags.map((t) => (
            <span key={t} className="font-semibold text-tikcyan">#{t} </span>
          ))}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-foreground/90">
          <Music2 className="h-3.5 w-3.5" aria-hidden />
          <div className="relative w-40 overflow-hidden">
            <div className="animate-[marquee_12s_linear_infinite] whitespace-nowrap">
              {clip.song} · {clip.song}
            </div>
          </div>
        </div>
      </div>

      {/* Right action rail */}
      <div className="absolute bottom-24 right-2 flex flex-col items-center gap-5 text-foreground">
        <div className="relative">
          <img
            src={clip.avatar}
            alt={`Avatar ${clip.username}`}
            className="h-12 w-12 rounded-full border-2 border-white object-cover"
          />
          <button
            aria-label={`Ikuti ${clip.username}`}
            className="absolute -bottom-2 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-tikpink text-xs font-bold text-primary-foreground"
          >
            +
          </button>
        </div>

        <ActionBtn
          onClick={toggleLike}
          ariaLabel="Suka"
          ariaPressed={liked}
          icon={
            <Heart
              key={likeBurst}
              className={cn(
                "h-8 w-8 transition",
                liked ? "fill-tikpink text-tikpink animate-pulse-heart" : "text-white",
              )}
            />
          }
          label={formatCount(clip.likes + (liked ? 1 : 0))}
        />
        <ActionBtn
          ariaLabel="Komentar"
          icon={<MessageCircle className="h-8 w-8 text-white" />}
          label={formatCount(clip.comments)}
        />
        <ActionBtn
          onClick={() => setSaved((s) => !s)}
          ariaLabel="Simpan"
          ariaPressed={saved}
          icon={
            <Bookmark
              className={cn(
                "h-8 w-8",
                saved ? "fill-tikcyan text-tikcyan" : "text-white",
              )}
            />
          }
          label="Simpan"
        />
        <ActionBtn
          ariaLabel="Bagikan"
          icon={<Share2 className="h-8 w-8 text-white" />}
          label={formatCount(clip.shares)}
        />

        {/* Spinning disc */}
        <div className="mt-2 h-12 w-12 animate-spin-slow rounded-full border border-white/20 bg-gradient-to-br from-tikpink to-tikcyan p-1">
          <img
            src={clip.avatar}
            alt=""
            aria-hidden
            className="h-full w-full rounded-full border-2 border-black object-cover"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="absolute inset-x-0 bottom-16 h-0.5 bg-white/20"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-tikcyan transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  ariaLabel,
  ariaPressed,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  ariaLabel: string;
  ariaPressed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className="flex flex-col items-center gap-1 active:scale-90 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-tikcyan rounded-md"
    >
      {icon}
      <span className="text-xs font-semibold drop-shadow">{label}</span>
    </button>
  );
}
