import { Home, Compass, Plus, Inbox, User } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to?: string;
  params?: Record<string, string>;
};

const items: (Item | { create: true; label: string; to: string })[] = [
  { icon: Home, label: "Beranda", to: "/" },
  { icon: Compass, label: "Jelajah", to: "/explore" },
  { create: true, label: "Buat", to: "/upload" },
  { icon: Inbox, label: "Pesan", to: "/inbox" },
  { icon: User, label: "Profil", to: "/profile/$handle", params: { handle: "lunapark" } },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Navigasi utama"
      className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-white/10 bg-black/60 px-2 py-2 backdrop-blur-lg"
    >
      {items.map((it, i) => {
        if ("create" in it) {
          return (
            <Link
              key={i}
              to={it.to as "/"}
              aria-label="Buat video baru"
              className="relative grid h-8 w-12 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tikcyan rounded-md"
            >
              <span className="absolute inset-0 -left-1 rounded-md bg-tikcyan" aria-hidden />
              <span className="absolute inset-0 left-1 rounded-md bg-tikpink" aria-hidden />
              <span className="relative grid h-full w-full place-items-center rounded-md bg-white">
                <Plus className="h-5 w-5 text-black" strokeWidth={3} aria-hidden />
              </span>
            </Link>
          );
        }
        const active = it.to
          ? it.to === "/"
            ? pathname === "/"
            : pathname.startsWith(it.to.split("/$")[0])
          : false;
        const className = cn(
          "flex flex-col items-center gap-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tikcyan rounded-md",
          active ? "text-tikpink" : "text-white/80",
        );
        const inner = (
          <>
            <it.icon className="h-6 w-6" aria-hidden />
            <span className="text-[10px] font-medium">{it.label}</span>
          </>
        );
        if (it.to) {
          return (
            <Link
              key={i}
              to={it.to as "/"}
              params={it.params as never}
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
              className={className}
            >
              {inner}
            </Link>
          );
        }
        return (
          <button key={i} type="button" aria-label={it.label} className={className}>
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
