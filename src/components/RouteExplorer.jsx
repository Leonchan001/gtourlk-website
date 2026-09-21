import { useRef, useState } from 'react'
import { getTourPlans } from '../data/tours'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { ATLAS_STOPS, atlasStops } from '../data/atlas'
import { MORE_PLACES } from '../data/morePlaces'
import { ATLAS_STORIES } from '../data/atlasStories'
import { ATLAS_PHOTOS } from '../data/atlasPhotos'
import { TOWN_LABELS, PUBLIC_ANCHORS } from '../data/townAtlas'
import { ATLAS_ITINERARIES } from '../data/atlasItineraries'
import { MEDIA_CREDITS } from '../data/media'
import LukangMap, { LandmarkDrawing } from './LukangMap'
import Photo from './Photo'
import { useLanguage } from '../i18n'
import './RouteExplorer.css'

const MAIN_PLACES = ATLAS_STOPS.filter(place => place.coordinates)
const PLACES = [...MAIN_PLACES, ...MORE_PLACES]
const UI = {
  zh: {
    title: '鹿港散策圖', subtitle: '一座老城，值得慢慢認識。',
    hint: '點選地標，讀一段鹿港', places: '16 處地方故事',
    features: { 60: '初訪・時間有限', 90: '寺廟・巷弄故事', 150: '宅邸・從容探索' },
    overview: { 60: '從北鹿港開始，認識天后宮、老街與桂花巷。', 90: '把時間留給廟宇與巷弄，從老街讀到龍山寺。', 150: '為宅邸、廟宇與老街多留一些時間，從容認識南北鹿港。' },
    suggested: '建議探索範圍', other: '其他景點', selected: '正在閱讀',
    route: '探索線示意', public: '公共定位點',
    add: '加入偏好', remove: '移除偏好', preferences: '想與導覽員討論的地方',
    preferenceNote: '偏好供討論，不保證停靠；請複製後貼入詢問訊息。',
    copy: '複製偏好', copied: '已複製，可貼入詢問訊息。', copyFailed: '請選取下方文字手動複製。',
    preferenceText: '景點偏好（請協助評估，非固定停靠）：',
    stay: '停留安排：依參觀方式與導覽員確認。',
    story: '地方小誌', source: '景點介紹與參觀資訊', license: '照片授權',
    previous: '上一個景點', next: '下一個景點', browse: '切換景點介紹',
    directory: '延伸探索', directorySub: '搜尋全部 16 處景點',
    search: '搜尋景點', placeholder: '例如：意樓、文武廟、民俗文物館',
    main: '地圖上的七個地標', more: '再認識九個地方',
    empty: '沒有找到符合的景點，試試其他名稱。', clear: '清除搜尋', result: '處符合',
    outside: '延伸閱讀・可與導覽員討論',
    note: '參考景點不代表固定停靠；實際路線依需求、上下車地點、路況與停留時間安排。',
    reading: '景點介紹供認識鹿港，閱讀或切換景點不會加入預約行程。',
    cta: minutes => `詢問 ${minutes} 分鐘行程`, ctaSub: '下一步填寫日期與人數，由導鹿確認安排。',
    geography: '位置與路徑為散策示意，實際行走請依現場道路與導航為準。',
    sources: '地圖資料與閱讀方式',
  },
  en: {
    title: 'A little atlas of Lukang', subtitle: 'A town worth getting to know, slowly.',
    hint: 'Choose a landmark. Read its story.', places: '16 local stories',
    features: { 60: 'A first introduction', 90: 'Temples & historic lanes', 150: 'Mansions & a slower pace' },
    overview: { 60: 'Begin in northern Lukang with Tianhou, the old streets and Osmanthus Alley.', 90: 'Make time for temples and historic lanes, from the old streets to Longshan.', 150: 'Allow more time for mansions, temples and old streets across northern and southern Lukang.' },
    suggested: 'Suggested area', other: 'Other places', selected: 'Now reading',
    route: 'Exploration line', public: 'Public landmarks',
    add: 'Add to preferences', remove: 'Remove preference', preferences: 'Places to discuss with your guide',
    preferenceNote: 'Preferences are for discussion, not guaranteed stops. Copy and paste them into your enquiry.',
    copy: 'Copy preferences', copied: 'Copied. Paste into your enquiry.', copyFailed: 'Select the text below to copy it manually.',
    preferenceText: 'Place preferences (please assess; not guaranteed stops): ',
    stay: 'Time at each place: agree with your guide for the type of visit.',
    story: 'A LOCAL STORY', source: 'Place information & visiting details', license: 'Photo license',
    previous: 'Previous place', next: 'Next place', browse: 'Browse place stories',
    directory: 'Explore a little further', directorySub: 'Search all 16 places',
    search: 'Find a place', placeholder: 'Try Yi House, Wenwu, Koo…',
    main: 'Seven landmarks on the atlas', more: 'Nine more places to discover',
    empty: 'No matching places. Try another name.', clear: 'Clear search', result: 'matching places',
    outside: 'Further reading · discuss with your guide',
    note: 'These are reference sights, not guaranteed stops. Your guide adapts the visit to your interests, pickup point, traffic and time spent at each place.',
    reading: 'Browsing places is for discovery; it does not add stops to your booking.',
    cta: minutes => `Enquire about ${minutes} minutes`, ctaSub: 'Next, add your date and group size. Your guide will confirm the arrangements.',
    geography: 'Schematic locations and exploration paths. Follow on-site streets and navigation when walking.',
    sources: 'Map sources & how to read',
  },
}

