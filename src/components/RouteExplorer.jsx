import { useEffect, useRef, useState } from 'react'
import { getTourPlans } from '../data/tours'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { ATLAS_STOPS } from '../data/atlas'
import { MORE_PLACES } from '../data/morePlaces'
import { ATLAS_STORIES } from '../data/atlasStories'
import { ATLAS_PHOTOS } from '../data/atlasPhotos'
import { atlasSources } from '../data/atlasSources'
import { ATLAS_ITINERARIES } from '../data/atlasItineraries'
import { MEDIA, MEDIA_CREDITS } from '../data/media'
import { placePath, placesPath } from '../data/pages'
import TownMap, { MAP_PLACES } from './TownMap'
import LandmarkDrawing from './LandmarkDrawing'
import { useLanguage } from '../i18n'
import { SITE_COPY } from '../data/siteCopy'
import './RouteExplorer.css'

const PLACES = [...ATLAS_STOPS, ...MORE_PLACES]
const DRAWING = { 鹿港天后宮: 'tianhou', 鹿港龍山寺: 'longshan', 辜家大宅: 'house', 桂花巷藝術村: 'arts' }
const UI = {
  zh: {
    overview: { 60: '從北鹿港開始，認識天后宮、老街與桂花巷。', 90: '把時間留給廟宇與巷弄，從老街讀到龍山寺。', 150: '為宅邸、廟宇與老街多留一些時間，從容認識南北鹿港。' },
    total: (km, m) => `全程步行約 ${m.toLocaleString('en')} 公尺，不含停留。`,
    walk: (m, a, b) => `步行約 ${m} 公尺・${a}–${b} 分鐘`,
    others: '地圖上的其他景點', all: '全部 16 處景點', outside: '不在這條路線上，可與導覽員討論',
    more: '看完整介紹', cta: minutes => `詢問 ${minutes} 分鐘行程`, ctaSub: '下一步填寫日期與人數，由導鹿確認安排。',
    note: '路線為步行示意，不是車行路線或固定停靠；實際行程依需求、上下車地點、路況與停留時間安排。地圖街道依 OpenStreetMap 繪製，上北下南、東西南北等比例。',
    license: '照片授權',
  },
  en: {
    overview: { 60: 'Begin in northern Lukang with Tianhou, the old streets and Osmanthus Alley.', 90: 'Make time for temples and historic lanes, from the old streets to Longshan.', 150: 'Allow more time for mansions, temples and old streets across northern and southern Lukang.' },
    total: (km) => `About ${km} km on foot in total, excluding time at each place.`,
    walk: (m, a, b) => `About ${m} m on foot · ${a}–${b} min`,
    others: 'Also on the map', all: 'All 16 places', outside: 'Not on this route; ask your guide about adding it',
    more: 'Read the full guide', cta: minutes => `Enquire about ${minutes} minutes`, ctaSub: 'Next, add your date and group size. Your guide will confirm the arrangements.',
    note: 'The line shows an example walk, not a vehicle route or guaranteed stops. Your guide adapts the visit to your interests, pickup point, traffic and time at each place. Streets drawn from OpenStreetMap, north up, true to scale.',
    license: 'Photo license',
  },
}

function photoFor(place) {
  const photo = ATLAS_PHOTOS[place.id]
  if (photo) return { sources: atlasSources(photo.src, photo.width), src: photo.src, width: photo.width, height: photo.height, position: photo.position, alt: photo.alt, source: photo.source, credit: `${photo.author}${photo.year ? ` (${photo.year})` : ''}`, license: photo.license, licenseUrl: photo.licenseUrl }
  const key = ATLAS_STORIES[place.id]?.photoKey
  const media = key && MEDIA[key]
  const credit = key && MEDIA_CREDITS[key]
  return media ? { sources: media.sources, src: media.src, width: media.width, height: media.height, position: media.position, alt: media.alt, source: credit?.source, creditByLang: credit, licenseUrl: credit?.license } : null
}

function Visual({ place, lang, large = false }) {
  const [failed, setFailed] = useState(false)
  const photo = photoFor(place)
  if (!photo || failed) return <span className="route-stop-visual is-drawing" aria-hidden="true"><LandmarkDrawing kind={DRAWING[place.id] || 'lane'} /></span>
  return (
    <figure className="route-stop-visual">
      <picture>
        {photo.sources && <>
          <source type="image/avif" srcSet={photo.sources.avif} sizes={large ? '(min-width: 900px) 40vw, 90vw' : '84px'} />
          <source type="image/webp" srcSet={photo.sources.webp} sizes={large ? '(min-width: 900px) 40vw, 90vw' : '84px'} />
        </>}
        <img src={photo.src} alt={large ? photo.alt?.[lang] || place[lang].name : ''} width={photo.width} height={photo.height} loading="lazy" decoding="async" style={{ objectPosition: photo.position || 'center' }} onError={() => setFailed(true)} />
      </picture>
      {large && photo.source && <figcaption><a href={photo.source} target="_blank" rel="noreferrer">{photo.creditByLang ? photo.creditByLang[lang] : `${place[lang].name} · ${photo.credit}`}</a>{photo.licenseUrl && <> · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license || UI[lang].license}</a></>}</figcaption>}
    </figure>
  )
}

function Story({ place, lang }) {
  const story = ATLAS_STORIES[place.id]
  return (
    <div className="route-stop-story">
      <Visual place={place} lang={lang} large />
      <p>{story?.[lang].story || place[lang].detail}</p>
      <a href={placePath(lang, place.id)}>{UI[lang].more}<span aria-hidden="true"> →</span></a>
    </div>
  )
}

