import { createFileRoute } from "@tanstack/react-router";
import { ClipCard } from "@/components/feed/ClipCard";
import { TopBar } from "@/components/feed/TopBar";
import { BottomNav } from "@/components/feed/BottomNav";
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
    <main className="relative mx-auto h-[100dvh] w-full max-w-md overflow-hidden bg-black">
      <TopBar />
      <div className="scroll-snap-y no-scrollbar h-full overflow-y-scroll">
        {clips.map((c) => (
          <ClipCard key={c.id} clip={c} />
        ))}
      </div>
      <BottomNav />
    </main>
  );
}
