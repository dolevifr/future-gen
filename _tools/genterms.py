# -*- coding: utf-8 -*-
import sys, io, os
# Run from anywhere:  python3 _tools/genterms.py
# Writes the page into the project root, next to index.html.
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(os.path.dirname(HERE))
from shell import page

HE = '''
    <h1 id="he">תנאי שימוש</h1>
    <p class="doc-meta">עודכנו לאחרונה: 8 באוקטובר 2026</p>
    <p class="doc-switch"><a href="#en" lang="en">English version below</a></p>

    <p>האתר future-gen.co.il מופעל על ידי FutureGen Academy (״FutureGen״, ״אנחנו״). השימוש באתר ובשירותים המוצעים בו כפוף לתנאים אלה. הם מנוסחים בלשון רבים ופונים לכל המגדרים.</p>

    <nav class="doc-toc" aria-labelledby="toc-he">
      <b id="toc-he">תוכן העניינים</b>
      <ol>
        <li><a href="#t-program">התוכנית</a></li>
        <li><a href="#t-price">מחירים ותשלום</a></li>
        <li><a href="#t-cancel">ביטול</a></li>
        <li><a href="#t-sessions">השתתפות במפגשים וכלים חיצוניים</a></li>
        <li><a href="#t-work">תוצרי התלמידים</a></li>
        <li><a href="#t-ip">קניין רוחני</a></li>
        <li><a href="#t-liability">אחריות</a></li>
        <li><a href="#t-law">דין, פרטיות ויצירת קשר</a></li>
      </ol>
    </nav>

    <h2 id="t-program">1. התוכנית</h2>
    <p>FutureGen מפעילה תוכנית שנתית אונליין בבינה מלאכותית, יזמות ואוריינות פיננסית, בשתי קבוצות גיל: 10&lrm;–&#8288;&lrm;12 ו-13&lrm;–&#8288;&lrm;16. המידע באתר — לרבות הסילבוס, הכלים ולוח המפגשים — הוא תיאור כללי של התוכנית. אנחנו עשויים לעדכן תכנים, כלים וסדר מפגשים כדי לשמור על התוכנית רלוונטית, בלי לפגוע בהיקף ובמהות שלה.</p>

    <h2 id="t-price">2. מחירים ותשלום</h2>
    <ul>
      <li><b>תשלום חודשי:</b> ₪350 לחודש, ללא התחייבות.</li>
      <li><b>מנוי שנתי:</b> ₪300 לחודש, בהתחייבות לשני סמסטרים.</li>
    </ul>
    <p>המחירים נקובים בשקלים חדשים. לפני התשלום חותמים באתר על <a href="register.html">מסמך גילוי נאות והסכם התקשרות</a>, ועותק שלו נשלח אליכם במייל. התשלום הוא בהוראת קבע חודשית, בעמוד התשלום המאובטח של ספק הסליקה Grow; פרטי התשלום מוזנים אצלו בלבד ואינם נשמרים אצלנו.</p>

    <h2 id="t-cancel">3. ביטול</h2>
    <ul>
      <li><b>בתשלום החודשי</b> אפשר לבטל בכל עת, בלי דמי ביטול. הביטול נכנס לתוקף בתוך 3 ימי עסקים מקבלת ההודעה, החיובים נעצרים, ומשלמים רק עד שהביטול נכנס לתוקף.</li>
      <li><b>במנוי השנתי</b> המחיר המוזל ניתן בתמורה להתחייבות לשנת הלימודים. בביטול מוקדם משלמים על החודשים שבהם התלמיד/ה השתתף/ה עד שהביטול נכנס לתוקף, ודמי ביטול של 5% מיתרת העסקה או 100 ₪, הנמוך מביניהם.</li>
    </ul>
    <p>בכל מקרה עומדות לכם הזכויות לפי חוק הגנת הצרכן, התשמ״א-1981, ותקנות הגנת הצרכן (ביטול עסקה), התשע״א-2010 — ובכלל זה זכות ביטול בעסקה מרחוק, בתנאים ובמועדים שקובע החוק. הודעת ביטול אפשר למסור ב<a href="cancel.html">טופס ביטול העסקה</a> באתר, או בדוא״ל, בטלפון או בוואטסאפ, לפרטים שבסעיף 8. בהודעה צריך לציין את השם המלא ואת מספר תעודת הזהות של מי שביצע את העסקה.</p>

    <h2 id="t-sessions">4. השתתפות במפגשים וכלים חיצוניים</h2>
    <p>המפגשים מתקיימים אונליין ודורשים מחשב, חיבור לאינטרנט, אוזניות ומיקרופון. במהלך התוכנית משתמשים בפלטפורמות ובכלים של צדדים שלישיים — כמו פלטפורמת המפגשים וכלי בינה מלאכותית. השימוש בהם כפוף לתנאים של אותם צדדים, <b>לרבות מגבלות גיל</b>, והמסלולים החינמיים שלהם עשויים להשתנות. ההורה אחראי לאשר את השימוש בהם עבור ילדו/ה.</p>
    <p>אנחנו מבקשים לשמור על שיח מכבד בקבוצה. במקרה של התנהגות פוגענית, אנחנו רשאים להפסיק את השתתפותו של תלמיד/ה לאחר פנייה להורים.</p>

    <h2 id="t-work">5. תוצרי התלמידים</h2>
    <p>הזכויות בתוצרים שתלמידים יוצרים בתוכנית — מותגים, סרטונים, מצגות, אתרים ומשחקים — שייכות להם, בכפוף לתנאי הכלים שבהם נוצרו. נציג תוצרים של תלמידים באתר, ברשתות או באירועי השיא <b>רק בהסכמת ההורים</b>.</p>

    <h2 id="t-ip">6. קניין רוחני</h2>
    <p>התכנים באתר ובתוכנית — טקסטים, סילבוס, מצגות, חומרי לימוד, עיצוב ולוגו — שייכים ל-FutureGen או לבעלי הזכויות בהם. אין להעתיק, להפיץ או לעשות בהם שימוש מסחרי ללא אישור בכתב.</p>

    <h2 id="t-liability">7. אחריות</h2>
    <p>אנחנו משקיעים כדי שהמידע באתר יהיה מדויק ועדכני, אבל ייתכנו בו טעויות. אנחנו מחויבים לתוכנית איכותית, אך איננו מתחייבים לתוצאה לימודית או מקצועית מסוימת. איננו אחראים לזמינות, לתנאים או לתוכן של אתרים ושירותים של צדדים שלישיים שאליהם יש קישורים או שבהם משתמשים בתוכנית.</p>

    <h2 id="t-law">8. דין, פרטיות ויצירת קשר</h2>
    <p>על תנאים אלה חלים דיני מדינת ישראל, וסמכות השיפוט נתונה לבתי המשפט המוסמכים בישראל. השימוש במידע אישי מתואר ב<a href="privacy.html">מדיניות הפרטיות</a>, והנגשת האתר מתוארת ב<a href="accessibility.html">הצהרת הנגישות</a>. אנחנו עשויים לעדכן תנאים אלה; הנוסח המחייב הוא זה שמופיע בעמוד.</p>
    <p>יצירת קשר: <a href="mailto:fgacademy.il@gmail.com" dir="ltr">fgacademy.il@gmail.com</a> · <a href="tel:+972525281662" dir="ltr">052-5281662</a>.</p>
'''

