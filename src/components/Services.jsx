import { useState } from 'react'
import Pricing from './Pricing'
import { getTourPlans } from '../data/tours'
import { useLanguage } from '../i18n'

const SERVICES_COPY = {
  zh: {
    introEyebrow: 'N°02 — Experiences',
    headlineFirst: '想去哪裡，',
    headlineSecond: '這趟就由',
    headlineAccent: '你決定',
    headlinePunctuation: '。',
    intro: '告訴我們想去的景點、同行成員與可用時間，我們會以你的需求安排路線。如果還沒有想法，也可以從下方 60、90 或 150 分鐘的建議路線開始選擇；這些都是參考方向，不是固定套裝行程，也沒有固定發車班次。',
    routeEyebrow: 'Route Inspirations',
    routeTitleFirst: '60、90、150 分鐘，',
    routeTitleSecond: '大約能看哪些景點？',
    routeIntro: '下方是常見安排，讓你快速選擇時間；不是固定行程。你指定的景點會優先保留，其餘由導覽員依上下車地點、停留時間與當日路況安排。',
    routeTabsAria: '選擇參考路線時間',
    minuteUnit: '分鐘',
    startAria: plan => `以${plan.title}參考路線開始安排`,
    inquiryAria: plan => `以${plan.title}參考路線洽詢`,
    referenceSights: '參考景點',
    sightsAria: plan => `${plan.duration}參考景點`,
    suitedTo: '適合：',
    startWithDuration: plan => `用 ${plan.duration} 開始安排`,
    routeDisclaimer: '參考景點不代表全部走完；實際內容會依你的需求與停留時間調整',
    featured: '熱門時長',
    suggestedTime: 'Suggested time',
    customizable: '可再客製',
    startWithThisTime: '用這個時間開始安排',
    referenceStrong: '這些是參考，不是固定行程。',
    referenceDetail: '實際能安排的景點數量，會受上下車位置、購物、排隊、拍照與各景點停留時間影響；預約時告訴我們必去地點即可。',
    vehicleFacts: [
      { label: 'Vehicle', value: '四輪', detail: '全車隊電動導覽車' },
      { label: 'Capacity', value: '每車 5 位', detail: '6 人以上依總人數安排多台車' },
      { label: 'Guide', value: '同車', detail: '導覽員兼任司機' },
      { label: 'Safety', value: '安全帶', detail: '車上備有安全帶' },
      { label: 'Weather', value: '遮雨', detail: '雨天備有遮雨設備' },
    ],
    accessibility: '折疊式輪椅可收納上車；如有輪椅、行動不便者或其他乘車需求，請在預約時先告知，我們會協助安排。',
    otherServices: 'Other Services',
    otherTitleFirst: '還有這些',
    otherTitleSecond: '可以為你安排',
    extras: [
      { no: 'A', title: '客製包車導覽', desc: '依想去的景點與可用時間安排，導覽員兼任司機並全程同車。' },
      { no: 'B', title: '長者醫療接駁', desc: '平日短程接送鎮內長者就醫，彈性配合時段。' },
      { no: 'C', title: '企業 / 學校包團', desc: '客製化主題導覽，文史、建築、工藝任選。' },
    ],
    footnote: '* 客製需求優先・以上為參考路線・全程預約制・沒有固定班次・確認後依約定時間出發。',
  },
  en: {
    introEyebrow: 'N°02 — Experiences',
    headlineFirst: 'Where would you like to go?',
    headlineSecond: 'Make this tour',
    headlineAccent: 'your own',
    headlinePunctuation: '.',
    intro: 'Tell us the sights you want to see, who you are traveling with and how much time you have. We will shape the route around you. No wish list yet? Start with one of our 60, 90 or 150-minute suggestions below. They are inspiration—not fixed packages or scheduled departures.',
    routeEyebrow: 'Route Inspirations',
    routeTitleFirst: 'What can you see in',
    routeTitleSecond: '60, 90 or 150 minutes?',
    routeIntro: 'These common combinations make it easier to choose a duration; they are not fixed itineraries. We prioritize your must-see stops, then your guide adjusts the rest around pickup and drop-off points, time at each stop and conditions on the day.',
    routeTabsAria: 'Choose a suggested tour duration',
    minuteUnit: 'min',
    startAria: plan => `Start planning with the ${plan.title} suggestion`,
    inquiryAria: plan => `Ask about the ${plan.title} suggestion`,
    referenceSights: 'Suggested sights',
    sightsAria: plan => `Suggested sights for the ${plan.duration} tour`,
    suitedTo: 'Best for: ',
    startWithDuration: plan => `Start with ${plan.duration}`,
    routeDisclaimer: 'Suggested sights may not all fit. Your route will be adjusted to your priorities and the time spent at each stop.',
    featured: 'Most popular',
    suggestedTime: 'Suggested time',
    customizable: 'Customizable',
    startWithThisTime: 'Plan with this duration',
    referenceStrong: 'These are suggestions, not fixed itineraries. ',
    referenceDetail: 'The number of stops depends on pickup and drop-off points, shopping, queues, photos and how long you spend at each sight. Simply tell us your must-see places when booking.',
    vehicleFacts: [
      { label: 'Vehicle', value: 'Four-wheel', detail: 'Electric four-wheel tour vehicles' },
      { label: 'Capacity', value: '5 guests', detail: 'Groups of 6+ travel in multiple vehicles' },
      { label: 'Guide', value: 'With you', detail: 'Your guide also drives' },
      { label: 'Safety', value: 'Seatbelts', detail: 'Seatbelts are provided' },
      { label: 'Weather', value: 'Rain cover', detail: 'Rain protection is available' },
    ],
    accessibility: 'A foldable wheelchair can be stored on board. Please tell us about wheelchair use, limited mobility or other boarding needs when you book so we can help make the right arrangements.',
    otherServices: 'Other Services',
    otherTitleFirst: 'More ways',
    otherTitleSecond: 'we can help',
    extras: [
      { no: 'A', title: 'Private Custom Tours', desc: 'Built around your available time and must-see places, with your guide driving and staying with you throughout.' },
      { no: 'B', title: 'Senior Medical Transport', desc: 'Flexible weekday transport for short local trips to medical appointments.' },
      { no: 'C', title: 'Corporate & School Groups', desc: 'Custom themes can focus on history, architecture, traditional crafts or a mix of all three.' },
    ],
    footnote: '* Your priorities come first · Routes shown are suggestions · Reservation required · No fixed departures · Tours leave at the confirmed time.',
  },
}

