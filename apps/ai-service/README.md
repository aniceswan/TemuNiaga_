# @temuniaga/ai-service

FastAPI service for the AI & Knowledge Layer (plan.md §5.3, §7): STT (faster-whisper), Gemini (intent/entity/response), RAG (pgvector), TTS.

Fase 1 scope (this pass): `/healthz` and `/` only. `app/{stt,llm,rag,tts}/` are directory stubs for Fase 3.

## Setup

```bash
pnpm --filter @temuniaga/ai-service run setup   # creates .venv, installs requirements.txt
pnpm --filter @temuniaga/ai-service run dev     # uvicorn --reload on :8000
```

The `.venv/` directory is gitignored — every clone must run `setup` once.
