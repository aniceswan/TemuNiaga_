#!/usr/bin/env bash
# One-time environment bootstrap. Safe to re-run (every step is idempotent).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Checking prerequisites..."
command -v node >/dev/null || { echo "Node.js 20+ required: https://nodejs.org"; exit 1; }
command -v psql >/dev/null || { echo "PostgreSQL client required (psql)."; exit 1; }
command -v initdb >/dev/null || { echo "PostgreSQL server required (initdb)."; exit 1; }
command -v espeak-ng >/dev/null || echo "WARNING: espeak-ng not found -- WA voice TTS fallback won't work (dnf/apt install espeak-ng)."
command -v whisper >/dev/null || echo "WARNING: whisper CLI not found -- WA voice STT won't work (pip install openai-whisper)."
command -v uv >/dev/null || echo "WARNING: uv not found -- apps/ai-service setup will be skipped (https://docs.astral.sh/uv/)."

echo "==> Enabling corepack + installing Node dependencies..."
corepack enable 2>/dev/null || true
pnpm install

echo "==> Setting up local PostgreSQL (no Docker required)..."
PGDATA=".devdata/pgdata"
if [ ! -d "$PGDATA" ]; then
  mkdir -p "$PGDATA"
  initdb -D "$PGDATA" -U temuniaga --auth=trust
fi
if ! pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
  pg_ctl -D "$PGDATA" -o "-p 5434 -k /tmp" -l .devdata/pg.log start
  sleep 1
fi
psql -h 127.0.0.1 -p 5434 -U temuniaga -d postgres -tc \
  "SELECT 1 FROM pg_database WHERE datname = 'temuniaga_dev'" | grep -q 1 || \
  psql -h 127.0.0.1 -p 5434 -U temuniaga -d postgres -c "CREATE DATABASE temuniaga_dev;"

echo "==> Copying .env files (keeps any that already exist)..."
[ -f packages/database/.env ] || cp packages/database/.env.example packages/database/.env
[ -f apps/api/.env ] || cp apps/api/.env.example apps/api/.env
[ -f apps/web/.env.local ] || cp apps/web/.env.example apps/web/.env.local
[ -f apps/whatsapp-worker/.env ] || cp apps/whatsapp-worker/.env.example apps/whatsapp-worker/.env

echo "==> Migrating database schema..."
pnpm db:migrate

echo "==> Seeding database from db_export/*.csv..."
ANGGOTA_COUNT=$(psql -h 127.0.0.1 -p 5434 -U temuniaga -d temuniaga_dev -tAc "SELECT count(*) FROM anggota_koperasi" 2>/dev/null || echo 0)
if [ "$ANGGOTA_COUNT" -gt 0 ]; then
  echo "    Already seeded ($ANGGOTA_COUNT anggota found) -- skipping. Two tables (Kbli, BarangKeluar)"
  echo "    have no dedup key and would duplicate on re-seed, so this only seeds once."
  echo "    To force a clean reseed: pnpm --filter @temuniaga/database run seed (after truncating tables yourself)."
else
  pnpm db:seed
fi

echo "==> Creating demo login user (admin@temuniaga.dev / adminpassword)..."
(cd packages/database && pnpm exec tsx -e "
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
")

if command -v uv >/dev/null; then
  echo "==> Setting up apps/ai-service Python environment..."
  pnpm --filter @temuniaga/ai-service run setup
fi

echo ""
echo "Setup complete. Run 'pnpm start' to launch everything."
echo "Demo login: admin@temuniaga.dev / adminpassword"
echo "To connect WhatsApp for real: set WA_ENABLED=true in apps/whatsapp-worker/.env before 'pnpm start', then scan the QR."
