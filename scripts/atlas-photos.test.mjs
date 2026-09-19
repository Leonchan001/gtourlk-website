import test from 'node:test'
import assert from 'node:assert/strict'
import { stat, readFile } from 'node:fs/promises'
import { ATLAS_PHOTOS } from '../src/data/atlasPhotos.js'
import { ATLAS_STORIES } from '../src/data/atlasStories.js'
import { MEDIA, MEDIA_CREDITS } from '../src/data/media.js'

test('all 16 physical places have a local photograph and a traceable licence', async () => {
  assert.equal(Object.keys(ATLAS_STORIES).length, 16)
  for (const [id, story] of Object.entries(ATLAS_STORIES)) {
    const photo = ATLAS_PHOTOS[id]
    const media = photo || MEDIA[story.photoKey]
    const credit = photo || MEDIA_CREDITS[story.photoKey]
    assert.ok(media?.src.startsWith('/'), `${id}: local photograph`)
    assert.ok(media.alt.zh && media.alt.en, `${id}: bilingual image description`)
    assert.ok(credit?.source.startsWith('https://'), `${id}: linked source`)
    assert.ok((photo ? credit.licenseUrl : credit.license).startsWith('https://'), `${id}: linked licence`)
    const file = new URL(`../public${media.src}`, import.meta.url)
    const size = (await stat(file)).size
    assert.ok(size > 1000, `${id}: real image asset`)
    const bytes = await readFile(file)
    assert.ok(bytes.subarray(0, 2).toString('hex') === 'ffd8' || bytes.subarray(0, 4).toString() === 'RIFF', `${id}: JPEG/WebP, not an HTML download error`)
  }
})

test('photo records preserve attribution and a verified reuse licence', async () => {
  const credits = await readFile(new URL('../public/photos/atlas/ATTRIBUTION.md', import.meta.url), 'utf8')
  for (const [id, photo] of Object.entries(ATLAS_PHOTOS)) {
    if (photo.licenseUrl === 'https://tourism.chcg.gov.tw/Copyright.aspx') {
      assert.equal(photo.license, '網站資料開放宣告')
      assert.equal(new URL(photo.source).hostname, 'tourism.chcg.gov.tw')
      assert.equal(photo.author, '彰化縣政府／彰化旅遊資訊網')
    } else {
      assert.match(photo.license, /^CC BY(?:-SA)? [234]\.0(?: TW)?$/)
      assert.match(photo.licenseUrl, /^https:\/\/creativecommons\.org\/licenses\/by(?:-sa)?\//)
    }
    assert.ok(photo.author && photo.width > 0 && photo.height > 0)
    assert.ok(credits.includes(photo.author) && credits.includes(photo.source) && credits.includes(photo.licenseUrl), `${id}: shipped attribution record`)
  }
})
