/**
 * FutureGen Academy: signed registrations.
 *
 * A second file in the same Apps Script project as leads.gs (in the editor:
 * + next to "Files" > Script, name it "signing", paste this whole file).
 * Full instructions: README.md, "הרשמה וחתימה".
 *
 * register.html posts here (doPost in leads.gs, ?action=sign) when a parent signs
 * the disclosure document and engagement agreement. For each signature:
 *   - the agreement is read from the LIVE register page, so the signed copy holds the
 *     published text, never a text a browser sent (a stale page gets "outdated");
 *   - a PDF with the agreement, the details and the signature goes to a Drive folder;
 *   - a row goes to the "הרשמות" tab, with a payment status to update by hand;
 *   - the parent gets the PDF by email, and the business a blind copy.
 *
 *   setupSigning()  creates the tab and the folder and asks for the permissions
 *                   (Drive, sending mail, reading the site). Run it once.
 *   testSigning()   signs a sample registration (with a drawn sample signature) and
 *                   emails it to you. Run it after the site is deployed; delete the row
 *                   and the PDF afterwards.
 */

var SITE = 'https://future-gen.co.il';
var REG = 'הרשמות';
var PAY_STATES = ['ממתין לתשלום', 'שולם', 'בוטל'];
var PAY_COLORS = ['#FFF3C4', '#D6F5DD', '#ECECEC'];
var PLANS = {
  monthly: 'מסלול חודשי · 350 ש״ח לחודש, ללא התחייבות',
  yearly: 'מסלול שנתי · 300 ש״ח לחודש, בהתחייבות לשנת הלימודים'
};

/* [key, header, width], right to left */
var REG_COLS = [
  ['signed', 'נחתם', 125],
  ['ref', 'אסמכתא', 120],
  ['pay', 'תשלום', 115],
  ['plan', 'מסלול', 70],
  ['parent', 'שם ההורה', 150],
  ['pid', 'ת״ז', 95],
  ['phone', 'טלפון', 110],
  ['email', 'אימייל', 190],
  ['student', 'שם התלמיד/ה', 140],
  ['age', 'גיל', 50],
  ['pdf', 'ההסכם החתום', 100],
  ['notes', 'הערות', 220],
  ['how', 'אופן החתימה', 95],
  ['version', 'גרסת המסמך', 95],
  ['hash', 'טביעת המסמך (SHA-256)', 160],
  ['ua', 'דפדפן', 220]
];
function regCol_(key) {
  for (var i = 0; i < REG_COLS.length; i++) if (REG_COLS[i][0] === key) return i + 1;
  throw new Error('no column ' + key);
}

/* ---------------------------------------------------------------- signing */

function sign_(e) {
  var d;
  try { d = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return replyJson_({ result: 'invalid' }); }
  if (!d || typeof d !== 'object') return replyJson_({ result: 'invalid' });
  if (d.company) return replyJson_({ result: 'ok', ref: '' });   // the hidden field: a bot. Keep nothing.
  var bad = checkSign_(d);
  if (bad) return replyJson_({ result: 'invalid', field: bad });

  var cache = CacheService.getScriptCache();
  /* the same parent and plan again within 10 minutes (a double click, a retry after a
     slow answer): the first signature stands */
  var dupKey = 'sign:dup:' + d.parent_id + ':' + d.plan + ':' + d.version;
  var dup = cache.get(dupKey);
  if (dup) return replyJson_({ result: 'ok', ref: dup });
  var hourKey = 'sign:n:' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
  var n = Number(cache.get(hourKey) || 0);
  if (n >= 40) return replyJson_({ result: 'busy' });
  cache.put(hourKey, String(n + 1), 3600);

  try {
    var doc = agreement_(d.version);
    if (!doc) return replyJson_({ result: 'outdated' });
    var ref = record_(d, doc);
    cache.put(dupKey, ref, 600);
    return replyJson_({ result: 'ok', ref: ref });
  } catch (err) {
    console.error('sign failed: ' + (err && err.stack || err));
    return replyJson_({ result: 'error' });
  }
}

/* What the page checks, checked again here. Returns the id of the field to fix, or ''. */
function checkSign_(d) {
  var s = function (v) { return String(v == null ? '' : v).trim(); };
  if (!PLANS[d.plan]) return 'plan';
  if (!/^[\w.-]{1,40}$/.test(s(d.version))) return 'version';
  if (s(d.parent_name).length < 2 || s(d.parent_name).length > 120) return 'rName';
  if (!validId_(d.parent_id)) return 'rId';
  var phone = s(d.phone).replace(/\D/g, '');
  if (phone.length < 9 || phone.length > 15) return 'rPhone';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s(d.email)) || s(d.email).length > 200) return 'rEmail';
  if (s(d.student_name).length < 2 || s(d.student_name).length > 120) return 'rStudent';
  var age = parseInt(d.student_age, 10);
  if (!(age >= 10 && age <= 16)) return 'rAge';
  if (d.agree !== true) return 'rAgree';
  if (d.typed !== true) {
    var sig = s(d.signature);
    if (sig.length > 400000 || !/^data:image\/png;base64,[A-Za-z0-9+\/]+=*$/.test(sig)) return 'sig';
  }
  return '';
}

