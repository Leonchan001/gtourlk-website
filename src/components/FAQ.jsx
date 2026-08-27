import { useState } from 'react'
import { getTourDurationPrompt, getTourPlans, TOUR_PRICING } from '../data/tours'
import { useLanguage } from '../i18n'

function buildFaqs(lang) {
  const plans = getTourPlans(lang)
  const durationPrompt = getTourDurationPrompt(lang)
  const routeSummary = plans
    .map(plan => `${plan.duration}${lang === 'en' ? ' — ' : '｜'}${plan.stops.join(lang === 'en' ? ', ' : '、')}`)
    .join('\n')

  if (lang === 'en') {
    return [
      {
        q: 'What can we usually see in 60, 90 or 150 minutes?',
        a: `If you do not request specific stops, these are our usual suggestions:\n${routeSummary}\n\nThese are reference ideas, not fixed itineraries, and they do not mean every sight will always be included. We prioritize the places you name, then your guide shapes the remaining time around your pick-up and drop-off points, traffic, queues and how long you choose to stop.`,
      },
      {
        q: 'Are there fixed timetables or departure times?',
        a: 'No. Every tour is privately arranged by reservation, with no fixed timetable or scheduled departures. Tell us your preferred date and time by LINE or phone. Once your booking is confirmed, your guide will meet you and depart at the agreed time.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'Weekdays are generally flexible, and last-minute requests are welcome when availability allows. For weekends and public-holiday periods, contacting us by LINE or phone at least three days ahead gives us a better chance of arranging your preferred departure time.',
      },
      {
        q: 'How many guests can ride?',
        a: `All tours use four-wheel electric vehicles. Each vehicle seats up to ${TOUR_PRICING.guestsPerVehicle} adults; for groups of 6 or more, we arrange additional vehicles according to the total group size. Your guide is also your driver and rides with your group. Companies, schools and larger groups are welcome to ask about a multi-vehicle arrangement.`,
      },
      {
        q: 'Can the tour run in the rain?',
        a: 'Yes, in light rain. The vehicles have seat belts and rain covers. If heavy rain, a typhoon or other unsafe conditions make driving unsuitable, we will contact you in advance to discuss rescheduling. Guest safety always comes first.',
      },
      {
        q: 'Is the tour suitable for children, older guests or travelers with limited mobility?',
        a: 'Yes. The four-wheel electric vehicle offers a quiet, steady ride, and we can reduce walking when needed. A foldable wheelchair can be stored on board. Please tell us about wheelchairs, limited mobility or any other boarding needs when you book so we can prepare the right arrangement.',
      },
      {
        q: 'How much does a tour cost?',
        a: `Tours start at ${TOUR_PRICING.minimumMinutes} minutes; the available lengths are ${durationPrompt} minutes. For 1–2 guests, the rate is NT$${TOUR_PRICING.oneToTwoHourly} per vehicle per hour. For 3 or more guests, it is NT$${TOUR_PRICING.threePlusHourlyPerPerson} per guest per hour. Each vehicle seats ${TOUR_PRICING.guestsPerVehicle} adults; groups of 6 or more use multiple vehicles but are still priced by the total number of guests—for example, 6 guests for 60 minutes costs NT$1,200. Add our official LINE account as a friend and book through LINE to receive 5% off the tour fee (pay 95%). Private charters and company or school groups can contact us for a tailored quote.`,
      },
      {
        q: 'Can we stop to shop, take photos or eat?',
        a: 'Of course. The pace follows your group, so you may stop for photos, shopping, queues or a meal. All such stops count toward the booked tour time. Food, purchases, admission tickets and other personal expenses are not included.',
      },
      {
        q: 'How are custom routes and extra time charged?',
        a: `Choose a tour length of ${durationPrompt} minutes when booking. Custom routes and our suggested arrangements use the same time-based pricing. If you would like to extend on the day, your guide must first confirm availability and the additional charge before the tour continues. Extra time is charged at the same rate in proportion to the actual extension. For private charters and company or school groups, please contact us by LINE or phone for a quote.`,
      },
      {
        q: 'Where should I park when driving to Lukang?',
        a: 'On weekdays, Lukang Ecological Park Car Park is a useful first option. On weekends, or if you prefer to park closer to the old streets, consider the pay-per-entry car parks around Lucao Road. Fees, opening hours and available spaces are subject to on-site notices. You can also share your arrival date and time when booking, and your guide will suggest an option based on the day.',
        links: [
          { label: 'Lukang Ecological Park Car Park', href: 'https://maps.app.goo.gl/uJGCK9J4ChXUjpac6?g_st=ipc' },
          { label: 'Car park near Lucao Road ①', href: 'https://maps.app.goo.gl/fwrffz76TUuaJ8k27?g_st=il' },
          { label: 'Car park near Lucao Road ②', href: 'https://maps.app.goo.gl/DNX4gSzyz7e6JAty6?g_st=il' },
        ],
      },
    ]
  }

  return [
    {
      q: '60、90、150 分鐘通常能安排哪些景點？',
      a: `以下是沒有指定地點時的常見參考：\n${routeSummary}\n\n這些不是固定路線，也不代表每個景點都會全部走完。你指定的必去景點會優先保留，其餘由導覽員依上下車地點、路況、排隊與停留時間安排。`,
    },
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
      a: '我們全車隊都是電動四輪導覽車，每車可搭乘 5 位成人；6 人以上會依總人數安排多台車。導覽員兼任司機，會與旅客同車；大型企業、學校或多人團體也可洽詢多車安排。',
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
      a: `${TOUR_PRICING.minimumMinutes} 分鐘起訂，可選 ${durationPrompt} 分鐘。1–2 人為 NT$${TOUR_PRICING.oneToTwoHourly}／車／小時；3 人以上為 NT$${TOUR_PRICING.threePlusHourlyPerPerson}／人／小時。每車可坐 ${TOUR_PRICING.guestsPerVehicle} 位成人，6 人以上會安排多台車，但仍依總人數計費，例如 6 人 60 分鐘為 NT$1,200。加入官方 LINE 好友並透過 LINE 預約，可享導覽費 95 折；包車、企業或學校團體請洽詢專案報價。`,
    },
    {
      q: '可以中途停下來買東西或拍照嗎？',
      a: '當然！我們的節奏以旅人為主，可停車拍照、購物、排隊或用餐；以上停留皆計入導覽時間。餐飲、商品、門票及其他個人消費需由旅客自行負擔。',
    },
    {
      q: '客製路線或超時怎麼計費？',
      a: `預約時請從 ${durationPrompt} 分鐘選擇；客製路線與參考安排都按時間計費。若現場希望延長，需先由導覽員確認後續時段與加價金額，確認後再繼續；超時費用依實際增加的時間按相同比例計算。包車、企業或學校團體請加 LINE 或來電洽詢報價。`,
    },
    {
      q: '開車到鹿港，建議停在哪裡？',
      a: '平日可優先參考鹿港生態公園停車場；假日或想停近老街，可參考鹿草路周邊計次停車場。停車費、開放狀況與剩餘車位請以現場公告為準；也可以在預約時提供抵達日期與時間，由導覽員依當天情況協助建議。',
      links: [
        { label: '鹿港生態公園停車場', href: 'https://maps.app.goo.gl/uJGCK9J4ChXUjpac6?g_st=ipc' },
        { label: '鹿草路周邊停車場 ①', href: 'https://maps.app.goo.gl/fwrffz76TUuaJ8k27?g_st=il' },
        { label: '鹿草路周邊停車場 ②', href: 'https://maps.app.goo.gl/DNX4gSzyz7e6JAty6?g_st=il' },
      ],
    },
  ]
}

