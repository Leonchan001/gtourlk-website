import { useEffect, useState } from 'react'
import { QuickContact } from './QuickContact'
export default function FloatingCTA() {
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
    <div className="floating-booking">
      <QuickContact location="floating_bar" />
    </div>
  ) : null
}
