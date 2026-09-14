// Optional local V3.1 regression suite. Isolated profile, no LINE messages.
import puppeteer from '../.tooling/qa/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
const origin = process.argv[2] || 'http://127.0.0.1:4173'
const dir = 'artifacts/v3-1'
await fs.mkdir(dir, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
  protocolTimeout: 30000,
  userDataDir: path.resolve('.tooling/preferences-browser-qa'),
})
const results = [],
  errors = []
let stage = 'setup'
const page = await browser.newPage()
page.setDefaultTimeout(10000)
page.on('pageerror', (error) => errors.push(String(error)))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
const settle = () =>
  page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  )
async function align(selector, block = 'center') {
  await page.$eval(
    selector,
    (el, block) => el.scrollIntoView({ block, behavior: 'instant' }),
    block,
  )
  await settle()
}
async function click(selector) {
  await align(selector)
  await page.click(selector)
  await settle()
}
const advisory = () =>
  page.$eval('[data-advisory]', (el) => el.dataset.advisory === 'true')
const selected = () =>
  page.$$eval('.sight-options input:checked', (els) =>
    els.map((el) => el.parentElement.textContent.trim()),
  )
const priorities = () =>
  page.$$eval('.priority-options [aria-pressed=true]', (els) =>
    els.map((el) => el.textContent.trim()),
  )
