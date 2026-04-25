const features = [
  { icon: '📚', title: '在地深度故事', desc: '不是死背的觀光稿，而是世居鹿港才知道的巷弄典故。' },
  { icon: '🏆', title: '米其林級體驗', desc: '走訪米其林旅遊指南推薦的鹿港 3 星景點。' },
  { icon: '🌿', title: '永續環保', desc: '全車隊使用節能電動車，用行動愛地球愛鹿港。' },
  { icon: '👨‍👩‍👧‍👦', title: '全齡友善', desc: '親子、長者、行動不便者都能輕鬆暢遊。' },
  { icon: '💬', title: '彈性貼心', desc: '臨時預約也能接待，把每一位旅人當朋友。' },
  { icon: '⭐', title: '五星品質', desc: 'Google 200 則評論、滿分 5.0、零負評紀錄。' },
]

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-forest-900 text-cream-50 relative overflow-hidden">
      <div className="absolute inset-0 pattern-bamboo opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium mb-4">
              關於導鹿 GtourLK
            </div>
            <h2 className="font-serif font-black text-3xl md:text-5xl mb-6 leading-tight">
              一群熱愛鹿港的人<br />
              <span className="text-amber-400">用行動愛鹿港、愛地球</span>
            </h2>
            <p className="text-cream-100/90 text-lg leading-relaxed mb-6">
              「導鹿 GtourLK」是鹿港在地的<strong className="text-amber-300">電動觀光三輪車・四輪車租賃</strong>品牌。
              我們由一群熱愛這片土地的解說員組成，騎著全新節能環保電動車，帶您探索鹿港小鎮、米其林旅遊指南推薦的 3 星景點。
            </p>
            <p className="text-cream-100/80 leading-relaxed">
              一種旅遊方式、一種生活態度。我們相信慢慢走、細細聽，才能讀懂這座
              <span className="text-amber-300 font-semibold">「一府二鹿三艋舺」</span>
              的歷史古鎮。歡迎您把我們當朋友，一起完成一場物超所值的鹿港古蹟之旅。
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-amber-500 to-amber-700 aspect-square rounded-3xl p-6 flex flex-col justify-end shadow-2xl">
                  <div className="text-5xl mb-2">🛺</div>
                  <div className="font-serif font-bold text-xl text-cream-50">電動三輪車</div>
                  <div className="text-amber-100 text-sm">經典・浪漫・慢遊</div>
                </div>
                <div className="bg-gradient-to-br from-forest-600 to-forest-800 aspect-[4/5] rounded-3xl p-6 flex flex-col justify-end shadow-2xl border border-amber-400/20">
                  <div className="text-5xl mb-2">🏯</div>
                  <div className="font-serif font-bold text-xl text-amber-300">百年龍山寺</div>
                  <div className="text-cream-100 text-sm">米其林指南推薦</div>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="bg-gradient-to-br from-forest-700 to-forest-900 aspect-[4/5] rounded-3xl p-6 flex flex-col justify-end shadow-2xl border border-amber-400/20">
                  <div className="text-5xl mb-2">🏮</div>
                  <div className="font-serif font-bold text-xl text-amber-300">天后宮</div>
                  <div className="text-cream-100 text-sm">古鎮信仰中心</div>
                </div>
                <div className="bg-gradient-to-br from-amber-600 to-amber-800 aspect-square rounded-3xl p-6 flex flex-col justify-end shadow-2xl">
                  <div className="text-5xl mb-2">🌿</div>
                  <div className="font-serif font-bold text-xl text-cream-50">永續導覽</div>
                  <div className="text-amber-100 text-sm">愛鹿港愛地球</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-cream-50/5 backdrop-blur-sm border border-cream-50/10 rounded-2xl p-6 hover:border-amber-400/40 hover:bg-cream-50/10 transition-all">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-serif font-bold text-lg text-amber-300 mb-2">{f.title}</h3>
              <p className="text-cream-100/80 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
