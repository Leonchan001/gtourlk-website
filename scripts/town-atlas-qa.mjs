import p from '../.tooling/qa/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
import assert from 'node:assert/strict'
import { atlasStops, ATLAS_STOPS } from '../src/data/atlas.js'
import { TOWN_VIEW } from '../src/data/townAtlas.js'
const b = await p.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
})
const errors = []
try {
  for (const lang of ['zh', 'en'])
    for (const width of [320, 360, 375, 390, 430, 640, 768, 1024, 1440, 1920]) {
      const page = await b.newPage()
      page.on('pageerror', (e) => errors.push(String(e)))
      await page.setViewport({ width, height: 900 })
      await page.goto('http://127.0.0.1:4173/' + (lang === 'en' ? 'en/' : ''), {
        waitUntil: 'networkidle0',
      })
      for (const minutes of [60, 90, 150]) {
        await page.evaluate(
          (m) => document.querySelector('#route-tab-' + m).click(),
          minutes,
        )
        await page.select('.atlas-place-picker select', '鹿港龍山寺')
        await page.waitForFunction(
          () =>
            document
              .querySelectorAll('.atlas-map-stop')[6]
              .getAttribute('aria-pressed') === 'true',
        )
        await page.evaluate(() =>
          document.querySelectorAll('.atlas-map-stop')[0].click(),
        )
        await page.waitForFunction(
          () =>
            document.querySelector('.atlas-place-picker select').value ===
            '鹿港天后宮',
        )
      }
      const map = await page.$eval('.atlas-canvas', (el) => {
        const r = el.getBoundingClientRect()
        return { x: r.x, y: r.y, w: r.width, h: r.height }
      })
      const view = width < 768 ? 'mobile' : 'desktop'
      assert.ok(
        Math.abs(map.w / map.h - TOWN_VIEW[view][0] / TOWN_VIEW[view][1]) <
          0.001,
      )
      const visibleSvg = '.atlas-geometry-' + view
      assert.equal(
        await page.$$eval(visibleSvg + ' .atlas-building', (els) => els.length),
        4,
      )
      assert.equal(
        await page.$$eval(
          visibleSvg + ' .atlas-route, ' + visibleSvg + ' marker',
          (els) => els.length,
        ),
        0,
      )
      for (const minutes of [60, 90, 150]) {
        await page.evaluate(
          (m) => document.querySelector('#route-tab-' + m).click(),
          minutes,
        )
        const marked = await page.$$eval(
          visibleSvg + ' .atlas-anchor.is-included',
          (els) => els.map((e) => e.dataset.sightId).sort(),
        )
        assert.deepEqual(
          marked,
          atlasStops(minutes)
            .filter((s) => s.coordinates)
            .map((s) => s.id)
            .sort(),
        )
      }
      for (const stop of ATLAS_STOPS.filter((s) => s.coordinates)) {
        await page.select('.atlas-place-picker select', stop.id)
        const i = ATLAS_STOPS.filter((s) => s.coordinates).findIndex(
          (s) => s.id === stop.id,
        )
        await page.select(
          '.atlas-place-picker select',
          ATLAS_STOPS.filter((s) => s.coordinates)[(i + 1) % 7].id,
        )
        await page.$eval('.atlas-canvas', (el) =>
          el.scrollIntoView({ behavior: 'instant', block: 'center' }),
        )
        const buttons = await page.$$('.atlas-map-stop')
        await buttons[i].click()
        assert.equal(
          await page.$eval('.atlas-place-picker select', (el) => el.value),
          stop.id,
        )
      }
      const boxes = await page.evaluate(() =>
        [...document.querySelectorAll('.atlas-map-stop')].map((el) => {
          const r = el.getBoundingClientRect()
          return { x: r.x, y: r.y, w: r.width, h: r.height }
        }),
      )
      for (const a of boxes) {
        assert.ok(a.h >= 44 && a.w >= 44)
        // Coordinates may have scrolled since initial map measurement: test containment separately below.
        for (const c of boxes)
          if (a !== c)
            assert.ok(
              !(
                a.x < c.x + c.w &&
                a.x + a.w > c.x &&
                a.y < c.y + c.h &&
                a.y + a.h > c.y
              ),
              'overlapping labels ' + lang + width,
            )
      }
      assert.ok(
        await page.evaluate(() => {
          const m = document
            .querySelector('.atlas-canvas')
            .getBoundingClientRect()
          return [...document.querySelectorAll('.atlas-map-stop')].every(
            (el) => {
              const r = el.getBoundingClientRect()
              return (
                r.left >= m.left - 1 &&
                r.right <= m.right + 1 &&
                r.top >= m.top - 1 &&
                r.bottom <= m.bottom + 1
              )
            },
          )
        }),
        'clipped target ' + lang + width,
      )
      await page.focus('#route-tab-150')
      await page.keyboard.press('ArrowLeft')
      await page.waitForFunction(
        () =>
          document
            .querySelector('#route-tab-90')
            .getAttribute('aria-selected') === 'true',
      )
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      )
      await page.evaluate(() =>
        document
          .querySelector('#route-atlas')
          .scrollIntoView({ behavior: 'instant', block: 'start' }),
      )
      await page.screenshot({
        path: 'artifacts/atlas-refined-' + lang + '-' + width + '.png',
      })
      console.log(lang, width, 'passed')
      await page.close()
    }
  assert.deepEqual(errors, [])
} finally {
  await b.close()
}
