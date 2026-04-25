const plans = [
  {
    title: '經典導覽 60 分鐘',
    price: 'NT$ 199',
    unit: '/ 人',
    badge: '快速體驗',
    color: 'forest',
    features: [
      '鹿港天后宮 + 老街精華',
      '在地導覽員專業講解',
      '全新節能環保電動車（可乘 5 人）',
      '免費停車場資訊提供',
    ],
  },
  {
    title: '深度文化 90 分鐘',
    price: 'NT$ 299',
    unit: '/ 人',
    badge: '⭐ 最熱門',
    color: 'amber',
    popular: true,
    features: [
      '龍山寺・天后宮・桂花巷',
      '摸乳巷・九曲巷典故詳解',
      '米其林指南景點導覽',
      '在地小吃 / 伴手禮推薦',
      '加好友享 95 折優惠',
    ],
  },
  {
    title: '米其林全覽 2.5 小時',
    price: 'NT$ 499',
    unit: '/ 人',
    badge: '深度首選',
    color: 'forest',
    features: [
      '米其林指南 3 星景點全覽',
      '北鹿港 + 南鹿港全方位',
      '在地百年古蹟深度走讀',
      '攝影最佳路線規劃',
      '長者・親子・無障礙友善',
    ],
  },
]

const extras = [
  { icon: '🚐', title: '六人座電動車租賃', desc: '2 小時起，自由騎乘探索鹿港小鎮。' },
  { icon: '👵', title: '長者醫療接駁', desc: '平日短程搭載長輩到鹿港鎮內診所就診。' },
  { icon: '🎓', title: '企業 / 學校包團', desc: '客製化主題導覽，文史、建築、工藝任選。' },
]

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-gradient-to-b from-cream-100 to-cream-50 relative">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-100 text-forest-700 rounded-full text-sm font-medium mb-4">
            鹿港觀光三輪車・四輪車方案
          </div>
          <h2 className="section-title">
            為您量身打造的<span className="text-amber-600">鹿港旅遊推薦</span>行程
          </h2>
          <p className="section-subtitle">
            從 60 分鐘快閃到 2.5 小時深度，每一分鐘都是在地文化故事
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-4 mb-16">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-8 transition-all hover:-translate-y-2 ${
                p.popular
                  ? 'bg-gradient-to-br from-forest-700 to-forest-900 text-cream-50 shadow-2xl md:scale-105 border-2 border-amber-400'
                  : 'bg-white text-forest-800 shadow-lg border border-forest-100'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-500 text-forest-900 font-bold text-sm rounded-full shadow-md">
                  {p.badge}
                </div>
              )}

              {!p.popular && (
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-${p.color}-100 text-${p.color}-700`}>
                  {p.badge}
                </div>
              )}

              <h3 className={`font-serif font-bold text-2xl mb-2 ${p.popular ? 'text-amber-300 mt-4' : ''}`}>
                {p.title}
              </h3>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className={`text-sm ${p.popular ? 'text-cream-200' : 'text-forest-500'}`}>{p.unit}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className={`mt-0.5 flex-shrink-0 ${p.popular ? 'text-amber-400' : 'text-forest-500'}`}>✓</span>
                    <span className={`text-sm ${p.popular ? 'text-cream-100' : 'text-forest-700'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block text-center py-3 rounded-full font-semibold transition-all ${
                  p.popular
                    ? 'bg-amber-500 hover:bg-amber-400 text-forest-900'
                    : 'bg-forest-700 hover:bg-forest-800 text-cream-50'
                }`}
              >
                預約此方案
              </a>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {extras.map((e, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm border border-forest-100 rounded-2xl p-6 hover:bg-white transition-colors">
              <div className="text-3xl mb-3">{e.icon}</div>
              <h4 className="font-serif font-bold text-lg text-forest-800 mb-1">{e.title}</h4>
              <p className="text-forest-600 text-sm leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-sm text-amber-900">
          💡 <strong>提醒：</strong>所有方案皆需提前 LINE 或電話預約。加入官方 LINE 好友享 95 折優惠！
        </div>
      </div>
    </section>
  )
}
