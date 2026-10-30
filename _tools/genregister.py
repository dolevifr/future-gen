# -*- coding: utf-8 -*-
import sys, io, os
# Run from anywhere:  python3 _tools/genregister.py
# Writes register.html: the disclosure document and engagement agreement
# ("מסמך גילוי נאות והסכם התקשרות"), the parent's details and signature, and
# then the payment link. The pricing section's "להרשמה ותשלום" button leads here.
#
# How a signature is kept (README, "הרשמה וחתימה"):
#   assets/js/register.js posts the details and the signature to the leads
#   Apps Script (PAYMENT.signUrl in data.js, ?action=sign). The script reads the
#   agreement from the LIVE register page (the <article id="agreement">), so the
#   signed PDF always holds the published text, not whatever a browser sent. It
#   saves the PDF to Google Drive, adds a row to the "הרשמות" tab and emails a
#   copy to the parent. Only then does the page send the parent on to Grow.
#
# Changing the agreement: edit AGREEMENT below, set a new VERSION (the date),
# run this script, and deploy. Signatures made on the old page are refused with
# "the document was updated, reload", so nobody signs a text they did not see.
#
# Text: the owners' document of 7 Oct 2026, with their decisions of 8 Oct
# (annual plan ₪300; monthly cancellation as the law and the terms page say)
# and the cancellation channels section 14ט of the Consumer Protection Law asks for.
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(os.path.dirname(HERE))
from shell import page

VERSION = "2026-10-08"
R = '10&lrm;–&#8288;&lrm;16'   # "10–16" that stays in reading order in right-to-left text

