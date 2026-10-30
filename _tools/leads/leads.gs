/**
 * FutureGen Academy: the lead sheet.
 *
 * Lives in the Apps Script project of the leads spreadsheet (Extensions -> Apps Script).
 * Paste this whole file over Code.gs. Full instructions: README.md, "ניהול לידים".
 *
 *   setup()     builds the two tabs (לידים, דשבורד) and the webhook key. Run it once.
 *               Running it again rebuilds the dashboard and formatting; rows are kept.
 *   doPost(e)   receives a lead. Netlify (form "lead") posts here on every submission;
 *               Make posts Facebook / Instagram lead-ad leads here with &source=meta.
 *               Both must add ?key=<the key setup() shows>, or the post is ignored.
 *   onEdit(e)   a row typed in by hand (WhatsApp, phone) gets its date, status and
 *               WhatsApp link filled in.
 *   testLead()  adds a sample row, to check the sheet. Delete the row afterwards.
 *
 * signing.gs (a second file in this project) handles the signed registrations:
 * doPost sends ?action=sign there, without a key, since anyone may sign up.
 *
 * Rows are only ever appended at the bottom, so a lead arriving while someone is
 * editing never shifts the row they are working on.
 */

var LEADS = 'לידים';
var DASH = 'דשבורד';

var STATUSES = ['חדש', 'לא ענו', 'בשיחה', 'נרשם', 'לא רלוונטי'];
var STATUS_COLORS = ['#E8E3FF', '#FFF3C4', '#FFE2C2', '#D6F5DD', '#ECECEC'];
var CLOSED = ['נרשם', 'לא רלוונטי'];
var SOURCES = ['אתר', 'פייסבוק', 'אינסטגרם', 'גוגל', 'וואטסאפ', 'טלפון', 'המלצה', 'אחר'];
/* With a word in front, so Sheets never reads "10-12" as a date; and a plain hyphen,
   because an en dash between numbers shows reversed ("12–10") in a right-to-left cell. */
var GROUPS = ['גילאי 10-12', 'גילאי 13-16'];

/* [key, header, width]. The order is the order on screen (right to left). */
var COLS = [
  ['name', 'שם', 150],
  ['phone', 'טלפון', 115],
  ['wa', 'וואטסאפ', 85],
  ['status', 'סטטוס', 105],
  ['next', 'לחזור בתאריך', 105],
  ['owner', 'מטפל/ת', 90],
  ['notes', 'הערות', 260],
  ['received', 'התקבל', 125],
  ['age', 'גיל', 50],
  ['group', 'קבוצה', 70],
  ['message', 'הודעה מהטופס', 240],
  ['email', 'אימייל', 190],
  ['consent', 'מאשר/ת עדכונים', 105],
  ['source', 'מקור', 85],
  ['detail', 'פרטי מקור', 220],
  ['id', 'מזהה', 120]
];

function col_(key) {
  for (var i = 0; i < COLS.length; i++) if (COLS[i][0] === key) return i + 1;
  throw new Error('no column ' + key);
}
function letter_(key) {
  var n = col_(key), s = '';
  while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
  return s;
}
/* 'לידים'!D2:D */
function ref_(key) {
  var L = letter_(key);
  return "'" + LEADS + "'!" + L + '2:' + L;
}

/* ---------------------------------------------------------------- receiving */

function doPost(e) {
  var p = (e && e.parameter) || {};
  /* the registration page: a parent signing the agreement (signing.gs) */
  if (p.action === 'sign') return sign_(e);
  var key = PropertiesService.getScriptProperties().getProperty('WEBHOOK_KEY');
  if (!key || p.key !== key) return reply_('forbidden');
  var body = null;
  try { body = JSON.parse((e.postData && e.postData.contents) || '{}'); } catch (err) { /* not JSON */ }
  /* Make may also send plain form fields (full_name=…&phone_number=…), which Apps
     Script puts in e.parameter next to key and source (README, "לידים מפייסבוק ואינסטגרם") */
  if (p.source === 'meta' && (!body || !Object.keys(body).length)) body = p;
  if (!body) return reply_('bad json');
  var lead = p.source === 'meta' ? fromMeta_(body) : fromNetlify_(body);
  if (!lead) return reply_('ignored');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { addLead_(lead); } finally { lock.releaseLock(); }
  return reply_('ok');
}

