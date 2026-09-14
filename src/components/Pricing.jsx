import { TOUR_PRICING } from '../data/tours'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
export default function Pricing({ onBook }) {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].pricing
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
        <button type="button" className="button" onClick={onBook}>
          {copy.cta}<span aria-hidden="true">→</span>
        </button>
        <p className="price-fineprint">{copy.fine}</p>
      </div>
    </section>
  )
}
