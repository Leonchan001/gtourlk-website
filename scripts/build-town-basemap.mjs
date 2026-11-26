// Build the Lukang base map from the checked-in OpenStreetMap snapshot.
// Output: public/atlas/lukang-basemap-{zh,en}.svg (static, cached) and
// src/data/townBasemap.js (projection constants shared with the overlay).
// Data © OpenStreetMap contributors, ODbL 1.0.
// Run: node scripts/build-town-basemap.mjs
import fs from 'node:fs'

const SOURCE = 'artifacts/atlas-osm-20260920.xml'
const xml = fs.readFileSync(SOURCE, 'utf8')

// True-scale local projection: one metre east equals one metre north.
export const BOUNDS = { west: 120.4288, east: 120.4398, south: 24.0482, north: 24.0608 }
const SCALE = 62000
const COS = Math.cos((24.054 * Math.PI) / 180)
const project = ([lon, lat]) => [(lon - BOUNDS.west) * COS * SCALE, (BOUNDS.north - lat) * SCALE]
const WIDTH = Math.round((BOUNDS.east - BOUNDS.west) * COS * SCALE)
const HEIGHT = Math.round((BOUNDS.north - BOUNDS.south) * SCALE)
const MOBILE = [36, 40, 494, 680]

const nodes = new Map()
for (const m of xml.matchAll(/<node id="(\d+)"[^>]*?lat="([\d.]+)" lon="([\d.]+)"/g)) nodes.set(m[1], [Number(m[3]), Number(m[2])])
const ways = []
for (const m of xml.matchAll(/<way id="(\d+)"[^>]*>([\s\S]*?)<\/way>/g)) {
  const refs = [...m[2].matchAll(/<nd ref="(\d+)"/g)].map(r => nodes.get(r[1])).filter(Boolean)
  const tags = Object.fromEntries([...m[2].matchAll(/<tag k="([^"]+)" v="([^"]*)"/g)].map(t => [t[1], t[2]]))
  if (refs.length > 1) ways.push({ id: m[1], tags, points: refs })
}
const byId = id => ways.find(way => way.id === id)
const r = n => Math.round(n * 10) / 10
const line = points => 'M' + points.map(p => project(p).map(r).join(',')).join('L')
const ring = points => line(points) + 'Z'

const ROAD_CLASS = { secondary: 'major', tertiary: 'major', residential: 'minor', unclassified: 'minor', living_street: 'minor', pedestrian: 'lane', footway: 'lane', path: 'lane', service: 'service' }
// Footprints drawn in brick: Tianhou, Longshan and the Koo mansion (folk arts museum).
const LANDMARKS = ['221190719', '221190489', '322992910']
// Old Street (Putou, Yaolin, Dayou) and the named lanes themselves.
const OLD_STREETS = ['321580403', '52073324', '321580404']
const LANES = ['322993899', '321580410', '321580411', '383403030']

const layers = { building: [], green: [], water: [], major: [], minor: [], lane: [], service: [] }
for (const way of ways) {
  const t = way.tags
  if (LANDMARKS.includes(way.id) || OLD_STREETS.includes(way.id) || LANES.includes(way.id)) continue
  if (t.building) layers.building.push(ring(way.points))
  else if (t.leisure === 'park' || t.landuse === 'grass') layers.green.push(ring(way.points))
  else if (['canal', 'stream', 'river'].includes(t.waterway)) layers.water.push(line(way.points))
  else if (ROAD_CLASS[t.highway] && t.area !== 'yes') layers[ROAD_CLASS[t.highway]].push(line(way.points))
}

// One label per road, on the middle segment of its longest way, kept upright.
const ROAD_LABELS = [
  ['中山路', 'Zhongshan Rd', 'major', 0.5], ['民權路', 'Minquan Rd', 'major', 0.45], ['三民路', 'Sanmin Rd', 'major', 0.5],
  ['民族路', 'Minzu Rd', 'major', 0.5], ['中正路', 'Zhongzheng Rd', 'major', 0.5], ['復興路', 'Fuxing Rd', 'major', 0.5],
  ['彰鹿路', 'Zhanglu Rd', 'major', 0.5], ['埔頭街', 'Putou St', 'minor', 0.5], ['瑤林街', 'Yaolin St', 'minor', 0.5],
  ['民生路', 'Minsheng Rd', 'minor', 0.5], ['龍山街', 'Longshan St', 'minor', 0.5],
]
const length = way => way.points.slice(1).reduce((sum, p, i) => sum + Math.hypot(...project(p).map((v, k) => v - project(way.points[i])[k])), 0)
const labels = ROAD_LABELS.map(([zh, en, tier, at]) => {
  const way = ways.filter(w => w.tags.highway && (w.tags.name || '').startsWith(zh)).sort((a, b) => length(b) - length(a))[0]
  const i = Math.min(way.points.length - 2, Math.max(0, Math.floor(way.points.length * at) - 1))
  const [a, b] = [project(way.points[i]), project(way.points[i + 1])]
  let angle = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
  if (angle > 90) angle -= 180
  if (angle < -90) angle += 180
  return { zh, en, tier, x: r((a[0] + b[0]) / 2), y: r((a[1] + b[1]) / 2), angle: r(angle) }
})