/* Opening the address in a browser shows nothing about the leads. */
function doGet() { return reply_('ok'); }

/* The answer to Netlify's webhook and to Make. A ContentService answer always comes
   back as a 302 redirect to script.googleusercontent.com; Netlify counted that as a
   failure, retried, and after 6 "failures" disabled the webhook (seen 16 Oct 2026),
   even though every lead had been written. An HtmlService answer is served by /exec
   itself with 200. (The registration page reads JSON across sites, so signing.gs
   keeps ContentService.) */
function reply_(msg) {
  return HtmlService.createHtmlOutput(JSON.stringify({ result: msg }));
}

/* Netlify's form-notification payload: the fields are under `data`. */
function fromNetlify_(p) {
  if (!p || !p.data) return null;
  if (p.form_name && p.form_name !== 'lead') return null;
  var d = p.data;
  var src = sourceFromUtm_(d.utm_source, d.utm_medium);
  var detail = [d.utm_source, d.utm_medium, d.utm_campaign, d.utm_content, d.utm_term].filter(Boolean).join(' / ');
  if (d.landing) detail = (detail ? detail + ' · ' : '') + 'דף: ' + d.landing;
  return {
    id: p.id ? 'netlify:' + p.id : '',
    received: p.created_at ? new Date(p.created_at) : new Date(),
    name: d.name, phone: d.phone, email: d.email,
    age: d.age,
    group: d.track === 'junior' ? GROUPS[0] : d.track === 'senior' ? GROUPS[1] : groupFromAge_(d.age),
    message: d.message,
    consent: d.consent === 'yes' ? 'כן' : 'לא',
    source: src, detail: detail
  };
}

/* What the Make scenario sends (README, "לידים מפייסבוק ואינסטגרם"). The field names
   are ours; Make maps the lead-form answers onto them. */
function fromMeta_(b) {
  if (!b) return null;
  var name = b.full_name || b.name, phone = b.phone_number || b.phone;
  if (!name && !phone) return null;
  var ig = /^(ig|instagram)$/i.test(String(b.platform || '').trim());
  var age = String(b.age || '').replace(/[^\d]/g, '').slice(0, 2);
  return {
    id: b.id ? 'meta:' + b.id : '',
    received: b.created_time ? new Date(b.created_time) : new Date(),
    name: name, phone: phone, email: b.email,
    age: age,
    group: groupFromText_(b.group) || groupFromAge_(age),
    message: b.message,
    consent: '',
    source: ig ? 'אינסטגרם' : 'פייסבוק',
    detail: ['טופס לידים', b.campaign_name, b.ad_name, b.form_name].filter(Boolean).join(' · ')
  };
}

function sourceFromUtm_(s, m) {
  var v = String(s || '').toLowerCase() + ' ' + String(m || '').toLowerCase();
  if (/instagram|\big\b/.test(v)) return 'אינסטגרם';
  if (/facebook|\bfb\b|meta/.test(v)) return 'פייסבוק';
  if (/google|gads|adwords|cpc/.test(v)) return 'גוגל';
  if (/whatsapp|\bwa\b/.test(v)) return 'וואטסאפ';
  return 'אתר';
}
function groupFromAge_(age) {
  var n = parseInt(age, 10);
  if (n >= 10 && n <= 12) return GROUPS[0];
  if (n >= 13 && n <= 16) return GROUPS[1];
  return '';
}
function groupFromText_(t) {
  var s = String(t || '');
  if (/10|11|12|צעיר|junior/i.test(s)) return GROUPS[0];
  if (/13|14|15|16|בוגר|senior/i.test(s)) return GROUPS[1];
  return '';
}

/* wa.me wants the number in international form, digits only: 052-1234567 -> 972521234567 */
function waUrl_(phone) {
  var d = String(phone || '').replace(/[^\d]/g, '');
  if (!d) return '';
  if (d.indexOf('00') === 0) d = d.slice(2);
  else if (d.charAt(0) === '0') d = '972' + d.slice(1);
  return d.length >= 9 ? 'https://wa.me/' + d : '';
}

/* Whatever people type stays text: a leading ' stops "=..." (or "+972...") from
   being read as a formula or a number. */
function text_(v, max) {
  var s = String(v == null ? '' : v).trim().slice(0, max || 500);
  return s ? "'" + s : '';
}

