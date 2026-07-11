import { config } from "./config";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface GeminiCallBody {
  contents: Array<{ parts: Array<Record<string, unknown>> }>;
  generationConfig?: Record<string, unknown>;
}

/** Raw REST call to Gemini's generateContent endpoint (mirrors the proven wa-voice-bot-template pattern). */
export async function geminiCall(body: GeminiCallBody, model = config.geminiModel): Promise<any | null> {
  if (!config.aiEnabled || !/^[a-zA-Z0-9._-]{1,100}$/.test(model)) return null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": config.geminiApiKey! },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(15_000),
        },
      );
      if (response.ok && (response.headers.get("content-type") ?? "").includes("json")) {
        return response.json();
      }
      if (attempt === 0 && (response.status === 429 || response.status >= 500)) {
        await sleep(250);
        continue;
      }
      return null;
    } catch {
      if (attempt === 0) {
        await sleep(250);
        continue;
      }
      return null;
    }
  }
  return null;
}

/** naturalAnswer() fallback for unrecognized intents (plan.md §16.3 "tidak ada -> RAG/Gemini"). */
export async function geminiAnswer(question: string): Promise<string | null> {
  const response = await geminiCall({
    contents: [
      {
        parts: [
          {
            text: `Pertanyaan pengguna: ${question.slice(0, 500)}\n\nJawab singkat dalam Bahasa Indonesia (maks 200 karakter). Jangan mengarang angka harga, stok, atau status transaksi -- jika ditanya itu, arahkan pengguna untuk mengetik HARGA, LAPOR, atau STATUS.`,
          },
        ],
      },
    ],
    generationConfig: { temperature: 0, maxOutputTokens: 200 },
  });
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
  return typeof text === "string" ? text.trim().slice(0, 800) || null : null;
}

/** Gemini multimodal STT fallback, used only if the local whisper CLI fails. */
export async function geminiTranscribe(audioBase64: string, mimeType: string): Promise<string | null> {
  if (!config.aiEnabled) return null;
  const response = await geminiCall({
    contents: [
      {
        parts: [
          { inlineData: { mimeType, data: audioBase64 } },
          { text: "Transkripsikan ucapan Bahasa Indonesia. Balas hanya transkripsi." },
        ],
      },
    ],
    generationConfig: { temperature: 0, maxOutputTokens: 300 },
  });
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
  return typeof text === "string" ? text.trim().slice(0, 1000) || null : null;
}

export interface GeminiTtsResult {
  data: string; // base64
  mimeType: string;
}

/** Gemini TTS -- returns raw inline audio (PCM) as reported by the API; caller wraps it into a playable container. */
export async function geminiTtsRaw(text: string): Promise<{ pcmBase64: string; sampleRate: number } | null> {
  const response = await geminiCall(
    {
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
      },
    },
    config.geminiTtsModel,
  );
  const part = response?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData);
  const pcmBase64 = part?.inlineData?.data;
  const rawMime = part?.inlineData?.mimeType;
  if (typeof pcmBase64 !== "string" || typeof rawMime !== "string") return null;
  const sampleRate = Number.parseInt(/rate=(\d+)/.exec(rawMime)?.[1] ?? "24000", 10);
  return { pcmBase64, sampleRate };
}
