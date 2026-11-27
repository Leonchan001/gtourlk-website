import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { bookingSummary } from '../src/data/booking.js'
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

const trip = { date: '2026-12-02', departure: '14:00', people: 4, minutes: 90, pickup: '', notes: '' }
const event = (text, userId = 'Uguest0001', replyToken = 'r1') => ({
  type: 'message', replyToken, source: { type: 'user', userId }, message: { type: 'text', text },
})
const post = (bot, events, key = 'k') => bot.ctx.doPost({ parameter: { key }, postData: { contents: JSON.stringify({ events }) } })
const pushes = (bot) => bot.calls.filter((c) => c.path === '/message/push')
const replies = (bot) => bot.calls.filter((c) => c.path === '/message/reply')

test('parses the zh and en website inquiry exactly as the site writes it', () => {
  const { ctx } = load()
  const zh = ctx.parseInquiry(bookingSummary(trip, 'zh'), '')
  assert.equal(zh.source, 'website')
  assert.equal(zh.lang, 'zh')
  assert.equal(zh.date, '2026-12-02')
  assert.equal(zh.departure, '14:00')
  assert.equal(zh.people, 4)
  assert.equal(zh.minutes, 90)
  assert.equal(zh.pickup, '')
  assert.equal(zh.notes, '')
  assert.match(zh.price, /\d/)
  const en = ctx.parseInquiry(bookingSummary({ ...trip, pickup: 'Lukang Old Street' }, 'en'), '')
  assert.equal(en.lang, 'en')
  assert.equal(en.people, 4)
  assert.equal(en.pickup, 'Lukang Old Street')
  const blank = ctx.parseInquiry(bookingSummary({ ...trip, date: '', departure: '' }, 'zh'), '')
  assert.equal(blank.date, '')
  assert.equal(blank.departure, '')
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
    assert.match(ctx.parseInquiry(copy.linePlace('天后宮'), '').notes, /天后宮/)
  }
  assert.equal(ctx.parseInquiry('預約導覽', '預約導覽,booking').source, 'keyword')
  assert.equal(ctx.parseInquiry('停車', '預約導覽,booking'), null)
  assert.equal(ctx.parseInquiry('謝謝', '預約導覽'), null)
})

test('flags weekday and short-notice tours in Taipei time', () => {
  const { ctx } = load()
  const now = new Date('2026-12-01T17:00:00Z') // 12/2 01:00 Taipei
  assert.deepEqual([...ctx.inquiryFlags({ date: '2026-12-02' }, now)], ['平日', '今天'])
  assert.deepEqual([...ctx.inquiryFlags({ date: '2026-12-06' }, now)], [])
  assert.deepEqual([...ctx.inquiryFlags({ date: '2026-12-03' }, now)], ['平日', '明天'])
  assert.deepEqual([...ctx.inquiryFlags({ date: '' }, now)], [])
})

test('escalation clock only runs in working hours', () => {
  const { ctx } = load()
  const at = (s) => new Date(s)
  // 10:00 inquiry, 10:31 now → escalate after 30 minutes
  assert.equal(ctx.shouldEscalate(at('2026-12-01T02:00:00Z'), at('2026-12-01T02:31:00Z'), 30, 8, 21), true)
  assert.equal(ctx.shouldEscalate(at('2026-12-01T02:00:00Z'), at('2026-12-01T02:20:00Z'), 30, 8, 21), false)
  // 22:00 inquiry: not at 23:00, not at 08:10, yes at 08:31 next day
  const night = at('2026-12-01T14:00:00Z')
  assert.equal(ctx.shouldEscalate(night, at('2026-12-01T15:00:00Z'), 30, 8, 21), false)
  assert.equal(ctx.shouldEscalate(night, at('2026-12-02T00:10:00Z'), 30, 8, 21), false)
  assert.equal(ctx.shouldEscalate(night, at('2026-12-02T00:31:00Z'), 30, 8, 21), true)
})

test('rejects webhook calls without the secret key', () => {
  const bot = load()
  assert.equal(post(bot, [event(bookingSummary(trip, 'zh'))], 'wrong'), 'forbidden')
  assert.equal(bot.calls.length, 0)
})

test('binding commands need the bind code', () => {
  const bot = load()
  post(bot, [event('綁定主要 000000', 'Udad')])
  assert.equal(bot.store.PRIMARY_USER_ID, undefined)
  post(bot, [event('綁定主要 123456', 'Udad'), event('綁定備援 123456', 'Umom')])
  assert.equal(bot.store.PRIMARY_USER_ID, 'Udad')
  assert.equal(bot.store.BACKUP_USER_ID, 'Umom')
  post(bot, [event('綁定主要１２３４５６', 'Udad2')])
  assert.equal(bot.store.PRIMARY_USER_ID, 'Udad2')
  post(bot, [event('綁定 主要', 'Ux')])
  assert.match(replies(bot).at(-1).body.messages[0].text, /綁定格式/)
})

