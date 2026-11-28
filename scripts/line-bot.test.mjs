import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { bookingSummary, estimateTour as siteEstimate } from '../src/data/booking.js'
import { SITE_COPY } from '../src/data/siteCopy.js'
import { PAGE_COPY } from '../src/data/pages.js'

const code = fs.readFileSync('line-bot/Code.gs', 'utf8')

function fakeSheet() {
  const rows = []
  const sheet = {
    rows,
    appendRow: (r) => rows.push([...r]),
    setFrozenRows() {},
    getLastRow: () => rows.length,
    getRange(row, col, numRows = 1, numCols = 1) {
      return {
        getValues: () => rows.slice(row - 1, row - 1 + numRows).map((r) => {
          const out = r.slice(col - 1, col - 1 + numCols)
          while (out.length < numCols) out.push('')
          return out
        }),
        setValues(values) {
          values.forEach((v, i) => v.forEach((cell, j) => { rows[row - 1 + i][col - 1 + j] = cell }))
          return this
        },
        setValue(v) { rows[row - 1][col - 1] = v; return this },
        setNumberFormat() { return this },
      }
    },
  }
  return sheet
}

function load({ props = {}, quota = { type: 'limited', value: 200 }, used = 10 } = {}) {
  const store = { WEBHOOK_KEY: 'k', BIND_CODE: '123456', LINE_CHANNEL_ACCESS_TOKEN: 't', ...props }
  const calls = []
  let sheet = null
  const cache = new Map()
  const ctx = {
    console: { log() {}, warn() {}, error() {} },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (k) => (k in store ? store[k] : null),
      setProperty: (k, v) => { store[k] = v },
    }) },
    UrlFetchApp: { fetch(url, opts) {
      const path = url.replace('https://api.line.me/v2/bot', '')
      calls.push({ path, method: opts.method, body: opts.payload ? JSON.parse(opts.payload) : null })
      let body = '{}'
      if (path.startsWith('/profile/')) body = JSON.stringify({ displayName: '王小明' })
      if (path === '/message/quota') body = JSON.stringify(quota)
      if (path === '/message/quota/consumption') body = JSON.stringify({ totalUsage: used })
      return { getResponseCode: () => 200, getContentText: () => body }
    } },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({
      getSheetByName: () => sheet,
      insertSheet: () => (sheet = fakeSheet()),
    }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    CacheService: { getScriptCache: () => ({
      get: (k) => (cache.has(k) ? cache.get(k) : null),
      put: (k, v) => cache.set(k, v),
      remove: (k) => cache.delete(k),
    }) },
    Utilities: {
      formatDate: (d, tz, fmt) => {
        const t = new Date(d.getTime() + 8 * 3600e3)
        const p = (n) => String(n).padStart(2, '0')
        return fmt
          .replace('yyyy', t.getUTCFullYear()).replace('MM', p(t.getUTCMonth() + 1)).replace('dd', p(t.getUTCDate()))
          .replace('HH', p(t.getUTCHours())).replace('mm', p(t.getUTCMinutes())).replace('ss', p(t.getUTCSeconds()))
      },
      getUuid: () => '00000000-0000-0000-0000-000000000000',
    },
    ContentService: { createTextOutput: (t) => t },
  }
  vm.createContext(ctx)
  vm.runInContext(code, ctx)
  return { ctx, store, calls, getSheet: () => sheet }
}

const trip = { date: '2026-12-02', departure: '14:00', people: 4, minutes: 90, phone: '0912-345-678', pickup: '', notes: '' }
const event = (text, userId = 'Uguest0001', replyToken = 'r1') => ({
  type: 'message', replyToken, source: { type: 'user', userId }, message: { type: 'text', text },
})
const post = (bot, events, key = 'k') => bot.ctx.doPost({ parameter: { key }, postData: { contents: JSON.stringify({ events }) } })
const pushes = (bot) => bot.calls.filter((c) => c.path === '/message/push')
const replies = (bot) => bot.calls.filter((c) => c.path === '/message/reply')


