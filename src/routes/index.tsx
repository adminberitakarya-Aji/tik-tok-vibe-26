import { createFileRoute } from "@tanstack/react-router";
import { ClipCard } from "@/components/feed/ClipCard";
import { TopBar } from "@/components/feed/TopBar";
import { BottomNav } from "@/components/feed/BottomNav";
import { SideNav } from "@/components/feed/SideNav";
import { DesktopHeader } from "@/components/feed/DesktopHeader";
import { clips } from "@/data/feed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rippl — Short videos, big feelings" },
      {
        name: "description",
        content:
          "Endless vertical video feed. Discover creators, songs, and moments worth replaying.",
      },
      { property: "og:title", content: "Rippl — Short videos, big feelings" },
      {
        property: "og:description",
        content:
          "Endless vertical video feed. Discover creators, songs, and moments worth replaying.",
      },
    ],
  }),
  component: Feed,
});

function Feed() {
  return (
    <div className="flex h-[100dvh] w-full bg-background text-foreground">
      <SideNav />
      <main className="relative flex min-w-0 flex-1 flex-col">
        <DesktopHeader />

        {/* Mobile: full-bleed snap feed */}
        <div className="relative flex-1 md:hidden">
          <div className="relative mx-auto h-full w-full max-w-md overflow-hidden bg-black">
            <TopBar />
            <div className="scroll-snap-y no-scrollbar h-full overflow-y-scroll">
              {clips.map((c) => (
                <div key={c.id} className="h-[100dvh] w-full">
                  <ClipCard clip={c} />
                </div>
              ))}
            </div>
            <BottomNav />
          </div>
        </div>

        {/* Desktop: centered vertical feed with snap */}
        <div className="hidden md:block flex-1 overflow-hidden">
          <div className="scroll-snap-y no-scrollbar mx-auto h-full overflow-y-scroll px-4 py-6">
            <div className="mx-auto flex w-full max-w-[420px] flex-col gap-6">
              {clips.map((c) => (
                <div
                  key={c.id}
                  className="snap-item relative aspect-[9/16] w-full overflow-hidden rounded-xl border border-border bg-black shadow-xl"
                >
                  <ClipCard clip={c} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
