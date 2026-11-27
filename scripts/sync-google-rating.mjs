// Weekly sync of the Google rating and review count (Places API, New).
// Updates src/data/business.js and the JSON-LD in index.html and en/index.html.
// Needs GOOGLE_PLACES_API_KEY. Review excerpts stay hand-picked in src/data/reviews.js.
import fs from 'node:fs/promises'

const KEY = process.env.GOOGLE_PLACES_API_KEY
if (!KEY) throw new Error('GOOGLE_PLACES_API_KEY is not set')

const BUSINESS_FILE = 'src/data/business.js'
const HTML_FILES = ['index.html', 'en/index.html']

let business = await fs.readFile(BUSINESS_FILE, 'utf8')
const read = (field) => business.match(new RegExp(`${field}: '([^']*)'`))?.[1] ?? ''
const cid = read('googleCid')
let placeId = process.env.GOOGLE_PLACE_ID || read('googlePlaceId')

async function places(url, fieldMask, body) {
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': fieldMask,
    },
    body: body && JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Places API ${res.status}: ${await res.text()}`)
  return res.json()
}

const sameBusiness = (place) => place.googleMapsUri?.includes(`cid=${cid}`)

if (!placeId) {
  // First run: find the listing and confirm it by its Maps CID.
  const { places: found = [] } = await places(
    'https://places.googleapis.com/v1/places:searchText',
    'places.id,places.googleMapsUri',
    {
      textQuery: 'gtourlk Lukang',
      locationBias: {
        circle: { center: { latitude: 24.0658, longitude: 120.4321 }, radius: 2000 },
      },
    },
  )
  placeId = found.find(sameBusiness)?.id
  if (!placeId) throw new Error(`No search result matches cid ${cid}; set GOOGLE_PLACE_ID`)
  console.log(`Found place id ${placeId}`)
}

const place = await places(
  `https://places.googleapis.com/v1/places/${placeId}`,
  'id,rating,userRatingCount,googleMapsUri',
)
if (cid && !sameBusiness(place)) throw new Error(`Place ${placeId} is not cid ${cid}`)
const count = Number(place.userRatingCount)
const rating = Number(place.rating)
if (!(count > 0) || !(rating >= 1 && rating <= 5)) throw new Error(`Bad data: ${JSON.stringify(place)}`)
const ratingText = rating.toFixed(1)

const oldCount = Number(business.match(/reviewCount: (\d+)/)[1])
const oldRating = read('reviewRating')
const changed = oldCount !== count || oldRating !== ratingText || read('googlePlaceId') !== placeId
console.log(`Google: ${ratingText} / ${count} (site had ${oldRating} / ${oldCount})`)
if (!changed) process.exit(0)

const now = new Date()
const asOf = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`
business = business
  .replace(/reviewRating: '[^']*'/, `reviewRating: '${ratingText}'`)
  .replace(/reviewCount: \d+/, `reviewCount: ${count}`)
  .replace(/reviewsAsOf: '[^']*'/, `reviewsAsOf: '${asOf}'`)
  .replace(/googlePlaceId: '[^']*'/, `googlePlaceId: '${placeId}'`)
await fs.writeFile(BUSINESS_FILE, business)

for (const file of HTML_FILES) {
  const html = await fs.readFile(file, 'utf8')
  await fs.writeFile(
    file,
    html
      .replace(/("ratingValue":\s*)"[^"]*"/, `$1"${ratingText}"`)
      .replace(/("reviewCount":\s*)"[^"]*"/, `$1"${count}"`),
  )
}
console.log('Updated rating files')