const at = (s) => new Date(s)
const DAY = at('2026-12-01T03:00:00Z') // 2026-12-01 (Tue) 11:00 Taipei
const NIGHT = at('2026-12-01T15:00:00Z') // 23:00 Taipei
const pb = (data, params, userId = 'Uguest0001') => ({
  type: 'postback', replyToken: 'rp', source: { type: 'user', userId }, postback: { data, ...(params ? { params } : {}) },
})
const send = (bot, ev, now = DAY) => bot.ctx.handleEvent(ev, now)
const lastReply = (bot) => replies(bot).at(-1).body.messages
const quick = (msg) => msg.quickReply.items.map((i) => i.action)

test('parses the zh and en website inquiry exactly as the site writes it', () => {
  const { ctx } = load()
  const zh = ctx.parseInquiry(bookingSummary(trip, 'zh'), '')
  assert.equal(zh.source, 'website')
  assert.equal(zh.lang, 'zh')
  assert.equal(zh.date, '2026-12-02')
  assert.equal(zh.departure, '14:00')
  assert.equal(zh.people, 4)
  assert.equal(zh.minutes, 90)
  assert.equal(zh.phone, '0912-345-678')
  assert.equal(zh.pickup, '')
  assert.match(zh.price, /\d/)
  const en = ctx.parseInquiry(bookingSummary({ ...trip, pickup: 'Lukang Old Street' }, 'en'), '')
  assert.equal(en.lang, 'en')
  assert.equal(en.pickup, 'Lukang Old Street')
  assert.equal(en.phone, '0912-345-678')
  assert.equal(ctx.parseInquiry(bookingSummary({ ...trip, phone: '', date: '' }, 'zh'), '').phone, '')
})

test('recognises hello buttons and booking keywords, ignores small talk', () => {
  const { ctx } = load()
  for (const lang of ['zh', 'en']) {
    const copy = PAGE_COPY[lang]
    for (const hello of [SITE_COPY[lang].contact.hello, copy.lineHello, copy.linePlace('天后宮'), copy.lineTour({ minutes: 90, title: 'X' })]) {
      const parsed = ctx.parseInquiry(hello, '')
      assert.equal(parsed?.source, 'hello', hello)
      assert.equal(parsed.lang, lang)
    }
    assert.equal(ctx.parseInquiry(copy.lineTour({ minutes: 150, title: 'X' }), '').minutes, 150)
  }
  const kw = ctx.prop('INTENT_KEYWORDS')
  assert.equal(ctx.parseInquiry('我要預約導覽', kw).source, 'keyword')
  assert.equal(ctx.parseInquiry('book a tour', kw).lang, 'en')
  assert.equal(ctx.parseInquiry('停車資訊', kw), null)
  assert.equal(ctx.parseInquiry('謝謝', kw), null)
})

test('price matches the website, summary is short and readable', () => {
  const { ctx } = load()
  for (const people of [1, 2, 3, 7, 50, 51]) for (const minutes of [60, 90, 150]) {
    assert.deepEqual(JSON.parse(JSON.stringify(ctx.estimateTour(people, minutes))), siteEstimate(people, minutes))
  }
  const zh = ctx.guestSummary({ date: '2026-12-17', departure: '', people: 5, minutes: 90, pickup: '', phone: '' }, 'zh')
  assert.equal(zh, '📅 12/17（四）・時間待確認\n👥 5 位・90 分鐘\n💰 參考價 NT$1,425（LINE 95 折）\n📍 上車：待確認\n📞 手機：待確認')
  const en = ctx.guestSummary({ date: '2026-12-19', departure: '10:00', people: 60, minutes: 60, pickup: 'Hotel', phone: '+81 90' }, 'en')
  assert.match(en, /Sat 12\/19 · 10:00/)
  assert.match(en, /separate quote|send you a quote/)
})

