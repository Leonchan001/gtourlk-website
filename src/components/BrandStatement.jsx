import { useLanguage } from '../i18n'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import Photo from './Photo'

export default function BrandStatement() {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].brand
  return (
    <section
      className="brand-spread section-space"
      aria-labelledby="brand-title"
    >
      <div className="page-width brand-layout">
        <p className="eyebrow brand-label">01 / A town, told by its people</p>
        <h2 id="brand-title" className="brand-title">
          {copy.title.map((line, i) => (
            <span key={line} className={i === 2 ? 'accent' : ''}>
              {line}
            </span>
          ))}
        </h2>
        <div className="brand-aside">
          <p className="body-copy">{copy.body}</p>
          <figure>
            <Photo
              slot="streetDetail"
              sizes="(min-width: 768px) 260px, 180px"
            />
            <figcaption>{copy.caption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
