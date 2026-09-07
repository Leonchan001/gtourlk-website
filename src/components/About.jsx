import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { MEDIA } from '../data/media'
import { useLanguage } from '../i18n'
import Photo from './Photo'
export default function About() {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].people
  return (
    <section
      id="about"
      className="people-section section-space"
      aria-labelledby="about-title"
    >
      <div className="page-width people-layout">
        <figure className="people-photo">
          <Photo slot={MEDIA.guidePortrait ? 'guidePortrait' : 'localLife'} />
          <figcaption>
            {MEDIA.guidePortrait ? MEDIA.guidePortrait.alt[lang] : copy.caption}
          </figcaption>
        </figure>
        <div className="people-copy">
          <p className="eyebrow">06 / Your local company</p>
          <h2 id="about-title">
            {copy.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className="people-intro">{copy.intro}</p>
          <p className="body-copy">{copy.body}</p>
          <p className="people-sign">
            {copy.sign}
            <span>— GtourLK</span>
          </p>
          <p className="people-since">{copy.since}</p>
          <details className="other-services">
            <summary>{copy.extras}</summary>
            <ul>
              {copy.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
            <a className="text-link" href="#contact">
              {lang === 'zh' ? '和導鹿聊聊需求' : 'Tell us what you need'}
              <span aria-hidden="true">↗</span>
            </a>
          </details>
        </div>
      </div>
    </section>
  )
}
