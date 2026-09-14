// Optional local QA: uses the isolated Chrome / Puppeteer setup used by Atlas QA.
// Does not connect to a personal browser or send any inquiry to LINE.
import puppeteer from '../.tooling/qa/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'

const origin = process.argv[2] || 'http://127.0.0.1:4173'
const edition = process.argv[3] || 'v3'
const directory = `artifacts/polish-${edition}`
await fs.mkdir(directory, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
  protocolTimeout: 30000,
  userDataDir: path.resolve('.tooling/polish-browser-qa'),
})
const results = []
const errors = []
try {
  const page = await browser.newPage()
  page.setDefaultTimeout(10000)
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await browser
    .defaultBrowserContext()
    .overridePermissions(origin, [
      'clipboard-read',
      'clipboard-write',
      'clipboard-sanitized-write',
    ])
  const settle = () =>
    page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    )
  async function align(selector) {
    await page.$eval(selector, (el) =>
      el.scrollIntoView({ block: 'start', behavior: 'instant' }),
    )
    await page.evaluate(() => document.fonts.ready)
    await settle()
    await page.$eval(selector, (el) =>
      el.scrollIntoView({ block: 'start', behavior: 'instant' }),
    )
    await settle()
  }
  async function clickVisible(selector, options) {
    // Prevent an in-progress smooth scroll from moving the target between
    // automation's geometry lookup and pointer dispatch. Still use a real click.
    await page.$eval(selector, (el) =>
      el.scrollIntoView({ block: 'center', behavior: 'instant' }),
    )
    await settle()
    await page.click(selector, options)
    await settle()
  }
  const sections = [
    '.hero',
    '.brand-spread',
    '#routes',
    '#experience',
    '#reviews',
    '#pricing',
    '#about',
    '#contact',
    '#faq',
    '.site-footer',
  ]
  for (const lang of ['zh', 'en']) {
    for (const [width, height] of [
      [320, 568],
      [375, 667],
      [390, 844],
      [430, 932],
      [768, 1024],
      [1024, 768],
      [1440, 1000],
      [1920, 1080],
    ]) {
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
      await page.evaluate(() => {
        sessionStorage.clear()
      })
      await page.reload({ waitUntil: 'networkidle0' })
      const entry = { lang, width, height, sections: [] }
      for (const selector of sections) {
        await align(selector)
        const bounds = await page.$eval(selector, (el) => {
          const r = el.getBoundingClientRect()
          return {
            height: r.height,
            overflow: document.documentElement.scrollWidth > innerWidth,
            images: [...el.querySelectorAll('img')].map((img) => ({
              alt: img.alt,
              loaded: img.complete && img.naturalWidth > 0,
            })),
          }
        })
        assert.ok(!bounds.overflow, `${lang}/${width}/${selector} overflow`)
        entry.sections.push({ selector, ...bounds })
        const node = await page.$(selector)
        await node.screenshot({
          path: `${directory}/${lang}-${width}-${selector.replaceAll(/[.#]/g, '')}.png`,
        })
      }
      // The successful copy action must leave the following LINE CTA in place.
      await align('.booking-summary')
      const linePosition = () =>
        page.$eval(
          '.booking-summary a.button',
          // Measure layout within the summary: desktop sticky positioning and
          // automation's scroll-to-click must not be mistaken for reflow.
          (el) =>
            el.getBoundingClientRect().top -
            el.closest('.booking-summary').getBoundingClientRect().top,
        )
      const before = await linePosition()
      await clickVisible('.booking-summary button')
      await page.waitForFunction(() =>
        document.querySelector('.copy-status').textContent.trim(),
      )
      await settle()
      entry.copyLineShift =
        Math.round(((await linePosition()) - before) * 100) / 100
      const copied = await page.evaluate(() => navigator.clipboard.readText())
      assert.ok(
        copied.includes('NT$855') && copied.includes('90'),
        `copy lost estimate / duration: ${JSON.stringify({ copied, status: await page.$eval('.copy-status', (el) => el.textContent) })}`,
      )
      if (edition !== 'baseline')
        assert.ok(Math.abs(entry.copyLineShift) <= 1, 'copy moved LINE CTA')
      if (edition !== 'baseline') {
        console.log(`${lang} ${width}: checking pricing → booking`)
        await align('#pricing')
        await clickVisible('#price-guests', { clickCount: 3 })
        await page.keyboard.type('6')
        await clickVisible('input[name="price-duration"][value="150"]')
        assert.match(
          await page.$eval('#price-duration-hint', (el) => el.textContent),
          lang === 'zh' ? /北鹿港到南鹿港/ : /north and south Lukang/,
        )
        await clickVisible('.calculator-result button')
        await page.waitForFunction(
          () => document.activeElement.id === 'booking-title',
        )
        await page.waitForFunction(() => {
          const top = document
            .querySelector('#contact')
            .getBoundingClientRect().top
          return top >= 64 && top <= 110
        })
        assert.equal(await page.$eval('#booking-guests', (el) => el.value), '6')
        assert.equal(
          await page.$eval(
            'input[name="booking-duration"]:checked',
            (el) => el.value,
          ),
          '150',
        )
        assert.match(
          await page.$eval('.summary-price', (el) => el.textContent),
          /NT\$2,850/,
        )
        assert.match(
          await page.$eval('.summary-price', (el) => el.textContent),
          /NT\$3,000/,
        )
        assert.ok(
          await page.$eval(
            '.booking-sights',
            (el) =>
              !!document.getElementById(el.getAttribute('aria-describedby'))
                ?.textContent,
          ),
        )
        await clickVisible('.sight-options label')
        assert.equal(
          await page.$eval('.guide-choice input', (el) => el.checked),
          false,
        )
        await page.type('#trip-pickup', 'QA meeting point')
        await page.type('#trip-notes', 'QA family request')
        console.log(`${lang} ${width}: checking completed inquiry copy`)
        await clickVisible('.booking-summary button')
        await page.waitForFunction(
          () =>
            document
              .querySelector('.copy-status')
              .textContent.includes('Copied') ||
            document
              .querySelector('.copy-status')
              .textContent.includes('已複製'),
        )
        const inquiry = await page.evaluate(() =>
          navigator.clipboard.readText(),
        )
        for (const text of [
          '150',
          'NT$2,850',
          'QA meeting point',
          'QA family request',
        ])
          assert.ok(inquiry.includes(text), text)
        assert.equal(
          await page.$eval('.booking-summary a.button', (el) => el.href),
          'https://line.me/R/ti/p/@lk167',
        )
        await clickVisible('.guide-choice')
        assert.equal(
          await page.$$eval(
            '.sight-options input:checked',
            (els) => els.length,
          ),
          0,
        )
        assert.equal(
          await page.$eval('.guide-choice input', (el) => el.checked),
          true,
        )
        entry.conversion =
          'shared duration/guests, estimate, preferences, guide reset, full copy and LINE URL passed'
      }
      results.push(entry)
      console.log(
        `${lang} ${width}: ${sections.length} sections; copy → LINE shift ${entry.copyLineShift}px`,
      )
    }
  }
  if (edition !== 'baseline') {
    // Permission-denied browser fallback: no external message is sent.
    await page.evaluate(() => {
      Object.defineProperty(navigator.clipboard, 'writeText', {
        configurable: true,
        value: () =>
          Promise.reject(
            new DOMException('QA permission denial', 'NotAllowedError'),
          ),
      })
    })
    await clickVisible('.booking-summary button')
    await page.waitForFunction(
      () => document.querySelector('.summary-details').open,
    )
    assert.equal(
      await page.$eval(
        '.summary-details textarea',
        (el) =>
          el === document.activeElement && el.selectionEnd === el.value.length,
      ),
      true,
    )
    assert.match(
      await page.$eval('.copy-status', (el) => el.textContent),
      /Copy was unavailable/,
    )
  }
  assert.deepEqual(errors, [], 'browser console / runtime errors')
  await fs.writeFile(
    `${directory}/results.json`,
    JSON.stringify({ results, errors }, null, 2),
  )
} finally {
  await browser.close()
}
