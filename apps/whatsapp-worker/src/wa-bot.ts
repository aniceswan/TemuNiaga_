import path from "node:path";
import { promises as fs } from "node:fs";
import { config } from "./config";
import { handleMessage } from "./handle-message";
import { transcribeAudio } from "./stt";
import { textToSpeech } from "./tts";

// Simple in-memory idempotency guard (resets on restart) -- Baileys can
// redeliver messages.upsert batches around reconnects.
const processedMessageIds = new Set<string>();
// IDs of messages the bot itself sent -- lets us allow self-chat (the bot's
// own number messaging itself, e.g. when operator's phone scanned the QR)
// without echo-looping on our own replies.
const ownSentMessageIds = new Set<string>();

export type ConnectionStatus = "disconnected" | "connecting" | "connected";
let currentStatus: ConnectionStatus = "disconnected";
export function getConnectionStatus(): ConnectionStatus {
  return currentStatus;
}

export async function startBot(): Promise<void> {
  const authDir = path.resolve(config.authDir);
  await fs.mkdir(authDir, { recursive: true, mode: 0o700 });

  const baileys = await import("@whiskeysockets/baileys");
  const { makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = baileys as any;
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  currentStatus = "connecting";
  let reconnectAttempt = 0;
  let selfPhone = "";
  let selfLid = "";

  const socket = makeWASocket({
    auth: state,
    browser: ["TemuNiaga", "Chrome", "1.0.0"],
    markOnlineOnConnect: false,
  });

  // Wraps socket.sendMessage so every reply's message ID is remembered --
  // needed to tell "the human typed this in a self-chat" apart from "this is
  // our own reply echoing back", since both arrive as fromMe: true.
  async function send(jid: string, content: any) {
    const sent = await socket.sendMessage(jid, content);
    const id = sent?.key?.id;
    if (id) ownSentMessageIds.add(String(id));
    return sent;
  }

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", async (update: any) => {
    if (update.qr) {
      const qrcode = await import("qrcode-terminal");
      console.log("\nScan QR ini dengan WhatsApp (Perangkat Tertaut):\n");
      (qrcode.default ?? qrcode).generate(update.qr, { small: true });
    }
    if (update.connection === "open") {
      reconnectAttempt = 0;
      currentStatus = "connected";
      selfPhone = String(socket.user?.id ?? "").split(":")[0].split("@")[0];
      selfLid = String(socket.user?.lid ?? "").split(":")[0].split("@")[0];
      console.log("[wa] connected", selfPhone ? `(nomor bot: ${selfPhone}${selfLid ? `, lid: ${selfLid}` : ""})` : "");
    }
    if (update.connection === "close") {
      currentStatus = "disconnected";
      const code = update.lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        const wait = Math.min(60_000, 2_000 * 2 ** Math.min(reconnectAttempt++, 8));
        console.log(`[wa] reconnecting in ${Math.round(wait / 1000)}s`);
        setTimeout(() => void startBot(), wait);
      } else {
        console.log("[wa] logged out -- delete WA_AUTH_DIR and restart to re-pair");
      }
    }
  });

  socket.ev.on("messages.upsert", async (batch: any) => {
    if (batch.type !== "notify" || !Array.isArray(batch.messages)) return;

    for (const msg of batch.messages) {
      if (!msg || msg.key?.fromMe || !msg.message) continue;
      const jid = String(msg.key?.remoteJid ?? "");
      let phone = "";

      if (jid.endsWith("@s.whatsapp.net")) {
        phone = jid.slice(0, -"@s.whatsapp.net".length).split(":")[0];
      } else if (jid.endsWith("@lid")) {
        const lid = jid.slice(0, -"@lid".length);
        try {
          phone = JSON.parse(await fs.readFile(path.join(authDir, `lid-mapping-${lid}_reverse.json`), "utf8"));
        } catch {
          phone = lid;
        }
      } else {
        continue;
      }
      if (!phone) continue;

      const messageId = String(msg.key?.id ?? "");
      if (!messageId || processedMessageIds.has(messageId)) continue;
      processedMessageIds.add(messageId);
      console.log(`[wa] pesan masuk dari ${phone} (jid: ${jid})`);

      try {
        const audio = msg.message.audioMessage;
        let text = "";

        if (audio) {
          const mime = String(audio.mimetype ?? "audio/ogg").split(";")[0] ?? "audio/ogg";
          if (typeof audio.fileLength === "number" && audio.fileLength > config.maxAudioBytes) {
            await send(jid, { text: "Voice note terlalu besar, kirim pesan yang lebih pendek." });
            continue;
          }
          try {
            const buffer: Buffer = await downloadMediaMessage(msg, "buffer", {});
            const transcript = await transcribeAudio(buffer.toString("base64"), mime);
            if (!transcript) {
              await send(jid, { text: "Suara tidak dapat dikenali, coba ketik pesan teks." });
              continue;
            }
            text = transcript;
          } catch (err) {
            console.error("[wa] audio processing failed:", (err as Error).message);
            await send(jid, { text: "Audio tidak dapat diproses." });
            continue;
          }
        } else {
          text = String(msg.message.conversation ?? msg.message.extendedTextMessage?.text ?? "").trim();
          if (!text) continue;
        }

        const result = await handleMessage(phone, text);
        await send(jid, {
          text: audio ? `🎤 _"${text}"_\n\n${result.reply}` : result.reply,
        });

        if (audio) {
          const speech = await textToSpeech(result.reply);
          if (speech) {
            await send(jid, {
              audio: Buffer.from(speech.data, "base64"),
              mimetype: speech.mimeType,
              ptt: speech.mimeType.includes("opus"),
            });
          }
        }
      } catch (err) {
        console.error("[wa] message handling error:", (err as Error).message);
        await send(jid, { text: "Pesan gagal diproses, silakan coba lagi." }).catch(() => undefined);
      }
    }
  });
}
