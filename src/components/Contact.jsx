export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-cream-50 to-cream-100">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            預約導覽
          </div>
          <h2 className="section-title">
            開始您的<span className="text-amber-600">鹿港深度之旅</span>
          </h2>
          <p className="section-subtitle">
            兩種預約方式，最快 5 分鐘完成預約 · 平日臨時預約也歡迎
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <a
            href="https://line.me/R/ti/p/@137ebkaq"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden bg-gradient-to-br from-[#06C755] to-[#04a444] text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#06C755] font-black text-2xl">
                  LINE
                </div>
                <div>
                  <div className="text-white/80 text-sm">推薦預約方式</div>
                  <div className="font-serif font-bold text-2xl">LINE 即時預約</div>
                </div>
              </div>
              <p className="text-white/90 mb-6">
                加入官方 LINE 即可預約，傳訊息給我們，平均 30 分鐘內回覆。
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                <div className="text-white/70 text-xs mb-1">官方 LINE ID</div>
                <div className="font-mono font-bold text-xl">@137ebkaq</div>
              </div>
              <div className="flex items-center gap-2 text-white font-semibold">
                立即加入 LINE
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </a>

          <a
            href="tel:+886927013167"
            className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-600 text-3xl">
                  📞
                </div>
                <div>
                  <div className="text-white/80 text-sm">電話預約</div>
                  <div className="font-serif font-bold text-2xl">直接撥打</div>
                </div>
              </div>
              <p className="text-white/90 mb-6">
                想立刻問問細節？直接打給我們，導覽員會親切為您解答。
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                <div className="text-white/70 text-xs mb-1">預約專線</div>
                <div className="font-mono font-bold text-xl">0927-013-167</div>
              </div>
              <div className="flex items-center gap-2 text-white font-semibold">
                點擊撥號
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        <div className="bg-white border border-forest-100 rounded-3xl p-8 md:p-10 shadow-md grid md:grid-cols-3 gap-6">
          <InfoItem
            icon="📍"
            title="店面地址"
            content="彰化縣鹿港鎮永寧街 236 號"
            extra="505 鹿港鎮埔崙里"
          />
          <InfoItem
            icon="🕗"
            title="營業時間"
            content="週一至週日 08:00 – 19:00"
            extra="夜間預約請先 LINE 聯繫"
          />
          <InfoItem
            icon="🌐"
            title="社群追蹤"
            content="Facebook · Instagram · Threads"
            extra="@gtourlk"
          />
        </div>
      </div>
    </section>
  )
}

function InfoItem({ icon, title, content, extra }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 flex-shrink-0 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <div className="text-forest-500 text-xs uppercase tracking-wider mb-1">{title}</div>
        <div className="font-semibold text-forest-800">{content}</div>
        <div className="text-forest-500 text-sm mt-0.5">{extra}</div>
      </div>
    </div>
  )
}
