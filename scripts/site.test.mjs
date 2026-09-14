import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { MEDIA } from '../src/data/media.js'
import { BUSINESS } from '../src/data/business.js'
import { TOUR_PRICING } from '../src/data/tours.js'
import { isCampaignActive, CAMPAIGN_END } from '../src/data/campaign.js'
import { EXPERIENCE_COPY } from '../src/data/experienceCopy.js'

for (const [lang, file, canonical] of [
  ['zh', 'index.html', 'https://gtourlk.com.tw/'],
  ['en', 'en/index.html', 'https://gtourlk.com.tw/en/'],
]) {
  test(`${lang}: metadata and structured business facts remain consistent`, () => {
    const html = fs.readFileSync(file, 'utf8')
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`))
    for (const key of [
      'hreflang="zh-Hant"',
      'hreflang="en"',
      'hreflang="x-default"',
      'name="description"',
      'property="og:image"',
      'name="twitter:card"',
    ])
      assert.ok(html.includes(key), key)
    const schemas = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].map((match) => JSON.parse(match[1]))
    const business = schemas.find((schema) =>
      schema['@type'].includes('LocalBusiness'),
    )
    assert.ok(business['@type'].includes('TouristAttraction'))
    assert.equal(
      Number(business.aggregateRating.ratingValue),
      Number(BUSINESS.reviewRating),
    )
    assert.equal(
      Number(business.aggregateRating.reviewCount),
      BUSINESS.reviewCount,
    )
    assert.equal(business.hasOfferCatalog['@type'], 'OfferCatalog')
    const offers = business.hasOfferCatalog.itemListElement
    assert.equal(Number(offers[0].price), TOUR_PRICING.oneToTwoHourly)
    assert.equal(Number(offers[1].price), TOUR_PRICING.threePlusHourlyPerPerson)
    assert.equal(
      schemas.find((schema) => schema['@type'] === 'FAQPage').mainEntity.length,
      2,
    )
  })
  test(
    `${lang}: V3 inquiry context and duration guidance are prerendered`,
    {
      skip: !fs.existsSync(`dist/${file}`),
    },
    () => {
      const html = fs.readFileSync(`dist/${file}`, 'utf8')
      const copy = EXPERIENCE_COPY[lang]
      for (const text of [
      copy.booking.defaultRoute,
        copy.booking.priceNote,
        copy.pricing.discount,
      ]) {
        assert.ok(html.includes(text), text)
      }
      assert.ok(!html.includes('class="booking-sights"'))
      assert.ok(!html.includes('id="price-duration-hint"'))
      assert.ok(!html.includes('id="price-guests"'))
      assert.ok(html.includes('id="booking-duration-hint"'))
      assert.ok(
        html.indexOf('class="copy-status"') > html.indexOf(copy.booking.line),
      )
    },
  )
}

test('all responsive photo sources and originals exist', () => {
  for (const photo of Object.values(MEDIA).filter(Boolean)) {
    assert.ok(photo.alt.zh && photo.alt.en)
    assert.ok(fs.existsSync(`public${photo.src}`), photo.src)
    for (const sources of Object.values(photo.sources)) {
      for (const source of sources.split(', '))
        assert.ok(fs.statSync(`public${source.split(' ')[0]}`).size > 0, source)
    }
  }
})

test('robots and reduced motion support ship with the website', () => {
  assert.ok(
    fs
      .readFileSync('public/robots.txt', 'utf8')
      .includes('Sitemap: https://gtourlk.com.tw/sitemap.xml'),
  )
  assert.match(
    fs.readFileSync('src/index.css', 'utf8'),
    /prefers-reduced-motion\s*:\s*reduce/,
  )
  assert.equal(BUSINESS.lineUrl, 'https://line.me/R/ti/p/@lk167')
})

test('campaign expires at the existing Taiwan-local deadline', () => {
  assert.equal(isCampaignActive(CAMPAIGN_END - 1), true)
  assert.equal(isCampaignActive(CAMPAIGN_END), false)
  assert.equal(isCampaignActive(CAMPAIGN_END + 86400000), false)
})

test(
  'production HTML is readable before JavaScript hydrates',
  { skip: !fs.existsSync('dist/index.html') },
  () => {
    for (const file of ['dist/index.html', 'dist/en/index.html']) {
      const html = fs.readFileSync(file, 'utf8')
      assert.match(html, /data-rendered-at="\d+"/)
      assert.match(html, /<style data-inline-styles=/)
      assert.doesNotMatch(html, /<link\b[^>]*rel="stylesheet"/)
      for (const id of [
        'hero-title',
        'brand-title',
        'routes',
        'experience',
        'reviews',
        'pricing',
        'about',
        'contact',
        'faq',
      ])
        assert.ok(html.includes(`id="${id}"`), id)
      assert.equal((html.match(/<h1\b/g) || []).length, 1)
      assert.equal((html.match(/class="faq-item"/g) || []).length, 7)
    }
  },
)
