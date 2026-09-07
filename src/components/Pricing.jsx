import { TOUR_PRICING } from '../data/tours'
import { estimateTour, money } from '../data/booking'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
import { DurationInput, GuestInput } from './TripControls'
export default function Pricing({ trip, updateTrip, onBook }) {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].pricing
  const estimate = estimateTour(trip.people, trip.minutes)
  return (
    <section
      id="pricing"
      className="pricing-section section-space"
      aria-labelledby="pricing-title"
    >
      <div className="page-width">
        <div className="price-introduction">
          <header>
            <p className="eyebrow">05 / A clear price</p>
            <h2 id="pricing-title">
              {copy.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </header>
          <div>
            <div className="price-rates">
              <div>
                <h3>{copy.small}</h3>
                <p>
                  <small>NT$</small>
                  {TOUR_PRICING.oneToTwoHourly}
                </p>
                <span>{copy.vehicle}</span>
              </div>
              <div>
                <h3>{copy.large}</h3>
                <p>
                  <small>NT$</small>
                  {TOUR_PRICING.threePlusHourlyPerPerson}
                </p>
                <span>{copy.person}</span>
              </div>
            </div>
            <p className="body-copy">{copy.note}</p>
          </div>
        </div>
        <div className="calculator">
          <div className="calculator-controls">
            <h3>{copy.calculator}</h3>
            <GuestInput
              id="price-guests"
              value={trip.people}
              onChange={(people) => updateTrip({ people })}
              error={!estimate ? EXPERIENCE_COPY[lang].booking.peopleError : ''}
            />
            <DurationInput
              name="price-duration"
              value={trip.minutes}
              onChange={(minutes) => updateTrip({ minutes })}
            />
          </div>
          <div className="calculator-result">
            <div aria-live="polite" aria-atomic="true">
              <p className="field-label">{copy.estimate}</p>
              <p className="estimate-price">
                {estimate ? money(estimate.linePrice) : '—'}
              </p>
              <p className="estimate-detail">
                {copy.standard} {estimate ? money(estimate.total) : '—'}
                <span> / </span>
                {copy.discount}
              </p>
              <p className="estimate-detail">
                {copy.vehicles} {estimate?.vehicles ?? '—'} {copy.car} ·{' '}
                {trip.minutes} min
              </p>
            </div>
            <button
              type="button"
              className="button"
              disabled={!estimate}
              onClick={onBook}
            >
              {copy.cta}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <p className="price-fineprint">{copy.fine}</p>
      </div>
    </section>
  )
}
