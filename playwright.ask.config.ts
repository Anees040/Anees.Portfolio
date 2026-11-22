import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/ask-anees",
  workers: 1,
  timeout: 30_000,
  reporter: "list",
  use: { ...devices["Desktop Chrome"], channel: "chrome", baseURL: "http://127.0.0.1:3100", screenshot: "off", video: "off", trace: "off" },
  webServer: { command: "npm run start -- --hostname 127.0.0.1 --port 3100", url: "http://127.0.0.1:3100", reuseExistingServer: true },
});
