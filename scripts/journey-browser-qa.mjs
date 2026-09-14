// Local-only product-flow checks; never sends a LINE message.
import puppeteer from '../.tooling/qa/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
})
const origin = 'http://127.0.0.1:4173'
const results = [],
  errors = []
await fs.mkdir('artifacts/journey', { recursive: true })
try {
  await browser
    .defaultBrowserContext()
    .overridePermissions(origin, [
      'clipboard-read',
      'clipboard-write',
      'clipboard-sanitized-write',
    ])
  for (const lang of ['zh', 'en'])
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440, 1920]) {
      const page = await browser.newPage()
      page.on('pageerror', (e) => errors.push(String(e)))
      await page.setViewport({ width, height: 850 })
      await page.goto(origin + (lang === 'en' ? '/en/' : '/'), {
        waitUntil: 'networkidle0',
      })
      const click = async (selector) => {
        await page.$eval(selector, (el) =>
          el.scrollIntoView({ block: 'center', behavior: 'instant' }),
        )
        await page.click(selector)
        await page.evaluate(
          () =>
            new Promise((r) =>
              requestAnimationFrame(() => requestAnimationFrame(r)),
            ),
        )
      }
      await page.select('.atlas-place-picker select', '鹿港龍山寺')
      assert.equal(
        await page.$$eval('.sight-options input:checked', (els) => els.length),
        0,
      )
      await click('.atlas-save')
      assert.equal(
        await page.$eval('.atlas-save', (el) =>
          el.getAttribute('aria-pressed'),
        ),
        'true',
      )
      await click('#route-tab-150')
      assert.equal(
        await page.$$eval('.sight-options input:checked', (els) => els.length),
        1,
      )
      await click('.atlas-plan-cta')
      assert.equal(await page.$eval('.booking-options', (el) => el.open), true)
      await click('.priority-options button')
      await click('.booking-summary > button')
      await page.waitForSelector('.booking-summary > a.button')
      const clipboard = await page.evaluate(() =>
        navigator.clipboard.readText(),
      )
      assert.match(clipboard, /150/)
      assert.match(clipboard, lang === 'zh' ? /龍山寺/ : /Longshan/)
      assert.match(clipboard, lang === 'zh' ? /最想去/ : /Must-see/)
      assert.equal(
        await page.$eval(
          '.booking-summary > a.button',
          (el) => document.activeElement === el,
        ),
        true,
      )
      await page.select('.atlas-place-picker select', '鹿港龍山寺')
      await click('.atlas-save')
      await page.waitForSelector('.booking-summary > button')
      assert.equal(
        await page.$$eval(
          '.priority-options [aria-pressed=true]',
          (els) => els.length,
        ),
        0,
      )
      // Permission failure still exposes the complete selectable summary.
      await page.evaluate(() =>
        Object.defineProperty(navigator.clipboard, 'writeText', {
          configurable: true,
          value: async () => {
            throw new Error('test denial')
          },
        }),
      )
      await click('.booking-summary > button')
      await page.waitForFunction(
        () => document.querySelector('.summary-details').open,
      )
      assert.equal(
        await page.$eval(
          '.summary-details textarea',
          (el) => document.activeElement === el,
        ),
        true,
      )
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      )
      await page.$eval('#route-atlas', (el) =>
        el.scrollIntoView({ behavior: 'instant', block: 'start' }),
      )
      const height = await page.$eval(
        '#route-atlas',
        (el) => el.getBoundingClientRect().height,
      )
      await page.screenshot({ path: `artifacts/journey/${lang}-${width}.png` })
      results.push({ lang, width, atlasHeight: height })
      await page.close()
    }
  assert.deepEqual(errors, [])
  await fs.writeFile(
    'artifacts/journey/results.json',
    JSON.stringify({ results, errors }, null, 2),
  )
  console.log(JSON.stringify({ results, errors }, null, 2))
} finally {
  await browser.close()
}
