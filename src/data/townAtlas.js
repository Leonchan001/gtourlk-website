// Axis-aligned editorial projection. No rotation, shear or moved road nodes.
// Longitude is compressed to keep the N–S spine legible on a narrow screen.
// Not equidistant: distances are calculated from WGS84, never from this SVG.
export const TOWN_VIEW = { desktop: [480, 850], mobile: [400, 850] }
export function townProject([lon, lat], mobile = false) {
  return [90 + (lon - 120.431) * 40000 + (mobile ? 0 : 40), 105 + (24.05937 - lat) * 65000]
}
export const TOWN_LABELS = {
  鹿港天后宮: { tier: 1, desktop: [151, 144], mobile: [110, 148], desktopBuilding: [150, 76], mobileBuilding: [110, 76], drawing: 'tianhou' },
  桂花巷藝術村: { tier: 2, desktop: [130, 371], mobile: [91, 380], drawing: 'arts' },
  鹿港老街: { tier: 1, desktop: [207, 298], mobile: [171, 289] },
  辜家大宅: { tier: 2, desktop: [376, 430], mobile: [328, 420], drawing: 'house' },
  九曲巷: { tier: 2, desktop: [298, 529], mobile: [265, 535] },
  摸乳巷: { tier: 2, desktop: [130, 609], mobile: [97, 610] },
  鹿港龍山寺: { tier: 1, desktop: [226, 712], mobile: [180, 712], desktopBuilding: [304, 718], mobileBuilding: [264, 718], drawing: 'longshan' },
}
export function roadTier(name) {
  return ['中山路', '民權路', '三民路'].includes(name) ? 'main' : 'lane'
}
// Other extracted ways verify itineraries and appear only for that duration.
export function showBaseRoad(name) {
  return roadTier(name) === 'main' || /老街|桂花巷|金盛巷|九曲巷|摸乳巷|菜園路|龍山街|文開路|民族路|館前街/.test(name)
}
export const TOWN_ROAD_LABELS = [
  { zh: '中山路', en: 'Zhongshan Rd', coordinates: [120.4343, 24.0548], angle: 72 },
  { zh: '民權路', en: 'Minquan Rd', coordinates: [120.4355, 24.0569], angle: -42 },
  { zh: '三民路', en: 'Sanmin Rd', coordinates: [120.4318, 24.0509], angle: -2 },
]
export const PUBLIC_ANCHORS = [
  { id: 'assembly-hall', coordinates: [120.43189085, 24.057610775], zh: '鹿港公會堂', en: 'Assembly Hall', icon: 'hall', source: 'https://www.lukang.gov.tw/content/index?Parser=1,7,122,56,121', locationSource: 'https://www.openstreetmap.org/way/321577542', offset: [0, 26] },
  { id: 'parking-one', coordinates: [120.432755, 24.053525], zh: '第一立體停車場', en: 'Parking No. 1', icon: 'parking', source: 'https://www.openstreetmap.org/way/322992907', offset: [-38, -24] },
  { id: 'wenkai', coordinates: [120.438029, 24.048864], zh: '文武廟・文開書院', en: 'Wenwu · Wenkai Academy', icon: 'hall', source: 'https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=105&chk=f13ee2ac-03eb-4f6d-89f4-0c6c3f825658&l=TW', offset: [-68, 30] },
]
// Local callouts for the selected extension sight; anchors never move.
export function extraLabelPosition(place, mobile = false) {
  const [x, y] = townProject(place.coordinates, mobile)
  const offsets = {
    新祖宮: [40, -20], 文武廟: [-60, 32], 興安宮: [17, 45],
    意樓: [-50, 48], 丁家大宅: [-5, -40], 和興青創基地: [18, 10],
    謝家甕牆: [32, 15], 十宜樓: [-76, -21], 玉渠宮: [-63, -10],
  }
  const [dx, dy] = offsets[place.id] || [0, 34]
  return [x + dx, y + dy]
}
