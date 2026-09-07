const fs = require('node:fs')
const path = require('node:path')
const sharp = require(process.env.SHARP_PATH || 'sharp')
;(async () => {
  const files = fs
    .readdirSync('public')
    .filter((x) => /\.(jpg|png)$/.test(x))
    .map((x) => `public/${x}`)
    .concat(fs.readdirSync('public/photos').map((x) => `public/photos/${x}`))
  const tiles = []
  for (const [i, file] of files.entries()) {
    const m = await sharp(file).metadata()
    console.log(
      `${file}: ${m.width}x${m.height}, ${Math.round(fs.statSync(file).size / 1024)} KB`,
    )
    const photo = await sharp(file)
      .resize(300, 210, { fit: 'inside', background: '#eee' })
      .extend({ bottom: 30, background: '#fff' })
      .png()
      .toBuffer()
    const tile = await sharp({
      create: { width: 320, height: 270, channels: 3, background: '#fff' },
    })
      .composite([
        { input: photo, left: 10, top: 0 },
        {
          input: Buffer.from(
            `<svg width="320" height="30"><text x="10" y="20" font-size="12">${path.basename(file)}</text></svg>`,
          ),
          left: 0,
          top: 240,
        },
      ])
      .png()
      .toBuffer()
    tiles.push({
      input: tile,
      left: (i % 3) * 320,
      top: Math.floor(i / 3) * 270,
    })
  }
  fs.mkdirSync('artifacts', { recursive: true })
  await sharp({
    create: {
      width: 960,
      height: Math.ceil(files.length / 3) * 270,
      channels: 3,
      background: '#ddd',
    },
  })
    .composite(tiles)
    .png()
    .toFile('artifacts/media-audit.png')
})()
