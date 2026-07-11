import "dotenv/config";
import { createServer } from "node:http";
import { config } from "./config";
import { startBot, getConnectionStatus } from "./wa-bot";

async function main(): Promise<void> {
  const server = createServer((req, res) => {
    if (req.url === "/healthz") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          service: "whatsapp-worker",
          waConnection: getConnectionStatus(),
          aiEnabled: config.aiEnabled,
        }),
      );
      return;
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });

  server.listen(config.port, () => {
    console.log(`TemuNiaga WhatsApp Worker healthz on http://localhost:${config.port}/healthz`);
  });

  if (process.env.WA_ENABLED === "true") {
    console.log("TemuNiaga WhatsApp Worker starting Baileys connection...");
    await startBot();
  } else {
    console.log("WA_ENABLED is not 'true' -- skipping Baileys connection (healthz still serves).");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
