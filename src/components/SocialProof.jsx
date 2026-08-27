// 旅人評價 — 編輯式 pull-quote 排版
import { BUSINESS } from '../data/business'
import { useLanguage } from '../i18n'

const SOCIAL_COPY = {
  zh: {
    eyebrow: 'N°03 — Reviews',
    heading: count => `${count} 位旅人，`,
    headingTail: '留下了真實的評價。',
    intro: `不是行銷文案，而是 Google 上 ${BUSINESS.reviewCount} 則真實評論・平均評分 ${BUSINESS.reviewRating} 顆星。\n我們珍視每一則回饋——包含建議與批評，作為下一趟導覽更好的依據。`,
    pull: {
      text: '在地人帶路果然不一樣。摸乳巷、九曲巷、桂花巷的典故都說得精彩，環保電動車安靜又平穩，沿著老街慢慢走，像走進時光膠囊。',
      author: '旅人日誌',
      meta: `Google 評論 · ★ ${BUSINESS.reviewRating}`,
    },
    reviews: [
      {
        name: 'Allison Wu',
        when: 'Google 評論',
        excerpt: '臨時帶家人前往鹿港，半夜聯繫預約。導覽員介紹便宜的停車場，全程解說豐富，也協助照顧長輩，非常感謝！',
        tag: '長者友善',
      },
      {
        name: '珊珊',
        when: 'Google 評論',
        excerpt: '王姐的導覽時光超棒！從不見天街、玉渠宮的傳奇到龍山寺的建築之美，深刻領略鹿港的歷史底蘊。',
        tag: '深度文化',
      },
      {
        name: '陳先生',
        when: 'Google 評論',
        excerpt: '帶小朋友來鹿港玩，導覽員超親切，小孩全程都很專心聽故事。電動四輪車很新很舒服，老人家也覺得輕鬆。',
        tag: '親子友善',
      },
      {
        name: 'Angela L.',
        when: 'Google 評論',
        excerpt: '臨時預約幫忙接送長輩到診所，後來又安排鹿港小旅行，一家人玩得超開心。把客人當朋友的熱忱，這就是鹿港的招待。',
        tag: '貼心服務',
      },
    ],
    verified: 'Verified · 彰化友善店家認證',
    sourceNote: '評分與評論數以 Google 商家頁面顯示為準・截至 2026 年 8 月',
    reviewLink: count => `查看 ${count} 則 Google 評論`,
    quoteOpen: '「',
    quoteClose: '」',
  },
  en: {
    eyebrow: 'N°03 — Reviews',
    heading: count => `${count} travelers,`,
    headingTail: 'in their own words.',
    intro: `These are not marketing lines: they come from ${BUSINESS.reviewCount} published Google reviews, with an average rating of ${BUSINESS.reviewRating}.\nThe English excerpts below are translations of the original Chinese reviews. We value every comment—including suggestions and criticism—as a way to make the next tour even better.`,
    pull: {
      text: 'Having a local guide made all the difference. The stories behind Molu Lane, Nine-Turns Lane and Osmanthus Alley were fascinating. The quiet, smooth electric vehicle let us take in the old streets slowly—as if we had stepped into a time capsule.',
      author: "Traveler's Journal",
      meta: `Google review · Translated from Chinese · ★ ${BUSINESS.reviewRating}`,
    },
    reviews: [
      {
        name: 'Allison Wu',
        when: 'Google review · Translated from Chinese',
        excerpt: 'We made a last-minute family trip to Lukang and reached out late at night. Our guide suggested an affordable car park, shared wonderful stories throughout the tour and thoughtfully looked after the older members of our family. We are very grateful!',
        tag: 'Senior-friendly',
      },
      {
        name: 'Shan-Shan',
        when: 'Google review · Translated from Chinese',
        excerpt: "Our time with Ms. Wang was fantastic. From the story of Bujiantian Street and the legend of Yuqu Temple to the beauty of Longshan Temple, we came away with a much deeper sense of Lukang's history.",
        tag: 'Local culture',
      },
      {
        name: 'Mr. Chen',
        when: 'Google review · Translated from Chinese',
        excerpt: 'We brought our children to Lukang and the guide was incredibly kind. The children listened to every story, while the new, comfortable four-wheel electric vehicle made the ride easy for the older members of our family too.',
        tag: 'Family-friendly',
      },
      {
        name: 'Angela L.',
        when: 'Google review · Translated from Chinese',
        excerpt: 'A last-minute booking helped our older family member get to a clinic, and later became a wonderful little tour of Lukang for the whole family. The way the team treats guests like friends is Lukang hospitality at its best.',
        tag: 'Thoughtful service',
      },
    ],
    verified: 'Verified · Changhua Friendly Store Certified',
    sourceNote: 'Rating and review count follow the Google Business Profile · As of August 2026',
    reviewLink: count => `Read all ${count} Google reviews`,
    quoteOpen: '“',
    quoteClose: '”',
  },
}