export default function Services({ setSelectedPlan }) {
  const { lang } = useLanguage()
  const copy = SERVICES_COPY[lang]
  const tourPlans = getTourPlans(lang)
  const [activePlanIndex, setActivePlanIndex] = useState(0)
  const activePlan = tourPlans[activePlanIndex]

  function handleBook(plan) {
    setSelectedPlan(plan)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="experience" className="py-20 md:py-32 bg-paper-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-8 mb-12 md:mb-16">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">{copy.introEyebrow}</div>
            <div className="rule-thick w-12" />
          </div>
          <div className="md:col-span-9">
            <h2 className="section-title max-w-3xl">
              {copy.headlineFirst}<br />
              {copy.headlineSecond}<span className="font-display italic"> {copy.headlineAccent}</span>{copy.headlinePunctuation}
            </h2>
            <p className="lead mt-6 max-w-2xl">{copy.intro}</p>
          </div>
        </div>

        <div id="routes" className="grid scroll-mt-24 md:grid-cols-12 gap-8 mb-10 md:mb-12">
          <div className="md:col-span-3">
            <div className="eyebrow mb-3">{copy.routeEyebrow}</div>
            <div className="rule-thick w-12" />
          </div>
          <div className="md:col-span-9 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <h3 className="font-serif text-3xl md:text-4xl text-ink-800 leading-tight">
              {copy.routeTitleFirst}<br />{copy.routeTitleSecond}
            </h3>
            <p className="text-ink-500 leading-relaxed max-w-lg">{copy.routeIntro}</p>
          </div>
        </div>

        <div className="lg:hidden mb-8">
          <div className="grid grid-cols-3 gap-2 mb-4" role="tablist" aria-label={copy.routeTabsAria}>
            {tourPlans.map((plan, index) => (
              <button
                key={plan.no}
                type="button"
                role="tab"
                aria-selected={activePlanIndex === index}
                aria-controls="mobile-route-panel"
                onClick={() => setActivePlanIndex(index)}
                className={`min-h-14 border px-2 py-2 text-center transition-colors ${
                  activePlanIndex === index
                    ? 'border-ink-800 bg-ink-800 text-paper-50'
                    : 'border-ink-200 bg-paper-50 text-ink-600'
                }`}
              >
                <span className="block font-display text-xl leading-none">{plan.minutes}</span>
                <span className="block mt-1 text-[10px] tracking-wider">{copy.minuteUnit} · {plan.durationLabel}</span>
              </button>
            ))}
          </div>

          <article id="mobile-route-panel" role="tabpanel" className="border border-ink-200 bg-white">
            <button
              type="button"
              onClick={() => handleBook(activePlan)}
              className="relative block w-full aspect-[16/10] overflow-hidden text-left bg-ink-800"
              aria-label={copy.startAria(activePlan)}
            >
              <img
                src={activePlan.photo}
                alt={activePlan.photoAlt}
                loading="lazy"
                width="1200"
                height="750"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-5 text-paper-50">
                <span className="font-mono text-[10px] tracking-widest text-brick-100">N°{activePlan.no} · {activePlan.duration}</span>
                <span className="mt-2 block font-serif text-2xl">{activePlan.title}</span>
                <span className="mt-1 block font-display italic text-paper-100">{activePlan.tagline}</span>
              </span>
            </button>

            <div className="p-5">
              <div className="mb-2 font-mono text-[10px] tracking-widest uppercase text-brick-600">{copy.referenceSights}</div>
              <div className="mb-5 flex flex-wrap gap-2" aria-label={copy.sightsAria(activePlan)}>
                {activePlan.stops.map(stop => (
                  <span key={stop} className="border border-ink-100 bg-paper-50 px-3 py-2 text-sm text-ink-700">
                    {stop}
                  </span>
                ))}
              </div>
              <p className="mb-5 border-l-2 border-brick-400 pl-3 text-sm leading-relaxed text-ink-500">
                {copy.suitedTo}{activePlan.fit}
              </p>
              <button type="button" onClick={() => handleBook(activePlan)} className="btn-primary w-full min-h-12">
                {copy.startWithDuration(activePlan)}
                <span aria-hidden="true">→</span>
              </button>
              <p className="mt-3 text-center text-xs leading-relaxed text-ink-400">{copy.routeDisclaimer}</p>
            </div>
          </article>
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 gap-x-6 gap-y-12 mb-8">
          {tourPlans.map(plan => (
            <article key={plan.no} className="group flex flex-col">
              <a
                href="#contact"
                onClick={event => { event.preventDefault(); handleBook(plan) }}
                aria-label={copy.inquiryAria(plan)}
                className="block photo-frame aspect-[4/5] mb-6 relative overflow-hidden bg-ink-800"
              >
                <img
                  src={plan.photo}
                  alt={plan.photoAlt}
                  loading="lazy"
                  width="1200"
                  height="1500"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-ink-900/40" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 text-paper-50">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-brick-300">N°{plan.no}</span>
                    <span className="h-px w-10 bg-paper-50/60" />
                    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-paper-100/85">{plan.coverSub}</span>
                  </div>
                  <div>
                    <div className="font-display italic text-2xl text-paper-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">{plan.coverTitle}</div>
                    <div className="font-mono text-[11px] tracking-[0.28em] uppercase text-paper-200/80 mt-2">{plan.duration}</div>
                  </div>
                </div>
                {plan.featured && (
                  <div className="absolute top-4 right-4 bg-paper-50 px-3 py-1.5">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-brick-500">{copy.featured}</span>
                  </div>
                )}
              </a>

              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs tracking-widest text-ink-300">{plan.no}</span>
                  <h3 className="font-serif text-2xl text-ink-800">{plan.title}</h3>
                </div>
                <span className="font-mono text-[11px] tracking-widest uppercase text-ink-400">{plan.duration}</span>
              </div>

              <p className="font-display italic text-ink-500 mb-5">{plan.tagline}</p>

              <div className="mb-3 font-mono text-[10px] tracking-widest uppercase text-brick-600">{copy.referenceSights}</div>
              <ul className="flex flex-wrap gap-2 mb-5 text-sm text-ink-700" aria-label={copy.sightsAria(plan)}>
                {plan.stops.map(stop => (
                  <li key={stop} className="border border-ink-100 bg-white px-3 py-2">{stop}</li>
                ))}
              </ul>
              <p className="mb-6 border-l-2 border-brick-400 pl-3 text-sm leading-relaxed text-ink-500">
                {copy.suitedTo}{plan.fit}
              </p>

              <div className="mt-auto pt-5 border-t border-ink-100 flex items-end justify-between">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-ink-400 mb-1">{copy.suggestedTime}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-2xl text-ink-800">{plan.duration}</span>
                    <span className="text-xs text-ink-400 ml-2">{copy.customizable}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleBook(plan)}
                  className="text-sm tracking-wider text-ink-700 hover:text-brick-500 inline-flex items-center gap-2 border-b border-ink-700 hover:border-brick-500 pb-1"
                >
                  {copy.startWithThisTime}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mb-24 border border-[#d9c5b7] bg-[#fffaf5] px-5 py-4 text-sm leading-relaxed text-ink-600 md:px-7 md:py-5">
          <strong className="text-ink-800">{copy.referenceStrong}</strong>
          <span> {copy.referenceDetail}</span>
        </div>

        <Pricing onBook={handleBook} />

        <div className="border-y border-ink-200 py-10 md:py-12 mb-16 md:mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-5 gap-y-8">
            {copy.vehicleFacts.map(item => (
              <div key={item.label}>
                <div className="font-mono text-[10px] tracking-widest uppercase text-brick-500 mb-2">{item.label}</div>
                <div className="font-serif text-2xl text-ink-800 mb-2">{item.value}</div>
                <p className="text-sm text-ink-500 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 pt-6 border-t border-ink-100 text-sm text-ink-500 leading-relaxed">{copy.accessibility}</p>
        </div>

        <div className="border-t border-ink-200 pt-12">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <div className="eyebrow mb-3">{copy.otherServices}</div>
              <h3 className="font-serif text-2xl text-ink-800 leading-snug">
                {copy.otherTitleFirst}<br />{copy.otherTitleSecond}
              </h3>
            </div>
            <div className="md:col-span-9 grid md:grid-cols-3 gap-8">
              {copy.extras.map(item => (
                <div key={item.no} className="group">
                  <div className="font-mono text-xs tracking-widest text-brick-500 mb-3">— {item.no}</div>
                  <h4 className="font-serif text-lg text-ink-800 mb-2">{item.title}</h4>
                  <p className="text-ink-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-16 pt-6 border-t border-ink-100 text-xs text-ink-400 tracking-wider">{copy.footnote}</p>
      </div>
    </section>
  )
}
