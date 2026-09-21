import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ATLAS_ITINERARIES } from '../src/data/atlasItineraries.js'
import { TOWN_ROADS } from '../src/data/townAtlasRoads.js'
import { townProject, PUBLIC_ANCHORS, TOWN_LABELS } from '../src/data/townAtlas.js'
import { ATLAS_STOPS, atlasStops } from '../src/data/atlas.js'

const stops = Object.fromEntries(ATLAS_STOPS.filter(s => s.coordinates).map(s => [s.id, s]))
const xml = fs.readFileSync(new URL('../artifacts/atlas-osm-20260920.xml', import.meta.url), 'utf8')
const rawNodes = new Map([...xml.matchAll(/<node\b([^>]+)/g)].map(m => {
  const a = Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]*)"/g)].map(v => [v[1], v[2]]))
  return [a.id, [+a.lon, +a.lat]]
}))
const edgeKey = (a, b) => [a, b].sort().join(':')
const originalEdges = new Set()
for (const m of xml.matchAll(/<way\b[^>]+>([\s\S]*?)<\/way>/g)) {
  const tags = Object.fromEntries([...m[1].matchAll(/<tag k="([^"]+)" v="([^"]+)"\/>/g)].map(t => [t[1], t[2]]))
  if (!tags.highway || ['no','private'].includes(tags.access) || tags.foot === 'no' || tags.area === 'yes') continue
  const ids = [...m[1].matchAll(/<nd ref="(\d+)"\/>/g)].map(n => n[1])
  ids.slice(1).forEach((id, i) => originalEdges.add(edgeKey(ids[i], id)))
}
const distance = (a, b) => Math.hypot((a[0] - b[0]) * Math.cos(24.055 * Math.PI / 180), a[1] - b[1]) * 111195

test('fresh road extract retains authentic OSM nodes and true junctions', () => {
  for (const road of TOWN_ROADS) {
    assert.equal(road.points.length, road.nodeIds.length)
    road.nodeIds.forEach((id, i) => assert.deepEqual(road.points[i], rawNodes.get(id), `${road.id}/${id}`))
  }
  const nodesFor = name => new Set(TOWN_ROADS.filter(r => r.name === name).flatMap(r => r.nodeIds))
  const zhongshan = nodesFor('中山路')
  for (const cross of ['民權路', '三民路']) {
    assert.ok([...nodesFor(cross)].some(id => zhongshan.has(id)), `${cross} must actually meet Zhongshan`)
  }
})

test('north/south and east/west sight ordering survives both layouts', () => {
  const northToSouth = ['鹿港天后宮','鹿港老街','桂花巷藝術村','辜家大宅','九曲巷','摸乳巷','鹿港龍山寺']
  const westToEast = ['鹿港天后宮','桂花巷藝術村','摸乳巷','鹿港老街','鹿港龍山寺','九曲巷','辜家大宅']
  for (const mobile of [false, true]) {
    for (const [ids, axis] of [[northToSouth,1],[westToEast,0]]) ids.slice(1).forEach((id, i) => {
      assert.ok(townProject(stops[id].coordinates,mobile)[axis] > townProject(stops[ids[i]].coordinates,mobile)[axis], `${ids[i]} before ${id}`)
    })
    const tianhou = townProject(stops.鹿港天后宮.coordinates,mobile)
    const longshan = townProject(stops.鹿港龍山寺.coordinates,mobile)
    assert.ok(longshan[1] - tianhou[1] > 550)
    const gui = townProject(stops.桂花巷藝術村.coordinates,mobile)
    const old = townProject(stops.鹿港老街.coordinates,mobile)
    assert.ok(Math.abs(gui[1] - old[1]) < 8, 'near-equal latitude must not become a long north/south trip')
  }
})

test('duration paths use connected real street edges, not point-to-point chords', () => {
  for (const [minutes, route] of Object.entries(ATLAS_ITINERARIES)) {
    assert.deepEqual([...route.order].sort(), atlasStops(+minutes).filter(s => s.coordinates).map(s => s.id).sort())
    assert.equal(route.legs.length, route.order.length - 1)
    route.legs.forEach((leg, i) => {
      assert.equal(leg.from, route.order[i]); assert.equal(leg.to, route.order[i+1])
      if (i) assert.equal(leg.nodeIds[0], route.legs[i-1].nodeIds.at(-1), 'legs meet')
      assert.ok(distance(stops[leg.from].coordinates, leg.points[0]) < 25)
      assert.ok(distance(stops[leg.to].coordinates, leg.points.at(-1)) < 25)
      let measured = 0
      leg.nodeIds.forEach((id,j) => {
        assert.deepEqual(leg.points[j], rawNodes.get(id))
        if (j) { assert.ok(originalEdges.has(edgeKey(leg.nodeIds[j-1],id)), `authentic accessible edge: ${id}`); measured += distance(leg.points[j-1],leg.points[j]) }
      })
      assert.ok(Math.abs(measured - leg.meters) <= .5)
    })
  }
  assert.ok(!ATLAS_ITINERARIES[150].order.includes('摸乳巷'), 'plans are not cumulative')
})

test('labels and drawings stay local; tiers reflect three anchors and restrained public context', () => {
  assert.deepEqual(Object.entries(TOWN_LABELS).filter(([,l]) => l.tier === 1).map(([id]) => id).sort(), ['鹿港天后宮','鹿港老街','鹿港龍山寺'].sort())
  for (const [id, label] of Object.entries(TOWN_LABELS)) for (const view of ['desktop','mobile']) {
    const [x,y] = townProject(stops[id].coordinates,view === 'mobile'), [lx,ly] = label[view]
    assert.ok(Math.hypot(lx-x,ly-y) < 90, `${id} remote label`)
    const building = label[view+'Building']
    if (building) assert.ok(Math.hypot(building[0]-x,building[1]-y) < 60, `${id} remote building`)
  }
  assert.equal(PUBLIC_ANCHORS.length,3)
  assert.ok(PUBLIC_ANCHORS.every(p => p.source.startsWith('https://') && p.coordinates.every(Number.isFinite)))
})

test('walking estimates derive from short connected legs, not whole-tour duration', () => {
  const short = ATLAS_ITINERARIES[60].legs.find(l => l.to === '桂花巷藝術村')
  const south = ATLAS_ITINERARIES[90].legs.find(l => l.from === '摸乳巷')
  assert.ok(short.meters > 120 && short.meters < 160)
  assert.ok(south.meters > 350 && south.meters < 410)
  assert.deepEqual([Math.ceil(short.meters/80),Math.ceil(short.meters/60)],[2,3])
  assert.deepEqual([Math.ceil(south.meters/80),Math.ceil(south.meters/60)],[5,7])
})
