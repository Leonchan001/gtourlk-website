/**
 * 導鹿 LINE 預約詢問小幫手（Google Apps Script）
 *
 * 流程：
 *   1. 旅客從官網送出預約訊息（或點圖文選單的「預約導覽」）。
 *   2. 機器人用免費的「回覆訊息」跟旅客說已收到。
 *   3. 推播一張詢問卡給「主要負責人」（爸爸），卡片上有 可以接／不能接／轉同業／我來聊。
 *   4. 主要負責人超過 ESCALATE_MINUTES 分鐘沒按，自動轉給「備援」（媽媽）。
 *   5. 按下按鈕後，機器人替你把對應訊息傳給旅客，並寫進 Google 試算表。
 *
 * 設定都放在「專案設定 → 指令碼屬性」，程式裡不放任何金鑰。安裝步驟見 README.md。
 */

var DEFAULTS = {
  ESCALATE_MINUTES: '30',   // 主要負責人幾分鐘沒處理就轉給備援
  WORK_START_HOUR: '8',     // 轉交只在這段時間內計時（台北時間）
  WORK_END_HOUR: '21',
  DEDUPE_MINUTES: '30',     // 同一位旅客幾分鐘內重複詢問只通知一次
  QUOTA_WARN_LEFT: '20',    // 本月剩下幾則推播時開始提醒
  GUEST_ACK: 'on',          // 是否自動回覆旅客「已收到」
  INTENT_KEYWORDS: '預約導覽,我想預約,book a tour,booking'
};

var TZ = 'Asia/Taipei';
var LINE_API = 'https://api.line.me/v2/bot';
var LOG_SHEET = '詢問紀錄';
var LOG_HEADERS = ['編號', '收到時間', '旅客 ID', '旅客名稱', '語言', '來源', '日期', '出發時間', '人數',
  '導覽分鐘', '上下車地點', '其他需求', '參考價', '提醒', '狀態', '處理人', '處理時間', '已轉備援', '原始訊息'];
var COL = {};
LOG_HEADERS.forEach(function (name, i) { COL[name] = i + 1; });

var STATUS = { PENDING: '待處理', ACCEPT: '可以接', DECLINE: '不能接', PARTNER: '轉同業中', CHAT: '真人聊天中' };
var ACTIONS = {
  accept: { status: STATUS.ACCEPT, label: '可以接' },
  decline: { status: STATUS.DECLINE, label: '不能接' },
  partner: { status: STATUS.PARTNER, label: '轉同業' },
  chat: { status: STATUS.CHAT, label: '我來聊' }
};

// ---------------------------------------------------------------- 安裝

/** 安裝時在編輯器手動執行一次：建立試算表分頁與每 5 分鐘的觸發條件。 */
function setup() {
  logSheet();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'escalatePending') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('escalatePending').timeBased().everyMinutes(5).create();
  if (!prop('WEBHOOK_KEY')) setProp('WEBHOOK_KEY', Utilities.getUuid().replace(/-/g, ''));
  if (!prop('BIND_CODE')) setProp('BIND_CODE', String(Math.floor(100000 + Math.random() * 900000)));
  console.log('完成。WEBHOOK_KEY 與 BIND_CODE 已寫入指令碼屬性，請到「專案設定」查看。');
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

function numProp(name) {
  var n = Number(prop(name));
  return isFinite(n) ? n : Number(DEFAULTS[name]);
}

// ---------------------------------------------------------------- 解析（純函式，可在本機測試）

var FIELD_LABELS = {
  date: ['日期', 'Date'],
  departure: ['出發時間', 'Departure'],
  people: ['人數', 'Guests'],
  minutes: ['導覽時間', 'Duration'],
  pickup: ['上下車地點', 'Pick-up / drop-off'],
  notes: ['其他需求', 'Other requests'],
  price: ['官方 LINE 預約參考價（95 折）', 'Official LINE estimate (5% off)']
};
var EMPTY_VALUES = ['待確認', 'To be confirmed', '未指定', 'None specified', ''];

