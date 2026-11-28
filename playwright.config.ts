import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4273";

export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: Boolean(process.env.CI),
  use: {
    baseURL,
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm start --hostname 127.0.0.1 --port 4273",
    url: baseURL,
    reuseExistingServer: false,
  },
});
