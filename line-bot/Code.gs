/**
 * 導鹿 LINE 預約小幫手（Google Apps Script）
 *
 * 目的：旅客點「我要預約導覽」後，用按鈕一步步問齊資料，最後給一份含參考價的摘要。
 * 負責人在聊天室看到時資料已經齊了，只要回一句確認，不用再一題一題問。
 *
 *   1. 日期（日曆選擇／今天／明天／還沒決定）
 *   2. 出發時間
 *   3. 人數
 *   4. 導覽時長（按鈕上直接顯示參考價）
 *   5. 上車地點（可直接打字）
 *   6. 聯絡手機（有「略過」按鈕）
 *   → 預約摘要（和官網送出的格式一樣）＋寫進 Google 試算表
 *
 * 全部用免費的「回覆訊息」，不花每月推播額度。旅客任何時候打字聊天，小幫手就安靜退出，交給真人。
 * 官網送出的完整預約訊息不再問一次，只記到試算表。
 *
 * 設定都放在「專案設定 → 指令碼屬性」，程式裡不放任何金鑰。安裝步驟見 README.md。
 */

var DEFAULTS = {
  INTENT_KEYWORDS: '我要預約導覽,預約導覽,導覽預約,我想預約,book a tour,booking',
  TIME_OPTIONS: '09:00,10:00,11:00,13:00,14:00,15:00,16:00',
  PICKUP_OPTIONS: '天后宮停車場旁',
  REPLY_START_HOUR: '8',    // 真人回覆時段（台北時間），用在最後一句「多久會回覆」
  REPLY_END_HOUR: '21',
  FLOW_HOURS: '6'           // 問到一半多久沒動作就作廢（最多 6 小時）
};

var TZ = 'Asia/Taipei';
var LINE_API = 'https://api.line.me/v2/bot';
var LOG_SHEET = '預約詢問';
var LOG_HEADERS = ['編號', '收到時間', '旅客 ID', '旅客名稱', '語言', '來源', '日期', '出發時間', '人數',
  '導覽分鐘', '上下車地點', '手機', '其他需求', '參考價', '提醒', '狀態', '結果', '原始訊息'];
var COL = {};
LOG_HEADERS.forEach(function (name, i) { COL[name] = i + 1; });
var RESULTS = ['成交', '沒成交', '改電話', '其他'];
var STATUS = { ASKING: '問資料中', DONE: '資料齊了', CHAT: '改用文字聊', WEBSITE: '官網表單' };
var STEPS = ['date', 'time', 'people', 'minutes', 'pickup', 'phone'];

// 和官網 src/data/tours.js 的 TOUR_PRICING 相同
var PRICING = { oneToTwoHourly: 600, threePlusHourlyPerPerson: 200, guestsPerVehicle: 5, lineDiscountRate: 0.95 };
var DEFAULT_ROUTE = {
  zh: '沒有特別要求，就按所選時長的導鹿預設路線安排；想去特定地方，直接跟導覽員說明即可。',
  en: 'We follow the GtourLK default route for your chosen duration unless you request otherwise. Tell your guide directly about any special requests.'
};

// ---------------------------------------------------------------- 安裝

/** 安裝時在編輯器手動執行一次：建立試算表分頁與 WEBHOOK_KEY，並移除舊版的定時觸發。 */
function setup() {
  var sheet = logSheet();
  try {
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(RESULTS, true).setAllowInvalid(true).build();
    sheet.getRange(2, COL['結果'], 1000, 1).setDataValidation(rule);
  } catch (err) { console.warn('結果欄下拉選單沒設成功：' + err); }
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  if (!prop('WEBHOOK_KEY')) setProp('WEBHOOK_KEY', Utilities.getUuid().replace(/-/g, ''));
  console.log('完成。WEBHOOK_KEY 已寫入指令碼屬性，請到「專案設定」查看。');
}

// ---------------------------------------------------------------- 設定

function prop(name) {
  var value = PropertiesService.getScriptProperties().getProperty(name);
  if (value === null || value === undefined || value === '') return DEFAULTS[name] === undefined ? '' : DEFAULTS[name];
  return value;
}

function setProp(name, value) {
  PropertiesService.getScriptProperties().setProperty(name, value);
}

function listProp(name) {
  return String(prop(name)).split(',').map(function (s) { return s.trim(); }).filter(String);
}

