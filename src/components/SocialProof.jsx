import { BUSINESS } from '../data/business'
import { REVIEW_COPY } from '../data/reviews'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
export default function SocialProof() {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].reviews
  return (
    <section
      id="reviews"
      className="reviews-section section-space"
      aria-labelledby="reviews-title"
    >
      <div className="page-width reviews-layout">
        <div className="reviews-rating">
          <p className="eyebrow">04 / Words from our guests</p>
          <p className="rating-number">{BUSINESS.reviewRating}</p>
          <p
            className="rating-stars"
            aria-label={lang === 'zh' ? '5 顆星' : '5 stars'}
          >
            ★★★★★
          </p>
          <p>Google Reviews / {BUSINESS.reviewCount}</p>
          <p className="small-copy">{copy.date}</p>
          <a
            className="text-link"
            href={BUSINESS.googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
          >
            {copy.all}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="reviews-quotes">
          <h2 id="reviews-title">{copy.title}</h2>
          {REVIEW_COPY[lang].reviews.slice(0, 3).map((review, i) => (
            <figure className={i === 0 ? 'review-lead' : ''} key={review.name}>
              <p className="review-theme">{review.tag}</p>
              <blockquote>{review.excerpt}</blockquote>
              <figcaption>
                <span>{review.name}</span>
              </figcaption>
            </figure>
          ))}
          <p className="small-copy">{copy.source}</p>
        </div>
      </div>
    </section>
  )
}
