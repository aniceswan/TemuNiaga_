import { execFile } from "node:child_process";
import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import { config } from "./config";
import { geminiTtsRaw } from "./gemini";

export interface SpeechResult {
  data: string; // base64
  mimeType: string;
}

function sanitizeForSpeech(text: string): string {
  return text
    .replace(/[^\w\s.,!?;:()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

/**
 * Text -> OGG/Opus voice-note audio. Primary: Gemini TTS (natural voice,
 * model gemini-3.1-flash-tts-preview, voice "Kore"). Fallback: espeak-ng
 * (local, robotic but always available) -- mirrors wa-voice-bot-template.
 */
export async function textToSpeech(text: string): Promise<SpeechResult | null> {
  const clean = sanitizeForSpeech(text);
  if (!clean) return null;

  if (config.aiEnabled) {
    try {
      const result = await geminiTts(clean);
      if (result) return result;
    } catch {
      // fall through to espeak-ng
    }
  }

  return espeakToOgg(clean);
}

async function geminiTts(text: string): Promise<SpeechResult | null> {
  const raw = await geminiTtsRaw(text);
  if (!raw) return null;
  const pcm = Buffer.from(raw.pcmBase64, "base64");
  return pcmToOgg(pcm, raw.sampleRate);
}

async function espeakToOgg(text: string): Promise<SpeechResult | null> {
  const wavPath = path.join(tmpdir(), `espeak-${Date.now()}.wav`);
  const oggPath = path.join(tmpdir(), `espeak-${Date.now()}.ogg`);
  try {
    await new Promise<void>((resolve, reject) => {
      execFile(
        config.espeakBin,
        ["-v", "id", "-w", wavPath, "-s", "180", "--", text],
        { timeout: 10_000 },
        (error) => (error ? reject(error) : resolve()),
      );
    });
    await wavToOgg(wavPath, oggPath);
    const ogg = readFileSync(oggPath);
    if (ogg.length < 100) return null;
    return { data: ogg.toString("base64"), mimeType: "audio/ogg; codecs=opus" };
  } catch {
    try {
      const wav = readFileSync(wavPath);
      if (wav.length > 100) return { data: wav.toString("base64"), mimeType: "audio/wav" };
    } catch {
      // no audio produced at all
    }
    return null;
  } finally {
    for (const p of [wavPath, oggPath]) {
      try {
        unlinkSync(p);
      } catch {
        // best-effort cleanup
      }
    }
  }
}

async function pcmToOgg(pcm: Buffer, sampleRate: number): Promise<SpeechResult> {
  const wav = buildWav(pcm, sampleRate);
  const wavPath = path.join(tmpdir(), `pcm-${Date.now()}.wav`);
  const oggPath = path.join(tmpdir(), `pcm-${Date.now()}.ogg`);
  try {
    writeFileSync(wavPath, wav);
    await wavToOgg(wavPath, oggPath);
    return { data: readFileSync(oggPath).toString("base64"), mimeType: "audio/ogg; codecs=opus" };
  } finally {
    for (const p of [wavPath, oggPath]) {
      try {
        unlinkSync(p);
      } catch {
        // best-effort cleanup
      }
    }
  }
}

function wavToOgg(wavPath: string, oggPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(
      ffmpegPath as string,
      ["-y", "-i", wavPath, "-c:a", "libopus", "-b:a", "16k", "-application", "voip", "-frame_duration", "20", oggPath],
      { timeout: 15_000 },
      (error) => (error ? reject(error) : resolve()),
    );
  });
}

/** Wraps raw 16-bit PCM samples in a minimal WAV container. */
function buildWav(pcm: Buffer, sampleRate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}