export default function RouteExplorer({ trip, updateTrip, onPlan }) {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].route
  const ui = UI[lang]
  const plans = getTourPlans(lang)
  const plan = plans.find(item => item.minutes === trip.minutes) || plans[1]
  const itinerary = ATLAS_ITINERARIES[plan.minutes] || ATLAS_ITINERARIES[90]
  const [selectedId, setSelectedId] = useState(itinerary.order[0])
  const tabs = useRef([])
  useEffect(() => { setSelectedId(itinerary.order[0]) }, [plan.minutes])
  const stops = itinerary.order.map(id => PLACES.find(place => place.id === id))
  const others = MAP_PLACES.filter(place => !itinerary.order.includes(place.id))
  const selected = PLACES.find(place => place.id === selectedId)
  const offRoute = selected && !itinerary.order.includes(selected.id)
  const metres = itinerary.legs.reduce((sum, leg) => sum + leg.meters, 0)

  function selectDuration(index) { updateTrip({ minutes: plans[index].minutes }) }
  function keySelect(event, index) {
    const last = plans.length - 1
    const next = event.key === 'ArrowRight' ? (index + 1) % plans.length : event.key === 'ArrowLeft' ? (index + last) % plans.length : event.key === 'Home' ? 0 : event.key === 'End' ? last : null
    if (next === null) return
    event.preventDefault()
    selectDuration(next)
    tabs.current[next]?.focus()
  }
  function toggle(id) { setSelectedId(previous => previous === id ? null : id) }

  return (
    <section id="routes" className="route-section section-space route-atlas" aria-labelledby="route-title">
      <div className="page-width">
        <header className="section-heading">
          <p className="eyebrow">{SITE_COPY[lang].sections.routes}</p>
          <h2 id="route-title">{copy.title.map(line => <span key={line}>{line}</span>)}</h2>
          <p className="body-copy">{lang === 'zh' ? '選一段時間，從地圖認識鹿港的廟宇、老屋與巷弄。' : 'Choose your time, then discover Lukang’s temples, old houses and lanes.'}</p>
        </header>
        <div className="route-tabs" role="tablist" aria-label={copy.label}>
          {plans.map((item, index) => <button key={item.minutes} type="button" role="tab" id={`route-tab-${item.minutes}`} ref={el => { tabs.current[index] = el }} aria-selected={item.minutes === plan.minutes} aria-controls="route-panel" tabIndex={item.minutes === plan.minutes ? 0 : -1} onClick={() => selectDuration(index)} onKeyDown={event => keySelect(event, index)}>
            <span className="route-tab-number">{item.minutes}</span><span>{lang === 'zh' ? '分鐘' : 'min'}・{item.title}</span>
          </button>)}
        </div>
        <div id="route-panel" role="tabpanel" aria-labelledby={`route-tab-${plan.minutes}`} className="route-layout">
          <div className="route-map-column">
            <TownMap lang={lang} itinerary={itinerary} selectedId={selectedId} onSelect={id => setSelectedId(id)} />
          </div>
          <div className="route-side">
            <p className="route-plan-name">{plan.minutes} {lang === 'zh' ? '分鐘' : 'min'}・{plan.title}</p>
            <p className="route-summary">{ui.overview[plan.minutes]}</p>
            <p className="route-total">{ui.total((metres / 1000).toFixed(1), Math.round(metres / 10) * 10)}</p>
            {offRoute && <article className="route-offroute" aria-live="polite">
              <p className="route-offroute-label">{ui.outside}</p>
              <h3>{selected[lang].name}</h3>
              <Story place={selected} lang={lang} />
            </article>}
            <ol className="route-stops">
              {stops.map((place, index) => {
                const leg = itinerary.legs[index - 1]
                const open = selectedId === place.id
                const story = ATLAS_STORIES[place.id]
                return <li key={place.id} className={open ? 'is-open' : ''}>
                  {leg && <p className="route-walk">{ui.walk(Math.round(leg.meters / 10) * 10, Math.ceil(leg.meters / 80), Math.ceil(leg.meters / 60))}</p>}
                  <div className="route-stop">
                    <button type="button" className="route-stop-head" aria-expanded={open} aria-controls={`route-stop-${index}`} onClick={() => toggle(place.id)}>
                      <span className="route-stop-number" aria-hidden="true">{index + 1}</span>
                      <span className="route-stop-text"><strong>{place[lang].name}</strong><small>{story?.[lang].highlight || place[lang].detail}</small></span>
                      {!open && <Visual place={place} lang={lang} />}
                    </button>
                    {open && <div id={`route-stop-${index}`}><Story place={place} lang={lang} /></div>}
                  </div>
                </li>
              })}
            </ol>
            <div className="route-others">
              <span>{ui.others}</span>
              {others.map(place => <button type="button" key={place.id} aria-pressed={selectedId === place.id} onClick={() => setSelectedId(place.id)}>{place[lang].short}</button>)}
              <a href={placesPath(lang)}>{ui.all}<span aria-hidden="true"> →</span></a>
            </div>
            <button className="route-cta" type="button" onClick={() => { updateTrip({ minutes: plan.minutes }); onPlan() }}><span>{ui.cta(plan.minutes)}</span><span aria-hidden="true">→</span></button>
            <p className="route-cta-sub">{ui.ctaSub}</p>
            <p className="route-note">{ui.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