function parseInquiry(text, keywords) {
  text = String(text || '').trim();
  if (!text) return null;
  var isZhForm = text.indexOf('您好導鹿，我想詢問') === 0;
  var isEnForm = text.indexOf('Hello GtourLK, I would like to ask about') === 0;
  if (isZhForm || isEnForm) {
    var fields = {};
    text.split(/\r?\n/).forEach(function (line) {
      var m = line.match(/^(.+?)[：:]\s*(.*)$/);
      if (!m) return;
      var label = m[1].trim();
      Object.keys(FIELD_LABELS).forEach(function (key) {
        if (FIELD_LABELS[key].indexOf(label) !== -1) fields[key] = m[2].trim();
      });
    });
    Object.keys(fields).forEach(function (key) {
      if (EMPTY_VALUES.indexOf(fields[key]) !== -1) fields[key] = '';
    });
    var peopleMatch = (fields.people || '').match(/\d+/);
    var minutesMatch = (fields.minutes || '').match(/\d+/);
    return {
      source: 'website',
      lang: isEnForm ? 'en' : 'zh',
      date: /^\d{4}-\d{2}-\d{2}$/.test(fields.date || '') ? fields.date : (fields.date || ''),
      departure: fields.departure || '',
      people: peopleMatch ? Number(peopleMatch[0]) : '',
      minutes: minutesMatch ? Number(minutesMatch[0]) : '',
      pickup: fields.pickup || '',
      notes: fields.notes || '',
      price: fields.price || ''
    };
  }
  // 官網其他按鈕預先填好的句子（首頁、景點頁、路線頁）
  if (text.length <= 120 && (text.indexOf('你好，我想預約') === 0 || text.indexOf('Hi, I would like to book') === 0)) {
    var hello = blankInquiry('hello', text.indexOf('Hi,') === 0 ? 'en' : 'zh');
    var tourMinutes = text.match(/(\d+)(?: 分鐘|-minute)/);
    if (tourMinutes) hello.minutes = Number(tourMinutes[1]);
    var place = text.match(/想去(.+?)。$/) || text.match(/includes (.+?)\.$/);
    var route = text.match(/「(.+?)」/) || text.match(/"(.+?)"/);
    if (place) hello.notes = (hello.lang === 'en' ? 'Wants to visit ' : '想去') + place[1];
    else if (route) hello.notes = (hello.lang === 'en' ? 'Route: ' : '路線：') + route[1];
    return hello;
  }
  var lower = text.toLowerCase();
  var list = String(keywords || '').split(',').map(function (k) { return k.trim().toLowerCase(); }).filter(String);
  for (var i = 0; i < list.length; i++) {
    if (text.length <= 40 && lower.indexOf(list[i]) !== -1) {
      return blankInquiry('keyword', /[a-z]/i.test(text) && !/[一-鿿]/.test(text) ? 'en' : 'zh');
    }
  }
  return null;
}

function blankInquiry(source, lang) {
  return { source: source, lang: lang, date: '', departure: '', people: '', minutes: '', pickup: '', notes: '', price: '' };
}

/** 回傳提醒字串陣列，例如 ['平日', '明天']。now 是 Date，today 用台北日期比較。 */
function inquiryFlags(inquiry, now) {
  var flags = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inquiry.date || '')) return flags;
  var parts = inquiry.date.split('-').map(Number);
  var tour = Date.UTC(parts[0], parts[1] - 1, parts[2]);
  var local = new Date(now.getTime() + 8 * 3600 * 1000); // 台北時間 UTC+8，無日光節約
  var today = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  var days = Math.round((tour - today) / 86400000);
  var weekday = new Date(tour).getUTCDay();
  if (weekday >= 1 && weekday <= 5) flags.push('平日');
  if (days < 0) flags.push('日期已過');
  else if (days === 0) flags.push('今天');
  else if (days === 1) flags.push('明天');
  return flags;
}

/** 台北時間的小時（0–23）。 */
function taipeiHour(now) {
  return new Date(now.getTime() + 8 * 3600 * 1000).getUTCHours();
}

/**
 * 是否該轉給備援。轉交只在上班時段計時：晚上 9 點進來的詢問，從隔天早上 8 點開始算。
 */
function shouldEscalate(createdAt, now, minutes, startHour, endHour) {
  var hour = taipeiHour(now);
  if (hour < startHour || hour >= endHour) return false;
  var local = new Date(now.getTime() + 8 * 3600 * 1000);
  var dayStart = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), startHour) - 8 * 3600 * 1000;
  var clockStart = Math.max(createdAt.getTime(), dayStart);
  return now.getTime() - clockStart >= minutes * 60000;
}

