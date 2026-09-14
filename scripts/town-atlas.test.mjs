import test from 'node:test'
import assert from 'node:assert/strict'
import {
  townProject,
  TOWN_LABELS,
  roadTier,
  TOWN_VIEW,
} from '../src/data/townAtlas.js'
import { TOWN_ROADS } from '../src/data/townAtlasRoads.js'
import { ATLAS_STOPS, atlasStops } from '../src/data/atlas.js'
import { getTourPlans } from '../src/data/tours.js'

test('town projection preserves north/east and local distance proportions on both layouts', () => {
  const p = [120.433, 24.055],
    a = townProject(p),
    north = townProject([p[0], p[1] + 0.001]),
    east = townProject([p[0] + 0.001 / Math.cos((p[1] * Math.PI) / 180), p[1]])
  assert.ok(north[1] < a[1] && east[0] > a[0])
  assert.ok(Math.abs((east[0] - a[0]) / (a[1] - north[1]) - 1) < 0.0001)
  for (const stop of ATLAS_STOPS.filter((s) => s.coordinates)) {
    const d = townProject(stop.coordinates),
      m = townProject(stop.coordinates, true)
    assert.ok(Math.abs(m[0] - d[0] - 60) < 1e-8)
    assert.equal(m[1], d[1])
  }
  assert.ok(TOWN_VIEW.desktop[1] > TOWN_VIEW.desktop[0])
})
test('real old-town lanes and the three main roads are present with unique OSM ids', () => {
  assert.equal(new Set(TOWN_ROADS.map((r) => r.id)).size, TOWN_ROADS.length)
  for (const name of [
    '中山路',
    '民權路',
    '三民路',
    '瑤林街(鹿港老街)',
    '埔頭街(鹿港老街)',
    '公園三路109巷(桂花巷藝術村)',
    '摸乳巷',
    '九曲巷',
  ])
    assert.ok(
      TOWN_ROADS.some((r) => r.name === name),
      name,
    )
  for (const r of TOWN_ROADS) {
    assert.ok(r.points.length >= 2)
    assert.ok(r.points.every((p) => p.length === 2 && p.every(Number.isFinite)))
  }
  assert.equal(roadTier('中山路'), 'main')
  assert.equal(roadTier('瑤林街(鹿港老街)'), 'lane')
  assert.equal(roadTier('館前街'), 'context')
})
test('four distinct landmark drawings and genuinely rearranged mobile labels', () => {
  assert.deepEqual(
    Object.values(TOWN_LABELS)
      .map((l) => l.drawing)
      .filter(Boolean)
      .sort(),
    ['arts', 'house', 'longshan', 'tianhou'],
  )
  assert.equal(Object.keys(TOWN_LABELS).length, 7)
  assert.ok(
    Object.values(TOWN_LABELS).filter(
      (l) => l.mobile[0] !== l.desktop[0] + 60 || l.mobile[1] !== l.desktop[1],
    ).length >= 4,
  )
  for (const l of Object.values(TOWN_LABELS))
    for (const view of ['desktop', 'mobile'])
      assert.ok(l[view].every((v, i) => v > 0 && v < TOWN_VIEW[view][i]))
})
test('time highlights retain exact existing plan membership, never inferred cumulative stops', () => {
  for (const plan of getTourPlans('zh'))
    assert.deepEqual(
      atlasStops(plan.minutes)
        .map((s) => s.id)
        .sort(),
      [...plan.stops].sort(),
    )
  assert.ok(!atlasStops(90).some((s) => s.id === '桂花巷藝術村'))
  assert.ok(!atlasStops(150).some((s) => s.id === '摸乳巷'))
})
