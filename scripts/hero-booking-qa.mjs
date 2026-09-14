import puppeteer from '../.tooling/qa/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
import assert from 'node:assert/strict'
const browser = await puppeteer.launch({executablePath: process.env.CHROME_PATH, headless:true})
try {
  for (const lang of ['', 'en/']) for (const width of [375, 1024, 1440, 1920]) {
    const page = await browser.newPage()
    const errors=[]
    page.on('pageerror', e=>errors.push(e.message))
    await page.setViewport({width,height:900,deviceScaleFactor:1})
    await page.goto('http://127.0.0.1:4173/'+lang,{waitUntil:'networkidle0'})
    const src=await page.$eval('.hero img', el=>el.currentSrc)
    assert.ok(src.includes(width>=1024?'hero-portrait':'hero-main'),src)
    assert.equal(await page.$$eval('#pricing input',els=>els.length),0)
    await page.$eval('#pricing .button',el=>el.click())
    assert.equal(await page.evaluate(()=>document.activeElement.id),'booking-title')
    await page.$eval('#booking-guests',el=>el.scrollIntoView({block:'center',behavior:'instant'}))
    await page.click('#booking-guests',{clickCount:3})
    await page.keyboard.type('3')
    await page.$eval('input[name="booking-duration"][value="90"]',el=>el.click())
    const summary=await page.$eval('.booking-summary',el=>el.textContent)
    assert.ok(summary.includes('90 min'))
    assert.ok(summary.includes('855'),summary)
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}))
    await page.screenshot({path:`artifacts/hero-booking-${lang?'en':'zh'}-${width}.png`})
    assert.deepEqual(errors,[])
    console.log(lang||'zh',width,'passed',src)
    await page.close()
  }
} finally { await browser.close() }
