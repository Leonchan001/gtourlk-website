// Local equirectangular projection: equal angular scale with longitude corrected
// by cos(latitude). Both streets and sight anchors use this exact function.
export const TOWN_VIEW = { desktop: [480, 680], mobile: [600, 680] }
export function townProject([lon, lat], mobile = false) {
  return [
    70 +
      (lon - 120.431) * 56000 * Math.cos((24.055 * Math.PI) / 180) +
      (mobile ? 60 : 0),
    50 + (24.0598 - lat) * 56000,
  ]
}
// Stable IDs, not array indices. Only label positions change on mobile.
export const TOWN_LABELS = {
  鹿港天后宮: { desktop: [215, 110], mobile: [275, 110], drawing: 'tianhou' },
  桂花巷藝術村: { desktop: [60, 350], mobile: [100, 310], drawing: 'arts' },
  鹿港老街: { desktop: [265, 255], mobile: [335, 245] },
  辜家大宅: { desktop: [405, 365], mobile: [495, 375], drawing: 'house' },
  九曲巷: { desktop: [290, 455], mobile: [305, 450] },
  摸乳巷: { desktop: [75, 495], mobile: [110, 490] },
  鹿港龍山寺: { desktop: [385, 626], mobile: [440, 617], drawing: 'longshan' },
}
export function roadTier(name) {
  if (['中山路', '民權路', '三民路'].includes(name)) return 'main'
  if (/老街|桂花巷|金盛巷|九曲巷|摸乳巷/.test(name)) return 'lane'
  return 'context'
}
export const TOWN_ROAD_LABELS = [
  {
    zh: '中山路',
    en: 'Zhongshan Rd',
    coordinates: [120.4343, 24.0548],
    angle: 57,
  },
  {
    zh: '民權路',
    en: 'Minquan Rd',
    coordinates: [120.4359, 24.057],
    angle: -22,
  },
  {
    zh: '三民路',
    en: 'Sanmin Rd',
    coordinates: [120.4358, 24.0507],
    angle: -7,
  },
  {
    zh: '瑤林・埔頭街',
    en: 'Yaolin / Putou',
    coordinates: [120.4324, 24.0551],
    angle: 76,
  },
]
