export const TOUR_PLANS = [
  {
    no: '01',
    minutes: 60,
    duration: '60 分鐘',
    durationLabel: '精華',
    title: '鹿港精華',
    en: 'Lukang Old Street Tour',
    photo: './photos/lukang-old-street-night.jpg',
    photoAlt: '鹿港老街小巷夜景，紅燈籠串連紅磚老屋',
    coverSub: 'Old Street',
    tagline: '第一次來鹿港，先看最有代表性的風景。',
    fit: '時間有限、第一次造訪',
    stops: ['鹿港天后宮', '鹿港老街', '桂花巷藝術村'],
  },
  {
    no: '02',
    minutes: 90,
    duration: '90 分鐘',
    durationLabel: '熱門',
    title: '文化深遊',
    en: 'Heritage Culture Tour',
    featured: true,
    photo: './photos/lukang-rooftops-aerial.jpg',
    photoAlt: '鹿港老街紅瓦屋頂空拍俯瞰，旅客穿梭於九曲巷弄',
    coverSub: 'Heritage',
    tagline: '多一點時間，走進寺廟與巷弄的故事。',
    fit: '想兼顧經典景點與在地故事',
    stops: ['鹿港天后宮', '鹿港老街', '摸乳巷', '九曲巷', '鹿港龍山寺'],
  },
  {
    no: '03',
    minutes: 150,
    duration: '150 分鐘',
    durationLabel: '全覽',
    title: '鹿港全覽',
    en: 'Lukang Grand Tour',
    photo: './photos/lukang-koo-house.jpg',
    photoAlt: '鹿港辜家大宅 — 巴洛克建築，米其林綠色指南推薦景點',
    coverSub: 'Grand Tour',
    tagline: '從北鹿港到南鹿港，從容看得更完整。',
    fit: '想深度走讀，並安排米其林綠色指南推薦景點',
    stops: ['鹿港天后宮', '鹿港龍山寺', '鹿港老街', '桂花巷藝術村', '辜家大宅', '南北鹿港經典古蹟'],
  },
]

export const TOUR_DURATIONS = TOUR_PLANS.map(({ minutes, durationLabel: label }) => ({ minutes, label }))
export const TOUR_DURATION_PROMPT = TOUR_PLANS.map(plan => plan.minutes).join('／')

export const TOUR_PRICING = {
  minimumMinutes: 60,
  oneToTwoHourly: 600,
  threePlusHourlyPerPerson: 200,
  guestsPerVehicle: 5,
  lineDiscountRate: 0.95,
}
