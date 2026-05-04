// 關於我們 — 鹿港天后宮 + 半邊井實照
const ABOUT_PHOTO_LARGE = 'https://commons.wikimedia.org/wiki/Special:FilePath/%E9%B9%BF%E6%B8%AF%E5%A4%A9%E5%90%8E%E5%AE%AE.JPG?width=1400'
const ABOUT_PHOTO_SMALL = 'https://commons.wikimedia.org/wiki/Special:FilePath/%E5%8D%8A%E9%82%8A%E4%BA%95%20Half-sided%20Well%20-%20panoramio.jpg?width=900'

const VALUES = [
  { no: '01', title: '在地團隊', body: '導覽員都是鹿港在地人，故事從小聽到大，講起來自然。' },
  { no: '02', title: '路線彈性', body: '想去哪都可以說。沒想法的話，就交給我們安排。' },
  { no: '03', title: '電動車隊', body: '全車隊都是電動車，安靜、不排廢氣，老街走起來舒服。' },
  { no: '04', title: '全齡上車', body: '車有四輪很穩，長輩、小朋友、坐輪椅都能上車。' },
  { no: '05', title: '彈性預約', body: '想去哪可以告訴我們。臨時預約也歡迎。' },
  { no: '06', title: '五星好評', body: 'Google 200 則評論平均 5.0，目前還沒有客人給負評。' },
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
                alt="鹿港天后宮主廟正面與紅燈籠"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -right-6 md:right-0 md:translate-x-1/3 w-2/5 hidden md:block">
              <div className="photo-frame aspect-[3/4] bg-ink-700 border-4 border-ink-800">
                <img
                  src={ABOUT_PHOTO_SMALL}
                  alt="鹿港半邊井古樸的紅磚老牆"
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
              鹿港在地團隊，<br />
              <span className="font-display italic text-paper-200">
                2024 年才剛起步。
              </span>
            </h2>

            <div className="space-y-5 text-paper-100/85 leading-relaxed">
              <p>
                導鹿 GtourLK 是 2024 年成立的鹿港在地導覽團隊，到現在剛滿兩年。
                我們開電動三輪車跟四輪車，主要帶人走鹿港老街、龍山寺、天后宮這些米其林指南推薦的點。
              </p>
              <p>
                這座小鎮的故事用走的、用聽的，比拍照拍幾張更有感覺。
                想看什麼景點都可以告訴我們，想不出來就讓我們來規劃，
                把你帶到值得停下來的地方。
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <span className="font-display italic text-paper-200 text-2xl">— GtourLK</span>
              <span className="h-px flex-1 bg-paper-200/30 max-w-[120px]" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-paper-200/50">
                Lukang, est. 2024
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
