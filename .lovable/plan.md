# Roadmap Rippl — Dari Prototipe ke Produksi

Saat ini app baru berupa feed vertikal dengan 5 video demo dari CDN publik, tanpa backend, auth, upload, atau interaksi nyata. Roadmap di bawah membawanya ke kondisi layak rilis.

---

## Fase 1 — Fondasi UX & Konten (1–2 hari)
Tujuan: pengalaman menonton terasa solid sebelum nambah fitur berat.

1. Polish player: preload pintar (current + next), mute toggle global, progress bar tipis, tap-to-pause, double-tap heart animasi.
2. Skeleton loading + error state per klip (video gagal load → retry).
3. Halaman tambahan: `/profile/$handle`, `/clip/$id` (deep link), `/discover`, `/inbox`, `/create` (placeholder dulu).
4. SEO per route: title, description, og:image dari thumbnail klip.
5. Aksesibilitas: caption/subtitle track, focus ring, ARIA pada tombol aksi.

## Fase 2 — Backend & Auth (2–3 hari)
Tujuan: data nyata, multi-user.

1. Aktifkan Lovable Cloud.
2. Skema database:
   - `profiles` (id, handle, display_name, avatar_url, bio)
   - `clips` (id, user_id, video_url, thumb_url, caption, song, duration, created_at)
   - `likes`, `comments`, `follows`, `saves`, `shares`
   - `user_roles` + enum `app_role` (pakai pola `has_role` security-definer)
3. RLS + GRANT untuk tiap tabel (read publik untuk clips/profiles, write hanya owner).
4. Auth email + Google OAuth, halaman `/login`, route group `_authenticated/` untuk create/inbox/settings.
5. Server functions: `getFeed`, `getProfile`, `toggleLike`, `addComment`, `toggleFollow`.

## Fase 3 — Upload & Pemrosesan Video (2–3 hari)
1. Storage bucket `clips/` (publik baca, auth tulis) + `avatars/`.
2. Halaman `/create`: pilih file → validasi (≤ 60 dtk, ≤ 100 MB, mp4/mov) → upload langsung ke storage dengan progress.
3. Thumbnail di-generate di browser (canvas dari frame pertama) sebelum upload.
4. Form caption, hashtag, judul lagu; simpan row `clips`.
5. Moderasi dasar: rate limit per user, daftar kata terlarang, tombol report.

## Fase 4 — Sosial & Penemuan (2 hari)
1. Algoritma feed sederhana: campur following + trending (skor = likes × recency).
2. Halaman discover: grid trending + pencarian hashtag/user.
3. Notifikasi (`/inbox`): like, comment, follow baru — realtime via Supabase channel.
4. Share: tombol copy link + Web Share API.

## Fase 5 — Performa & Mobile Polish (1–2 hari)
1. Lazy mount klip jauh dari viewport, unmount video di luar 2 layar.
2. Adaptive quality (jika pakai HLS) atau kompresi pre-upload via `@ffmpeg/ffmpeg` WASM.
3. PWA: manifest, ikon, splash, offline shell.
4. Lighthouse pass: LCP < 2.5s, CLS < 0.1, TBT rendah.

## Fase 6 — Trust, Safety, Legal (1 hari)
1. Halaman `/terms`, `/privacy`, `/community-guidelines`, `/dmca`.
2. Cookie/consent banner (jika target EU).
3. Tombol block user, hide klip, report dengan kategori.
4. Panel admin di `/admin` (role-gated) untuk review report & hapus konten.

## Fase 7 — Observability & Rilis (1 hari)
1. Error tracking (Sentry) di client + server functions.
2. Analytics event: view, watch_time, like, follow, upload_success.
3. Security scan + perbaiki temuan, audit RLS.
4. Custom domain, publish, set og:image global, sitemap.xml + robots.txt.
5. Smoke test end-to-end di mobile asli (iOS Safari, Android Chrome).

---

## Detail Teknis Singkat
- Stack tetap: TanStack Start + Tailwind v4 + shadcn + Lovable Cloud (Supabase).
- Hindari paket Node-only di server functions (lihat batasan Workers runtime).
- Semua warna via token semantik di `src/styles.css`, jangan `text-white` mentah.
- Route baru pakai file-based routing (`src/routes/...`), bukan `src/pages/`.
- Upload langsung client → storage (signed URL atau policy), bukan via server fn besar.

## Estimasi Total
~10–14 hari kerja fokus untuk MVP siap publik. Fase 1–3 wajib sebelum demo; Fase 6–7 wajib sebelum traffic nyata.

## Saran Urutan Mulai
Fase 1 (UX polish) **paralel** dengan Fase 2 (aktifkan Cloud + skema) — keduanya tidak saling blok.
