import { BUSINESS } from '../data/business'

const ABOUT_PHOTO_LARGE = './hero-main.jpg'
const ABOUT_PHOTO_SMALL = './photos/lukang-art-village.jpg'

const VALUES = [
  {
    no: '01',
    title: '在地深度',
    body: '不是死背的觀光稿，而是世居鹿港才知道的巷弄典故。',
  },
  {
    no: '02',
    title: '綠色指南推薦',
    body: '走訪米其林綠色指南推薦的鹿港景點，路線經過反覆打磨。',
  },
  {
    no: '03',
    title: '永續環保',
    body: '全車隊使用節能電動車，用行動愛這座古鎮、愛地球。',
  },
  {
    no: '04',
    title: '全齡友善',
    body: '親子、長者與行動不便者都能輕鬆暢遊，折疊式輪椅可收納上車。',
  },
  {
    no: '05',
    title: '彈性貼心',
    body: '臨時預約也能接待，把每一位旅人都當朋友看待。',
  },
  {
    no: '06',
    title: '五星品質',
    body: `Google ${BUSINESS.reviewCount} 則評論、${BUSINESS.reviewRating} 平均評分，旅客口碑公開可查。`,
  },
]

export default function About() {
  return (
    <section id="about" className="bg-paper-50 text-ink-700 border-y border-ink-100">
      <div className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-12 md:pb-16">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          {/* 左側 — 大圖 + 小圖 */}
          <div className="md:col-span-7 relative">
            <div className="photo-frame aspect-[4/3] bg-ink-100">
              <img
                src={ABOUT_PHOTO_LARGE}
                alt="導鹿 GtourLK 電動四輪導覽車停靠鹿港老街，在地導覽員帶旅客遊覽古蹟"
                loading="lazy"
                width="1400"
                height="1050"
                className="w-full h-full object-cover"
              />
            </div>
            {/* 小圖：桌機重疊在左下，手機改為獨立顯示在下方 */}
            <div className="hidden md:block mt-4 md:mt-0 md:absolute md:-bottom-8 md:left-6 w-1/2 md:w-1/3">
              <div className="photo-frame aspect-[4/3] bg-ink-100 md:border-4 md:border-paper-50 md:shadow-2xl">
                <img
                  src={ABOUT_PHOTO_SMALL}
                  alt="鹿港在地藝術村場景，紅磚老屋與童趣裝置藝術"
                  loading="lazy"
                  width="900"
                  height="675"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 右側 — 文字 */}
          <div className="md:col-span-5 md:pl-8">
            <div className="eyebrow mb-4">N°04 — About</div>
            <div className="rule-thick w-12 mb-8" />

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#0d2c4c] leading-[1.25] mb-7">
              一群熱愛鹿港的人，<br />
              <span className="font-display italic text-brick-600">
                用行動讀寫這座古鎮。
              </span>
            </h2>

            <div className="space-y-4 text-ink-600 leading-relaxed">
              <p>
                「導鹿 GtourLK」是鹿港在地的電動四輪觀光導覽品牌。
                我們由一群熱愛這片土地的解說員組成，
                由導覽員兼任司機、與旅客同車，帶您探索鹿港小鎮與米其林綠色指南推薦景點。
              </p>
              <p>
                一種旅遊方式、一種生活態度。我們相信慢慢走、細細聽，
                才能讀懂這座<span className="text-ink-800 font-medium">「一府二鹿三艋舺」</span>
                的歷史古鎮。歡迎您把我們當朋友，一起完成一場物超所值的鹿港古蹟之旅。
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <span className="font-display italic text-brick-600 text-2xl">— GtourLK</span>
              <span className="h-px flex-1 bg-ink-200 max-w-[120px]" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-ink-400">
                Lukang, est. 2024.11
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-100 mt-8 md:mt-24 bg-paper-100">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-3">
              <div className="eyebrow mb-3">Why GtourLK</div>
              <h3 className="font-serif text-2xl text-[#0d2c4c] leading-snug">
                我們<br />在意這六件事
              </h3>
            </div>
            <div className="md:col-span-9 grid grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-10 gap-y-8 md:gap-y-10">
              {VALUES.map(v => (
                <div key={v.no} className="group">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-mono text-[11px] tracking-widest text-brick-400">
                      — {v.no}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-ink-800 mb-2">{v.title}</h4>
                  <p className="text-ink-500 text-xs md:text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
