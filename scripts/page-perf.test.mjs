import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { SPECULATION_RULES, landingAnalytics } from '../src/pagePerf.js'

test('home pages carry the same speculation rules as the sight and route pages', async () => {
  for (const file of ['../index.html', '../en/index.html']) {
    const html = await readFile(new URL(file, import.meta.url), 'utf8')
    const match = /<script type="speculationrules">([\s\S]*?)<\/script>/.exec(html)
    assert.ok(match, `${file} has speculation rules`)
    assert.deepEqual(JSON.parse(match[1]), JSON.parse(SPECULATION_RULES))
  }
})

test('static pages load GA only after load and track LINE and phone taps', () => {
  const script = landingAnalytics('zh', 'G-TEST1234')
  assert.match(script, /addEventListener\('load'/)
  assert.match(script, /line_click/)
  assert.match(script, /phone_click/)
  assert.doesNotThrow(() => new Function(script))
  assert.equal(landingAnalytics('zh', 'G-XXXXXXXXXX'), '')
})
