// Optional isolated-browser QA, using the Puppeteer already bundled with the
// local Lighthouse tooling. Not a product dependency; never connects to a user profile.
import puppeteer from '../.tooling/qa/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
const origin = process.argv[2] || 'http://127.0.0.1:4173'
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
  userDataDir: path.resolve('.tooling/atlas-browser-qa'),
})
const results = []
const errors = []
await fs.mkdir('artifacts', { recursive: true })
try {
  const page = await browser.newPage()
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  const settle = () =>
    page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    )
  async function align(selector) {
    await page.$eval(selector, (el) => {
      el.scrollIntoView({ block: 'start', behavior: 'instant' })
      void el.offsetHeight
    })
    await page.evaluate(() => document.fonts.ready)
    await settle()
    await page.$eval(selector, (el) =>
      el.scrollIntoView({ block: 'start', behavior: 'instant' }),
    )
    await settle()
  }
  async function tap(selector) {
    const rect = await page.$eval(selector, (el) => {
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    })
    assert.ok(
      rect.width >= 44 && rect.height >= 44,
      `${selector}: small target`,
    )
    await page.touchscreen.tap(
      rect.x + rect.width / 2,
      rect.y + rect.height / 2,
    )
    await settle()
  }
  for (const lang of ['zh', 'en'])
    for (const [width, height] of [
      [320, 568],
      [375, 667],
      [390, 844],
      [430, 932],
    ]) {
      await page.setViewport({
        width,
        height,
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
      })
      await page.goto(`${origin}/${lang === 'en' ? 'en/' : ''}`, {
        waitUntil: 'networkidle0',
      })
      await align('#route-atlas')
      const baseline = await page.$eval('#route-atlas', (el) => ({
        y: scrollY,
        height: el.getBoundingClientRect().height,
        top: el.getBoundingClientRect().top,
        bottom: el.getBoundingClientRect().bottom,
      }))
      assert.ok(
        baseline.top >= 68 && baseline.bottom <= height + 1,
        `${lang} ${width}: module not in viewport ${JSON.stringify(baseline)}`,
      )
      const nodes = await page.$$eval('.atlas-map-stop', (els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect()
          return {
            name: el.getAttribute('aria-label'),
            x: r.x,
            y: r.y,
            right: r.right,
            bottom: r.bottom,
          }
        }),
      )
      for (let a = 0; a < nodes.length; a++)
        for (let b = a + 1; b < nodes.length; b++) {
          const r = nodes[a],
            s = nodes[b]
          assert.ok(
            r.right <= s.x ||
              s.right <= r.x ||
              r.bottom <= s.y ||
              s.bottom <= r.y,
            `${lang} ${width}: overlapping ${r.name}/${s.name}`,
          )
        }
      const paths = []
      for (const minutes of [60, 90, 150]) {
        await tap(`#route-tab-${minutes}`)
        paths.push(
          await page.$eval('.atlas-route', (el) => el.getAttribute('d')),
        )
        for (let i = 1; i <= 7; i++) {
          await tap(`.atlas-map-stop:nth-of-type(${i})`)
          const state = await page.evaluate(() => {
            const chip = document.querySelector(
                '.atlas-stop-strip [aria-pressed=true]',
              ),
              map = document.querySelector(
                '.atlas-map-stop[aria-pressed=true]',
              ),
              strip = document.querySelector('.atlas-stop-strip')
            const c = chip.getBoundingClientRect(),
              s = strip.getBoundingClientRect()
            return {
              y: scrollY,
              height: document
                .querySelector('#route-atlas')
                .getBoundingClientRect().height,
              chip: chip.textContent,
              map: map.textContent,
              visible: c.left >= s.left - 1 && c.right <= s.right + 1,
              overflow: document.documentElement.scrollWidth > innerWidth,
              floating: !!document.querySelector('.floating-booking'),
            }
          })
          assert.equal(
            state.chip.replaceAll(/\s/g, ''),
            state.map.replaceAll(/\s/g, ''),
            'map/chip mismatch',
          )
          assert.ok(state.visible, 'selected chip not horizontally revealed')
          assert.ok(
            Math.abs(state.y - baseline.y) <= 1,
            `${lang} ${width}: vertical jump ${state.y - baseline.y}`,
          )
          assert.ok(
            Math.abs(state.height - baseline.height) <= 1,
            `${lang} ${width}: layout shift ${state.height - baseline.height}`,
          )
          assert.ok(!state.overflow && !state.floating)
        }
        // A visible non-selected chip changes the map without a page scroll.
        const chipIndex = await page.$$eval(
          '.atlas-stop-strip button',
          (els) => {
            const s = els[0].parentElement.getBoundingClientRect()
            return (
              els.findIndex((el) => {
                const r = el.getBoundingClientRect()
                return (
                  el.getAttribute('aria-pressed') !== 'true' &&
                  r.left >= s.left &&
                  r.right <= s.right
                )
              }) + 1
            )
          },
        )
        await tap(`.atlas-stop-strip button:nth-child(${chipIndex})`)
        const sync = await page.evaluate(() => ({
          a: document.querySelector('.atlas-stop-strip [aria-pressed=true]')
            .textContent,
          b: document.querySelector('.atlas-map-stop[aria-pressed=true]')
            ?.textContent,
          y: scrollY,
        }))
        assert.equal(sync.a.replaceAll(/\s/g, ''), sync.b.replaceAll(/\s/g, ''))
        assert.ok(Math.abs(sync.y - baseline.y) <= 1)
      }
      assert.equal(new Set(paths).size, 3)
      // The regional entry is deliberately not a fabricated map node.
      await page.$eval('.atlas-stop-strip', (el) =>
        el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }),
      )
      await tap('.atlas-stop-strip button:last-child')
      assert.equal(await page.$('.atlas-map-stop[aria-pressed=true]'), null)
      assert.ok(await page.$('.atlas-area-selected'))
      assert.ok(
        await page.$eval(
          '#route-atlas',
          (el, expected) =>
            Math.abs(el.getBoundingClientRect().height - expected) <= 1,
          baseline.height,
        ),
      )
      assert.ok(
        await page.evaluate(
          (expected) => Math.abs(scrollY - expected) <= 1,
          baseline.y,
        ),
      )
      await tap('.atlas-map-stop:nth-of-type(7)')
      await page.screenshot({ path: `artifacts/atlas-${lang}-${width}.png` })
      await align('#reviews')
      const mobileCTA = await page.$eval('.floating-booking', (el) => {
        const r = el.getBoundingClientRect()
        return { width: r.width, height: r.height, bottom: r.bottom }
      })
      assert.ok(
        mobileCTA.width >= width - 48 &&
          mobileCTA.height >= 48 &&
          mobileCTA.bottom <= height,
      )
      await page.screenshot({ path: `artifacts/cta-${lang}-${width}.png` })
      await tap('.floating-booking')
      await page.waitForFunction(
        () => !document.querySelector('.floating-booking'),
      )
      await align('#contact')
      assert.equal(
        await page.$('.floating-booking'),
        null,
        'duplicate booking CTA',
      )
      await page.emulateMediaFeatures([
        { name: 'prefers-reduced-motion', value: 'reduce' },
      ])
      assert.equal(
        await page.$eval(
          '.atlas-route',
          (el) => getComputedStyle(el).animationName,
        ),
        'none',
      )
      await page.emulateMediaFeatures([])
      results.push({
        lang,
        width,
        height,
        moduleHeight: baseline.height,
        allSightsAndDurations: true,
        twoWaySync: true,
        verticalJumpTolerancePx: 1,
        heightShiftTolerancePx: 1,
        touchTargets: '44px+',
        bookingCTAHidden: true,
        reducedMotion: true,
      })
    }
  for (const width of [768, 1024, 1440, 1920]) {
    await page.setViewport({
      width,
      height: 1080,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
    })
    await page.goto(origin, { waitUntil: 'networkidle0' })
    await align('#routes')
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    )
    await page.focus('#route-tab-90')
    await page.keyboard.press('ArrowRight')
    assert.equal(
      await page.$eval('#route-tab-150', (el) =>
        el.getAttribute('aria-selected'),
      ),
      'true',
    )
    await page.keyboard.press('Home')
    assert.equal(
      await page.$eval('#route-tab-60', (el) =>
        el.getAttribute('aria-selected'),
      ),
      'true',
    )
    await page.screenshot({ path: `artifacts/atlas-desktop-${width}.png` })
    await align('#reviews')
    const cta = await page.$eval('.floating-booking', (el) => {
      const r = el.getBoundingClientRect()
      return { width: r.width, height: r.height }
    })
    assert.ok(cta.height >= 44 && cta.width < 220)
    await align('#contact')
    assert.equal(await page.$('.floating-booking'), null)
    results.push({ width, overflow: false, keyboard: true, cta })
  }
  assert.deepEqual(errors, [])
  await fs.writeFile(
    'artifacts/atlas-browser-qa.json',
    JSON.stringify({ results, errors }, null, 2),
  )
  console.log(JSON.stringify({ results, errors }, null, 2))
} finally {
  await browser.close()
}
