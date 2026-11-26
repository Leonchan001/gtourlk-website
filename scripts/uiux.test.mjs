import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

test('home page shows price, rating and booking contacts without scrolling to the form', () => {
  for (const file of ['dist/index.html', 'dist/en/index.html']) {
    const html = fs.readFileSync(file, 'utf8')
    const hero = html.slice(html.indexOf('id="top"'), html.indexOf('</section>', html.indexOf('id="top"')))
    assert.match(hero, /hero-facts/)
    assert.match(hero, /NT\$600/)
    assert.match(hero, /Google 5\.0/)
    assert.equal((html.match(/class="mid-cta"/g) || []).length, 2)
    assert.ok(html.indexOf('id="faq"') < html.indexOf('id="contact"'), 'FAQ comes before the booking form')
  }
})

test('Chinese home page drops decorative English section labels', () => {
  const html = fs.readFileSync('dist/index.html', 'utf8')
  for (const label of ['THE LUKANG JOURNAL', 'LUKANG ROUTE ATLAS', 'A clear price', 'Before you arrive', 'The art of taking your time'])
    assert.ok(!html.includes(label), label)
})

test('sight pages prefill the LINE message with the sight and show the price', () => {
  const html = fs.readFileSync('dist/places/old-street/index.html', 'utf8')
  const prefilled = [...html.matchAll(/href="(https:\/\/line\.me\/R\/oaMessage\/@lk167\/\?[^"]+)"/g)].map((m) => decodeURIComponent(m[1]))
  assert.ok(prefilled.some((href) => href.includes('鹿港老街')))
  assert.match(html, /lp-cta-price/)
  assert.match(html, /tel:\+886927013167/)
})
