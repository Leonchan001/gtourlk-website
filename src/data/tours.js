const TOUR_DEFINITIONS = [
  {
    no: '01',
    minutes: 60,
    photo: '/photos/lukang-old-street-night.jpg',
    coverSub: 'Old Street',
    zh: {
      duration: '60 分鐘',
      durationLabel: '精華',
      title: '鹿港精華',
      coverTitle: 'Lukang Old Street Tour',
      photoAlt: '鹿港老街小巷夜景，紅燈籠串連紅磚老屋',
      tagline: '第一次來鹿港，先看最有代表性的風景。',
      fit: '時間有限、第一次造訪',
      stops: ['鹿港天后宮', '鹿港老街', '桂花巷藝術村'],
    },
    en: {
      duration: '60 minutes',
      durationLabel: 'Highlights',
      title: 'Lukang Highlights',
      coverTitle: 'Lukang Highlights Tour',
      photoAlt: 'Red lanterns glowing above a historic lane in Lukang Old Street',
      tagline: 'A concise introduction to Lukang’s signature sights.',
      fit: 'First-time visitors and travelers with limited time',
      stops: ['Lukang Tianhou Temple', 'Lukang Old Street', 'Osmanthus Alley Art Village'],
    },
  },
  {
    no: '02',
    minutes: 90,
    featured: true,
    photo: '/photos/lukang-rooftops-aerial.jpg',
    coverSub: 'Heritage',
    zh: {
      duration: '90 分鐘',
      durationLabel: '經典',
      title: '文化深遊',
      coverTitle: 'Heritage Culture Tour',
      photoAlt: '鹿港老街紅瓦屋頂空拍俯瞰，旅客穿梭於九曲巷弄',
      tagline: '多一點時間，走進寺廟與巷弄的故事。',
      fit: '想兼顧經典景點與在地故事',
      stops: ['鹿港天后宮', '鹿港老街', '摸乳巷', '九曲巷', '鹿港龍山寺'],
      route: {
        path: ['天后宮停車場旁上車', '日茂行', '鹿港天后宮', '新祖宮', '鹿港公會堂', '桂花巷藝術村', '摸乳巷', '鹿港龍山寺', '興安宮・九曲巷・意樓', '天后宮廣場下車'],
        hopOff: ['日茂行或新祖宮', '桂花巷藝術村', '摸乳巷', '鹿港龍山寺'],
        notes: ['週一日茂行休館，改在新祖宮下車導覽。'],
      },
    },
    en: {
      duration: '90 minutes',
      durationLabel: 'Classic',
      title: 'Heritage Immersion',
      coverTitle: 'Lukang Heritage Tour',
      photoAlt: 'An aerial view of Lukang’s red-tiled roofs and visitors winding through its historic lanes',
      tagline: 'More time for temple stories and historic lanes.',
      fit: 'Travelers who want both landmark sights and local stories',
      stops: ['Lukang Tianhou Temple', 'Lukang Old Street', 'Molu Lane', 'Nine-Turns Lane', 'Lukang Longshan Temple'],
      route: {
        path: ['Pick-up beside the Tianhou Temple car park', 'Rimao Hang', 'Lukang Tianhou Temple', 'Xinzu Temple', 'Lukang Public Hall', 'Osmanthus Alley Art Village', 'Molu Lane', 'Lukang Longshan Temple', 'Xing’an Temple · Nine-Turns Lane · Yi House', 'Drop-off at Tianhou Temple square'],
        hopOff: ['Rimao Hang or Xinzu Temple', 'Osmanthus Alley Art Village', 'Molu Lane', 'Lukang Longshan Temple'],
        notes: ['Rimao Hang is closed on Mondays; we stop at Xinzu Temple instead.'],
      },
    },
  },
  {
    no: '03',
    minutes: 150,
    photo: '/photos/lukang-koo-house.jpg',
    coverSub: 'Grand Tour',
    zh: {
      duration: '150 分鐘',
      durationLabel: '全覽',
      title: '鹿港全覽',
      coverTitle: 'Lukang Grand Tour',
      photoAlt: '鹿港辜家大宅 — 巴洛克建築，米其林綠色指南推薦景點',
      tagline: '從北鹿港到南鹿港，從容看得更完整。',
      fit: '想深度走讀，並安排米其林綠色指南推薦景點',
      stops: ['鹿港天后宮', '鹿港龍山寺', '鹿港老街', '桂花巷藝術村', '辜家大宅', '南北鹿港經典古蹟'],
      route: {
        path: ['天后宮停車場旁上車', '日茂行', '鹿港天后宮', '新祖宮', '鹿港公會堂', '桂花巷藝術村', '摸乳巷', '鹿港龍山寺', '興安宮・九曲巷・意樓', '丁家大宅', '和興青創基地', '謝家甕牆', '鹿港民俗文物館', '天后宮廣場下車'],
        hopOff: ['日茂行或新祖宮', '桂花巷藝術村', '摸乳巷', '鹿港龍山寺', '九曲巷（意樓、十宜樓）', '丁家大宅', '鹿港民俗文物館（入館參觀）'],
        notes: [
          '民俗文物館需購票入館，門票 NT$70／人，由旅客自行購買，不含在導覽費內。',
          '週一休館：日茂行、丁家大宅、民俗文物館；週二休館：丁家大宅。',
        ],
      },
    },
    en: {
      duration: '150 minutes',
      durationLabel: 'Grand Tour',
      title: 'Complete Lukang',
      coverTitle: 'Lukang Grand Tour',
      photoAlt: 'The Baroque-style Lukang Koo Family Mansion, a Michelin Green Guide–recommended sight',
      tagline: 'Take your time exploring both north and south Lukang.',
      fit: 'Travelers seeking an in-depth visit including Michelin Green Guide–recommended sights',
      stops: ['Lukang Tianhou Temple', 'Lukang Longshan Temple', 'Lukang Old Street', 'Osmanthus Alley Art Village', 'Koo Family Mansion', 'Historic sights across north and south Lukang'],
      route: {
        path: ['Pick-up beside the Tianhou Temple car park', 'Rimao Hang', 'Lukang Tianhou Temple', 'Xinzu Temple', 'Lukang Public Hall', 'Osmanthus Alley Art Village', 'Molu Lane', 'Lukang Longshan Temple', 'Xing’an Temple · Nine-Turns Lane · Yi House', 'Ding Family Mansion', 'Hexing Creative Hub', 'Xie Family Urn Wall', 'Lukang Folk Arts Museum', 'Drop-off at Tianhou Temple square'],
        hopOff: ['Rimao Hang or Xinzu Temple', 'Osmanthus Alley Art Village', 'Molu Lane', 'Lukang Longshan Temple', 'Nine-Turns Lane (Yi House, Shiyi House)', 'Ding Family Mansion', 'Lukang Folk Arts Museum (with a visit inside)'],
        notes: [
          'The Folk Arts Museum charges admission of NT$70 per person, paid by guests and not included in the tour fee.',
          'Closed on Mondays: Rimao Hang, Ding Family Mansion and the Folk Arts Museum. Closed on Tuesdays: Ding Family Mansion.',
        ],
      },
    },
  },
]