const HEADING_COPY = {
  zh: {
    line1: '出發前，',
    line2: '你可能想問的',
    accent: ' 常見問題',
    ending: '。',
  },
  en: {
    line1: 'Before you go,',
    line2: 'a few things you may',
    accent: ' want to know',
    ending: '.',
  },
}

export default function FAQ() {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(0)
  const items = buildFaqs(lang)
  const heading = HEADING_COPY[lang]

  return (
    <section id="faq" className="py-24 md:py-32 bg-paper-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-8 mb-16">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">N°05 — FAQ</div>
            <div className="rule-thick w-12" />
          </div>
          <div className="md:col-span-9">
            <h2 className="section-title max-w-2xl">
              {heading.line1}<br />
              {heading.line2}<span className="font-display italic">{heading.accent}</span>{heading.ending}
            </h2>
          </div>
        </div>

        <div className="md:col-start-4 md:col-span-9 max-w-3xl ml-auto border-t border-ink-200">
          {items.map((item, i) => (
            <div key={item.q} className="border-b border-ink-200">
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
                  <p className="whitespace-pre-line pb-6 text-ink-600 leading-relaxed text-[15px]">
                    {item.a}
                  </p>
                  {item.links && (
                    <div className="-mt-3 pb-6 flex flex-wrap gap-x-5 gap-y-3">
                      {item.links.map(link => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={open === i ? 0 : -1}
                          className="inline-flex items-center gap-2 border-b border-ink-300 pb-1 text-sm text-ink-700 hover:border-brick-500 hover:text-brick-500"
                        >
                          {link.label}<span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
