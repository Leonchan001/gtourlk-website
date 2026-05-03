// 主視覺 — 鹿港龍山寺實照
// 圖片來源：Wikimedia Commons（公開授權，可商用）
const HERO_PHOTO = 'https://commons.wikimedia.org/wiki/Special:FilePath/Main%20Gate%20of%20the%20Lukang%20Longshan%20Temple.jpg?width=2000'
const HERO_PHOTO_CREDIT = '攝影｜Wikimedia Commons · 鹿港龍山寺'

export default function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink-800">
      <img
        src={HERO_PHOTO}
        alt="鹿港龍山寺主大門全景"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/60 via-transparent to-transparent" />

      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[11px] tracking-widest uppercase text-paper-200">
              N°01 · Lukang Heritage Tour
            </span>
            <span className="h-px w-16 bg-paper-200/60" />
          </div>

          <h1 className="font-serif text-paper-50 text-[44px] md:text-[68px] lg:text-[80px] leading-[1.05] mb-2">
            穿過巷弄，<br className="md:hidden" />
            走進鹿港的<br />
            <span className="font-display italic text-paper-100">百年時間</span>
          </h1>

          <p className="text-paper-100/85 text-base md:text-lg max-w-xl leading-relaxed mt-8 mb-10">
            搭乘節能電動三輪車，跟著在地導覽員走訪龍山寺、天后宮與九曲巷，
            一場以米其林指南景點為線的鹿港深度散策。
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#contact" className="btn-light">
              立即預約導覽
              <Arrow />
            </a>
            <a href="#experience" className="text-paper-50 text-sm tracking-wider hover:text-paper-200 inline-flex items-center gap-2 px-2 py-3.5 border-b border-paper-50/40">
              查看三種行程
              <Arrow light />
            </a>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-paper-50/15 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
          <Fact eyebrow="Google" big="5.0" small="／200 則五星評論" />
          <Fact eyebrow="Itinerary" big="60—150" small="分鐘・三種長度" />
          <Fact eyebrow="Vehicle" big="EV" small="全車隊節能電動車" />
          <Fact eyebrow="Since" big="2019" small="鹿港在地經營" />
        </div>
      </div>

      <div className="absolute bottom-4 right-6 hidden md:block">
        <span className="text-paper-100/40 text-[10px] font-mono tracking-widest uppercase">
          {HERO_PHOTO_CREDIT}
        </span>
      </div>
    </section>
  )
}

function Fact({ eyebrow, big, small }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-widest uppercase text-paper-200/60 mb-2">
        {eyebrow}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-paper-50 text-3xl md:text-4xl leading-none">{big}</span>
        <span className="text-paper-100/70 text-xs">{small}</span>
      </div>
    </div>
  )
}

function Arrow({ light }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}
