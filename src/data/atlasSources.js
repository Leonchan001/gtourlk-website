// Responsive srcset strings for atlas photographs built by scripts/prepare-atlas-images.cjs.
const WIDTHS = [320, 640, 960, 1280]

export function atlasSources(src, width) {
  const match = /^\/photos\/atlas\/([^/]+)\.(?:jpe?g|webp)$/.exec(src || '')
  if (!match) return undefined
  const sizes = [...new Set(WIDTHS.map((size) => Math.min(size, width)))]
  return Object.fromEntries(
    ['avif', 'webp'].map((format) => [
      format,
      sizes.map((size) => `/photos/atlas/sized/${match[1]}-${size}.${format} ${size}w`).join(', '),
    ]),
  )
}
