import { Search, Upload, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function DesktopHeader() {
  return (
    <header className="hidden md:flex sticky top-0 z-20 h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
      <div className="flex-1" />
      <label className="flex w-full max-w-md items-center gap-2 rounded-full bg-secondary px-4 py-2 focus-within:ring-2 focus-within:ring-tikcyan">
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="sr-only">Cari</span>
        <input
          type="search"
          placeholder="Cari kreator, lagu, atau tag"
          aria-label="Cari kreator, lagu, atau tag"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>
      <div className="flex flex-1 items-center justify-end gap-2">
        <button type="button" className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-semibold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tikcyan">
          <Upload className="h-4 w-4" aria-hidden /> Unggah
        </button>
        <Link to="/inbox" aria-label="Pesan" className="grid h-9 w-9 place-items-center rounded-md hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tikcyan">
          <MessageCircle className="h-5 w-5" aria-hidden />
        </Link>
        <button type="button" className="rounded-md bg-tikpink px-4 py-1.5 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tikcyan">
          Masuk
        </button>
      </div>
    </header>
  );
}
