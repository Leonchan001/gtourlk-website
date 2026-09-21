import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

function sourceText(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).map(entry => {
    const file = path.join(dir, entry.name)
    return entry.isDirectory() ? sourceText(file) : /\.(jsx?|css)$/.test(entry.name) ? fs.readFileSync(file,'utf8') : ''
  }).join('')
}
test('both Chinese font families cover all site copy, including dynamic sight stories', () => {
  const characters = new Set(sourceText('src').match(/[\u2e80-\u9fff\uff00-\uffef]/gu))
  const css = fs.readFileSync('src/fonts.css','utf8')
  for (const family of ['Noto Sans TC','Noto Serif TC']) {
    const faces = css.match(/@font-face\{[^}]+\}/g).filter(face=>face.includes(`"${family}"`))
    const points = new Set([...faces.join('').matchAll(/U\+([0-9a-f]+)/gi)].map(m=>parseInt(m[1],16)))
    const missing = [...characters].filter(c=>!points.has(c.codePointAt(0)))
    assert.deepEqual(missing, [], `${family}: run scripts/prepare-fonts.mjs after copy changes`)
    for (const face of faces) {
      assert.match(face,/font-weight:400 700;/)
      assert.match(face,/font-display:swap;/)
      const asset = face.match(/url\("([^"?]+)/)[1]
      assert.ok(fs.existsSync('public'+asset), `Missing font file ${asset}`)
    }
  }
})