EN = '''
  <section class="doc-en" lang="en" dir="ltr" aria-labelledby="en">
    <h2 id="en" class="doc-title">Terms of use</h2>
    <p class="doc-meta">Last updated: 8 October 2026 · <a href="#he" lang="he" dir="rtl">לנוסח העברי</a></p>
    <p>future-gen.co.il is operated by FutureGen Academy ("FutureGen", "we"). Use of the site and the services offered on it is subject to these terms. If the Hebrew and English versions differ, the Hebrew version prevails.</p>

    <h3>1. The programme</h3>
    <p>FutureGen runs a year-long online programme in AI, entrepreneurship and financial literacy, in two age groups: 10–12 and 13–16. The information on the site — including the syllabus, tools and session schedule — is a general description. We may update content, tools and session order to keep the programme relevant, without reducing its scope or substance.</p>

    <h3>2. Prices and payment</h3>
    <ul>
      <li><b>Monthly:</b> ₪350 a month, no commitment.</li>
      <li><b>Annual:</b> ₪300 a month, with a two-semester commitment.</li>
    </ul>
    <p>Prices are in Israeli new shekels. Before paying, you sign a <a href="register.html">disclosure document and engagement agreement</a> on the site, and a copy is emailed to you. Payment is by monthly standing order, on the secure payment page of our payment provider, Grow; payment details are entered with Grow only and are not stored by us.</p>

    <h3>3. Cancellation</h3>
    <p><b>Monthly:</b> cancel at any time with no cancellation fee. The cancellation takes effect within 3 business days of your notice, charges stop, and you pay only up to that point. <b>Annual:</b> the discounted price is given in exchange for a commitment to the school year; on early cancellation you pay for the months your child took part until the cancellation takes effect, plus a cancellation fee of 5% of the remaining balance or ₪100, whichever is lower. In all cases your rights under the Israeli Consumer Protection Law, 1981, and the Consumer Protection (Cancellation of Transaction) Regulations, 2010 apply, including the right to cancel a distance transaction on the terms the law sets. Notice of cancellation can be given through the <a href="cancel.html">cancellation form</a> on the site, or by email, phone or WhatsApp (see section 8); it should include the full name and ID number of the person who made the purchase.</p>

    <h3>4. Sessions and third-party tools</h3>
    <p>Sessions are online and require a computer, internet connection, headphones and a microphone. The programme uses third-party platforms and tools, such as the meeting platform and AI tools. Their use is subject to those parties' terms, <b>including age requirements</b>, and their free tiers may change. Parents are responsible for approving their use for their child. We ask for respectful conduct in the group; in the case of abusive behaviour we may end a student's participation after contacting the parents.</p>

    <h3>5. Students' work</h3>
    <p>Rights in the work students create in the programme — brands, videos, decks, websites and games — belong to them, subject to the terms of the tools used to create it. We will show students' work on the site, on social media or at showcase events <b>only with parental consent</b>.</p>

    <h3>6. Intellectual property</h3>
    <p>Content on the site and in the programme — text, syllabus, presentations, learning materials, design and logo — belongs to FutureGen or its rights holders, and may not be copied, distributed or used commercially without written permission.</p>

    <h3>7. Liability</h3>
    <p>We work to keep the site accurate and current, but it may contain errors. We are committed to a high-quality programme but do not promise a specific educational or professional outcome. We are not responsible for the availability, terms or content of third-party sites and services linked from the site or used in the programme.</p>

    <h3>8. Law, privacy and contact</h3>
    <p>These terms are governed by the laws of the State of Israel, and the competent courts in Israel have jurisdiction. Personal data is covered by our <a href="privacy.html">privacy policy</a>, and accessibility by our <a href="accessibility.html">accessibility statement</a>. We may update these terms; the version on this page applies. Contact: <a href="mailto:fgacademy.il@gmail.com">fgacademy.il@gmail.com</a> · <a href="tel:+972525281662">052-5281662</a>.</p>
  </section>
'''

body = '  <div class="container doc-wrap">' + HE + EN + '  </div>'
io.open('terms.html','w',encoding='utf-8').write(page(
    'תנאי שימוש — FutureGen Academy',
    'תנאי השימוש באתר ובתוכנית של FutureGen Academy: מחירים, תשלום, ביטול, השתתפות במפגשים וקניין רוחני.',
    'terms.html', body))
print('terms.html written')
