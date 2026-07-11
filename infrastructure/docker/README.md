# Docker (not available in this environment)

`docker-compose.yml` here is the documented target environment (PostgreSQL + pgvector, Redis, MinIO), matching plan.md §5.4. **It was not runnable while building this scaffold** — the development machine has no `docker` binary installed at all. If you have Docker available:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d
```

Then point every app's `DATABASE_URL` at `postgresql://temuniaga:temuniaga@localhost:5432/temuniaga_dev` and enable the pgvector extension once before running migrations:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

(Only needed once RAG/`EmbeddingChunk` work begins — see the doc-comment on `EmbeddingChunk` in `packages/database/prisma/schema.prisma`.)

## What was actually used instead (no Docker, no pgvector)

This scaffold's local dev database was brought up directly against the already-installed system PostgreSQL 18 binaries, without root/systemd, using a project-local data directory:

```bash
mkdir -p .devdata/pgdata
initdb -D .devdata/pgdata -U temuniaga --auth=trust
pg_ctl -D .devdata/pgdata -o "-p 5434 -k /tmp" -l .devdata/pg.log start
psql -h 127.0.0.1 -p 5434 -U temuniaga -d postgres -c "CREATE DATABASE temuniaga_dev;"
```

`DATABASE_URL="postgresql://temuniaga@127.0.0.1:5434/temuniaga_dev"` (see each app's `.env.example`). Port 5434 was chosen because port 5433 was already in use by an unrelated pre-existing Postgres instance on this machine, and 5432 is reserved for the Docker path above.

Redis and MinIO have no bare-metal install path on this machine and nothing in the current scaffold needs them yet (no BullMQ jobs, no file uploads implemented). Revisit before Fase 3 (WhatsApp media handling needs object storage) or any job-queue work.

pgvector is not installed as a system package here — `EmbeddingChunk.embedding` is modeled as a placeholder `Json` column instead of `Unsupported("vector(N)")` until Docker or a pgvector-enabled Postgres is available.
