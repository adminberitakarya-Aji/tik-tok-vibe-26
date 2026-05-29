import { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Music2, Play } from "lucide-react";
import type { Clip } from "@/data/feed";
import { cn } from "@/lib/utils";

function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function ClipCard({ clip }: { clip: Clip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeBurst, setLikeBurst] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

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
    if (visible && !paused) v.play().catch(() => {});
    else v.pause();
  }, [visible, paused]);

  const toggleLike = () => {
    setLiked((l) => !l);
    setLikeBurst((b) => b + 1);
  };

  const togglePlay = () => setPaused((p) => !p);

  return (
    <div
      ref={containerRef}
      className="snap-item relative h-[100dvh] w-full overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src={clip.videoUrl}
        loop
        muted
        playsInline
        onClick={togglePlay}
        onDoubleClick={toggleLike}
        className="h-full w-full object-cover"
      />

      {paused && (
        <button
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 flex items-center justify-center bg-black/20"
        >
          <Play className="h-20 w-20 fill-white text-white drop-shadow-lg" />
        </button>
      )}

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
          <Music2 className="h-3.5 w-3.5" />
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
            alt={clip.username}
            className="h-12 w-12 rounded-full border-2 border-white object-cover"
          />
          <button
            aria-label="Follow"
            className="absolute -bottom-2 left-1/2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full bg-tikpink text-xs font-bold text-primary-foreground"
          >
            +
          </button>
        </div>

        <ActionBtn
          onClick={toggleLike}
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
          icon={<MessageCircle className="h-8 w-8 text-white" />}
          label={formatCount(clip.comments)}
        />
        <ActionBtn
          onClick={() => setSaved((s) => !s)}
          icon={
            <Bookmark
              className={cn(
                "h-8 w-8",
                saved ? "fill-tikcyan text-tikcyan" : "text-white",
              )}
            />
          }
          label="Save"
        />
        <ActionBtn
          icon={<Share2 className="h-8 w-8 text-white" />}
          label={formatCount(clip.shares)}
        />

        {/* Spinning disc */}
        <div className="mt-2 h-12 w-12 animate-spin-slow rounded-full border border-white/20 bg-gradient-to-br from-tikpink to-tikcyan p-1">
          <img
            src={clip.avatar}
            alt=""
            className="h-full w-full rounded-full border-2 border-black object-cover"
          />
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 active:scale-90 transition"
    >
      {icon}
      <span className="text-xs font-semibold drop-shadow">{label}</span>
    </button>
  );
}
