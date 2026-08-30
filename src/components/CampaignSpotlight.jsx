import { BUSINESS } from '../data/business'
import { useLanguage } from '../i18n'

const CAMPAIGN_END = new Date('2026-11-01T00:00:00+08:00').getTime()
const COUPON_LINE_URL = 'https://line.me/R/ti/p/@lukang2012'
const CAMPAIGN_SOURCE_URL = 'https://www.facebook.com/tkfl.tw/posts/1672752741526725/'

const CAMPAIGN_COPY = {
  zh: {
    noticeLabel: '期間限定',
    noticeText: '150 分鐘導覽｜LINE 95 折後，每車再折 NT$50',
    noticeLink: '查看領券方式',
    eyebrow: 'SPECIAL OFFER · 2026.08.15—10.31',
    heading: '先領券，再預約。\n帶你從鹿港出發，也把優惠帶上車。',
    intro: '導鹿是「鹿港上青生活圈｜走鹿食光飽盒」38 間合作店家之一。活動期間預約 150 分鐘導覽，可先享導鹿官方 LINE 預約 95 折，再憑活動優惠券每車折 NT$50。',
    offerKicker: '導鹿限定優惠',
    offerTitle: '150 分鐘導覽',
    offerAmount: '每車再折 NT$50',
    offerNote: '可與導鹿官方 LINE 預約 95 折併用',
    exampleLabel: '1–2 人・1 台車試算',
    exampleList: '原價 NT$1,500',
    exampleLine: 'LINE 95 折 NT$1,425',
    exampleFinal: '用券後合計',
    stepsTitle: '領券與預約，只要 3 步',
    steps: [
      {
        title: '前往鹿港囝仔 LINE',
        body: '加入 @lukang2012，從圖文選單開啟「走鹿食光飽盒」。',
      },
      {
        title: '領取導鹿優惠券',
        body: '選擇「想玩｜文化體驗」，找到導鹿並領取當月有效券。',
      },
      {
        title: '回到導鹿完成預約',
        body: '預約時告知要用券，搭乘前出示並由現場人員核銷。',
      },
    ],
    couponCta: '前往鹿港囝仔 LINE 領券',
    bookingCta: '已領券，立即預約導鹿',
    rulesTitle: '使用前請確認',
    rules: [
      '適用 150 分鐘導覽；每台車限用 1 張有效優惠券。',
      '多人分乘多台車時，每台車須分別出示並核銷 1 張有效優惠券。',
      '活動至 2026 年 10 月 31 日；實際使用期限及核銷規則以當月券面為準。',
    ],
    source: '查看活動官方說明',
    distinction: '領券請至鹿港囝仔 LINE；預約與行程確認請回到導鹿官方 LINE。',
  },
  en: {
    noticeLabel: 'LIMITED TIME',
    noticeText: '150-min tour｜5% LINE booking discount + NT$50 off per vehicle',
    noticeLink: 'How to claim',
    eyebrow: 'SPECIAL OFFER · AUG 15—OCT 31, 2026',
    heading: 'Claim the coupon first.\nThen book your Lukang ride.',
    intro: 'GtourLK is one of 38 partners in the “Walk Lukang, Taste the Town” campaign. Book a 150-minute tour during the campaign to receive our 5% official LINE booking discount, plus another NT$50 off each vehicle with a valid campaign coupon.',
    offerKicker: 'GtourLK CAMPAIGN OFFER',
    offerTitle: '150-minute tour',
    offerAmount: 'Extra NT$50 off per vehicle',
    offerNote: 'May be combined with the 5% GtourLK LINE booking discount',
    exampleLabel: 'Example · 1–2 guests · 1 vehicle',
    exampleList: 'Standard NT$1,500',
    exampleLine: 'After 5% off NT$1,425',
    exampleFinal: 'Total with coupon',
    stepsTitle: 'Claim and book in 3 steps',
    steps: [
      {
        title: 'Open Lukang Kids on LINE',
        body: 'Add @lukang2012 and open the campaign from its rich menu.',
      },
      {
        title: 'Claim the GtourLK coupon',
        body: 'Choose the culture experience category, find GtourLK and claim a valid monthly coupon.',
      },
      {
        title: 'Book with GtourLK',
        body: 'Mention the coupon when booking, then show it for staff redemption before the ride.',
      },
    ],
    couponCta: 'Claim coupon on Lukang Kids LINE',
    bookingCta: 'Coupon ready — book with GtourLK',
    rulesTitle: 'Before you use the coupon',
    rules: [
      'Valid for the 150-minute tour; one valid coupon per vehicle.',
      'For multiple vehicles, one separate valid coupon is required for each vehicle.',
      'Campaign ends Oct 31, 2026. Validity and redemption terms follow the current month’s coupon screen.',
    ],
    source: 'View the official campaign post',
    distinction: 'Claim the coupon from Lukang Kids LINE; make and confirm your booking through GtourLK LINE.',
  },
}