function normalizeLanguage(lang) {
  return lang === 'en' ? 'en' : 'zh'
}

const LOCALIZED_TOUR_PLANS = {
  zh: TOUR_DEFINITIONS.map(({ zh, en, ...shared }) => ({
    ...shared,
    ...zh,
    // Kept for compatibility with older callers that used `en` as the cover title.
    en: zh.coverTitle,
  })),
  en: TOUR_DEFINITIONS.map(({ zh, en, ...shared }) => ({
    ...shared,
    ...en,
    // Kept for compatibility with older callers that used `en` as the cover title.
    en: en.coverTitle,
  })),
}

export function getTourPlans(lang = 'zh') {
  return LOCALIZED_TOUR_PLANS[normalizeLanguage(lang)]
}

export function getTourDurations(lang = 'zh') {
  return getTourPlans(lang).map(({ minutes, durationLabel: label }) => ({ minutes, label }))
}

export function getTourDurationPrompt(lang = 'zh') {
  const separator = normalizeLanguage(lang) === 'en' ? ' / ' : '／'
  return getTourPlans(lang).map(plan => plan.minutes).join(separator)
}

// Chinese aliases keep existing integrations working while they migrate to the
// locale-aware helpers above.
export const TOUR_PLANS = getTourPlans('zh')
export const TOUR_DURATIONS = getTourDurations('zh')
export const TOUR_DURATION_PROMPT = getTourDurationPrompt('zh')

export const TOUR_PRICING = {
  minimumMinutes: 60,
  oneToTwoHourly: 600,
  threePlusHourlyPerPerson: 200,
  guestsPerVehicle: 5,
  lineDiscountRate: 0.95,
}
