import { useEffect, useState, useRef } from 'react'
import { getTourPlans } from '../data/tours'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import {
  ATLAS_STOPS,
  ATLAS_COPY,
  ATLAS_CONNECTIONS,
  atlasPath,
  atlasStops,
  atlasSelection,
  project,
} from '../data/atlas'
import { ATLAS_STREETS } from '../data/atlasStreets'
import { useLanguage } from '../i18n'
import './RouteExplorer.css'

export default function RouteExplorer({ trip, updateTrip, onPlan }) {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].route
  const atlas = ATLAS_COPY[lang]
  const plans = getTourPlans(lang)
  const plan = plans.find((item) => item.minutes === trip.minutes)
  const [selectedId, setSelectedId] = useState(ATLAS_STOPS[0].id)
  const selected = ATLAS_STOPS.find((stop) => stop.id === selectedId)
  const included = atlasStops(trip.minutes).map((stop) => stop.id)
  const tabs = useRef([])
  const strip = useRef(null)
  const stopButtons = useRef({})
  const revealSelection = useRef(false)
  // Pricing and Booking also change duration; keep their shared state intact.
  useEffect(() => {
    setSelectedId((id) => atlasSelection(trip.minutes, id).id)
  }, [trip.minutes])
  useEffect(() => {
    // Measuring an offscreen, content-visibility section at hydration forces its
    // layout and downloads below-fold fonts. Only measure after a local gesture.
    if (!revealSelection.current) return
    revealSelection.current = false
    const list = strip.current
    const button = stopButtons.current[selectedId]
    if (!list || !button) return
    // Scroll only this strip. scrollIntoView can move the entire page vertically.
    const start = button.offsetLeft
    if (
      start < list.scrollLeft ||
      start + button.offsetWidth > list.scrollLeft + list.clientWidth
    ) {
      list.scrollTo({
        left: start - (list.clientWidth - button.offsetWidth) / 2,
        behavior: 'instant',
      })
    }
  }, [selectedId, trip.minutes])
  function selectStop(id) {
    revealSelection.current = true
    setSelectedId(id)
  }
  function select(index) {
    revealSelection.current = true
    updateTrip({ minutes: plans[index].minutes })
    setSelectedId((id) => atlasSelection(plans[index].minutes, id).id)
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
  const selectedPoint = selected.coordinates && project(selected.coordinates)
  const sequence = ATLAS_CONNECTIONS[trip.minutes]
  const selectedIndex = sequence.indexOf(selected.id)
  const segment =
    selectedIndex >= 0 && sequence.length > 1
      ? [
          sequence[Math.max(0, selectedIndex - 1)],
          sequence[selectedIndex === 0 ? 1 : selectedIndex],
        ]
          .map(
            (id, index) =>
              `${index ? 'L' : 'M'}${project(ATLAS_STOPS.find((stop) => stop.id === id).coordinates).join(',')}`,
          )
          .join(' ')
      : null
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
              <div
                className={`atlas-canvas ${selected.kind === 'area' ? 'atlas-area-selected' : ''}`}
                role="group"
                aria-label={copy.map}
              >
                <svg
                  viewBox="0 0 600 500"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <g className="atlas-streets">
                    {ATLAS_STREETS.map(([id, name, points]) => (
                      <polyline
                        key={id}
                        points={points}
                        className={name === '中山路' ? 'atlas-main-street' : ''}
                      />
                    ))}
                  </g>
                  <g className="atlas-road-names">
                    <text x="320" y="221" transform="rotate(42 320 221)">
                      中山路
                    </text>
                    <text x="408" y="164" transform="rotate(-17 408 164)">
                      民權路
                    </text>
                    <text x="262" y="421">
                      三民路
                    </text>
                  </g>
                  <g className="atlas-base-routes">
                    {[60, 90, 150].map((minutes) => (
                      <path key={minutes} d={atlasPath(minutes)} />
                    ))}
                  </g>
                  <path
                    key={trip.minutes}
                    className="atlas-route"
                    d={atlasPath(selected.kind === 'area' ? 150 : trip.minutes)}
                    pathLength="1"
                  />
                  {segment && (
                    <path className="atlas-selected-segment" d={segment} />
                  )}
                  {ATLAS_STOPS.filter((stop) => stop.coordinates).map(
                    (stop) => {
                      const [x, y] = project(stop.coordinates)
                      return (
                        <g
                          key={stop.id}
                          className={`atlas-anchor ${included.includes(stop.id) ? 'is-included' : ''} ${selectedId === stop.id ? 'is-selected' : ''}`}
                          onClick={() => selectStop(stop.id)}
                        >
                          <path
                            className="atlas-leader"
                            d={`M${x},${y} L${stop.label.join(',')}`}
                          />
                          <circle cx={x} cy={y} r="4" />
                        </g>
                      )
                    },
                  )}
                  {selectedPoint && (
                    <circle
                      className="atlas-location-ring"
                      cx={selectedPoint[0]}
                      cy={selectedPoint[1]}
                      r="11"
                    />
                  )}
                </svg>
                <span className="atlas-north" aria-hidden="true">
                  ↑ N <span>{atlas.north}</span>
                </span>
                <span className="atlas-south" aria-hidden="true">
                  {atlas.south} ↓
                </span>
                {ATLAS_STOPS.filter((stop) => stop.coordinates).map(
                  (stop, index) => (
                    <button
                      key={stop.id}
                      type="button"
                      className={`atlas-map-stop ${included.includes(stop.id) ? 'is-included' : ''}`}
                      style={{
                        left: `${stop.label[0] / 6}%`,
                        top: `${stop.label[1] / 5}%`,
                      }}
                      aria-label={stop[lang].name}
                      aria-pressed={selectedId === stop.id}
                      aria-controls="atlas-stop-detail"
                      onClick={() => selectStop(stop.id)}
                    >
                      <span
                        className={`atlas-landmark atlas-landmark-${stop.kind}`}
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{stop[lang].short}</span>
                    </button>
                  ),
                )}
              </div>
              <div className="atlas-legend">
                <span>
                  <i aria-hidden="true" />
                  {
                    atlas.captions[
                      selected.kind === 'area' ? 150 : trip.minutes
                    ]
                  }
                </span>
                <span className="atlas-hint">{atlas.hint}</span>
              </div>
            </div>
            <div className="atlas-editorial">
              <div className="atlas-plan-intro">
                <p className="eyebrow">
                  {plan.duration} / {plan.durationLabel}
                </p>
                <h3>{plan.title}</h3>
                <p>{plan.tagline}</p>
                <p className="small-copy">
                  {copy.fit} / {plan.fit}
                </p>
              </div>
              <div
                className="atlas-stop-strip"
                ref={strip}
                role="group"
                aria-label={copy.stops}
              >
                {ATLAS_STOPS.map((stop, index) => (
                  <button
                    key={stop.id}
                    ref={(el) => {
                      stopButtons.current[stop.id] = el
                    }}
                    type="button"
                    className={included.includes(stop.id) ? 'is-included' : ''}
                    aria-pressed={selectedId === stop.id}
                    aria-controls="atlas-stop-detail"
                    onClick={() => selectStop(stop.id)}
                  >
                    <span aria-hidden="true">
                      {stop.kind === 'area'
                        ? '↕'
                        : String(index + 1).padStart(2, '0')}
                    </span>
                    {stop[lang].short}
                  </button>
                ))}
              </div>
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
                <h3>{selected[lang].name}</h3>
                <p>{selected[lang].detail}</p>
              </div>
              <button
                className="text-link atlas-plan-cta"
                type="button"
                onClick={onPlan}
              >
                {copy.cta}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
        <div className="atlas-footnotes">
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
