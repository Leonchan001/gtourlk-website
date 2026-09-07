import { useEffect, useRef } from 'react'
import { BUSINESS } from '../data/business'
import {
  CAMPAIGN_COPY,
  COUPON_LINE_URL,
  CAMPAIGN_SOURCE_URL,
  isCampaignActive,
} from '../data/campaign'
import { useLanguage } from '../i18n'
export default function CampaignSpotlight() {
  const { lang, clock } = useLanguage()
  const copy = CAMPAIGN_COPY[lang]
  const disclosure = useRef(null)
  useEffect(() => {
    const reveal = () => {
      if (window.location.hash === '#campaign' && disclosure.current)
        disclosure.current.open = true
    }
    reveal()
    window.addEventListener('hashchange', reveal)
    return () => window.removeEventListener('hashchange', reveal)
  }, [])
  if (!isCampaignActive(clock)) return null
  return (
    <aside className="campaign-bar" aria-label={copy.noticeLabel}>
      <details id="campaign" ref={disclosure}>
        <summary className="page-width">
          <span className="campaign-label">{copy.noticeLabel}</span>
          <span>{copy.noticeText}</span>
          <span className="campaign-expand" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="campaign-details page-width">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2>
              {copy.offerTitle} · {copy.offerAmount}
            </h2>
            <p>{copy.intro}</p>
            <ol>
              {copy.steps.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3>{copy.rulesTitle}</h3>
            <ul>
              {copy.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <p className="campaign-example">
              {copy.exampleLabel} / {copy.exampleList} → NT$1,425 → NT$1,375
            </p>
            <a
              className="text-link"
              href={COUPON_LINE_URL}
              target="_blank"
              rel="noreferrer"
            >
              {copy.couponCta} ↗
            </a>
            <a
              className="text-link"
              href={BUSINESS.lineUrl}
              target="_blank"
              rel="noreferrer"
            >
              {copy.bookingCta} ↗
            </a>
            <p className="small-copy">{copy.distinction}</p>
            <a
              className="text-link"
              href={CAMPAIGN_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
            >
              {copy.source} ↗
            </a>
          </div>
        </div>
      </details>
    </aside>
  )
}
