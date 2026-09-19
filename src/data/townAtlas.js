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
// Geographic anchors remain untouched. Type and facade placement are editorial
// and intentionally composed independently for a narrow screen.
export const TOWN_LABELS = {
  鹿港天后宮: { desktop: [211, 139], mobile: [284, 150], desktopBuilding: [211, 89], mobileBuilding: [284, 81], drawing: 'tianhou' },
  桂花巷藝術村: { desktop: [74, 297], mobile: [103, 315], desktopBuilding: [68, 248], mobileBuilding: [91, 249], drawing: 'arts' },
  鹿港老街: { desktop: [284, 254], mobile: [342, 255] },
  辜家大宅: { desktop: [400, 390], mobile: [488, 390], desktopBuilding: [400, 341], mobileBuilding: [488, 322], drawing: 'house' },
  九曲巷: { desktop: [308, 451], mobile: [357, 480] },
  摸乳巷: { desktop: [66, 505], mobile: [103, 501] },
  鹿港龍山寺: { desktop: [376, 633], mobile: [450, 615], desktopBuilding: [376, 581], mobileBuilding: [450, 541], drawing: 'longshan' },
}
export function roadTier(name) {
  if (['中山路', '民權路', '三民路'].includes(name)) return 'main'
  if (/老街|桂花巷|金盛巷|九曲巷|摸乳巷/.test(name)) return 'lane'
  return 'context'
}
export const TOWN_ROAD_LABELS = [
  { zh: '中山路', en: 'Zhongshan Rd', coordinates: [120.4343, 24.0548], angle: 57 },
  { zh: '民權路', en: 'Minquan Rd', coordinates: [120.4359, 24.057], angle: -22 },
  // Western Sanmin segment (existing way 171895992): keep the bilingual road
  // label west of Longshan's illustration instead of crossing its roof.
  { zh: '三民路', en: 'Sanmin Rd', coordinates: [120.4327451, 24.0509017], angle: 4 },
  { zh: '瑤林・埔頭街', en: 'Yaolin / Putou', coordinates: [120.4324, 24.0551], angle: 76 },
]
