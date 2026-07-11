# TemuNiaga

Cooperative Trade Operating System untuk koperasi desa — full monorepo scaffold. Lihat `plan.md` untuk spesifikasi produk lengkap, dan `docs/architecture/README.md` untuk ringkasan arsitektur yang lebih ringkas.

## Struktur

```
apps/
  web                    Next.js — frontend konsolidasi: / , /koperasi (publik),
                         /dashboard (operator, data nyata), /admin (Kemenkop),
                         /buyer (RFQ, placeholder Fase 4+)
  api                    NestJS — backend inti (auth, RBAC, koperasi, anggota,
                         audit, harga, pasokan, simpanan, wa-registration)
  whatsapp-worker        Node — bot WA Baileys: STT (whisper CLI) + Gemini
                         (LLM/TTS) + fallback espeak-ng/ffmpeg-static
  ai-service             FastAPI — stub Fase 3+ (STT/LLM/RAG/TTS; pipeline WA
                         di atas sudah lengkap sendiri di whatsapp-worker)

packages/
  database               Prisma schema + seed CSV -> Postgres
  ui                     Komponen shadcn-style + preset Tailwind bersama
  auth, contracts, validation, pricing-engine, unit-conversion, shared-types

infrastructure/          Docker Compose (target), Nginx, monitoring, deployment notes
docs/                    Arsitektur, business rules, SOP/legal/API stubs
tests/                   Integration (Node test) + E2E (Playwright) + load stub
db_export/               Data CSV sintetis/dummy (sumber seed) -- lihat catatan di bawah
```

> **Catatan tentang data:** repo publik ini memakai `db_export/` yang **sepenuhnya sintetis** (nama, NIK, alamat, dll. seluruhnya fabrikasi, dibuat dengan skrip generator, bukan berasal dari orang nyata), meski strukturnya identik dengan skema data asli hackathon. Ini supaya repo bisa aman publik di GitHub tanpa mempublikasikan data anggota koperasi yang sesungguhnya. Skala juga lebih kecil (24 koperasi, bukan 1.026) supaya cepat di-seed untuk demo.

## Prasyarat

- Node.js 20.x (lihat `.nvmrc`)
- pnpm via Corepack: `corepack enable` (versi dipin di `package.json#packageManager`)
- PostgreSQL 18 client/server terinstal secara lokal (lihat `infrastructure/docker/README.md` — Docker tidak tersedia di lingkungan pengembangan asli, jadi dokumentasi memakai instance Postgres lokal tanpa Docker)
- Python 3.12+ dengan `uv` (untuk `apps/ai-service`)
- `espeak-ng` (fallback TTS lokal) dan `openai-whisper` (`pip install openai-whisper`, menyediakan CLI `whisper`) untuk `apps/whatsapp-worker`
- Tidak perlu sistem `ffmpeg` — `ffmpeg-static` (npm) menyediakan binary sendiri

## Setup dan menjalankan (1 baris)

```bash
pnpm bootstrap   # sekali saja: install, init Postgres lokal, migrate, seed, buat akun demo
pnpm start       # setiap mau jalan: start Postgres (jika belum) + api + web + whatsapp-worker + ai-service sekaligus
```

(Skrip dinamai `bootstrap`, bukan `setup` -- `pnpm setup` sudah dipakai pnpm sendiri untuk hal lain, jadi nama itu dihindari supaya tidak bentrok.)

`pnpm bootstrap` (`scripts/setup.sh`) melakukan semuanya: cek prasyarat, `pnpm install`, `initdb`+start PostgreSQL lokal (tanpa Docker), bikin database, salin semua `.env.example` -> `.env`/`.env.local` yang belum ada, migrate + seed dari `db_export/*.csv`, buat akun demo (`admin@temuniaga.dev` / `adminpassword`), dan siapkan venv `apps/ai-service` kalau `uv` tersedia. Aman dijalankan ulang (idempotent).

`pnpm start` (`scripts/start.sh`) memastikan Postgres lokal jalan lalu menjalankan `api` (3501), `web` (3010), `whatsapp-worker` (4001, healthz), dan `ai-service` (8000) sekaligus lewat Turborepo — tekan `Ctrl+C` sekali untuk stop semuanya.

Setelah `pnpm bootstrap`, satu langkah manual yang tersisa (isi API key/nomor WA, tidak bisa diotomatisasi):

