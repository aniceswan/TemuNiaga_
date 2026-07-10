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
  public-web            Next.js — marketing + public koperasi/commodity info
  koperasi-dashboard     Next.js — operator/pengurus dashboard (real data)
  buyer-portal           Next.js — RFQ/procurement (Fase 4+, placeholder now)
  admin-portal           Next.js — Kemenkop/pendamping oversight
  api                    NestJS — core backend, source of truth
  whatsapp-worker        Node — WhatsApp channel adapter host
  ai-service             FastAPI — STT/LLM/RAG/TTS

packages/
  ui                     Shared Tailwind preset + shadcn-style components
  database               Prisma schema + generated client + CSV seed pipeline
  auth                   JWT helpers, Role enum, login schema
  contracts              Shared API request/response types
  validation             Cross-cutting Zod schemas (NIK, kode_wilayah, phone)
  pricing-engine         Netback calculation (typed stub, Fase 4)
  unit-conversion        Local-dialect quantity/commodity normalization (real, tested)
  shared-types           Status lifecycle unions (plan.md §24)
```

## Local dev ports

| App | Port |
|---|---|
| api | 3001 |
| koperasi-dashboard | 3100 |
| public-web | 3010 |
| buyer-portal | 3200 |
| admin-portal | 3300 |
| whatsapp-worker | 4001 (healthz only) |
| ai-service | 8000 |
| local Postgres (dev, no Docker) | 5434 |

## Data model ground truth vs. aspirational

`packages/database/prisma/schema.prisma` has two halves:

1. **Seeded, real** — every model with a matching CSV in `db_export/` (Koperasi, Anggota, Simpanan, Produk, etc.), using Indonesian CSV-accurate names.
2. **Schema-only, unseeded** — plan.md §25's English-named B2B trade-flow entities (RFQ, Contract, Shipment, Invoice, Payment, Settlement, ...). These exist in the schema for Fase 3+/4+ but have zero rows today.

See `docs/business-rules/farmer-benefit.md` for the netback/farmer-share formulas referenced by `packages/pricing-engine`.
