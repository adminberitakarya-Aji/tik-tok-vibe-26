import { Home, Compass, Users, Video, Inbox, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: Home, label: "Untukmu", active: true },
  { icon: Users, label: "Mengikuti" },
  { icon: Compass, label: "Jelajahi" },
  { icon: Video, label: "LIVE" },
  { icon: Inbox, label: "Pesan" },
  { icon: User, label: "Profil" },
];

const suggested = [
  { name: "lunapark", display: "Luna Park", avatar: "https://i.pravatar.cc/80?img=47" },
  { name: "rio.h", display: "Rio Hadid", avatar: "https://i.pravatar.cc/80?img=12" },
  { name: "sashakitchen", display: "Sasha K.", avatar: "https://i.pravatar.cc/80?img=32" },
  { name: "mikastudio", display: "Mika Studio", avatar: "https://i.pravatar.cc/80?img=5" },
];

export function SideNav() {
  return (
    <aside className="hidden md:flex h-[100dvh] w-64 lg:w-72 shrink-0 flex-col gap-2 overflow-y-auto border-r border-border bg-background px-3 py-4">
      <div className="px-3 pb-3">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-tikpink">Rip</span>
          <span className="text-tikcyan">pl</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <button
            key={it.label}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-[15px] font-semibold transition",
              it.active
                ? "bg-secondary text-tikpink"
                : "text-foreground/85 hover:bg-secondary",
            )}
          >
            <it.icon className="h-6 w-6" />
            {it.label}
          </button>
        ))}
      </nav>

      <button className="mt-3 flex items-center justify-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2.5 text-sm font-semibold text-foreground/90 hover:bg-secondary">
        <Plus className="h-4 w-4" /> Unggah
      </button>

      <div className="mt-4 rounded-md bg-secondary/40 p-3 text-xs leading-relaxed text-muted-foreground">
        Masuk untuk mengikuti kreator, menyukai video, dan melihat komentar.
        <button className="mt-2 block w-full rounded-md bg-tikpink py-2 text-sm font-semibold text-primary-foreground">
          Masuk
        </button>
      </div>

      <div className="mt-5 px-3">
        <div className="mb-2 text-xs font-semibold text-muted-foreground">Akun yang disarankan</div>
        <ul className="flex flex-col gap-2">
          {suggested.map((s) => (
            <li key={s.name} className="flex items-center gap-2">
              <img src={s.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{s.name}</div>
                <div className="truncate text-xs text-muted-foreground">{s.display}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-6 px-3 pb-4 text-[10px] leading-relaxed text-muted-foreground/70">
        Tentang · Newsroom · Karier · Iklan · Pengembang<br />
        © {new Date().getFullYear()} Rippl
      </footer>
    </aside>
  );
}