AGREEMENT = f'''<h2 class="agree-title">מסמך גילוי נאות והסכם התקשרות — FutureGen Academy</h2>
      <p>ברוכים הבאים ל-FutureGen Academy. מסמך זה מהווה הסכם התקשרות חוקי בינינו לביניכם (כהורי התלמיד/ה), וכולל את כל פרטי העסקה בהתאם לחוק הגנת הצרכן, התשמ״א-1981 (עסקת מכר מרחוק ועסקה מתמשכת). אנא קראו מסמך זה בעיון.</p>

      <h3>1. פרטי העוסק ויצירת קשר</h3>
      <ul>
        <li>שם העוסק: יריב פרזון (עוסק פטור)</li>
        <li>מספר עוסק: 311532907</li>
        <li>כתובת בית העסק: נתיב העשרה 85</li>
        <li>טלפון ליצירת קשר / וואטסאפ: <span dir="ltr">052-5281662</span></li>
        <li>דואר אלקטרוני: <span dir="ltr">fgacademy.il@gmail.com</span></li>
      </ul>

      <h3>2. תיאור השירות</h3>
      <p>FutureGen Academy מציעה תוכנית העשרה מתקדמת לילדים ונוער (גילאי {R}). התוכנית מכשירה את הילדים בשלושה תחומים מרכזיים: בינה מלאכותית (AI) וטכנולוגיות מתקדמות, יזמות ואוריינות פיננסית, ומנהיגות ועמידה מול קהל. הלמידה מתבצעת אונליין באמצעות פלטפורמת Discord, וכוללת מפגש אחד בשבוע באורך 60 דקות. הלמידה נערכת בקבוצות בוטיק של עד 15 תלמידים, המועברות על ידי מנטורים מקצועיים מעולמות הטכנולוגיה.</p>

      <h3>3. מועדים ומשך ההתקשרות (עסקה מתמשכת)</h3>
      <ul>
        <li><b>שנת הפעילות:</b> תוכנית הלימודים השנתית תחל ביום 1.11.2026 ותסתיים ביום 31.8.2027.</li>
        <li><b>הצטרפות:</b> ההרשמה למסלול החודשי אפשרית בכל תחילת חודש. ההרשמה למסלול השנתי אפשרית מתחילת השנה ועד לסיומה, וניתן להצטרף גם במהלכה (החיוב והתוכנית יותאמו ממועד ההצטרפות ועד סוף השנה הלימודית).</li>
      </ul>

      <h3>4. מחיר ותנאי תשלום</h3>
      <p>לבחירתכם שני מסלולי הרשמה:</p>
      <ul>
        <li><b>המסלול החודשי (מתחדש, ללא התחייבות):</b> 350 ש״ח לכל חודש פעילות.</li>
        <li><b>המסלול השנתי (בהתחייבות):</b> 300 ש״ח לכל חודש פעילות, בהתחייבות למערך השנתי המלא (הבטחת מקום בקבוצה עד סוף שנת הלימודים באוגוסט 2027).</li>
        <li><b>אמצעי תשלום:</b> התשלום יבוצע מראש בכל חודש באמצעות הוראת קבע בכרטיס אשראי או באמצעות העברה בנקאית (כהוראת קבע בנקאית).</li>
      </ul>

      <h3>5. מדיניות ביטולים והפסקת שירות (גילוי נאות בהבלטה מיוחדת)</h3>
      <div class="agree-key">
        <p><b>זכות הביטול ואופן מסירת הודעת הביטול:</b> הלקוח רשאי לבטל עסקה זו בכל עת. את הודעת הביטול אפשר למסור באחת מהדרכים הבאות:</p>
        <ul>
          <li>בטופס ביטול העסקה באתר: <span dir="ltr">future-gen.co.il/cancel</span></li>
          <li>בטלפון, בהודעת טקסט או בוואטסאפ למספר <span dir="ltr">052-5281662</span></li>
          <li>בדואר אלקטרוני לכתובת <span dir="ltr">fgacademy.il@gmail.com</span></li>
          <li>בדואר רשום לכתובת בית העסק שבסעיף 1</li>
        </ul>
        <p>בהודעת הביטול יש לציין את שם ההורה המשלם ואת מספר תעודת הזהות שלו, ורצוי גם את שם התלמיד/ה. הביטול ייכנס לתוקף בתוך 3 ימי עסקים ממועד קבלת הודעת הביטול (ואם נשלחה בדואר רשום, בתוך 6 ימי עסקים ממועד מסירתה למשלוח).</p>
        <p><b>תשלומים ודמי ביטול בהתאם למסלול ההרשמה:</b></p>
        <ul>
          <li><b>ביטול במסלול החודשי:</b> לקוח שבחר במסלול החודשי רשאי לבטל בכל עת, ללא דמי ביטול. החיובים ייפסקו עם כניסת הביטול לתוקף, והלקוח ישלם רק עבור התקופה שעד כניסת הביטול לתוקף.</li>
          <li><b>ביטול במסלול השנתי:</b> מסלול זה מהווה רישום והתחייבות לשנת הפעילות המלאה (עד 31.8.2027), השומרת לתלמיד מקום קבוע בקבוצה קטנה. במידה והלקוח מבקש לבטל את המסלול השנתי לפני תום שנת הפעילות, הוא יחויב בתשלום היחסי עבור החודשים בהם השתתף התלמיד עד לכניסת הביטול לתוקף. בנוסף, ייגבו דמי ביטול בגין יציאה מוקדמת מהמסלול השנתי בסך של 5% מיתרת העסקה (עבור החודשים שנותרו) או 100 ש״ח — הנמוך מביניהם, וזאת בהתאם להוראות חוק הגנת הצרכן.</li>
        </ul>
      </div>

      <h3>6. תנאים נוספים</h3>
      <ul>
        <li><b>היעדרויות:</b> לא יינתן זיכוי כספי או החזר בגין היעדרות של תלמיד ממפגש בודד. צוות ההדרכה יעשה מאמץ לסייע בהשלמת החומר.</li>
        <li><b>שינויים טכניים:</b> הנהלת האקדמיה שומרת לעצמה את הזכות לבצע שינויים בזהות המדריכים או בשעות הפעילות במקרי צורך, תוך מתן הודעה מראש להורים. הלמידה מצריכה חיבור אינטרנט תקין ומחשב תקין ומותאם מצד התלמיד.</li>
        <li><b>התאמה אישית:</b> FutureGen שומרת לעצמה את הזכות להפסיק את השתתפותו של תלמיד במידה והתוכנית אינה מתאימה לו, וזאת תוך מתן החזר כספי יחסי על התקופה שלא נוצלה.</li>
        <li><b>חגים ומועדים:</b> עקב חגים ומועדים עשויים להתבטל חלק ממפגשי האקדמיה לאורך השנה. האקדמיה תעשה את המיטב על מנת לספק מפגש בכל שבוע, אך בשל מועדים וחגים עשויים להתבטל מפגשים. על מפגשים שבוטלו עקב חגים ומועדים לא יינתן זיכוי או שינוי במחיר החודשי ששולם.</li>
      </ul>'''

AGES = ''.join('<option value="%d">%d</option>' % (n, n) for n in range(10, 17))

