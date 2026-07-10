import { test, expect } from "@playwright/test";

// Requires apps/koperasi-dashboard running against the seeded database:
//   pnpm --filter @temuniaga/koperasi-dashboard run dev
const DASHBOARD_BASE_URL = process.env.DASHBOARD_BASE_URL ?? "http://localhost:3100";

test("dashboard home renders real seeded totals", async ({ page }) => {
  await page.goto(DASHBOARD_BASE_URL);

  await expect(page.getByText("Koperasi Terdaftar")).toBeVisible();
  await expect(page.getByText("Anggota Aktif")).toBeVisible();
  await expect(page.getByText("Total Simpanan")).toBeVisible();

  // Known seeded magnitude (see packages/database seed output) — locale-formatted.
  await expect(page.getByText(/1[.,]026/)).toBeVisible();
});

test("dashboard home lists real koperasi names in the table", async ({ page }) => {
  await page.goto(DASHBOARD_BASE_URL);
  await expect(page.getByText(/KOPERASI DESA MERAH PUTIH/i).first()).toBeVisible();
});
