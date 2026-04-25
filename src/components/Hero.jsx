export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen hero-gradient flex items-center overflow-hidden">
      <div className="absolute inset-0 pattern-bamboo opacity-40" />

      <div className="absolute top-20 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-forest-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-sm mb-6">
            <span className="text-base">⭐</span>
            <span>Google 205 則評論 · 5.0 滿分好評</span>
          </div>

          <h1 className="font-serif font-black text-4xl md:text-6xl text-cream-50 leading-tight mb-6">
            鹿港導覽<span className="text-amber-400">．</span>
            <br />
            在地文化<br />
            <span className="text-amber-400">深度體驗</span>
          </h1>

          <p className="text-cream-100/90 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            跟著熱愛鹿港的在地導覽員，搭乘全新節能電動三輪車，走訪
            <span className="text-amber-300 font-semibold">米其林旅遊指南景點</span>、
            百年古蹟與巷弄故事，完成一場米其林級的
            <span className="text-amber-300 font-semibold">鹿港旅遊推薦</span>
            行程。
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <a href="#contact" className="btn-primary">
              <span>立即 LINE 預約</span>
              <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#services" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-cream-50/60 text-cream-50 hover:bg-cream-50 hover:text-forest-800 font-semibold rounded-full transition-all">
              查看導覽方案
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-cream-50/20 max-w-lg">
            <Stat num="205+" label="五星評論" />
            <Stat num="米其林" label="指南景點" />
            <Stat num="全新" label="環保電動車" />
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-forest-400/30 rounded-3xl blur-2xl" />
          <div className="relative bg-gradient-to-br from-forest-600/80 to-forest-800/80 backdrop-blur-sm rounded-3xl p-8 border border-amber-400/30 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-3xl">
                🏮
              </div>
              <div>
                <div className="text-amber-300 font-semibold">鹿港古鎮・米其林級體驗</div>
                <div className="text-cream-100 text-sm">一府二鹿三艋舺的文化底蘊</div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: '🛺', text: '全新環保電動三輪車 / 四輪車' },
                { icon: '📚', text: '在地導覽員深度文化講解' },
                { icon: '👨‍👩‍👧', text: '親子・長者・無障礙友善' },
                { icon: '🎋', text: '龍山寺・天后宮・桂花巷全覽' },
                { icon: '💰', text: '1.5 小時起 NT$600 起跳' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-cream-50/10 rounded-xl border border-cream-50/10">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-cream-100 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float hidden sm:block">
        <div className="flex flex-col items-center gap-2 text-cream-100/70">
          <span className="text-xs tracking-widest">SCROLL</span>
          <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

function Stat({ num, label }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-serif font-bold text-amber-400">{num}</div>
      <div className="text-cream-100/80 text-xs mt-1">{label}</div>
    </div>
  )
}
