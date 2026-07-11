import { execFile } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import { config } from "./config";
import { geminiTranscribe } from "./gemini";

// openai-whisper's load_audio() shells out to a hardcoded "ffmpeg" command.
// No system ffmpeg is installed in this environment, so we point whisper's
// child process PATH at the directory containing the bundled ffmpeg-static
// binary (which is literally named "ffmpeg") instead.
const whisperEnv = {
  ...process.env,
  PATH: `${path.dirname(ffmpegPath as unknown as string)}:${process.env.PATH ?? ""}`,
};

function stripControlChars(text: string): string {
  let result = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    result += code <= 0x1f || code === 0x7f ? " " : ch;
  }
  return result;
}

/**
 * Audio buffer -> text via the local `whisper` CLI (openai-whisper, model
 * tiny, Indonesian). Falls back to Gemini multimodal transcription if the
 * CLI is unavailable or fails -- mirrors the proven wa-voice-bot-template.
 */
export async function transcribeAudio(audioBase64: string, mimeType: string): Promise<string | null> {
  const ext = mimeType.split("/")[1]?.split(";")[0] || "ogg";
  const tmpDir = mkdtempSync(path.join(tmpdir(), "stt-"));
  const audioPath = path.join(tmpDir, `audio.${ext}`);

  try {
    writeFileSync(audioPath, Buffer.from(audioBase64, "base64"));

    await new Promise<void>((resolve, reject) => {
      execFile(
        config.whisperBin,
        [audioPath, "--language", "id", "--model", "tiny", "--output_format", "json", "--output_dir", tmpDir, "--fp16", "False"],
        { timeout: 60_000, env: whisperEnv },
        (error) => (error ? reject(error) : resolve()),
      );
    });

    const json = JSON.parse(readFileSync(path.join(tmpDir, "audio.json"), "utf8")) as { text?: string };
    const text = (json.text ?? "").trim();
    if (text) return stripControlChars(text).slice(0, 1000);
    return null;
  } catch {
    return geminiTranscribe(audioBase64, mimeType);
  } finally {
    try {
      for (const f of readdirSync(tmpDir)) unlinkSync(path.join(tmpDir, f));
      rmdirSync(tmpDir);
    } catch {
      // best-effort cleanup
    }
  }
}
