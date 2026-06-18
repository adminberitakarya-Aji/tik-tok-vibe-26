import { Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function TopBar() {
  const [tab, setTab] = useState<"fyp">("fyp");
  const navigate = useNavigate();
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 pt-3">
      <div className="pointer-events-auto w-10" />
      <nav className="pointer-events-auto flex items-center gap-5 text-sm font-semibold text-white/70">
        <Link
          to="/live"
          className="relative pb-1 transition hover:text-white"
        >
          LIVE
        </Link>
        <Link
          to="/following"
          className="relative pb-1 transition hover:text-white"
        >
          Mengikuti
        </Link>
        <button
          onClick={() => setTab("fyp")}
          className={cn(
            "relative pb-1 transition",
            tab === "fyp" && "text-white",
          )}
        >
          Untukmu
          {tab === "fyp" && (
            <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-white" />
          )}
        </button>
      </nav>
      <button
        onClick={() => navigate({ to: "/explore" })}
        aria-label="Cari"
        className="pointer-events-auto grid h-10 w-10 place-items-center text-white"
      >
        <Search className="h-5 w-5" />
      </button>
    </header>
  );
}