function StoryVisual({ place, story, lang }) {
  const [failed, setFailed] = useState(false)
  const photo = ATLAS_PHOTOS[place.id]
  const photoKey = story?.photoKey
  const credit = photoKey && MEDIA_CREDITS[photoKey]
  const hasPhoto = Boolean(photo || photoKey) && !failed
  return (
    <figure className={`atlas-story-visual ${hasPhoto ? 'has-photo' : 'is-drawing'}`}>
      {hasPhoto ? <div onErrorCapture={() => setFailed(true)}>{photo ? <img src={photo.src} alt={photo.alt[lang]} width={photo.width} height={photo.height} loading="lazy" decoding="async" style={{ objectPosition: photo.position || 'center' }} /> : <Photo slot={photoKey} sizes="(min-width: 1024px) 440px, (min-width: 768px) 620px, 90vw" />}</div> : (
        <div className="atlas-story-vignette" aria-hidden="true">
          <span>LUKANG / {place.kind === 'temple' ? 'TEMPLE' : place.kind === 'house' ? 'HERITAGE' : 'TOWN LIFE'}</span>
          <LandmarkDrawing kind={TOWN_LABELS[place.id]?.drawing || 'lane'} />
          <span>{story?.[lang].highlight || place[lang].name}</span>
        </div>
      )}
      {photo && !failed ? <figcaption><a href={photo.source} target="_blank" rel="noreferrer">{place[lang].name} · {photo.author}{photo.year ? ` (${photo.year})` : ''}</a><span> · </span><a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a><span className="atlas-photo-treatment">{lang === 'zh' ? '縮圖與版面裁切；照片沿用原授權。' : 'Resized and cropped for display; photo retains its original license.'}</span></figcaption> : credit && !failed && <figcaption><a href={credit.source} target="_blank" rel="noreferrer">{credit[lang]}</a><span> · </span><a href={credit.license} target="_blank" rel="noreferrer">{UI[lang].license}</a></figcaption>}
    </figure>
  )
}