test('understands typed dates, times and phone numbers', () => {
  const { ctx } = load()
  assert.equal(ctx.parseDateText('明天', DAY), '2026-12-02')
  assert.equal(ctx.parseDateText('12/5', DAY), '2026-12-05')
  assert.equal(ctx.parseDateText('1月3日', DAY), '2027-01-03')
  assert.equal(ctx.parseDateText('2027-02-08', DAY), '2027-02-08')
  assert.equal(ctx.parseDateText('下週', DAY), '')
  assert.equal(ctx.parseTimeText('14:30'), '14:30')
  assert.equal(ctx.parseTimeText('下午2點半'), '14:30')
  assert.equal(ctx.parseTimeText('2點'), '14:00')
  assert.equal(ctx.parseTimeText('10點'), '10:00')
  assert.equal(ctx.parseTimeText('3pm'), '15:00')
  assert.equal(ctx.parseTimeText('看情況'), '')
  assert.ok(ctx.validPhone('0912-345-678'))
  assert.ok(ctx.validPhone('+81 90 1234 5678'))
  assert.equal(ctx.validPhone('0912'), false)
  assert.deepEqual([...ctx.tripFlags('2026-12-02', DAY)], ['平日', '明天'])
  assert.deepEqual([...ctx.tripFlags('2026-12-05', DAY)], [])
})

test('rejects webhook calls without the secret key', () => {
  const bot = load()
  assert.equal(post(bot, [event('我要預約導覽')], 'wrong'), 'forbidden')
  assert.equal(bot.calls.length, 0)
})

test('full button flow: every answer is a free reply and the summary has the price', () => {
  const bot = load()
  send(bot, event('我要預約導覽'))
  let msg = lastReply(bot)[0]
  assert.match(msg.text, /哪一天/)
  const dateActions = quick(msg)
  assert.equal(dateActions[0].type, 'datetimepicker')
  assert.equal(dateActions[0].min, '2026-12-01')
  dateActions.forEach((a) => assert.ok(a.label.length <= 20 && (a.data || '').length <= 300))
  assert.equal(bot.getSheet().rows[1][15], '問資料中')

  send(bot, pb('f=date', { date: '2026-12-02' }))
  assert.match(lastReply(bot)[0].text, /幾點/)
  send(bot, pb('f=time&v=14:00'))
  assert.match(lastReply(bot)[0].text, /幾位/)
  send(bot, pb('f=people&v=4'))
  msg = lastReply(bot)[0]
  assert.match(msg.text, /多久/)
  assert.deepEqual(quick(msg).slice(0, 3).map((a) => a.label), ['60 分鐘 NT$760', '90 分鐘 NT$1,140', '150 分鐘 NT$1,900'])
  send(bot, pb('f=minutes&v=90'))
  assert.match(lastReply(bot)[0].text, /上車/)
  send(bot, event('鹿港老街民宿'))
  assert.match(lastReply(bot)[0].text, /手機/)
  send(bot, event('0912'))
  assert.match(lastReply(bot)[0].text, /不太對/)
  send(bot, event('0912-345-678'))
  const done = lastReply(bot)
  assert.equal(done.length, 1)
  assert.match(done[0].text, /12\/2（三）・14:00/)
  assert.match(done[0].text, /手機：0912-345-678/)
  assert.match(done[0].text, /上車：鹿港老街民宿/)
  assert.match(done[0].text, /NT\$1,140/)
  assert.match(done[0].text, /幾分鐘內回覆/)
  assert.equal(pushes(bot).length, 0)
  const rows = bot.getSheet().rows
  assert.equal(rows.length, 2) // 同一筆一路更新，不會一步一列
  const row = Object.fromEntries(rows[0].map((h, i) => [h, rows[1][i]]))
  assert.equal(row['狀態'], '資料齊了')
  assert.equal(row['日期'], '2026-12-02')
  assert.equal(row['人數'], 4)
  assert.equal(row['手機'], '0912-345-678')
  assert.equal(row['參考價'], 'NT$1,140')
  assert.equal(row['提醒'], '平日、明天')
  assert.equal(row['結果'], '')
  assert.equal(row['旅客名稱'], '王小明')
})

