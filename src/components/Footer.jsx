export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream-100/70 pt-16 pb-8 border-t border-forest-700">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500 text-forest-900 rounded-full flex items-center justify-center font-bold">
                鹿
              </div>
              <div>
                <div className="font-serif font-bold text-cream-50 text-lg">導鹿 GtourLK</div>
                <div className="text-xs">鹿港三輪車觀光導覽</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4 max-w-md">
              鹿港在地的電動觀光導覽品牌，提供米其林級的鹿港深度旅遊推薦行程。
              一群熱愛鹿港的解說員，用行動愛鹿港、愛地球。
            </p>
            <div className="flex gap-3">
              {['Facebook', 'Instagram', 'Threads'].map(s => (
                <span key={s} className="px-3 py-1 bg-forest-800 border border-forest-700 rounded-full text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-amber-400 font-semibold mb-4">快速導覽</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-amber-300">導覽方案</a></li>
              <li><a href="#reviews" className="hover:text-amber-300">五星評價</a></li>
              <li><a href="#about" className="hover:text-amber-300">關於導鹿</a></li>
              <li><a href="#contact" className="hover:text-amber-300">聯絡預約</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-400 font-semibold mb-4">聯絡資訊</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 彰化縣鹿港鎮永寧街 236 號</li>
              <li>📞 0927-013-167</li>
              <li>💬 LINE：@137ebkaq</li>
              <li>🕗 08:00 – 19:00</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-forest-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <div>© {new Date().getFullYear()} 導鹿 GtourLK 鹿港三輪車觀光導覽．All rights reserved.</div>
          <div className="text-forest-500">
            鹿港導覽 · 鹿港觀光三輪車 · 鹿港旅遊推薦 · 米其林指南景點
          </div>
        </div>
      </div>
    </footer>
  )
}
