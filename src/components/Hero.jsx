import { BUSINESS } from '../data/business'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
import Photo from './Photo'
export default function Hero() {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].hero
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{copy.kicker}</p>
        <h1 id="hero-title">
          {copy.lines.map((line, index) => (
            <span className={index === 2 ? 'hero-accent' : ''} key={line}>
              {line}
            </span>
          ))}
        </h1>
        <p className="hero-intro">{copy.intro}</p>
        <div className="hero-actions">
          <a href="#contact" className="button button-light">
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
          <a href={BUSINESS.googleReviewsUrl} target="_blank" rel="noreferrer">
            {BUSINESS.reviewRating} <span aria-hidden="true">★</span> Google /{' '}
            {BUSINESS.reviewCount} reviews
          </a>
          <span>{copy.metadata}</span>
        </div>
      </div>
      <figure className="hero-figure">
        <Photo slot="hero" priority sizes="(min-width: 1024px) 58vw, 100vw" />
        <figcaption>{copy.photo}</figcaption>
        <span className="hero-location" aria-hidden="true">
          LUKANG
          <br />
          <i>鹿港</i>
        </span>
      </figure>
    </section>
  )
}
