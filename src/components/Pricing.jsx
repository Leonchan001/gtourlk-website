import { useMemo, useState } from 'react'
import { getTourDurations, TOUR_PRICING } from '../data/tours'
import { useLanguage } from '../i18n'

const PRICING_COPY = {
  zh: {
    eyebrow: 'Clear & Flexible Pricing',
    titleFirst: '三種時間，',
    titleSecond: '價格清楚透明。',
    intro: '60 分鐘起訂，可選 60、90 或 150 分鐘。指定想去的景點或店家，其餘交給熟悉鹿港的導覽員安排。',
    pills: ['60 分鐘起訂', '60／90／150 分鐘', '路線可客製'],
    oneToTwo: '1–2 人',
    perVehicleBilling: '整車計費',
    perVehicleHour: '每車／小時',
    threePlus: '3 人以上',
    totalGuestBilling: '依總人數計費',
    perGuestHour: '每人／小時',
    capacityLabel: 'Capacity',
    capacity: count => `每車可坐 ${count} 位成人`,
    moreGuestsLabel: 'More Guests',
    moreGuests: '6 人起安排多台車',
    estimateEyebrow: 'Quick Estimate',
    estimateTitle: '選人數、選時間，立即看懂費用',
    estimateNote: '試算不會送出預約，可放心操作',
    chooseGuests: '選擇總人數',
    decreaseGuest: '減少一位旅客',
    increaseGuest: '增加一位旅客',
    guestCount: count => `${count} 人`,
    estimatedVehicles: '預估所需車輛',
    perVehicleCapacity: count => `每車 ${count} 人`,
    vehicleCount: count => `約需 ${count} 台`,
    chooseDuration: '選擇導覽時間',
    minuteUnit: '分鐘',
    costEstimate: '費用試算',
    lineDiscount: 'LINE 預約 95 折',
    listTotal: '牌價合計',
    lineReference: '官方 LINE 預約參考價',
    summary: (people, vehicles, duration) => `${people} 位旅客|${vehicles} 台車・${duration} 分鐘`,
    book: '用這個條件開始預約',
    note: '實際車輛與時段須由專人確認；購物、排隊、用餐及景點停留皆計入導覽時間。',
    formulaVehicle: hours => `每車 NT$${TOUR_PRICING.oneToTwoHourly} × ${hours} 小時`,
    formulaGuest: (people, hours) => `${people} 人 × 每人 NT$${TOUR_PRICING.threePlusHourlyPerPerson} × ${hours} 小時`,
    customTour: '客製化導覽',
    selectedDuration: duration => `${duration} 分鐘`,
  },
  en: {
    eyebrow: 'Clear & Flexible Pricing',
    titleFirst: 'Three tour lengths.',
    titleSecond: 'One clear price.',
    intro: 'Tours start at 60 minutes, with 60, 90 and 150-minute options. Choose your must-see sights or shops, then let a Lukang local shape the rest of your route.',
    pills: ['60-minute minimum', '60 / 90 / 150 minutes', 'Custom route'],
    oneToTwo: '1–2 guests',
    perVehicleBilling: 'Charged per vehicle',
    perVehicleHour: 'per vehicle / hour',
    threePlus: '3+ guests',
    totalGuestBilling: 'Charged by total guests',
    perGuestHour: 'per guest / hour',
    capacityLabel: 'Capacity',
    capacity: count => `${count} adults per vehicle`,
    moreGuestsLabel: 'Larger Groups',
    moreGuests: 'Groups of 6+ use multiple vehicles',
    estimateEyebrow: 'Quick Estimate',
    estimateTitle: 'Choose your group size and tour length',
    estimateNote: 'This calculator does not submit a booking',
    chooseGuests: 'Total guests',
    decreaseGuest: 'Remove one guest',
    increaseGuest: 'Add one guest',
    guestCount: count => `${count} ${count === 1 ? 'guest' : 'guests'}`,
    estimatedVehicles: 'Estimated vehicles',
    perVehicleCapacity: count => `${count} guests per vehicle`,
    vehicleCount: count => `${count} ${count === 1 ? 'vehicle' : 'vehicles'}`,
    chooseDuration: 'Tour length',
    minuteUnit: 'min',
    costEstimate: 'Your estimate',
    lineDiscount: '5% off when booking via LINE',
    listTotal: 'Standard total',
    lineReference: 'Estimated price when booking via official LINE',
    summary: (people, vehicles, duration) => `${people} ${people === 1 ? 'guest' : 'guests'}|${vehicles} ${vehicles === 1 ? 'vehicle' : 'vehicles'} · ${duration} min`,
    book: 'Book with these details',
    note: 'Vehicle availability and departure time require confirmation. Shopping, queues, meals and time at each sight are included in your tour time.',
    formulaVehicle: hours => `NT$${TOUR_PRICING.oneToTwoHourly} per vehicle × ${hours} ${hours === 1 ? 'hour' : 'hours'}`,
    formulaGuest: (people, hours) => `${people} guests × NT$${TOUR_PRICING.threePlusHourlyPerPerson} per guest × ${hours} ${hours === 1 ? 'hour' : 'hours'}`,
    customTour: 'Custom private tour',
    selectedDuration: duration => `${duration} minutes`,
  },
}

