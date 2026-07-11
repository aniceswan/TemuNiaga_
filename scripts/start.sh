#!/usr/bin/env bash
# Launches the full local stack with one command: ensures Postgres is
# running, then starts api + web + whatsapp-worker + ai-service in parallel
# via Turborepo. Run `pnpm bootstrap` once first if you haven't already.
set -euo pipefail
cd "$(dirname "$0")/.."

PGDATA=".devdata/pgdata"
if [ -d "$PGDATA" ] && ! pg_ctl -D "$PGDATA" status >/dev/null 2>&1; then
  echo "==> Starting local PostgreSQL..."
  pg_ctl -D "$PGDATA" -o "-p 5434 -k /tmp" -l .devdata/pg.log start
  sleep 1
elif [ ! -d "$PGDATA" ]; then
  echo "No local Postgres data dir found at $PGDATA -- run 'pnpm bootstrap' first."
  exit 1
fi

echo "==> Launching apps/api, apps/web, apps/whatsapp-worker, apps/ai-service..."
exec pnpm dev