test('"not sure" and typed answers all work; night reply says when we answer', () => {
  const bot = load()
  send(bot, event('Hi, I would like to book a 150-minute tour of Lukang.'), NIGHT)
  assert.match(lastReply(bot)[0].text, /Which day/)
  send(bot, event('12/24'), NIGHT)
  send(bot, pb('f=time&v='), NIGHT)
  send(bot, pb('f=people&v=more'), NIGHT)
  assert.match(lastReply(bot)[0].text, /type the number/)
  send(bot, event('25'), NIGHT)
  // 150 minutes came from the website button, so no duration question
  assert.match(lastReply(bot)[0].text, /pick you up/)
  send(bot, pb('f=pickup&v='), NIGHT)
  // phone step: no skip button, only "talk to a person"
  assert.deepEqual(lastReply(bot)[0].quickReply.items.map(i => i.action.label), ['Talk to a person'])
  send(bot, event('+81 90 1234 5678'), NIGHT)
  const done = lastReply(bot)[0].text
  assert.match(done, /Thu 12\/24 · time TBC/)
  assert.match(done, /25 guests · 150 min/)
  assert.match(done, /Mobile: \+81 90 1234 5678/)
  assert.match(done, /8:00 AM/)
  // already told when we reply, so no "message received" later tonight
  const n = replies(bot).length
  send(bot, event('Can we bring a stroller?'), NIGHT)
  assert.equal(replies(bot).length, n)
})

test('typing anything else hands the chat to a person, quietly', () => {
  const bot = load()
  send(bot, event('我要預約導覽'))
  send(bot, pb('f=date&v=2026-12-05'))
  const before = replies(bot).length
  send(bot, event('請問可以帶狗嗎？'))
  assert.equal(replies(bot).length, before) // 不回話，交給真人
  const row = bot.getSheet().rows[1]
  assert.equal(row[15], '交給真人')
  assert.match(row[12], /帶狗/)
  // flow is over: later chat is ignored, old buttons say the menu expired
  send(bot, event('謝謝'))
  assert.equal(replies(bot).length, before)
  send(bot, pb('f=time&v=10:00'))
  assert.match(lastReply(bot)[0].text, /過期/)
})

test('every question has a "找真人" button, and old buttons still work', () => {
  const bot = load()
  send(bot, event('預約導覽'))
  const labels = lastReply(bot)[0].quickReply.items.map(i => i.action.label)
  assert.equal(labels.at(-1), '找真人')
  send(bot, pb('f=time&v=10:00')) // pressed a button from a later step: ask the current one again
  assert.match(lastReply(bot)[0].text, /哪一天/)
  send(bot, pb('f=chat'))
  assert.match(lastReply(bot)[0].text, /直接在這裡留言/)
  assert.equal(bot.getSheet().rows[1][15], '交給真人')
})

test('"找真人" at night says when we reply, then stays quiet', () => {
  const bot = load()
  send(bot, event('我要預約導覽'), NIGHT)
  send(bot, pb('f=chat'), NIGHT)
  assert.match(lastReply(bot)[0].text, /明天早上 8 點後回覆/)
  const n = replies(bot).length
  send(bot, event('可以帶狗嗎'), NIGHT)
  assert.equal(replies(bot).length, n)
})

test('at night, one "message received" per guest, and none for menu keywords', () => {
  const bot = load()
  send(bot, event('請問有空位嗎'), NIGHT)
  assert.match(lastReply(bot)[0].text, /訊息收到/)
  send(bot, event('還有一個問題'), NIGHT)
  assert.equal(replies(bot).length, 1)
  send(bot, event('價格', 'Uguest0002'), NIGHT) // the account's own keyword reply answers this
  assert.equal(replies(bot).length, 1)
  send(bot, event('請問有空位嗎', 'Uguest0003'), DAY) // daytime: people reply
  assert.equal(replies(bot).length, 1)
  send(bot, event(bookingSummary(trip, 'zh'), 'Uguest0004'), NIGHT)
  assert.match(lastReply(bot)[0].text, /訊息收到/)
})

test('website form is only logged, never asked again', () => {
  const bot = load()
  send(bot, event(bookingSummary(trip, 'zh')))
  assert.equal(replies(bot).length, 0)
  assert.equal(pushes(bot).length, 0)
  const row = bot.getSheet().rows[1]
  assert.equal(row[5], 'website')
  assert.equal(row[11], '0912-345-678')
  assert.equal(row[15], '官網表單')
})

test('keeps the result someone typed into the sheet when the row updates', () => {
  const bot = load()
  send(bot, event('我要預約導覽'))
  bot.getSheet().rows[1][16] = '成交'
  send(bot, pb('f=date&v=2026-12-05'))
  assert.equal(bot.getSheet().rows[1][16], '成交')
})
