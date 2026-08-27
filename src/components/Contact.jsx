import { useMemo, useState } from 'react'
import QRCode from 'react-qr-code'
import { BUSINESS } from '../data/business'
import { getTourDurationPrompt } from '../data/tours'
import { useLanguage } from '../i18n'

const CONTACT_COPY = {
  zh: {
    title: <>加 LINE、撥電話 ——<br /><span className="font-display italic">隨你方便。</span></>,
    intro: '全程採預約制。準備好日期、出發時間、人數，並從 60、90、150 分鐘選一種；有必去景點就一起告訴我們。假日與連假建議提早三日聯繫。',
    steps: [
      { no: '01', title: '日期與時間', body: '希望出發的日期、時間，以及 60／90／150 分鐘三選一。' },
      { no: '02', title: '同行人數', body: '提供總人數，方便我們安排車輛。' },
      { no: '03', title: '景點與需求', body: '必去地點、上下車處與乘車需求。' },
    ],
    summaryEyebrow: 'Booking summary',
    summaryTitle: '預約資料已幫你整理好',
    summaryIntro: '複製後開啟 LINE，補上日期、上下車地點與聯絡資料即可。',
    clearSummary: '清除預約摘要',
    summaryLabels: { plan: '安排', duration: '時間', guests: '人數', linePrice: 'LINE 參考價', route: '路線' },
    pending: '待確認',
    guests: count => `${count} 人`,
    customisable: '可再客製',
    copied: '已複製，現在開啟 LINE',
    copyTemplate: '複製完整預約格式',
    openLinePaste: '開啟官方 LINE 貼上',
    recommended: '推薦預約方式',
    openLine: 'Open LINE',
    lineTitle: 'LINE 即時預約',
    lineIntro: '加入好友後貼上預約格式，客服就能一次掌握需求。',
    lineId: '官方 LINE ID',
    addLine: '加入好友並開始預約',
    scanLine: '掃碼加好友',
    companyLines: '公司聯絡專線',
    companyLinesIntro: '三支號碼皆為導鹿 GtourLK 對外公司專線，由值班導覽員或店面客服接聽。',
    nightNote: '夜間 19:00 後請優先以 LINE 聯繫，導覽員將於隔日 08:00 起回覆。',
    phoneDetails: '需要電話聯絡？查看三支專線',
    companyLine: '公司專線',
    tapCall: '點擊撥號 →',
    studio: '店面地址',
    address1: '彰化縣鹿港鎮永寧街 236 號',
    address2: '505 鹿港鎮埔崙里',
    hours: '營業時間',
    hours1: '週一至週日　08:00 — 19:00',
    hours2: '預約制・出發時間依雙方約定',
    social: '社群追蹤',
    maps: '開啟 Google 地圖',
    facebook: '前往 Facebook 粉絲頁',
    addressDetails: '店面地址、營業時間與地圖',
    mapTitle: '導鹿 GtourLK 店面位置',
    bookingText: ({ people, duration, vehicleLine, title, routeLine, priceLine }) => `您好，我想預約導鹿四輪導覽車：\n\n日期：\n時間：\n姓名：\n電話：\n人數：${people}\n導覽時長：${duration}${vehicleLine}\n參考安排：${title}${routeLine}${priceLine}\n上車地點：\n下車地點：\n必去景點或店家：（沒有想法可填「交給導覽員安排」）\n其他需求：\n\n麻煩協助確認時段與實際費用，謝謝。`,
    fillIn: '（請填寫）',
    chooseOne: prompt => `${prompt} 分鐘（請擇一）`,
    vehicleLine: value => `\n預計車輛：${value} 台`,
    priceLine: value => `\nLINE 預約參考價：${value}`,
    routeLine: stops => `\n參考景點：${stops.join('、')}`,
    customTour: '客製化導覽',
  },
  en: {
    title: <>Book on LINE or call us—<br /><span className="font-display italic">whichever is easier.</span></>,
    intro: 'All tours are by reservation. Have your date, preferred departure time and group size ready, choose 60, 90 or 150 minutes, and tell us any must-see places. For weekends and public holidays, please contact us around three days in advance.',
    steps: [
      { no: '01', title: 'Date & time', body: 'Your preferred departure date and time, plus one duration: 60, 90 or 150 minutes.' },
      { no: '02', title: 'Group size', body: 'Tell us the total number of guests so we can arrange the right number of vehicles.' },
      { no: '03', title: 'Sights & needs', body: 'Must-see sights, pick-up and drop-off points, and any accessibility needs.' },
    ],
    summaryEyebrow: 'Booking summary',
    summaryTitle: 'Your booking details are ready',
    summaryIntro: 'Copy this, open LINE, then add your date, pick-up point, drop-off point and contact details.',
    clearSummary: 'Clear booking summary',
    summaryLabels: { plan: 'Tour', duration: 'Duration', guests: 'Guests', linePrice: 'LINE estimate', route: 'Route' },
    pending: 'To be confirmed',
    guests: count => `${count} guest${count === 1 ? '' : 's'}`,
    customisable: 'Can be tailored',
    copied: 'Copied — now open LINE',
    copyTemplate: 'Copy full booking template',
    openLinePaste: 'Open official LINE and paste',
    recommended: 'Recommended booking method',
    openLine: 'Open LINE',
    lineTitle: 'Book instantly on LINE',
    lineIntro: 'Add us as a friend and paste the booking template so our team can understand your needs at a glance.',
    lineId: 'Official LINE ID',
    addLine: 'Add us and start booking',
    scanLine: 'Scan to add us',
    companyLines: 'Company contact lines',
    companyLinesIntro: 'All three numbers are official GtourLK contact lines, answered by an on-duty guide or shop team member.',
    nightNote: 'After 7:00 pm, please contact us on LINE first. Our guides reply from 8:00 am the following day.',
    phoneDetails: 'Need to call? View all three contact lines',
    companyLine: 'Company line',
    tapCall: 'Tap to call →',
    studio: 'Studio address',
    address1: 'No. 236, Yongning St., Lukang Township',
    address2: 'Changhua County 505, Taiwan',
    hours: 'Opening hours',
    hours1: 'Daily · 8:00 am–7:00 pm',
    hours2: 'By reservation · departure time agreed individually',
    social: 'Follow us',
    maps: 'Open in Google Maps',
    facebook: 'Visit our Facebook page',
    addressDetails: 'Address, opening hours & map',
    mapTitle: 'GtourLK studio location',
    bookingText: ({ people, duration, vehicleLine, title, routeLine, priceLine }) => `Hello, I would like to book a GtourLK electric tour vehicle:\n\nDate:\nPreferred departure time:\nName:\nPhone / WhatsApp:\nNumber of guests: ${people}\nTour duration: ${duration}${vehicleLine}\nTour idea: ${title}${routeLine}${priceLine}\nPick-up point:\nDrop-off point:\nMust-see sights or shops:\n(If you have no preference, please write “Please let the guide arrange it.”)\nAccessibility or other requests:\n\nPlease help confirm availability and the final tour fee. Thank you.`,
    fillIn: '(please add)',
    chooseOne: prompt => `${prompt} minutes (choose one)`,
    vehicleLine: value => `\nEstimated vehicles: ${value}`,
    priceLine: value => `\nOfficial LINE estimate: ${value}`,
    routeLine: stops => `\nSuggested sights: ${stops.join(', ')}`,
    customTour: 'Custom tour',
  },
}

