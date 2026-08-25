import { useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import { BUSINESS } from '../data/business'

const BOOKING_STEPS = [
  { no: '01', title: '日期與時間', body: '希望出發的日期、時間與導覽多久。' },
  { no: '02', title: '同行人數', body: '提供總人數，系統會協助安排車輛。' },
  { no: '03', title: '景點與需求', body: '必去地點、上下車處與乘車需求。' },
]

function formatMoney(amount) {
  if (!amount) return null
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Contact({ selectedPlan, clearPlan }) {
  const [copied, setCopied] = useState(false)

  const bookingText = useMemo(() => {
    const people = selectedPlan?.people ? `${selectedPlan.people} 人` : '（請填寫）'
    const duration = selectedPlan?.duration || '（請填寫）'
    const vehicleLine = selectedPlan?.vehicles ? `\n預計車輛：${selectedPlan.vehicles} 台` : ''
    const priceLine = selectedPlan?.linePrice
      ? `\nLINE 預約參考價：${formatMoney(selectedPlan.linePrice)}`
      : ''

    return `您好，我想預約導鹿四輪導覽車：

日期：
時間：
姓名：
電話：
人數：${people}
導覽時長：${duration}${vehicleLine}
參考安排：${selectedPlan?.title || '客製化導覽'}${priceLine}
上車地點：
下車地點：
必去景點或店家：
其他需求：

麻煩協助確認時段與實際費用，謝謝。`
  }, [selectedPlan])

  async function copyBookingText() {
    try {
      await navigator.clipboard.writeText(bookingText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-paper-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-8 mb-10 md:mb-20">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">N°06 — Contact</div>
            <div className="rule-thick w-12" />
          </div>
          <div className="md:col-span-9">
            <h2 className="section-title max-w-3xl">
              加 LINE、撥電話 ——<br />
              <span className="font-display italic">隨你方便。</span>
            </h2>
            <p className="lead mt-6 max-w-xl">
              全程採預約制。準備好日期、時間、人數與想去的景點，我們會協助完成安排；假日與連假建議提早三日聯繫。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px bg-ink-200 border border-ink-200 mb-8 md:mb-12">
          {BOOKING_STEPS.map(step => (
            <div key={step.no} className="bg-paper-50 p-3.5 sm:p-5 md:p-8">
              <div className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase text-brick-500 mb-2 md:mb-3">
                Step {step.no}
              </div>
              <h3 className="font-serif text-sm sm:text-base md:text-xl text-ink-800 md:mb-3 leading-snug">{step.title}</h3>
              <p className="hidden md:block text-sm text-ink-500 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="mb-10 border border-[#c9dce8] bg-[#f5f8fa] p-5 md:p-8" aria-live="polite">
            <div className="flex items-start justify-between gap-5 mb-6">
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-brick-600 mb-2">Booking summary</div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#0d2c4c]">預約資料已幫你整理好</h3>
                <p className="mt-2 text-sm text-ink-500">複製後開啟 LINE，補上日期、上下車地點與聯絡資料即可。</p>
              </div>
              <button
                type="button"
                onClick={clearPlan}
                aria-label="清除預約摘要"
                className="shrink-0 h-10 w-10 border border-ink-200 bg-white text-xl text-ink-500 hover:text-brick-500"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#c9dce8] border border-[#c9dce8] mb-5">
              <SummaryItem label="安排" value={selectedPlan.title} />
              <SummaryItem label="時間" value={selectedPlan.duration || '待確認'} />
              <SummaryItem label="人數" value={selectedPlan.people ? `${selectedPlan.people} 人` : '待確認'} />
              <SummaryItem
                label={selectedPlan.linePrice ? 'LINE 參考價' : '路線'}
                value={selectedPlan.linePrice ? formatMoney(selectedPlan.linePrice) : '可再客製'}
                accent={Boolean(selectedPlan.linePrice)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <button type="button" onClick={copyBookingText} className="btn-primary min-h-14 w-full">
                {copied ? '已複製，現在開啟 LINE' : '複製完整預約格式'}
                <span aria-hidden="true">{copied ? '✓' : '→'}</span>
              </button>
              <a
                href={BUSINESS.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-h-14 w-full"
              >
                開啟官方 LINE 貼上
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-12 gap-6 md:gap-8 mb-12 md:mb-20">
          <div className="md:col-span-7">
            <a
              href={BUSINESS.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-ink-800 text-paper-50 p-7 md:p-14 hover:bg-ink-900 transition-colors h-full"
            >
              <div className="flex items-center justify-between mb-7 md:mb-10">
                <div className="eyebrow-light">推薦預約方式</div>
                <span className="font-mono text-[10px] md:text-[11px] tracking-widest text-paper-200/60 uppercase">↗ Open LINE</span>
              </div>

              <h3 className="font-serif text-3xl md:text-4xl text-paper-50 mb-3">LINE 即時預約</h3>
              <p className="text-paper-200 text-sm md:text-base mb-7 md:mb-10">
                加入好友後貼上預約格式，客服就能一次掌握需求。
              </p>

              <div className="border-t border-paper-100/15 pt-6 md:pt-8 flex items-end justify-between gap-6">
                <div>
                  <div className="eyebrow-light mb-2">官方 LINE ID</div>
                  <div className="font-mono text-2xl md:text-3xl text-paper-50 tracking-wider">{BUSINESS.lineId}</div>
                  <span className="mt-4 inline-block text-sm tracking-wider border-b border-paper-50 pb-1 group-hover:border-brick-400 group-hover:text-brick-400 transition-colors">
                    加入好友並開始預約
                  </span>
                </div>
                <div className="hidden md:block bg-paper-50 p-3 shrink-0" onClick={event => event.preventDefault()}>
                  <QRCode value={BUSINESS.lineUrl} size={100} bgColor="#f8f4ef" fgColor="#1a1a18" />
                  <p className="text-center font-mono text-[9px] tracking-widest text-ink-400 mt-2">掃碼加好友</p>
                </div>
              </div>
            </a>
          </div>

          <div className="md:col-span-5">
            <div className="hidden md:block h-full">
              <div className="eyebrow mb-2">公司聯絡專線</div>
              <p className="text-[12px] text-ink-400 mb-5 leading-relaxed">
                三支號碼皆為導鹿 GtourLK 對外公司專線，由值班導覽員或店面客服接聽。
              </p>
              <PhoneLinks />
              <p className="mt-6 text-xs text-ink-400 leading-relaxed">夜間 19:00 後請優先以 LINE 聯繫，導覽員將於隔日 08:00 起回覆。</p>
            </div>

            <details className="md:hidden border-y border-ink-200">
              <summary className="min-h-14 flex cursor-pointer list-none items-center justify-between text-base text-ink-800">
                <span>需要電話聯絡？查看三支專線</span>
                <span className="text-brick-500">＋</span>
              </summary>
              <div className="pb-5"><PhoneLinks compact /></div>
            </details>
          </div>
        </div>

        <div className="hidden md:grid border-t border-ink-200 pt-12 md:grid-cols-3 gap-10 mb-12">
          <InfoBlock label="Studio" title="店面地址" line1="彰化縣鹿港鎮永寧街 236 號" line2="505 鹿港鎮埔崙里" link="https://maps.app.goo.gl/Ej2KZiMvKAzaCCxe7" linkText="開啟 Google 地圖" />
          <InfoBlock label="Hours" title="營業時間" line1="週一至週日　08:00 — 19:00" line2="預約制・出發時間依雙方約定" />
          <InfoBlock label="Social" title="社群追蹤" line1="Facebook · Instagram · Threads" line2="@gtourlk" link="https://www.facebook.com/p/%E5%B0%8E%E9%B9%BFgtourlk-%E9%B9%BF%E6%B8%AF%E4%B8%89%E8%BC%AA%E8%BB%8A%E8%A7%80%E5%85%89%E5%B0%8E%E8%A6%BD-61566567161745/" linkText="前往 Facebook 粉絲頁" />
        </div>

        <div className="hidden md:block border-t border-ink-200 pt-12">
          <div className="eyebrow mb-4">Location</div>
          <Map />
        </div>

        <details className="md:hidden border-y border-ink-200">
          <summary className="min-h-14 flex cursor-pointer list-none items-center justify-between text-base text-ink-800">
            <span>店面地址、營業時間與地圖</span>
            <span className="text-brick-500">＋</span>
          </summary>
          <div className="pb-6 space-y-7">
            <InfoBlock label="Studio" title="店面地址" line1="彰化縣鹿港鎮永寧街 236 號" line2="505 鹿港鎮埔崙里" link="https://maps.app.goo.gl/Ej2KZiMvKAzaCCxe7" linkText="開啟 Google 地圖" />
            <InfoBlock label="Hours" title="營業時間" line1="週一至週日　08:00 — 19:00" line2="預約制・出發時間依雙方約定" />
            <Map compact />
          </div>
        </details>
      </div>
    </section>
  )
}

function SummaryItem({ label, value, accent = false }) {
  return (
    <div className="bg-white p-4 min-w-0">
      <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mb-1">{label}</div>
      <div className={`font-serif text-base md:text-lg truncate ${accent ? 'text-brick-600' : 'text-ink-800'}`}>{value}</div>
    </div>
  )
}

function PhoneLinks({ compact = false }) {
  return (
    <div className="border-t border-ink-200">
      {BUSINESS.phones.map((phone, index) => (
        <a
          key={phone.tel}
          href={`tel:${phone.tel}`}
          className={`group flex items-center justify-between border-b border-ink-200 hover:border-brick-500 transition-colors ${compact ? 'py-4' : 'py-6'}`}
        >
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-ink-400 mb-1">0{index + 1} · Company Line</div>
            <div className="font-serif text-base md:text-lg text-ink-800 group-hover:text-brick-500">{phone.label}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-xl md:text-2xl text-ink-800 group-hover:text-brick-500">{phone.display}</div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mt-1">Tap to call →</div>
          </div>
        </a>
      ))}
    </div>
  )
}

function Map({ compact = false }) {
  return (
    <div className={`w-full overflow-hidden ${compact ? 'h-56' : 'h-72 md:h-96'}`}>
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
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm tracking-wider text-ink-700 hover:text-brick-500 border-b border-ink-700 hover:border-brick-500 pb-1">
          {linkText}
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  )
}
