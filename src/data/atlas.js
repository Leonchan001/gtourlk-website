import { getTourPlans } from './tours.js'

// WGS84 representative locations published by Changhua County / Taiwan Tourism
// Administration. Labels are displaced for legibility; geographic anchors are not.
// See ATLAS_SOURCES.md for provenance, projection and cartographic limitations.
const source = (id) =>
  `https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_${id}`
export const ATLAS_STOPS = [
  {
    id: '鹿港天后宮',
    coordinates: [120.4315, 24.05937],
    label: [174, 70],
    kind: 'temple',
    source: source('000091'),
    zh: {
      short: '天后宮',
      name: '鹿港天后宮',
      detail: '從媽祖信仰與廟宇工藝，讀懂北鹿港的生活。',
    },
    en: {
      short: 'Tianhou',
      name: 'Tianhou Temple',
      detail: 'Mazu worship and temple craft in northern Lukang.',
    },
  },
  {
    id: '桂花巷藝術村',
    coordinates: [120.4319, 24.05585],
    label: [90, 217],
    kind: 'arts',
    source: source('000202'),
    zh: {
      short: '桂花巷',
      name: '桂花巷藝術村',
      detail: '日式木造宿舍群裡，遇見延續至今的創作日常。',
    },
    en: {
      short: 'Osmanthus',
      name: 'Osmanthus Alley Art Village',
      detail: 'Artists at work in Japanese-era wooden residences.',
    },
  },
  {
    id: '鹿港老街',
    coordinates: [120.4328, 24.05592],
    label: [266, 179],
    kind: 'lane',
    source: source('000139'),
    zh: {
      short: '老街',
      name: '鹿港老街',
      detail: '沿著瑤林街、埔頭街，讀街屋，也讀昔日商港的故事。',
    },
    en: {
      short: 'Old Street',
      name: 'Lukang Old Street',
      detail: 'Yaolin and Putou streets recall Lukang’s trading-port past.',
    },
  },
  {
    id: '辜家大宅',
    coordinates: [120.4365, 24.05388],
    label: [494, 247],
    kind: 'house',
    source: source('000137'),
    zh: {
      short: '辜家大宅',
      name: '辜家大宅・民俗文物館',
      detail: '從辜家宅邸的洋樓與閩式建築，看見鹿港不同的時代。',
    },
    en: {
      short: 'Koo House',
      name: 'Koo Family Mansion',
      detail: 'Western and Fujian styles meet at the Folk Arts Museum.',
    },
  },
  {
    id: '九曲巷',
    coordinates: [120.435, 24.05346],
    label: [428, 354],
    kind: 'lane',
    source: source('000130'),
    zh: {
      short: '九曲巷',
      name: '九曲巷',
      detail: '走進金盛巷的曲折街廓，感受老城巷弄的尺度。',
    },
    en: {
      short: 'Nine-Turns',
      name: 'Nine-Turns Lane',
      detail: 'The winding passages of Jinsheng Lane, on a human scale.',
    },
  },
  {
    id: '摸乳巷',
    coordinates: [120.4323, 24.0517],
    label: [120, 370],
    kind: 'lane',
    source: source('000134'),
    zh: {
      short: '摸乳巷',
      name: '摸乳巷',
      detail: '菜園路旁的狹窄通道，藏著街屋之間的生活記憶。',
    },
    en: {
      short: 'Molu Lane',
      name: 'Molu Lane',
      detail: 'A narrow passage between houses beside Caiyuan Road.',
    },
  },
  {
    id: '鹿港龍山寺',
    coordinates: [120.4349, 24.05038],
    label: [310, 462],
    kind: 'temple',
    source: source('000079'),
    zh: {
      short: '龍山寺',
      name: '鹿港龍山寺',
      detail: '在南鹿港的龍山寺，慢慢看木作、藻井與建築細節。',
    },
    en: {
      short: 'Longshan',
      name: 'Longshan Temple',
      detail: 'Timber craft and a caisson ceiling in southern Lukang.',
    },
  },
  {
    id: '南北鹿港經典古蹟',
    coordinates: null,
    kind: 'area',
    zh: {
      short: '南北古蹟',
      name: '南北鹿港・從容串連',
      detail: '這是探索範圍，不是單一景點。把想看的地方交給導覽員串連。',
    },
    en: {
      short: 'North & south',
      name: 'Across north and south Lukang',
      detail: 'An area, not a stop. Your guide connects your chosen sights.',
    },
  },
]

