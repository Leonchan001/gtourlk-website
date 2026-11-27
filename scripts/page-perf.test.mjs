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
  const script = landingAnalytics('G-TEST1234')
  assert.match(script, /addEventListener\('load'/)
  assert.match(script, /line_click/)
  assert.match(script, /phone_click/)
  assert.doesNotThrow(() => new Function(script))
  assert.equal(landingAnalytics('G-XXXXXXXXXX'), '')
})

// The Content Security Policy (set at Cloudflare) allows no inline scripts
// except speculation rules; JSON-LD data blocks never execute.
test('built pages contain no inline executable scripts', async () => {
  const { readdir } = await import('node:fs/promises')
  const pages = []
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`
      if (entry.isDirectory()) await walk(path)
      else if (entry.name === 'index.html') pages.push(path)
    }
  }
  await walk(new URL('../dist', import.meta.url).pathname)
  assert.ok(pages.length > 40)
  for (const page of pages) {
    const html = await readFile(page, 'utf8')
    for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (/type="(application\/ld\+json|speculationrules)"/.test(attrs)) continue
      assert.match(attrs, /\bsrc=/, `${page} has an inline script`)
      assert.equal(body.trim(), '', `${page} has an inline script body`)
    }
    assert.doesNotMatch(html, /\son[a-z]+="/i, `${page} has an inline event handler`)
  }
})
