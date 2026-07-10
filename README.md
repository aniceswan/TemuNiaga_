# TemuNiaga

Cooperative Trade Operating System untuk koperasi desa — full monorepo scaffold. Lihat `plan.md` untuk spesifikasi produk lengkap, dan `docs/architecture/README.md` untuk ringkasan arsitektur yang lebih ringkas.

## Struktur

```
apps/
  api                    NestJS — backend inti (auth, RBAC, koperasi, anggota, audit)
  koperasi-dashboard     Next.js — dashboard operator (data nyata)
  public-web             Next.js — situs publik + direktori koperasi
  admin-portal           Next.js — portal admin/pendamping
  buyer-portal           Next.js — RFQ/procurement (placeholder, Fase 4+)
  whatsapp-worker        Node — worker channel WhatsApp (adapter stub)
  ai-service             FastAPI — STT/LLM/RAG/TTS (Fase 3 stub)

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
cp apps/koperasi-dashboard/.env.example apps/koperasi-dashboard/.env.local
cp apps/public-web/.env.example apps/public-web/.env.local
cp apps/admin-portal/.env.example apps/admin-portal/.env.local

# 4. Migrasi schema + seed data dari db_export/*.csv
pnpm db:migrate
pnpm db:seed

# 5. (Opsional) Siapkan ai-service (Python, tidak termasuk pnpm workspace)
pnpm --filter @temuniaga/ai-service run setup
```

## Menjalankan aplikasi

| App | Perintah | Port |
|---|---|---|
| api | `pnpm --filter @temuniaga/api run dev` | 3001 |
| koperasi-dashboard | `pnpm --filter @temuniaga/koperasi-dashboard run dev` | 3100 |
| public-web | `pnpm --filter @temuniaga/public-web run dev` | 3010 |
| buyer-portal | `pnpm --filter @temuniaga/buyer-portal run dev` | 3200 |
| admin-portal | `pnpm --filter @temuniaga/admin-portal run dev` | 3300 |
| whatsapp-worker | `pnpm --filter @temuniaga/whatsapp-worker run dev` | 4001 (healthz) |
| ai-service | `pnpm --filter @temuniaga/ai-service run dev` | 8000 |

Atau jalankan semua sekaligus: `pnpm dev` (via Turborepo).

## Verifikasi

```bash
pnpm turbo run typecheck lint build   # seluruh workspace
pnpm --filter @temuniaga/tests run test:integration   # perlu apps/api berjalan
pnpm --filter @temuniaga/tests run test:e2e           # perlu koperasi-dashboard berjalan
```

## Catatan penting

- Data di `db_export/` sudah dianonimkan sebagian (NIK, nomor telepon dimasking) — ini data sampel/uji, bukan data produksi.
- Model data di `packages/database/prisma/schema.prisma` terbagi dua: model **ber-data nyata** (nama Indonesia, sesuai CSV) dan model **skema-saja** (nama Inggris dari `plan.md` §25, belum ada datanya — RFQ, Contract, Shipment, dst., Fase 3+/4+).
- pgvector belum terpasang di lingkungan pengembangan ini — kolom `EmbeddingChunk.embedding` masih placeholder `Json`, lihat komentar di schema.
