import { TOUR_PRICING as price } from './tours'
import { BUSINESS } from './business'

export function getFaqs(lang) {
  if (lang === 'en')
    return [
      {
        q: 'How much does a tour cost?',
        a: `${price.minimumMinutes}-minute minimum; choose 60, 90 or 150 minutes. For 1–2 guests: NT$${price.oneToTwoHourly} per vehicle per hour. For 3 or more: NT$${price.threePlusHourlyPerPerson} per guest per hour, including groups using multiple vehicles. Add our official LINE account and book through LINE for 5% off. Private charters, companies and schools can ask for a tailored quote.`,
      },
      {
        q: 'How many guests can ride?',
        a: `Up to ${price.guestsPerVehicle} adults per four-wheel electric vehicle. Six or more guests use additional vehicles, still priced by total guest count. Your guide also drives and rides with your group.`,
      },
      {
        q: 'Can the tour run in the rain?',
        a: 'Light rain is fine; seat belts and rain covers are provided. For heavy rain, typhoons or unsafe driving conditions, we contact you to discuss rescheduling. Safety comes first.',
      },
      {
        q: 'Is it suitable for older guests or wheelchairs?',
        a: 'We can reduce walking when needed. A foldable wheelchair can be stored on board. Please tell us about limited mobility, wheelchairs or other boarding needs when booking so we can confirm a suitable arrangement.',
      },
      {
        q: 'Are the routes fixed?',
        a: 'No. The 60, 90 and 150-minute suggestions are starting points, not fixed packages. Your priorities come first; meeting points, traffic, queues and time at each sight shape the route. Stops count toward tour time. Extensions require guide availability and confirmation of the proportional extra fee before continuing.',
      },
      {
        q: 'How far in advance should I book?',
        a: 'Weekdays are generally flexible; last-minute requests are welcome when available. For weekends and holidays, contact us by LINE or phone at least three days ahead. There are no fixed timetables: departure is by confirmed reservation.',
      },
      {
        q: 'Where do we meet, and where can I park?',
        a: `Tell us your preferred pick-up and drop-off points. Your guide confirms the meeting time and place. Our studio is at ${BUSINESS.address.en}; contact us before arriving. On weekdays, consider Lukang Ecological Park Car Park; on weekends, consider the pay-per-entry car parks near Lucao Road. Fees and availability follow on-site notices.`,
        links: parkingLinks(lang),
      },
    ]
  return [
    {
      q: '費用怎麼收？',
      a: `${price.minimumMinutes} 分鐘起訂，可選 60、90、150 分鐘。1–2 人為 NT$${price.oneToTwoHourly}／車／小時；3 人以上為 NT$${price.threePlusHourlyPerPerson}／人／小時，多車仍依總人數計費。加入官方 LINE 好友並透過 LINE 預約，享導覽費 95 折。包車、企業或學校團體可洽詢專案報價。`,
    },
    {
      q: '一台車可以坐幾個人？',
      a: `每台四輪電動導覽車可搭乘 ${price.guestsPerVehicle} 位成人；6 人以上安排多台車，仍依總人數計費。導覽員兼任司機，全程與旅客同車。`,
    },
    {
      q: '下雨天可以出發嗎？',
      a: '車上備有安全帶及遮雨設備，輕雨仍可出行。若遇大雨、颱風或不適合行車的天候，我們會提前聯繫協商改期，旅客安全第一。',
    },
    {
      q: '長輩或輪椅適合嗎？',
      a: '可以依需求減少步行，折疊式輪椅可收納上車。若有輪椅、行動不便者或其他乘車需求，請在預約時先告知，由我們確認合適的乘車安排。',
    },
    {
      q: '路線固定嗎？可以延長嗎？',
      a: '沒有固定套裝路線。60、90、150 分鐘景點只是參考，必去地點優先，其餘依上下車位置、路況、排隊與停留時間調整。停留皆計入導覽時間；若希望延長，需先由導覽員確認後續時段與按相同比例計算的加價金額，再繼續行程。',
    },
    {
      q: '需要提前多久預約？',
      a: '平日安排彈性，有空檔時也歡迎臨時預約。假日與連假建議提早 3 天以 LINE 或電話聯繫，較容易安排希望的出發時間。我們全程採預約制，沒有固定班次，確認後依約定時間出發。',
    },
    {
      q: '去哪裡上車？開車可以停哪裡？',
      a: `預約時告訴我們希望的上下車地點，由導覽員確認集合時間與位置。店面位於${BUSINESS.address.zh}，請先聯繫確認。平日可參考鹿港生態公園停車場；假日可參考鹿草路周邊計次停車場。費用、開放狀況與車位以現場公告為準。`,
      links: parkingLinks(lang),
    },
  ]
}

function parkingLinks(lang) {
  return [
    {
      label: lang === 'en' ? 'Ecological Park Car Park' : '鹿港生態公園停車場',
      href: 'https://maps.app.goo.gl/uJGCK9J4ChXUjpac6?g_st=ipc',
    },
    {
      label: lang === 'en' ? 'Lucao Road car park ①' : '鹿草路停車場 ①',
      href: 'https://maps.app.goo.gl/fwrffz76TUuaJ8k27?g_st=il',
    },
    {
      label: lang === 'en' ? 'Lucao Road car park ②' : '鹿草路停車場 ②',
      href: 'https://maps.app.goo.gl/DNX4gSzyz7e6JAty6?g_st=il',
    },
  ]
}
