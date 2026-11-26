import { BUSINESS, lineMessageUrl } from '../data/business'
import { useLanguage } from '../i18n'

// LINE + phone pair used in the menu, floating bar and mid-page prompts.
export function QuickContact({ location, className = '', showCall = true }) {
  const { copy } = useLanguage()
  const phone = BUSINESS.phones[0]
  return (
    <div className={`quick-contact ${className}`} data-analytics-location={location}>
      <a
        className="button quick-line"
        href={lineMessageUrl(copy.contact.hello)}
        target="_blank"
        rel="noreferrer"
      >
        {copy.contact.line}
        <span aria-hidden="true">↗</span>
      </a>
      {showCall && (
        <a
          className="quick-call"
          href={`tel:${phone.tel}`}
        >
          {copy.contact.call}{' '}
          <span className="quick-call-number">{phone.display}</span>
        </a>
      )}
    </div>
  )
}

export function MidCta({ id, title }) {
  const { copy } = useLanguage()
  return (
    <aside className="mid-cta" aria-label={title}>
      <div className="page-width mid-cta-inner">
        <div>
          <p className="mid-cta-title">{title}</p>
          <p className="mid-cta-note">{copy.contact.ask}</p>
        </div>
        <div className="mid-cta-actions">
          <QuickContact location={`mid_${id}`} />
          <a className="text-link mid-cta-plan" href="#contact">
            {copy.contact.planner} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
