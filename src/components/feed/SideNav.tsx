import {
  Home,
  Compass,
  Users,
  UserPlus,
  Video,
  MessageSquare,
  Bell,
  PlusSquare,
  User,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to?: string;
  params?: Record<string, string>;
};

const items: Item[] = [
  { icon: Home, label: "For You", to: "/" },
  { icon: Compass, label: "Explore" },
  { icon: UserPlus, label: "Following" },
  { icon: Users, label: "Friends" },
  { icon: Video, label: "LIVE" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Bell, label: "Activity" },
  { icon: PlusSquare, label: "Upload" },
  { icon: User, label: "Profile", to: "/profile/$handle", params: { handle: "lunapark" } },
  { icon: MoreHorizontal, label: "More" },
];

export function SideNav() {
  return (
    <aside className="hidden md:flex h-[100dvh] w-60 lg:w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-3 py-4">
      <div className="flex items-center gap-1.5 px-3 pb-4">
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
          <path
            d="M22 6c1.2 2.4 3.4 3.6 6 3.8v4.4c-2.4 0-4.6-.8-6.4-2v9.2a7.6 7.6 0 1 1-7.6-7.6v4.4a3.2 3.2 0 1 0 3.2 3.2V6h4.8z"
            fill="currentColor"
          />
        </svg>
        <span className="text-xl font-extrabold tracking-tight">TikTok</span>
      </div>

      <div className="mb-2 flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <nav className="mt-2 flex flex-col">
        {items.map((it) => (
          <button
            key={it.label}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-[15px] font-semibold transition",
              it.active
                ? "text-tikpink"
                : "text-foreground/85 hover:bg-secondary",
            )}
          >
            <it.icon className="h-6 w-6" />
            {it.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-3 pt-6 text-[11px] leading-relaxed text-muted-foreground/80">
        <div className="font-semibold text-foreground/80">Company</div>
        <div>Program</div>
        <div>Terms & Policies</div>
        <div className="mt-3">© {new Date().getFullYear()} TikTok</div>
      </div>
    </aside>
  );
}