function addLead_(lead) {
  var sh = SpreadsheetApp.getActive().getSheetByName(LEADS);
  if (!sh) throw new Error('run setup() first');
  if (lead.id && sh.getLastRow() > 1) {
    var hit = sh.getRange(2, col_('id'), sh.getLastRow() - 1, 1)
      .createTextFinder(lead.id).matchEntireCell(true).findNext();
    if (hit) return; // already in (a retried notification)
  }
  var row = COLS.map(function (c) {
    switch (c[0]) {
      case 'name': return text_(lead.name, 120);
      case 'phone': return text_(lead.phone, 40);
      case 'status': return 'חדש';
      case 'received': return lead.received || new Date();
      case 'age': return text_(lead.age, 3);
      case 'group': return lead.group || '';
      case 'message': return text_(lead.message, 2000);
      case 'email': return text_(lead.email, 200);
      case 'consent': return lead.consent || '';
      case 'source': return lead.source || 'אתר';
      case 'detail': return text_(lead.detail, 400);
      case 'id': return lead.id || '';
      default: return '';
    }
  });
  sh.appendRow(row);
  setWaLink_(sh, sh.getLastRow());
}

function setWaLink_(sh, r) {
  var url = waUrl_(sh.getRange(r, col_('phone')).getDisplayValue());
  var cell = sh.getRange(r, col_('wa'));
  if (url) cell.setRichTextValue(SpreadsheetApp.newRichTextValue().setText('שליחה').setLinkUrl(url).build());
  else cell.clearContent();
}

/* A lead typed in by hand: fill in what the form would have. */
function onEdit(e) {
  var sh = e.range.getSheet();
  if (sh.getName() !== LEADS || e.range.getRow() < 2) return;
  var c1 = e.range.getColumn(), c2 = e.range.getLastColumn();
  var touches = function (k) { var c = col_(k); return c >= c1 && c <= c2; };
  if (!touches('name') && !touches('phone')) return;
  for (var r = e.range.getRow(); r <= e.range.getLastRow(); r++) {
    var name = sh.getRange(r, col_('name')).getValue(), phone = sh.getRange(r, col_('phone')).getValue();
    if (!name && !phone) continue;
    if (!sh.getRange(r, col_('received')).getValue()) sh.getRange(r, col_('received')).setValue(new Date());
    if (!sh.getRange(r, col_('status')).getValue()) sh.getRange(r, col_('status')).setValue('חדש');
    /* 0521234567 typed into a cell becomes the number 521234567: put the 0 back */
    if (typeof phone === 'number' && phone >= 1e7 && phone < 1e9) sh.getRange(r, col_('phone')).setValue("'0" + phone);
    if (touches('phone')) setWaLink_(sh, r);
  }
}

/* ---------------------------------------------------------------- setup */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('לידים')
    .addItem('הצגת המפתח לחיבור הטפסים', 'showKey')
    .addItem('הוספת ליד לדוגמה (בדיקה)', 'testLead')
    .addSeparator()
    .addItem('הכנת טאב ההרשמות ותיקיית ההסכמים', 'setupSigning')
    .addItem('הרשמה חתומה לדוגמה (נשלחת אליכם)', 'testSigning')
    .addSeparator()
    .addItem('בנייה מחדש של הדשבורד והעיצוב', 'setup')
    .addToUi();
}

function showKey() {
  var key = PropertiesService.getScriptProperties().getProperty('WEBHOOK_KEY') || '(עוד לא הורץ setup)';
  SpreadsheetApp.getUi().alert('המפתח לחיבור הטפסים:\n' + key + '\n\nמוסיפים לסוף כתובת ה-Web app:\n?key=' + key);
}

function setup() {
  var ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone('Asia/Jerusalem');
  try { ss.setSpreadsheetLocale('iw_IL'); } catch (err) { /* set by hand: File > Settings > Locale: Israel */ }
  buildLeads_(ss);
  buildDash_(ss);
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty('WEBHOOK_KEY');
  if (!key) {
    key = Utilities.getUuid().replace(/-/g, '');
    props.setProperty('WEBHOOK_KEY', key);
  }
  var msg = 'הגיליון מוכן.\n\nהמפתח לחיבור הטפסים:\n' + key +
    '\n\nאחרי הפריסה (Deploy), מוסיפים לסוף כתובת ה-Web app:\n?key=' + key;
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (err) { /* run from the editor: see the log */ }
}

