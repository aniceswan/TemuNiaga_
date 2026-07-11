export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4001,
  apiBaseUrl: process.env.API_BASE_URL ?? "http://localhost:3501",
  authDir: process.env.WA_AUTH_DIR ?? "./wa-auth",
  maxAudioBytes: process.env.WA_MAX_AUDIO_BYTES ? Number(process.env.WA_MAX_AUDIO_BYTES) : 5 * 1024 * 1024,

  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite",
  geminiTtsModel: process.env.GEMINI_TTS_MODEL ?? "gemini-3.1-flash-tts-preview",
  get aiEnabled(): boolean {
    return Boolean(this.geminiApiKey);
  },

  whisperBin: process.env.WHISPER_BIN ?? "whisper",
  espeakBin: process.env.ESPEAK_BIN ?? "espeak-ng",
};