```bash
# Isi GEMINI_API_KEY di apps/whatsapp-worker/.env untuk NLP fallback + TTS suara natural
# (tanpa key: keyword HARGA/LAPOR/STATUS tetap jalan, TTS jatuh ke espeak-ng)

# Daftarkan nomor WA Anda ke seorang anggota nyata (setelah 'pnpm start' jalan):
curl -X POST http://localhost:3501/wa/register -H "Content-Type: application/json" \
  -d '{"phone":"628xxxxxxxxxx","anggotaRef":"AGT-xxxx","koperasiRef":"KOP-xxxx"}'

# Untuk benar-benar menyambungkan WhatsApp: set WA_ENABLED=true di
# apps/whatsapp-worker/.env sebelum 'pnpm start', lalu scan QR yang muncul
# di terminal dengan WhatsApp (Perangkat Tertaut). Sesi tersimpan di
# apps/whatsapp-worker/wa-auth/ (gitignored), tidak perlu scan ulang tiap restart.
```

### Setup manual (kalau `pnpm bootstrap` gagal di langkah tertentu)

<details>
<summary>Klik untuk lihat langkah manual step-by-step</summary>

```bash
# 1. Install semua dependency Node
pnpm install

# 2. Siapkan PostgreSQL lokal (lihat infrastructure/docker/README.md untuk detail/alternatif)
mkdir -p .devdata/pgdata
initdb -D .devdata/pgdata -U temuniaga --auth=trust
pg_ctl -D .devdata/pgdata -o "-p 5434 -k /tmp" -l .devdata/pg.log start
psql -h 127.0.0.1 -p 5434 -U temuniaga -d postgres -c "CREATE DATABASE temuniaga_dev;"

# 3. Salin .env.example -> .env / .env.local di setiap package/app yang membutuhkan
#    DATABASE_URL: postgresql://temuniaga@127.0.0.1:5434/temuniaga_dev
#    (apps/web tidak butuh DATABASE_URL -- lihat "Mode Deployment" di bawah)
cp packages/database/.env.example packages/database/.env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/whatsapp-worker/.env.example apps/whatsapp-worker/.env

# 4. Migrasi schema + seed data dari db_export/*.csv
pnpm db:migrate
pnpm db:seed

# 5. (Opsional) Siapkan ai-service (Python, tidak termasuk pnpm workspace)
pnpm --filter @temuniaga/ai-service run setup

# 6. Buat akun demo untuk login ke /dashboard dan /admin di apps/web
cd packages/database && pnpm exec tsx -e "
import { prisma } from './src/index';
import bcrypt from 'bcryptjs';
(async () => {
  const passwordHash = await bcrypt.hash('adminpassword', 10);
  await prisma.user.upsert({
    where: { email: 'admin@temuniaga.dev' },
    update: { passwordHash },
    create: { email: 'admin@temuniaga.dev', passwordHash, name: 'Admin Demo', role: 'SUPER_ADMIN' },
  });
})().finally(() => prisma.\$disconnect());
" && cd ../..
```

Lalu jalankan tiap app satu-satu kalau perlu, bukan lewat `pnpm start`:

| App | Perintah | Port |
|---|---|---|
| api | `pnpm --filter @temuniaga/api run dev` | 3501 |
| web | `pnpm --filter @temuniaga/web run dev` | 3010 |
| whatsapp-worker | `pnpm --filter @temuniaga/whatsapp-worker run dev` | 4001 (healthz) |
| ai-service | `pnpm --filter @temuniaga/ai-service run dev` | 8000 |

</details>

Port dipilih untuk menghindari bentrok dengan proyek lain yang sudah berjalan di mesin ini (folder terpisah "TemuNiaga_vb_02" yang memakai 3000/3001/5433) — bukan bagian dari repo ini.

## Mode Deployment

`apps/web` tidak pernah mengakses database secara langsung — setiap halaman dan `app/api/auth/login`'s route handler memanggil `apps/api` lewat HTTP (`apps/web/lib/api.ts`), memakai satu env var: `API_BASE_URL`. Ini yang membuat 2 mode berikut mungkin tanpa mengubah kode sama sekali, cuma env var:

### Mode 1: Full Lokal (default)

Semua servis (`web`, `api`, `whatsapp-worker`, `ai-service`, Postgres) jalan di mesin yang sama, seperti dijelaskan di "Setup dari nol" di atas. `apps/web/.env.local` memakai `API_BASE_URL=http://localhost:3501`.

### Mode 2: Frontend Deploy + Backend Lokal

