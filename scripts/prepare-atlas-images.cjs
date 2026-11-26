// Build responsive AVIF/WebP copies of the atlas photographs.
// Originals in public/photos/atlas stay untouched as the licensed source and fallback.
// Run: node scripts/prepare-atlas-images.cjs (set SHARP_PATH if sharp is installed elsewhere)
const fs = require('node:fs')
const path = require('node:path')
const sharp = require(process.env.SHARP_PATH || 'sharp')

const SRC = 'public/photos/atlas'
const OUT = `${SRC}/sized`
const WIDTHS = [320, 640, 960, 1280]

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  let before = 0
  let after = 0
  for (const file of fs.readdirSync(SRC).filter((f) => /\.(jpe?g|webp)$/.test(f))) {
    const src = `${SRC}/${file}`
    const stem = path.parse(file).name
    const { width } = await sharp(src).metadata()
    before += fs.statSync(src).size
    for (const w of [...new Set(WIDTHS.map((size) => Math.min(size, width)))]) {
      const base = sharp(src).rotate().resize({ width: w, withoutEnlargement: true })
      await base.clone().avif({ quality: 52, effort: 6 }).toFile(`${OUT}/${stem}-${w}.avif`)
      await base.clone().webp({ quality: 74, effort: 6 }).toFile(`${OUT}/${stem}-${w}.webp`)
      if (w === 960) after += fs.statSync(`${OUT}/${stem}-${w}.avif`).size
    }
  }
  console.log(`originals ${Math.round(before / 1024)} KB, 960w avif set ${Math.round(after / 1024)} KB`)
})()
