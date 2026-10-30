/**
 * FutureGen Academy: a one-time move (16 Oct 2026).
 *
 * Leads were typed straight into the dashboard's "למי לחזור עכשיו" table. That table
 * is a formula that fills itself from the "לידים" tab, so the typing blocked it (#REF!)
 * and those leads were missing from "לידים" and from every count.
 *
 * moveDashboardLeads() copies the dashboard to a backup tab first, so nothing typed
 * there is lost; then moves each typed lead into "לידים", and rebuilds the dashboard.
 * Statuses are matched to the sheet's list; anything that doesn't fit a column
 * (the original status, "יום רלוונטי", free text in a date column) goes into הערות.
 *
 * Add as a third file in the Apps Script project (name it "migrate"), run
 * moveDashboardLeads once, check the result, then the file can be deleted.
 */

var MOVE_BACKUP = 'דשבורד ישן (גיבוי)';
var MOVE_STATUS = {
  'חדש': 'חדש',
  'לא ענו': 'לא ענו', 'לא עונה': 'לא ענו', 'לא ענה': 'לא ענו', 'לא עונים': 'לא ענו',
  'בשיחה': 'בשיחה', 'בטיפול': 'בשיחה',
  'נרשם': 'נרשם', 'נרשמה': 'נרשם', 'נרשמו': 'נרשם',
  'לא רלוונטי': 'לא רלוונטי', 'לא נסגר': 'לא רלוונטי'
};

function moveDashboardLeads() {
  var ss = SpreadsheetApp.getActive();
  var dash = ss.getSheetByName(DASH), leads = ss.getSheetByName(LEADS);
  if (!dash || !leads) throw new Error('missing the "' + DASH + '" or "' + LEADS + '" tab');
  if (ss.getSheetByName(MOVE_BACKUP)) {
    return say_('ההעברה כבר נעשתה: יש כבר טאב "' + MOVE_BACKUP + '". לא הועבר שום דבר נוסף.');
  }
  var moved = typedLeads_(dash);

  dash.copyTo(ss).setName(MOVE_BACKUP);
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    moved.forEach(function (lead) {
      leads.appendRow(COLS.map(function (c) { return lead[c[0]] == null ? '' : lead[c[0]]; }));
      setWaLink_(leads, leads.getLastRow());
    });
  } finally { lock.releaseLock(); }
  buildDash_(ss);

  return say_('הועברו ' + moved.length + ' לידים מהדשבורד לטאב "' + LEADS + '":\n' +
    moved.map(function (l) { return '• ' + String(l.name).replace(/^'/, ''); }).join('\n') +
    '\n\nהדשבורד נבנה מחדש. העותק הישן שמור בטאב "' + MOVE_BACKUP + '". אחרי שבדקתם, אפשר למחוק אותו.');
}

/* The rows typed into the dashboard's table, as lead rows for "לידים". */
function typedLeads_(dash) {
  var range = dash.getDataRange();
  var values = range.getValues(), formulas = range.getFormulas(), shown = range.getDisplayValues();
  var cell = function (r, c) { return formulas[r][c] ? '' : values[r][c]; };   // formulas are the dashboard's own

  /* the table's header row: "שם" from column F (index 5) on, with "סטטוס" next to it */
  var head = -1, cols = {};
  for (var r = 0; r < values.length && head < 0; r++) {
    for (var c = 5; c < values[r].length; c++) {
      if (String(values[r][c]).trim() === 'שם' && values[r].some(function (v) { return String(v).trim() === 'סטטוס'; })) {
        head = r;
        for (var k = c; k < values[r].length; k++) {
          var name = String(values[r][k]).trim();
          if (name && !(name in cols)) cols[name] = k;
        }
        break;
      }
    }
  }
  if (head < 0) return [];

  var known = ['שם', 'טלפון', 'סטטוס', 'לחזור בתאריך', 'מטפל/ת', 'התקבל', 'גיל הילד', 'גיל', 'הערות'];
  var out = [];
  for (var row = head + 1; row < values.length; row++) {
    var get = function (h) { return h in cols ? cell(row, cols[h]) : ''; };
    var name = String(get('שם')).trim();
    if (!name || /^#/.test(name)) continue;
    var notes = [];
    var lead = { name: text_(name, 120), detail: 'הועבר מהדשבורד', id: 'moved:' + (row + 1) + ':' + name };

    var phone = get('טלפון');
    if (typeof phone === 'number' && phone >= 1e7 && phone < 1e9) phone = '0' + phone;   // 0521234567 typed as a number
    lead.phone = text_(phone, 40);

    var st = String(get('סטטוס')).trim();
    lead.status = MOVE_STATUS[st] || (st ? 'בשיחה' : 'חדש');
    if (st && MOVE_STATUS[st] !== st) notes.push('סטטוס מקורי: ' + st);

    var next = get('לחזור בתאריך');
    if (next instanceof Date) lead.next = next;
    else if (String(next).trim()) notes.push('לחזור: ' + String(next).trim());

    lead.owner = text_(get('מטפל/ת'), 60);

    var rcv = get('התקבל');
    if (rcv instanceof Date) lead.received = rcv;
    else if (String(rcv).trim()) notes.push(String(rcv).trim());

    var age = String(get('גיל הילד') || get('גיל')).trim();
    var n = /^\D*(1[0-6])\D*$/.exec(age);
    if (n) { lead.age = text_(n[1], 3); lead.group = groupFromAge_(n[1]); }
    if (age && !/^\d+$/.test(age)) notes.push('גיל הילד: ' + age);

    Object.keys(cols).forEach(function (h) {
      if (known.indexOf(h) > -1) return;
      var v = cell(row, cols[h]);
      if (String(v).trim()) notes.push(h + ': ' + (v instanceof Date ? shown[row][cols[h]] : String(v).trim()));
    });
    var own = String(get('הערות')).trim();
    if (own) notes.push(own);
    lead.notes = text_(notes.join(' · '), 2000);
    out.push(lead);
  }
  return out;
}

function say_(msg) {
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert(msg); } catch (err) { /* run from the editor: see the log */ }
  return msg;
}
