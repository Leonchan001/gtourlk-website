// 導覽行程方案 — 全部用鹿港實照
const PLANS = [
  {
    no: '01',
    title: '老街輕旅',
    en: 'Lukang Old Street Tour',
    duration: '60 分鐘',
    price: '199',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/%E9%B9%BF%E6%B8%AF%E8%80%81%E8%A1%97%20%E4%B8%89%E6%A7%90%E6%8C%BA%E7%A7%80%E5%AE%85%20Lukang%20Old%20Street%20-%20panoramio%20(1).jpg?width=1200',
    photoAlt: '鹿港老街三槐挺秀宅紅磚立面',
    tagline: '先逛一圈，認識鹿港。',
    features: [
      '天后宮與鹿港老街精華段',
      '在地導覽員專業講解',
      '節能電動三輪車・可乘 5 人',
      '免費停車場資訊提供',
    ],
  },
  {
    no: '02',
    title: '深度文化',
    en: 'Heritage Walking Tour',
    duration: '90 分鐘',
    price: '299',
    featured: true,
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/%E9%B9%BF%E6%B8%AF%E5%A4%A9%E5%90%8E%E5%AE%AE%20Lukang%20Tianhou%20Temple%20-%20panoramio.jpg?width=1200',
    photoAlt: '鹿港天后宮飛簷與彩繪屋脊',
    tagline: '老街的巷弄，每條都有故事。',
    features: [
      '龍山寺、天后宮、桂花巷',
      '摸乳巷、九曲巷典故',
      '米其林指南景點導覽',
      '在地小吃與伴手禮推薦',
      '加 LINE 好友享 95 折',
    ],
  },
  {
    no: '03',
    title: '米其林全覽',
    en: 'Michelin Grand Tour',
    duration: '150 分鐘',
    price: '499',
    photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/2022%20Longshan%20Temple,%20Lukang.jpg?width=1200',
    photoAlt: '鹿港龍山寺紅燈籠廊道',
    tagline: '北鹿港、南鹿港，一次走完。',
    features: [
      '米其林指南 3 星景點全覽',
      '北鹿港 + 南鹿港',
      '百年古蹟深度走讀',
      '攝影最佳路線規劃',
      '長者、親子、無障礙友善',
    ],
  },
]

// 暑假限定親子方案
const SUMMER = {
  title: '跟著課本遊鹿港',
  en: 'Textbook Field Trip · Summer 2026',
  period: '7/1 — 8/31 暑假限定',
  duration: '120 分鐘',
  price: '399',
  photo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lukang%20Folk%20Arts%20Museum%2020170205.jpg?width=1400',
  photoAlt: '鹿港民俗文物館紅磚洋樓立面',
  tagline: '課本上看過的鹿港，<br/>來這邊走一次就懂了。',
  intro: '專為國小親子設計。把社會課、國語課裡看過的鹿港景點，變成可以走可以摸的真實場景。',
  features: [
    '天后宮、龍山寺、半邊井、九曲巷、摸乳巷、玉珍齋、民俗文物館',
    '附課本對照學習單，可當暑假作業',
    '簡單闖關小遊戲（找半邊井、數九曲巷的彎）',
    '結束送鹿港小紀念品',
    '車是半開放式無冷氣，建議穿涼爽、自備飲水',
  ],
}

const EXTRAS = [
  { no: 'A', title: '六人座電動車租賃', desc: '兩小時起，自己開、自己逛，不需要導覽員。' },
  { no: 'B', title: '長者醫療接駁',   desc: '平日短程接送鎮內長者就醫，時段彈性配合。' },
  { no: 'C', title: '企業 / 學校包團', desc: '客製化主題導覽，文史、建築、工藝任選。' },
]

export default function Services() {
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
              三種長度，<br />
              <span className="font-display italic">看你想花多少時間。</span>
            </h2>
            <p className="lead mt-6 max-w-xl">
              60 分鐘到 150 分鐘三種長度。路線可以照你想去的地方安排，
              沒想法的話我們會帶你走經典的幾個點。
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-x-6 gap-y-12 mb-20">
          {PLANS.map(p => (
            <article key={p.no} className="group flex flex-col">
              <a href="#contact" className="block photo-frame aspect-[4/5] mb-6 relative">
                <img src={p.photo} alt={p.photoAlt} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                {p.featured && (
                  <div className="absolute top-4 left-4 bg-paper-50 px-3 py-1.5">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-brick-500">Most Booked</span>
                  </div>
                )}
              </a>
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs tracking-widest text-ink-300">{p.no}</span>
                  <h3 className="font-serif text-2xl text-ink-800">{p.title}</h3>
                </div>
                <span className="font-mono text-[11px] tracking-widest uppercase text-ink-400">{p.duration}</span>
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
                  <div className="font-mono text-[10px] tracking-widest uppercase text-ink-400 mb-1">From / 每人</div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl text-ink-800">NT${p.price}</span>
                  </div>
                </div>
                <a href="#contact" className="text-sm tracking-wider text-ink-700 hover:text-brick-500 inline-flex items-center gap-2 border-b border-ink-700 hover:border-brick-500 pb-1">
                  預約此行程
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mb-24 grid md:grid-cols-12 gap-0 bg-ink-800 text-paper-100 overflow-hidden">
          <div className="md:col-span-6 photo-frame aspect-[4/3] md:aspect-auto bg-ink-700">
            <img src={SUMMER.photo} alt={SUMMER.photoAlt} loading="lazy"
              className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-6 p-10 md:p-14 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-[11px] tracking-widest uppercase text-brick-400">
                Summer 2026 · 暑假限定
              </span>
              <span className="h-px flex-1 bg-paper-200/30" />
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-paper-50 leading-[1.25] mb-3">
              {SUMMER.title}
            </h3>
            <p className="font-display italic text-paper-200 text-lg mb-6"
               dangerouslySetInnerHTML={{__html: SUMMER.tagline}} />

            <p className="text-paper-100/80 leading-relaxed mb-7">
              {SUMMER.intro}
            </p>

            <ul className="space-y-2.5 mb-8 text-sm text-paper-100/85">
              {SUMMER.features.map((f, j) => (
                <li key={j} className="flex gap-3">
                  <span className="text-brick-400 mt-1">—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 border-t border-paper-100/15 flex items-end justify-between gap-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-paper-200/60">Period</div>
                  <div className="font-serif text-paper-50 text-base">{SUMMER.period}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-paper-200/60">From / 每人</div>
                  <div className="font-display text-3xl text-paper-50">NT${SUMMER.price}</div>
                </div>
              </div>
              <a href="#contact" className="btn-light shrink-0">
                預約親子行程
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-200 pt-12">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <div className="eyebrow mb-3">Other Services</div>
              <h3 className="font-serif text-2xl text-ink-800 leading-snug">還有這些<br />可以為你安排</h3>
            </div>
            <div className="md:col-span-9 grid md:grid-cols-3 gap-8">
              {EXTRAS.map(e => (
                <div key={e.no} className="group">
                  <div className="font-mono text-xs tracking-widest text-brick-500 mb-3">— {e.no}</div>
                  <h4 className="font-serif text-lg text-ink-800 mb-2">{e.title}</h4>
                  <p className="text-ink-500 text-sm leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-16 pt-6 border-t border-ink-100 text-xs text-ink-400 tracking-wider">
          * 行程內容彈性，景點可依客人需求調整・所有行程皆需提前以 LINE 或電話預約・假日場次建議提早三日聯繫。
        </p>
      </div>
    </section>
  )
}
