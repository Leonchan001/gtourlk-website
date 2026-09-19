import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { EXPERIENCE_COPY } from '../src/data/experienceCopy.js'

test('every Chinese hero character has a local serif font declaration', () => {
  const css = fs.readFileSync('src/fonts.css', 'utf8')
  const faces = css.match(/@font-face\s*\{[^}]+\}/g).filter(face => face.includes('Noto Serif TC'))
  const points = new Set(faces.flatMap(face => [...face.matchAll(/U\+([0-9a-f]+)/gi)].map(match => parseInt(match[1], 16))))
  for (const character of EXPERIENCE_COPY.zh.hero.lines.join('').match(/[\u2e80-\u9fff\uff00-\uffef]/g)) {
    assert.ok(points.has(character.codePointAt(0)), `Missing headline glyph: ${character}; run scripts/prepare-fonts.mjs`)
  }
})
