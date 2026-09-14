import puppeteer from '../.tooling/qa/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
import fs from 'node:fs/promises'
const folder = 'artifacts/client-review'
await fs.mkdir(folder, { recursive: true })
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true })
try {
  for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage()
    await page.setViewport({ width, height, deviceScaleFactor: 1 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' })
    await page.evaluate(async () => {
      await document.fonts.ready
      const images = [...document.images]
      images.forEach(image => { image.loading = 'eager' })
      await Promise.all(images.map(image => image.decode().catch(() => {})))
    })
    for (const section of await page.$$('main section')) {
      await section.evaluate(el => el.scrollIntoView({ behavior: 'instant' }))
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: `${folder}/${label}-full.png`, fullPage: true })
    // Isolated section captures omit fixed chrome, which otherwise overlays
    // arbitrary positions when a section is taller than the viewport.
    await page.addStyleTag({ content: 'header.site-header, .skip-link, .floating-booking { visibility: hidden !important; }' })
    for (const [name, selector] of [['hero', '#top'], ['atlas', '#routes'], ['reviews', '.social-proof'], ['pricing', '#pricing'], ['people', '#about'], ['booking', '#contact'], ['footer', 'footer']]) {
      let element = await page.$(selector)
      if (!element && name === 'reviews') element = await page.$('#reviews')
      if (!element) throw new Error(`Missing ${selector}`)
      await element.screenshot({ path: `${folder}/${label}-${name}.png` })
    }
    await page.close()
    console.log(label, 'captured')
  }
} finally { await browser.close() }