// ---------------------------------------------------------------- 純函式（可在本機測試）

/** 台北時間的 { date: 'yyyy-MM-dd', hour }。 */
function taipeiNow(now) {
  var t = new Date(now.getTime() + 8 * 3600 * 1000);
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return { date: t.getUTCFullYear() + '-' + p(t.getUTCMonth() + 1) + '-' + p(t.getUTCDate()), hour: t.getUTCHours() };
}

function addDays(dateStr, days) {
  var d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 和官網 estimateTour 相同的算法。 */
function estimateTour(people, minutes) {
  var guests = Number(people), duration = Number(minutes);
  if (guests % 1 !== 0 || guests < 1 || guests > 50 || [60, 90, 150].indexOf(duration) === -1) return null;
  var hours = duration / 60;
  var total = guests <= 2 ? PRICING.oneToTwoHourly * hours : PRICING.threePlusHourlyPerPerson * guests * hours;
  return { total: total, linePrice: Math.round(total * PRICING.lineDiscountRate), vehicles: Math.ceil(guests / PRICING.guestsPerVehicle) };
}

function money(amount) {
  return 'NT$' + String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** 和官網 validPhone 相同：去掉空白、橫線、括號後 8–15 碼，可加 +。 */
function cleanPhone(value) { return String(value || '').replace(/[\s\-().]/g, ''); }
function validPhone(value) { return /^\+?\d{8,15}$/.test(cleanPhone(value)); }

/** 摘要的欄位行，格式和官網 bookingSummary 一樣，負責人看起來不會有差別。 */
function summaryLines(trip, lang) {
  var est = estimateTour(trip.people, trip.minutes);
  if (lang === 'en') {
    var tbc = 'To be confirmed';
    return [
      'Date: ' + (trip.date || tbc),
      'Departure: ' + (trip.departure || tbc),
      'Guests: ' + (trip.people || tbc),
      'Mobile: ' + (trip.phone || tbc),
      'Duration: ' + (trip.minutes ? trip.minutes + ' minutes' : tbc),
      'Route: ' + DEFAULT_ROUTE.en,
      'Pick-up / drop-off: ' + (trip.pickup || tbc),
      'Other requests: ' + (trip.notes || 'None specified'),
      'Estimated vehicles: ' + (est ? est.vehicles : tbc),
      'Standard total: ' + (est ? money(est.total) : tbc),
      'Official LINE estimate (5% off): ' + (est ? money(est.linePrice) : tbc)
    ];
  }
  var pending = '待確認';
  return [
    '日期：' + (trip.date || pending),
    '出發時間：' + (trip.departure || pending),
    '人數：' + (trip.people ? trip.people + ' 位' : pending),
    '聯絡手機：' + (trip.phone || pending),
    '導覽時間：' + (trip.minutes ? trip.minutes + ' 分鐘' : pending),
    '路線：' + DEFAULT_ROUTE.zh,
    '上下車地點：' + (trip.pickup || pending),
    '其他需求：' + (trip.notes || '未指定'),
    '預估車輛：' + (est ? est.vehicles : pending) + ' 台',
    '牌價合計：' + (est ? money(est.total) : pending),
    '官方 LINE 預約參考價（95 折）：' + (est ? money(est.linePrice) : pending)
  ];
}

/** 平日／今天／明天／日期已過 */
function tripFlags(date, now) {
  var flags = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return flags;
  var today = taipeiNow(now).date;
  var weekday = new Date(date + 'T00:00:00Z').getUTCDay();
  if (weekday >= 1 && weekday <= 5) flags.push('平日');
  if (date < today) flags.push('日期已過');
  else if (date === today) flags.push('今天');
  else if (date === addDays(today, 1)) flags.push('明天');
  return flags;
}

/** 旅客打字的日期：2026-12-05、12/5、12月5日、今天、明天。回傳 yyyy-MM-dd 或 ''。 */
function parseDateText(textValue, now) {
  var t = String(textValue || '').replace(/\s/g, '');
  var today = taipeiNow(now).date;
  if (/^(今天|today)$/i.test(t)) return today;
  if (/^(明天|tomorrow)$/i.test(t)) return addDays(today, 1);
  var y, mo, d, yearGiven = false;
  var m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; yearGiven = true; } else {
    m = t.match(/^(\d{1,2})(?:[/.-]|月)(\d{1,2})(?:日|號)?$/);
    if (!m) return '';
    mo = +m[1]; d = +m[2]; y = +today.slice(0, 4);
  }
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return '';
  var out = y + '-' + (mo < 10 ? '0' : '') + mo + '-' + (d < 10 ? '0' : '') + d;
  if (!yearGiven && out < today) out = (y + 1) + out.slice(4); // 1 月打「12/5」，指的是今年底已過，改成明年
  return out;
}

/** 旅客打字的時間：14:00、2點、下午2點半、2pm。回傳 HH:mm 或 ''。 */
function parseTimeText(textValue) {
  var t = String(textValue || '').replace(/\s/g, '').toLowerCase();
  var h, min = 0;
  var m = t.match(/^(\d{1,2})[:：](\d{2})$/);
  if (m) { h = +m[1]; min = +m[2]; } else if ((m = t.match(/^(\d{1,2})(am|pm)$/))) {
    h = +m[1];
    if (m[2] === 'pm' && h < 12) h += 12;
  } else if ((m = t.match(/^(上午|早上|中午|下午|晚上)?(\d{1,2})(?:點|時)(半)?$/))) {
    h = +m[2];
    if (m[3]) min = 30;
    if ((m[1] === '下午' || m[1] === '晚上') && h < 12) h += 12;
    if (!m[1] && h >= 1 && h <= 6) h += 12; // 「2點」通常是下午
  } else {
    return '';
  }
  if (h > 23 || min > 59) return '';
  return (h < 10 ? '0' : '') + h + ':' + (min < 10 ? '0' : '') + min;
}

/**
 * 看懂旅客傳來的文字：
 *   website：官網表單送出的完整預約訊息（已經有資料，不用再問）
 *   hello：官網其他按鈕的預填句子（可能帶著導覽時長）
 *   keyword：「我要預約導覽」等關鍵字
 */
function parseInquiry(textValue, keywords) {
  var t = String(textValue || '').trim();
  if (!t) return null;
  var zhForm = t.indexOf('您好導鹿，我想詢問') === 0, enForm = t.indexOf('Hello GtourLK, I would like to ask about') === 0;
  if (zhForm || enForm) {
    var labels = {
      date: ['日期', 'Date'], departure: ['出發時間', 'Departure'], people: ['人數', 'Guests'], phone: ['聯絡手機', 'Mobile'],
      minutes: ['導覽時間', 'Duration'], pickup: ['上下車地點', 'Pick-up / drop-off'], notes: ['其他需求', 'Other requests'],
      price: ['官方 LINE 預約參考價（95 折）', 'Official LINE estimate (5% off)']
    };
    var empty = ['待確認', 'To be confirmed', '未指定', 'None specified'];
    var f = {};
    t.split(/\r?\n/).forEach(function (line) {
      var m = line.match(/^(.+?)[：:]\s*(.*)$/);
      if (!m) return;
      Object.keys(labels).forEach(function (k) { if (labels[k].indexOf(m[1].trim()) !== -1) f[k] = m[2].trim(); });
    });
    Object.keys(f).forEach(function (k) { if (empty.indexOf(f[k]) !== -1) f[k] = ''; });
    var people = (f.people || '').match(/\d+/), minutes = (f.minutes || '').match(/\d+/);
    return { source: 'website', lang: enForm ? 'en' : 'zh', date: f.date || '', departure: f.departure || '',
      people: people ? +people[0] : '', minutes: minutes ? +minutes[0] : '', phone: f.phone || '',
      pickup: f.pickup || '', notes: f.notes || '', price: f.price || '' };
  }
  if (t.length <= 120 && (t.indexOf('你好，我想預約') === 0 || t.indexOf('Hi, I would like to book') === 0)) {
    var hello = blankTrip('hello', t.indexOf('Hi,') === 0 ? 'en' : 'zh');
    var mins = t.match(/(\d+)(?: 分鐘|-minute)/);
    if (mins && [60, 90, 150].indexOf(+mins[1]) !== -1) hello.minutes = +mins[1];
    var place = t.match(/想去(.+?)。$/) || t.match(/includes (.+?)\.$/);
    var route = t.match(/「(.+?)」/) || t.match(/"(.+?)"/);
    if (place) hello.notes = (hello.lang === 'en' ? 'Wants to visit ' : '想去') + place[1];
    else if (route) hello.notes = (hello.lang === 'en' ? 'Route: ' : '路線：') + route[1];
    return hello;
  }
  var lower = t.toLowerCase();
  var list = String(keywords || '').split(',').map(function (k) { return k.trim().toLowerCase(); }).filter(String);
  for (var i = 0; i < list.length; i++) {
    if (t.length <= 40 && lower.indexOf(list[i]) !== -1) {
      return blankTrip('keyword', /[a-z]/i.test(t) && !/[一-鿿]/.test(t) ? 'en' : 'zh');
    }
  }
  return null;
}

function blankTrip(source, lang) {
  return { source: source, lang: lang, date: '', departure: '', people: '', minutes: '', phone: '', pickup: '', notes: '', price: '' };
}

// ---------------------------------------------------------------- 問題與按鈕

var COPY = {
  zh: {
    date: '好的，幫您安排導覽 🦌\n想哪一天來鹿港呢？',
    pickDate: '選日期', today: '今天', tomorrow: '明天', notSure: '還沒決定',
    time: '大概幾點出發呢？', otherTime: '其他時間',
    people: '幾位一起搭呢？', more: '超過 10 位', moreAsk: '請直接輸入人數，例如 25',
    minutes: '想導覽多久呢？按鈕上是 LINE 預約的參考價（95 折）。',
    minutesLabel: function (m, p) { return m + ' 分鐘' + (p ? ' ' + money(p) : ''); },
    pickup: '要在哪裡上車呢？\n住宿、停車場、景點都可以，直接打字告訴我們就好。',
    phone: '最後，方便留一支手機嗎？確認時段和當天聯絡會比較快。',
    skip: '略過', badPhone: '這個號碼好像不太對，請再輸入一次，或按「略過」。',
    badPeople: '請輸入 1 到 200 之間的人數，例如 25。',
    chat: '改用文字聊', chatDisplay: '我想直接用文字聊',
    chatReply: '好的，直接在這裡留言就可以，導鹿會盡快回覆您 🦌',
    expired: '這個選單已經過期了，請再點一次「我要預約導覽」。',
    summaryTitle: '這是您的預約詢問摘要：',
    largeGroup: '人數較多，導鹿會另外幫您報價。',
    dayReply: '導鹿會在這裡跟您確認時段、集合地點與費用，白天通常幾分鐘內回覆 🦌',
    nightReply: function (h) { return '現在是休息時間，導鹿明天早上 ' + h + ' 點起會優先回覆您 🦌'; },
    edit: '想修改的話，直接打字告訴我們就好。'
  },
  en: {
    date: 'Great, let’s plan your tour 🦌\nWhich day would you like to visit Lukang?',
    pickDate: 'Pick a date', today: 'Today', tomorrow: 'Tomorrow', notSure: 'Not sure yet',
    time: 'Roughly what time would you like to start?', otherTime: 'Other time',
    people: 'How many guests?', more: 'More than 10', moreAsk: 'Please type the number of guests, e.g. 25',
    minutes: 'How long would you like the tour to be? Prices shown are the LINE booking estimate (5% off).',
    minutesLabel: function (m, p) { return m + ' min' + (p ? ' ' + money(p) : ''); },
    pickup: 'Where should we pick you up?\nA hotel, car park or sight is fine. Just type it.',
    phone: 'Lastly, could you leave a mobile number? It helps us reach you on the day.',
    skip: 'Skip', badPhone: 'That number doesn’t look right. Please type it again, or tap “Skip”.',
    badPeople: 'Please type a number from 1 to 200, e.g. 25.',
    chat: 'Just chat', chatDisplay: 'I’d like to just chat',
    chatReply: 'Sure, just send us a message here and we will reply soon 🦌',
    expired: 'This menu has expired. Please tap “Book a tour” again.',
    summaryTitle: 'Here is your booking request:',
    largeGroup: 'For a large group we will send you a separate quote.',
    dayReply: 'We will confirm the time, meeting point and fee with you here, usually within minutes during the day 🦌',
    nightReply: function (h) { return 'We are offline now and will reply after ' + h + ':00 AM (Taiwan time) 🦌'; },
    edit: 'Need to change something? Just type it here.'
  }
};

function postbackItem(label, data, displayText) {
  return { type: 'action', action: { type: 'postback', label: label.slice(0, 20), data: data, displayText: displayText || label } };
}

function pickerItem(label, data, mode, extra) {
  var action = { type: 'datetimepicker', label: label, data: data, mode: mode };
  Object.keys(extra || {}).forEach(function (k) { action[k] = extra[k]; });
  return { type: 'action', action: action };
}

function ask(textValue, items) {
  var msg = { type: 'text', text: textValue };
  if (items && items.length) msg.quickReply = { items: items.slice(0, 13) };
  return msg;
}

function chatItem(lang) {
  return postbackItem(COPY[lang].chat, 'f=chat', COPY[lang].chatDisplay);
}

/** 某一步的問題（含按鈕）。 */
function question(step, state, now) {
  var c = COPY[state.lang];
  var today = taipeiNow(now).date;
  if (step === 'date') {
    return ask(c.date, [
      pickerItem(c.pickDate, 'f=date', 'date', { initial: today, min: today, max: addDays(today, 365) }),
      postbackItem(c.today, 'f=date&v=' + today, c.today),
      postbackItem(c.tomorrow, 'f=date&v=' + addDays(today, 1), c.tomorrow),
      postbackItem(c.notSure, 'f=date&v=', c.notSure),
      chatItem(state.lang)
    ]);
  }
  if (step === 'time') {
    var times = listProp('TIME_OPTIONS').slice(0, 9).map(function (t) { return postbackItem(t, 'f=time&v=' + t, t); });
    return ask(c.time, times.concat([
      pickerItem(c.otherTime, 'f=time', 'time', { initial: '10:00', min: '08:00', max: '18:00' }),
      postbackItem(c.notSure, 'f=time&v=', c.notSure),
      chatItem(state.lang)
    ]));
  }
  if (step === 'people') {
    var nums = [];
    for (var n = 1; n <= 10; n++) {
      nums.push(postbackItem(String(n), 'f=people&v=' + n, state.lang === 'en' ? n + (n === 1 ? ' guest' : ' guests') : n + ' 位'));
    }
    return ask(c.people, nums.concat([postbackItem(c.more, 'f=people&v=more', c.more), chatItem(state.lang)]));
  }
  if (step === 'minutes') {
    return ask(c.minutes, [60, 90, 150].map(function (m) {
      var est = estimateTour(state.people, m);
      var label = c.minutesLabel(m, est && est.linePrice);
      return postbackItem(label, 'f=minutes&v=' + m, label);
    }).concat([chatItem(state.lang)]));
  }
  if (step === 'pickup') {
    var spots = listProp('PICKUP_OPTIONS').slice(0, 10).map(function (s) {
      return postbackItem(s, 'f=pickup&v=' + encodeURIComponent(s), s);
    });
    return ask(c.pickup, spots.concat([postbackItem(c.notSure, 'f=pickup&v=', c.notSure), chatItem(state.lang)]));
  }
  return ask(c.phone, [postbackItem(c.skip, 'f=phone&v=', c.skip), chatItem(state.lang)]);
}

function nextStep(state) {
  for (var i = 0; i < STEPS.length; i++) {
    var s = STEPS[i];
    if (!state.done[s] && !(s === 'minutes' && state.minutes)) return s;
  }
  return '';
}

/** 最後給旅客的摘要。 */
function finalMessages(state, now) {
  var c = COPY[state.lang];
  var hour = taipeiNow(now).hour;
  var start = Number(prop('REPLY_START_HOUR')), end = Number(prop('REPLY_END_HOUR'));
  var night = hour < start || hour >= end;
  var body = c.summaryTitle + '\n\n' + summaryLines(state, state.lang).join('\n');
  if (state.people && !estimateTour(state.people, state.minutes)) body += '\n\n' + c.largeGroup;
  return [text(body), text((night ? c.nightReply(start) : c.dayReply) + '\n' + c.edit)];
}

// ---------------------------------------------------------------- 對話狀態（存在快取，FLOW_HOURS 小時後作廢）

function loadState(userId) {
  var raw = CacheService.getScriptCache().get('flow_' + userId);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (err) { return null; }
}

function saveState(userId, state) {
  var seconds = Math.min(21600, Number(prop('FLOW_HOURS')) * 3600);
  CacheService.getScriptCache().put('flow_' + userId, JSON.stringify(state), seconds);
}

function clearState(userId) {
  CacheService.getScriptCache().remove('flow_' + userId);
}

// ---------------------------------------------------------------- LINE API

function lineFetch(method, path, payload) {
  var options = {
    method: method,
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + prop('LINE_CHANNEL_ACCESS_TOKEN') },
    muteHttpExceptions: true
  };
  if (payload) options.payload = JSON.stringify(payload);
  var res = UrlFetchApp.fetch(LINE_API + path, options);
  var code = res.getResponseCode();
  if (code >= 300) console.error('LINE API ' + path + ' ' + code + ' ' + res.getContentText());
  return { code: code, body: res.getContentText() };
}

