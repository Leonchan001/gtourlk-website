// Build-time HTML only. Deployment remains a static Vite site, with no server.
import fs from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
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
  let pageCss = ''
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
      if (lang === 'zh') pageCss = css
      html = html.replace(
        match[0],
        `<style data-inline-styles="${asset}">${css.replaceAll('</style', '<\\/style')}</style>`,
      )
    }
    await fs.writeFile(file, html)
    console.log(`Pre-rendered ${file}: ${Buffer.byteLength(html)} bytes`)
  }

  // Standalone sight and route pages: static HTML without client JavaScript.
  const { renderLanding } = await server.ssrLoadModule('/src/pages/Landing.jsx')
  const { listPages, homePath, absolute } = await server.ssrLoadModule('/src/data/pages.js')
  const css = pageCss + (await fs.readFile('src/landing.css', 'utf8'))
  const year = new Date(renderedAt).getFullYear()
  const pages = listPages()
  for (const page of pages) {
    const file = `dist${page.path}index.html`
    await fs.mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true })
    await fs.writeFile(file, renderLanding(page, { css, year }))
  }
  console.log(`Pre-rendered ${pages.length} sight and route pages`)

  // Sitemap: lastmod is the latest commit touching a page's source files,
  // or the build date when those files have uncommitted changes.
  const today = new Date(renderedAt).toISOString().slice(0, 10)
  const git = (...args) => {
    try {
      return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
    } catch {
      return null
    }
  }
  const lastmod = (sources) => {
    const dirty = git('status', '--porcelain', '--', ...sources)
    if (dirty === null || dirty) return today
    return git('log', '-1', '--format=%cs', '--', ...sources) || today
  }
  const homeSources = ['index.html', 'en/index.html', 'src']
  const groups = [
    { paths: { zh: homePath('zh'), en: homePath('en') }, sources: homeSources, priority: { zh: '1.0', en: '0.9' } },
  ]
  for (const page of pages.filter((p) => p.lang === 'zh')) {
    const twin = pages.find(
      (p) => p.lang === 'en' && p.type === page.type && p.id === page.id && p.minutes === page.minutes,
    )
    groups.push({
      paths: { zh: page.path, en: twin.path },
      sources: page.sources,
      priority: page.type === 'tour' ? { zh: '0.8', en: '0.7' } : { zh: '0.7', en: '0.6' },
    })
  }
  const entries = groups.flatMap(({ paths, sources, priority }) => {
    const date = lastmod(sources)
    const links = [
      ['zh-Hant', paths.zh],
      ['en', paths.en],
      ['x-default', paths.zh],
    ]
      .map(([lang, path]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${absolute(path)}" />`)
      .join('\n')
    return ['zh', 'en'].map(
      (lang) =>
        `  <url>\n    <loc>${absolute(paths[lang])}</loc>\n${links}\n    <lastmod>${date}</lastmod>\n    <priority>${priority[lang]}</priority>\n  </url>`,
    )
  })
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`
  await fs.writeFile('dist/sitemap.xml', sitemap)
  console.log(`Wrote dist/sitemap.xml with ${entries.length} URLs`)
} finally {
  await server.close()
}
