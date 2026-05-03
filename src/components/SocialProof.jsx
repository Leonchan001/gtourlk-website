// 旅人評價 — 編輯式 pull-quote 排版
const PULL = {
  text: '在地人帶路果然不一樣。摸乳巷、九曲巷、桂花巷的典故都說得精彩，環保電動車安靜又平穩，沿著老街慢慢走，像走進時光膠囊。',
  author: '旅人日誌',
  meta: 'Google 評論 · ★ 5.0',
}

const REVIEWS = [
  {
    name: 'Allison Wu',
    when: '兩個月前',
    excerpt: '臨時帶家人前往鹿港，半夜聯繫預約。導覽員介紹便宜的停車場，全程解說豐富，也協助照顧長輩，非常感謝！',
    tag: '長者友善',
  },
  {
    name: '珊珊',
    when: '兩個月前',
    excerpt: '王姐的導覽時光超棒！從不見天街、玉渠宮的傳奇到龍山寺的建築之美，深刻領略鹿港的歷史底蘊。',
    tag: '深度文化',
  },
  {
    name: '陳先生',
    when: '三個月前',
    excerpt: '帶小朋友來鹿港玩，導覽員超親切，小孩全程都很專心聽故事。電動四輪車很新很舒服，老人家也覺得輕鬆。',
    tag: '親子友善',
  },
  {
    name: 'Angela L.',
    when: '五個月前',
    excerpt: '臨時預約幫忙接送長輩到診所，後來又安排鹿港小旅行，一家人玩得超開心。把客人當朋友的熱忱，這就是鹿港的招待。',
    tag: '貼心服務',
  },
]

export default function SocialProof() {
  return (
    <section id="reviews" className="py-24 md:py-32 bg-paper-100 texture-paper">
      <div className="max-w-7xl mx-auto px-6">

        {/* 章節標題 */}
        <div className="grid md:grid-cols-12 gap-8 mb-20">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">N°03 — Reviews</div>
            <div className="rule-thick w-12" />
          </div>
          <div className="md:col-span-9">
            <h2 className="section-title max-w-2xl">
              <span className="font-mono text-base text-brick-500 align-top mr-2">★ 5.0</span>
              <br className="md:hidden" />
              200 位旅人，<br />留下了一致的評價。
            </h2>
            <p className="lead mt-6 max-w-xl">
              不是行銷文案，而是 Google 上 200 則真實的五星評論。
              這是我們最珍視的、也是最不能造假的勳章。
            </p>
          </div>
        </div>

        {/* 大型 pull quote — 編輯式重點引言 */}
        <figure className="grid md:grid-cols-12 gap-8 items-start mb-20 pb-20 border-b border-ink-200">
          <div className="md:col-span-1">
            <span className="font-display text-7xl text-brick-500 leading-none block">"</span>
          </div>
          <div className="md:col-span-11">
            <blockquote className="font-serif text-2xl md:text-3xl lg:text-[36px] text-ink-800 leading-[1.5] tracking-[-0.005em]">
              {PULL.text}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 text-ink-500">
              <span className="h-px w-10 bg-ink-300" />
              <span className="font-serif text-base">{PULL.author}</span>
              <span className="font-mono text-[11px] tracking-widest uppercase text-ink-400">
                {PULL.meta}
              </span>
            </figcaption>
          </div>
        </figure>

        {/* 四則小評論 — 兩欄排版 */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
          {REVIEWS.map((r, i) => (
            <article key={i} className="group">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs tracking-widest text-ink-300">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-lg text-ink-800">{r.name}</h3>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-ink-400">
                  {r.when}
                </span>
              </div>
              <p className="text-ink-600 leading-[1.85] text-[15px] mb-4">
                「{r.excerpt}」
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-ink-100">
                <span className="font-mono text-[10px] tracking-widest uppercase text-brick-500">
                  ★ ★ ★ ★ ★
                </span>
                <span className="text-xs text-ink-400">{r.tag}</span>
              </div>
            </article>
          ))}
        </div>

        {/* 看更多 — 編輯式底線連結 */}
        <div className="mt-20 pt-10 border-t border-ink-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="eyebrow mb-2">Verified · 彰化友善店家認證</div>
            <p className="text-ink-500">每一則評論都經 Google 真實驗證・無任何刪改</p>
          </div>
          <a
            href="https://www.google.com/search?q=%E5%B0%8E%E9%B9%BFgtourlk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-ink-800 hover:text-brick-500 group"
          >
            <span className="text-sm tracking-wider border-b border-ink-700 group-hover:border-brick-500 pb-1">
              閱讀全部 200 則 Google 評論
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