/** 回覆訊息是免費的，不算在每月推播額度裡。 */
function reply(token, messages) {
  if (!token || !messages.length) return;
  lineFetch('post', '/message/reply', { replyToken: token, messages: messages.slice(0, 5) });
}

function text(t) { return { type: 'text', text: t }; }

function displayNameOf(userId) {
  var res = lineFetch('get', '/profile/' + encodeURIComponent(userId));
  if (res.code >= 300) return '';
  try { return JSON.parse(res.body).displayName || ''; } catch (err) { return ''; }
}

// ---------------------------------------------------------------- 試算表

function logSheet() {
  var id = prop('SHEET_ID');
  var book = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(LOG_SHEET);
  if (!sheet) {
    sheet = book.insertSheet(LOG_SHEET);
    sheet.appendRow(LOG_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRow(sheet, id) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var ids = sheet.getRange(2, COL['編號'], last - 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

function rowValues(state, status, now) {
  var est = estimateTour(state.people, state.minutes);
  return [state.id, new Date(state.createdAt || now.getTime()), state.userId, state.name || '', state.lang, state.source,
    state.date, state.departure, state.people, state.minutes, state.pickup, state.phone, state.notes,
    est ? money(est.linePrice) : (state.price || ''), tripFlags(state.date, now).join('、'), status, '', (state.raw || '').slice(0, 1000)];
}

/** 新增或更新一列。日期、時間、手機存成文字，避免試算表自動改格式（例如吃掉手機開頭的 0）。 */
function writeRow(state, status, now) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = logSheet();
    var values = rowValues(state, status, now);
    var row = findRow(sheet, state.id);
    if (row) {
      values[COL['結果'] - 1] = sheet.getRange(row, COL['結果']).getValues()[0][0] || '';
      sheet.getRange(row, 1, 1, values.length).setValues([values]);
    } else {
      sheet.appendRow(values);
      row = sheet.getLastRow();
    }
    sheet.getRange(row, COL['日期'], 1, 2).setNumberFormat('@').setValues([[state.date, state.departure]]);
    sheet.getRange(row, COL['手機'], 1, 1).setNumberFormat('@').setValues([[state.phone]]);
  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------------- Webhook

function doPost(e) {
  // Apps Script 讀不到 X-Line-Signature 標頭，所以用網址上的祕密 key 擋掉不是 LINE 的請求。
  var key = e && e.parameter ? e.parameter.key : '';
  if (!prop('WEBHOOK_KEY') || key !== prop('WEBHOOK_KEY')) {
    return ContentService.createTextOutput('forbidden');
  }
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) { return ContentService.createTextOutput('bad request'); }
  (body.events || []).forEach(function (event) {
    try { handleEvent(event, new Date()); } catch (err) { console.error(err && err.stack || err); }
  });
  return ContentService.createTextOutput('ok');
}

function doGet() {
  return ContentService.createTextOutput('GtourLK LINE bot is running.');
}

function handleEvent(event, now) {
  var source = event.source || {};
  if (source.type !== 'user') return; // 只處理一對一聊天
  var userId = source.userId;
  if (event.type === 'postback') return handlePostback(event, userId, now);
  if (event.type !== 'message' || !event.message || event.message.type !== 'text') return;
  handleText(event.message.text.trim(), userId, event.replyToken, now);
}

function newRecord(trip, raw, userId, now) {
  trip.userId = userId;
  trip.raw = raw;
  trip.createdAt = now.getTime();
  trip.id = Utilities.formatDate(now, TZ, 'MMddHHmmss') + '-' + userId.slice(-4);
  trip.name = displayNameOf(userId);
  trip.done = {};
  return trip;
}

function handleText(msg, userId, replyToken, now) {
  var trip = parseInquiry(msg, prop('INTENT_KEYWORDS'));
  if (trip && trip.source === 'website') {
    // 官網表單已經有完整資料，不再問一次；只記到試算表，交給真人回覆。
    clearState(userId);
    writeRow(newRecord(trip, msg, userId, now), STATUS.WEBSITE, now);
    return;
  }
  if (trip) {
    var fresh = newRecord(trip, msg, userId, now);
    fresh.step = nextStep(fresh);
    saveState(userId, fresh);
    writeRow(fresh, STATUS.ASKING, now);
    return reply(replyToken, [question(fresh.step, fresh, now)]);
  }

  var state = loadState(userId);
  if (!state) return; // 一般聊天，交給真人
  var c = COPY[state.lang];
  var step = state.step;
  // 問到一半，有些步驟可以直接打字回答
  if (step === 'date' && parseDateText(msg, now)) return answer(state, 'date', parseDateText(msg, now), replyToken, now);
  if (step === 'time' && parseTimeText(msg)) return answer(state, 'time', parseTimeText(msg), replyToken, now);
  if (step === 'people' && /^\d{1,3}\s*(位|人|guests?|people|pax)?$/i.test(msg)) {
    var n = parseInt(msg, 10);
    if (n >= 1 && n <= 200) return answer(state, 'people', String(n), replyToken, now);
    return reply(replyToken, [ask(c.badPeople, [chatItem(state.lang)])]);
  }
  if (step === 'pickup' && msg.length <= 100) return answer(state, 'pickup', msg, replyToken, now);
  if (step === 'phone') {
    if (validPhone(msg)) return answer(state, 'phone', msg, replyToken, now);
    if (/^[\d\s\-+().]{4,}$/.test(msg)) return reply(replyToken, [text(c.badPhone), question('phone', state, now)]);
  }
  // 其他文字：旅客想直接聊，小幫手安靜退出，交給真人
  clearState(userId);
  state.notes = (state.notes ? state.notes + '／' : '') + msg.slice(0, 200);
  writeRow(state, STATUS.CHAT, now);
}

function handlePostback(event, userId, now) {
  var data = {};
  String(event.postback && event.postback.data || '').split('&').forEach(function (pair) {
    var i = pair.indexOf('=');
    if (i > 0) data[pair.slice(0, i)] = decodeURIComponent(pair.slice(i + 1));
  });
  var params = event.postback && event.postback.params || {};
  var state = loadState(userId);
  if (!state) {
    if (data.f) reply(event.replyToken, [text(COPY.zh.expired)]);
    return;
  }
  var c = COPY[state.lang];
  if (data.f === 'chat') {
    clearState(userId);
    writeRow(state, STATUS.CHAT, now);
    return reply(event.replyToken, [text(c.chatReply)]);
  }
  if (data.f !== state.step) {
    // 按到前面舊的按鈕：重新問目前這一步
    return reply(event.replyToken, [question(state.step, state, now)]);
  }
  if (data.f === 'people' && data.v === 'more') {
    return reply(event.replyToken, [ask(c.moreAsk, [chatItem(state.lang)])]);
  }
  var value = data.f === 'date' && params.date ? params.date : data.f === 'time' && params.time ? params.time : (data.v || '');
  answer(state, data.f, value, event.replyToken, now);
}

function answer(state, step, value, replyToken, now) {
  if (step === 'date') state.date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '';
  if (step === 'time') state.departure = /^\d{2}:\d{2}$/.test(value) ? value : '';
  if (step === 'people') state.people = Number(value) || '';
  if (step === 'minutes') state.minutes = Number(value) || '';
  if (step === 'pickup') state.pickup = value;
  if (step === 'phone') state.phone = value;
  state.done[step] = true;
  state.step = nextStep(state);
  if (state.step) {
    saveState(state.userId, state);
    writeRow(state, STATUS.ASKING, now);
    return reply(replyToken, [question(state.step, state, now)]);
  }
  clearState(state.userId);
  writeRow(state, STATUS.DONE, now);
  reply(replyToken, finalMessages(state, now));
}
