import { useEffect, useRef, useState } from 'react'
import { EXPERIENCE_COPY } from '../data/experienceCopy'
import { useLanguage } from '../i18n'
import Photo from './Photo'
import { MEDIA_CREDITS } from '../data/media'

export default function ExperienceStory() {
  const { lang } = useLanguage()
  const copy = EXPERIENCE_COPY[lang].story
  const chapters = useRef([])
  const [active, setActive] = useState(0)
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      if (motion.matches) return
        const center = window.innerHeight * .4
        const nearest = chapters.current.filter(Boolean).map(chapter => {
          const rect = chapter.getBoundingClientRect()
          return { index: Number(chapter.dataset.chapter), distance: Math.abs(rect.top + rect.height / 2 - center) }
        }).sort((a, b) => a.distance - b.distance)[0]
        if (nearest) setActive(nearest.index)
    }
    // A tall mobile chapter can remain intersecting while its reading position
    // changes. Sample the five chapter bounds once per frame, without moving scroll.
    const schedule = () => { if (!motion.matches && !frame) frame = requestAnimationFrame(update) }
    schedule()
    motion.addEventListener('change', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); motion.removeEventListener('change', schedule); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])
  return (
    <section id="experience" className="experience-section section-space" aria-labelledby="experience-title">
      <div className="page-width">
        <header className="story-heading">
          <p className="eyebrow">03 / Along the way</p>
          <h2 id="experience-title">{copy.title.map(line => <span key={line}>{line}</span>)}</h2>
        </header>
        <div className="story-spread">
          <figure className="story-still">
            <Photo slot="architecture" sizes="(min-width: 1024px) 55vw, 100vw" />
            <figcaption>
              <span>{lang === 'zh' ? '辜家大宅 / 在建築裡，讀鹿港的不同時代' : 'Koo Family Mansion / A town’s history, held in its architecture'}</span>
              <span className="story-progress" aria-hidden="true">0{active + 1} / 05</span>
            </figcaption>
            <div className="story-progress-rule" aria-hidden="true"><span style={{ transform: `scaleX(${(active + 1) / 5})` }} /></div>
          </figure>
          <div className="story-chapters">
            {copy.steps.map(([label, title, body], index) => (
              <article key={label} ref={el => { chapters.current[index] = el }} data-chapter={index} className={`story-step ${active === index ? 'is-current' : ''}`}>
                <span className="story-number" aria-hidden="true">0{index + 1}</span>
                <div><p className="eyebrow">{label}</p><h3>{title}</h3><p className="body-copy">{body}</p></div>
              </article>
            ))}
          </div>
        </div>
        <div className="story-coda">
          <figure>
            <Photo slot="templeDetail" sizes="(min-width: 768px) 480px, 85vw" />
            <figcaption>
              <a href={MEDIA_CREDITS.templeDetail.source} target="_blank" rel="noreferrer">{MEDIA_CREDITS.templeDetail[lang]}</a>
              {' · '}
              <a href={MEDIA_CREDITS.templeDetail.license} target="_blank" rel="noreferrer">{lang === 'zh' ? '政府資料開放授權條款第 1 版' : 'Open Government Data License v1.0'}</a>
            </figcaption>
          </figure>
          <aside className="access-note"><h3>{copy.access}</h3><p>{copy.accessBody}</p></aside>
        </div>
      </div>
    </section>
  )
}
