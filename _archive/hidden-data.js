/* ============================================================
   Archived content of the sections hidden in September 2026
   (learning formats, gamification, mentors, comparison table,
   articles). Kept out of the public files on purpose:
   the mentors and the gamified "personal area" were placeholders,
   not real people or features. Restore a block into
   assets/js/data.js only once it is true.
   This folder is blocked from the public (_redirects).
   ============================================================ */

window.LEARNING = [
  { emoji:"🎬", he:{ t:"הדגמת מאסטר בלייב", d:"15–20 דקות ראשונות: פתיח שמעורר עניין, הצגת הכלי על המסך והדגמה חיה של הפיצ׳רים והטכניקות." },
    en:{ t:"A live master demo", d:"The first 15-20 minutes: an opener that sparks interest, the tool on the big screen, and a live walkthrough of its features and techniques." } },
  { emoji:"⏱️", he:{ t:"ספרינט יצירה — ״רוצו על זה״", d:"40–45 דקות של עבודה עצמאית עם אתגר מוגדר ושעון עצר, ביחידים או בצוותים קטנים, עד לתוצר מוחשי." },
    en:{ t:"A creation sprint — \"run with it\"", d:"40-45 minutes of independent work against a defined challenge and a stopwatch, solo or in small teams, ending in something tangible." } },
  { emoji:"📣", he:{ t:"Show & Tell וסיכום", d:"עשר דקות של שיתוף תוצרים מהיר ומשוב — כל מפגש נגמר במשהו שאפשר להראות." },
    en:{ t:"Show & tell and wrap-up", d:"Ten minutes of fast sharing and feedback — every session ends with something you can show." } },
  { emoji:"🔑", he:{ t:"הרשמה בלחיצה אחת", d:"כל הכלים תומכים בהתחברות ישירה עם חשבון Google של התלמיד. בלי טפסים ובלי כרטיס אשראי." },
    en:{ t:"One-click sign-up", d:"Every tool supports signing in directly with the student's Google account. No forms and no credit card." } },
  { emoji:"🤝", he:{ t:"רשת ביטחון צוותית", d:"עובדים בזוגות או בשלשות, ואם לאחד נגמרת מכסת הקרדיטים ב-AI — הצוות ממשיך דרך חשבון השותף." },
    en:{ t:"A team safety net", d:"Students work in pairs or threes, so if one runs out of AI credits the team keeps going on a partner's account." } },
  { emoji:"🏆", he:{ t:"שני אירועי שיא בשנה", d:"Creators Summit בסוף סמסטר א׳, ו-Shark Tank בסוף השנה — שניהם מול קהל של הורים ואורחים." },
    en:{ t:"Two showcase events a year", d:"A Creators Summit at the end of semester one and a Shark Tank at the end of the year — both in front of parents and guests." } }
];

window.GAME = [
  { emoji:"🎯", he:{ t:"נקודות XP ורמות", d:"כל משימה שמסתיימת מוסיפה נקודות ומעלה את האווטאר רמה." },
    en:{ t:"XP and levels", d:"Every finished task adds points and levels up the avatar." } },
  { emoji:"🪙", he:{ t:"מטבעות FutureGen", d:"נצברים על אתגר שבועי, על נוכחות ועל עזרה לחבר/ה בקבוצה." },
    en:{ t:"FutureGen coins", d:"Earned from the weekly challenge, attendance and helping a groupmate." } },
  { emoji:"🏅", he:{ t:"לוח מובילים קבוצתי", d:"תחרות ידידותית בתוך הקבוצה בלבד, שמתאפסת בתחילת כל חודש." },
    en:{ t:"Group leaderboard", d:"A friendly contest inside the group only, reset at the start of each month." } },
  { emoji:"🎁", he:{ t:"חנות פרסים", d:"ממירים מטבעות בציוד גיימינג, בקרדיטים לכלי AI ובמרצ׳ של האקדמיה." },
    en:{ t:"Prize shop", d:"Swap coins for gaming gear, AI-tool credits and academy merch." } }
];

