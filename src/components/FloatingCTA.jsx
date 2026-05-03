import { useState, useEffect } from 'react'

// 浮動 CTA — 低調、編輯式
// 預設只顯示一顆 LINE 按鈕；點開展開電話 + 地圖
export default function FloatingCTA() {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-2 mb-1">
          <Item href="tel:+886927013167" sub="王姐">0927-013-167</Item>
          <Item href="tel:+886927291828" sub="小郭">0927-291-828</Item>
          <Item href="tel:+88647740142"  sub="店面">(04) 7740-142</Item>
          <Item
            href="https://www.google.com/maps/search/?api=1&query=505彰化縣鹿港鎮永寧街236號"
            external sub="地址"
          >
            Google 地圖
          </Item>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* 主按鈕 — LINE */}
        <a
          href="https://line.me/R/ti/p/@137ebkaq"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-ink-800 hover:bg-ink-900 text-paper-50 pl-5 pr-4 py-3 shadow-lg transition-colors"
        >
          <span className="text-sm tracking-wider">LINE 預約</span>
          <span className="font-mono text-[10px] tracking-widest text-paper-200/70 uppercase">
            @137ebkaq
          </span>
        </a>

        {/* 展開更多選項按鈕 */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? '收起' : '更多聯絡方式'}
          className="w-11 h-11 bg-brick-500 hover:bg-brick-600 text-paper-50 shadow-lg transition-colors flex items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d={open ? "M6 18L18 6M6 6l12 12" : "M12 5v14M5 12h14"} />
          </svg>
        </button>
      </div>
    </div>
  )
}

function Item({ href, sub, external, children }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex items-center justify-end gap-3 bg-paper-50 hover:bg-paper-100 border border-ink-200 text-ink-700 pl-5 pr-4 py-2.5 shadow-md transition-colors"
    >
      <span className="font-mono text-[10px] tracking-widest uppercase text-ink-400">
        {sub}
      </span>
      <span className="text-sm">{children}</span>
    </a>
  )
}
