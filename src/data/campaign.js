export const CAMPAIGN_END = new Date('2026-11-01T00:00:00+08:00').getTime()
export const COUPON_LINE_URL = 'https://line.me/R/ti/p/@lukang2012'
export const CAMPAIGN_SOURCE_URL =
  'https://www.facebook.com/tkfl.tw/posts/1672752741526725/'

export const CAMPAIGN_COPY = {
  zh: {
    noticeLabel: '期間限定',
    noticeText: '150 分鐘導覽｜LINE 95 折後，每車再折 NT$50',
    noticeLink: '查看領券方式',
    eyebrow: 'SPECIAL OFFER · 2026.08.15—10.31',
    heading: '先領券，再預約。\n帶你從鹿港出發，也把優惠帶上車。',
    intro:
      '導鹿是「鹿港上青生活圈｜走鹿食光飽盒」38 間合作店家之一。活動期間預約 150 分鐘導覽，可先享導鹿官方 LINE 預約 95 折，再憑活動優惠券每車折 NT$50。',
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
    noticeText:
      '150-min tour｜5% LINE booking discount + NT$50 off per vehicle',
    noticeLink: 'How to claim',
    eyebrow: 'SPECIAL OFFER · AUG 15—OCT 31, 2026',
    heading: 'Claim the coupon first.\nThen book your Lukang ride.',
    intro:
      'GtourLK is one of 38 partners in the “Walk Lukang, Taste the Town” campaign. Book a 150-minute tour during the campaign to receive our 5% official LINE booking discount, plus another NT$50 off each vehicle with a valid campaign coupon.',
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
    distinction:
      'Claim the coupon from Lukang Kids LINE; make and confirm your booking through GtourLK LINE.',
  },
}

export function isCampaignActive(now = Date.now()) {
  return now < CAMPAIGN_END
}