function describeTrip(inq, lang) {
  if (lang === 'en') {
    var en = [];
    if (inq.date) en.push(inq.date);
    if (inq.departure) en.push(inq.departure);
    if (inq.people) en.push(inq.people + (inq.people === 1 ? ' guest' : ' guests'));
    if (inq.minutes) en.push(inq.minutes + ' minutes');
    return en.join(', ');
  }
  var zh = [];
  if (inq.date) zh.push(inq.date);
  if (inq.departure) zh.push(inq.departure);
  if (inq.people) zh.push(inq.people + ' 位');
  if (inq.minutes) zh.push(inq.minutes + ' 分鐘');
  return zh.join('、');
}

function guestAckText(inq, now, startHour, endHour) {
  var hour = taipeiHour(now);
  var night = hour < startHour || hour >= endHour;
  if (inq.source === 'hello') {
    if (inq.lang === 'en') {
      return 'Hi, thanks for reaching out! 🦌 Please tell us your date, start time and number of guests, and we will check availability for you.' +
        (night ? '\nWe are offline now and will reply after ' + startHour + ':00 AM (Taiwan time).' : '');
    }
    return '您好，謝謝您找導鹿！🦌 麻煩告訴我們想預約的日期、出發時間和人數，我們馬上幫您確認。' +
      (night ? '\n現在是休息時間，明天早上 ' + startHour + ' 點後會優先回覆您。' : '');
  }
  var weekday = inquiryFlags(inq, now).indexOf('平日') !== -1;
  if (inq.lang === 'en') {
    var en = 'Thank you! We have received your request' + (describeTrip(inq, 'en') ? ' (' + describeTrip(inq, 'en') + ')' : '') + '. 🦌\n';
    en += night
      ? 'We are offline now and will reply after ' + startHour + ':00 AM (Taiwan time).'
      : 'We are checking guide and vehicle availability and will reply here shortly.';
    if (weekday) en += '\nOur guides are part-time, so weekday tours may take a little longer to confirm.';
    return en;
  }
  var zh = '收到您的預約詢問了，謝謝！🦌' + (describeTrip(inq, 'zh') ? '\n（' + describeTrip(inq, 'zh') + '）' : '') + '\n';
  zh += night
    ? '現在是休息時間，明天早上 ' + startHour + ' 點後會優先回覆您。'
    : '我們正在確認導覽員與車輛，確認後會在這裡回覆您。';
  if (weekday) zh += '\n平日導覽員比較少，確認可能需要多一點時間，請見諒。';
  return zh;
}

function guestResultText(action, inq) {
  var trip = describeTrip(inq, inq.lang);
  if (inq.lang === 'en') {
    if (action === 'accept') return 'Good news! We can take your tour' + (trip ? ' (' + trip + ')' : '') + '. 🦌\nWe will confirm the meeting point and final fee with you here shortly.';
    if (action === 'decline') return 'Sorry, our guides are fully booked' + (trip ? ' for ' + trip : ' for that time') + '.\nIf another date or time works for you, just let us know here and we will check again.';
    if (action === 'partner') return 'Our own guides are busy at that time, so we are asking a partner team to help. We will reply as soon as it is confirmed. Thank you for your patience.';
    return '';
  }
  if (action === 'accept') return '好消息！您的導覽可以安排' + (trip ? '（' + trip + '）' : '') + ' 🦌\n我們稍後會在這裡跟您確認集合地點與費用。';
  if (action === 'decline') return '很抱歉，' + (trip ? trip + ' ' : '這個時段') + '導覽員已經排滿了。\n方便的話可以換個日期或時間，直接在這裡告訴我們，我們再幫您看看。';
  if (action === 'partner') return '這個時段我們的導覽員比較忙，正在請合作夥伴支援，確認後會馬上回覆您，謝謝耐心等候。';
  return '';
}