function testLead() {
  addLead_({
    id: 'test:' + Date.now(), received: new Date(), name: 'ליד לדוגמה', phone: '052-0000000',
    email: 'test@example.com', age: '11', group: GROUPS[0], message: 'שורת בדיקה, אפשר למחוק',
    consent: 'לא', source: 'אתר', detail: 'בדיקה'
  });
}

function buildLeads_(ss) {
  var sh = ss.getSheetByName(LEADS);
  if (!sh) {
    sh = ss.getSheets().length === 1 && ss.getSheets()[0].getLastRow() === 0 ? ss.getSheets()[0] : ss.insertSheet();
    sh.setName(LEADS);
  }
  sh.setRightToLeft(true);
  var n = COLS.length;
  if (sh.getMaxColumns() < n) sh.insertColumnsAfter(sh.getMaxColumns(), n - sh.getMaxColumns());
  var head = sh.getRange(1, 1, 1, n);
  head.setValues([COLS.map(function (c) { return c[1]; })])
    .setFontWeight('bold').setBackground('#1F1A3D').setFontColor('#FFFFFF')
    .setVerticalAlignment('middle').setWrap(true);
  sh.setRowHeight(1, 34);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(1);
  COLS.forEach(function (c, i) { sh.setColumnWidth(i + 1, c[2]); });

  if (sh.getMaxRows() < 3000) sh.insertRowsAfter(sh.getMaxRows(), 3000 - sh.getMaxRows());
  var rows = sh.getMaxRows() - 1;
  var at = function (k) { return sh.getRange(2, col_(k), rows, 1); };
  at('received').setNumberFormat('dd/mm/yyyy hh:mm');
  at('next').setNumberFormat('dd/mm/yyyy');
  at('message').setWrap(true);
  at('notes').setWrap(true);
  sh.getRange(2, 1, rows, n).setVerticalAlignment('top');

  var list = function (values) {
    return SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
  };
  at('status').setDataValidation(list(STATUSES));
  at('source').setDataValidation(list(SOURCES));
  at('group').setDataValidation(list(GROUPS));
  at('next').setDataValidation(SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false)
    .setHelpText('תאריך, למשל 15/10/2026. לחיצה כפולה פותחת לוח שנה.').build());

  /* a row takes its status's colour; an overdue call-back date turns red */
  var S = '$' + letter_('status') + '2', N = '$' + letter_('next') + '2';
  var all = sh.getRange(2, 1, rows, n);
  var rules = [SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(' + N + '<>"",' + N + '<=TODAY(),' + S + '<>"' + CLOSED[0] + '",' + S + '<>"' + CLOSED[1] + '")')
    .setBackground('#FFD6D6').setFontColor('#9B1C1C').setBold(true)
    .setRanges([at('next')]).build()];
  STATUSES.forEach(function (st, i) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=' + S + '="' + st + '"').setBackground(STATUS_COLORS[i]).setRanges([all]).build());
  });
  sh.setConditionalFormatRules(rules);

  sh.hideColumns(col_('id'));
  return sh;
}