function isCampaignActive() {
  return Date.now() < CAMPAIGN_END
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  )
}

export function CampaignNotice() {
  const { lang } = useLanguage()
  const copy = CAMPAIGN_COPY[lang]

  if (!isCampaignActive()) return null

  return (
    <aside className="border-y border-ink-700 bg-ink-800 text-paper-50" aria-label={copy.noticeLabel}>
      <a
        href="#campaign"
        className="group mx-auto flex min-h-16 max-w-7xl flex-col justify-center gap-1 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 bg-brick-500 px-2 py-1 font-mono text-[10px] tracking-widest">
            {copy.noticeLabel}
          </span>
          <span className="text-sm font-medium leading-relaxed text-paper-100 md:text-base">
            {copy.noticeText}
          </span>
        </div>
        <span className="ml-[5.4rem] inline-flex items-center gap-2 text-xs tracking-wider text-paper-200 transition-colors group-hover:text-white sm:ml-0 sm:shrink-0">
          {copy.noticeLink}<ArrowIcon />
        </span>
      </a>
    </aside>
  )
}

export default function CampaignSpotlight() {
  const { lang } = useLanguage()
  const copy = CAMPAIGN_COPY[lang]

  if (!isCampaignActive()) return null

  return (
    <section id="campaign" className="overflow-hidden bg-ink-800 py-20 text-paper-50 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="eyebrow-light mb-5">{copy.eyebrow}</div>
            <h2 className="whitespace-pre-line font-serif text-3xl font-semibold leading-[1.28] text-paper-50 md:text-5xl">
              {copy.heading}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-paper-200 md:text-lg">
              {copy.intro}
            </p>

            <div className="mt-10 border-y border-paper-50/20 py-8">
              <h3 className="font-serif text-2xl text-paper-50">{copy.stepsTitle}</h3>
              <ol className="mt-7 grid gap-7 md:grid-cols-3 md:gap-5">
                {copy.steps.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-3 md:block">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-paper-50/40 font-mono text-xs text-paper-100">
                      0{index + 1}
                    </span>
                    <div className="md:mt-4">
                      <h4 className="font-sans text-base font-semibold tracking-wide text-paper-50">{step.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-paper-200">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href={COUPON_LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 bg-paper-50 px-5 py-3 text-center text-sm font-semibold tracking-wide text-ink-800 transition-colors hover:bg-paper-100"
              >
                {copy.couponCta}<ArrowIcon />
              </a>
              <a
                href={BUSINESS.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 border border-paper-50/50 px-5 py-3 text-center text-sm font-semibold tracking-wide text-paper-50 transition-colors hover:border-paper-50 hover:bg-paper-50/10"
              >
                {copy.bookingCta}<ArrowIcon />
              </a>
            </div>
            <p className="mt-4 text-xs leading-5 text-paper-200">{copy.distinction}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative border border-paper-50/20 bg-paper-50 p-6 text-ink-800 shadow-2xl md:p-8">
              <div className="absolute right-0 top-0 h-20 w-20 border-l border-b border-paper-200 bg-paper-100" aria-hidden="true">
                <span className="absolute right-4 top-4 font-display text-3xl text-brick-500">50</span>
              </div>
              <div className="pr-16 font-mono text-[10px] tracking-widest text-brick-500">{copy.offerKicker}</div>
              <h3 className="mt-5 font-serif text-3xl text-ink-800 md:text-4xl">{copy.offerTitle}</h3>
              <p className="mt-3 text-xl font-semibold text-brick-500 md:text-2xl">{copy.offerAmount}</p>
              <p className="mt-2 text-sm leading-6 text-ink-500">{copy.offerNote}</p>

              <div className="mt-8 border-t border-ink-200 pt-6">
                <div className="font-mono text-[10px] tracking-widest text-ink-400">{copy.exampleLabel}</div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 text-ink-400">
                    <span>{copy.exampleList}</span><span aria-hidden="true">—</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-ink-600">
                    <span>{copy.exampleLine}</span><span aria-hidden="true">−5%</span>
                  </div>
                  <div className="flex items-end justify-between gap-4 border-t border-ink-200 pt-4">
                    <span className="font-medium text-ink-700">{copy.exampleFinal}</span>
                    <span className="font-display text-3xl text-brick-500">NT$1,375</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-x border-b border-paper-50/20 p-6 md:p-8">
              <h3 className="font-sans text-sm font-semibold tracking-wider text-paper-50">{copy.rulesTitle}</h3>
              <ul className="mt-5 space-y-4">
                {copy.rules.map((rule) => (
                  <li key={rule} className="grid grid-cols-[0.6rem_1fr] gap-3 text-sm leading-6 text-paper-200">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brick-400" aria-hidden="true" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
              <a
                href={CAMPAIGN_SOURCE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 border-b border-paper-50/40 pb-1 text-xs tracking-wider text-paper-100 transition-colors hover:border-paper-50 hover:text-white"
              >
                {copy.source}<ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
