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
    a: '我們全車隊都是電動四輪導覽車，每車最多搭乘 5 位旅客，也可乘坐 5 位成人。導覽員兼任司機，會與旅客同車；大型企業、學校或多人團體可另外洽詢多車安排。',
  },
  {
    q: '下雨天可以出發嗎？',
    a: '車上備有安全帶及遮雨設備，輕雨仍可出行。若遇大雨或颱風等不適合行車的天候，我們會提前聯繫旅客協商改期，旅客安全第一。',
  },
  {
    q: '行動不便的長輩或小朋友可以參加嗎？',
    a: '可以。電動四輪導覽車平穩安靜，也能依需求減少步行；折疊式輪椅可收納上車。若有輪椅、行動不便者或其他乘車需求，請在預約時先告知，方便我們協助安排。',
  },
  {
    q: '費用怎麼收？',
    a: '1–2 人為 NT$600／車／小時；3–5 人為 NT$200／人／小時。30 分鐘起訂，以 30 分鐘為增加單位並按時間比例計費。加入官方 LINE 好友並透過 LINE 預約，可享導覽費 95 折；包車、企業或學校團體請洽詢專案報價。',
  },
  {
    q: '可以中途停下來買東西或拍照嗎？',
    a: '當然！我們的節奏以旅人為主，可停車拍照、購物、排隊或用餐；以上停留皆計入導覽時間。餐飲、商品、門票及其他個人消費需由旅客自行負擔。',
  },
  {
    q: '客製路線或超時怎麼計費？',
    a: '客製路線與參考路線都按時間計費，超時則依實際超出的時間按相同比例計費。告訴我們想去的景點與可用時間，我們會協助安排適合的順序；包車、企業或學校團體請加 LINE 或來電洽詢報價。',
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
              你可能想問的<span className="font-display italic"> 八個問題</span>。
            </h2>
          </div>
        </div>

        <div className="md:col-start-4 md:col-span-9 max-w-3xl ml-auto border-t border-ink-200">
          {FAQS.map((item, i) => (
            <div key={i} className="border-b border-ink-200">
              <button
                id={`faq-button-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-6 flex items-start justify-between gap-6 group"
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
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
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                aria-hidden={open !== i}
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
