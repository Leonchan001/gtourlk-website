import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n'
export default function FloatingCTA() {
  const { lang } = useLanguage()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('top')
      const booking = document.getElementById('contact')
      const atlas = document.getElementById('routes')?.getBoundingClientRect()
      setShow(
        Boolean(
          hero &&
            booking &&
            hero.getBoundingClientRect().bottom <= 0 &&
            booking.getBoundingClientRect().top > window.innerHeight &&
            (!atlas || atlas.bottom <= 64 || atlas.top >= window.innerHeight),
        ),
      )
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return show ? (
    <a href="#contact" className="floating-booking">
      {lang === 'zh' ? '安排我的鹿港' : 'Plan my Lukang'}
      <span aria-hidden="true">↗</span>
    </a>
  ) : null
}
