/*
 * The "See it live" image on the Sulzer Connect product page: the Connect app
 * on a laptop, a tablet and a phone. Screenshots the app (signed in as the end
 * user) and composites them into simple CSS device frames on a transparent
 * background. No third-party mock-up assets. Run again after changing the app:
 *
 *   npm run connect:devices   # → public/images/products/sulzer-connect-devices.png
 */
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const output = 'public/images/products/sulzer-connect-devices.png'
/** Output size, 16:10. */
const canvas = { width: 2400, height: 1500 }

/** Each device: the page it shows and its viewport in CSS pixels. */
const devices = {
  laptop: { route: '/connect/assets/rw-02', viewport: { width: 1440, height: 900 } },
  tablet: { route: '/connect/dashboard', viewport: { width: 820, height: 1180 } },
  phone: { route: '/connect/assets/rw-02', viewport: { width: 390, height: 844 } },
}

const server = await createServer({ server: { port: 5197, strictPort: true }, logLevel: 'error' })
await server.listen()
const base = 'http://localhost:5197'
const browser = await chromium.launch()

/** Screenshot of a route as a data URI, at 2× for a sharp result. */
async function capture({ route, viewport }) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  await context.addInitScript(() => localStorage.setItem('sz-demo-persona', 'endUser'))
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
  await page.goto(base + route)
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  // Let the charts finish drawing in.
  await page.waitForTimeout(1200)
  const png = await page.screenshot({ animations: 'disabled' })
  await context.close()
  if (errors.length) throw new Error(`${route}: ${errors.join('; ')}`)
  return `data:image/png;base64,${png.toString('base64')}`
}

const shots = {}
for (const [name, device] of Object.entries(devices)) shots[name] = await capture(device)

// Device frames in CSS. Sizes are in canvas pixels; each screen keeps its viewport's shape.
const html = `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${canvas.width}px; height: ${canvas.height}px; background: transparent; }
  .device { position: absolute; }
  .screen { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .glass { position: relative; overflow: hidden; background: #0c1c2e; }
  .glass::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 38%);
  }

  .laptop { left: 500px; top: 120px; width: 1600px; }
  .laptop .lid { box-shadow: 0 40px 80px -30px rgba(0,0,0,0.5); background: #111a24; border-radius: 30px 30px 0 0; padding: 24px 24px 40px; border: 2px solid #2b3644; border-bottom: 0; }
  .laptop .glass { width: 100%; aspect-ratio: 1440 / 900; border-radius: 4px; }
  .laptop .camera { position: absolute; top: 10px; left: 50%; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%; background: #2c3846; }
  .laptop .base {
    position: relative; margin: 0 -120px; height: 34px; border-radius: 0 0 28px 28px;
    background: linear-gradient(#e9edf2 0%, #c9d0d8 55%, #9aa4b0 100%);
  }
  .laptop .base::before {
    content: ''; position: absolute; top: 0; left: 50%; width: 280px; height: 12px; margin-left: -140px;
    border-radius: 0 0 14px 14px; background: linear-gradient(#b4bcc6, #cfd5dc);
  }

  .tablet {
    left: 110px; top: 390px; width: 712px; padding: 28px; border-radius: 56px;
    background: #111a24; border: 2px solid #2b3644;
    box-shadow: 0 40px 80px -30px rgba(0,0,0,0.55);
  }
  .tablet .glass { width: 100%; aspect-ratio: 820 / 1180; border-radius: 26px; }

  .phone {
    left: 1930px; top: 600px; width: 392px; padding: 15px; border-radius: 64px;
    background: #111a24; border: 2px solid #2b3644;
    box-shadow: 0 40px 70px -30px rgba(0,0,0,0.6);
  }
  .phone .glass { display: flex; flex-direction: column; width: 100%; aspect-ratio: 390 / 892; border-radius: 50px; }
  .phone .glass .screen { flex: 1; min-height: 0; }
  /* Status bar above the app, so the camera pill doesn't cover its header. */
  .status {
    display: flex; align-items: center; justify-content: space-between; height: 48px; padding: 6px 30px 0 34px;
    background: #0c1c2e; color: #fff; font: 600 15px/1 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .status .icons { display: flex; gap: 6px; align-items: center; }
  .status .icons i { display: block; background: #fff; border-radius: 2px; }
  .phone .island {
    position: absolute; z-index: 1; top: 28px; left: 50%; width: 112px; height: 32px; margin-left: -56px;
    border-radius: 999px; background: #05080c;
  }
</style>
</head>
<body>
  <div class="device laptop">
    <div class="lid" style="position: relative">
      <span class="camera"></span>
      <div class="glass"><img class="screen" src="${shots.laptop}" alt=""></div>
    </div>
    <div class="base"></div>
  </div>
  <div class="device tablet">
    <div class="glass"><img class="screen" src="${shots.tablet}" alt=""></div>
  </div>
  <div class="device phone">
    <span class="island"></span>
    <div class="glass">
      <div class="status"><span>08:42</span><span class="icons"><i style="width:17px;height:10px"></i><i style="width:24px;height:11px;border-radius:3px"></i></span></div>
      <img class="screen" src="${shots.phone}" alt="">
    </div>
  </div>
</body>
</html>`

const context = await browser.newContext({ viewport: canvas, deviceScaleFactor: 1 })
const page = await context.newPage()
await page.setContent(html, { waitUntil: 'load' })
await mkdir(dirname(output), { recursive: true })
await page.screenshot({ path: output, omitBackground: true })

await browser.close()
await server.close()
console.log(`${output}: ${Object.keys(devices).join(', ')} (${canvas.width} × ${canvas.height})`)