function buildDash_(ss) {
  var sh = ss.getSheetByName(DASH) || ss.insertSheet(DASH);
  sh.clear();
  sh.getCharts().forEach(function (c) { sh.removeChart(c); });
  sh.setRightToLeft(true);
  ss.setActiveSheet(sh);
  ss.moveActiveSheet(1);

  var NAME = ref_('name'), STAT = ref_('status'), NEXT = ref_('next'), RCV = ref_('received'),
      SRC = ref_('source'), GRP = ref_('group'), OWN = ref_('owner'), PHONE = ref_('phone'), NOTES = ref_('notes');
  var open = STAT + '<>"' + CLOSED[0] + '",' + STAT + '<>"' + CLOSED[1] + '"';

  sh.getRange('A1').setValue('דשבורד לידים').setFontSize(18).setFontWeight('bold');
  sh.getRange('A2').setFormula('="מתעדכן לבד · נכון ל-"&TEXT(NOW(),"dd/mm/yyyy hh:mm")').setFontColor('#6B6790');

  var kpis = [
    ['לידים בסך הכול', '=COUNTA(' + NAME + ')'],
    ['ב-7 הימים האחרונים', '=COUNTIF(' + RCV + ',">="&(TODAY()-6))'],
    ['מתחילת החודש', '=COUNTIF(' + RCV + ',">="&EOMONTH(TODAY(),-1)+1)'],
    ['חדשים, עוד לא דיברנו', '=COUNTIF(' + STAT + ',"חדש")'],
    ['מחכים יותר מיממה', '=COUNTIFS(' + STAT + ',"חדש",' + RCV + ',"<"&(NOW()-1))'],
    ['לחזור אליהם היום או קודם', '=COUNTIFS(' + NEXT + ',"<="&TODAY(),' + STAT + ',"<>' + CLOSED[0] + '",' + STAT + ',"<>' + CLOSED[1] + '")'],
    ['נרשמו', '=COUNTIF(' + STAT + ',"נרשם")'],
    ['אחוז הרשמה', '=IFERROR(COUNTIF(' + STAT + ',"נרשם")/COUNTA(' + NAME + '),0)']
  ];
  sh.getRange(4, 1, kpis.length, 1).setValues(kpis.map(function (k) { return [k[0]]; })).setFontWeight('bold');
  sh.getRange(4, 2, kpis.length, 1).setFormulas(kpis.map(function (k) { return [k[1]]; }))
    .setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center');
  sh.getRange(4 + kpis.length - 1, 2).setNumberFormat('0%');
  sh.getRange(8, 1, 2, 2).setBackground('#FFF3C4');
  sh.getRange(4, 1, kpis.length, 2).setBorder(true, true, true, true, true, true, '#D9D4F0', SpreadsheetApp.BorderStyle.SOLID);

  /* by status */
  var r = 4 + kpis.length + 2;
  sh.getRange(r, 1, 1, 2).setValues([['לפי סטטוס', 'לידים']]).setFontWeight('bold').setBackground('#1F1A3D').setFontColor('#FFFFFF');
  STATUSES.forEach(function (st, i) {
    sh.getRange(r + 1 + i, 1).setValue(st).setBackground(STATUS_COLORS[i]);
    sh.getRange(r + 1 + i, 2).setFormula('=COUNTIF(' + STAT + ',"' + st + '")').setHorizontalAlignment('center');
  });

  /* by source, with how many of them signed up */
  r = r + STATUSES.length + 2;
  sh.getRange(r, 1, 1, 4).setValues([['לפי מקור', 'לידים', 'נרשמו', 'אחוז הרשמה']])
    .setFontWeight('bold').setBackground('#1F1A3D').setFontColor('#FFFFFF');
  SOURCES.forEach(function (s, i) {
    var R = r + 1 + i;
    sh.getRange(R, 1).setValue(s);
    sh.getRange(R, 2, 1, 3).setFormulas([[
      '=COUNTIF(' + SRC + ',"' + s + '")',
      '=COUNTIFS(' + SRC + ',"' + s + '",' + STAT + ',"נרשם")',
      '=IF(B' + R + '=0,"",C' + R + '/B' + R + ')'
    ]]).setHorizontalAlignment('center');
    sh.getRange(R, 4).setNumberFormat('0%');
  });

  /* by age group */
  r = r + SOURCES.length + 2;
  sh.getRange(r, 1, 1, 3).setValues([['לפי קבוצת גיל', 'לידים', 'נרשמו']])
    .setFontWeight('bold').setBackground('#1F1A3D').setFontColor('#FFFFFF');
  GROUPS.concat(['לא צוין']).forEach(function (g, i) {
    var R = r + 1 + i, crit = g === 'לא צוין' ? '""' : '"' + g + '"';
    sh.getRange(R, 1).setValue(g);
    sh.getRange(R, 2, 1, 2).setFormulas([[
      g === 'לא צוין' ? '=COUNTA(' + NAME + ')-COUNTIF(' + GRP + ',"?*")' : '=COUNTIF(' + GRP + ',' + crit + ')',
      g === 'לא צוין' ? '=COUNTIF(' + STAT + ',"נרשם")-COUNTIFS(' + GRP + ',"?*",' + STAT + ',"נרשם")' : '=COUNTIFS(' + GRP + ',' + crit + ',' + STAT + ',"נרשם")'
    ]]).setHorizontalAlignment('center');
  });

  /* Everyone still in progress (not נרשם / לא רלוונטי), with the notes (chosen 18 Oct 2026;
     until then only new leads and due call-backs were listed, so a lead in a conversation with
     no date disappeared). On top, whom to call now: new leads and call-backs that are due.
     Under them the rest: those with no call-back date, then call-backs set for later. Each
     part goes by date, the call-back date or else the date the lead came in, oldest first.
     Two helper columns carry that order and CHOOSECOLS leaves them out. */
  var due = '(' + STAT + '="חדש")+((' + NEXT + '<>"")*(' + NEXT + '<=TODAY()))';
  sh.getRange('F3').setValue('לידים בטיפול').setFontSize(14).setFontWeight('bold');
  sh.getRange('H3').setValue('למעלה: חדשים ומי שהגיע מועד החזרה אליו').setFontColor('#6B6790');
  sh.getRange('F4:L4').setValues([['שם', 'טלפון', 'סטטוס', 'לחזור בתאריך', 'מטפל/ת', 'הערות', 'התקבל']])
    .setFontWeight('bold').setBackground('#1F1A3D').setFontColor('#FFFFFF');
  sh.getRange('F5').setFormula('=ARRAYFORMULA(IFERROR(CHOOSECOLS(SORT(FILTER({' +
    [NAME, PHONE, STAT, NEXT, OWN, NOTES, RCV, 'IF(' + due + ',0,1)', 'IF(' + NEXT + '<>"",' + NEXT + ',' + RCV + ')'].join(',') +
    '},' + NAME + '<>"",' + open + '),8,TRUE,9,TRUE),1,2,3,4,5,6,7),"אין כרגע לידים בטיפול"))');
  var listRows = sh.getRange('F5:L400');
  listRows.setVerticalAlignment('top');
  sh.getRange('I5:I400').setNumberFormat('dd/mm/yyyy');
  sh.getRange('K5:K400').setWrap(true);
  sh.getRange('L5:L400').setNumberFormat('dd/mm/yyyy hh:mm');
  /* the colours of the לידים tab: each row in its status's colour, a due call-back date in red */
  var listRules = [SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($I5<>"",$I5<=TODAY())')
    .setBackground('#FFD6D6').setFontColor('#9B1C1C').setBold(true)
    .setRanges([sh.getRange('I5:I400')]).build()];
  STATUSES.forEach(function (st, i) {
    if (CLOSED.indexOf(st) > -1) return;
    listRules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$H5="' + st + '"').setBackground(STATUS_COLORS[i]).setRanges([listRows]).build());
  });
  sh.setConditionalFormatRules(listRules);

  /* leads per week, last 12 weeks (weeks start on Sunday) */
  var W = 'N';
  sh.getRange(W + '3').setValue('לידים בשבוע').setFontSize(14).setFontWeight('bold');
  sh.getRange(W + '4:O4').setValues([['שבוע מ-', 'לידים']]).setFontWeight('bold');
  for (var k = 0; k < 12; k++) {
    var R = 5 + k;
    sh.getRange(W + R).setFormula('=TODAY()-WEEKDAY(TODAY())+1-7*' + (11 - k)).setNumberFormat('dd/mm');
    /* a whole number: the result would otherwise take the date format of the week cell next to it */
    sh.getRange('O' + R).setFormula('=COUNTIFS(' + RCV + ',">="&' + W + R + ',' + RCV + ',"<"&(' + W + R + '+7))')
      .setNumberFormat('0');
  }
  var chart = sh.newChart().asColumnChart()
    .addRange(sh.getRange(W + '4:O16'))
    .setNumHeaders(1)
    .setOption('title', 'לידים בשבוע')
    .setOption('legend', { position: 'none' })
    .setOption('colors', ['#6B4EFF'])
    .setPosition(18, 14, 0, 0)
    .build();
  sh.insertChart(chart);

  sh.setColumnWidth(1, 190);
  sh.setColumnWidths(2, 4, 90);
  sh.setColumnWidth(5, 30);
  sh.setColumnWidths(6, 5, 115);   // F-J: name … owner
  sh.setColumnWidth(11, 260);      // K: notes
  sh.setColumnWidth(12, 115);      // L: came in
  sh.setColumnWidth(13, 30);
  sh.setColumnWidths(14, 2, 80);
  sh.setFrozenRows(2);
}