Backend (`api`, `whatsapp-worker`, `ai-service`, Postgres) tetap jalan di mesin Anda seperti Mode 1 — cuma `apps/api` perlu diekspos ke internet lewat tunnel, lalu `apps/web` dideploy ke Vercel dan diarahkan ke URL tunnel tersebut.

**1. Ekspos `apps/api` (port 3501) lewat tunnel** — pilih salah satu, keduanya gratis dan tanpa perlu bikin server sendiri:

```bash
# Opsi A: Cloudflare quick tunnel -- tanpa akun/signup sama sekali
npx cloudflared tunnel --url http://localhost:3501
# -> mencetak URL publik seperti https://xxxx-xxxx.trycloudflare.com

# Opsi B: ngrok -- perlu akun gratis + authtoken (ngrok config add-authtoken <token>)
npx ngrok http 3501
# -> mencetak URL publik seperti https://xxxx.ngrok-free.app
```

Catat URL publik tersebut (HTTPS). `app.enableCors()` sudah aktif di `apps/api/src/main.ts` (mengizinkan semua origin), jadi tidak perlu konfigurasi CORS tambahan.

**2. Deploy `apps/web` ke Vercel:**

```bash
npx vercel --cwd apps/web
# atau hubungkan repo GitHub ini ke Vercel dan set:
#   Root Directory: apps/web
```

Di dashboard Vercel (atau lewat `vercel env add`), set environment variable:

```
API_BASE_URL=https://xxxx-xxxx.trycloudflare.com   # URL tunnel dari langkah 1
```

Deploy ulang. `apps/web` yang berjalan di Vercel sekarang memanggil `apps/api` di mesin lokal Anda lewat tunnel — semua fitur (koperasi, dashboard, login, admin) jalan sama seperti Mode 1.

**Catatan:**
- Tunnel gratis (baik Cloudflare quick tunnel maupun ngrok free tier) memberi URL baru setiap kali dijalankan ulang — update `API_BASE_URL` di Vercel tiap kali tunnel di-restart, atau pakai tunnel berbayar/akun untuk URL tetap.
- Backend (Postgres, `apps/api`, dll) harus tetap menyala selama demo — tunnel hanya meneruskan trafik, bukan hosting.
- Mode ini belum diuji lewat deployment Vercel/tunnel sungguhan di lingkungan pengembangan repo ini (tidak ada akses internet keluar untuk Vercel/Cloudflare/ngrok saat scaffold ini dibuat) — yang sudah diverifikasi adalah bagian intinya: `apps/web` benar-benar nol import Prisma/database dan 100% jalan lewat `fetch()` ke `apps/api`, jadi mengarahkan `API_BASE_URL` ke URL manapun (lokal atau tunnel) seharusnya bekerja identik.

## Verifikasi

```bash
pnpm turbo run typecheck lint build   # seluruh workspace
pnpm --filter @temuniaga/tests run test:integration   # perlu apps/api berjalan
pnpm --filter @temuniaga/tests run test:e2e           # perlu apps/web berjalan
```

## Catatan penting

- Data di `db_export/` di repo ini seluruhnya sintetis/dummy (lihat catatan di bagian "Struktur" di atas) — bukan data produksi maupun data hackathon asli. Tidak ada nomor HP anggota di data ini, sehingga tautan WA↔anggota harus didaftarkan manual lewat `POST /wa/register`.
- Model data di `packages/database/prisma/schema.prisma` terbagi dua: model **ber-data nyata** (nama Indonesia, sesuai CSV) dan model **skema-saja** (nama Inggris dari `plan.md` §25, belum ada datanya — RFQ, Contract, Shipment, dst., Fase 3+/4+).
- pgvector belum terpasang di lingkungan pengembangan ini — kolom `EmbeddingChunk.embedding` masih placeholder `Json`, lihat komentar di schema.
- Harga (BPS webapi) butuh `BPS_API_KEY` di `apps/api/.env` plus `domain`/`var` dataset spesifik per komoditas (dipilih dari akun BPS Anda) — lihat `apps/api/src/harga/bps-client.ts`.
- `/dashboard` dan `/admin` di `apps/web` memerlukan login (JWT asli lewat `apps/api`'s `/auth/login`, bukan cek password hardcode) — `apps/web/middleware.ts` redirect ke `/login` jika belum ada cookie sesi. `/buyer` dan `/koperasi` publik, tanpa login, karena buyer/masyarakat adalah customer bukan pengguna sistem internal.
