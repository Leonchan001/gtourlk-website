// 關於我們 — 攝影分割版面
const ABOUT_PHOTO_LARGE = 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1400&q=80'
const ABOUT_PHOTO_SMALL = 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?auto=format&fit=crop&w=900&q=80'

const VALUES = [
  { no: '01', title: '在地深度', body: '不是死背的觀光稿，而是世居鹿港才知道的巷弄典故。' },
  { no: '02', title: '米其林級', body: '走訪米其林指南推薦的鹿港 3 星景點，路線經過反覆打磨。' },
  { no: '03', title: '永續環保', body: '全車隊使用節能電動車，用行動愛這座古鎮、愛地球。' },
  { no: '04', title: '全齡友善', body: '親子、長者、行動不便者都能輕鬆暢遊，無障礙也照顧到。' },
  { no: '05', title: '彈性貼心', body: '臨時預約也能接待，把每一位旅人都當朋友看待。' },
  { no: '06', title: '五星品質', body: 'Google 200 則評論、滿分 5.0、零負評紀錄。' },
]

export default function About() {
  return (
    <section id="about" className="bg-ink-800 text-paper-100">
      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-16">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 relative">
            <div className="photo-frame aspect-[4/3] bg-ink-700">
              <img
                src={ABOUT_PHOTO_LARGE}
                alt="鹿港廟宇的飛簷與彩繪細節"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -right-6 md:right-0 md:translate-x-1/3 w-2/5 hidden md:block">
              <div className="photo-frame aspect-[3/4] bg-ink-700 border-4 border-ink-800">
                <img
                  src={ABOUT_PHOTO_SMALL}
                  alt="鹿港老街夜晚的燈火"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-5 md:pl-8">
            <div className="eyebrow-light mb-4">N°04 — About</div>
            <div className="rule-thick w-12 bg-paper-200/40 mb-8" />

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-paper-50 leading-[1.25] mb-8">
              一群熱愛鹿港的人，<br />
              <span className="font-display italic text-paper-200">
                用行動讀寫這座古鎮。
              </span>
            </h2>

            <div className="space-y-5 text-paper-100/85 leading-relaxed">
              <p>
                「導鹿 GtourLK」是鹿港在地的電動觀光三輪車・四輪車租賃品牌。
                我們由一群熱愛這片土地的解說員組成，
                騎著全新節能環保電動車，帶您探索鹿港小鎮、米其林旅遊指南推薦的 3 星景點。
              </p>
              <p>
                一種旅遊方式、一種生活態度。我們相信慢慢走、細細聽，
                才能讀懂這座<span className="text-paper-50 font-medium">「一府二鹿三艋舺」</span>
                的歷史古鎮。歡迎您把我們當朋友，一起完成一場物超所值的鹿港古蹟之旅。
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <span className="font-display italic text-paper-200 text-2xl">— GtourLK</span>
              <span className="h-px flex-1 bg-paper-200/30 max-w-[120px]" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-paper-200/50">
                Lukang, est. 2019
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-paper-100/10 mt-12 md:mt-24">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-3">
              <div className="eyebrow-light mb-3">Why GtourLK</div>
              <h3 className="font-serif text-2xl text-paper-50 leading-snug">
                我們<br />在意這六件事
              </h3>
            </div>
            <div className="md:col-span-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {VALUES.map(v => (
                <div key={v.no} className="group">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-mono text-[11px] tracking-widest text-brick-400">— {v.no}</span>
                  </div>
                  <h4 className="font-serif text-lg text-paper-50 mb-2">{v.title}</h4>
                  <p className="text-paper-100/65 text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
