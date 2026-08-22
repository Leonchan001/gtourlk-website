import { useState } from 'react'

const FAQS = [
  {
    q: '是固定班次、定時發車嗎？',
    a: '不是。我們全程採預約制，沒有固定班次或固定發車時間。請先透過 LINE 或電話告訴我們希望的日期與時間，確認預約後，導覽員會依雙方約定時間出發。',
  },
  {
    q: '需要提前多久預約？',
    a: '平日安排彈性，臨時預約也歡迎。假日與連假建議提早 3 天以 LINE 或電話聯繫，較容易安排你希望的出發時間。',
  },
  {
    q: '一台車可以坐幾個人？',
    a: '導覽三輪車可乘坐 5 人，另有六人座電動四輪車可供較大的家庭或小團體選擇。大型企業包團也可客製安排多車。',
  },
  {
    q: '下雨天可以出發嗎？',
    a: '輕雨仍可出行，車上備有遮雨設備。若遇大雨或颱風，我們會提前聯繫旅客協商改期，旅客安全第一。',
  },
  {
    q: '行動不便的長輩或小朋友可以參加嗎？',
    a: '完全沒問題！電動車平穩安靜，全程無需步行也能完成導覽。行動不便的長者和嬰幼兒都曾參與過，導覽員也會隨時協助照顧。',
  },
  {
    q: '費用怎麼收？',
    a: '行程結束後現場繳費，可接受現金。加入官方 LINE 好友預約可享 95 折優惠，企業或學校包團請洽詢專案報價。',
  },
  {
    q: '可以中途停下來買東西或拍照嗎？',
    a: '當然！我們的節奏以旅人為主，隨時可以停車讓您拍照、購買鹿港伴手禮，或品嘗在地小吃。導覽員也會推薦當地最值得停留的店家。',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="py-24 md:py-32 bg-paper-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">N°05 — FAQ</div>
            <div className="rule-thick w-12" />
          </div>
          <div className="md:col-span-9">
            <h2 className="section-title max-w-xl">
              出發前，<br />
              你可能想問的<span className="font-display italic"> 七個問題</span>。
            </h2>
          </div>
        </div>

        <div className="md:col-start-4 md:col-span-9 max-w-3xl ml-auto border-t border-ink-200">
          {FAQS.map((item, i) => (
            <div key={i} className="border-b border-ink-200">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-6 flex items-start justify-between gap-6 group"
                aria-expanded={open === i}
              >
                <span className="font-serif text-lg text-ink-800 group-hover:text-brick-500 transition-colors leading-snug">
                  {item.q}
                </span>
                <span className="shrink-0 mt-1 font-mono text-ink-400 group-hover:text-brick-500 transition-colors text-sm">
                  {open === i ? '−' : '+'}
                </span>
              </button>
              {/* 展開動畫：grid-rows trick，不需要 JS 計算高度 */}
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 text-ink-600 leading-relaxed text-[15px]">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