function inquiryCard(id, inq, displayName, flags, extraNote) {
  var title = inq.source === 'website' ? '新的預約詢問' : '有人想預約（還沒填細節）';
  var rows = [];
  function row(label, value) {
    if (!value && value !== 0) return;
    rows.push({ type: 'box', layout: 'baseline', spacing: 'sm', contents: [
      { type: 'text', text: label, size: 'sm', color: '#888888', flex: 2 },
      { type: 'text', text: String(value), size: 'sm', wrap: true, flex: 5 }
    ] });
  }
  row('旅客', displayName || '（未取得名稱）');
  row('日期', inq.date);
  row('時間', inq.departure);
  row('人數', inq.people ? inq.people + ' 位' : '');
  row('導覽', inq.minutes ? inq.minutes + ' 分鐘' : '');
  row('接送', inq.pickup);
  row('需求', inq.notes);
  row('參考價', inq.price);
  row('語言', inq.lang === 'en' ? '英文' : '');
  var body = [{ type: 'text', text: title, weight: 'bold', size: 'lg' }];
  if (flags.length) body.push({ type: 'text', text: '⚠ ' + flags.join('・'), color: '#C0392B', weight: 'bold', size: 'sm' });
  body = body.concat(rows);
  if (extraNote) body.push({ type: 'text', text: extraNote, size: 'xs', color: '#C0392B', wrap: true });
  function button(action, style) {
    return { type: 'button', style: style, height: 'sm', action: {
      type: 'postback', label: ACTIONS[action].label, data: 'action=' + action + '&id=' + id, displayText: ACTIONS[action].label
    } };
  }
  var footer = inq.source === 'website'
    ? [button('accept', 'primary'), button('decline', 'secondary'), button('partner', 'secondary'), button('chat', 'link')]
    : [button('chat', 'primary')];
  return {
    type: 'flex',
    altText: title + '：' + (displayName || '旅客') + (describeTrip(inq, 'zh') ? '，' + describeTrip(inq, 'zh') : ''),
    contents: {
      type: 'bubble',
      body: { type: 'box', layout: 'vertical', spacing: 'sm', contents: body },
      footer: { type: 'box', layout: 'vertical', spacing: 'sm', contents: footer }
    }
  };
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

function reply(token, messages) {
  if (!token) return;
  lineFetch('post', '/message/reply', { replyToken: token, messages: messages });
}

function push(to, messages) {
  if (!to) return false;
  var res = lineFetch('post', '/message/push', { to: to, messages: messages });
  return res.code < 300;
}

function text(t) { return { type: 'text', text: t }; }

function displayNameOf(userId) {
  var res = lineFetch('get', '/profile/' + encodeURIComponent(userId));
  if (res.code >= 300) return '';
  try { return JSON.parse(res.body).displayName || ''; } catch (err) { return ''; }
}

/** 本月推播剩餘則數；查不到時回傳 null。 */
function quotaLeft() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('quotaLeft');
  if (cached !== null) return Number(cached);
  var quota = lineFetch('get', '/message/quota');
  var used = lineFetch('get', '/message/quota/consumption');
  if (quota.code >= 300 || used.code >= 300) return null;
  var q = JSON.parse(quota.body);
  if (q.type !== 'limited') return null;
  var left = q.value - JSON.parse(used.body).totalUsage;
  cache.put('quotaLeft', String(left), 600);
  return left;
}

function quotaNote() {
  var left = quotaLeft();
  if (left === null || left > numProp('QUOTA_WARN_LEFT')) return '';
  return left <= 0
    ? '本月推播額度已用完，按「可以接／不能接」機器人無法替你傳給旅客，請直接在聊天室回覆。'
    : '本月推播額度只剩 ' + left + ' 則。';
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

function rowInquiry(values) {
  return {
    lang: values[COL['語言'] - 1] === 'en' ? 'en' : 'zh',
    source: values[COL['來源'] - 1],
    date: formatCellDate(values[COL['日期'] - 1]),
    departure: formatCellTime(values[COL['出發時間'] - 1]),
    people: values[COL['人數'] - 1],
    minutes: values[COL['導覽分鐘'] - 1],
    pickup: values[COL['上下車地點'] - 1],
    notes: values[COL['其他需求'] - 1],
    price: values[COL['參考價'] - 1]
  };
}

function formatCellDate(v) {
  return v instanceof Date ? Utilities.formatDate(v, TZ, 'yyyy-MM-dd') : String(v || '');
}
function formatCellTime(v) {
  return v instanceof Date ? Utilities.formatDate(v, TZ, 'HH:mm') : String(v || '');
}

/** 同一位旅客在 DEDUPE_MINUTES 內是否已經有待處理的詢問。 */
function recentPending(sheet, userId, now) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var start = Math.max(2, last - 50);
  var rows = sheet.getRange(start, 1, last - start + 1, LOG_HEADERS.length).getValues();
  var limit = numProp('DEDUPE_MINUTES') * 60000;
  return rows.some(function (r) {
    var at = r[COL['收到時間'] - 1];
    return r[COL['旅客 ID'] - 1] === userId && r[COL['狀態'] - 1] === STATUS.PENDING &&
      at instanceof Date && now.getTime() - at.getTime() < limit;
  });
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
    try { handleEvent(event); } catch (err) { console.error(err && err.stack || err); }
  });
  return ContentService.createTextOutput('ok');
}