function currency(amount, lang) {
  return `NT$${new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'zh-TW', {
    maximumFractionDigits: 0,
  }).format(amount)}`
}

export default function Pricing({ onBook }) {
  const { lang } = useLanguage()
  const copy = PRICING_COPY[lang]
  const tourDurations = getTourDurations(lang)
  const [people, setPeople] = useState(2)
  const [duration, setDuration] = useState(60)

  const estimate = useMemo(() => {
    const hours = duration / 60
    const vehicles = Math.ceil(people / TOUR_PRICING.guestsPerVehicle)
    const total = people <= 2
      ? TOUR_PRICING.oneToTwoHourly * hours
      : TOUR_PRICING.threePlusHourlyPerPerson * people * hours
    const linePrice = Math.round(total * TOUR_PRICING.lineDiscountRate)
    const formula = people <= 2
      ? copy.formulaVehicle(hours)
      : copy.formulaGuest(people, hours)

    return { total, linePrice, vehicles, formula }
  }, [copy, people, duration])

  const [summaryFirst, summarySecond] = copy.summary(people, estimate.vehicles, duration).split('|')

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative overflow-hidden border-y border-ink-100 bg-[#f7f3ea] text-ink-800 mb-24 scroll-mt-24"
    >
      <div aria-hidden="true" className="hidden md:block absolute -right-5 -top-16 font-display text-[14rem] leading-none text-[#0d2c4c]/[0.035] select-none">
        PRICE
      </div>

      <div className="relative p-6 sm:p-10 lg:p-14 xl:p-16">
        <header className="grid lg:grid-cols-12 gap-8 lg:gap-14 pb-10 lg:pb-14 border-b border-ink-100">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase text-brick-600 mb-5">
              <span className="h-px w-8 bg-brick-400" aria-hidden="true" />
              {copy.eyebrow}
            </div>
            <h3 id="pricing-title" className="font-serif text-4xl md:text-5xl text-[#0d2c4c] leading-[1.18] mb-5">
              {copy.titleFirst}<br />{copy.titleSecond}
            </h3>
            <p className="text-ink-500 text-base md:text-lg leading-relaxed max-w-md">{copy.intro}</p>

            <div className="mt-7 flex flex-wrap gap-2 text-sm text-[#0d2c4c]">
              {copy.pills.map(item => (
                <span key={item} className="rounded-full border border-[#0d2c4c]/15 bg-white/70 px-3.5 py-2">{item}</span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 self-end">
            <article className="min-w-0 rounded-sm border border-ink-100 bg-white p-4 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(13,44,76,0.06)]">
              <div className="mb-5 sm:mb-8">
                <span className="font-mono text-[11px] sm:text-xs tracking-widest text-brick-600">{copy.oneToTwo}</span>
                <span className="block mt-1 text-xs text-ink-400">{copy.perVehicleBilling}</span>
              </div>
              <strong className="block font-display text-[2rem] sm:text-5xl md:text-6xl font-normal leading-none text-[#0d2c4c] whitespace-nowrap">
                {currency(TOUR_PRICING.oneToTwoHourly, lang)}
              </strong>
              <p className="mt-2 text-sm text-ink-500">{copy.perVehicleHour}</p>
            </article>

            <article className="min-w-0 rounded-sm border border-[#d9c5b7] bg-[#fff9f3] p-4 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(167,55,39,0.06)]">
              <div className="mb-5 sm:mb-8">
                <span className="font-mono text-[11px] sm:text-xs tracking-widest text-brick-600">{copy.threePlus}</span>
                <span className="block mt-1 text-xs text-ink-400">{copy.totalGuestBilling}</span>
              </div>
              <strong className="block font-display text-[2rem] sm:text-5xl md:text-6xl font-normal leading-none text-brick-600 whitespace-nowrap">
                {currency(TOUR_PRICING.threePlusHourlyPerPerson, lang)}
              </strong>
              <p className="mt-2 text-sm text-ink-500">{copy.perGuestHour}</p>
            </article>

            <div style={{ gridColumn: '1 / -1' }} className="grid grid-cols-2 overflow-hidden rounded-sm border border-[#c9dce8] bg-[#eaf4f8] text-[#0d2c4c]">
              <div className="px-4 sm:px-5 py-4 border-r border-[#c9dce8]">
                <div className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[#0d2c4c]/50 mb-1">{copy.capacityLabel}</div>
                <div className="text-sm md:text-base font-medium">{copy.capacity(TOUR_PRICING.guestsPerVehicle)}</div>
              </div>
              <div className="px-4 sm:px-5 py-4">
                <div className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[#0d2c4c]/50 mb-1">{copy.moreGuestsLabel}</div>
                <div className="text-sm md:text-base font-medium">{copy.moreGuests}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="pt-10 lg:pt-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-brick-600 mb-2">{copy.estimateEyebrow}</div>
              <h4 className="font-serif text-2xl md:text-3xl text-[#0d2c4c]">{copy.estimateTitle}</h4>
            </div>
            <p className="text-sm text-ink-400">{copy.estimateNote}</p>
          </div>

          <div className="grid lg:grid-cols-12 overflow-hidden rounded-sm border border-ink-100 bg-white shadow-[0_22px_60px_rgba(13,44,76,0.08)]">
            <div className="lg:col-span-7 p-5 sm:p-7 lg:p-9">
              <div className="grid sm:grid-cols-2 gap-5 pb-7 border-b border-ink-100">
                <div>
                  <label htmlFor="guest-count" className="flex items-center gap-3 text-base font-medium text-[#0d2c4c] mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d2c4c] text-xs text-white">01</span>
                    {copy.chooseGuests}
                  </label>
                  <div className="grid grid-cols-[52px_1fr_52px] rounded-sm border border-ink-200 h-14 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setPeople(value => Math.max(1, value - 1))}
                      className="text-2xl text-[#0d2c4c] bg-[#f5f8fa] hover:bg-[#eaf4f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brick-500 focus-visible:outline-offset-[-2px]"
                      aria-label={copy.decreaseGuest}
                    >
                      −
                    </button>
                    <output id="guest-count" className="flex items-center justify-center border-x border-ink-100 text-xl font-medium text-[#0d2c4c] tabular-nums">
                      {copy.guestCount(people)}
                    </output>
                    <button
                      type="button"
                      onClick={() => setPeople(value => Math.min(50, value + 1))}
                      className="text-2xl text-[#0d2c4c] bg-[#f5f8fa] hover:bg-[#eaf4f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brick-500 focus-visible:outline-offset-[-2px]"
                      aria-label={copy.increaseGuest}
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 text-base font-medium text-[#0d2c4c] mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf4f8] text-xs text-[#0d2c4c]">✓</span>
                    {copy.estimatedVehicles}
                  </div>
                  <div className="h-14 rounded-sm border border-[#c9dce8] bg-[#f5fafc] flex items-center justify-between px-5 text-[#0d2c4c]">
                    <span className="text-sm">{copy.perVehicleCapacity(TOUR_PRICING.guestsPerVehicle)}</span>
                    <strong className="text-xl tabular-nums">{copy.vehicleCount(estimate.vehicles)}</strong>
                  </div>
                </div>
              </div>

              <fieldset className="pt-7">
                <legend className="flex items-center gap-3 text-base font-medium text-[#0d2c4c] mb-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d2c4c] text-xs text-white">02</span>
                  {copy.chooseDuration}
                </legend>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {tourDurations.map(option => (
                    <button
                      key={option.minutes}
                      type="button"
                      onClick={() => setDuration(option.minutes)}
                      className={`min-h-[72px] rounded-sm border px-2 py-3 font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brick-500 ${
                        duration === option.minutes
                          ? 'bg-[#0d2c4c] text-white border-[#0d2c4c] shadow-[0_6px_16px_rgba(13,44,76,0.18)]'
                          : 'border-ink-100 bg-white text-ink-600 hover:border-[#0d2c4c]/40 hover:bg-[#f5fafc]'
                      }`}
                      aria-pressed={duration === option.minutes}
                    >
                      <span className="block font-display text-2xl leading-none">{option.minutes}</span>
                      <span className="mt-1 block text-[11px] tracking-wider">{copy.minuteUnit} · {option.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-ink-100 bg-[#f5f8fa] p-5 sm:p-7 lg:p-9" aria-live="polite">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 text-base font-medium text-[#0d2c4c]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brick-600 text-xs text-white">03</span>
                  {copy.costEstimate}
                </div>
                <span className="rounded-full bg-[#fff0e8] text-brick-600 px-3 py-1.5 text-xs font-medium">{copy.lineDiscount}</span>
              </div>

              <div className="rounded-sm border border-[#c9dce8] bg-white p-5 sm:p-6">
                <div className="text-xs tracking-wider text-ink-400 mb-2">{copy.listTotal}</div>
                <div className="font-display text-5xl sm:text-6xl text-[#0d2c4c] leading-none mb-3 tabular-nums">
                  {currency(estimate.total, lang)}
                </div>
                <p className="text-sm text-ink-400">{estimate.formula}</p>

                <div className="border-y border-ink-100 py-4 my-5 flex items-center justify-between gap-5">
                  <div>
                    <div className="text-xs text-ink-400 mb-1">{copy.lineReference}</div>
                    <div className="font-serif text-2xl sm:text-3xl text-brick-600">{currency(estimate.linePrice, lang)}</div>
                  </div>
                  <div className="text-right text-sm text-ink-500 leading-relaxed">
                    {summaryFirst}<br />{summarySecond}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onBook({
                    title: copy.customTour,
                    duration: copy.selectedDuration(duration),
                    durationMinutes: duration,
                    people,
                    vehicles: estimate.vehicles,
                    total: estimate.total,
                    linePrice: estimate.linePrice,
                    source: 'calculator',
                  })}
                  className="w-full btn-primary min-h-14 text-base"
                >
                  {copy.book}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <p className="text-xs text-ink-400 leading-relaxed mt-4">{copy.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
