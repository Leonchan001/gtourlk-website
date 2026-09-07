import test from 'node:test'
import assert from 'node:assert/strict'
import {
  ATLAS_STOPS,
  ATLAS_COPY,
  ATLAS_CONNECTIONS,
  atlasStops,
  atlasSelection,
  atlasPath,
  project,
} from '../src/data/atlas.js'
import { ATLAS_STREETS } from '../src/data/atlasStreets.js'
import { getTourPlans } from '../src/data/tours.js'

const point = (id) => ATLAS_STOPS.find((stop) => stop.id === id)
test('atlas reuses all existing plan sights without changing duration membership', () => {
  for (const plan of getTourPlans('zh')) {
    assert.deepEqual(
      atlasStops(plan.minutes)
        .map((stop) => stop.id)
        .sort(),
      [...plan.stops].sort(),
    )
    for (const id of ATLAS_CONNECTIONS[plan.minutes])
      assert.ok(plan.stops.includes(id))
    assert.ok(!atlasPath(plan.minutes).includes('NaN'))
  }
  assert.equal(new Set(ATLAS_STOPS.map((stop) => stop.id)).size, 8)
})
test('geographic anchors preserve verified north/south and east/west relationships', () => {
  const tianhou = project(point('鹿港天后宮').coordinates)
  const old = project(point('鹿港老街').coordinates)
  const arts = project(point('桂花巷藝術村').coordinates)
  const nine = project(point('九曲巷').coordinates)
  const molu = project(point('摸乳巷').coordinates)
  const koo = project(point('辜家大宅').coordinates)
  const longshan = project(point('鹿港龍山寺').coordinates)
  assert.ok(
    tianhou[1] < old[1] &&
      old[1] < nine[1] &&
      nine[1] < molu[1] &&
      molu[1] < longshan[1],
  )
  assert.ok(arts[0] < old[0] && molu[0] < nine[0] && nine[0] < koo[0])
  assert.ok(koo[1] < nine[1])
})
test('regional placeholder has no fabricated coordinate or route node', () => {
  assert.equal(point('南北鹿港經典古蹟').coordinates, null)
  assert.equal(point('南北鹿港經典古蹟').kind, 'area')
  for (const ids of Object.values(ATLAS_CONNECTIONS))
    assert.ok(!ids.includes('南北鹿港經典古蹟'))
})
test('all physical sights have official provenance, bilingual copy and visible anchors', () => {
  for (const stop of ATLAS_STOPS) {
    for (const lang of ['zh', 'en']) {
      assert.ok(stop[lang].name && stop[lang].short && stop[lang].detail)
      assert.ok(
        ATLAS_COPY[lang].captions[60] &&
          ATLAS_COPY[lang].captions[90] &&
          ATLAS_COPY[lang].captions[150],
      )
    }
    if (!stop.coordinates) continue
    assert.ok(stop.source.startsWith('https://media.taiwan.net.tw/'))
    const [x, y] = project(stop.coordinates)
    assert.ok(x > 0 && x < 600 && y > 0 && y < 500)
  }
})
test('duration changes keep compatible selection and safely reset an incompatible one', () => {
  assert.equal(atlasSelection(150, '辜家大宅').id, '辜家大宅')
  assert.equal(atlasSelection(60, '辜家大宅').id, '鹿港天后宮')
  assert.equal(atlasSelection(90, '鹿港老街').id, '鹿港老街')
})
test('offline street geometry has unique source way IDs and finite coordinates', () => {
  assert.equal(
    new Set(ATLAS_STREETS.map(([id]) => id)).size,
    ATLAS_STREETS.length,
  )
  for (const [id, name, coordinates] of ATLAS_STREETS) {
    assert.match(id, /^\d+$/)
    assert.ok(name)
    assert.ok(
      coordinates
        .split(/[ ,]/)
        .every((value) => Number.isFinite(Number(value))),
    )
  }
})
test('all mobile callout touch rectangles are separate at 320/375/390/430', () => {
  for (const viewport of [320, 375, 390, 430]) {
    // Include a 15px desktop scrollbar even when emulating mobile: conservative.
    const width = viewport - (viewport < 359 ? 40 : 48) - 15
    const height = Math.min(250, Math.max(214, viewport * 0.58))
    const rects = ATLAS_STOPS.filter((s) => s.coordinates).map((s) => ({
      id: s.id,
      x: (s.label[0] / 600) * width,
      y: (s.label[1] / 500) * height,
    }))
    for (let i = 0; i < rects.length; i++)
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i],
          b = rects[j]
        assert.ok(
          Math.abs(a.x - b.x) >= 76 || Math.abs(a.y - b.y) >= 44,
          `${viewport}: ${a.id} / ${b.id}`,
        )
      }
  }
})
