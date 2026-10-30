# -*- coding: utf-8 -*-
import sys, io, os
# Run from anywhere:  python3 _tools/gencancel.py
# Writes cancel.html (the cancellation form) and cancel-sent.html (where
# Netlify lands it) into the project root, next to index.html.
#
# Consumer Protection Law, section 14ט: a business that sells online must
# accept cancellation notices online, through a dedicated link on the home
# page (the footer link "ביטול עסקה"). A notice needs the consumer's name and
# ID number (14ט(ג)); everything else on the form is optional.
#
# The form posts to Netlify Forms as "cancel". leads.gs ignores every form
# but "lead", so these never reach the leads sheet.
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(os.path.dirname(HERE))
from shell import page

form_body = '''  <div class="container doc-wrap">
    <h1>ביטול עסקה</h1>
    <p>רוצים לבטל את ההרשמה או את הוראת הקבע? מלאו את הטופס ושלחו. צריך רק את השם המלא ואת מספר תעודת הזהות של מי שביצע את העסקה; אם תשאירו גם טלפון או אימייל, נוכל לחזור אליכם.</p>
    <p class="doc-meta" lang="en" dir="ltr">Cancel a transaction: the form below is in Hebrew and English. Only the full name and ID number of the person who made the purchase are required.</p>

    <form class="contact-form cancel-form" id="cancelForm" name="cancel" method="POST" data-netlify="true" netlify-honeypot="company" action="/cancel-sent.html">
      <input type="hidden" name="form-name" value="cancel">
      <p class="hp-field" aria-hidden="true">
        <label>אל תמלאו שדה זה <input name="company" tabindex="-1" autocomplete="off"></label>
      </p>
      <div class="field">
        <label for="cName">שם מלא של מי שביצע את העסקה <span class="lbl-en" lang="en" dir="ltr">Full name of the payer</span></label>
        <input id="cName" name="name" type="text" required minlength="2" autocomplete="name" aria-describedby="err-cName">
        <small class="err" id="err-cName" data-err="cName"></small>
      </div>
      <div class="field">
        <label for="cId">מספר תעודת זהות <span class="lbl-en" lang="en" dir="ltr">ID number</span></label>
        <input id="cId" name="id_number" type="text" required inputmode="numeric" pattern="[0-9]{5,9}" maxlength="9" autocomplete="off" dir="ltr" aria-describedby="err-cId">
        <small class="err" id="err-cId" data-err="cId"></small>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="cPhone">טלפון (רשות) <span class="lbl-en" lang="en" dir="ltr">Phone (optional)</span></label>
          <input id="cPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr">
        </div>
        <div class="field">
          <label for="cEmail">אימייל (רשות) <span class="lbl-en" lang="en" dir="ltr">Email (optional)</span></label>
          <input id="cEmail" name="email" type="email" autocomplete="email" dir="ltr" aria-describedby="err-cEmail">
          <small class="err" id="err-cEmail" data-err="cEmail"></small>
        </div>
      </div>
      <div class="field">
        <label for="cPlan">מסלול (רשות) <span class="lbl-en" lang="en" dir="ltr">Plan (optional)</span></label>
        <select id="cPlan" name="plan">
          <option value="">בחרו מסלול · Choose a plan</option>
          <option value="תשלום חודשי">תשלום חודשי · Monthly</option>
          <option value="מנוי שנתי">מנוי שנתי · Annual</option>
          <option value="לא בטוח/ה">לא בטוח/ה · Not sure</option>
        </select>
      </div>
      <div class="field">
        <label for="cMsg">הערות (רשות) <span class="lbl-en" lang="en" dir="ltr">Notes (optional)</span></label>
        <textarea id="cMsg" name="message" rows="3" aria-describedby="hint-cMsg"></textarea>
        <small class="field-hint" id="hint-cMsg">למשל, אם תרצו שהביטול ייכנס לתוקף במועד מאוחר יותר.<span class="hint-en" lang="en" dir="ltr">For example, if you want the cancellation to take effect at a later date.</span></small>
      </div>
      <button class="btn btn-accent btn-lg btn-block" type="submit">שליחת הודעת ביטול · <span lang="en">Send</span></button>
      <p class="form-note">הפרטים נשמרים אצל FutureGen Academy כדי לטפל בביטול ולתעד אותו. שם ומספר תעודת זהות הם הפרטים שחוק הגנת הצרכן מבקש בהודעת ביטול; שאר השדות רשות. עוד על המידע והזכויות שלכם: <a href="privacy.html">מדיניות הפרטיות</a>.</p>
    </form>

    <h2>דרכים נוספות לבטל</h2>
    <ul>
      <li>בטלפון: <a href="tel:+972525281662" dir="ltr">052-5281662</a></li>
      <li>בוואטסאפ: <a href="https://wa.me/972525281662" target="_blank" rel="noopener" dir="ltr">052-5281662</a></li>
      <li>באימייל: <a href="mailto:fgacademy.il@gmail.com" dir="ltr">fgacademy.il@gmail.com</a></li>
    </ul>
    <p>בכל דרך שתבחרו, ציינו בהודעה את השם המלא ואת מספר תעודת הזהות של מי שביצע את העסקה. תנאי הביטול מפורטים ב<a href="terms.html#t-cancel">סעיף 3 בתנאי השימוש</a>.</p>

    <section class="doc-en" lang="en" dir="ltr">
      <h2>Other ways to cancel</h2>
      <p>You can also cancel by phone or WhatsApp on <a href="tel:+972525281662">052-5281662</a>, or by email at <a href="mailto:fgacademy.il@gmail.com">fgacademy.il@gmail.com</a>. Whichever way you choose, include the full name and ID number of the person who made the purchase. The cancellation terms are in <a href="terms.html#t-cancel">section 3 of the terms</a>.</p>
    </section>
  </div>'''

sent_body = '''  <div class="container nf">
    <h1>הודעת הביטול נשלחה</h1>
    <p class="lead">קיבלנו את ההודעה, ונטפל בה לפי תנאי השימוש. אם השארתם טלפון או אימייל, נחזור אליכם לאישור.</p>
    <p>מועד השליחה נשמר אצלנו. אפשר גם לצלם את המסך הזה ולשמור אותו.</p>
    <p>שאלה? <a href="tel:+972525281662" dir="ltr">052-5281662</a> · <a href="mailto:fgacademy.il@gmail.com" dir="ltr">fgacademy.il@gmail.com</a></p>
    <div class="nf-actions">
      <a class="btn btn-primary btn-lg" href="index.html">חזרה לאתר</a>
    </div>
    <p lang="en" dir="ltr" class="muted">Your cancellation notice has been sent. We will handle it under our terms, and if you left a phone number or email, we will get back to you to confirm. The time you sent it is on record; you can also take a screenshot of this page.</p>
  </div>'''

io.open('cancel.html', 'w', encoding='utf-8').write(
    page('ביטול עסקה — FutureGen Academy',
         'טופס לשליחת הודעת ביטול עסקה ל-FutureGen Academy: ביטול הרשמה או הוראת קבע.',
         'cancel.html', form_body, noindex=True,
         extra_js='<script src="assets/js/cancel.js?v=4" defer></script>\n'))
print('cancel.html written')

io.open('cancel-sent.html', 'w', encoding='utf-8').write(
    page('הודעת הביטול נשלחה — FutureGen Academy',
         'הודעת הביטול התקבלה.',
         'cancel-sent.html', sent_body, noindex=True))
print('cancel-sent.html written')