export default function RouteExplorer({ trip, updateTrip, onPlan }) {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].route
  const ui = UI[lang]
  const plans = getTourPlans(lang)
  const plan = plans.find(item => item.minutes === trip.minutes) || plans[1]
  const [selectedId, setSelectedId] = useState(MAIN_PLACES[0].id)
  const [search, setSearch] = useState('')
  const [preferences, setPreferences] = useState([])
  const [copyStatus, setCopyStatus] = useState('')
  const selected = PLACES.find(place => place.id === selectedId) || MAIN_PLACES[0]
  const story = ATLAS_STORIES[selected.id]
  const included = atlasStops(plan.minutes).map(place => place.id)
  const itinerary = ATLAS_ITINERARIES[plan.minutes]
  const walkingLeg = itinerary.legs.find(leg => (leg.from === '摸乳巷' && leg.to === '鹿港龍山寺') || [leg.from, leg.to].includes('桂花巷藝術村') && [leg.from, leg.to].includes('鹿港老街'))
  const preferenceText = ui.preferenceText + preferences.map(id => PLACES.find(place => place.id === id)[lang].name).join(lang === 'zh' ? '、' : ', ')
  const matches = PLACES.filter(place => `${place.id} ${place.zh.name} ${place.en.name}`.toLowerCase().includes(search.trim().toLowerCase()))
  const selectedIndex = PLACES.findIndex(place => place.id === selected.id)
  const tabs = useRef([])
  const searchInput = useRef(null)
  function selectDuration(index) { updateTrip({ minutes: plans[index].minutes }) }
  function keySelect(event, index) {
    const last = plans.length - 1
    const next = event.key === 'ArrowRight' ? (index + 1) % plans.length : event.key === 'ArrowLeft' ? (index + last) % plans.length : event.key === 'Home' ? 0 : event.key === 'End' ? last : null
    if (next === null) return
    event.preventDefault()
    selectDuration(next)
    tabs.current[next]?.focus()
  }
  function adjacentStop(direction) { setSelectedId(PLACES[(selectedIndex + direction + PLACES.length) % PLACES.length].id) }
  function clearSearch() { setSearch(''); searchInput.current?.focus() }
  function togglePreference(id) {
    setPreferences(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id])
    setCopyStatus('')
  }
  async function copyPreferences() {
    try { await navigator.clipboard.writeText(preferenceText); setCopyStatus('copied') }
    catch { setCopyStatus('copyFailed') }
  }
  return (
    <section id="routes" className="route-section section-space atlas-revised" aria-labelledby="route-title">
      <div className="page-width">
        <header className="section-heading">
          <p className="eyebrow">02 / LUKANG ROUTE ATLAS</p>
          <h2 id="route-title">{copy.title.map(line => <span key={line}>{line}</span>)}</h2>
          <p className="body-copy">{lang === 'zh' ? '選一段時間，從地圖認識鹿港的廟宇、老屋與巷弄。' : 'Choose your time, then discover Lukang’s temples, old houses and lanes.'}</p>
        </header>
        <div className="atlas-module" id="route-atlas">
          <header className="atlas-masthead">
            <div><p className="atlas-kicker">GTOURLK / A CULTURAL FIELD GUIDE</p><h3>{ui.title}</h3><p>{ui.subtitle}</p></div>
            <span className="atlas-seal" aria-hidden="true">鹿<br />港</span>
          </header>
          <div className="atlas-duration" role="tablist" aria-label={copy.label}>
            {plans.map((item, index) => <button key={item.minutes} type="button" role="tab" id={`route-tab-${item.minutes}`} ref={el => { tabs.current[index] = el }} aria-selected={item.minutes === plan.minutes} aria-controls="route-panel" tabIndex={item.minutes === plan.minutes ? 0 : -1} onClick={() => selectDuration(index)} onKeyDown={event => keySelect(event, index)}>
              <span className="atlas-duration-number">{item.minutes}<small> MIN</small></span>
              <span className="atlas-duration-name">{item.title}</span>
              <span className="atlas-duration-feature">{ui.features[item.minutes]}</span>
            </button>)}
          </div>
          <div id="route-panel" role="tabpanel" aria-labelledby={`route-tab-${plan.minutes}`} className="atlas-layout">
            <div className="atlas-overview">
              <p>{ui.overview[plan.minutes]}</p>
              <span>{ui.suggested} · {lang === 'zh' ? '探索順序示例' : 'Example exploration sequence'}</span>
              <div className="atlas-reference-list" aria-label={ui.suggested}>{itinerary.order.map(id => PLACES.find(place => place.id === id)).map(place => <button type="button" key={place.id} aria-pressed={selected.id === place.id} aria-controls="atlas-stop-detail" onClick={() => setSelectedId(place.id)}>{place[lang].name}</button>)}</div>
              <p className="atlas-suggestion-note">{ui.note}</p>
            </div>
            <div className="atlas-map-column">
              <div className="atlas-edition"><span>{ui.hint}</span><span aria-hidden="true">24°03′ N / 120°26′ E</span></div>
              <LukangMap lang={lang} minutes={plan.minutes} included={included} selectedId={selected.id} onSelect={setSelectedId} />
              <div className="atlas-legend" aria-label={lang === 'zh' ? '圖例' : 'Map legend'}>
                <span><i className="is-route" aria-hidden="true" />{ui.route}</span><span><i className="is-reference" aria-hidden="true" />{ui.suggested}</span><span><i className="is-other" aria-hidden="true" />{ui.other}</span><span><i className="is-reading" aria-hidden="true" />{ui.selected}</span><span><i className="is-public" aria-hidden="true" />{ui.public}</span>
              </div>
              {walkingLeg && <p className="atlas-walking-hint">{PLACES.find(place => place.id === walkingLeg.from)[lang].short} ↔ {PLACES.find(place => place.id === walkingLeg.to)[lang].short}<strong>{lang === 'zh' ? `約 ${Math.round(walkingLeg.meters / 10) * 10} 公尺・步行約 ${Math.ceil(walkingLeg.meters / 80)}–${Math.ceil(walkingLeg.meters / 60)} 分鐘` : `About ${Math.round(walkingLeg.meters / 10) * 10} m · ${Math.ceil(walkingLeg.meters / 80)}–${Math.ceil(walkingLeg.meters / 60)} min walk`}</strong><small>{lang === 'zh' ? '道路代表點間距離，不含停留與等候。' : 'Between representative street points; excludes stops and waiting.'}</small></p>}
              <p className="atlas-map-caption">{ui.geography}</p>
            </div>
            <article className="atlas-story" id="atlas-stop-detail" aria-labelledby="atlas-selected-title">
              <div className="atlas-story-topline"><span>{ui.story}</span><div className="atlas-selection-nav" aria-label={ui.browse}><button type="button" aria-label={ui.previous} onClick={() => adjacentStop(-1)}>←</button><span>{String(selectedIndex + 1).padStart(2, '0')} / 16</span><button type="button" aria-label={ui.next} onClick={() => adjacentStop(1)}>→</button></div></div>
              <StoryVisual key={selected.id} place={selected} story={story} lang={lang} />
              <div className="atlas-story-copy" key={`${selected.id}-${lang}`}>
                <p className="atlas-stop-status">{included.includes(selected.id) ? ui.suggested : ui.outside}</p>
                <h3 id="atlas-selected-title">{selected[lang].name}</h3>
                <p className="atlas-story-highlight">{story?.[lang].highlight}</p>
                <p className="atlas-story-text">{story?.[lang].story || selected[lang].detail}</p>
                <p className="atlas-stay-note">{ui.stay}</p>
                <button type="button" className="atlas-preference-toggle" aria-pressed={preferences.includes(selected.id)} onClick={() => togglePreference(selected.id)}>{preferences.includes(selected.id) ? '✓ ' + ui.remove : '＋ ' + ui.add}</button>
                <a className="atlas-place-source" href={selected.source} target="_blank" rel="noreferrer">{ui.source}<span aria-hidden="true"> ↗</span></a>
                <a className="atlas-back-to-map" href="#atlas-town-map">{lang === 'zh' ? '返回地圖 ↑' : 'Back to the map ↑'}</a>
              </div>
              <span className="sr-only" role="status">{ui.selected}：{selected[lang].name}・{included.includes(selected.id) ? ui.suggested : ui.outside}</span>
            </article>
            <details className="atlas-directory">
              <summary><span>{ui.directory}<small>{ui.directorySub}</small></span><span className="atlas-directory-plus" aria-hidden="true">＋</span></summary>
              <div className="atlas-directory-body">
                <label className="atlas-search"><span>{ui.search}</span><input ref={searchInput} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={ui.placeholder} /></label>
                {search && <div className="atlas-search-feedback"><span role="status">{matches.length} {ui.result}</span><button type="button" onClick={clearSearch}>{ui.clear} ×</button></div>}
                <div className="atlas-directory-results">
                  {[{label: ui.main, places: MAIN_PLACES}, {label: ui.more, places: MORE_PLACES}].map(group => {
                    const found = group.places.filter(place => matches.includes(place))
                    return found.length > 0 && <div className="atlas-place-group" key={group.label}><h4>{group.label}</h4>{found.map(place => <button type="button" key={place.id} aria-pressed={selected.id === place.id} aria-controls="atlas-stop-detail" onClick={() => setSelectedId(place.id)}><span>{place[lang].name}</span><span aria-hidden="true">↗</span></button>)}</div>
                  })}
                  {!matches.length && <p className="atlas-search-empty">{ui.empty}</p>}
                </div>
                <p className="atlas-directory-note">{ui.reading}</p>
              </div>
            </details>
            <div className="atlas-enquiry">
              {preferences.length > 0 && <div className="atlas-preferences"><h4>{ui.preferences}</h4><ul>{preferences.map(id => <li key={id}><button type="button" onClick={() => togglePreference(id)} aria-label={`${ui.remove}: ${PLACES.find(place => place.id === id)[lang].name}`}>{PLACES.find(place => place.id === id)[lang].name}<span aria-hidden="true"> ×</span></button></li>)}</ul><p>{ui.preferenceNote}</p><button type="button" className="atlas-copy-preferences" onClick={copyPreferences}>{ui.copy}</button><p role="status">{copyStatus && ui[copyStatus]}</p><textarea aria-label={ui.preferences} value={preferenceText} readOnly rows={3} /></div>}
              <button className="atlas-plan-cta" type="button" onClick={() => { updateTrip({ minutes: plan.minutes }); onPlan() }}><span>{ui.cta(plan.minutes)}</span><span aria-hidden="true">→</span></button><p>{ui.ctaSub}</p>
            </div>
          </div>
          <footer className="atlas-footnotes"><p>{lang === 'zh' ? '磚紅線為步行探索示意，不是車行路線或固定停靠順序。實際行程由導鹿確認。' : 'Brick lines illustrate walking exploration, not vehicle routes or a fixed stop order. Your guide confirms the actual itinerary.'}</p><details><summary>{ui.sources}</summary><p>{lang === 'zh' ? '景點位置沿用彰化縣政府／觀光署代表點；道路核對 OpenStreetMap（2026-09-20）。上北下南、東右西左，東西尺度適度壓縮，非等比例地圖。短虛線只連接地名與代表點；建築線稿不是建物範圍。老街、藝術村與巷弄以區域代表點標示，不代表精確入口。' : 'Sight positions use Changhua County / Taiwan Tourism Administration representative points. Streets were checked against OpenStreetMap on 20 September 2026. North is up, east is right, with a compressed east–west scale. Short dashed leaders identify representative points; sketches are not footprints. Streets and village areas are not surveyed entrances.'}</p><p>{lang === 'zh' ? '步行估計依道路折線距離，以每分鐘 60–80 公尺換算，未包含參觀、等候或代表點至入口的距離；不表示現場通行狀態。' : 'Walking estimates use street geometry at 60–80 metres per minute, excluding visits, waiting and distances to entrances. They do not confirm current access.'}</p><ul>{PLACES.map(place => <li key={place.id}><a href={place.source} target="_blank" rel="noreferrer">{place[lang].name} ↗</a></li>)}{PUBLIC_ANCHORS.map(place => <li key={place.id}><a href={place.source} target="_blank" rel="noreferrer">{place[lang]} ↗</a></li>)}</ul><p>{lang === 'zh' ? '延伸景點資料：觀光署、彰化縣政府、文化部、內政部與中央研究院；玉渠宮位置參考 OpenStreetMap／Mapcarta。' : 'Additional place sources: Taiwan Tourism Administration, Changhua County, Ministry of Culture, Ministry of the Interior and Academia Sinica. Yuqu location: OpenStreetMap / Mapcarta.'}</p></details><a className="atlas-source-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors · ODbL</a></footer>
        </div>
      </div>
    </section>
  )
}
