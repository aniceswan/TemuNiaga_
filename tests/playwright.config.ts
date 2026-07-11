import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./end-to-end",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: process.env.WEB_BASE_URL ?? "http://localhost:3010",
  },
});
