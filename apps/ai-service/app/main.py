from fastapi import FastAPI

app = FastAPI(title="TemuNiaga AI Service")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "ai-service",
        "description": "STT, Gemini, RAG, and TTS layer for the WhatsApp conversational access channel (plan.md §5.3, §7).",
    }


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "service": "ai-service"}
