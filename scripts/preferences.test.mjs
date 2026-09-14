import test from 'node:test'
import assert from 'node:assert/strict'
import {
  recommendDuration,
  cleanPriorities,
  togglePriority,
  PREFERENCE_META,
  PREFERENCE_COPY,
} from '../src/data/preferences.js'
import { bookingSummary, INITIAL_TRIP, getSights } from '../src/data/booking.js'
import {
  explorationStops,
  ATLAS_LAYERS,
  layerPath,
  ATLAS_EXPERIENCE,
} from '../src/data/atlas.js'
const core = ['鹿港天后宮', '鹿港老街', '桂花巷藝術村']
const five = [...core, '摸乳巷', '九曲巷']
test('60 minute core preferences need no advisory', () => {
  assert.equal(recommendDuration(60, core).advisory, false)
})
test('60 minute five preferences prompt 90, without removing preferences', () => {
  assert.equal(recommendDuration(60, five).next, 90)
  assert.equal(recommendDuration(90, five).advisory, false)
  assert.equal(five.length, 5)
})
test('tier matters even for one preference; a broad area is not one stop', () => {
  assert.equal(recommendDuration(60, ['鹿港龍山寺']).next, 90)
  assert.equal(recommendDuration(90, ['辜家大宅']).next, 150)
  assert.equal(recommendDuration(60, ['辜家大宅']).next, 150)
  assert.equal(PREFERENCE_META['南北鹿港經典古蹟'].weight, 2)
})
test('150 can still advise prioritising without an impossible upgrade', () => {
  const result = recommendDuration(
    150,
    getSights('zh').map((s) => s.id),
  )
  assert.equal(result.advisory, true)
  assert.equal(result.next, null)
})
test('empty, duplicate, unknown and guide-arranged preferences are safe', () => {
  assert.equal(recommendDuration(60, []).advisory, false)
  assert.equal(
    recommendDuration(60, [...five, 'unknown'], true).advisory,
    false,
  )
  assert.equal(
    recommendDuration(60, ['鹿港老街', '鹿港老街', 'unknown']).load,
    1,
  )
})
test('maximum two priorities; deselection and invalid stored priorities are sanitised', () => {
  let ids = togglePriority(core, [], core[0])
  ids = togglePriority(core, ids, core[1])
  assert.deepEqual(togglePriority(core, ids, core[2]), ids)
  assert.deepEqual(togglePriority(core, ids, core[0]), [core[1]])
  assert.deepEqual(cleanPriorities([core[1]], [...ids, 'unknown']), [core[1]])
  assert.deepEqual(cleanPriorities(core, 'invalid'), [])
})
for (const lang of ['zh', 'en'])
  test(`${lang}: default route replaces legacy sight preferences`, () => {
    const summary = bookingSummary(
      {
        ...INITIAL_TRIP,
        stops: five,
        priorities: core.slice(0, 2),
        guideChoice: false,
      },
      lang,
    )
    assert.match(
      summary,
      lang === 'zh' ? /導鹿預設路線/ : /GtourLK default route/,
    )
    assert.doesNotMatch(
      summary,
      /最想去|Must-see|鹿港天后宮|Lukang Tianhou Temple/,
    )
    for (const minutes of [60, 90, 150])
      assert.ok(
        PREFERENCE_COPY[lang].guidance[minutes] &&
          ATLAS_EXPERIENCE[lang].value[minutes],
      )
  })
test('atlas scope accumulates while original reference lists remain independent', () => {
  for (const [from, to] of [
    [60, 90],
    [90, 150],
  ]) {
    const next = explorationStops(to).map((s) => s.id)
    assert.ok(explorationStops(from).every((s) => next.includes(s.id)))
    assert.ok(explorationStops(to).length > explorationStops(from).length)
  }
  for (const layer of ATLAS_LAYERS) assert.ok(!layerPath(layer).includes('NaN'))
})
