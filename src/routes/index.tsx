import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronUp, ChevronDown, Coins, Smartphone } from "lucide-react";
import { ClipCard } from "@/components/feed/ClipCard";
import { TopBar } from "@/components/feed/TopBar";
import { BottomNav } from "@/components/feed/BottomNav";
import { SideNav } from "@/components/feed/SideNav";
import { clips } from "@/data/feed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TikTok — Make Your Day" },
      {
        name: "description",
        content:
          "Endless vertical video feed. Discover creators, songs, and moments worth replaying.",
      },
    ],
  }),
  component: Feed,
});

function Feed() {
  const [index, setIndex] = useState(0);
  const clip = clips[index];
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(clips.length - 1, i + 1));

  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground">
      <SideNav />

      {/* Mobile */}
      <main className="relative mx-auto h-full w-full max-w-md overflow-hidden bg-black md:hidden">
        <TopBar />
        <div className="scroll-snap-y no-scrollbar h-full overflow-y-scroll">
          {clips.map((c) => (
            <div key={c.id} className="h-[100dvh] w-full">
              <ClipCard clip={c} />
            </div>
          ))}
        </div>
        <BottomNav />
      </main>

      {/* Desktop: single centered video like tiktok.com */}
      <main className="relative hidden flex-1 min-w-0 md:block">
        {/* Top-right utility bar */}
        <div className="absolute right-6 top-4 z-20 flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-secondary">
            <Coins className="h-4 w-4" /> Get Coins
          </button>
          <button className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-secondary">
            <Smartphone className="h-4 w-4" /> Get App
          </button>
          <div className="ml-1 h-px w-px bg-border" />
          <button className="ml-2 grid h-8 w-8 place-items-center rounded-full bg-tikpink text-sm font-bold text-primary-foreground">
            K
          </button>
        </div>

        {/* Centered video stage */}
        <div className="flex h-full items-center justify-center px-6">
          <div
            className="relative bg-black rounded-md overflow-hidden shadow-2xl"
            style={{ height: "min(92dvh, calc((100dvh - 4rem)))", aspectRatio: "9 / 16" }}
          >
            <ClipCard key={clip.id} clip={clip} />
          </div>

          {/* Up/Down controls */}
          <div className="ml-4 flex flex-col gap-3">
            <button
              onClick={prev}
              disabled={index === 0}
              aria-label="Sebelumnya"
              className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/70 disabled:opacity-40"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              disabled={index === clips.length - 1}
              aria-label="Berikutnya"
              className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-foreground transition hover:bg-secondary/70 disabled:opacity-40"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
