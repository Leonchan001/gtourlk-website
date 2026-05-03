// 聯絡預約 — 編輯式版面，三隻電話、LINE、地址
const PHONES = [
  { name: '王姐 · 導覽行程',  tel: '+886927013167', display: '0927-013-167' },
  { name: '小郭 · 導覽行程',  tel: '+886927291828', display: '0927-291-828' },
  { name: '店面 · 一般洽詢',  tel: '+88647740142',  display: '(04) 7740-142' },
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-paper-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* 章節標題 */}
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-20">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">N°05 — Contact</div>
            <div className="rule-thick w-12" />
          </div>
          <div className="md:col-span-9">
            <h2 className="section-title max-w-3xl">
              寫信、撥電話、加 LINE ——<br />
              <span className="font-display italic">隨你方便。</span>
            </h2>
            <p className="lead mt-6 max-w-xl">
              平均 30 分鐘內回覆。平日臨時預約也歡迎，
              假日場次建議提早三日聯繫，以保留你想要的時段。
            </p>
          </div>
        </div>

        {/* 主要 CTA — LINE 大方塊 */}
        <div className="grid md:grid-cols-12 gap-8 mb-20">
          <div className="md:col-span-7">
            <a
              href="https://line.me/R/ti/p/@137ebkaq"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-ink-800 text-paper-50 p-10 md:p-14 hover:bg-ink-900 transition-colors h-full"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="eyebrow-light">推薦預約方式</div>
                <span className="font-mono text-[11px] tracking-widest text-paper-200/60 uppercase">
                  ↗ Open LINE
                </span>
              </div>

              <h3 className="font-serif text-3xl md:text-4xl text-paper-50 mb-3">
                LINE 即時預約
              </h3>
              <p className="font-display italic text-paper-200 text-lg mb-10">
                Add friend, send a message, done.
              </p>

              <div className="border-t border-paper-100/15 pt-8 flex items-end justify-between">
                <div>
                  <div className="eyebrow-light mb-2">官方 LINE ID</div>
                  <div className="font-mono text-2xl md:text-3xl text-paper-50 tracking-wider">
                    @137ebkaq
                  </div>
                </div>
                <span className="text-sm tracking-wider border-b border-paper-50 pb-1 group-hover:border-brick-400 group-hover:text-brick-400 transition-colors">
                  加入好友
                </span>
              </div>
            </a>
          </div>

          {/* 三隻電話 — 直立列表 */}
          <div className="md:col-span-5">
            <div className="eyebrow mb-5">直撥電話</div>
            <div className="border-t border-ink-200">
              {PHONES.map((p, i) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="group flex items-center justify-between py-6 border-b border-ink-200 hover:border-brick-500 transition-colors"
                >
                  <div>
                    <div className="font-mono text-[11px] tracking-widest uppercase text-ink-400 mb-1">
                      0{i + 1}
                    </div>
                    <div className="font-serif text-lg text-ink-800 group-hover:text-brick-500 transition-colors">
                      {p.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl md:text-2xl text-ink-800 group-hover:text-brick-500 transition-colors">
                      {p.display}
                    </div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-ink-400 mt-1">
                      Tap to call →
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <p className="mt-6 text-xs text-ink-400 leading-relaxed">
              夜間 19:00 後請優先以 LINE 聯繫，導覽員將於隔日 08:00 起回覆。
            </p>
          </div>
        </div>

        {/* 店面資訊 — 三欄細線 */}
        <div className="border-t border-ink-200 pt-12 grid md:grid-cols-3 gap-10">
          <InfoBlock
            label="Studio"
            title="店面地址"
            line1="彰化縣鹿港鎮永寧街 236 號"
            line2="505 鹿港鎮埔崙里"
            link="https://www.google.com/maps/search/?api=1&query=505彰化縣鹿港鎮永寧街236號"
            linkText="開啟 Google 地圖"
          />
          <InfoBlock
            label="Hours"
            title="營業時間"
            line1="週一至週日　08:00 — 19:00"
            line2="夜間預約請先 LINE 聯繫"
          />
          <InfoBlock
            label="Social"
            title="社群追蹤"
            line1="Facebook · Instagram · Threads"
            line2="@gtourlk"
          />
        </div>
      </div>
    </section>
  )
}

function InfoBlock({ label, title, line1, line2, link, linkText }) {
  return (
    <div>
      <div className="eyebrow mb-3">{label}</div>
      <h4 className="font-serif text-xl text-ink-800 mb-4">{title}</h4>
      <p className="text-ink-600 leading-relaxed">{line1}</p>
      <p className="text-ink-400 text-sm mt-1">{line2}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-sm tracking-wider text-ink-700 hover:text-brick-500 border-b border-ink-700 hover:border-brick-500 pb-1"
        >
          {linkText}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      )}
    </div>
  )
}
