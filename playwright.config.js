import { defineConfig, devices } from '@playwright/test';

// Standard: testerna körs mot din React-app på port 5173.
// BASE_URL=http://localhost:5174 kör samma tester mot Vue-referensen.
const baseURL = process.env.BASE_URL ?? 'http://localhost:5173';
const useVue = baseURL === 'http://localhost:5174';

export default defineConfig({
  testDir: './e2e',
  // Alla tester delar samma mock-API, därför körs de ett i taget.
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Startar API och app om de inte redan är igång.
  webServer: [
    {
      command: 'npm run api',
      url: 'http://localhost:4000/books',
      reuseExistingServer: true,
    },
    {
      command: useVue ? 'npm run dev:vue' : 'npm run dev',
      url: baseURL,
      reuseExistingServer: true,
    },
  ],
});