/* Israeli ID: up to 9 digits, padded with zeros; the weighted digit sum divides by 10 */
function validId_(v) {
  var d = String(v == null ? '' : v).replace(/\D/g, '');
  if (d.length < 5 || d.length > 9) return false;
  d = ('000000000' + d).slice(-9);
  var sum = 0;
  for (var i = 0; i < 9; i++) {
    var n = Number(d.charAt(i)) * (i % 2 + 1);
    sum += n > 9 ? n - 9 : n;
  }
  return sum % 10 === 0;
}

/* The agreement as published on the register page, if its version is the one signed. */
function agreement_(version) {
  var cache = CacheService.getScriptCache(), key = 'agree:' + version;
  var html = cache.get(key);
  if (html) return html;
  var live = liveAgreement_();
  if (live.version !== version) return null;
  try { cache.put(key, live.html, 600); } catch (err) { /* over the cache's 100KB: just fetch next time */ }
  return live.html;
}

function liveAgreement_() {
  var res = UrlFetchApp.fetch(SITE + '/register.html', { muteHttpExceptions: true, followRedirects: true });
  if (res.getResponseCode() !== 200) throw new Error('register page: HTTP ' + res.getResponseCode());
  return agreementFrom_(res.getContentText('UTF-8'));
}

function agreementFrom_(page) {
  var m = /<article\b[^>]*\bid="agreement"[^>]*>([\s\S]*?)<\/article>/.exec(page);
  if (!m) throw new Error('no <article id="agreement"> on the register page');
  var v = /\bdata-version="([^"]+)"/.exec(m[0]);
  return { version: v ? v[1] : '', html: m[1].trim() };
}

