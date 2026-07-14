import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
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
  Check,
  MoreHorizontal,
} from "lucide-react";
import type { Clip } from "@/data/feed";
import { cn } from "@/lib/utils";
import { CommentSheet } from "./CommentSheet";

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

const MUTE_KEY = "rippl:muted";
function readMuted() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTE_KEY) !== "0";
}

export function DesktopClipView({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState<boolean>(readMuted);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [shareCount, setShareCount] = useState(clip.shares);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [likeBurst, setLikeBurst] = useState(0);
  const [saveBurst, setSaveBurst] = useState(0);
  const [commentPop, setCommentPop] = useState(0);
  const [sharePop, setSharePop] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    if (!paused && !errored) v.play().catch(() => {});
    else v.pause();
  }, [paused, muted, errored, retryKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    }
  }, [muted]);

  const toggleLike = () => {
    setLiked((l) => !l);
    setLikeBurst((n) => n + 1);
  };
  const togglePlay = () => setPaused((p) => !p);

  const handleFollow = () =>
    setFollowed((f) => {
      const n = !f;
      toast.success(n ? `Mengikuti ${clip.username}` : `Berhenti mengikuti ${clip.username}`);
      return n;
    });

  const handleSave = () => {
    setSaved((s) => {
      toast.success(s ? "Dihapus dari simpanan" : "Disimpan ke koleksi");
      return !s;
    });
    setSaveBurst((n) => n + 1);
  };

  const openComments = () => {
    setCommentPop((n) => n + 1);
    setCommentsOpen(true);
  };

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?clip=${clip.id}`
        : `/?clip=${clip.id}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: clip.username, text: clip.caption, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Tautan disalin");
      }
      setShareCount((c) => c + 1);
      setSharePop((n) => n + 1);
    } catch {
      /* cancelled */
    }
  };

  const retry = () => {
    setErrored(false);
    setLoaded(false);
    setRetryKey((k) => k + 1);
  };

  return (
    <article
      aria-label={`Klip dari ${clip.username}: ${clip.caption}`}
      aria-roledescription="video klip"
      className="flex items-end gap-3"
    >
      {/* Video stage */}
      <div className="flex flex-col">
        <div
          className="relative overflow-hidden rounded-lg bg-black shadow-2xl"
          style={{ height: "min(86dvh, 820px)", aspectRatio: "9 / 16" }}
        >
          <video
            key={retryKey}
            ref={videoRef}
            src={clip.videoUrl}
            loop
            playsInline
            preload="metadata"
            muted={muted}
            aria-label={`Video oleh ${clip.username}. ${paused ? "Dijeda" : "Diputar"}. Ketuk untuk ${paused ? "putar" : "jeda"}.`}
            onClick={togglePlay}
            onLoadedData={() => setLoaded(true)}
            onError={() => setErrored(true)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress((v.currentTime / v.duration) * 100);
            }}
            className="h-full w-full object-cover"
          />

          {!loaded && !errored && (
            <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-secondary via-card to-secondary" />
          )}

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

          {paused && !errored && (
            <button
              onClick={togglePlay}
              aria-label="Putar"
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <Play className="h-20 w-20 fill-white text-white drop-shadow-lg" />
            </button>
          )}

          {/* Mute + more (top corners) */}
          <button
            onClick={() => setMuted(!muted)}
            aria-label={muted ? "Suarakan" : "Bisukan"}
            className="absolute left-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur active:scale-90 cursor-pointer"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            aria-label="Lainnya"
            onClick={() => toast("Opsi video")}
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/50 text-white backdrop-blur active:scale-90 cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {/* Caption overlay (bottom-left of video, like tiktok.com) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-1 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-10">
            <div className="pointer-events-auto max-w-[80%]">
              <Link
                to="/profile/$handle"
                params={{ handle: clip.handle.replace(/^@/, "") }}
                className="text-base font-bold text-white hover:underline"
              >
                {clip.handle}
              </Link>
              <p
                className={cn(
                  "mt-1 text-sm leading-snug text-white/95",
                  !expanded && "line-clamp-2",
                )}
              >
                {clip.caption}{" "}
                {clip.tags.map((t) => (
                  <span key={t} className="font-semibold text-tikcyan">
                    #{t}{" "}
                  </span>
                ))}
              </p>
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mt-0.5 text-xs font-semibold text-white/70 hover:text-white cursor-pointer"
              >
                {expanded ? "lebih sedikit" : "selengkapnya"}
              </button>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/90">
                <Music2 className="h-3.5 w-3.5" aria-hidden />
                <span className="truncate">{clip.song}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/20">
            <div
              className="h-full bg-tikpink transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action rail — flush right of video, like tiktok.com */}
      <div className="flex flex-col items-center gap-3 pb-3">
        <div className="relative mb-1">
          <Link
            to="/profile/$handle"
            params={{ handle: clip.handle.replace(/^@/, "") }}
            aria-label={`Profil ${clip.username}`}
          >
            <img
              src={clip.avatar}
              alt={`Avatar ${clip.username}`}
              className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
            />
          </Link>
          <button
            onClick={handleFollow}
            aria-label={followed ? "Berhenti mengikuti" : "Ikuti"}
            className={cn(
              "absolute -bottom-1.5 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border-2 border-black text-xs font-bold text-white active:scale-90 cursor-pointer",
              followed ? "bg-tikcyan" : "bg-tikpink",
            )}
          >
            {followed ? <Check className="h-3 w-3" /> : "+"}
          </button>
        </div>

        <RailBtn
          onClick={toggleLike}
          ariaLabel="Suka"
          animate={likeBurst}
          variant="like"
          active={liked}
          icon={
            <Heart
              className={cn(
                "h-7 w-7 transition-colors",
                liked ? "fill-tikpink text-tikpink" : "text-white",
              )}
            />
          }
          label={formatCount(clip.likes + (liked ? 1 : 0))}
        />
        <RailBtn
          onClick={openComments}
          ariaLabel="Komentar"
          animate={commentPop}
          icon={<MessageCircle className="h-7 w-7 text-white" />}
          label={formatCount(clip.comments)}
        />
        <RailBtn
          onClick={handleSave}
          ariaLabel="Simpan"
          animate={saveBurst}
          variant="save"
          active={saved}
          icon={
            <Bookmark
              className={cn(
                "h-7 w-7 transition-colors",
                saved ? "fill-tikcyan text-tikcyan" : "text-white",
              )}
            />
          }
          label={formatCount(7273 + (saved ? 1 : 0))}
        />
        <RailBtn
          onClick={handleShare}
          ariaLabel="Bagikan"
          animate={sharePop}
          variant="share"
          icon={<Share2 className="h-7 w-7 text-white" />}
          label={formatCount(shareCount)}
        />

        <DiscButton
          onClick={() => toast(`♫ ${clip.song}`, { description: "Gunakan suara ini" })}
          ariaLabel={`Suara: ${clip.song}`}
          src={clip.avatar}
        />
      </div>

      <CommentSheet clip={clip} open={commentsOpen} onOpenChange={setCommentsOpen} />
    </div>
  );
}