export default function SocialProof() {
  const { lang } = useLanguage()
  const copy = SOCIAL_COPY[lang]

  return (
    <section id="reviews" className="py-20 md:py-32 bg-paper-100 texture-paper">
      <div className="max-w-7xl mx-auto px-6">

        {/* 章節標題 */}
        <div className="grid md:grid-cols-12 gap-8 mb-12 md:mb-20">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">{copy.eyebrow}</div>
            <div className="rule-thick w-12" />
          </div>
          <div className="md:col-span-9">
            <h2 className="section-title max-w-2xl">
              <span className="font-mono text-base text-brick-500 align-top mr-2">★ {BUSINESS.reviewRating}</span>
              <br className="md:hidden" />
              {copy.heading(BUSINESS.reviewCount)}<br />{copy.headingTail}
            </h2>
            <p className="lead whitespace-pre-line mt-6 max-w-2xl">
              {copy.intro}
            </p>
          </div>
        </div>

        {/* 大型 pull quote — 編輯式重點引言 */}
        <figure className="grid md:grid-cols-12 gap-5 md:gap-8 items-start mb-12 pb-12 md:mb-20 md:pb-20 border-b border-ink-200">
          <div className="md:col-span-1">
            <span className="font-display text-7xl text-brick-500 leading-none block">“</span>
          </div>
          <div className="md:col-span-11">
            <blockquote className="font-serif text-xl md:text-3xl lg:text-[36px] text-ink-800 leading-[1.6] tracking-[-0.005em]">
              {copy.pull.text}
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center gap-4 text-ink-500">
              <span className="h-px w-10 bg-ink-300" />
              <span className="font-serif text-base">{copy.pull.author}</span>
              <span className="font-mono text-[11px] tracking-widest uppercase text-ink-400">
                {copy.pull.meta}
              </span>
            </figcaption>
          </div>
        </figure>

        {/* 四則小評論 — 兩欄排版 */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
          {copy.reviews.map((review, i) => (
            <article key={review.name} className={`group ${i > 1 ? 'hidden md:block' : ''}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs tracking-widest text-ink-300">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-lg text-ink-800">{review.name}</h3>
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-ink-400">
                  {review.when}
                </span>
              </div>
              <p className="text-ink-600 leading-[1.85] text-[15px] mb-4">
                {copy.quoteOpen}{review.excerpt}{copy.quoteClose}
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-ink-100">
                <span className="font-mono text-[10px] tracking-widest uppercase text-brick-500">
                  ★ ★ ★ ★ ★
                </span>
                <span className="text-xs text-ink-400">{review.tag}</span>
              </div>
            </article>
          ))}
        </div>

        {/* 看更多 — 編輯式底線連結 */}
        <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-ink-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="eyebrow mb-2">{copy.verified}</div>
            <p className="text-ink-500">{copy.sourceNote}</p>
          </div>
          <a
            href={BUSINESS.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-ink-800 hover:text-brick-500 group"
          >
            <span className="text-sm tracking-wider border-b border-ink-700 group-hover:border-brick-500 pb-1">
              {copy.reviewLink(BUSINESS.reviewCount)}
            </span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
