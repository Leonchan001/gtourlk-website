import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { ATLAS_STORIES } from '../src/data/atlasStories.js'
import { PAGE_COPY, PLACES, PLACE_SLUGS, absolute, listPages } from '../src/data/pages.js'

test('every physical sight has one unique, URL-safe slug and a page', () => {
  const slugs = Object.values(PLACE_SLUGS)
  assert.equal(new Set(slugs).size, slugs.length)
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/)
  assert.deepEqual(
    PLACES.map((place) => place.id).sort(),
    Object.keys(ATLAS_STORIES).sort(),
  )
  for (const place of PLACES) assert.ok(place.photo, `${place.id} photo`)
})

test('page list covers both languages: index, 16 sights and 3 routes each', () => {
  const pages = listPages()
  assert.equal(pages.length, 2 * (1 + PLACES.length + 3))
  assert.equal(new Set(pages.map((page) => page.path)).size, pages.length)
  for (const page of pages)
    assert.equal(page.path.startsWith('/en/'), page.lang === 'en', page.path)
})

test('page descriptions stay within search snippet length', () => {
  for (const place of PLACES) {
    assert.ok(PAGE_COPY.zh.placeDescription(place.zh).length <= 160, place.id)
    assert.ok(PAGE_COPY.en.placeDescription(place.en).length <= 320, place.id)
  }
})

const built = fs.existsSync('dist/sitemap.xml')
test('built pages carry canonical, hreflang and valid JSON-LD', { skip: !built }, () => {
  for (const page of listPages()) {
    const html = fs.readFileSync(`dist${page.path}index.html`, 'utf8')
    assert.ok(html.includes(`rel="canonical" href="${absolute(page.path)}"`), page.path)
    for (const lang of ['zh-Hant', 'en', 'x-default'])
      assert.ok(html.includes(`hrefLang="${lang}"`), `${page.path} ${lang}`)
    assert.ok(!html.includes('<script type="module"'), 'static pages ship no JS')
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
    const types = ld['@graph'].map((node) => node['@type'])
    assert.ok(types.includes('BreadcrumbList'), page.path)
    const expected = { place: 'TouristAttraction', tour: 'TouristTrip', places: 'ItemList' }[page.type]
    assert.ok(types.includes(expected), `${page.path} ${expected}`)
  }
})

test('sitemap lists every page with a lastmod date', { skip: !built }, () => {
  const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8')
  const urls = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1])
  assert.equal(urls.length, listPages().length + 2)
  for (const url of urls) assert.match(url, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/)
  for (const page of listPages())
    assert.ok(sitemap.includes(`<loc>${absolute(page.path)}</loc>`), page.path)
})

test('sight guides are bilingual, sourced and attached to real sights', async () => {
  const { PLACE_GUIDES } = await import('../src/data/placeGuides.js')
  for (const [id, guide] of Object.entries(PLACE_GUIDES)) {
    assert.ok(PLACE_SLUGS[id], id)
    assert.ok(guide.sources.length && guide.sources.every((s) => /^https?:\/\//.test(s.url)), id)
    for (const lang of ['zh', 'en']) {
      assert.ok(guide[lang].history.length && guide[lang].highlights.length && guide[lang].tips.length, `${id} ${lang}`)
      assert.equal(guide[lang].highlights.length, guide[lang === 'zh' ? 'en' : 'zh'].highlights.length, id)
    }
    if (guide.official) assert.match(guide.official.url, /^https?:\/\//)
  }
})

test('nearby sights use street walking distance, never shorter than a straight line', async () => {
  const { PLACE_WALKING } = await import('../src/data/placeWalking.js')
  const { nearbyPlaces } = await import('../src/data/pages.js')
  const line = ([a, b], [c, d]) => Math.hypot((a - c) * Math.cos(24.055 * Math.PI / 180), b - d) * 111195
  for (const from of PLACES) {
    for (const to of PLACES.filter((p) => p !== from)) {
      const meters = PLACE_WALKING[from.id][to.id]
      assert.ok(meters >= line(from.coordinates, to.coordinates) - 1, `${from.id}→${to.id}`)
      assert.equal(meters, PLACE_WALKING[to.id][from.id], 'symmetric')
    }
    const near = nearbyPlaces(from.id)
    assert.equal(near.length, 3)
    near.slice(1).forEach((n, i) => assert.ok(n.meters >= near[i].meters))
  }
})
