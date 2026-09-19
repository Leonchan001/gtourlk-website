import test from 'node:test'
import assert from 'node:assert/strict'
import { MORE_PLACES } from '../src/data/morePlaces.js'
import { ATLAS_STOPS, atlasStops } from '../src/data/atlas.js'
import { townProject, TOWN_VIEW } from '../src/data/townAtlas.js'

test('additional places have distinct identities and fit the map without changing tour membership', () => {
  const all = [...ATLAS_STOPS, ...MORE_PLACES]
  assert.equal(new Set(all.map(place=>place.id)).size, all.length)
  assert.equal(all.filter(place=>place.coordinates).length,16)
  for(const place of MORE_PLACES) {
    assert.ok(place.source.startsWith('https://') && place.coordinateSource.startsWith('https://'))
    for(const lang of ['zh','en']) assert.ok(place[lang].name && place[lang].detail)
    for(const mobile of [false,true]) {
      const point=townProject(place.coordinates,mobile)
      const view=TOWN_VIEW[mobile?'mobile':'desktop']
      assert.ok(point.every((value,i)=>value>14 && value<view[i]-14),place.id)
    }
    for(const duration of [60,90,150]) assert.ok(!atlasStops(duration).some(stop=>stop.id===place.id))
  }
  assert.equal(all.filter(place=>place.zh.name.includes('民俗文物館')).length,1)
})
