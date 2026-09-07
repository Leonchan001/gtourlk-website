// Photography slots: change a slot here without touching the page layout.
// Null slots are intentionally not represented with invented people or imagery.
function photo(src, width, height, zh, en, position = 'center') {
  const stem = src.split('/').pop().replace('.jpg', '')
  const widths = [
    ...new Set([480, 800, 960, 1400].map((size) => Math.min(size, width))),
  ]
  return {
    src,
    width,
    height,
    alt: { zh, en },
    position,
    sources: Object.fromEntries(
      ['avif', 'webp'].map((format) => [
        format,
        widths
          .map((size) => `/media/${stem}-${size}.${format} ${size}w`)
          .join(', '),
      ]),
    ),
  }
}
export const MEDIA = {
  hero: photo(
    '/hero-main.jpg',
    1400,
    788,
    '導鹿四輪電動導覽車停在桂花巷藝術村入口',
    'GtourLK electric tour vehicle at Osmanthus Alley Art Village',
    '58% center',
  ),
  streetDetail: photo(
    '/photos/lukang-half-well.jpg',
    500,
    375,
    '鹿港半邊井，紅磚與斑駁牆面的細節',
    'The half well, red bricks and weathered wall in Lukang',
  ),
  lukangAtmosphere: photo(
    '/photos/lukang-old-street-night.jpg',
    500,
    332,
    '暮色中的鹿港巷弄與紅燈籠',
    'Lanterns along a Lukang lane at dusk',
  ),
  townOverview: photo(
    '/photos/lukang-rooftops-aerial.jpg',
    1200,
    898,
    '鹿港的紅瓦屋頂與巷弄',
    'Red-tiled roofs and lanes in Lukang',
  ),
  architecture: photo(
    '/photos/lukang-koo-house.jpg',
    960,
    640,
    '鹿港辜家大宅的立面',
    'The facade of the Koo Family Mansion in Lukang',
  ),
  localLife: photo(
    '/photos/lukang-art-village.jpg',
    1000,
    750,
    '桂花巷藝術村的老屋與庭園',
    'Historic buildings and garden at Osmanthus Alley Art Village',
  ),
  houseDetail: photo(
    '/photos/lukang-sanhuai-house.jpg',
    500,
    375,
    '鹿港三槐挺秀宅的紅磚立面',
    'The red-brick facade of Sanhuai House in Lukang',
  ),
  guidePortrait: null,
  guestExperience: null,
  familyExperience: null,
  seniorExperience: null,
  templeDetail: null,
  vehicleDetail: null,
}
