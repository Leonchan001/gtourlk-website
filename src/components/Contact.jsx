import { useEffect, useRef, useState } from 'react'
import { BUSINESS, lineMessageUrl } from '../data/business'
import { bookingSummary, estimateTour, money, validPhone } from '../data/booking'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
import { SITE_COPY } from '../data/siteCopy'
import { track, trackBookingStep } from '../analytics'
import { DurationInput, GuestInput } from './TripControls'
import './BookingPreferences.css'

export default function Contact({ trip, updateTrip: setTrip }) {
  const { lang, copy: siteCopy, clock } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].booking
  const priceCopy = EXPERIENCE_COPY[lang].pricing
  const [copyState, setCopyState] = useState('idle')
  const summaryField = useRef(null)
  const summaryDetails = useRef(null)
  const lineAction = useRef(null)
  const section = useRef(null)
  // Form edits made here count as booking funnel steps.
  function updateTrip(patch) {
    for (const step of Object.keys(patch)) trackBookingStep(step)
    setTrip(patch)
  }
  useEffect(() => {
    const node = section.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        track('view_booking_form')
        observer.disconnect()
      }
    }, { threshold: 0.25 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const summary = bookingSummary(trip, lang)
  const estimate = estimateTour(trip.people, trip.minutes)
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(clock))
  const badDate = Boolean(trip.date && trip.date < today)
  const phoneOk = validPhone(trip.phone)
  const badPhone = Boolean(trip.phone?.trim()) && !phoneOk
  const valid = Boolean(estimate) && !badDate && phoneOk
  // One visible price placement per breakpoint, from the same calculation.
  const price = (placement) => (
    <div className={`summary-price price-${placement}`} aria-live="polite" aria-atomic="true">
      <span>{copy.estimate}</span>
      <strong>{estimate ? money(estimate.linePrice) : '—'}</strong>
      {estimate && <p className="summary-price-context">{priceCopy.discount}</p>}
      <p className="summary-price-context">{copy.priceNote}</p>
    </div>
  )
  useEffect(() => setCopyState('idle'), [summary])
  useEffect(() => {
    if (copyState === 'copied')
      lineAction.current?.focus({ preventScroll: true })
  }, [copyState])
  function sendToLine() {
    setCopyState('sent')
    // Quiet backup: if LINE drops the prefilled text, the summary is
    // usually already on the clipboard. Failure here is not an error.
    navigator.clipboard?.writeText(summary).catch(() => {})
  }
  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary)
      setCopyState('copied')
      track('copy_summary', {
        result: 'success',
        guests: Number(trip.people),
        duration_minutes: Number(trip.minutes),
        has_date: Boolean(trip.date),
        value: estimate?.linePrice,
        currency: 'TWD',
      })
    } catch {
      setCopyState('failed')
      track('copy_summary', { result: 'failed' })
      if (summaryDetails.current) summaryDetails.current.open = true
      requestAnimationFrame(() => {
        summaryField.current?.focus()
        summaryField.current?.select()
      })
    }
  }
  return (
    <section
      ref={section}
      id="contact"
      className="booking-section section-space"
      aria-labelledby="booking-title"
    >
      <div className="page-width">
        <header className="booking-heading">
          <div>
            <p className="eyebrow">{SITE_COPY[lang].sections.booking}</p>
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
            {price('mobile')}
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
            <div className="form-field">
              <label className="field-label" htmlFor="trip-phone">
                {copy.mobile}
              </label>
              <input
                id="trip-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={30}
                required
                value={trip.phone}
                placeholder={copy.mobileHint}
                aria-invalid={badPhone}
                aria-describedby={badPhone ? 'phone-error phone-note' : 'phone-note'}
                onChange={(event) => updateTrip({ phone: event.target.value })}
              />
              <p className="small-copy" id="phone-note">
                {copy.mobileNote}
              </p>
              {badPhone && (
                <p className="field-error" id="phone-error">
                  {copy.mobileError}
                </p>
              )}
            </div>
            <p className="small-copy">{copy.defaultRoute}</p>
            <details className="booking-options">
              <summary>
                {lang === 'zh'
                  ? '接送與其他需求（選填）'
                  : 'Pick-up and other requests (optional)'}
              </summary>
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
                  onChange={(event) =>
                    updateTrip({ pickup: event.target.value })
                  }
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
                  onChange={(event) =>
                    updateTrip({ notes: event.target.value })
                  }
                />
              </div>
            </details>
          </form>
          <aside className="booking-summary" aria-labelledby="summary-title">
            <p className="eyebrow">{SITE_COPY[lang].sections.summary}</p>
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
              <p className="summary-sights">{copy.defaultRoute}</p>
              {trip.notes && (
                <p className="summary-sights">
                  <span className="summary-field-name">{copy.notes}</span>
                  {trip.notes}
                </p>
              )}
            </div>
            {price('desktop')}
            <p className="small-copy">
              {estimate && !badDate && !phoneOk
                ? copy.mobileNeeded
                : copy.instruction}
            </p>
            {valid ? (
              <a
                href={lineMessageUrl(summary)}
                data-analytics-location="booking_summary"
                data-analytics-summary="true"
                target="_blank"
                rel="noreferrer"
                className="button"
                onClick={sendToLine}
              >
                {copy.line}
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <button className="button" type="button" disabled>
                {copy.line}
                <span aria-hidden="true">↗</span>
              </button>
            )}
            {copyState !== 'copied' ? (
              <button
                className="text-link booking-copy-backup"
                type="button"
                disabled={!valid}
                onClick={copySummary}
              >
                {copy.backup}
                <span aria-hidden="true"> ⧉</span>
              </button>
            ) : (
              <a
                ref={lineAction}
                href={BUSINESS.lineUrl}
                data-analytics-location="booking_summary"
                data-analytics-summary="true"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                {copy.openLine}
              </a>
            )}
            <a
              className="text-link"
              href={BUSINESS.lineUrl}
              data-analytics-location="booking_direct_chat"
              target="_blank"
              rel="noreferrer"
            >
              {lang === 'zh' ? '不填行程，直接聊聊 ↗' : 'Just chat with us ↗'}
            </a>
            <p className="copy-status" role="status">
              {copyState === 'copied'
                ? copy.copied
                : copyState === 'sent'
                  ? copy.sent
                  : copyState === 'failed'
                  ? copy.failed
                  : ''}
            </p>
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
        <details className="contact-details" open>
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