// Axis-aligned editorial projection. North stays up, east stays right; east/west
// is expanded relative to north/south to make the narrow town readable on phones.
export function project([longitude, latitude]) {
  return [
    Number((70 + (longitude - 120.431) * 80000).toFixed(1)),
    Number((45 + (24.0598 - latitude) * 43000).toFixed(1)),
  ]
}
export function atlasStops(minutes) {
  const ids =
    getTourPlans('zh').find((plan) => plan.minutes === minutes)?.stops || []
  return ATLAS_STOPS.filter((stop) => ids.includes(stop.id))
}
export function atlasSelection(minutes, selected) {
  const stops = atlasStops(minutes)
  return stops.find((stop) => stop.id === selected) || stops[0]
}
// Connections describe the breadth of a visit, NOT roads or a promised stop order.
export const ATLAS_CONNECTIONS = {
  60: ['鹿港天后宮', '桂花巷藝術村', '鹿港老街'],
  90: ['鹿港天后宮', '鹿港老街', '摸乳巷', '九曲巷', '鹿港龍山寺'],
  150: ['鹿港天后宮', '桂花巷藝術村', '鹿港老街', '辜家大宅', '鹿港龍山寺'],
}
export function atlasPath(minutes) {
  return ATLAS_CONNECTIONS[minutes]
    .map(
      (id, index) =>
        `${index ? 'L' : 'M'}${project(ATLAS_STOPS.find((stop) => stop.id === id).coordinates).join(',')}`,
    )
    .join(' ')
}

export const ATLAS_COPY = {
  zh: {
    north: '北鹿港',
    south: '南鹿港',
    hint: '點選地圖或下方景點',
    included: '本時長參考景點',
    outside: '範圍外景點・可詢問客製',
    area: '探索範圍',
    note: '依真實座標編繪・非等比例・連線非行車路線',
    sources: '地圖資料與閱讀方式',
    sourceNote:
      '景點位置：彰化縣政府／交通部觀光署。街道底圖：OpenStreetMap contributors（ODbL）。北上南下、東右西左；標籤引線指向座標。老街等線性景點以代表位置標示。磚紅連線僅表達探索範圍，不供導航，也不代表乘車可進入每條巷弄。',
    viewSource: '景點資料',
    captions: {
      60: '北鹿港・老街與信仰',
      90: '延伸南鹿港・寺廟與巷弄',
      150: '南北串連・宅邸與老城',
    },
  },
  en: {
    north: 'NORTH LUKANG',
    south: 'SOUTH LUKANG',
    hint: 'Tap a place on the atlas or below',
    included: 'Suggested for this duration',
    outside: 'Beyond this selection · ask your guide',
    area: 'Area to explore',
    note: 'Real locations · not to scale · connections are not roads',
    sources: 'Map sources & how to read',
    sourceNote:
      'Sight locations: Changhua County / Taiwan Tourism Administration. Streets: OpenStreetMap contributors (ODbL). North is up, east is right. Leaders connect labels to geographic anchors. Linear sights such as Old Street use representative points. Brick-coloured connections show the scope of a visit, not navigation, driving access or a promised itinerary.',
    viewSource: 'Sight source',
    captions: {
      60: 'Northern Lukang · old streets & faith',
      90: 'Further south · temples & lanes',
      150: 'North to south · mansions & the old town',
    },
  },
}
