import { useMemo, useState } from 'react'

const DURATIONS = [30, 60, 90, 120, 150]

function currency(amount) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Pricing({ onBook }) {
  const [people, setPeople] = useState(6)
  const [duration, setDuration] = useState(60)

  const estimate = useMemo(() => {
    const hours = duration / 60
    const vehicles = Math.ceil(people / 5)
    const total = people <= 2 ? 600 * hours : 200 * people * hours
    const linePrice = Math.round(total * 0.95)
    const formula = people <= 2
      ? `每車 NT$600 × ${hours} 小時`
      : `${people} 人 × 每人 NT$200 × ${hours} 小時`

    return { total, linePrice, vehicles, formula }
  }, [people, duration])

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
              Clear & Flexible Pricing
            </div>
            <h3 id="pricing-title" className="font-serif text-4xl md:text-5xl text-[#0d2c4c] leading-[1.18] mb-5">
              只決定時間，<br />不綁死路線。
            </h3>
            <p className="text-ink-500 text-base md:text-lg leading-relaxed max-w-md">
              指定想去的景點或店家，剩餘時間交給熟悉鹿港的導覽員安排；沒有想法也沒關係。
            </p>

            <div className="mt-7 flex flex-wrap gap-2 text-sm text-[#0d2c4c]">
              {['30 分鐘起訂', '每 30 分鐘增加', '按比例計費'].map(item => (
                <span key={item} className="rounded-full border border-[#0d2c4c]/15 bg-white/70 px-3.5 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4 self-end">
            <article className="min-w-0 rounded-sm border border-ink-100 bg-white p-4 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(13,44,76,0.06)]">
              <div className="mb-5 sm:mb-8">
                <span className="font-mono text-[11px] sm:text-xs tracking-widest text-brick-600">1–2 人</span>
                <span className="block mt-1 text-xs text-ink-400">整車計費</span>
              </div>
              <strong className="block font-display text-[2rem] sm:text-5xl md:text-6xl font-normal leading-none text-[#0d2c4c] whitespace-nowrap">
                NT$600
              </strong>
              <p className="mt-2 text-sm text-ink-500">每車／小時</p>
            </article>

            <article className="min-w-0 rounded-sm border border-[#d9c5b7] bg-[#fff9f3] p-4 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(167,55,39,0.06)]">
              <div className="mb-5 sm:mb-8">
                <span className="font-mono text-[11px] sm:text-xs tracking-widest text-brick-600">3 人以上</span>
                <span className="block mt-1 text-xs text-ink-400">依總人數計費</span>
              </div>
              <strong className="block font-display text-[2rem] sm:text-5xl md:text-6xl font-normal leading-none text-brick-600 whitespace-nowrap">
                NT$200
              </strong>
              <p className="mt-2 text-sm text-ink-500">每人／小時</p>
            </article>

            <div style={{ gridColumn: '1 / -1' }} className="grid grid-cols-2 overflow-hidden rounded-sm border border-[#c9dce8] bg-[#eaf4f8] text-[#0d2c4c]">
              <div className="px-4 sm:px-5 py-4 border-r border-[#c9dce8]">
                <div className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[#0d2c4c]/50 mb-1">Capacity</div>
                <div className="text-sm md:text-base font-medium">每車可坐 5 人</div>
              </div>
              <div className="px-4 sm:px-5 py-4">
                <div className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase text-[#0d2c4c]/50 mb-1">More Guests</div>
                <div className="text-sm md:text-base font-medium">6 人起安排多台車</div>
              </div>
            </div>
          </div>
        </header>

        <div className="pt-10 lg:pt-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-7">
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-brick-600 mb-2">Quick Estimate</div>
              <h4 className="font-serif text-2xl md:text-3xl text-[#0d2c4c]">三步驟，立即看懂費用</h4>
            </div>
            <p className="text-sm text-ink-400">試算不會送出預約，可放心操作</p>
          </div>

          <div className="grid lg:grid-cols-12 overflow-hidden rounded-sm border border-ink-100 bg-white shadow-[0_22px_60px_rgba(13,44,76,0.08)]">
            <div className="lg:col-span-7 p-5 sm:p-7 lg:p-9">
              <div className="grid sm:grid-cols-2 gap-5 pb-7 border-b border-ink-100">
                <div>
                  <label htmlFor="guest-count" className="flex items-center gap-3 text-base font-medium text-[#0d2c4c] mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d2c4c] text-xs text-white">01</span>
                    選擇總人數
                  </label>
                  <div className="grid grid-cols-[52px_1fr_52px] rounded-sm border border-ink-200 h-14 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setPeople(value => Math.max(1, value - 1))}
                      className="text-2xl text-[#0d2c4c] bg-[#f5f8fa] hover:bg-[#eaf4f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brick-500 focus-visible:outline-offset-[-2px]"
                      aria-label="減少一位旅客"
                    >
                      −
                    </button>
                    <output id="guest-count" className="flex items-center justify-center border-x border-ink-100 text-xl font-medium text-[#0d2c4c] tabular-nums">
                      {people} 人
                    </output>
                    <button
                      type="button"
                      onClick={() => setPeople(value => Math.min(50, value + 1))}
                      className="text-2xl text-[#0d2c4c] bg-[#f5f8fa] hover:bg-[#eaf4f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brick-500 focus-visible:outline-offset-[-2px]"
                      aria-label="增加一位旅客"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 text-base font-medium text-[#0d2c4c] mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eaf4f8] text-xs text-[#0d2c4c]">✓</span>
                    系統安排車輛
                  </div>
                  <div className="h-14 rounded-sm border border-[#c9dce8] bg-[#f5fafc] flex items-center justify-between px-5 text-[#0d2c4c]">
                    <span className="text-sm">每車 5 人</span>
                    <strong className="text-xl tabular-nums">需要 {estimate.vehicles} 台</strong>
                  </div>
                </div>
              </div>

              <fieldset className="pt-7">
                <legend className="flex items-center gap-3 text-base font-medium text-[#0d2c4c] mb-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d2c4c] text-xs text-white">02</span>
                  選擇導覽時間
                </legend>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {DURATIONS.map(minutes => (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => setDuration(minutes)}
                      className={`min-h-14 rounded-sm border px-2 py-3 text-sm sm:text-base font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brick-500 ${
                        duration === minutes
                          ? 'bg-[#0d2c4c] text-white border-[#0d2c4c] shadow-[0_6px_16px_rgba(13,44,76,0.18)]'
                          : 'border-ink-100 bg-white text-ink-600 hover:border-[#0d2c4c]/40 hover:bg-[#f5fafc]'
                      }`}
                      aria-pressed={duration === minutes}
                    >
                      {minutes} 分
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-ink-100 bg-[#f5f8fa] p-5 sm:p-7 lg:p-9" aria-live="polite">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 text-base font-medium text-[#0d2c4c]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brick-600 text-xs text-white">03</span>
                  費用試算
                </div>
                <span className="rounded-full bg-[#fff0e8] text-brick-600 px-3 py-1.5 text-xs font-medium">LINE 預約 95 折</span>
              </div>

              <div className="rounded-sm border border-[#c9dce8] bg-white p-5 sm:p-6">
                <div className="text-xs tracking-wider text-ink-400 mb-2">牌價合計</div>
                <div className="font-display text-5xl sm:text-6xl text-[#0d2c4c] leading-none mb-3 tabular-nums">
                  {currency(estimate.total)}
                </div>
                <p className="text-sm text-ink-400">{estimate.formula}</p>

                <div className="border-y border-ink-100 py-4 my-5 flex items-center justify-between gap-5">
                  <div>
                    <div className="text-xs text-ink-400 mb-1">官方 LINE 預約參考價</div>
                    <div className="font-serif text-2xl sm:text-3xl text-brick-600">{currency(estimate.linePrice)}</div>
                  </div>
                  <div className="text-right text-sm text-ink-500 leading-relaxed">
                    {people} 位旅客<br />{estimate.vehicles} 台車・{duration} 分鐘
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onBook({
                    title: '客製化導覽',
                    duration: `${duration} 分鐘`,
                    durationMinutes: duration,
                    people,
                    vehicles: estimate.vehicles,
                    total: estimate.total,
                    linePrice: estimate.linePrice,
                    source: 'calculator',
                  })}
                  className="w-full btn-primary min-h-14 text-base"
                >
                  用這個條件開始預約
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <p className="text-xs text-ink-400 leading-relaxed mt-4">
                實際車輛與時段須由專人確認；購物、排隊、用餐及景點停留皆計入導覽時間。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
