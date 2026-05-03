// 導覽行程方案 — 編輯式攝影卡
const PLANS = [
  {
    no: '01',
    title: '老街輕旅',
    en: 'Lukang Old Street Tour',
    duration: '60 分鐘',
    price: '199',
    photo: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=1200&q=80',
    photoAlt: '老街上撐著紙傘的和服身影',
    tagline: '快速感受鹿港的氣味與光影。',
    features: [
      '天后宮 + 鹿港老街精華段',
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
    photo: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80',
    photoAlt: '亞洲傳統廟宇建築的飛簷與彩繪',
    tagline: '穿過摸乳巷、九曲巷，讀一座古鎮。',
    features: [
      '龍山寺・天后宮・桂花巷',
      '摸乳巷、九曲巷典故詳解',
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
    photo: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80',
    photoAlt: '夜晚的紅燈籠映照著古老巷弄',
    tagline: '北鹿港、南鹿港，一次走完。',
    features: [
      '米其林指南 3 星景點全覽',
      '北鹿港 + 南鹿港全方位',
      '百年古蹟深度走讀',
      '攝影最佳路線規劃',
      '長者・親子・無障礙友善',
    ],
  },
]

const EXTRAS = [
  { no: 'A', title: '六人座電動車租賃', desc: '兩小時起，無導覽員，自由騎乘探索鹿港小鎮。' },
  { no: 'B', title: '長者醫療接駁',   desc: '平日短程接送鎮內長者就醫，彈性配合時段。' },
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
              一場專屬於你的<span className="font-display italic"> 鹿港散策</span>。
            </h2>
            <p className="lead mt-6 max-w-xl">
              從 60 分鐘的快閃，到 150 分鐘的米其林全覽 ——
              每段路線都由在地導覽員量身規劃，搭乘節能電動車，
              用最舒適的速度讀懂鹿港。
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-x-6 gap-y-12 mb-24">
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
          * 所有行程皆需提前以 LINE 或電話預約・加入官方 LINE 享 95 折・假日場次建議提早三日預約。
        </p>
      </div>
    </section>
  )
}
