import { createServer } from "node:http";
import { StubAdapter } from "./adapter";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4001;
const adapter = new StubAdapter();

async function main(): Promise<void> {
  console.log(`TemuNiaga WhatsApp Worker — adapter: ${adapter.name}`);
  await adapter.connect();

  const server = createServer((req, res) => {
    if (req.url === "/healthz") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", service: "whatsapp-worker", adapter: adapter.name }));
      return;
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });

  server.listen(PORT, () => {
    console.log(`TemuNiaga WhatsApp Worker healthz on http://localhost:${PORT}/healthz`);
  });
}

main();