const style = `
.paper{fill:#fbf8f1}.building{fill:#e8dfd0;stroke:#ddd2bf;stroke-width:.4}.green{fill:#e3e6d2}
.water{fill:none;stroke:#bccbd0;stroke-width:4}.service{fill:none;stroke:#e2d8c7;stroke-width:1.2}
.lane{fill:none;stroke:#c9bba5;stroke-width:1.3;stroke-dasharray:3 2}
.casing-minor,.casing-major{fill:none;stroke:#cdbfa8;stroke-linecap:round;stroke-linejoin:round}
.casing-minor{stroke-width:6.5}.casing-major{stroke-width:10}
.minor,.major{fill:none;stroke:#fffdf8;stroke-linecap:round;stroke-linejoin:round}.minor{stroke-width:4.5}.major{stroke-width:8}
.old{fill:none;stroke:#d9a77a;stroke-linecap:round;opacity:.85}.landmark{fill:#dcbfab;stroke:#943f31;stroke-width:1}
text{font-family:'PingFang TC','Noto Sans TC','Noto Sans CJK TC','Microsoft JhengHei',system-ui,sans-serif;text-anchor:middle;paint-order:stroke;stroke-linejoin:round}
.label-major{font-size:13.5px;fill:#6d6052;letter-spacing:.12em;stroke:#fffdf8;stroke-width:3.5}
.label-minor{font-size:11.5px;fill:#8a7c6b;letter-spacing:.08em;stroke:#fbf8f1;stroke-width:3}`
function svg(lang) {
  const path = (cls, list) => list.length ? `<path class="${cls}" d="${list.join('')}"/>` : ''
  const text = labels.map(l => `<text class="label-${l.tier}" x="${l.x}" y="${l.y}" dy="4.5" transform="rotate(${l.angle} ${l.x} ${l.y})">${l[lang]}</text>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">` +
    `<!-- Lukang old town. Map data © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright). Snapshot 2026-09-20. -->` +
    `<style>${style}</style><rect class="paper" width="${WIDTH}" height="${HEIGHT}"/>` +
    path('green', layers.green) + path('water', layers.water) + path('building', layers.building) +
    path('service', layers.service) + path('lane', layers.lane) +
    path('casing-minor', layers.minor) + path('casing-major', layers.major) + path('minor', layers.minor) + path('major', layers.major) +
    `<path class="old" stroke-width="6" d="${OLD_STREETS.map(id => line(byId(id).points)).join('')}"/>` +
    `<path class="old" stroke-width="4" d="${LANES.map(id => line(byId(id).points)).join('')}"/>` +
    path('landmark', LANDMARKS.map(id => ring(byId(id).points))) + text + `</svg>`
}
fs.mkdirSync('public/atlas', { recursive: true })
for (const lang of ['zh', 'en']) fs.writeFileSync(`public/atlas/lukang-basemap-${lang}.svg`, svg(lang))

const centroid = id => { const p = byId(id).points; return [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length].map(v => Math.round(v * 1e6) / 1e6) }
const module = `// Generated by scripts/build-town-basemap.mjs from ${SOURCE}. Do not edit by hand.
// Map data © OpenStreetMap contributors, ODbL 1.0. True-scale local projection, north up.
export const BASEMAP_BOUNDS = ${JSON.stringify(BOUNDS)}
export const BASEMAP_SIZE = [${WIDTH}, ${HEIGHT}]
export const MOBILE_VIEWBOX = ${JSON.stringify(MOBILE)}
export const METRES_PER_UNIT = ${(111320 / SCALE).toFixed(4)}
export const basemapSrc = lang => \`/atlas/lukang-basemap-\${lang === 'en' ? 'en' : 'zh'}.svg\`
export function projectToMap([lon, lat]) {
  return [(lon - ${BOUNDS.west}) * ${(COS * SCALE).toFixed(4)}, (${BOUNDS.north} - lat) * ${SCALE}]
}
// Marker positions for linear places and buildings, from OSM footprints and lanes.
export const MAP_POINTS = ${JSON.stringify({ 辜家大宅: centroid('322992910'), 文武廟: centroid('259926167') })}
`
fs.writeFileSync('src/data/townBasemap.js', module)
console.log(`Base map ${WIDTH}x${HEIGHT}: ${layers.building.length} buildings, ${layers.major.length + layers.minor.length + layers.lane.length + layers.service.length} street ways`)
