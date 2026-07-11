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
db_export/               Data CSV asli (sumber seed)
```

## Prasyarat

- Node.js 20.x (lihat `.nvmrc`)
- pnpm via Corepack: `corepack enable` (versi dipin di `package.json#packageManager`)
- PostgreSQL 18 client/server terinstal secara lokal (lihat `infrastructure/docker/README.md` — Docker tidak tersedia di lingkungan pengembangan asli, jadi dokumentasi memakai instance Postgres lokal tanpa Docker)
- Python 3.12+ dengan `uv` (untuk `apps/ai-service`)
- `espeak-ng` (fallback TTS lokal) dan `openai-whisper` (`pip install openai-whisper`, menyediakan CLI `whisper`) untuk `apps/whatsapp-worker`
- Tidak perlu sistem `ffmpeg` — `ffmpeg-static` (npm) menyediakan binary sendiri

## Setup dari nol

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
cp packages/database/.env.example packages/database/.env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/whatsapp-worker/.env.example apps/whatsapp-worker/.env
# Isi GEMINI_API_KEY di apps/whatsapp-worker/.env untuk NLP fallback + TTS suara natural
# (tanpa key: keyword HARGA/LAPOR/STATUS tetap jalan, TTS jatuh ke espeak-ng)

# 4. Migrasi schema + seed data dari db_export/*.csv
pnpm db:migrate
pnpm db:seed

# 5. (Opsional) Siapkan ai-service (Python, tidak termasuk pnpm workspace)
pnpm --filter @temuniaga/ai-service run setup

# 6. Buat akun demo untuk login ke /dashboard dan /admin di apps/web
#    (auth beneran lewat JWT + bcrypt di apps/api, bukan cek hardcode)
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
# Login demo: admin@temuniaga.dev / adminpassword

# 7. Daftarkan nomor WA Anda ke seorang anggota nyata sebelum bot merespons pesan
#    (jalankan setelah apps/api hidup):
curl -X POST http://localhost:3501/wa/register -H "Content-Type: application/json" \
  -d '{"phone":"628xxxxxxxxxx","anggotaRef":"AGT-xxxx","koperasiRef":"KOP-xxxx"}'
```

## Menjalankan aplikasi

| App | Perintah | Port |
|---|---|---|
| api | `pnpm --filter @temuniaga/api run dev` | 3501 |
| web | `pnpm --filter @temuniaga/web run dev` | 3010 |
| whatsapp-worker | `pnpm --filter @temuniaga/whatsapp-worker run dev` | 4001 (healthz) |
| ai-service | `pnpm --filter @temuniaga/ai-service run dev` | 8000 |

Atau jalankan semua sekaligus: `pnpm dev` (via Turborepo).

Untuk benar-benar menyambungkan WhatsApp: set `WA_ENABLED=true` di `apps/whatsapp-worker/.env`, jalankan `dev`, lalu scan QR code yang muncul di terminal dengan WhatsApp (Perangkat Tertaut). Sesi tersimpan di `apps/whatsapp-worker/wa-auth/` (gitignored) sehingga tidak perlu scan ulang setiap restart.

Port dipilih untuk menghindari bentrok dengan proyek lain yang sudah berjalan di mesin ini (folder terpisah "TemuNiaga_vb_02" yang memakai 3000/3001/5433) — bukan bagian dari repo ini.

## Verifikasi

```bash
pnpm turbo run typecheck lint build   # seluruh workspace
pnpm --filter @temuniaga/tests run test:integration   # perlu apps/api berjalan
pnpm --filter @temuniaga/tests run test:e2e           # perlu apps/web berjalan
```

## Catatan penting

- Data di `db_export/` sudah dianonimkan sebagian (NIK, nomor telepon dimasking) — ini data sampel/uji, bukan data produksi. Tidak ada nomor HP anggota di data asli, sehingga tautan WA↔anggota harus didaftarkan manual lewat `POST /wa/register`.
- Model data di `packages/database/prisma/schema.prisma` terbagi dua: model **ber-data nyata** (nama Indonesia, sesuai CSV) dan model **skema-saja** (nama Inggris dari `plan.md` §25, belum ada datanya — RFQ, Contract, Shipment, dst., Fase 3+/4+).
- pgvector belum terpasang di lingkungan pengembangan ini — kolom `EmbeddingChunk.embedding` masih placeholder `Json`, lihat komentar di schema.
- Harga (BPS webapi) butuh `BPS_API_KEY` di `apps/api/.env` plus `domain`/`var` dataset spesifik per komoditas (dipilih dari akun BPS Anda) — lihat `apps/api/src/harga/bps-client.ts`.
- `/dashboard` dan `/admin` di `apps/web` memerlukan login (JWT asli lewat `apps/api`'s `/auth/login`, bukan cek password hardcode) — `apps/web/middleware.ts` redirect ke `/login` jika belum ada cookie sesi. `/buyer` dan `/koperasi` publik, tanpa login, karena buyer/masyarakat adalah customer bukan pengguna sistem internal.