window.CHALLENGES = [
  { done:true,  coins:40, he:"לייצר גיליון דמות ב-3 זוויות", en:"Generate a 3-angle character sheet" },
  { done:true,  coins:25, he:"לסנכרן את הטריילר לקצב המוזיקה", en:"Sync the trailer to the music's beat" },
  { done:false, coins:60, he:"לעזור לחבר/ה בקבוצה לתקן באג", en:"Help a groupmate squash a bug" }
];

window.MENTORS = [
  { emoji:"👩‍💻", color:"#EDE8FF", he:{ n:"יעל ברק", r:"AI Creative Director", c:"מלמדת AI ויזואלי, קומיקס וסטוריבורד", b:"שש שנים בעיצוב מוצר דיגיטלי, ומנחה סדנאות AI לנוער מאז 2021." },
    en:{ n:"Yael Barak", r:"AI Creative Director", c:"Teaches visual AI, comics and storyboarding", b:"Six years in digital product design, running AI workshops for teens since 2021." } },
  { emoji:"🎬", color:"#D7F5F9", he:{ n:"עומר לוי", r:"Video Producer", c:"מלמד וידאו AI, סאונד ועריכה", b:"עורך ומפיק תוכן, בונה קמפיינים לרשתות ומתרגם שפה קולנועית לבני 13." },
    en:{ n:"Omer Levi", r:"Video Producer", c:"Teaches AI video, sound and editing", b:"Editor and content producer, builds social campaigns and translates film language for 13-year-olds." } },
  { emoji:"🎮", color:"#FFE9C7", he:{ n:"דנה אבישר", r:"Game Developer", c:"מלמדת פיתוח משחקים ו-Level Design", b:"פיתחה שני משחקי אינדי שיצאו לחנות, ומאמינה שמשחק זה התירוץ הכי טוב ללמוד לוגיקה." },
    en:{ n:"Dana Avishar", r:"Game Developer", c:"Teaches game development and level design", b:"Shipped two indie games, and thinks games are the best excuse to learn logic." } },
  { emoji:"💰", color:"#E7FBD8", he:{ n:"מוחמד ותד", r:"Financial Educator", c:"מלמד אוריינות פיננסית ויזמות", b:"יועץ פיננסי ויזם, מלמד נוער מה באמת קורה בתלוש השכר ובחיסכון הפנסיוני." },
    en:{ n:"Mohammad Watad", r:"Financial Educator", c:"Teaches financial literacy and entrepreneurship", b:"Financial adviser and founder, teaching teens what really happens on a payslip and in a pension." } }
];

window.COMPARE = [
  { he:"קבוצה קטנה עם מנטור צמוד", en:"A small group with a dedicated mentor", us:"yes", club:"partial", self:"no" },
  { he:"סילבוס בנוי ל-28 מפגשים", en:"A syllabus built across 28 sessions", us:"yes", club:"partial", self:"no" },
  { he:"תוצר מוגמר שעולה לאוויר", en:"A finished product that ships", us:"yes", club:"no", self:"partial" },
  { he:"אוריינות פיננסית מעשית", en:"Practical financial literacy", us:"yes", club:"no", self:"no" },
  { he:"מפגשים מוקלטים להשלמה", en:"Recorded sessions to catch up", us:"yes", club:"no", self:"yes" },
  { he:"שני אירועי שיא מול קהל", en:"Two showcase events in front of an audience", us:"yes", club:"partial", self:"no" },
  { he:"בלי התחייבות שנתית", en:"No annual commitment", us:"yes", club:"no", self:"yes" }
];

