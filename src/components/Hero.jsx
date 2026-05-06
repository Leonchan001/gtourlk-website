const HERO_PHOTO = './hero-main.jpg'

export default function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink-800">
      {/* 主視覺照片 */}
      <img
        src={HERO_PHOTO}
        alt="導鹿GtourLK電動三輪車停靠於鹿港桂花巷藝術村入口，夕陽金光打在古鎮街道"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="eager"
        fetchpriority="high"
        decoding="sync"
        width="2048"
        height="1536"
      />

      {/* 漸層遮罩 — 雙層強化，確保字體在任何背景上皆清晰 */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/60 to-ink-900/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/75 via-ink-900/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/70 to-transparent" />

      {/* 內容 — 預留固定 header 高度 (~95px)，避免標題被頂到 nav 後面 */}
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pt-32 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-3xl">
          {/* 編號 + 副標 */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-brick-300">
              N°01
            </span>
            <span className="h-px w-10 md:w-16 bg-brick-300/70" />
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-paper-200/80">
              Lukang Heritage Tour
            </span>
          </div>

          {/* 主標題 — 大字襯線，字級調整避免在大螢幕擠壓內容 */}
          <h1 className="font-serif text-paper-50 text-[38px] sm:text-[48px] md:text-[58px] lg:text-[68px] leading-[1.06] mb-2 drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
            穿過巷弄，<br className="md:hidden" />
            走進鹿港的<br />
            <span className="font-display italic text-paper-100">百年時間</span>
          </h1>

          {/* 副標 */}
          <p className="text-paper-100/90 text-[15px] md:text-lg max-w-xl leading-relaxed mt-6 md:mt-8 mb-9 md:mb-10 drop-shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
            搭乘節能電動三輪車，跟著在地導覽員走訪龍山寺、天后宮與九曲巷，
            一場以米其林指南景點為線的鹿港深度散策。
          </p>

          {/* CTA */}
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

        {/* 底部資訊條 — 信任元素 */}
        <div className="mt-14 pt-8 border-t border-paper-50/15 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
          <Fact eyebrow="Google" big="4.9" small="／200+ 則五星好評" />
          <Fact eyebrow="Itinerary" big="60—150" small="分鐘・三種長度" />
          <Fact eyebrow="Vehicle" big="EV" small="全車隊節能電動車" />
          <Fact eyebrow="Since" big="2019" small="鹿港在地經營" />
        </div>
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
