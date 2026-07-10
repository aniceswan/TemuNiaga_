# Deployment (target shape, not scripted this pass)

Per plan.md §5.4, out of scope for a hackathon scaffold beyond documenting intent:

- **Database**: managed PostgreSQL (with pgvector extension enabled) — e.g. RDS, Cloud SQL, or Supabase — replacing the local dev instance described in `../docker/README.md`.
- **Object storage**: S3-compatible storage in production, replacing local MinIO.
- **Compute**: `deployment_mvp: Docker Compose` for pilot scale; managed container platform or Kubernetes only once traffic justifies it (plan.md §5.2 explicitly rejects microservices/K8s for the MVP).
- **Reverse proxy**: Nginx per `../nginx/nginx.conf.example`, fronting `apps/api`, `apps/koperasi-dashboard`, `apps/public-web`, `apps/buyer-portal`, `apps/admin-portal`.
- **Secrets**: environment variables per app (`DATABASE_URL`, `JWT_SECRET`, Gemini API key, WhatsApp Cloud API credentials) — never committed; each app ships a `.env.example` documenting what's required.
- **CI/CD**: `.github/workflows/ci.yml` at the repo root currently runs install/typecheck/lint/build on every push; a deploy stage is not configured yet.