window.POSTS = [
  { emoji:"📱", min:6, he:{ t:"כמה שעות מסך זה באמת יותר מדי?", d:"למה ההבחנה בין צריכה ליצירה חשובה יותר מהשעון, ואיך מודדים את זה בבית." },
    en:{ t:"How much screen time is actually too much?", d:"Why consuming versus creating matters more than the clock, and how to measure it at home." } },
  { emoji:"🧭", min:5, he:{ t:"10–12 או 13–16: איך בוחרים קבוצה", d:"מה באמת ההבדל בין שתי הקבוצות, ומה עושים כשהילד/ה על התפר בין השתיים." },
    en:{ t:"10–12 or 13–16: choosing a group", d:"What actually separates the two tracks, and what to do when your kid sits right on the line." } },
  { emoji:"🤖", min:7, he:{ t:"AI בשיעורי הבית: לאסור או ללמד?", d:"מה קורה כשאוסרים, מה קורה כשמלמדים, ואיך נראה גבול שאפשר לאכוף באמת." },
    en:{ t:"AI and homework: ban it or teach it?", d:"What happens when you ban it, what happens when you teach it, and where an enforceable line sits." } }
];

/* Translation keys those sections used (Hebrew first, then English). */
window.ARCHIVED_I18N = [
  "nav.about": "למה אנחנו",
  "nav.about": "Why us",
  "nav.home": "דף הבית",
  "nav.home": "Home",
  "page.back": "חזרה לדף הבית",
  "page.back": "Back to home",
  "learn.title": "ככה נראית הלמידה",
  "learn.title": "What learning looks like",
  "learn.sub": "בלי הרצאות של שעה ובלי שיעורי בית ששוכחים. ככה עובד שבוע אצלנו.",
  "learn.sub": "No hour-long lectures and no forgettable homework. Here is how a week works.",
  "game.title": "הפלטפורמה שמאחורי הקלעים",
  "game.title": "The platform behind the scenes",
  "game.sub": "כל תלמיד/ה מקבל/ת אזור אישי עם אווטאר שמתפתח, אתגרים שבועיים וחנות פרסים אמיתית.",
  "game.sub": "Every student gets a personal area with an evolving avatar, weekly challenges and a real prize shop.",
  "game.note": "וגם: אזור נפרד להורים, עם נוכחות, התקדמות וקישור ישיר לכל התוצרים של הילד/ה.",
  "game.note": "And: a separate parent area with attendance, progress and a direct link to everything your kid has made.",
  "game.level": "רמה 7",
  "game.level": "Level 7",
  "game.xp": "נקודות XP",
  "game.xp": "XP points",
  "game.coins": "מטבעות",
  "game.coins": "coins",
  "game.streak": "רצף שבועות",
  "game.streak": "week streak",
  "mentors.title": "מי מלמד",
  "mentors.title": "Who teaches",
  "mentors.sub": "אנשי מקצוע פעילים שעברו הכשרה להוראת נוער. לא סטודנטים שנשלחו למלא שעות.",
  "mentors.sub": "Working professionals trained to teach teenagers. Not students sent to fill hours.",
  "mentors.teaches": "מלמד/ת",
  "mentors.teaches": "Teaches",
  "compare.title": "ואיך זה מול האלטרנטיבות?",
  "compare.title": "How does it compare?",
  "compare.sub": "השוואה כנה, כולל המקומות שבהם אלטרנטיבה אחרת עשויה להספיק לכם.",
  "compare.sub": "An honest comparison, including where another option might be enough for you.",
  "compare.us": "FutureGen",
  "compare.us": "FutureGen",
  "compare.club": "חוג טכנולוגי רגיל",
  "compare.club": "A regular tech club",
  "compare.self": "לימוד עצמי מיוטיוב",
  "compare.self": "Self-teaching on YouTube",
  "compare.what": "מה משווים",
  "compare.what": "What we compare",
  "compare.yes": "יש",
  "compare.yes": "Yes",
  "compare.no": "אין",
  "compare.no": "No",
  "compare.partial": "תלוי",
  "compare.partial": "Depends",
  "posts.title": "משאבים להורים",
  "posts.title": "Resources for parents",
  "posts.sub": "מה שאנחנו נשאלים הכי הרבה בשיחות עם הורים, כתוב בצורה מסודרת.",
  "posts.sub": "The questions we get asked most in conversations with parents, written down properly.",
  "posts.min": "{n} דק׳ קריאה",
  "posts.min": "{n} min read",
  "posts.cta": "לקריאה",
  "posts.cta": "Read",
  "tst.title": "מה אומרים אצלנו",
  "tst.title": "What people say",
  "tst.q1": "״נועה בת 11 ובנתה קומיקס שלם עם דמות שנשארת אותה דמות בכל עמוד. היא הסבירה לי מה זה Inpainting. אני עדיין מעכלת.״",
  "tst.q1": "“Noa is 11 and built a whole comic with a character that stays the same on every page. She explained inpainting to me. I'm still processing.”",
  "tst.a1": "מיכל, אמא לנועה",
  "tst.a1": "Michal, Noa's mum",
  "tst.r1": "קבוצת 10–12",
  "tst.r1": "10–12 group",
  "tst.q2": "״הגעתי בלי לדעת כלום, ואחרי סמסטר בניתי משחק שחברים שלי משחקים בו מהטלפון. ובדרך גם הבנתי סוף סוף מה זה נטו.״",
  "tst.q2": "“I came in knowing nothing, and after one semester I'd built a game my friends play on their phones. Along the way I finally understood what net pay means.”",
  "tst.a2": "ליה, בת 15",
  "tst.a2": "Lia, 15",
  "tst.r2": "קבוצת 13–16",
  "tst.r2": "13–16 group",
  "tst.q3": "״הכי אהבתי שהמנטור לא נתן לנו תשובות. הוא נתן רמזים עד שהבנו לבד. ככה זה נשאר בראש.״",
  "tst.q3": "“What I liked most is that the mentor never gave us answers. He gave hints until we figured it out. That's how it sticks.”",
  "tst.a3": "איתי, בן 13",
  "tst.a3": "Itai, 13",
  "tst.r3": "קבוצת 13–16",
  "tst.r3": "13–16 group",
  "footer.projects": "תוצרי תלמידים",
  "footer.projects": "Student work",
];

