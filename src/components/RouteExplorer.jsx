import { useEffect, useState, useRef } from 'react'
import { getTourPlans } from '../data/tours'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import {
  ATLAS_STOPS,
  ATLAS_COPY,
  ATLAS_EXPERIENCE,
  atlasStops,
} from '../data/atlas'
import LukangMap from './LukangMap'
import { useLanguage } from '../i18n'
import './RouteExplorer.css'

export default function RouteExplorer({ trip, updateTrip, onPlan }) {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].route
  const atlas = ATLAS_COPY[lang]
  const experience = ATLAS_EXPERIENCE[lang]
  const plans = getTourPlans(lang)
  const plan = plans.find((item) => item.minutes === trip.minutes)
  const [selectedId, setSelectedId] = useState(ATLAS_STOPS[0].id)
  const selected = ATLAS_STOPS.find((stop) => stop.id === selectedId)
  const included = atlasStops(trip.minutes).map((stop) => stop.id)
  const tabs = useRef([])
  // Pricing and Booking also change duration; keep their shared state intact.
  useEffect(() => {
    setSelectedId(
      (id) =>
        atlasStops(trip.minutes).find((stop) => stop.id === id)?.id ||
        ATLAS_STOPS[0].id,
    )
  }, [trip.minutes])
  function selectStop(id) {
    setSelectedId(id)
  }
  function select(index) {
    updateTrip({ minutes: plans[index].minutes })
  }
  function keySelect(event, index) {
    const last = plans.length - 1
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % plans.length
        : event.key === 'ArrowLeft'
          ? (index + last) % plans.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    select(next)
    tabs.current[next]?.focus()
  }
  return (
    <section
      id="routes"
      className="route-section section-space"
      aria-labelledby="route-title"
    >
      <div className="page-width">
        <header className="section-heading">
          <p className="eyebrow">02 / Lukang Route Atlas</p>
          <h2 id="route-title">
            {copy.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="body-copy">{copy.intro}</p>
        </header>
        <div className="atlas-module" id="route-atlas">
          <div
            className="atlas-duration"
            role="tablist"
            aria-label={copy.label}
          >
            {plans.map((item, index) => (
              <button
                key={item.minutes}
                type="button"
                role="tab"
                id={`route-tab-${item.minutes}`}
                ref={(el) => {
                  tabs.current[index] = el
                }}
                aria-selected={item.minutes === trip.minutes}
                aria-controls="route-panel"
                tabIndex={item.minutes === trip.minutes ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={(event) => keySelect(event, index)}
              >
                <span>
                  {item.minutes}
                  <small> MIN</small>
                </span>
                <span className="atlas-duration-name">{item.title}</span>
              </button>
            ))}
          </div>
          <div
            id="route-panel"
            role="tabpanel"
            aria-labelledby={`route-tab-${trip.minutes}`}
            className="atlas-layout"
          >
            <div className="atlas-map-column">
              <div className="atlas-edition" aria-hidden="true">
                <span>GTOURLK / 城市讀本</span>
                <span>鹿港 · LUKANG</span>
              </div>
              <LukangMap
                lang={lang}
                included={included}
                selectedId={selectedId}
                onSelect={selectStop}
              />
              <div className="atlas-legend">
                <span className="atlas-mobile-value" aria-live="polite">
                  {experience.value[trip.minutes]}
                </span>
                <span className="atlas-desktop-reading">
                  {lang === 'zh'
                    ? '磚紅：本時長參考景點 · 淡墨：其他景點'
                    : 'Brick: suggested sights · ink: other places'}
                </span>
              </div>
            </div>
            <div className="atlas-editorial">
              <div className="atlas-plan-intro">
                <p className="eyebrow">
                  {plan.duration} / {plan.durationLabel}
                </p>
                <h3>{plan.title}</h3>
                <p>{experience.value[trip.minutes]}</p>
                <p className="small-copy">
                  {copy.fit} / {plan.fit}
                </p>
              </div>
              <label className="atlas-place-picker">
                <span className="small-copy">
                  {lang === 'zh' ? '查看其他景點' : 'Browse the sights'}
                </span>
                <select
                  aria-controls="atlas-stop-detail"
                  value={selectedId}
                  onChange={(event) => selectStop(event.target.value)}
                >
                  {ATLAS_STOPS.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop[lang].name}
                    </option>
                  ))}
                </select>
              </label>
              <div
                id="atlas-stop-detail"
                className="atlas-stop-detail"
                aria-live="polite"
                aria-atomic="true"
              >
                <p className="atlas-stop-status">
                  {included.includes(selectedId)
                    ? selected.kind === 'area'
                      ? atlas.area
                      : atlas.included
                    : atlas.outside}
                </p>
                <p>{selected[lang].detail}</p>
              </div>
              <button
                className="text-link atlas-plan-cta"
                type="button"
                onClick={() => {
                  updateTrip({ minutes: plan.minutes })
                  onPlan()
                }}
              >
                {lang === 'zh'
                  ? `安排 ${plan.minutes} 分鐘`
                  : `Plan ${plan.minutes} min`}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
        <div className="atlas-footnotes">
          <p>
            {lang === 'zh'
              ? '散策圖標示景點位置，並非導航。依所選時長安排預設路線，特別需求可直接與導覽員討論。'
              : 'A town atlas, not navigation. Your duration determines the default tour; discuss special requests with your guide.'}
          </p>
          <p>{copy.note}</p>
          <details>
            <summary>{atlas.sources}</summary>
            <p>{atlas.sourceNote}</p>
            <ul>
              {ATLAS_STOPS.filter((stop) => stop.source).map((stop) => (
                <li key={stop.id}>
                  <a href={stop.source} target="_blank" rel="noreferrer">
                    {stop[lang].name} ↗
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
            >
              © OpenStreetMap contributors · ODbL ↗
            </a>
          </details>
          <p className="atlas-source-credit">
            {atlas.note} ·{' '}
            <a href="https://www.openstreetmap.org/copyright">
              © OpenStreetMap
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