function doGet() {
  return ContentService.createTextOutput('GtourLK LINE bot is running.');
}

function handleEvent(event) {
  var source = event.source || {};
  if (source.type !== 'user') return; // 只處理一對一聊天
  var userId = source.userId;
  if (event.type === 'postback') return handlePostback(event, userId);
  if (event.type !== 'message' || !event.message || event.message.type !== 'text') return;
  var msg = event.message.text.trim();
  if (handleAdminCommand(msg, userId, event.replyToken)) return;
  // 負責人自己傳的訊息不當作詢問；測試時把 TEST_MODE 設成 on，就能用同一支手機扮演旅客
  if (isStaff(userId) && prop('TEST_MODE') !== 'on') return;
  var inquiry = parseInquiry(msg, prop('INTENT_KEYWORDS'));
  if (!inquiry) return;
  handleInquiry(inquiry, msg, userId, event.replyToken, new Date());
}

function isStaff(userId) {
  return userId && (userId === prop('PRIMARY_USER_ID') || userId === prop('BACKUP_USER_ID'));
}

/**
 * 綁定指令（負責人自己在官方帳號聊天室傳）：
 *   綁定主要 <BIND_CODE>   → 設成主要負責人（爸爸）
 *   綁定備援 <BIND_CODE>   → 設成備援（媽媽）
 *   小幫手狀態             → 看目前設定與額度（只有負責人能用）
 */
function handleAdminCommand(msg, userId, replyToken) {
  var m = msg.match(/^綁定(主要|備援)\s+(\S+)$/);
  if (m) {
    var code = prop('BIND_CODE');
    if (!code || m[2] !== code) { reply(replyToken, [text('綁定碼不正確。')]); return true; }
    setProp(m[1] === '主要' ? 'PRIMARY_USER_ID' : 'BACKUP_USER_ID', userId);
    reply(replyToken, [text('已綁定為' + (m[1] === '主要' ? '主要負責人' : '備援') + '。之後的預約詢問會通知你。')]);
    return true;
  }
  if (msg === '小幫手狀態' && isStaff(userId)) {
    var left = quotaLeft();
    reply(replyToken, [text([
      '主要負責人：' + (prop('PRIMARY_USER_ID') ? '已綁定' : '未綁定'),
      '備援：' + (prop('BACKUP_USER_ID') ? '已綁定' : '未綁定'),
      '轉給備援：' + numProp('ESCALATE_MINUTES') + ' 分鐘沒處理（' + numProp('WORK_START_HOUR') + '–' + numProp('WORK_END_HOUR') + ' 點計時）',
      '本月推播剩餘：' + (left === null ? '查不到' : left + ' 則')
    ].join('\n'))]);
    return true;
  }
  return false;
}

function handleInquiry(inquiry, raw, userId, replyToken, now) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var sheet, id, duplicate, name, flags;
  try {
    sheet = logSheet();
    duplicate = recentPending(sheet, userId, now);
    if (!duplicate) {
      id = Utilities.formatDate(now, TZ, 'MMddHHmmss') + '-' + userId.slice(-4);
      name = displayNameOf(userId);
      flags = inquiryFlags(inquiry, now);
      sheet.appendRow([id, now, userId, name, inquiry.lang, inquiry.source, inquiry.date, inquiry.departure, inquiry.people,
        inquiry.minutes, inquiry.pickup, inquiry.notes, inquiry.price, flags.join('、'), STATUS.PENDING, '', '', '', raw.slice(0, 1000)]);
      // 日期與時間存成文字，避免試算表自動轉格式
      var row = sheet.getLastRow();
      sheet.getRange(row, COL['日期'], 1, 2).setNumberFormat('@').setValues([[inquiry.date, inquiry.departure]]);
    }
  } finally {
    lock.releaseLock();
  }
  if (prop('GUEST_ACK') !== 'off' && inquiry.source !== 'keyword') { // 關鍵字已有官方帳號自己的自動回應
    reply(replyToken, [text(guestAckText(inquiry, now, numProp('WORK_START_HOUR'), numProp('WORK_END_HOUR')))]);
  }
  if (duplicate) return;
  var target = prop('PRIMARY_USER_ID') || prop('BACKUP_USER_ID');
  if (!target) { console.warn('尚未綁定負責人，詢問只記錄在試算表：' + id); return; }
  push(target, [inquiryCard(id, inquiry, name, flags, quotaNote())]);
}

