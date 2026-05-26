import QRCode from 'react-qr-code'

const PHONES = [
  { name: '預約專線 ①', tel: '+886927013167', display: '0927-013-167' },
  { name: '預約專線 ②', tel: '+886927291828', display: '0927-291-828' },
  { name: '客服總機',   tel: '+88647740142',  display: '(04) 7740-142' },
]

const LINE_URL = 'https://line.me/R/ti/p/@137ebkaq'
const LINE_ID = '@137ebkaq'

export default function Contact({ selectedPlan, clearPlan }) {
  return (
    <section id="contact" className="py-24 md:py-32 bg-paper-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-20">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">N°06 — Contact</div>
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

        {/* 已選行程提示條 */}
        {selectedPlan && (
          <div className="mb-8 flex items-center justify-between bg-brick-500 text-paper-50 px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-widest uppercase text-paper-50/70">已選擇行程</span>
              <span className="font-serif text-lg">{selectedPlan.title}</span>
              <span className="font-mono text-sm text-paper-50/80">{selectedPlan.duration}・NT${selectedPlan.price} / 人</span>
            </div>
            <button
              onClick={clearPlan}
              aria-label="清除選擇"
              className="font-mono text-paper-50/60 hover:text-paper-50 text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-12 gap-8 mb-20">
          {/* LINE 大方塊 */}
          <div className="md:col-span-7">
            <a
              href={LINE_URL}
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

              <div className="border-t border-paper-100/15 pt-8 flex items-end justify-between gap-6">
                <div>
                  <div className="eyebrow-light mb-2">官方 LINE ID</div>
                  <div className="font-mono text-2xl md:text-3xl text-paper-50 tracking-wider">
                    {LINE_ID}
                  </div>
                  <span className="mt-4 inline-block text-sm tracking-wider border-b border-paper-50 pb-1 group-hover:border-brick-400 group-hover:text-brick-400 transition-colors">
                    加入好友
                  </span>
                </div>
                {/* QR Code — 桌機顯示，手機上自己就在 LINE app 裡不需要掃 */}
                <div className="hidden md:block bg-paper-50 p-3 shrink-0" onClick={e => e.preventDefault()}>
                  <QRCode
                    value={LINE_URL}
                    size={100}
                    bgColor="#f8f4ef"
                    fgColor="#1a1a18"
                  />
                  <p className="text-center font-mono text-[9px] tracking-widest text-ink-400 mt-2">
                    掃碼加好友
                  </p>
                </div>
              </div>
            </a>
          </div>

          {/* 電話列表 */}
          <div className="md:col-span-5">
            <div className="eyebrow mb-2">公司聯絡專線</div>
            <p className="text-[12px] text-ink-400 mb-5 leading-relaxed">
              三支號碼皆為導鹿 GtourLK 對外公司專線，由值班導覽員或店面客服接聽。
            </p>
            <div className="border-t border-ink-200">
              {PHONES.map((p, i) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="group flex items-center justify-between py-6 border-b border-ink-200 hover:border-brick-500 transition-colors"
                >
                  <div>
                    <div className="font-mono text-[11px] tracking-widest uppercase text-ink-400 mb-1">
                      0{i + 1} · Company Line
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

        {/* 店面資訊 */}
        <div className="border-t border-ink-200 pt-12 grid md:grid-cols-3 gap-10 mb-12">
          <InfoBlock
            label="Studio"
            title="店面地址"
            line1="彰化縣鹿港鎮永寧街 236 號"
            line2="505 鹿港鎮埔崙里"
            link="https://maps.app.goo.gl/Ej2KZiMvKAzaCCxe7"
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
            link="https://www.facebook.com/p/%E5%B0%8E%E9%B9%BFgtourlk-%E9%B9%BF%E6%B8%AF%E4%B8%89%E8%BC%AA%E8%BB%8A%E8%A7%80%E5%85%89%E5%B0%8E%E8%A6%BD-61566567161745/"
            linkText="前往 Facebook 粉絲頁"
          />
        </div>

        {/* Google Maps embed */}
        <div className="border-t border-ink-200 pt-12">
          <div className="eyebrow mb-4">Location</div>
          <div className="w-full h-72 md:h-96 overflow-hidden">
            <iframe
              title="導鹿 GtourLK 店面位置"
              src="https://maps.google.com/maps?q=24.0537,120.4348&z=16&output=embed&hl=zh-TW"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
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
