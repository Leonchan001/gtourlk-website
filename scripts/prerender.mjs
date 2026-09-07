// Build-time HTML only. Deployment remains a static Vite site, with no server.
import fs from 'node:fs/promises'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

const server = await createServer({
  configFile: false,
  plugins: [react()],
  server: {
    middlewareMode: true,
    watch: { ignored: ['**/.tooling/**', '**/artifacts/**', '**/dist/**'] },
  },
  appType: 'custom',
})
try {
  const { renderPage } = await server.ssrLoadModule('/src/prerender.jsx')
  const renderedAt = Date.now()
  for (const [lang, file] of [
    ['zh', 'dist/index.html'],
    ['en', 'dist/en/index.html'],
  ]) {
    const template = await fs.readFile(file, 'utf8')
    if (!template.includes('<div id="root"></div>'))
      throw new Error(`Missing root in ${file}`)
    const markup = renderPage(lang, renderedAt)
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root" data-rendered-at="${renderedAt}">${markup}</div>`,
    )
    // This small, static editorial site ships ~11 kB gzip of CSS. Embed the
    // emitted CSS in both documents so first paint does not wait for another
    // network round trip. Fonts/images keep their existing absolute URLs and
    // caching; React hydration and metadata are unchanged.
    for (const match of template.matchAll(
      /<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
    )) {
      const asset = match[1].split('/').at(-1)
      if (!/^[-\w]+\.css$/.test(asset))
        throw new Error(`Unexpected stylesheet: ${match[1]}`)
      const css = await fs.readFile(`dist/assets/${asset}`, 'utf8')
      html = html.replace(
        match[0],
        `<style data-inline-styles="${asset}">${css.replaceAll('</style', '<\\/style')}</style>`,
      )
    }
    await fs.writeFile(file, html)
    console.log(`Pre-rendered ${file}: ${Buffer.byteLength(html)} bytes`)
  }
} finally {
  await server.close()
}
