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

function load({ props = {}, quota = { type: 'limited', value: 200 }, used = 10, sheetThrows = false, infoCode = 200 } = {}) {
  const store = { WEBHOOK_KEY: 'k', BIND_CODE: '123456', LINE_CHANNEL_ACCESS_TOKEN: 't', ...props }
  const calls = []
  const mails = []
  let sheet = null
  const cache = new Map()
  const ctx = {
    console: { log() {}, warn() {}, error() {} },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (k) => (k in store ? store[k] : null),
      setProperty: (k, v) => { store[k] = v },
      deleteProperty: (k) => { delete store[k] },
    }) },
    UrlFetchApp: { fetch(url, opts) {
      const path = url.replace('https://api.line.me/v2/bot', '')
      calls.push({ path, method: opts.method, body: opts.payload ? JSON.parse(opts.payload) : null })
      let body = '{}'
      if (path.startsWith('/profile/')) body = JSON.stringify({ displayName: '王小明' })
      if (path === '/message/quota') body = JSON.stringify(quota)
      if (path === '/message/quota/consumption') body = JSON.stringify({ totalUsage: used })
      if (path === '/info') return { getResponseCode: () => infoCode, getContentText: () => '{"userId":"Ubot"}' }
      return { getResponseCode: () => 200, getContentText: () => body }
    } },
    MailApp: { sendEmail: (to, subject, body) => mails.push({ to, subject, body }) },
    Session: { getEffectiveUser: () => ({ getEmail: () => 'owner@example.com' }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => {
      if (sheetThrows) throw new Error('sheet down')
      return {
      getSheetByName: () => sheet,
      insertSheet: () => (sheet = fakeSheet()),
    } } },
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
  return { ctx, store, calls, mails, getSheet: () => sheet }
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
  send(bot, event('8'), NIGHT)
  // 150 minutes came from the website button, so no duration question
  assert.match(lastReply(bot)[0].text, /pick you up/)
  send(bot, pb('f=pickup&v='), NIGHT)
  // phone step: no skip button, only "talk to a person"
  assert.deepEqual(lastReply(bot)[0].quickReply.items.map(i => i.action.label), ['Talk to a person'])
  send(bot, event('+81 90 1234 5678'), NIGHT)
  const done = lastReply(bot)[0].text
  assert.match(done, /Thu 12\/24 · time TBC/)
  assert.match(done, /8 guests · 150 min/)
  assert.match(done, /Mobile: \+81 90 1234 5678/)
  assert.match(done, /8:00 AM/)
  // already told when we reply, so no "message received" later tonight
  const n = replies(bot).length
  send(bot, event('Can we bring a stroller?'), NIGHT)
  assert.equal(replies(bot).length, n)
})

