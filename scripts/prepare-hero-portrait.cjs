// Encode the user-supplied photograph without enlargement or generated detail.
const sharp = require(process.env.SHARP_PATH || 'sharp')
const source = process.argv[2]
if (!source) throw new Error('Pass the original portrait photograph path')
;(async () => {
  await sharp(source).resize({ width: 1440, withoutEnlargement: true }).jpeg({ quality: 92 }).toFile('public/hero-portrait.jpg')
  for (const width of [480, 800, 960, 1400]) {
    for (const format of ['avif', 'webp']) {
      await sharp(source).resize({ width, withoutEnlargement: true })
        .toFormat(format, { quality: format === 'avif' ? 65 : 86 })
        .toFile(`public/media/hero-portrait-${width}.${format}`)
    }
  }
})()
