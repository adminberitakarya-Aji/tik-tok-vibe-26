import { Home, Compass, Plus, Inbox, User } from "lucide-react";

export function BottomNav() {
  const items = [
    { icon: Home, label: "Home", active: true },
    { icon: Compass, label: "Discover" },
    { icon: null, label: "Create" },
    { icon: Inbox, label: "Inbox" },
    { icon: User, label: "Profile" },
  ];
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-white/10 bg-black/60 px-2 py-2 backdrop-blur-lg">
      {items.map((it, i) =>
        it.icon ? (
          <button
            key={i}
            className="flex flex-col items-center gap-0.5 text-white/80"
          >
            <it.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium">{it.label}</span>
          </button>
        ) : (
          <button
            key={i}
            aria-label="Create"
            className="relative grid h-8 w-12 place-items-center"
          >
            <span className="absolute inset-0 -left-1 rounded-md bg-tikcyan" />
            <span className="absolute inset-0 left-1 rounded-md bg-tikpink" />
            <span className="relative grid h-full w-full place-items-center rounded-md bg-white">
              <Plus className="h-5 w-5 text-black" strokeWidth={3} />
            </span>
          </button>
        ),
      )}
    </nav>
  );
}