function formatMoney(amount, lang) {
  if (!amount) return null
  return `NT$${new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'zh-TW', {
    maximumFractionDigits: 0,
  }).format(amount)}`
}

export default function Contact({ selectedPlan, clearPlan }) {
  const { lang } = useLanguage()
  const copy = CONTACT_COPY[lang]
  const [copied, setCopied] = useState(false)

  const bookingText = useMemo(() => {
    const people = selectedPlan?.people ? copy.guests(selectedPlan.people) : copy.fillIn
    const duration = selectedPlan?.duration || copy.chooseOne(getTourDurationPrompt(lang))
    const vehicleLine = selectedPlan?.vehicles ? copy.vehicleLine(selectedPlan.vehicles) : ''
    const priceLine = selectedPlan?.linePrice
      ? copy.priceLine(formatMoney(selectedPlan.linePrice, lang))
      : ''
    const routeLine = selectedPlan?.stops?.length
      ? copy.routeLine(selectedPlan.stops)
      : ''

    return copy.bookingText({
      people,
      duration,
      vehicleLine,
      title: selectedPlan?.title || copy.customTour,
      routeLine,
      priceLine,
    })
  }, [copy, lang, selectedPlan])

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
              {copy.title}
            </h2>
            <p className="lead mt-6 max-w-xl">
              {copy.intro}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px bg-ink-200 border border-ink-200 mb-8 md:mb-12">
          {copy.steps.map(step => (
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
                <div className="font-mono text-[10px] tracking-widest uppercase text-brick-600 mb-2">{copy.summaryEyebrow}</div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#0d2c4c]">{copy.summaryTitle}</h3>
                <p className="mt-2 text-sm text-ink-500">{copy.summaryIntro}</p>
              </div>
              <button
                type="button"
                onClick={clearPlan}
                aria-label={copy.clearSummary}
                className="shrink-0 h-10 w-10 border border-ink-200 bg-white text-xl text-ink-500 hover:text-brick-500"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#c9dce8] border border-[#c9dce8] mb-5">
              <SummaryItem label={copy.summaryLabels.plan} value={selectedPlan.title} />
              <SummaryItem label={copy.summaryLabels.duration} value={selectedPlan.duration || copy.pending} />
              <SummaryItem label={copy.summaryLabels.guests} value={selectedPlan.people ? copy.guests(selectedPlan.people) : copy.pending} />
              <SummaryItem
                label={selectedPlan.linePrice ? copy.summaryLabels.linePrice : copy.summaryLabels.route}
                value={selectedPlan.linePrice ? formatMoney(selectedPlan.linePrice, lang) : copy.customisable}
                accent={Boolean(selectedPlan.linePrice)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <button type="button" onClick={copyBookingText} className="btn-primary min-h-14 w-full">
                {copied ? copy.copied : copy.copyTemplate}
                <span aria-hidden="true">{copied ? '✓' : '→'}</span>
              </button>
              <a
                href={BUSINESS.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary min-h-14 w-full"
              >
                {copy.openLinePaste}
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
                <div className="eyebrow-light">{copy.recommended}</div>
                <span className="font-mono text-[10px] md:text-[11px] tracking-widest text-paper-200/60 uppercase">↗ {copy.openLine}</span>
              </div>

              <h3 className="font-serif text-3xl md:text-4xl text-paper-50 mb-3">{copy.lineTitle}</h3>
              <p className="text-paper-200 text-sm md:text-base mb-7 md:mb-10">
                {copy.lineIntro}
              </p>

              <div className="border-t border-paper-100/15 pt-6 md:pt-8 flex items-end justify-between gap-6">
                <div>
                  <div className="eyebrow-light mb-2">{copy.lineId}</div>
                  <div className="font-mono text-2xl md:text-3xl text-paper-50 tracking-wider">{BUSINESS.lineId}</div>
                  <span className="mt-4 inline-block text-sm tracking-wider border-b border-paper-50 pb-1 group-hover:border-brick-400 group-hover:text-brick-400 transition-colors">
                    {copy.addLine}
                  </span>
                </div>
                <div className="hidden md:block bg-paper-50 p-3 shrink-0" onClick={event => event.preventDefault()}>
                  <QRCode value={BUSINESS.lineUrl} size={100} bgColor="#f8f4ef" fgColor="#1a1a18" />
                  <p className="text-center font-mono text-[9px] tracking-widest text-ink-400 mt-2">{copy.scanLine}</p>
                </div>
              </div>
            </a>
          </div>

          <div className="md:col-span-5">
            <div className="hidden md:block h-full">
              <div className="eyebrow mb-2">{copy.companyLines}</div>
              <p className="text-[12px] text-ink-400 mb-5 leading-relaxed">
                {copy.companyLinesIntro}
              </p>
              <PhoneLinks />
              <p className="mt-6 text-xs text-ink-400 leading-relaxed">{copy.nightNote}</p>
            </div>

            <details className="md:hidden border-y border-ink-200">
              <summary className="min-h-14 flex cursor-pointer list-none items-center justify-between text-base text-ink-800">
                <span>{copy.phoneDetails}</span>
                <span className="text-brick-500">＋</span>
              </summary>
              <div className="pb-5"><PhoneLinks compact /></div>
            </details>
          </div>
        </div>

        <div className="hidden md:grid border-t border-ink-200 pt-12 md:grid-cols-3 gap-10 mb-12">
          <InfoBlock label="Studio" title={copy.studio} line1={copy.address1} line2={copy.address2} link="https://maps.app.goo.gl/Ej2KZiMvKAzaCCxe7" linkText={copy.maps} />
          <InfoBlock label="Hours" title={copy.hours} line1={copy.hours1} line2={copy.hours2} />
          <InfoBlock label="Social" title={copy.social} line1="Facebook · Instagram · Threads" line2="@gtourlk" link="https://www.facebook.com/p/%E5%B0%8E%E9%B9%BFgtourlk-%E9%B9%BF%E6%B8%AF%E4%B8%89%E8%BC%AA%E8%BB%8A%E8%A7%80%E5%85%89%E5%B0%8E%E8%A6%BD-61566567161745/" linkText={copy.facebook} />
        </div>

        <div className="hidden md:block border-t border-ink-200 pt-12">
          <div className="eyebrow mb-4">Location</div>
          <Map />
        </div>

        <details className="md:hidden border-y border-ink-200">
          <summary className="min-h-14 flex cursor-pointer list-none items-center justify-between text-base text-ink-800">
            <span>{copy.addressDetails}</span>
            <span className="text-brick-500">＋</span>
          </summary>
          <div className="pb-6 space-y-7">
            <InfoBlock label="Studio" title={copy.studio} line1={copy.address1} line2={copy.address2} link="https://maps.app.goo.gl/Ej2KZiMvKAzaCCxe7" linkText={copy.maps} />
            <InfoBlock label="Hours" title={copy.hours} line1={copy.hours1} line2={copy.hours2} />
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
  const { lang, copy: siteCopy } = useLanguage()
  const copy = CONTACT_COPY[lang]

  return (
    <div className="border-t border-ink-200">
      {BUSINESS.phones.map((phone, index) => (
        <a
          key={phone.tel}
          href={`tel:${phone.tel}`}
          className={`group flex items-center justify-between border-b border-ink-200 hover:border-brick-500 transition-colors ${compact ? 'py-4' : 'py-6'}`}
        >
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase text-ink-400 mb-1">0{index + 1} · {copy.companyLine}</div>
            <div className="font-serif text-base md:text-lg text-ink-800 group-hover:text-brick-500">{siteCopy.header.phoneLabels[index]}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-xl md:text-2xl text-ink-800 group-hover:text-brick-500">{phone.display}</div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mt-1">{copy.tapCall}</div>
          </div>
        </a>
      ))}
    </div>
  )
}

function Map({ compact = false }) {
  const { lang } = useLanguage()
  const copy = CONTACT_COPY[lang]

  return (
    <div className={`w-full overflow-hidden ${compact ? 'h-56' : 'h-72 md:h-96'}`}>
      <iframe
        key={lang}
        title={copy.mapTitle}
        src={`https://maps.google.com/maps?q=24.0537,120.4348&z=16&output=embed&hl=${lang === 'en' ? 'en' : 'zh-TW'}`}
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
