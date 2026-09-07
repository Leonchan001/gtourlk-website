// Re-encode existing photographs only. Originals remain the fallback and source.
const fs = require('node:fs')
const path = require('node:path')
const sharp = require(process.env.SHARP_PATH || 'sharp')
const files = [
  'hero-main.jpg',
  ...fs
    .readdirSync('public/photos')
    .filter((f) => f.endsWith('.jpg'))
    .map((f) => `photos/${f}`),
]
;(async () => {
  fs.mkdirSync('public/media', { recursive: true })
  await sharp('public/gtourlk-logo-header.png')
    .resize({ height: 80 })
    .webp({ quality: 85 })
    .toFile('public/media/logo-header.webp')
  await sharp('public/gtourlk-logo.png')
    .resize(48, 48, { fit: 'contain', background: '#f8f5ee' })
    .png()
    .toFile('public/media/favicon.png')
  await sharp('public/gtourlk-logo.png')
    .resize(180, 180, { fit: 'contain', background: '#f8f5ee' })
    .png()
    .toFile('public/media/apple-touch-icon.png')
  let original = 0,
    webp = 0,
    avif = 0
  for (const file of files) {
    const src = `public/${file}`
    const meta = await sharp(src).metadata()
    const stem = path.basename(file, '.jpg')
    const widths = [
      ...new Set([480, 800, 960, 1400].map((w) => Math.min(w, meta.width))),
    ]
    original += fs.statSync(src).size
    for (const width of widths) {
      for (const format of ['webp', 'avif']) {
        const out = `public/media/${stem}-${width}.${format}`
        await sharp(src)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .toFormat(format, { quality: format === 'avif' ? 48 : 78 })
          .toFile(out)
        if (width === meta.width) {
          if (format === 'webp') webp += fs.statSync(out).size
          else avif += fs.statSync(out).size
        }
      }
    }
  }
  console.log(
    JSON.stringify({
      originalBytes: original,
      fullSizeWebpBytes: webp,
      fullSizeAvifBytes: avif,
    }),
  )
})()
