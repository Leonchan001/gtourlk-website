import p from '../.tooling/qa/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const phase=process.argv[2] || 'after'
const dir=`artifacts/final-polish-${phase}`
await fs.mkdir(dir,{recursive:true})
const browser=await p.launch({executablePath:process.env.CHROME_PATH,headless:true})
const results=[]
try {
  for(const lang of ['zh','en']) for(const width of [320,375,390,430,768,1024,1440,1920]) {
    const page=await browser.newPage()
    const errors=[]
    page.on('pageerror', e=>errors.push(e.message))
    page.on('console',m=>{if(m.type()==='error') errors.push(m.text())})
    await page.setViewport({width,height:width<768?844:1000})
    await page.goto(`http://127.0.0.1:4173/${lang==='en'?'en/':''}`,{waitUntil:'networkidle0'})
    await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(im=>{im.loading='eager'; return im.decode().catch(()=>{})}))})
    const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,reviews:document.querySelector('#reviews').offsetHeight,booking:document.querySelector('#contact').offsetHeight}))
    assert.equal(metrics.overflow,false,`${lang} ${width} overflow`)
    await page.screenshot({path:`${dir}/${lang}-${width}-full.png`,fullPage:true})
    for(const name of ['reviews','contact','about','pricing']) {
      await page.$eval(`#${name}`,el=>el.scrollIntoView({behavior:'instant',block:'start'}))
      await page.screenshot({path:`${dir}/${lang}-${width}-${name}.png`})
    }
    if(phase==='after') {
      await page.$eval('input[name="booking-duration"][value="150"]',el=>el.click())
      assert.equal(await page.$eval('#route-tab-150',el=>el.getAttribute('aria-selected')),'true')
      await page.$eval('#booking-guests',el=>{el.scrollIntoView({behavior:'instant',block:'center'})})
      await page.click('#booking-guests',{clickCount:3}); await page.keyboard.type('6')
      const visible=await page.$$eval('.summary-price',els=>els.filter(el=>el.getBoundingClientRect().height>0).map(el=>el.textContent))
      assert.equal(visible.length,1)
      assert.ok(visible[0].includes('2,850'))
      assert.ok(!await page.$('.floating-booking'))
      await page.evaluate(()=>{window.__summary=''; Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__summary=text}}})})
      await page.$eval('.booking-summary button',el=>el.click())
      await page.waitForFunction(()=>document.querySelector('.booking-summary a.button'))
      assert.ok((await page.evaluate(()=>window.__summary)).includes('2,850'))
      assert.ok((await page.$eval('.booking-summary a.button',el=>el.href)).includes('line.me/'))
      await page.$eval('input[name="booking-duration"][value="60"]',el=>el.click())
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('test denied')}}}))
      await page.$eval('.booking-summary button',el=>el.click())
      await page.waitForFunction(()=>document.querySelector('.summary-details').open)
      await page.waitForFunction(()=>document.activeElement === document.querySelector('.summary-details textarea'))
      await page.focus('input[name="booking-duration"][value="60"]');await page.keyboard.press('ArrowRight')
      assert.equal(await page.$eval('input[name="booking-duration"]:checked',el=>el.value),'90')
      assert.ok(!await page.$('#price-guests'))
    }
    assert.deepEqual(errors,[])
    results.push({lang,width,...metrics});console.log(lang,width,'passed')
    await page.close()
  }
} finally {await browser.close(); await fs.writeFile(`${dir}/results.json`,JSON.stringify(results,null,2))}
