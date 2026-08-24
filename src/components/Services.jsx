const PLANS = [
  {
    no: '01',
    title: '老街輕旅',
    en: 'Lukang Old Street Tour',
    duration: '60 分鐘',
    photo: './photos/lukang-old-street-night.jpg',
    photoAlt: '鹿港老街小巷夜景，紅燈籠串連紅磚老屋',
    coverSub: 'Old Street',
    tagline: '快速感受鹿港的氣味與光影。',
    features: [
      '天后宮 + 鹿港老街精華段',
      '在地導覽員專業講解',
      '節能電動四輪導覽車・最多 5 位旅客',
      '免費停車場資訊提供',
    ],
  },
  {
    no: '02',
    title: '深度文化',
    en: 'Heritage Culture Tour',
    duration: '90 分鐘',
    featured: true,
    photo: './photos/lukang-rooftops-aerial.jpg',
    photoAlt: '鹿港老街紅瓦屋頂空拍俯瞰，旅客穿梭於九曲巷弄',
    coverSub: 'Heritage',
    tagline: '穿過摸乳巷、九曲巷，讀一座古鎮。',
    features: [
      '龍山寺・天后宮・桂花巷',
      '摸乳巷、九曲巷典故詳解',
      '米其林指南景點導覽',
      '在地小吃與伴手禮推薦',
      '景點與停留時間皆可討論',
    ],
  },
  {
    no: '03',
    title: '米其林全覽',
    en: 'Michelin Grand Tour',
    duration: '150 分鐘',
    photo: './photos/lukang-koo-house.jpg',
    photoAlt: '鹿港辜家大宅 — 巴洛克建築，米其林指南推薦景點',
    coverSub: 'Lukang ★★★',
    tagline: '北鹿港、南鹿港，一次走完。',
    features: [
      '米其林指南 3 星景點全覽',
      '北鹿港 + 南鹿港全方位',
      '百年古蹟深度走讀',
      '攝影最佳路線規劃',
      '長者・親子友善・可收納折疊輪椅',
    ],
  },
]

const EXTRAS = [
  {
    no: 'A',
    title: '客製包車導覽',
    desc: '依想去的景點與可用時間安排，導覽員兼任司機並全程同車。',
  },
  {
    no: 'B',
    title: '長者醫療接駁',
    desc: '平日短程接送鎮內長者就醫，彈性配合時段。',
  },
  {
    no: 'C',
    title: '企業 / 學校包團',
    desc: '客製化主題導覽，文史、建築、工藝任選。',
  },
]

const VEHICLE_FACTS = [
  { label: 'Vehicle', value: '四輪', detail: '全車隊電動導覽車' },
  { label: 'Capacity', value: '5 位', detail: '每車最多 5 位旅客，可乘 5 位成人' },
  { label: 'Guide', value: '同車', detail: '導覽員兼任司機' },
  { label: 'Safety', value: '安全帶', detail: '車上備有安全帶' },
  { label: 'Weather', value: '遮雨', detail: '雨天備有遮雨設備' },
]

const PRICING = [
  {
    people: '1–2 人',
    amount: 'NT$600',
    unit: '／車／小時',
    note: '以整車計費，兩人同行價格相同。',
    halfHour: '30 分鐘 NT$300／車',
  },
  {
    people: '3–5 人',
    amount: 'NT$200',
    unit: '／人／小時',
    note: '依實際參加人數計費，每車最多 5 位旅客。',
    halfHour: '30 分鐘 NT$100／人',
  },
]

