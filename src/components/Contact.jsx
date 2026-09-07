import { useEffect, useRef, useState } from 'react'
import { BUSINESS } from '../data/business'
import { bookingSummary, estimateTour, getSights, money } from '../data/booking'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
import { DurationInput, GuestInput } from './TripControls'

export default function Contact({ trip, updateTrip }) {
  const { lang, copy: siteCopy, clock } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].booking
  const [copyState, setCopyState] = useState('idle')
  const summaryField = useRef(null)
  const summaryDetails = useRef(null)
  const summary = bookingSummary(trip, lang)
  const estimate = estimateTour(trip.people, trip.minutes)
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(clock))
  const badDate = Boolean(trip.date && trip.date < today)
  const valid = Boolean(estimate) && !badDate
  const sights = getSights(lang)
  useEffect(() => setCopyState('idle'), [summary])
  function toggleSight(id) {
    const stops = trip.stops.includes(id)
      ? trip.stops.filter((stop) => stop !== id)
      : [...trip.stops, id]
    updateTrip({ stops, guideChoice: !stops.length })
  }
  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
      if (summaryDetails.current) summaryDetails.current.open = true
      requestAnimationFrame(() => {
        summaryField.current?.focus()
        summaryField.current?.select()
      })
    }
  }
  return (
    <section
      id="contact"
      className="booking-section section-space"
      aria-labelledby="booking-title"
    >
      <div className="page-width">
        <header className="booking-heading">
          <div>
            <p className="eyebrow">07 / A journey of your own</p>
            <h2 id="booking-title" tabIndex="-1">
              {copy.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>
          <div>
            <p className="body-copy">{copy.intro}</p>
            <p className="small-copy">{copy.notice}</p>
          </div>
        </header>
        <div className="booking-layout">
          <form
            className="booking-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="form-row">
              <div className="form-field">
                <label className="field-label" htmlFor="trip-date">
                  {copy.date}
                </label>
                <input
                  id="trip-date"
                  type="date"
                  min={today}
                  value={trip.date}
                  aria-invalid={badDate}
                  aria-describedby={badDate ? 'date-error' : undefined}
                  onInput={(event) =>
                    updateTrip({ date: event.currentTarget.value })
                  }
                  onChange={(event) => updateTrip({ date: event.target.value })}
                />
                {badDate && (
                  <p className="field-error" id="date-error">
                    {copy.dateError}
                  </p>
                )}
              </div>
              <div className="form-field">
                <label className="field-label" htmlFor="trip-departure">
                  {copy.departure}
                </label>
                <input
                  id="trip-departure"
                  type="time"
                  value={trip.departure}
                  onInput={(event) =>
                    updateTrip({ departure: event.currentTarget.value })
                  }
                  onChange={(event) =>
                    updateTrip({ departure: event.target.value })
                  }
                />
              </div>
            </div>
            <div className="booking-count">
              <GuestInput
                id="booking-guests"
                value={trip.people}
                onChange={(people) => updateTrip({ people })}
                error={!estimate ? copy.peopleError : ''}
              />
              <DurationInput
                name="booking-duration"
                value={trip.minutes}
                onChange={(minutes) => updateTrip({ minutes })}
              />
            </div>
            <fieldset className="booking-sights">
              <legend className="field-label">{copy.sights}</legend>
              <label className="guide-choice">
                <input
                  type="checkbox"
                  checked={trip.guideChoice}
                  onChange={(event) =>
                    updateTrip({
                      guideChoice: event.target.checked,
                      stops: event.target.checked ? [] : trip.stops,
                    })
                  }
                />
                <span>{copy.guide}</span>
              </label>
              <div className="sight-options">
                {sights.map((sight) => (
                  <label key={sight.id}>
                    <input
                      type="checkbox"
                      checked={trip.stops.includes(sight.id)}
                      onChange={() => toggleSight(sight.id)}
                    />
                    <span>{sight.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="form-field">
              <label htmlFor="trip-pickup" className="field-label">
                {copy.pickup}
              </label>
              <input
                id="trip-pickup"
                type="text"
                maxLength={200}
                value={trip.pickup}
                placeholder={copy.pickupHint}
                onChange={(event) => updateTrip({ pickup: event.target.value })}
              />
            </div>
            <div className="form-field">
              <label htmlFor="trip-notes" className="field-label">
                {copy.notes}
              </label>
              <textarea
                id="trip-notes"
                rows="3"
                maxLength={1000}
                value={trip.notes}
                placeholder={copy.notesHint}
                onChange={(event) => updateTrip({ notes: event.target.value })}
              />
            </div>
          </form>
          <aside className="booking-summary" aria-labelledby="summary-title">
            <p className="eyebrow">GtourLK / Your itinerary</p>
            <h3 id="summary-title">{copy.summary}</h3>
            <div className="summary-live" aria-live="polite" aria-atomic="true">
              <p className="summary-date">
                {trip.date || copy.pending}
                {trip.departure && <span> / {trip.departure}</span>}
              </p>
              <p className="summary-people">
                {trip.people || '—'} {lang === 'zh' ? '位旅客' : 'guests'}
                <span> / {trip.minutes} min</span>
              </p>
              <p className="summary-sights">
                {trip.guideChoice || !trip.stops.length
                  ? copy.guide
                  : sights
                      .filter((sight) => trip.stops.includes(sight.id))
                      .map((sight) => sight.label)
                      .join(lang === 'zh' ? '、' : ', ')}
              </p>
              <div className="summary-price">
                <span>{copy.estimate}</span>
                <strong>{estimate ? money(estimate.linePrice) : '—'}</strong>
              </div>
            </div>
            <p className="small-copy">{copy.instruction}</p>
            <button
              className="button button-outline"
              type="button"
              disabled={!valid}
              onClick={copySummary}
            >
              {copy.copy}
              <span aria-hidden="true">⧉</span>
            </button>
            <p className="copy-status" role="status">
              {copyState === 'copied'
                ? copy.copied
                : copyState === 'failed'
                  ? copy.failed
                  : ''}
            </p>
            <a
              href={BUSINESS.lineUrl}
              target="_blank"
              rel="noreferrer"
              className="button"
            >
              {copy.line}
              <span aria-hidden="true">↗</span>
            </a>
            <p className="small-copy">{copy.confirm}</p>
            <details ref={summaryDetails} className="summary-details">
              <summary>{copy.preview}</summary>
              <textarea
                ref={summaryField}
                readOnly
                value={summary}
                rows="15"
                aria-label={copy.preview}
              />
            </details>
          </aside>
        </div>
        <details className="contact-details">
          <summary>
            <span>{copy.contact}</span>
            {copy.phone}
            <span aria-hidden="true">+</span>
          </summary>
          <div className="contact-details-grid">
            <div>
              {BUSINESS.phones.map((phone, i) => (
                <a
                  className="phone-line"
                  key={phone.tel}
                  href={`tel:${phone.tel}`}
                >
                  <span>{siteCopy.header.phoneLabels[i]}</span>
                  {phone.display}
                </a>
              ))}
            </div>
            <div>
              <p>{BUSINESS.address[lang]}</p>
              <p>{copy.hours}</p>
              <p>{copy.night}</p>
              <a
                href={BUSINESS.mapsUrl}
                className="text-link"
                target="_blank"
                rel="noreferrer"
              >
                {copy.map} ↗
              </a>
            </div>
          </div>
        </details>
      </div>
    </section>
  )
}
