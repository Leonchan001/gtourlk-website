import { BUSINESS } from '../data/business'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
import Photo from './Photo'
import { TOUR_PRICING } from '../data/tours'
export default function Hero() {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].hero
  const { copy: site } = useLanguage()
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      {lang === 'en' && (
        <div className="hero-edition" aria-hidden="true"><span>THE LUKANG JOURNAL</span><span>LOCAL STORIES, AT YOUR PACE</span><span>GTOURLK — EST. 2024</span></div>
      )}
      <div className="hero-copy">
        <p className="eyebrow">{copy.kicker}</p>
        <h1 id="hero-title">
          {copy.lines.map((line, index) => (
            <span className={index === copy.lines.length - 1 ? 'hero-accent' : ''} key={line}>
              {line}
            </span>
          ))}
        </h1>
        {lang === 'en' && <p className="hero-script">The art of taking your time.</p>}
        <p className="hero-intro">{copy.intro}</p>
        <p className="hero-facts">
          <span>
            <strong>{'NT$' + TOUR_PRICING.oneToTwoHourly}</strong> {site.from}
            <small>{site.perCarHour}</small>
          </span>
          <a href={BUSINESS.googleReviewsUrl} target="_blank" rel="noreferrer">
            <strong>{'Google ' + BUSINESS.reviewRating}</strong>
            <span aria-hidden="true"> ★ </span>
            <small>{lang === 'zh' ? `${BUSINESS.reviewCount} 則評價` : `${BUSINESS.reviewCount} reviews`}</small>
          </a>
        </p>
        <div className="hero-actions">
          <a href="#contact" className="button">
            {copy.book}
            <span aria-hidden="true">↗</span>
          </a>
          <a href="#routes" className="hero-explore">
            {copy.explore}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="hero-reservation">{copy.note}</p>
        <div className="hero-metadata">
          <span>{copy.metadata}</span>
        </div>
      </div>
      <figure className="hero-figure">
        <Photo slot="hero" desktopSlot="heroDesktop" priority sizes="100vw" />
        <figcaption>{copy.photo}</figcaption>
        <span className="hero-location" aria-hidden="true">
          LUKANG
          <br />
          <i>鹿港</i>
        </span>
      </figure>
      {lang === 'en' && (
        <div className="hero-folio" aria-hidden="true">
          <span>LUKANG, TAIWAN</span>
          <span>A town. A story. Your own pace.</span>
          <span>01 — GtourLK</span>
        </div>
      )}
    </section>
  )
}