async function bookingPosition() {
  await page.waitForFunction(() => {
    const top = document.querySelector('#contact').getBoundingClientRect().top
    return top >= 64 && top <= 110
  })
  assert.equal(await page.$('.floating-booking'), null)
}
try {
  await browser
    .defaultBrowserContext()
    .overridePermissions(origin, [
      'clipboard-read',
      'clipboard-write',
      'clipboard-sanitized-write',
    ])
  for (const lang of ['zh', 'en'])
    for (const [width, height] of [
      [320, 568],
      [360, 640],
      [375, 667],
      [390, 844],
      [430, 932],
      [768, 1024],
      [1024, 900],
      [1440, 1000],
      [1920, 1080],
    ]) {
      stage = `${lang} ${width}`
      await page.setViewport({
        width,
        height,
        deviceScaleFactor: 1,
        isMobile: width < 768,
        hasTouch: width < 768,
      })
      await page.goto(`${origin}/${lang === 'en' ? 'en/' : ''}`, {
        waitUntil: 'networkidle0',
      })
      await page.evaluate(() => sessionStorage.clear())
      await page.reload({ waitUntil: 'networkidle0' })
      await page.evaluate(() => document.fonts.ready)
      for (const minutes of [60, 90, 150]) {
        await click(`#route-tab-${minutes}`)
        assert.equal(
          await page.$$eval('.atlas-route', (els) => els.length),
          [60, 90, 150].indexOf(minutes) + 1,
        )
        await align('#route-atlas', 'start')
        await page.screenshot({
          path: `${dir}/${lang}-${width}-atlas-${minutes}.png`,
        })
        await click('.atlas-plan-cta')
        await bookingPosition()
        assert.equal(
          await page.$eval(
            'input[name="booking-duration"]:checked',
            (el) => el.value,
          ),
          String(minutes),
        )
        assert.equal(
          await page.$eval(
            'input[name="price-duration"]:checked',
            (el) => el.value,
          ),
          String(minutes),
        )
      }
      await click('input[name="booking-duration"][value="60"]')
      for (let i = 1; i <= 3; i++)
        await click(`.sight-options label:nth-child(${i})`)
      assert.equal(await advisory(), false)
      for (let i = 4; i <= 5; i++)
        await click(`.sight-options label:nth-child(${i})`)
      assert.equal(await advisory(), true)
      const savedSights = await selected()
      await click('.priority-options button:nth-child(1)')
      await click('.priority-options button:nth-child(2)')
      assert.equal(
        await page.$eval('.priority-options button:nth-child(3)', (el) =>
          el.getAttribute('aria-disabled'),
        ),
        'true',
      )
      await click('.priority-options button:nth-child(3)')
      assert.equal((await priorities()).length, 2)
      // Keyboard can unmark and re-mark without hover.
      await page.focus('.priority-options button:nth-child(1)')
      await page.keyboard.press('Space')
      await settle()
      assert.equal((await priorities()).length, 1)
      await page.keyboard.press('Space')
      await settle()
      const savedPriorities = await priorities()
      await align('.booking-advisory')
      await page.screenshot({ path: `${dir}/${lang}-${width}-advisory.png` })
      const before = await page.evaluate(() => ({
        y: scrollY,
        height: document
          .querySelector('.booking-advisory')
          .getBoundingClientRect().height,
      }))
      await page.click('.advisory-upgrade')
      await settle()
      const after = await page.evaluate(() => ({
        y: scrollY,
        height: document
          .querySelector('.booking-advisory')
          .getBoundingClientRect().height,
      }))
      assert.ok(
        Math.abs(before.y - after.y) <= 1,
        `${stage}: upgrade scrolled ${after.y - before.y}`,
      )
      assert.ok(
        Math.abs(before.height - after.height) <= 1,
        `${stage}: advisory height changed ${JSON.stringify({ before, after })}`,
      )
      assert.equal(
        await page.$eval(
          'input[name="booking-duration"]:checked',
          (el) => el.value,
        ),
        '90',
      )
      assert.equal(await advisory(), false)
      assert.deepEqual(await selected(), savedSights)
      assert.deepEqual(await priorities(), savedPriorities)
      assert.match(
        await page.$eval('.summary-price', (el) => el.textContent),
        /NT\$855/,
      )
      await page.type('#trip-notes', 'QA preference request')
      await click('.booking-summary button')
      await page.waitForFunction(() =>
        /Copied|已複製/.test(
          document.querySelector('.copy-status').textContent,
        ),
      )
      const summary = await page.evaluate(() => navigator.clipboard.readText())
      assert.match(
        summary,
        lang === 'zh'
          ? /最想去（偏好，非保證停靠）：鹿港天后宮、鹿港老街/
          : /Must-see \(preferences, not guaranteed stops\): Lukang Tianhou Temple, Lukang Old Street/,
      )
      assert.ok(
        summary.includes('QA preference request') && summary.includes('NT$855'),
      )
      assert.equal(
        await page.$eval('.booking-summary a.button', (el) => el.href),
        'https://line.me/R/ti/p/@lk167',
      )
      await page.reload({ waitUntil: 'networkidle0' })
      assert.deepEqual(
        await priorities(),
        savedPriorities,
        'draft lost priorities',
      )
      // The mansion tier needs more time even when it is only one additional sight.
      await click('.sight-options label:nth-child(7)')
      assert.equal(await advisory(), true)
      await click('.advisory-upgrade')
      assert.equal(
        await page.$eval(
          'input[name="booking-duration"]:checked',
          (el) => el.value,
        ),
        '150',
      )
      await click('.sight-options label:nth-child(8)')
      assert.equal(await advisory(), true)
      assert.equal(
        await page.$eval('.advisory-upgrade', (el) =>
          el.getAttribute('aria-disabled'),
        ),
        'true',
      )
      assert.equal(
        await page.$eval('.booking-summary button', (el) => el.disabled),
        false,
      )
      await click('.guide-choice')
      assert.equal((await selected()).length, 0)
      assert.equal((await priorities()).length, 0)
      assert.equal(await advisory(), false)
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      )
      results.push({
        lang,
        width,
        atlasBooking: true,
        recommendations: true,
        priorityLimit: true,
        keyboard: true,
        clipboard: true,
        draft: true,
        overflow: false,
        upgradeScrollDelta: after.y - before.y,
      })
      console.log(`${stage}: passed`)
    }
  assert.deepEqual(errors, [])
  await fs.writeFile(
    `${dir}/results.json`,
    JSON.stringify({ results, errors }, null, 2),
  )
} catch (error) {
  console.error(stage)
  await page.screenshot({ path: `${dir}/failure.png` })
  throw error
} finally {
  await browser.close()
}
