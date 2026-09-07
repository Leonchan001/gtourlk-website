import { BUSINESS } from '../data/business'
import { getFaqs } from '../data/faq'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
export default function FAQ() {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].faq
  return (
    <section
      id="faq"
      className="faq-section section-space"
      aria-labelledby="faq-title"
    >
      <div className="page-width faq-layout">
        <header>
          <p className="eyebrow">08 / Before you arrive</p>
          <h2 id="faq-title">
            {copy.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="body-copy">{copy.intro}</p>
          <a
            className="text-link"
            href={BUSINESS.lineUrl}
            target="_blank"
            rel="noreferrer"
          >
            {copy.cta} ↗
          </a>
        </header>
        <div>
          {getFaqs(lang).map((faq, i) => (
            <details className="faq-item" key={faq.q}>
              <summary>
                <span className="faq-number">0{i + 1}</span>
                <h3>{faq.q}</h3>
                <span className="faq-plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{faq.a}</p>
              {faq.links && (
                <div className="faq-links">
                  {faq.links.map((link) => (
                    <a
                      className="text-link"
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