test('website inquiry: free reply to guest, one push to primary, logged', () => {
  const bot = load({ props: { PRIMARY_USER_ID: 'Udad', BACKUP_USER_ID: 'Umom' } })
  post(bot, [event(bookingSummary(trip, 'zh'))])
  const r = replies(bot)
  assert.equal(r.length, 1)
  assert.match(r[0].body.messages[0].text, /收到您的預約詢問/)
  const p = pushes(bot)
  assert.equal(p.length, 1)
  assert.equal(p[0].body.to, 'Udad')
  const card = p[0].body.messages[0]
  assert.equal(card.type, 'flex')
  assert.ok(card.altText.length <= 400)
  const labels = card.contents.footer.contents.map((b) => b.action.label)
  assert.deepEqual(labels, ['可以接', '不能接', '轉同業', '我來聊'])
  card.contents.footer.contents.forEach((b) => assert.ok(b.action.data.length <= 300))
  const rows = bot.getSheet().rows
  assert.equal(rows.length, 2)
  assert.equal(rows[1][2], 'Uguest0001')
  assert.equal(rows[1][3], '王小明')
  assert.equal(rows[1][14], '待處理')
  // same guest again within 30 minutes: acked, but no second push
  post(bot, [event(bookingSummary(trip, 'zh'), 'Uguest0001', 'r2')])
  assert.equal(pushes(bot).length, 1)
  assert.equal(bot.getSheet().rows.length, 2)
})

test('staff messages are never treated as inquiries', () => {
  const bot = load({ props: { PRIMARY_USER_ID: 'Udad' } })
  post(bot, [event(bookingSummary(trip, 'zh'), 'Udad')])
  assert.equal(pushes(bot).length, 0)
  bot.store.TEST_MODE = 'on'
  post(bot, [event(bookingSummary(trip, 'zh'), 'Udad')])
  assert.equal(pushes(bot).length, 1)
})

test('postback sends the guest the answer once, and only staff can press', () => {
  const bot = load({ props: { PRIMARY_USER_ID: 'Udad', BACKUP_USER_ID: 'Umom' } })
  post(bot, [event(bookingSummary(trip, 'en'))])
  const data = pushes(bot)[0].body.messages[0].contents.footer.contents[0].action.data
  const press = (userId, d = data) => post(bot, [{ type: 'postback', replyToken: 'rp', source: { type: 'user', userId }, postback: { data: d } }])
  press('Ustranger')
  assert.equal(pushes(bot).length, 1)
  press('Udad')
  const toGuest = pushes(bot)[1]
  assert.equal(toGuest.body.to, 'Uguest0001')
  assert.match(toGuest.body.messages[0].text, /Good news/)
  assert.match(toGuest.body.messages[0].text, /2026-12-02, 14:00, 4 guests, 90 minutes/)
  assert.equal(bot.getSheet().rows[1][14], '可以接')
  assert.equal(bot.getSheet().rows[1][15], '主要負責人')
  press('Umom', data.replace('accept', 'decline'))
  assert.equal(pushes(bot).length, 2)
  assert.match(replies(bot).at(-1).body.messages[0].text, /已經由主要負責人處理/)
})

test('"我來聊" costs no push to the guest', () => {
  const bot = load({ props: { PRIMARY_USER_ID: 'Udad' } })
  post(bot, [event('預約導覽')])
  assert.equal(replies(bot).length, 0) // the OA's own keyword reply answers this one
  const card = pushes(bot)[0].body.messages[0]
  assert.deepEqual(card.contents.footer.contents.map((b) => b.action.label), ['我來聊'])
  post(bot, [{ type: 'postback', replyToken: 'rp', source: { type: 'user', userId: 'Udad' }, postback: { data: card.contents.footer.contents[0].action.data } }])
  assert.equal(pushes(bot).length, 1)
  assert.equal(bot.getSheet().rows[1][14], '真人聊天中')
})

test('escalates to backup once after the wait', () => {
  const bot = load({ props: { PRIMARY_USER_ID: 'Udad', BACKUP_USER_ID: 'Umom' } })
  post(bot, [event(bookingSummary(trip, 'zh'))])
  const VmDate = bot.ctx.escalatePending.constructor('return Date')()
  bot.getSheet().rows[1][1] = new VmDate('2026-12-01T02:00:00Z') // 10:00 Taipei
  bot.ctx.escalatePending(new VmDate('2026-12-01T02:20:00Z'))
  assert.equal(pushes(bot).filter((p) => p.body.to === 'Umom').length, 0)
  bot.ctx.escalatePending(new VmDate('2026-12-01T02:31:00Z'))
  bot.ctx.escalatePending(new VmDate('2026-12-01T02:40:00Z'))
  const toMom = pushes(bot).filter((p) => p.body.to === 'Umom')
  assert.equal(toMom.length, 1)
  assert.match(JSON.stringify(toMom[0].body), /轉給你/)
  assert.ok(bot.getSheet().rows[1][17])
})

test('warns on the card when the monthly quota is nearly gone', () => {
  const bot = load({ props: { PRIMARY_USER_ID: 'Udad' }, used: 190 })
  post(bot, [event(bookingSummary(trip, 'zh'))])
  assert.match(JSON.stringify(pushes(bot)[0].body), /只剩 10 則/)
})
