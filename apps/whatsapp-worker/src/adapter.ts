// plan.md §12.3: "Backend menggunakan adapter agar tidak terkunci pada Baileys."
// Prototype -> Baileys adapter. Production -> WhatsApp Cloud API adapter.
// Neither is wired up yet (Fase 3) — this stub proves the seam exists.

export interface WhatsAppAdapter {
  readonly name: string;
  connect(): Promise<void>;
}

export class StubAdapter implements WhatsAppAdapter {
  readonly name = "stub (no Baileys/Cloud API connection yet)";

  async connect(): Promise<void> {
    console.log(`[whatsapp-worker] adapter connect() called on "${this.name}" — no-op until Fase 3`);
  }
}