/* PDF to Drive, row to the sheet, copy to the parent. Returns the reference. */
function record_(d, doc) {
  var now = new Date();
  var when = Utilities.formatDate(now, 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm:ss');
  var ref = 'FG-' + Utilities.formatDate(now, 'Asia/Jerusalem', 'yyMMdd') + '-' + code_(4);
  var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, doc, Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');

  var pdf = signedPdf_(doc, d, ref, when, hash);
  var file = signFolder_().createFile(pdf);

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var sh, r;
  try {
    var ss = SpreadsheetApp.getActive();
    sh = ss.getSheetByName(REG) || buildReg_(ss);
    sh.appendRow(REG_COLS.map(function (c) {
      switch (c[0]) {
        case 'signed': return now;
        case 'ref': return ref;
        case 'pay': return PAY_STATES[0];
        case 'plan': return d.plan === 'yearly' ? 'שנתי' : 'חודשי';
        case 'parent': return text_(d.parent_name, 120);
        case 'pid': return text_(String(d.parent_id).replace(/\D/g, ''), 9);
        case 'phone': return text_(d.phone, 40);
        case 'email': return text_(d.email, 200);
        case 'student': return text_(d.student_name, 120);
        case 'age': return text_(d.student_age, 3);
        case 'how': return d.typed === true ? 'שם מוקלד' : 'ציור';
        case 'version': return text_(d.version, 40);
        case 'hash': return hash;
        case 'ua': return text_(d.ua, 300);
        default: return '';
      }
    }));
    r = sh.getLastRow();
    sh.getRange(r, regCol_('pdf')).setRichTextValue(
      SpreadsheetApp.newRichTextValue().setText('פתיחה').setLinkUrl(file.getUrl()).build());
  } finally { lock.releaseLock(); }

  try {
    mailCopy_(d, ref, pdf);
  } catch (err) {
    console.error('mail failed: ' + err);
    sh.getRange(r, regCol_('notes')).setValue('העותק לא נשלח במייל: ' + String(err).slice(0, 120));
  }
  return ref;
}

function code_(n) {
  var abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', s = '';
  for (var i = 0; i < n; i++) s += abc.charAt(Math.floor(Math.random() * abc.length));
  return s;
}

function esc_(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

var PDF_CSS =
  'body{font-family:Arial,sans-serif;font-size:10.5pt;line-height:1.55;color:#111;direction:rtl;text-align:right}' +
  'h2{font-size:15pt;margin:0 0 8px}h3{font-size:12pt;margin:14px 0 4px}' +
  'ul{margin:4px 0;padding-right:18px}li{margin:2px 0}p{margin:4px 0}' +
  '.agree-key{border:1.5px solid #333;padding:6px 10px;margin:6px 0}' +
  '.sign{border-top:2px solid #333;margin-top:18px;padding-top:8px}' +
  'table{border-collapse:collapse;margin:6px 0}th,td{border:1px solid #bbb;padding:4px 8px;text-align:right;vertical-align:top}' +
  'th{background:#f2f2f2;width:150px}.small{font-size:8.5pt;color:#555}.typed{font-size:18pt;font-style:italic;margin:4px 0}';

function signedPdf_(doc, d, ref, when, hash) {
  var rows = [
    ['שם ההורה', d.parent_name], ['מספר תעודת זהות', String(d.parent_id).replace(/\D/g, '')],
    ['טלפון', d.phone], ['אימייל', d.email],
    ['שם התלמיד/ה', d.student_name], ['גיל', d.student_age],
    ['מסלול', PLANS[d.plan]], ['מועד החתימה', when], ['מספר אסמכתא', ref]
  ];
  var sig = d.typed === true
    ? '<p class="typed">' + esc_(d.parent_name) + '</p><p class="small">החותם/ת אישר/ה באתר שהשם המלא שהקליד/ה הוא החתימה שלו/ה.</p>'
    : '<img src="' + d.signature + '" width="300" height="100" alt="חתימה">';
  var html = '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>' + PDF_CSS + '</style></head><body>' +
    doc +
    '<div class="sign"><h3>פרטי ההרשמה והחתימה</h3><table>' +
    rows.map(function (r) { return '<tr><th>' + r[0] + '</th><td>' + esc_(r[1]) + '</td></tr>'; }).join('') +
    '</table>' +
    '<p><b>אישור:</b> קראתי והבנתי את תנאי מסמך הגילוי הנאות ואני מאשר/ת את הרשמת ילדי לתוכנית.</p>' +
    '<p><b>חתימה:</b></p>' + sig +
    '<p class="small">נחתם באתר future-gen.co.il · גרסת המסמך ' + esc_(d.version) +
    ' · טביעת המסמך (SHA-256): ' + hash + '<br>דפדפן: ' + esc_(d.ua) + '</p></div></body></html>';
  var name = ('הסכם ' + ref + ' — ' + String(d.parent_name).replace(/[\\\/:*?"<>|]/g, ' ')).slice(0, 120) + '.pdf';
  return Utilities.newBlob(html, MimeType.HTML, ref + '.html').getAs(MimeType.PDF).setName(name);
}

function signFolder_() {
  var props = PropertiesService.getScriptProperties(), id = props.getProperty('SIGN_FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (err) { /* deleted: make a new one */ }
  }
  var folder = DriveApp.createFolder('FutureGen Academy — הסכמים חתומים');
  props.setProperty('SIGN_FOLDER_ID', folder.getId());
  return folder;
}

function mailCopy_(d, ref, pdf) {
  var me = Session.getEffectiveUser().getEmail();
  var mail = {
    to: String(d.email).trim(),
    replyTo: 'fgacademy.il@gmail.com',
    name: 'FutureGen Academy',
    subject: 'FutureGen Academy · עותק ההסכם החתום (' + ref + ')',
    htmlBody: '<div dir="rtl" style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6">' +
      '<p>שלום ' + esc_(d.parent_name) + ',</p>' +
      '<p>תודה שנרשמתם ל-FutureGen Academy. מצורף עותק של מסמך הגילוי הנאות והסכם ההתקשרות שחתמתם עליו באתר, ' +
      'עם פרטי ההרשמה של ' + esc_(d.student_name) + '.</p>' +
      '<p>מספר אסמכתא: ' + ref + '<br>' + PLANS[d.plan] + '</p>' +
      '<p>לכל שאלה: 052-5281662, או בתשובה למייל הזה.</p>' +
      '<p>צוות FutureGen Academy</p></div>',
    attachments: [pdf]
  };
  if (me) mail.bcc = me;   /* a copy in our own inbox, as a notice of each registration */
  MailApp.sendEmail(mail);
}

function replyJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------------------------------------------------------------- setup */

function buildReg_(ss) {
  var sh = ss.getSheetByName(REG) || ss.insertSheet(REG);
  sh.setRightToLeft(true);
  var n = REG_COLS.length;
  if (sh.getMaxColumns() < n) sh.insertColumnsAfter(sh.getMaxColumns(), n - sh.getMaxColumns());
  sh.getRange(1, 1, 1, n).setValues([REG_COLS.map(function (c) { return c[1]; })])
    .setFontWeight('bold').setBackground('#1F1A3D').setFontColor('#FFFFFF')
    .setVerticalAlignment('middle').setWrap(true);
  sh.setRowHeight(1, 34);
  sh.setFrozenRows(1);
  REG_COLS.forEach(function (c, i) { sh.setColumnWidth(i + 1, c[2]); });
  if (sh.getMaxRows() < 1000) sh.insertRowsAfter(sh.getMaxRows(), 1000 - sh.getMaxRows());
  var rows = sh.getMaxRows() - 1;
  var at = function (k) { return sh.getRange(2, regCol_(k), rows, 1); };
  at('signed').setNumberFormat('dd/mm/yyyy hh:mm');
  at('notes').setWrap(true);
  sh.getRange(2, 1, rows, n).setVerticalAlignment('top');
  at('pay').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(PAY_STATES, true).setAllowInvalid(false).build());
  var P = '$' + String.fromCharCode(64 + regCol_('pay')) + '2';
  sh.setConditionalFormatRules(PAY_STATES.map(function (st, i) {
    return SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=' + P + '="' + st + '"')
      .setBackground(PAY_COLORS[i]).setRanges([sh.getRange(2, 1, rows, n)]).build();
  }));
  sh.hideColumns(regCol_('hash'));
  sh.hideColumns(regCol_('ua'));
  return sh;
}

function setupSigning() {
  var ss = SpreadsheetApp.getActive();
  buildReg_(ss);
  var folder = signFolder_();
  /* touch each service once, so the permission screen asks for all of them now */
  MailApp.getRemainingDailyQuota();
  UrlFetchApp.fetch(SITE, { muteHttpExceptions: true });
  var msg = 'ההרשמות מוכנות.\n\nטאב: ' + REG + '\nתיקיית ההסכמים בדרייב: ' + folder.getName() + '\n' + folder.getUrl() +
    '\n\nעכשיו: Deploy > Manage deployments > עריכה > New version > Deploy.';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (err) { /* run from the editor: see the log */ }
}

/* a squiggle drawn as a PNG, so the test shows a drawn signature in the PDF */
var SAMPLE_SIGNATURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABkCAAAAAAZalIcAAACaklEQVR42u3cUXLDIAwE0D2H7n9P96MznbZjsJBWaqIun4mTgRfASJjgUnEXiEBYwhKWsIQlLBEIS1jCEpawhCUCYQlLWMISlrBEICxhCUtYwvIV+yzC8koN9UKd1TwuVFBdQ7VAtxo8daHI6usFYS2tnl4S1hJmmhYKrcZpMbH8iP8aa00ySgu1Vvv3/iPWvvcM0kJxxxqlhXKrQVqotxLWEcUULTRYjdFCh9WU1VYPVqprvU46ES1WCS17oewrAYvMuqf6Uy70dKwglt1mX7laB1+KJquI1k0zyFqHfRY9gzCiZdUJxeMxjq6OFbt8mVA0JtVPtxKs4zqfj1o7UcxOVc9c6BqEkfuBla1xbTfGl9+Nvo510siHK7NYa5ItFxqt/B96VM1pbbvPRgv3l5cuMhk9MB8/Bd5HcDKKVtab0ClMZDh/igOsqgyV+fKqTiyrsTq5G5am81yzkdU1OnMnRYgiPWMw2hJqdmrVgQgG4V7EaItFw01y1uF5JzCxzKHtX8diiHjNEV1AV2QrLBRrt1ktF6X28PMz4jJCzEcKN5NY1z4g4IT8hPiYFW7msFbV4CZIPEFGT7iZwyp+mO+7Tia7bif7S8mKIzJWrouold2JKF7wu7MOixT4RSqkTRvPhzkVx8HMwt9b4WxvOXMU+YrDO7O88qEJWryZw3qT0zi0eDOH9SYHvZ5Tn1cLVtFGcJcWs+5jTrIW7zLOwrpn4Y6JQWeky5+MGHWg/NdtiD/Vzjp9X/w017C/Kqh98G3e/zoUrgr1JxjCEpawhCUsFWEJS1jCEpawVIQlLGEJS1jCUhGWsGrKB/37/hPvtuMkAAAAAElFTkSuQmCC';

function testSigning() {
  var live = liveAgreement_();
  var me = Session.getEffectiveUser().getEmail();
  var ref = record_({
    version: live.version, plan: 'yearly', parent_name: 'הורה לדוגמה (בדיקה)', parent_id: '000000018',
    phone: '052-0000000', email: me, student_name: 'תלמיד/ה לדוגמה', student_age: '12',
    agree: true, typed: false, signature: SAMPLE_SIGNATURE, ua: 'בדיקה מתוך Apps Script'
  }, live.html);
  var msg = 'נוצרה הרשמה לדוגמה: ' + ref + '\nהעותק נשלח אל ' + me +
    '\n\nאחרי הבדיקה אפשר למחוק את השורה בטאב ' + REG + ' ואת ה-PDF מהתיקייה.';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (err) { /* run from the editor: see the log */ }
}