test('a question mid-flow hands the chat to a person, and the guest is told so', () => {
  const bot = load()
  send(bot, event('我要預約導覽'))
  send(bot, pb('f=date&v=2026-12-05'))
  send(bot, event('請問可以帶狗嗎？'))
  assert.equal(lastReply(bot)[0].text, '收到，我請專人回覆您 🦌')
  const before = replies(bot).length
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

test('questions say how many there are and show progress', () => {
  const bot = load()
  send(bot, event('我要預約導覽'))
  const first = lastReply(bot)[0].text
  assert.match(first, /回答 6 個小問題（約 30 秒）/)
  assert.match(first, /（1\/6）想哪一天/)
  send(bot, pb('f=date&v=2026-12-05'))
  assert.match(lastReply(bot)[0].text, /^（2\/6）大概幾點/)
  send(bot, pb('f=time&v=10:00'))
  send(bot, pb('f=people&v=5'))
  send(bot, pb('f=minutes&v=90'))
  send(bot, pb('f=pickup&v='))
  assert.match(lastReply(bot)[0].text, /^（6\/6）最後.*只用於這次預約/)
  // website hello with a duration skips that question: 5 in total
  const b2 = load()
  send(b2, event('你好，我想預約 90 分鐘導覽。'))
  assert.match(lastReply(b2)[0].text, /回答 5 個小問題[\s\S]*（1\/5）/)
})

const MOM = 'Umom00000001'
const finish = (bot, now = DAY) => {
  send(bot, event('我要預約導覽'), now)
  for (const d of ['f=date&v=2026-12-17', 'f=time&v=10:00', 'f=people&v=5', 'f=minutes&v=90', 'f=pickup&v=']) send(bot, pb(d), now)
  send(bot, event('0912-345-678'), now)
}

test('binding: wrong code is refused and limited, right code binds, unbind works', () => {
  const bot = load()
  send(bot, event('綁定 000000', MOM))
  assert.match(lastReply(bot)[0].text, /不對/)
  send(bot, event('綁定 123456', MOM))
  assert.equal(bot.store.PUSH_TO, MOM)
  assert.match(lastReply(bot)[0].text, /綁定完成/)
  send(bot, event('取消綁定', MOM))
  assert.equal(bot.store.PUSH_TO, '')
  const b2 = load()
  for (let i = 0; i < 5; i++) send(b2, event('綁定 111111', 'Uhacker'))
  const n = replies(b2).length
  send(b2, event('綁定 123456', 'Uhacker'))
  assert.equal(replies(b2).length, n) // locked out
  assert.equal(b2.store.PUSH_TO, undefined)
  // nothing is pushed when no one is bound
  finish(b2)
  assert.equal(pushes(b2).length, 0)
})

test('daytime: finished inquiry, "找真人" and website form each push one summary to staff', () => {
  const bot = load({ props: { PUSH_TO: MOM, BOT_USER_ID: 'Ubot' } })
  finish(bot)
  assert.equal(pushes(bot).length, 1)
  const p = pushes(bot)[0].body
  assert.equal(p.to, MOM)
  const t = p.messages[0].text
  assert.match(t, /新預約詢問｜王小明/)
  assert.match(t, /12\/17（四）・10:00/)
  assert.match(t, /0912-345-678/)
  assert.match(t, /平日/)
  assert.match(t, /chat\.line\.biz\/Ubot\/chat\/Uguest0001/)
  send(bot, event('我要預約導覽', 'Uguest0002'))
  send(bot, pb('f=chat', null, 'Uguest0002'))
  assert.match(pushes(bot).at(-1).body.messages[0].text, /有人想找真人｜王小明/)
  send(bot, event('預約導覽', 'Uguest0003'))
  send(bot, event('可以帶狗嗎？', 'Uguest0003'))
  assert.match(pushes(bot).at(-1).body.messages[0].text, /找真人[\s\S]*「可以帶狗嗎？」/)
  send(bot, event(bookingSummary(trip, 'zh'), 'Uguest0004'))
  assert.match(pushes(bot).at(-1).body.messages[0].text, /官網預約詢問/)
  assert.equal(pushes(bot).length, 4)
  assert.equal(bot.store['PUSH_COUNT_2026-12'], '4')
})

test('night inquiries are pushed as one message in the morning', () => {
  const bot = load({ props: { PUSH_TO: MOM, BOT_USER_ID: 'Ubot' } })
  finish(bot, NIGHT)
  send(bot, event('我要預約導覽', 'Uguest0002'), NIGHT)
  send(bot, pb('f=chat', null, 'Uguest0002'), NIGHT)
  assert.equal(pushes(bot).length, 0)
  bot.ctx.sendMorningDigest(at('2026-12-02T00:05:00Z'))
  assert.equal(pushes(bot).length, 1)
  const t = pushes(bot)[0].body.messages[0].text
  assert.match(t, /晚上有 2 筆詢問/)
  assert.match(t, /新預約詢問/)
  assert.match(t, /找真人/)
  bot.ctx.sendMorningDigest(at('2026-12-03T00:05:00Z'))
  assert.equal(pushes(bot).length, 1) // nothing queued, nothing sent
})

test('push stops at the monthly limit and when the account quota is used up', () => {
  const capped = load({ props: { PUSH_TO: MOM, PUSH_MONTHLY_LIMIT: '1' } })
  finish(capped)
  send(capped, event('預約導覽', 'Uguest0002'))
  send(capped, pb('f=chat', null, 'Uguest0002'))
  assert.equal(pushes(capped).length, 1)
  const full = load({ props: { PUSH_TO: MOM }, used: 200 })
  finish(full)
  assert.equal(pushes(full).length, 0)
  assert.equal(full.getSheet().rows[1][15], '資料齊了') // still logged
})


test('pickup offers the car parks and lets guests type their guesthouse', () => {
  const bot = load()
  send(bot, event('我要預約導覽'))
  for (const d of ['f=date&v=2026-12-17', 'f=time&v=10:00', 'f=people&v=5', 'f=minutes&v=90']) send(bot, pb(d))
  const [msg] = lastReply(bot)
  assert.match(msg.text, /民宿/)
  const labels = quick(msg).map((a) => a.label)
  assert.ok(labels.includes('鹿港生態公園停車場'))
  assert.ok(labels.includes('鹿草路停車場'))
  assert.ok(!labels.some((l) => l.includes('天后宮')))
  send(bot, event('鹿港老街民宿'))
  assert.equal(bot.getSheet().rows.at(-1)[10], '鹿港老街民宿')
})

test('a crash mid-event still answers the guest and is recorded', () => {
  const bot = load({ sheetThrows: true })
  post(bot, [event('我要預約導覽')])
  const r = replies(bot)
  assert.equal(r.length, 1)
  assert.match(r[0].body.messages[0].text, /訊息收到/)
  assert.match(r[0].body.messages[0].text, /0927-013-167/)
  assert.equal(JSON.parse(bot.store.ERROR_LOG).count, 1)
  assert.ok(Number(bot.store.LAST_EVENT_AT) > 0)
})

test('no fallback when the guest was already answered before the error', () => {
  const bot = load()
  bot.ctx.notifyStaff = () => { throw new Error('push failed') }
  post(bot, [event('我要預約導覽')])
  post(bot, [pb('f=chat')])
  assert.equal(replies(bot).filter((c) => c.body.replyToken === 'rp').length, 1)
  assert.equal(JSON.parse(bot.store.ERROR_LOG).count, 1)
})

test('health check emails the owner once, and again when it recovers', () => {
  const bot = load({ infoCode: 401, props: { PUSH_TO: 'Umom' } })
  const status = bot.ctx.healthCheck(DAY)
  assert.equal(status.ok, false)
  assert.equal(bot.mails.length, 1)
  assert.equal(bot.mails[0].to, 'owner@example.com')
  assert.match(bot.mails[0].body, /導覽｜預約表單/)
  assert.equal(pushes(bot).length, 0) // token is broken, so no LINE push
  bot.ctx.healthCheck(new Date(DAY.getTime() + 3600e3))
  assert.equal(bot.mails.length, 1) // throttled
})

test('health check pushes staff on errors and reports recovery', () => {
  const bot = load({ props: { PUSH_TO: 'Umom', ALERT_EMAIL: 'leon@example.com' } })
  bot.ctx.recordError(new Error('boom'))
  assert.equal(bot.ctx.healthCheck(DAY).ok, false)
  assert.equal(bot.mails.at(-1).to, 'leon@example.com')
  assert.match(pushes(bot)[0].body.messages[0].text, /小幫手暫時有狀況/)
  assert.equal(bot.store.ERROR_LOG, undefined)
  assert.equal(bot.ctx.healthCheck(new Date(DAY.getTime() + 3600e3)).ok, true)
  assert.match(bot.mails.at(-1).subject, /恢復/)
  assert.equal(bot.store.ALERT_OPEN, undefined)
})

test('health flags a webhook that has gone quiet', () => {
  const bot = load({ props: { LAST_EVENT_AT: String(DAY.getTime() - 80 * 3600e3) } })
  const status = bot.ctx.healthStatus(DAY)
  assert.equal(status.ok, false)
  assert.match(status.problems[0], /72/)
})

test('health endpoint needs the webhook key', () => {
  const bot = load()
  assert.equal(bot.ctx.doGet({ parameter: { health: '1' } }), 'GtourLK LINE bot is running.')
  const body = JSON.parse(bot.ctx.doGet({ parameter: { health: '1', key: 'k' } }))
  assert.equal(body.ok, true)
  assert.equal(body.tokenOk, true)
})

test('typed answers in everyday words: Chinese numbers, weekdays, date + time, adults + kids', () => {
  const { ctx } = load()
  const now = DAY // Tue 2026-12-01
  assert.equal(ctx.parseDateText('這週六', now), '2026-12-05')
  assert.equal(ctx.parseDateText('下週六', now), '2026-12-12')
  assert.equal(ctx.parseDateText('星期日', now), '2026-12-06')
  assert.equal(ctx.parseDateText('這週一', now), '') // already past
  assert.equal(ctx.parseDateText('後天', now), '2026-12-03')
  assert.equal(ctx.parseDateText('十二月二十號', now), '2026-12-20')
  assert.deepEqual({ ...ctx.parseDateTime('12/20 下午2點', now) }, { date: '2026-12-20', time: '14:00', period: '' })
  assert.deepEqual({ ...ctx.parseDateTime('12月20號下午', now) }, { date: '2026-12-20', time: '', period: '下午' })
  assert.deepEqual({ ...ctx.parseDateTime('下週六早上十點', now) }, { date: '2026-12-12', time: '10:00', period: '' })
  assert.equal(ctx.parseTimeText('下午兩點'), '14:00')
  assert.equal(ctx.parseTimeText('下午兩點半'), '14:30')
  assert.equal(ctx.parseTimeText('兩點'), '14:00')
  assert.equal(ctx.parseTimeText('早上十點'), '10:00')
  assert.equal(ctx.parseTimeText('10點30分'), '10:30')
  const people = (t) => { const p = ctx.parsePeople(t); return p && { ...p } }
  assert.deepEqual(people('三位'), { total: 3, kids: 0, approx: false })
  assert.deepEqual(people('兩位'), { total: 2, kids: 0, approx: false })
  assert.deepEqual(people('4位大人'), { total: 4, kids: 0, approx: false })
  assert.deepEqual(people('2大1小'), { total: 3, kids: 1, approx: false })
  assert.deepEqual(people('大人2小孩1'), { total: 3, kids: 1, approx: false })
  assert.deepEqual(people('2 adults 1 child'), { total: 3, kids: 1, approx: false })
  assert.deepEqual(people('二十幾位'), { total: 20, kids: 0, approx: true })
  assert.equal(people('可以帶狗嗎'), null)
  assert.equal(ctx.parseMinutesText('一個半小時'), 90)
  assert.equal(ctx.parseMinutesText('90分鐘'), 90)
  assert.equal(ctx.parseMinutesText('兩個半小時'), 150)
})

test('date + time typed together skips the time question; kids are noted', () => {
  const bot = load()
  send(bot, event('我要預約導覽'))
  send(bot, event('12/20 下午2點'))
  assert.match(lastReply(bot)[0].text, /幾位/)
  send(bot, event('2大1小'))
  assert.match(lastReply(bot)[0].text, /多久/)
  const row = bot.getSheet().rows[1]
  assert.equal(row[6], '2026-12-20')
  assert.equal(row[7], '14:00')
  assert.equal(row[8], 3)
  assert.match(row[12], /小孩 1 位/)
})

test('not understood: ask again once with an example, then hand to a person', () => {
  const bot = load({ props: { PUSH_TO: MOM } })
  send(bot, event('我要預約導覽'))
  send(bot, event('過陣子'))
  const again = lastReply(bot)
  assert.match(again[0].text, /沒看懂.*12\/20/)
  assert.match(again[1].text, /想哪一天/) // buttons again
  assert.doesNotMatch(again[1].text, /小問題/) // no intro the second time
  assert.ok(again[1].quickReply)
  assert.equal(pushes(bot).length, 0)
  send(bot, event('還不確定欸'))
  assert.equal(lastReply(bot)[0].text, '收到，我請專人回覆您 🦌')
  assert.equal(bot.getSheet().rows[1][15], '交給真人')
  assert.match(pushes(bot).at(-1).body.messages[0].text, /找真人[\s\S]*「還不確定欸」/)
  // a miss only counts for the step it happened on
  const b2 = load()
  send(b2, event('我要預約導覽'))
  send(b2, event('過陣子'))
  send(b2, event('12/20'))
  send(b2, event('看情況'))
  assert.match(lastReply(b2)[0].text, /沒看懂/)
})

test('large private groups follow the normal flow: price up to 50, quote after that', () => {
  const b3 = load()
  send(b3, event('我要預約導覽'))
  send(b3, pb('f=date&v=2026-12-17'))
  send(b3, pb('f=time&v=10:00'))
  send(b3, pb('f=people&v=more'))
  send(b3, event('25位'))
  assert.match(lastReply(b3)[0].text, /多久/)
  assert.match(quick(lastReply(b3)[0])[0].label, /NT\$/)
  const b4 = load()
  send(b4, event('我要預約導覽'))
  send(b4, pb('f=date&v='))
  send(b4, pb('f=time&v='))
  send(b4, event('六十位'))
  assert.match(lastReply(b4)[0].text, /多久/)
  assert.doesNotMatch(quick(lastReply(b4)[0])[0].label, /NT\$/)
})
