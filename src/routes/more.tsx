import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/feed/PageShell";
import {
  Settings,
  Globe,
  Shield,
  HelpCircle,
  Moon,
  LogOut,
  FileText,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/more")({
  head: () => ({
    meta: [
      { title: "Lainnya — Klip" },
      { name: "description", content: "Pengaturan dan opsi tambahan." },
    ],
  }),
  component: MorePage,
});

const groups: { title: string; items: { icon: any; label: string; danger?: boolean }[] }[] = [
  {
    title: "Akun",
    items: [
      { icon: Settings, label: "Pengaturan" },
      { icon: Shield, label: "Privasi" },
      { icon: Globe, label: "Bahasa" },
      { icon: Moon, label: "Tampilan" },
    ],
  },
  {
    title: "Dukungan",
    items: [
      { icon: HelpCircle, label: "Bantuan" },
      { icon: FileText, label: "Ketentuan & Kebijakan" },
    ],
  },
  {
    title: "Sesi",
    items: [{ icon: LogOut, label: "Keluar", danger: true }],
  },
];

function MorePage() {
  return (
    <PageShell title="Lainnya" subtitle="Pengaturan dan opsi tambahan">
      <div className="mx-auto max-w-2xl space-y-6">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {g.title}
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              {g.items.map((it, i) => (
                <button
                  key={it.label}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm transition hover:bg-secondary/50 ${
                    i > 0 ? "border-t border-border" : ""
                  } ${it.danger ? "text-tikpink" : ""}`}
                >
                  <it.icon className="h-5 w-5" />
                  <span className="flex-1 font-medium">{it.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