function RailBtn({
  icon,
  label,
  onClick,
  ariaLabel,
  animate = 0,
  variant,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  ariaLabel: string;
  animate?: number;
  variant?: "like" | "save" | "share";
  active?: boolean;
}) {
  const [pressing, setPressing] = useState(false);
  const isLike = variant === "like";
  const isSave = variant === "save";
  const isShare = variant === "share";
  const iconKey = animate ? `${variant ?? "btn"}-${animate}` : "icon";

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      onPointerDown={() => setPressing(true)}
      onPointerUp={() => setPressing(false)}
      onPointerLeave={() => setPressing(false)}
      className={cn(
        "relative flex flex-col items-center gap-0.5 transition-transform cursor-pointer group",
        pressing && "scale-90",
      )}
    >
        <span
          className={cn(
            "relative grid h-12 w-12 place-items-center rounded-full bg-black/40 text-white transition-all duration-200 ease-out",
            "group-hover:bg-black/60 group-hover:scale-110",
            isLike && active && "bg-tikpink/20",
            isSave && active && "bg-tikcyan/20",
          )}
        >
        {isLike && active && (
          <span
            key={`ring-${animate}`}
            className="pointer-events-none absolute inset-0 rounded-full border-2 border-tikpink/60 animate-ripple-ring"
            aria-hidden
          />
        )}
        <span
          key={iconKey}
          className={cn(
            "inline-grid place-items-center",
            isLike && animate > 0 && "animate-like-burst",
            isSave && animate > 0 && "animate-save-bounce",
            isShare && animate > 0 && "animate-share-pop",
            !isLike && !isSave && !isShare && animate > 0 && "animate-comment-pop",
          )}
        >
          {icon}
        </span>
      </span>
      <span className="text-xs font-bold text-white/90 drop-shadow transition-colors group-hover:text-white">
        {label}
      </span>
    </button>
  );
}

function DiscButton({
  onClick,
  ariaLabel,
  src,
}: {
  onClick?: () => void;
  ariaLabel: string;
  src: string;
}) {
  const [pressing, setPressing] = useState(false);
  const [pop, setPop] = useState(0);

  return (
    <button
      onClick={() => {
        setPop((n) => n + 1);
        onClick?.();
      }}
      aria-label={ariaLabel}
      onPointerDown={() => setPressing(true)}
      onPointerUp={() => setPressing(false)}
      onPointerLeave={() => setPressing(false)}
      className={cn(
        "relative mt-1 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-gradient-to-br from-tikpink to-tikcyan p-0.5 transition-transform cursor-pointer group",
        pressing && "scale-90",
      )}
    >
      <span
        key={pop ? `disc-${pop}` : "disc"}
        className={cn(
          "relative block h-full w-full overflow-hidden rounded-full animate-spin-slow",
          pop > 0 && "animate-disc-pop",
        )}
      >
        <img src={src} alt="" aria-hidden className="h-full w-full rounded-full object-cover" />
      </span>
    </button>
  );
}
