import test from 'node:test'
import assert from 'node:assert/strict'
import { getTourPlans } from '../src/data/tours.js'
import { EXPERIENCE_COPY } from '../src/data/experienceCopy.js'
import fs from 'node:fs'
test('duration decision labels are descriptive, not unverified popularity claims',()=>{
  for(const lang of ['zh','en']) {
    const plans=getTourPlans(lang)
    assert.equal(new Set(plans.map(p=>p.durationLabel)).size,3)
    assert.ok(plans.every(p=>!/熱門|popular/i.test(p.durationLabel)))
  }
})
test('booking estimate copy identifies a total and retains guide confirmation',()=>{
  assert.match(EXPERIENCE_COPY.zh.booking.estimate,/總/)
  assert.match(EXPERIENCE_COPY.en.booking.estimate,/total/)
  assert.match(EXPERIENCE_COPY.zh.booking.priceNote,/行程.*費用.*確認/)
  assert.match(EXPERIENCE_COPY.en.booking.priceNote,/guide.*confirm/i)
})
test('both prerendered languages retain price and no sight selection',()=>{
  for(const file of ['dist/index.html','dist/en/index.html']) {
    const html=fs.readFileSync(file,'utf8')
    assert.ok(html.includes('price-mobile') && html.includes('price-desktop'))
    assert.ok(!html.includes('class="booking-sights"'))
    assert.ok(html.includes('duration-choice-label'))
  }
})
