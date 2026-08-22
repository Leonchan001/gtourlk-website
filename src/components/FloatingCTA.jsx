import { useState, useEffect } from 'react'

const PRIMARY_PHONE = { tel: '+886927013167', display: '0927-013-167' }
const LINE_URL = 'https://line.me/R/ti/p/@lk167'

export default function FloatingCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {/* 電話一鍵撥打 */}
      <a
        href={`tel:${PRIMARY_PHONE.tel}`}
        aria-label={`撥打 ${PRIMARY_PHONE.display}`}
        className="w-12 h-12 bg-paper-50 border border-ink-200 hover:border-brick-500 text-ink-700 hover:text-brick-500 shadow-lg transition-colors flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      </a>

      {/* LINE 主按鈕 */}
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-ink-800 hover:bg-ink-900 text-paper-50 pl-5 pr-4 py-3 shadow-lg transition-colors"
      >
        <span className="text-sm tracking-wider">LINE 預約</span>
        <span className="font-mono text-[10px] tracking-widest text-paper-200/70 uppercase">
          @lk167
        </span>
      </a>
    </div>
  )
}
