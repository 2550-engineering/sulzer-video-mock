import { defineConfig } from '@playwright/test'

/*
 * Recording rehearsals for the demo videos: `npm run flow`.
 * Each flow walks a recording path, saves a screenshot per step to
 * _qa/screenshots/flows/<flow>/ and a video to _qa/videos/.
 */
const port = 5195

export default defineConfig({
  testDir: '_qa/flows',
  outputDir: '_qa/test-results',
  // One browser at a time: the rehearsal video should not compete for CPU.
  workers: 1,
  timeout: 180_000,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${port}`,
    viewport: { width: 1920, height: 1080 },
  },
  webServer: {
    command: `npx vite --port ${port} --strictPort`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