export default function Services({ setSelectedPlan }) {
  function handleBook(plan) {
    setSelectedPlan(plan)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="experience" className="py-24 md:py-32 bg-paper-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-8 mb-16 md:mb-20">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">N°02 — Experiences</div>
            <div className="rule-thick w-12" />
          </div>
          <div className="md:col-span-9">
            <h2 className="section-title max-w-2xl">
              想去哪裡，<br />
              這趟就由<span className="font-display italic"> 你決定</span>。
            </h2>
            <p className="lead mt-6 max-w-xl">
              告訴我們想去的景點、同行成員與可用時間，我們會以你的需求安排路線。
              如果還沒有想法，也可以從下方 60、90 或 150 分鐘的建議路線開始選擇；
              這些都是參考方向，不是固定套裝行程，也沒有固定發車班次。
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-x-6 gap-y-12 mb-24">
          {PLANS.map(p => (
            <article key={p.no} className="group flex flex-col">
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); handleBook(p) }}
                aria-label={`以${p.title}參考路線洽詢`}
                className="block photo-frame aspect-[4/5] mb-6 relative overflow-hidden bg-ink-800"
              >
                <img
                  src={p.photo}
                  alt={p.photoAlt}
                  loading="lazy"
                  width="1200"
                  height="1500"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-ink-900/40" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 text-paper-50">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-brick-300">
                      N°{p.no}
                    </span>
                    <span className="h-px w-10 bg-paper-50/60" />
                    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-paper-100/85">
                      {p.coverSub}
                    </span>
                  </div>
                  <div>
                    <div className="font-display italic text-2xl text-paper-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                      {p.en}
                    </div>
                    <div className="font-mono text-[11px] tracking-[0.28em] uppercase text-paper-200/80 mt-2">
                      {p.duration}
                    </div>
                  </div>
                </div>
                {p.featured && (
                  <div className="absolute top-4 right-4 bg-paper-50 px-3 py-1.5">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-brick-500">
                      Most Booked
                    </span>
                  </div>
                )}
              </a>

              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs tracking-widest text-ink-300">{p.no}</span>
                  <h3 className="font-serif text-2xl text-ink-800">{p.title}</h3>
                </div>
                <span className="font-mono text-[11px] tracking-widest uppercase text-ink-400">
                  {p.duration}
                </span>
              </div>

              <p className="font-display italic text-ink-500 mb-5">{p.tagline}</p>

              <ul className="space-y-2.5 mb-6 text-sm text-ink-600">
                {p.features.map((f, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="text-brick-500 mt-1">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-5 border-t border-ink-100 flex items-end justify-between">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-ink-400 mb-1">
                    Suggested time
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl text-ink-800">{p.duration}</span>
                    <span className="text-xs text-ink-400 ml-2">可再客製</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBook(p)}
                  className="text-sm tracking-wider text-ink-700 hover:text-brick-500 inline-flex items-center gap-2 border-b border-ink-700 hover:border-brick-500 pb-1"
                >
                  以此路線洽詢
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* 車輛資訊 */}
        <div className="border-y border-ink-200 py-12 mb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {VEHICLE_FACTS.map(item => (
              <div key={item.label}>
                <div className="font-mono text-[10px] tracking-widest uppercase text-brick-500 mb-2">
                  {item.label}
                </div>
                <div className="font-serif text-2xl text-ink-800 mb-2">{item.value}</div>
                <p className="text-sm text-ink-500 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 pt-6 border-t border-ink-100 text-sm text-ink-500 leading-relaxed">
            折疊式輪椅可收納上車；如有輪椅、行動不便者或其他乘車需求，請在預約時先告知，我們會協助安排。
          </p>
        </div>

        {/* 計費方式 */}
        <div className="bg-ink-800 text-paper-50 p-8 md:p-12 mb-20">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <div className="eyebrow-light mb-4">Pricing</div>
              <h3 className="font-serif text-3xl md:text-4xl text-paper-50 leading-tight mb-5">
                按時間計費，<br />路線由你決定。
              </h3>
              <p className="text-paper-100/70 text-sm leading-relaxed">
                30 分鐘起訂，以 30 分鐘為增加單位，並按時間比例計費。
                客製路線與參考路線皆採相同計費方式。
              </p>
            </div>

            <div className="md:col-span-8">
              <div className="grid sm:grid-cols-2 gap-px bg-paper-100/15 mb-8">
                {PRICING.map(rate => (
                  <div key={rate.people} className="bg-ink-800 p-6 md:p-8">
                    <div className="font-mono text-[11px] tracking-widest uppercase text-brick-300 mb-4">
                      {rate.people}
                    </div>
                    <div className="flex flex-wrap items-baseline gap-2 mb-3">
                      <span className="font-display text-4xl text-paper-50">{rate.amount}</span>
                      <span className="text-paper-100/65 text-sm">{rate.unit}</span>
                    </div>
                    <p className="text-paper-100/60 text-sm leading-relaxed">{rate.note}</p>
                    <p className="font-mono text-[11px] tracking-wider text-brick-300 mt-4">{rate.halfHour}</p>
                  </div>
                ))}
              </div>

              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-paper-100/75 leading-relaxed">
                <li className="flex gap-3"><span className="text-brick-300">—</span><span>超時依實際超出時間，按相同比例計費。</span></li>
                <li className="flex gap-3"><span className="text-brick-300">—</span><span>購物、排隊、用餐及景點停留皆計入導覽時間。</span></li>
                <li className="flex gap-3"><span className="text-brick-300">—</span><span>餐飲、商品、門票及其他個人消費由旅客自行負擔。</span></li>
                <li className="flex gap-3"><span className="text-brick-300">—</span><span>包車、企業或學校團體請透過 LINE 或電話洽詢報價。</span></li>
                <li className="flex gap-3 sm:col-span-2"><span className="text-brick-300">—</span><span>加入官方 LINE 好友並透過 LINE 預約，可享導覽費 95 折。</span></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-200 pt-12">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <div className="eyebrow mb-3">Other Services</div>
              <h3 className="font-serif text-2xl text-ink-800 leading-snug">
                還有這些<br />可以為你安排
              </h3>
            </div>
            <div className="md:col-span-9 grid md:grid-cols-3 gap-8">
              {EXTRAS.map(e => (
                <div key={e.no} className="group">
                  <div className="font-mono text-xs tracking-widest text-brick-500 mb-3">
                    — {e.no}
                  </div>
                  <h4 className="font-serif text-lg text-ink-800 mb-2">{e.title}</h4>
                  <p className="text-ink-500 text-sm leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-16 pt-6 border-t border-ink-100 text-xs text-ink-400 tracking-wider">
          * 客製需求優先・以上為參考路線・全程預約制・沒有固定班次・確認後依約定時間出發。
        </p>
      </div>
    </section>
  )
}
