import { test } from "node:test";
import assert from "node:assert/strict";

// Requires apps/api running against the seeded database:
//   pnpm --filter @temuniaga/api run dev
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001";

test("GET /koperasi returns the real seeded koperasi count", async () => {
  const res = await fetch(`${API_BASE_URL}/koperasi?pageSize=1`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as { total: number; items: unknown[] };
  assert.ok(body.total > 1000, `expected total > 1000, got ${body.total}`);
  assert.equal(body.items.length, 1);
});

test("GET /koperasi/dashboard-totals matches known seeded magnitudes", async () => {
  const res = await fetch(`${API_BASE_URL}/koperasi/dashboard-totals`);
  assert.equal(res.status, 200);

  const body = (await res.json()) as { totalKoperasi: number; totalAnggota: number; totalSimpanan: string };
  assert.ok(body.totalKoperasi > 1000);
  assert.ok(body.totalAnggota > 70000);
  assert.ok(Number(body.totalSimpanan) > 0);
});

test("GET /healthz reports a connected database", async () => {
  const res = await fetch(`${API_BASE_URL}/healthz`);
  assert.equal(res.status, 200);
  const body = (await res.json()) as { status: string; db: string };
  assert.equal(body.status, "ok");
  assert.equal(body.db, "connected");
});
