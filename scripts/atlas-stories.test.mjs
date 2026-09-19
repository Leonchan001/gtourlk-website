import test from 'node:test'
import assert from 'node:assert/strict'
import { ATLAS_STORIES } from '../src/data/atlasStories.js'
import { ATLAS_STOPS } from '../src/data/atlas.js'
import { MORE_PLACES } from '../src/data/morePlaces.js'
import { MEDIA, MEDIA_CREDITS } from '../src/data/media.js'

test('all 16 physical sights have bilingual stories; the area has no invented story', () => {
  const physical = [...ATLAS_STOPS, ...MORE_PLACES].filter(
    (place) => place.coordinates && place.kind !== 'area',
  )
  const ids = physical.map((place) => place.id).sort()
  assert.equal(ids.length, 16)
  assert.deepEqual(Object.keys(ATLAS_STORIES).sort(), ids)
  for (const id of ids) {
    for (const lang of ['zh', 'en']) {
      const copy = ATLAS_STORIES[id][lang]
      assert.equal(typeof copy?.story, 'string', `${id}: ${lang} story`)
      assert.ok(copy.story.trim().length > 0, `${id}: ${lang} empty story`)
      assert.equal(typeof copy?.highlight, 'string', `${id}: ${lang} highlight`)
      assert.ok(copy.highlight.trim().length > 0, `${id}: ${lang} empty highlight`)
    }
  }
})

test('the four photo slots resolve to existing media with bilingual alternatives', () => {
  const expected = {
    桂花巷藝術村: 'localLife',
    鹿港老街: 'lukangAtmosphere',
    辜家大宅: 'architecture',
    鹿港龍山寺: 'templeDetail',
  }
  const actual = Object.fromEntries(
    Object.entries(ATLAS_STORIES)
      .filter(([, story]) => story.photoKey)
      .map(([id, story]) => [id, story.photoKey]),
  )
  assert.deepEqual(actual, expected)
  for (const key of Object.values(actual)) {
    assert.ok(MEDIA[key]?.src, `${key}: photo source`)
    assert.ok(MEDIA[key].alt.zh && MEDIA[key].alt.en, `${key}: alternatives`)
  }
})

test('Longshan photograph retains photographer, source and licence attribution', () => {
  const credit = MEDIA_CREDITS[ATLAS_STORIES.鹿港龍山寺.photoKey]
  assert.ok(credit)
  assert.match(credit.zh, /林璟辰/)
  assert.match(credit.en, /林璟辰/)
  assert.match(credit.zh, /交通部觀光署/)
  assert.match(credit.en, /Tourism Administration/)
  assert.match(credit.source, /^https:\/\/media\.taiwan\.net\.tw\//)
  assert.equal(credit.license, 'https://data.gov.tw/license')
})
