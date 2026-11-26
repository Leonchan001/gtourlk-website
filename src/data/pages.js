// Standalone, prerendered sight and route pages. URL slugs are stable public
// identifiers: changing one breaks shared links, so add redirects first.
import { ATLAS_STOPS } from './atlas.js'
import { MORE_PLACES } from './morePlaces.js'
import { ATLAS_STORIES } from './atlasStories.js'
import { ATLAS_PHOTOS } from './atlasPhotos.js'
import { MEDIA, MEDIA_CREDITS } from './media.js'
import { TOUR_PRICING, getTourPlans } from './tours.js'
import { EXPERIENCE_COPY } from './experienceCopy.js'

export const SITE_ORIGIN = 'https://gtourlk.com.tw'
export const BUSINESS_ID = `${SITE_ORIGIN}/#business`

export const PLACE_SLUGS = {
  鹿港天后宮: 'tianhou-temple',
  桂花巷藝術村: 'osmanthus-alley-art-village',
  鹿港老街: 'old-street',
  辜家大宅: 'koo-family-mansion',
  九曲巷: 'nine-turns-lane',
  摸乳巷: 'molu-lane',
  鹿港龍山寺: 'longshan-temple',
  興安宮: 'xingan-temple',
  意樓: 'yi-house',
  丁家大宅: 'ding-family-mansion',
  和興青創基地: 'hexing-creative-hub',
  謝家甕牆: 'xie-family-urn-wall',
  十宜樓: 'shiyi-house',
  文武廟: 'wenwu-temple',
  新祖宮: 'xinzu-temple',
  玉渠宮: 'yuqu-temple',
}

const prefix = (lang) => (lang === 'en' ? '/en' : '')
export const homePath = (lang) => `${prefix(lang)}/`
export const placesPath = (lang) => `${prefix(lang)}/places/`
export const placePath = (lang, id) =>
  `${prefix(lang)}/places/${PLACE_SLUGS[id]}/`
export const tourPath = (lang, minutes) =>
  `${prefix(lang)}/tours/${minutes}-minutes/`
export const absolute = (path) => `${SITE_ORIGIN}${path}`

function placePhoto(id) {
  const photo = ATLAS_PHOTOS[id]
  if (photo)
    return {
      src: photo.src,
      width: photo.width,
      height: photo.height,
      position: photo.position,
      alt: photo.alt,
      credit: {
        source: photo.source,
        author: photo.author,
        license: photo.license,
        licenseUrl: photo.licenseUrl,
      },
    }
  const key = ATLAS_STORIES[id]?.photoKey
  const media = key && MEDIA[key]
  if (!media) return null
  const credit = MEDIA_CREDITS[key]
  return {
    src: media.src,
    width: media.width,
    height: media.height,
    position: media.position,
    alt: media.alt,
    sources: media.sources,
    credit: credit && {
      source: credit.source,
      licenseUrl: credit.license,
      text: { zh: credit.zh, en: credit.en },
    },
  }
}

/** Every physical sight, in the order the homepage atlas introduces them. */
export const PLACES = [...ATLAS_STOPS, ...MORE_PLACES]
  .filter((stop) => stop.coordinates && PLACE_SLUGS[stop.id])
  .map((stop) => ({
    id: stop.id,
    slug: PLACE_SLUGS[stop.id],
    kind: stop.kind,
    coordinates: stop.coordinates,
    source: stop.source,
    featured: ATLAS_STOPS.includes(stop),
    zh: { ...stop.zh, ...ATLAS_STORIES[stop.id]?.zh },
    en: { ...stop.en, ...ATLAS_STORIES[stop.id]?.en },
    photo: placePhoto(stop.id),
  }))

export const placeById = (id) => PLACES.find((place) => place.id === id)

export function toursIncluding(id, lang = 'zh') {
  const zhPlans = getTourPlans('zh')
  return getTourPlans(lang).filter((_, i) => zhPlans[i].stops.includes(id))
}

