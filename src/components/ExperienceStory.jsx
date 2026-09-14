import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
import Photo from './Photo'
import { MEDIA_CREDITS } from '../data/media'

export default function ExperienceStory() {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].story
  const step = (index, className = '') => (
    <article className={`story-step ${className}`}>
      <span className="story-number" aria-hidden="true">
        0{index + 1}
      </span>
      <div>
        <p className="eyebrow">{copy.steps[index][0]}</p>
        <h3>{copy.steps[index][1]}</h3>
        <p className="body-copy">{copy.steps[index][2]}</p>
      </div>
    </article>
  )
  return (
    <section
      id="experience"
      className="experience-section section-space"
      aria-labelledby="experience-title"
    >
      <div className="page-width">
        <div className="story-opening">
          <header>
            <p className="eyebrow">03 / Along the way</p>
            <h2 id="experience-title">
              {copy.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </header>
          {step(0)}
        </div>
        <figure className="story-panorama">
          <Photo
            slot="townOverview"
            sizes="(min-width: 1440px) 1280px, 100vw"
          />
          <figcaption>{copy.caption}</figcaption>
        </figure>
        <div className="story-middle">
          {step(1)}
          {step(2)}
        </div>
        <div className="story-ending">
          <figure>
            <Photo
              slot="templeDetail"
              sizes="(min-width: 768px) 480px, 90vw"
            />
            <figcaption>
              <a href={MEDIA_CREDITS.templeDetail.source} target="_blank" rel="noreferrer">
                {MEDIA_CREDITS.templeDetail[lang]}
              </a>
              {' · '}
              <a href={MEDIA_CREDITS.templeDetail.license} target="_blank" rel="noreferrer">
                {lang === 'zh' ? '政府資料開放授權條款第 1 版' : 'Open Government Data License v1.0'}
              </a>
            </figcaption>
          </figure>
          <div>
            {step(3)}
            {step(4)}
          </div>
        </div>
        <aside className="access-note">
          <h3>{copy.access}</h3>
          <p>{copy.accessBody}</p>
        </aside>
      </div>
    </section>
  )
}