/* ============================================================
   Wording removed on 1 October 2026 because it was never confirmed
   (see README, "תיקונים אחרי המעבר המעמיק"). Bring back only what is true.
   ============================================================ */
window.ARCHIVED_FAQS_BEFORE_OCT_2026 = [
  { he:{ q:"מה ההבדל בין קבוצת 10–12 לקבוצת 13–16?", a:"מסלול היצירה זהה בשתי הקבוצות: אותם 28 מפגשים, אותם כלים ואותם שני פרויקטים מסכמים. ההבדל הוא שבקבוצת הבוגרים נוספים בתוך המפגשים 5 מודולים של אוריינות פיננסית ויזמות — מודלים עסקיים, יחידת כלכלה, שכר ומיסים בישראל, ניהול כסף אישי וריבית דריבית, ודו״ח פיננסי למשקיע. בנוסף, ההסברים והדוגמאות בקבוצה הבוגרת מותאמים לגיל ומעמיקים יותר." },
    en:{ q:"What's the difference between the 10–12 and 13–16 groups?", a:"The creative track is identical: the same 28 sessions, the same tools and the same two final projects. The difference is that the senior group gets 5 additional financial-literacy and entrepreneurship modules woven into those sessions — business models, unit economics, salary and tax in Israel, personal money and compound interest, and an investor financial report. The explanations and examples also run deeper for the older group." } },
  { he:{ q:"צריך ידע קודם בתכנות או בעיצוב?", a:"לא. התוכנית מתחילה מאפס לגמרי — המפגש הראשון הוא הפעם הראשונה שרוב התלמידים כותבים פרומפט מקצועי, וסמסטר ב׳ הוא הפעם הראשונה שהם בונים מיזם אמיתי. הכול נבנה בהדרגה." },
    en:{ q:"Is prior coding or design experience needed?", a:"No. The programme starts from absolute zero — the first session is the first time most students write a professional prompt, and semester 2 is the first time they touch a game engine. Everything is built up gradually." } },
  { he:{ q:"כמה זה עולה בכלים ובתוכנות?", a:"אפס. כל הכלים בתוכנית נבחרו במפורש כי יש להם גרסה חינמית שמספיקה לחלוטין: Ideogram, D-ID, Suno, Gamma, Luma, CapCut, Canva, Perplexity, Make.com ו-Google Sheets. אין צורך ברישיונות, במנויים או בחומרה מיוחדת מעבר למחשב." },
    en:{ q:"What do the tools and software cost?", a:"Nothing. Every tool in the programme was chosen specifically because its free tier is genuinely enough: Ideogram, D-ID, Suno, Gamma, Luma, CapCut, Canva, Perplexity, Make.com and Google Sheets. No licences, no subscriptions and no special hardware beyond a computer." } },
  { he:{ q:"איזה ציוד צריך בבית?", a:"מחשב נייד או נייח עם חיבור לאינטרנט, אוזניות ומיקרופון. מצלמה רצויה אבל לא חובה. חלק מהכלים דורשים דפדפן עדכני — זה הכול." },
    en:{ q:"What equipment is needed at home?", a:"A laptop or desktop with an internet connection, headphones and a microphone. A webcam is nice but not required. Some tools need an up-to-date browser — that's it." } },
  { he:{ q:"מה קורה אם פספסנו מפגש?", a:"כל מפגש מוקלט ועולה לאזור האישי תוך 24 שעות, יחד עם המצגת והקבצים. אם התלמיד/ה פספס/ה משהו מהותי, המנטור משלים בעשר הדקות הראשונות של המפגש הבא." },
    en:{ q:"What if we miss a session?", a:"Every session is recorded and posted to your personal area within 24 hours, along with slides and files. If something important was missed, the mentor catches the student up in the first ten minutes of the next session." } },
  { he:{ q:"כמה תלמידים יש בכל קבוצה?", a:"עד 15 תלמידים. זה המספר שמאפשר למנטור לעבור על התוצר של כל אחד בכל מפגש — ובתוכנית שבה כל מפגש מסתיים בתוצר, זה קריטי." },
    en:{ q:"How many students per group?", a:"Up to 12. That's the number that lets a mentor review everyone's work every session — and in a programme where every session ends with something made, that matters." } },
  { he:{ q:"האם יש תעודה בסיום?", a:"כן. בסוף השנה, באירוע ״FutureGen Shark Tank״, כל תלמיד/ה מקבל/ת תעודת גמר. בקבוצת הבוגרים התעודה היא ״FutureGen Pro: יוצרי טכנולוגיה ואוריינות פיננסית״, יחד עם תיק עבודות דיגיטלי שכולל את הפרסומת, דף הנחיתה והמצגת העסקית." },
    en:{ q:"Is there a certificate?", a:"Yes. At the Big Arcade event at the end of the year every student receives a completion certificate. The senior group's certificate is \"FutureGen Pro: technology creators and financial literacy\", alongside a digital portfolio holding the film, the game and the trailer." } },
  { he:{ q:"יש הנחה לאחים?", a:"כן. מהילד/ה השני/ה במשפחה ההנחה היא 15% על כל מנוי פעיל, והיא נשמרת כל עוד שניהם רשומים. משאירים פרטים בטופס וניצור קשר עם הפירוט." },
    en:{ q:"Is there a sibling discount?", a:"Yes. From the second child in a family it's 15% off every active subscription, kept for as long as both are enrolled. Leave your details and we'll send the breakdown." } },
  { he:{ q:"אפשר לבטל באמצע?", a:"תלוי במסלול התשלום. בתשלום החודשי (₪350) אפשר לבטל בכל חודש, בלי קנסות — משלמים על החודש שהתחיל ומפסיקים. במנוי השנתי (₪300 לחודש) יש התחייבות ל-12 חודשים, בתמורה למחיר הנמוך יותר." },
    en:{ q:"Can we cancel mid-year?", a:"It depends on how you pay. On the monthly option (₪350) you can cancel month to month with no penalty — you pay for the month that started and stop. The annual subscription (₪300 a month) carries a 12-month commitment in exchange for the lower price." } },
  { he:{ q:"מה ההסמכה של המנטורים?", a:"כל המנטורים הם אנשי מקצוע פעילים — יוצרי תוכן, אנשי AI ואנשי פיננסים — שעברו הכשרה פנימית להוראת נוער וליווי צמוד בשלושת החודשים הראשונים. אם הכימיה עם מנטור לא עובדת, מעבירים לקבוצה אחרת בלי דרמה." },
    en:{ q:"What are the mentors' credentials?", a:"All our mentors are working professionals — content creators, AI practitioners and finance people — who go through internal training for teaching teens plus close supervision in their first three months. If the chemistry with a mentor isn't working, we move the student to another group, no drama." } },
  { he:{ q:"מה עם חגים וחופשות?", a:"בשנה יש 52 שבועות ואנחנו מתחייבים ל-28 מפגשים לאורך שנת הפעילות, בממוצע כשלושה בחודש. לוח המפגשים השנתי מפורסם מראש בתחילת השנה, כולל השבועות שנופלים בחגים." },
    en:{ q:"What about holidays and vacations?", a:"There are 52 weeks in a year and we commit to 28 sessions across the programme year, roughly three a month. The full calendar is published in advance at the start of the year, including the weeks that fall on holidays." } }
];