body = f'''  <div class="container doc-wrap reg">
    <ol class="reg-steps" aria-label="שלבי ההרשמה">
      <li class="is-done">בחירת מסלול</li>
      <li class="is-current" aria-current="step">קריאה וחתימה</li>
      <li>תשלום מאובטח</li>
    </ol>
    <h1>הרשמה לתוכנית</h1>
    <p>לפני התשלום קוראים את מסמך הגילוי הנאות וההסכם, ממלאים פרטים וחותמים. עותק חתום של ההסכם יישלח אליכם במייל, ומיד אחר כך תעברו לעמוד התשלום המאובטח של Grow.</p>
    <p class="doc-meta" lang="en" dir="ltr">Registration: the agreement below is in Hebrew. Read it, fill in your details and sign; a signed copy is emailed to you, and then you go on to the secure payment page.</p>

    <noscript><p class="reg-alert">כדי לחתום באתר צריך JavaScript. אפשר גם להירשם בטלפון <a href="tel:+972525281662" dir="ltr">052-5281662</a> או במייל <a href="mailto:fgacademy.il@gmail.com" dir="ltr">fgacademy.il@gmail.com</a>.</p></noscript>

    <fieldset class="reg-plans">
      <legend>המסלול שבחרתם</legend>
      <label class="reg-plan"><input type="radio" name="plan" value="yearly" checked> <span><b>מסלול שנתי</b> · 300 ₪ לחודש, בהתחייבות לשנת הלימודים</span></label>
      <label class="reg-plan"><input type="radio" name="plan" value="monthly"> <span><b>מסלול חודשי</b> · 350 ₪ לחודש, בלי התחייבות</span></label>
    </fieldset>

    <article class="agree-doc" id="agreement" data-version="{VERSION}">
      {AGREEMENT}
    </article>

    <form class="contact-form reg-form" id="signForm" novalidate>
      <p class="hp-field" aria-hidden="true">
        <label>אל תמלאו שדה זה <input name="company" tabindex="-1" autocomplete="off"></label>
      </p>
      <h2>פרטי ההורה</h2>
      <div class="field">
        <label for="rName">שם מלא</label>
        <input id="rName" name="parent_name" type="text" required autocomplete="name" aria-describedby="err-rName">
        <small class="err" id="err-rName" data-err="rName"></small>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="rId">מספר תעודת זהות</label>
          <input id="rId" name="parent_id" type="text" required inputmode="numeric" maxlength="9" autocomplete="off" dir="ltr" aria-describedby="err-rId">
          <small class="err" id="err-rId" data-err="rId"></small>
        </div>
        <div class="field">
          <label for="rPhone">טלפון</label>
          <input id="rPhone" name="phone" type="tel" required inputmode="tel" autocomplete="tel" dir="ltr" aria-describedby="err-rPhone">
          <small class="err" id="err-rPhone" data-err="rPhone"></small>
        </div>
      </div>
      <div class="field">
        <label for="rEmail">אימייל</label>
        <input id="rEmail" name="email" type="email" required autocomplete="email" dir="ltr" aria-describedby="hint-rEmail err-rEmail">
        <small class="field-hint" id="hint-rEmail">לכתובת הזו יישלח עותק ההסכם החתום.</small>
        <small class="err" id="err-rEmail" data-err="rEmail"></small>
      </div>

      <h2>פרטי התלמיד/ה</h2>
      <div class="field-row">
        <div class="field">
          <label for="rStudent">שם מלא</label>
          <input id="rStudent" name="student_name" type="text" required autocomplete="off" aria-describedby="err-rStudent">
          <small class="err" id="err-rStudent" data-err="rStudent"></small>
        </div>
        <div class="field">
          <label for="rAge">גיל</label>
          <select id="rAge" name="student_age" required aria-describedby="err-rAge"><option value="">בחרו גיל</option>{AGES}</select>
          <small class="err" id="err-rAge" data-err="rAge"></small>
        </div>
      </div>

      <h2>אישור וחתימה</h2>
      <div class="field">
        <label class="check"><input id="rAgree" name="agree" type="checkbox" required aria-describedby="err-rAgree"> <span>קראתי והבנתי את תנאי מסמך הגילוי הנאות ואני מאשר/ת את הרשמת ילדי לתוכנית.</span></label>
        <small class="err" id="err-rAgree" data-err="rAgree"></small>
      </div>
      <div class="field">
        <span class="sig-label" id="sigLabel">חתימה</span>
        <div class="sig-box">
          <canvas id="sigPad" role="img" aria-labelledby="sigLabel" aria-describedby="hint-sig"></canvas>
          <button type="button" class="sig-clear" id="sigClear">ניקוי</button>
        </div>
        <small class="field-hint" id="hint-sig">חתמו בתוך המסגרת, באצבע או בעכבר.</small>
        <label class="check sig-typed"><input id="rTyped" name="typed" type="checkbox"> <span>לא נוח לי לחתום בציור: השם המלא שהקלדתי למעלה הוא החתימה שלי.</span></label>
        <small class="err" id="err-sig" data-err="sig"></small>
      </div>

      <button class="btn btn-accent btn-lg btn-block" type="submit" id="signSubmit">חתימה ומעבר לתשלום</button>
      <p class="form-note">ההסכם החתום נשמר אצל FutureGen Academy, יחד עם הפרטים שמילאתם, מועד החתימה וסוג הדפדפן, ועותק שלו נשלח אליכם במייל. כל השדות נדרשים כדי לרשום את הילד/ה ולתעד את ההסכם. עוד על המידע והזכויות שלכם: <a href="privacy.html">מדיניות הפרטיות</a>.</p>
      <div class="reg-status" id="regStatus" role="status" aria-live="polite" hidden></div>
    </form>
  </div>'''

io.open('register.html', 'w', encoding='utf-8').write(
    page('הרשמה וחתימה על ההסכם — FutureGen Academy',
         'הרשמה ל-FutureGen Academy: מסמך גילוי נאות והסכם התקשרות, חתימה ומעבר לתשלום.',
         'register.html', body, noindex=True,
         extra_js='<script src="assets/js/data.js?v=4"></script>\n<script src="assets/js/register.js?v=4" defer></script>\n'))
print('register.html written (agreement version %s)' % VERSION)
