import test from 'node:test'
import assert from 'node:assert/strict'
import {
  estimateTour,
  bookingSummary,
  INITIAL_TRIP,
  getSights,
} from '../src/data/booking.js'

test('existing hourly rules and LINE discount at each duration', () => {
  for (const [minutes, multiplier] of [
    [60, 1],
    [90, 1.5],
    [150, 2.5],
  ]) {
    for (const people of [1, 2, 3, 5, 6, 11, 50]) {
      const total = (people <= 2 ? 600 : 200 * people) * multiplier
      assert.deepEqual(estimateTour(people, minutes), {
        total,
        linePrice: Math.round(total * 0.95),
        vehicles: Math.ceil(people / 5),
      })
    }
  }
})
test('six people are priced by total people, not two minimum vehicle charges', () => {
  assert.deepEqual(estimateTour(6, 60), {
    total: 1200,
    linePrice: 1140,
    vehicles: 2,
  })
})
test('invalid guest and duration inputs do not show a misleading quote', () => {
  for (const people of ['', 0, -1, 1.5, 51, NaN, Infinity])
    assert.equal(estimateTour(people, 90), null)
  for (const minutes of [0, 30, 61, 120, 151, NaN])
    assert.equal(estimateTour(2, minutes), null)
})
test('booking summary carries all entered fields, exact discount and disclaimer', () => {
  const trip = {
    ...INITIAL_TRIP,
    date: '2026-09-10',
    departure: '10:30',
    people: 6,
    minutes: 150,
    guideChoice: false,
    stops: ['鹿港老街', '鹿港龍山寺'],
    pickup: '停車場',
    notes: '折疊輪椅',
  }
  const zh = bookingSummary(trip, 'zh')
  for (const text of [
    '2026-09-10',
    '10:30',
    '6 位',
    '150 分鐘',
    '鹿港老街、鹿港龍山寺',
    '停車場',
    '折疊輪椅',
    '2 台',
    'NT$3,000',
    'NT$2,850',
    '尚未扣除活動優惠券',
  ])
    assert.ok(zh.includes(text), text)
  const en = bookingSummary(trip, 'en')
  for (const text of [
    'Lukang Old Street',
    'Lukang Longshan Temple',
    'NT$2,850',
    'Campaign coupons are not included',
  ])
    assert.ok(en.includes(text), text)
})
test('guide-choice summary has no fabricated stops or booking confirmation', () => {
  const summary = bookingSummary(INITIAL_TRIP, 'zh')
  assert.ok(summary.includes('請導覽員幫我安排'))
  assert.ok(summary.includes('日期：待確認'))
  assert.ok(summary.includes('麻煩協助確認'))
})
test('bilingual sights retain matching stable IDs', () => {
  assert.deepEqual(
    getSights('zh').map((s) => s.id),
    getSights('en').map((s) => s.id),
  )
  assert.equal(getSights('zh').length, 8)
})