window.ARCHIVED_PRICING_BEFORE_OCT_2026 = {
  monthly: 350,
  yearly: 300,
  commitMonths: 12,
  he:{ f:[
    "מפגש שבועי חי בקבוצה של עד 15 תלמידים",
    "כל 28 המפגשים לאורך שנת הלימודים",
    "הקלטות, מצגות וקבצי הקוד באזור האישי",
    "קהילת דיסקורד סגורה ואתגר שבועי",
    "ליווי אישי לפרויקט המסכם",
    "שני אירועי שיא מול קהל של הורים ואורחים",
    "כל הכלים בגרסה חינמית — בלי עלות נוספת",
    "דוח התקדמות להורים"
  ]},
  en:{ f:[
    "One live weekly session in a group of up to 15 students",
    "All 28 sessions across the school year",
    "Recordings, slides and code files in your personal area",
    "A closed Discord community and a weekly challenge",
    "Personal guidance on the final project",
    "Two showcase events in front of parents and guests",
    "Every tool on its free tier — no extra cost",
    "A progress report for parents"
  ]}
};

window.ARCHIVED_COPY_BEFORE_OCT_2026 = [
  "plans.guaranteeB": "בתשלום החודשי אפשר להקפיא או לבטל בכל חודש, בלי דמי ביטול. המנוי השנתי זול יותר בתמורה להתחייבות ל-12 חודשים.",
  "plans.guaranteeB": "On the monthly option you can freeze or cancel any month with no cancellation fee. The annual subscription is cheaper in exchange for a 12-month commitment.",
  "contact.sub": "משאירים פרטים, ויועץ לימודים חוזר אליכם תוך יום עסקים אחד עם המלצה לקבוצה שמתאימה לגיל ולרמה.",
  "contact.sub": "Leave your details and an academic advisor will get back to you within one business day with the group that fits the age and level.",
  "form.consent": "אני מאשר/ת קבלת מידע על התוכנית ומועדי פתיחה.",
  "form.consent": "I agree to receive information about the programme and start dates.",
  "form.email": "אימייל",
  "form.email": "Email",
  "form.ageAny": "עדיין לא בטוח/ה",
  "form.ageAny": "Not sure yet",
];
