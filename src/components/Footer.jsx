// 頁尾 — 編輯式低調風
import { BUSINESS } from '../data/business'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-paper-100/70">
      <div className="max-w-7xl mx-auto px-6 pt-14 md:pt-20 pb-8 md:pb-10">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 pb-10 md:pb-14 border-b border-paper-100/10">

          {/* 品牌區 */}
          <div className="md:col-span-5">
            <div className="font-display text-3xl text-paper-50 tracking-wide mb-1">
              GtourLK
            </div>
            <div className="font-serif text-sm tracking-[0.25em] text-paper-200 mb-4 md:mb-6">
              導 · 鹿
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              鹿港在地的電動觀光導覽品牌，
              帶你走訪米其林綠色指南推薦景點。
              一群熱愛鹿港的解說員，用行動讀寫這座古鎮。
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-4">
              {[
                ['Facebook', 'https://www.facebook.com/p/%E5%B0%8E%E9%B9%BFgtourlk-%E9%B9%BF%E6%B8%AF%E4%B8%89%E8%BC%AA%E8%BB%8A%E8%A7%80%E5%85%89%E5%B0%8E%E8%A6%BD-61566567161745/'],
                ['Instagram', 'https://www.instagram.com/gtourlk'],
                ['Threads',   'https://www.threads.net/@gtourlk'],
              ].map(([s, href]) => (
                <a key={s} href={href} target="_blank" rel="noopener noreferrer"
                  className="text-xs tracking-widest uppercase font-mono text-paper-100/50 hover:text-paper-50 border-b border-paper-100/15 hover:border-paper-50 pb-1 transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* 站內導航 */}
          <div className="md:col-span-3">
            <h4 className="eyebrow-light mb-5">Sitemap</h4>
            <ul className="grid grid-cols-2 gap-y-3 md:block md:space-y-3">
              {[
                ['#routes', '時間與景點'],
                ['#reviews',    '旅人評價'],
                ['#about',      '關於我們'],
                ['#faq',        '常見問題'],
                ['#contact',    '預約聯絡'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-sm hover:text-paper-50 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 聯絡資訊 — 三隻電話 */}
          <div className="md:col-span-4">
            <h4 className="eyebrow-light mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-paper-100/70">彰化縣鹿港鎮永寧街 236 號</li>
              <li className="text-paper-100/70">預約制・彈性安排出發時間</li>
              <li className="text-paper-100/70">LINE 　@lk167</li>
            </ul>

            <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-paper-100/10 space-y-2">
              {BUSINESS.phones.map(p => (
                <a key={p.tel} href={`tel:${p.tel}`}
                  className="flex items-center justify-between text-sm hover:text-paper-50 transition-colors">
                  <span className="text-paper-100/50 text-[11px] uppercase tracking-widest">{p.label}</span>
                  <span className="font-mono">{p.display}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 版權列 */}
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 text-[11px] tracking-wider">
          <div className="text-paper-100/40">
            © {new Date().getFullYear()} 導鹿 GtourLK　·　鹿港四輪電動車觀光導覽　·　All rights reserved.
          </div>
          <div className="text-paper-100/30 font-mono uppercase">
            Lukang · Changhua · Taiwan
          </div>
        </div>
      </div>
    </footer>
  )
}
