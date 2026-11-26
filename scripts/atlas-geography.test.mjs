import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ATLAS_ITINERARIES } from '../src/data/atlasItineraries.js'
import { projectToMap, BASEMAP_SIZE, MOBILE_VIEWBOX, MAP_POINTS } from '../src/data/townBasemap.js'
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

test('base map is generated from the OSM snapshot with attribution and real streets', () => {
  for (const lang of ['zh', 'en']) {
    const svg = fs.readFileSync(new URL(`../public/atlas/lukang-basemap-${lang}.svg`, import.meta.url), 'utf8')
    assert.match(svg, /OpenStreetMap contributors, ODbL/)
    assert.match(svg, new RegExp(`viewBox="0 0 ${BASEMAP_SIZE[0]} ${BASEMAP_SIZE[1]}"`))
    assert.ok(svg.length < 200_000, 'base map stays light')
  }
  assert.match(fs.readFileSync(new URL('../public/atlas/lukang-basemap-zh.svg', import.meta.url), 'utf8'), />中山路<.*>民權路<.*>三民路</s)
  // True scale: 100 m east and 100 m north are the same length on the map.
  const [x0, y0] = projectToMap([120.433, 24.054])
  const east = projectToMap([120.433 + 100 / (111320 * Math.cos(24.054 * Math.PI / 180)), 24.054])[0] - x0
  const north = y0 - projectToMap([120.433, 24.054 + 100 / 111320])[1]
  assert.ok(Math.abs(east - north) / north < 0.01)
  assert.ok(distance(MAP_POINTS.辜家大宅, stops.辜家大宅.coordinates) < 60, 'footprint marker stays near the official point')
})

test('north/south and east/west sight ordering survives both layouts', () => {
  const northToSouth = ['鹿港天后宮','鹿港老街','桂花巷藝術村','辜家大宅','九曲巷','摸乳巷','鹿港龍山寺']
  const westToEast = ['鹿港天后宮','桂花巷藝術村','摸乳巷','鹿港老街','鹿港龍山寺','九曲巷','辜家大宅']
  for (const [ids, axis] of [[northToSouth,1],[westToEast,0]]) ids.slice(1).forEach((id, i) => {
    assert.ok(projectToMap(stops[id].coordinates)[axis] > projectToMap(stops[ids[i]].coordinates)[axis], `${ids[i]} before ${id}`)
  })
  const [mx, my, mw, mh] = MOBILE_VIEWBOX
  for (const stop of Object.values(stops)) {
    const [x, y] = projectToMap(MAP_POINTS[stop.id] || stop.coordinates)
    assert.ok(x > 20 && y > 20 && x < BASEMAP_SIZE[0] - 20 && y < BASEMAP_SIZE[1] - 20, `${stop.id} on desktop map`)
    assert.ok(x > mx + 20 && y > my + 20 && x < mx + mw - 20 && y < my + mh - 20, `${stop.id} on phone crop`)
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

test('walking estimates derive from short connected legs, not whole-tour duration', () => {
  const short = ATLAS_ITINERARIES[60].legs.find(l => l.to === '桂花巷藝術村')
  const south = ATLAS_ITINERARIES[90].legs.find(l => l.from === '摸乳巷')
  assert.ok(short.meters > 120 && short.meters < 160)
  assert.ok(south.meters > 350 && south.meters < 410)
  assert.deepEqual([Math.ceil(short.meters/80),Math.ceil(short.meters/60)],[2,3])
  assert.deepEqual([Math.ceil(south.meters/80),Math.ceil(south.meters/60)],[5,7])
})
