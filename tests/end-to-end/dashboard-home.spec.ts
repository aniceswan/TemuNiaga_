import { test, expect } from "@playwright/test";

// Requires apps/web running against the seeded database:
//   pnpm --filter @temuniaga/web run dev
// /dashboard and /admin are login-gated (apps/web/middleware.ts) -- requires
// the demo user from README.md's setup step 6 (admin@temuniaga.dev).
const WEB_BASE_URL = process.env.WEB_BASE_URL ?? "http://localhost:3010";
const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "admin@temuniaga.dev";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "adminpassword";

test("public koperasi directory renders real seeded data, no login required", async ({ page }) => {
  await page.goto(`${WEB_BASE_URL}/koperasi`);
  await expect(page.getByText(/KOPERASI DESA MERAH PUTIH/i).first()).toBeVisible();
});

test("unauthenticated access to /dashboard redirects to /login", async ({ page }) => {
  await page.goto(`${WEB_BASE_URL}/dashboard`);
  await expect(page).toHaveURL(/\/login/);
});

test("dashboard home renders real seeded totals after login", async ({ page }) => {
  await page.goto(`${WEB_BASE_URL}/login`);
  await page.getByPlaceholder("operator@temuniaga.dev").fill(DEMO_EMAIL);
  await page.getByPlaceholder("••••••••").fill(DEMO_PASSWORD);
  await page.getByRole("button", { name: /masuk/i }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("Koperasi Terdaftar")).toBeVisible();
  await expect(page.getByText("Anggota Aktif")).toBeVisible();
  await expect(page.getByText("Total Simpanan")).toBeVisible();

  // Known seeded magnitude (see packages/database seed output) — locale-formatted.
  await expect(page.getByText(/1[.,]026/)).toBeVisible();
  await expect(page.getByText(/KOPERASI DESA MERAH PUTIH/i).first()).toBeVisible();
});
