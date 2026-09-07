import { TOUR_PRICING, getTourPlans } from './tours.js'

export const INITIAL_TRIP = {
  date: '',
  departure: '',
  people: 2,
  minutes: 90,
  stops: [],
  guideChoice: true,
  pickup: '',
  notes: '',
}
export function estimateTour(people, minutes) {
  const guests = Number(people)
  const duration = Number(minutes)
  if (
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 50 ||
    ![60, 90, 150].includes(duration)
  )
    return null
  const hours = duration / 60
  const total =
    guests <= 2
      ? TOUR_PRICING.oneToTwoHourly * hours
      : TOUR_PRICING.threePlusHourlyPerPerson * guests * hours
  return {
    total,
    linePrice: Math.round(total * TOUR_PRICING.lineDiscountRate),
    vehicles: Math.ceil(guests / TOUR_PRICING.guestsPerVehicle),
  }
}
export function money(amount) {
  return `NT$${new Intl.NumberFormat('en-US').format(amount)}`
}
export function getSights(lang) {
  const zh = [...new Set(getTourPlans('zh').flatMap((plan) => plan.stops))]
  const localized = [
    ...new Set(getTourPlans(lang).flatMap((plan) => plan.stops)),
  ]
  return zh.map((id, index) => ({ id, label: localized[index] }))
}
export function bookingSummary(trip, lang) {
  const en = lang === 'en'
  const estimate = estimateTour(trip.people, trip.minutes)
  const sights = getSights(lang)
    .filter((sight) => trip.stops.includes(sight.id))
    .map((sight) => sight.label)
  const pending = en ? 'To be confirmed' : '待確認'
  const stops =
    trip.guideChoice || !sights.length
      ? en
        ? 'Please let the guide arrange it.'
        : '請導覽員幫我安排'
      : sights.join(en ? ', ' : '、')
  return en
    ? `Hello GtourLK, I would like to ask about a private electric tour.\n\nDate: ${trip.date || pending}\nDeparture: ${trip.departure || pending}\nGuests: ${trip.people}\nDuration: ${trip.minutes} minutes\nPreferred sights: ${stops}\nPick-up / drop-off: ${trip.pickup || pending}\nOther requests: ${trip.notes || 'None specified'}\nEstimated vehicles: ${estimate?.vehicles ?? pending}\nStandard total: ${estimate ? money(estimate.total) : pending}\nOfficial LINE estimate (5% off): ${estimate ? money(estimate.linePrice) : pending}\n\nPlease confirm availability, meeting point and final fee. Campaign coupons are not included in this estimate. Thank you.`
    : `您好導鹿，我想詢問四輪電動車私人導覽：\n\n日期：${trip.date || pending}\n出發時間：${trip.departure || pending}\n人數：${trip.people} 位\n導覽時間：${trip.minutes} 分鐘\n想去的景點：${stops}\n上下車地點：${trip.pickup || pending}\n其他需求：${trip.notes || '未指定'}\n預估車輛：${estimate?.vehicles ?? pending} 台\n牌價合計：${estimate ? money(estimate.total) : pending}\n官方 LINE 預約參考價（95 折）：${estimate ? money(estimate.linePrice) : pending}\n\n麻煩協助確認時段、集合地點與實際費用。試算尚未扣除活動優惠券，謝謝。`
}