function handlePostback(event, userId) {
  if (!isStaff(userId)) return;
  var data = {};
  String(event.postback.data || '').split('&').forEach(function (pair) {
    var kv = pair.split('=');
    data[kv[0]] = decodeURIComponent(kv[1] || '');
  });
  var action = ACTIONS[data.action];
  if (!action || !data.id) return;
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var sheet, row, values, already;
  try {
    sheet = logSheet();
    row = findRow(sheet, data.id);
    if (!row) { reply(event.replyToken, [text('找不到這筆詢問（' + data.id + '）。')]); return; }
    values = sheet.getRange(row, 1, 1, LOG_HEADERS.length).getValues()[0];
    already = values[COL['狀態'] - 1] !== STATUS.PENDING;
    if (!already) {
      var who = userId === prop('PRIMARY_USER_ID') ? '主要負責人' : '備援';
      sheet.getRange(row, COL['狀態'], 1, 3).setValues([[action.status, who, new Date()]]);
    }
  } finally {
    lock.releaseLock();
  }
  if (already) {
    reply(event.replyToken, [text('這筆已經由' + values[COL['處理人'] - 1] + '處理了（' + values[COL['狀態'] - 1] + '），不會重複傳給旅客。')]);
    return;
  }
  var inq = rowInquiry(values);
  var guestId = values[COL['旅客 ID'] - 1];
  var guestText = guestResultText(data.action, inq);
  var sent = false;
  if (guestText) {
    var left = quotaLeft();
    sent = left === null || left > 0 ? push(guestId, [text(guestText)]) : false;
    CacheService.getScriptCache().remove('quotaLeft');
  }
  var note;
  if (data.action === 'chat') note = '好，請打開「LINE Official Account」App 的聊天室直接回覆這位旅客。';
  else if (sent) note = '已幫你傳給旅客：\n' + guestText;
  else note = '沒能自動傳給旅客（可能是額度用完），請到聊天室手動回覆。';
  if (data.action === 'accept') note += '\n\n記得把這團排進 Google Tasks。';
  if (data.action === 'partner') note += '\n\n同業確認後，請到聊天室跟旅客說結果。';
  reply(event.replyToken, [text(note)]);
}

// ---------------------------------------------------------------- 定時轉給備援

/** 每 5 分鐘跑一次（安裝時執行 setup 會自動建立觸發條件）。 */
function escalatePending(now) {
  var backup = prop('BACKUP_USER_ID');
  if (!backup || !prop('PRIMARY_USER_ID')) return;
  if (!(now instanceof Date)) now = new Date(); // 觸發條件會傳入事件物件
  var sheet = logSheet();
  var last = sheet.getLastRow();
  if (last < 2) return;
  var start = Math.max(2, last - 200);
  var rows = sheet.getRange(start, 1, last - start + 1, LOG_HEADERS.length).getValues();
  rows.forEach(function (r, i) {
    var at = r[COL['收到時間'] - 1];
    if (r[COL['狀態'] - 1] !== STATUS.PENDING || r[COL['已轉備援'] - 1] || !(at instanceof Date)) return;
    if (now.getTime() - at.getTime() > 3 * 86400000) return; // 太舊的不轉
    if (!shouldEscalate(at, now, numProp('ESCALATE_MINUTES'), numProp('WORK_START_HOUR'), numProp('WORK_END_HOUR'))) return;
    var inq = rowInquiry(r);
    var note = '主要負責人 ' + numProp('ESCALATE_MINUTES') + ' 分鐘還沒處理，轉給你。' + (quotaNote() ? '\n' + quotaNote() : '');
    if (push(backup, [inquiryCard(r[COL['編號'] - 1], inq, r[COL['旅客名稱'] - 1], inquiryFlags(inq, now), note)])) {
      sheet.getRange(start + i, COL['已轉備援']).setValue(now);
    }
  });
}
