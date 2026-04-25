const reviews = [
  {
    name: 'Allison Wu',
    time: '2 個月前',
    rating: 5,
    text: '今天臨時帶家人前往鹿港，事先看了網路推薦，導鹿評論全部五星沒有負評。半夜連繫預約並介紹非常便宜的停車場（一次50元）。全程解說內容非常豐富，也協助照顧長輩幫助長輩上洗手間，非常棒非常感謝！讓我們完成一次物超所值的鹿港古蹟之旅。',
    highlight: '專業講解 · 長者友善',
    photos: 10,
  },
  {
    name: '珊珊',
    time: '2 個月前',
    rating: 5,
    text: '正中午鹿港怎麼遊？查好評預約導鹿五人電動車遊，一府二鹿三艋舺，深刻領略鹿港的歷史底蘊，從不見天街、玉渠宮的傳奇到龍山寺的建築之美，王姐的導覽時光超棒！期待下次再帶您探索更多鹿港的文化角落。',
    highlight: '深度文化 · 在地故事',
    photos: 17,
  },
  {
    name: '陳先生',
    time: '3 個月前',
    rating: 5,
    text: '帶小朋友來鹿港玩，導覽員超親切，小孩全程都很專心聽故事，龍山寺、天后宮講得生動有趣。電動四輪車很新很舒服，老人家也覺得很輕鬆。CP 值超高，下次朋友來鹿港一定再預約！',
    highlight: '親子友善 · 車況新穎',
  },
  {
    name: '旅人日誌',
    time: '4 個月前',
    rating: 5,
    text: '在地人帶路果然不一樣，摸乳巷、九曲巷、桂花巷的典故都說得精彩，環保電動車安靜又平穩，沿著老街慢慢走，像走進時光膠囊。米其林指南三星景點真的名不虛傳！',
    highlight: '米其林景點 · 環保電動車',
  },
  {
    name: 'Angela L.',
    time: '5 個月前',
    rating: 5,
    text: '臨時預約導鹿幫忙接送長輩到診所，服務非常靈活彈性，後來又順便安排鹿港小旅行，一家人玩得超開心。把客人當朋友一樣的熱忱，這就是鹿港最好的招待。',
    highlight: '貼心服務 · 彈性預約',
  },
]

const Star = ({ filled }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-amber-500' : 'text-forest-200'}`} aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.176 0l-3.37 2.45c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
  </svg>
)

export default function SocialProof() {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-cream-50 relative">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            真實 Google 評論
          </div>
          <h2 className="section-title">
            200 位旅人的<span className="text-amber-600">五星真心推薦</span>
          </h2>
          <p className="section-subtitle">
            鹿港導覽中評價最高的品牌之一 — 每一則好評都是我們最珍貴的勳章
          </p>

          <div className="inline-flex items-center gap-6 bg-white border border-forest-100 rounded-2xl p-6 shadow-md">
            <div>
              <div className="text-5xl font-serif font-bold text-forest-800">5.0</div>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} filled />)}
              </div>
            </div>
            <div className="h-16 w-px bg-forest-100" />
            <div className="text-left">
              <div className="text-2xl font-bold text-forest-800">200 則</div>
              <div className="text-forest-600 text-sm">Google 評論</div>
              <div className="text-amber-600 text-xs mt-1">✓ 彰化友善店家認證</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <article
              key={i}
              className={`bg-white border border-forest-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 ${
                i === 0 ? 'lg:col-span-2 bg-gradient-to-br from-amber-50 to-cream-100 border-amber-200' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-forest-600 text-cream-50 flex items-center justify-center font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-forest-800">{r.name}</div>
                    <div className="text-forest-500 text-xs">{r.time}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({length: r.rating}).map((_,j) => <Star key={j} filled />)}
                </div>
              </div>

              <p className={`text-forest-700 leading-relaxed text-sm mb-4 ${i === 0 ? 'text-base' : ''}`}>
                「{r.text}」
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-forest-100">
                <span className="inline-block px-3 py-1 bg-forest-50 text-forest-700 text-xs rounded-full">
                  {r.highlight}
                </span>
                {r.photos && (
                  <span className="text-forest-500 text-xs flex items-center gap-1">
                    📷 {r.photos} 張相片
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.google.com/search?q=%E5%B0%8E%E9%B9%BFgtourlk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-forest-700 hover:text-amber-600 font-medium"
          >
            查看全部 200 則 Google 評論
            <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
