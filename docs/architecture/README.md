# TemuNiaga Architecture (condensed)

Full spec: `../../plan.md`. This is a scan-quick orientation for new contributors.

## System layers (plan.md §4)

```
CHANNEL LAYER        WhatsApp | Public Web | Kopdes | Buyer | Admin
API GATEWAY          JWT | RBAC | Session | Rate Limit | Audit
CORE BACKEND         Member | Supply | Inventory | RFQ | Pooling | Quality
                     | Logistics | Contract | Payment | Settlement | RAT | SHU
AI & CONVERSATION     STT | Gemini | RAG | TTS | Intent | Function Calling
INTEGRATION           BPS | WA | Maps | Payment | Logistics
DATA LAYER            PostgreSQL | pgvector | Redis | Object Storage
```

## Tech stack (plan.md §5)

- Frontend: Next.js + TypeScript + Tailwind + shadcn/ui, TanStack Query, Zustand, Recharts
- Backend: NestJS modular monolith + Prisma + PostgreSQL
- AI service: FastAPI (Python) — faster-whisper STT, Gemini LLM, Gemini TTS/Piper/espeak-ng fallback, pgvector RAG
- Infra: PostgreSQL + pgvector, Redis, BullMQ, MinIO/S3, Nginx, Docker Compose

## Repo layout (plan.md §6)

```
apps/
  web                    Next.js — consolidated frontend: /, /koperasi (public),
                         /dashboard (operator/pengurus, real data), /admin
                         (Kemenkop/pendamping), /buyer (RFQ, Fase 4+ placeholder)
  api                    NestJS — core backend, source of truth
  whatsapp-worker        Node — Baileys WA bot: STT (whisper CLI) + Gemini
                         (LLM/TTS) + espeak-ng/ffmpeg-static fallback
  ai-service             FastAPI — Fase 3+ STT/LLM/RAG/TTS stub (the WA voice
                         pipeline above is self-contained in whatsapp-worker;
                         this app is not in that loop today)

packages/
  ui                     Shared Tailwind preset + shadcn-style components + SiteNav-ready AppShell
  database               Prisma schema + generated client + CSV seed pipeline
  auth                   JWT helpers, Role enum, login schema
  contracts              Shared API request/response types
  validation             Cross-cutting Zod schemas (NIK, kode_wilayah, phone)
  pricing-engine         Netback calculation (typed stub, Fase 4)
  unit-conversion        Local-dialect quantity/commodity normalization (real, tested)
  shared-types           Status lifecycle unions (plan.md §24)
```

## WhatsApp voice pipeline (apps/whatsapp-worker)

Adapted from a proven reference implementation (`wa-voice-bot-template/`), not
built from scratch: Baileys (QR login) → incoming voice note → local `whisper`
CLI (tiny model, Indonesian) → keyword intent match (HARGA/LAPOR/STATUS) or
Gemini fallback → reply text, and for voice input, Gemini TTS (voice "Kore")
or espeak-ng fallback → ffmpeg (bundled via `ffmpeg-static`) → OGG/Opus →
sent back as a voice note. Everything runs in one Node process; it calls
`apps/api`'s `/harga`, `/pasokan`, `/simpanan/status` endpoints rather than
touching the database directly (plan.md §16.4 rule 1). A phone number must
be linked to a real `Anggota`/`Koperasi` via `POST /wa/register` before the
bot will act on its messages -- see `apps/whatsapp-worker/.env.example`.

## Local dev ports

| App | Port |
|---|---|
| api | 3501 |
| web (public + koperasi + dashboard + admin + buyer, consolidated) | 3010 |
| whatsapp-worker | 4001 (healthz only) |
| ai-service | 8000 |
| local Postgres (dev, no Docker) | 5434 |

Port choices avoid clashing with an unrelated pre-existing project on this
machine (a separate "TemuNiaga_vb_02" directory already using 3000/3001/5433)
-- not something this repo owns or should touch.

## Data model ground truth vs. aspirational

`packages/database/prisma/schema.prisma` has two halves:

1. **Seeded, real** — every model with a matching CSV in `db_export/` (Koperasi, Anggota, Simpanan, Produk, etc.), using Indonesian CSV-accurate names.
2. **Schema-only, unseeded** — plan.md §25's English-named B2B trade-flow entities (RFQ, Contract, Shipment, Invoice, Payment, Settlement, ...). These exist in the schema for Fase 3+/4+ but have zero rows today.

See `docs/business-rules/farmer-benefit.md` for the netback/farmer-share formulas referenced by `packages/pricing-engine`.