function distance([lon1, lat1], [lon2, lat2]) {
  const rad = Math.PI / 180
  const x = (lon2 - lon1) * rad * Math.cos(((lat1 + lat2) / 2) * rad)
  const y = (lat2 - lat1) * rad
  return Math.sqrt(x * x + y * y) * 6371000
}
export function nearbyPlaces(id, count = 3) {
  const origin = placeById(id).coordinates
  return PLACES.filter((place) => place.id !== id)
    .map((place) => ({ place, meters: distance(origin, place.coordinates) }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, count)
}

/** Tour stops keep the operator's list; physical sights link to their pages. */
export function tourStops(minutes, lang = 'zh') {
  const zhStops = getTourPlans('zh').find((p) => p.minutes === minutes).stops
  const labels = getTourPlans(lang).find((p) => p.minutes === minutes).stops
  return zhStops.map((id, i) => ({
    id,
    label: labels[i],
    place: placeById(id) || null,
  }))
}

export function tourPrices(minutes) {
  const hours = minutes / 60
  return {
    pair: TOUR_PRICING.oneToTwoHourly * hours,
    perPerson: TOUR_PRICING.threePlusHourlyPerPerson * hours,
  }
}

export function tourPhoto(plan) {
  const media = Object.values(MEDIA).find((m) => m?.src === plan.photo)
  return media
    ? { ...media, alt: { zh: media.alt.zh, en: media.alt.en } }
    : null
}

export const PAGE_COPY = {
  zh: {
    home: '首頁',
    places: '鹿港景點',
    routes: '時間與路線',
    book: 'LINE 預約',
    plan: '到首頁安排行程',
    switchLabel: 'EN',
    switchLang: 'en',
    story: '景點故事',
    history: '歷史沿革',
    highlights: '看點',
    tips: '參觀提醒',
    sources: '資料來源：',
    official: '官方最新資訊',
    inTours: '這個景點在哪些路線',
    notInTours:
      '這個景點不在三條參考路線中，預約時告訴導覽員，就能評估加入你的行程。',
    nearby: '周邊景點',
    walk: (m) => `直線約 ${Math.round(m / 10) * 10} 公尺`,
    source: '景點資料',
    photo: '照片：',
    license: '授權：',
    bookTour: '預約這條路線',
    ctaTitle: (name) => `想去${name}？`,
    ctaBody:
      '導鹿的導覽員兼任司機，與你同車，依你的時間與想看的地方安排路線。',
    tourStops: '參考景點',
    fit: '適合：',
    price: '導覽費用',
    pair: (n) => `1–2 人：每車 NT$${n}`,
    perPerson: (n) => `3 人以上：每人 NT$${n}`,
    lineDiscount: '透過官方 LINE 預約享導覽費 95 折',
    priceFrom: `費用：1–2 人每車每小時 NT$${TOUR_PRICING.oneToTwoHourly}；3 人以上每人每小時 NT$${TOUR_PRICING.threePlusHourlyPerPerson}，60 分鐘起。`,
    lineHello: '你好，我想預約鹿港導覽。',
    linePlace: (name) => `你好，我想預約鹿港導覽，想去${name}。`,
    lineTour: (t) => `你好，我想預約 ${t.minutes} 分鐘的「${t.title}」路線。`,
    note: EXPERIENCE_COPY.zh.route.note,
    otherTours: '其他時長',
    allPlaces: '全部景點',
    featuredPlaces: '參考路線中的景點',
    morePlaces: '其他景點・可討論安排',
    placesTitle: '鹿港景點導覽｜古蹟、廟宇與巷弄・導鹿 GtourLK',
    placesHeading: '鹿港景點',
    placesIntro:
      '從天后宮、龍山寺到九曲巷，先讀懂每個地方的故事，再把最想看的地方告訴導鹿。',
    placesDescription:
      '鹿港景點介紹：鹿港天后宮、鹿港龍山寺、鹿港老街、九曲巷、摸乳巷、辜家大宅等 16 個古蹟、廟宇與巷弄，導鹿四輪電動車導覽可依你的時間安排走訪。',
    placeTitle: (p) => `${p.name}｜鹿港景點介紹・導鹿 GtourLK`,
    placeDescription: (p) =>
      `${p.name}：${p.highlight}。${p.detail}導鹿 GtourLK 四輪電動車導覽可依你的時間安排走訪。`,
    tourTitle: (t) => `鹿港 ${t.minutes} 分鐘導覽・${t.title}｜導鹿 GtourLK`,
    tourHeading: (t) => `${t.minutes} 分鐘・${t.title}`,
    tourDescription: (t, stops) =>
      `${t.tagline}鹿港 ${t.minutes} 分鐘四輪電動車導覽，參考景點：${stops.join('、')}。1–2 人每車 NT$${tourPrices(t.minutes).pair}，3 人以上每人 NT$${tourPrices(t.minutes).perPerson}。`,
    minutes: (m) => `${m} 分鐘`,
    skip: '跳到主要內容',
    breadcrumb: '目前位置',
    footerNote: '導鹿・一群熱愛鹿港的人，陪你穿過巷弄，讀懂這座老城。',
  },
  en: {
    home: 'Home',
    places: 'Lukang sights',
    routes: 'Routes',
    book: 'Book on LINE',
    plan: 'Plan your visit',
    switchLabel: '中文',
    switchLang: 'zh-Hant',
    story: 'The story',
    history: 'History',
    highlights: 'What to look for',
    tips: 'Visiting tips',
    sources: 'Sources: ',
    official: 'Latest from the venue',
    inTours: 'Included in these routes',
    notInTours:
      'This sight is not on the three suggested routes. Mention it when you book and your guide can work it into your visit.',
    nearby: 'Nearby',
    walk: (m) => `About ${Math.round(m / 10) * 10} m away`,
    source: 'Sight source',
    photo: 'Photo: ',
    license: 'License: ',
    bookTour: 'Book this route',
    ctaTitle: (name) => `Visit ${name} with a local guide`,
    ctaBody:
      'Your GtourLK guide drives and stays with your group, shaping the route around your time and the places you want to see.',
    tourStops: 'Suggested sights',
    fit: 'Best for: ',
    price: 'Pricing',
    pair: (n) => `1–2 guests: NT$${n} per vehicle`,
    perPerson: (n) => `3+ guests: NT$${n} per person`,
    lineDiscount: '5% off the tour fee when you book on LINE',
    priceFrom: `Price: 1–2 guests NT$${TOUR_PRICING.oneToTwoHourly} per vehicle per hour; 3+ guests NT$${TOUR_PRICING.threePlusHourlyPerPerson} per person per hour. 60 minutes minimum.`,
    lineHello: 'Hi, I would like to book a Lukang tour.',
    linePlace: (name) => `Hi, I would like to book a Lukang tour that includes ${name}.`,
    lineTour: (t) => `Hi, I would like to book the ${t.minutes}-minute "${t.title}" route.`,
    note: EXPERIENCE_COPY.en.route.note,
    otherTours: 'Other durations',
    allPlaces: 'All sights',
    featuredPlaces: 'On the suggested routes',
    morePlaces: 'More places to explore',
    placesTitle: 'Lukang Sights: Temples, Lanes & Historic Houses | GtourLK',
    placesHeading: 'Lukang sights',
    placesIntro:
      'From Tianhou and Longshan temples to Nine-Turns Lane, read the story of each place, then tell us what you want to see.',
    placesDescription:
      'A guide to 16 Lukang sights, including Tianhou Temple, Longshan Temple, Old Street, Nine-Turns Lane, Molu Lane and the Koo Family Mansion. Visit them on a private GtourLK electric vehicle tour.',
    placeTitle: (p) => `${p.name}, Lukang | GtourLK Private Tours`,
    placeDescription: (p) =>
      `${p.name} in Lukang: ${p.highlight.toLowerCase()}. ${p.detail} Visit on a private GtourLK electric vehicle tour.`,
    tourTitle: (t) => `${t.minutes}-Minute Lukang Tour: ${t.title} | GtourLK`,
    tourHeading: (t) => `${t.minutes} minutes · ${t.title}`,
    tourDescription: (t, stops) =>
      `${t.tagline} A private ${t.minutes}-minute electric vehicle tour of Lukang. Suggested sights: ${stops.join(', ')}. From NT$${tourPrices(t.minutes).pair} per vehicle for 1–2 guests.`,
    minutes: (m) => `${m} minutes`,
    skip: 'Skip to content',
    breadcrumb: 'Breadcrumb',
    footerNote:
      'Local people, quiet lanes, and a town full of stories. See Lukang with GtourLK.',
  },
}

/** Every generated route, with the data modules that determine its content. */
export function listPages() {
  const shared = ['src/data/pages.js', 'src/pages', 'src/landing.css']
  const placeSources = [
    ...shared,
    'src/data/atlas.js',
    'src/data/morePlaces.js',
    'src/data/atlasStories.js',
    'src/data/atlasPhotos.js',
    'src/data/media.js',
    'src/data/tours.js',
  ]
  const tourSources = [
    ...shared,
    'src/data/tours.js',
    'src/data/atlas.js',
    'src/data/atlasStories.js',
    'src/data/media.js',
    'src/data/experienceCopy.js',
  ]
  const pages = []
  for (const lang of ['zh', 'en']) {
    pages.push({ type: 'places', lang, path: placesPath(lang), sources: placeSources })
    for (const place of PLACES)
      pages.push({ type: 'place', lang, id: place.id, path: placePath(lang, place.id), sources: placeSources })
    for (const plan of getTourPlans(lang))
      pages.push({ type: 'tour', lang, minutes: plan.minutes, path: tourPath(lang, plan.minutes), sources: tourSources })
  }
  return pages
}
