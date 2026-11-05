/*
 * Desktop baseline: full-page screenshots of every route at 1440×900 and
 * 1920×1080, signed out and as each persona, into _qa/desktop-baseline/.
 * Run before responsive work; `npm run qa:desktop-compare` then shows any
 * desktop page that changed.
 *
 *   npm run qa:desktop                    # all routes
 *   QA_ONLY=cart,checkout npm run qa:desktop
 *   QA_BASE_URL=http://localhost:5173 npm run qa:desktop   # use a running server
 */
import path from 'node:path'
import { captureDesktop } from './lib/desktop-capture.mjs'
import { root } from './lib/qa.mjs'

await captureDesktop(path.join(root, '_qa/desktop-baseline'))
