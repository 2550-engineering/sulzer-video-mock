/// <reference types="vitest/config" />
import { readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const publicImagesId = 'virtual:public-images'
const publicDir = join(import.meta.dirname, 'public')
const imagesDir = join(publicDir, 'images')

/** URL paths of every file under public/images, e.g. "/images/products/ahlstar-main.png". */
function listPublicImages(dir = imagesDir): string[] {
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return listPublicImages(path)
      if (entry.name.startsWith('.')) return []
      return [`/${relative(publicDir, path).split(sep).join('/')}`]
    })
  } catch {
    return []
  }
}

/**
 * `virtual:public-images` exports the images that exist in public/images, so
 * <SmartImage> shows its placeholder without requesting (and 404-ing on) a
 * missing file. In dev, adding or removing an image reloads the page.
 */
function publicImages(): Plugin {
  const resolvedId = `\0${publicImagesId}`
  return {
    name: 'public-images',
    resolveId: (id) => (id === publicImagesId ? resolvedId : undefined),
    load: (id) =>
      id === resolvedId
        ? `export default new Set(${JSON.stringify(listPublicImages())})`
        : undefined,
    configureServer(server) {
      server.watcher.add(imagesDir)
      const onChange = (file: string) => {
        if (!file.startsWith(imagesDir)) return
        const mod = server.moduleGraph.getModuleById(resolvedId)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), publicImages()],
  // Unit tests only; the Playwright flows in _qa/flows run with `npm run flow`.
  test: { include: ['src/**/*.test.ts'] },
})
