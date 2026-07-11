# API Documentation

`apps/api` does not yet expose generated API docs. Add `@nestjs/swagger` and mount it at `/docs` once the module surface grows beyond the Fase 1 set (auth, koperasi, anggota, audit, health) — don't hand-maintain a separate spec here in the meantime, it will drift.

For now, the source of truth is `apps/api/src/*/*.controller.ts` and the shared request/response types in `packages/contracts/src`.
