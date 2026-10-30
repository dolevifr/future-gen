/* ============================================================
   Content data — every record carries both languages so that
   switching language never refetches anything.
   ============================================================ */

/* thematic tags, used by projects and pillars */
window.CATEGORIES = [
  { id:"aivis", he:"AI ויזואלי",      en:"Visual AI",          emoji:"💫", color:"#EDE8FF", ink:"#4A2FD6" },
  { id:"sound", he:"סאונד ומוזיקה",   en:"Sound & music",      emoji:"🎧", color:"#FFE0E6", ink:"#B23350" },
  { id:"video", he:"וידאו ועריכה",    en:"Video & editing",    emoji:"🎬", color:"#D7F5F9", ink:"#0A6A75" },
  { id:"games", he:"פיתוח משחקים",    en:"Game development",   emoji:"🎮", color:"#FFE9C7", ink:"#7F5300" },
  { id:"money", he:"אוריינות פיננסית", en:"Financial literacy", emoji:"💰", color:"#E7FBD8", ink:"#3F7A16" },
  { id:"biz",   he:"יזמות ומוצר",     en:"Entrepreneurship",   emoji:"🚀", color:"#E4E9FF", ink:"#2E44B8" }
];

/* the two age tracks the whole site is organised around */
/* ============================================================
   Hero video.

   Leave `src` empty for the placeholder frame. To publish a video:
     • a file you host:  src: "assets/hero.mp4"  (optionally poster: "assets/hero-poster.jpg")
     • YouTube:          src: "https://www.youtube.com/embed/VIDEO_ID"
     • Vimeo:            src: "https://player.vimeo.com/video/VIDEO_ID"
   Nothing else needs to change. A new file of your own: run
   python3 _tools/genvideo.py "<video>" first (README, "סרטון ה-hero").
   ============================================================ */
window.HERO_VIDEO = { src: "assets/hero.mp4", poster: "assets/hero-poster.jpg" };

/* The date shown at the bottom of the accessibility statement. Update it
   whenever the statement or the site's accessibility is reviewed. */
window.STATEMENT_UPDATED = "2026-10-04";

window.TRACKS = [
  { id:"junior", min:10, max:12, meetings:28, emoji:"🧩", color:"#D7F5F9", ink:"#0A6A75",
    he:{ n:"צעירים", t:"גילאי 10–12", d:"סמסטר א׳ הוא סטודיו ליצירה עם AI — קומיקס, מיתוג, מצגות וסרטים — וסמסטר ב׳ עובר מפיתוח משחק ראשון להקמת סטארט-אפ." },
    en:{ n:"Juniors", t:"Ages 10–12", d:"Semester 1 is a creative AI studio — comics, branding, presentations and film; semester 2 goes from building a first game to founding a startup." } },

  { id:"senior", min:13, max:16, meetings:28, emoji:"🚀", color:"#EDE8FF", ink:"#4A2FD6",
    he:{ n:"בוגרים", t:"גילאי 13–16", d:"סמסטר א׳ הוא סטודיו מיתוג ותוכן ב-AI, וסמסטר ב׳ הוא מעבדת יזמות ופיננסים: ניהול מוצר, דף נחיתה, מודל עסקי, מיסים, שוק ההון וכסף אישי." },
    en:{ n:"Seniors", t:"Ages 13–16", d:"Semester 1 is a branding and content studio built on AI; semester 2 is an entrepreneurship and finance lab: product management, a landing page, a business model, tax, the stock market and personal money." } }
];

/* ============================================================
   The two syllabi, one per age track (the keys are TRACKS ids).
   Each has its own semesters, parts and 28 sessions; the syllabus
   page and the home page journey show the one for the chosen track.

   A session has `t` (title), `learn` (what is taught) and `act` (the
   hands-on activity), or a single `d` paragraph (showcase events and
   the hackathon sprints). `event:true` marks a showcase event; its
   `emoji` is its icon in the journey. `tools` (13–16) is kept in the
   data but not shown on the site.
   ============================================================ */
window.SYLLABI = {
  junior: {
    semesters: [
      { id:"a", emoji:"🎬", he:{ n:"סמסטר א׳", t:"סטודיו ליצירה עם בינה מלאכותית" },
        en:{ n:"Semester 1", t:"A creative AI studio" } },
      { id:"b", emoji:"🎮", he:{ n:"סמסטר ב׳", t:"מסטודיו לגיימינג ועד הקמת הסטארט-אפ הראשון" },
        en:{ n:"Semester 2", t:"From a gaming studio to a first startup" } }
    ],
    /* emoji: the part's icon in the home page journey (listed inside its semester) */
    parts: {
      a1:{ emoji:"✨", he:"AI ויזואלי — מפרומפט ראשון ועד מותג", en:"Visual AI — from a first prompt to a brand" },
      a2:{ emoji:"🎙️", he:"יצירת המוצר והמצגת המושלמת", en:"Making the product and the perfect presentation" },
      a3:{ emoji:"🎬", he:"אקשן! הופכים תמונות לסרטים", en:"Action! Turning pictures into films" },
      a4:{ emoji:"🏆", he:"הפרויקט המסכם — לקראת טקס האוסקר", en:"The final project — on the way to the Oscars" },
      b1:{ emoji:"🎮", he:"מה עושה משחק לכיף? עיצוב ולוגיקה", en:"What makes a game fun? Design and logic" },
      b2:{ emoji:"🧱", he:"בונים את העולם — שלבים ואויבים", en:"Building the world — levels and enemies" },
      b3:{ emoji:"💡", he:"בניית מוצר ושיווק — מיינדסט של יזמים", en:"Building and marketing a product — a founder's mindset" },
      b4:{ emoji:"🦈", he:"״הכרישים״ — הקמת המיזם והגיוס הגדול", en:"\"Shark Tank\" — founding the venture and the big raise" }
    },
    sessions: [
      { n:1, sem:"a", part:"a1",
        he:{ t:"מילים שעושות קסמים — מבוא ל-AI ופרומפטים",
             learn:"מהו פרומפט (Prompt)? היכרות מעמיקה עם עולם הבינה המלאכותית ולמידת ״נוסחת הקסם״ ת.מ.ח.ס — תפקיד, משימה, חוקים, סגנון. הילדים מבינים איך לתקשר עם מכונות ולתרגם את הדמיון שלהם לפקודות מדויקות שיוצרות תמונות מרהיבות תוך שניות, ממש כמו להזמין מנה מרובוט-שף.",
             act:"״קווסט סופר-פרומפט״: הילדים מתרגלים כתיבת פרומפטים מול שעון עצר ענק, כדי ליצור את גיבור העל שלהם ב-Bing Image Creator." },
        en:{ t:"Words that cast spells — an intro to AI and prompts",
             learn:"What is a prompt? A deep dive into the world of AI and the \"magic formula\": role, task, rules and style. Kids learn to talk to machines and turn their imagination into precise instructions that create stunning images in seconds — just like ordering a dish from a robot chef.",
             act:"\"Super-prompt quest\": kids practise writing prompts against a giant stopwatch to create their own superhero in Bing Image Creator." } },

      { n:2, sem:"a", part:"a1",
        he:{ t:"״הוצאה לאור״ — עקביות עיצובית לחוברת קומיקס",
             learn:"שמירה על עקביות חזותית (Style Consistency) וחיבור תמונות נפרדות לרצף עלילתי אחד בעזרת Canva. הילדים לומדים עד כמה שפה חזותית אחידה קריטית כדי שסיפור או מותג ייראו מקצועיים, ולמה דמות תלת-ממדית בעולם של פיקסלים היא מתכון לכישלון מותגי.",
             act:"יוצרים רצף קומיקס קצר ששומר על אותה שפה עיצובית." },
        en:{ t:"\"Going to print\" — a consistent look for a comic book",
             learn:"Keeping a consistent visual style and joining separate images into one storyline with Canva. Kids learn why a unified visual language is what makes a story or a brand look professional, and why dropping a 3D character into a pixel world is a recipe for brand failure.",
             act:"Creating a short comic strip that keeps the same visual language." } },

      { n:3, sem:"a", part:"a1",
        he:{ t:"סטודיו המיתוג — הפוסטר ושם המותג",
             learn:"הפסיכולוגיה של מיתוג, תורת הצבעים והשפעתם על תת-המודע. לומדים איך מותגי יוקרה מתנהגים לעומת מותגים נגישים, איך משלבים טקסט בתוך תמונות AI, איך מעצבים לוגו נקי וקליט, ואיך ״רווח נושם״ (White Space) משדר מקצוענות אמיתית.",
             act:"״המותג שלי״: יוצרים מותג בעזרת כלי AI — חנות וירטואלית, צבעים שמשדרים את כוונת היזם, עיצוב מוצר ולוגו." },
        en:{ t:"The branding studio — the poster and the brand name",
             learn:"The psychology of branding, colour theory and how colours affect the subconscious. How luxury brands behave compared with everyday brands, how to put text inside AI images, how to design a clean, catchy logo, and how white space signals real professionalism.",
             act:"\"My brand\": creating a brand with AI tools — a virtual shop, colours that express what the founder means, a product design and a logo." } },

      { n:4, sem:"a", part:"a2",
        he:{ t:"ההאק לבית הספר — סודות המצגת המושלמת",
             learn:"שימוש ב-AI (כמו NotebookLM ו-Canva) כעוזר מחקר אישי לבניית מצגות מרהיבות. לומדים את חוקי העיצוב של פרזנטציה מנצחת (חוק ה-5X5, קונטרסט), איך מסכמים מידע במהירות בלי ״העתק-הדבק״ משעמם, ואיך הופכים כל עבודה לבית הספר לפרזנטציה מרתקת שלא מרדימה את הקהל.",
             act:"״תיק הגיבור״: הילדים בונים מצגת של ארבעה שקפים על הגיבור או המותג שלהם, ומשלבים בה את התמונות והלוגו שיצרו במפגשים הקודמים." },
        en:{ t:"The school hack — secrets of the perfect presentation",
             learn:"Using AI (such as NotebookLM and Canva) as a personal research assistant for stunning presentations. Kids learn the design rules of a winning presentation (the 5x5 rule, contrast), how to summarise information fast without boring copy-paste, and how to turn any school project into a presentation that keeps the audience awake.",
             act:"\"The hero file\": kids build a four-slide presentation about their hero or brand, using the images and logo they made in earlier sessions." } },

      { n:5, sem:"a", part:"a2",
        he:{ t:"יצירת וידאו והנפשת המוצר",
             learn:"נכנסים לכיסא הבמאי ומפיקים סרטון פרסומת מאפס בעזרת AI. הילדים לומדים לזהות בעיה ולבנות לה סטוריבורד מדויק עם Gemini, לכתוב תסריט, לעבוד עם חוק ״10 שניות לסצנה״ ב-Google Vids ולשלב קריינות מקצועית כדי להשיק את המוצר שלהם.",
             act:"מפיקים את סרטון הפרומו הראשון למוצר או לגיבור." },
        en:{ t:"Making a video and animating the product",
             learn:"Into the director's chair: producing an advert from scratch with AI. Kids learn to identify a problem and build a precise storyboard for it with Gemini, write a script, work with the ten-seconds-per-scene rule in Google Vids, and add professional narration to launch their product.",
             act:"Producing the first promo video for their product or hero." } },

      { n:6, sem:"a", part:"a3",
        he:{ t:"מפיחים חיים בתמונות — אנימציית AI",
             learn:"עולם הווידאו הג׳נרטיבי. הילדים מבינים איך כלי AI מתקדמים מנתחים תמונה דו-ממדית סטטית, מבינים את העומק שבה ומוסיפים לה תנועה וחיים, כדי לייצר סרטוני אקשן קצרים ועוצרי נשימה שמתאימים לרשתות החברתיות.",
             act:"״להזיז את הגיבור״: מייצרים סרטוני אקשן קצרים של 3–4 שניות מהתמונות הכי טובות שיצרו." },
        en:{ t:"Bringing pictures to life — AI animation",
             learn:"The world of generative video. Kids see how advanced AI tools analyse a flat still image, understand its depth and add movement and life to it, creating short, breathtaking action clips made for social media.",
             act:"\"Move the hero\": generating 3–4 second action clips from their best images." } },

      { n:7, sem:"a", part:"a3",
        he:{ t:"עריכת וידאו — מחברים את הפאזל",
             learn:"יסודות עריכת וידאו מקצועית באפליקציות חכמות (כמו CapCut). לומדים על כוחו של ה״קאט״ (Cut) בקולנוע — איך קפיצה בין זוויות צילום יוצרת מתח, קצב ועניין — ואיך בונים רצף עלילתי ברור בעזרת מעברים (Transitions).",
             act:"״חדר העריכה״: מחברים את הסרטונים הקצרים לרצף הגיוני אחד, מסדרים את העלילה ומוסיפים מעברים." },
        en:{ t:"Video editing — putting the puzzle together",
             learn:"The basics of professional video editing in smart apps (such as CapCut). Kids learn the power of the cut in cinema — how jumping between camera angles creates tension, pace and interest — and how to build a clear storyline with transitions.",
             act:"\"The editing room\": joining the short clips into one logical sequence, ordering the story and adding transitions." } },

      { n:8, sem:"a", part:"a3",
        he:{ t:"מחברים את כל היכולות לווידאו מלא",
             learn:"השלב הסופי בהפקה: מחברים תמונות, וידאו, תמלול, כתוביות וסאונד. הילדים מבינים איך פס הקול מכתיב את הרגש של הצופה, ואיך מוזיקה דרמטית לעומת מוזיקה קצבית משנה לגמרי את המשמעות של אותה סצנה בדיוק.",
             act:"״הטריילר הרשמי״: מכניסים את השיר ל-CapCut, מוסיפים קריינות בעזרת Text-to-Speech ומפיקים טריילר אפי של 30 שניות." },
        en:{ t:"Putting it all together into a full video",
             learn:"The last stage of production: images, video, transcription, captions and sound come together. Kids see how the soundtrack sets the viewer's emotions, and how dramatic music versus upbeat music can completely change the meaning of the very same scene.",
             act:"\"The official trailer\": bringing the song into CapCut, adding narration with text-to-speech and producing an epic 30-second trailer." } },

      { n:9, sem:"a", part:"a4",
        he:{ t:"המשימה הסודית — תחילת ההאקתון",
             learn:"יוצאים לפרויקט הגמר ומתחלקים לקבוצות עבודה של שלושה ילדים. מתרגלים עבודת צוות וסיעור מוחות (Brainstorming) תחת לחץ זמנים.",
             act:"מקבלים נושא מטורף לסיפור חדש (למשל: ״פלישת הפיצות מהחלל״), כותבים עלילה משותפת ומייצרים תמונות בסיס." },
        en:{ t:"The secret mission — the hackathon begins",
             learn:"Kicking off the final project in teams of three, and practising teamwork and brainstorming under time pressure.",
             act:"Teams get a wild theme for a new story (say, \"the pizza invasion from outer space\"), write a shared plot and generate the base images." } },

      { n:10, sem:"a", part:"a4",
        he:{ t:"ספרינט יצירה 1 — ויזואליה וסאונד",
             learn:"ניהול פרויקט וחלוקת תפקידים בצוות, ממש כמו בחברת הייטק. כל צוות הופך את הרעיון שלו למותג ויזואלי שלם עם פס-קול ייחודי.",
             act:"עבודה עצמאית בקבוצות על הדמויות, העולמות והסאונדטרק של הסרט." },
        en:{ t:"Creative sprint 1 — visuals and sound",
             learn:"Managing a project and splitting the roles in a team, just like a tech company. Each team turns its idea into a complete visual brand with its own soundtrack.",
             act:"Teams work on their own to create the film's characters, worlds and soundtrack." } },

      { n:11, sem:"a", part:"a4",
        he:{ t:"ספרינט יצירה 2 — וידאו ועריכה",
             learn:"הופכים את הדו-ממד לקולנוע: עבודה מעשית ואינטנסיבית בחדר העריכה, עם דדליינים נוקשים לסגירת הסרט.",
             act:"מנפישים את התמונות מהמפגש הקודם, מייצאים את הסאונד ועורכים את הסרט הסופי ב-CapCut." },
        en:{ t:"Creative sprint 2 — video and editing",
             learn:"Turning 2D into cinema: intensive hands-on work in the editing room, with strict deadlines to finish the film.",
             act:"Animating the images from the previous session, exporting the sound and editing the final film in CapCut." } },

      { n:12, sem:"a", part:"a4",
        he:{ t:"הקרנת טרום-בכורה וליטוש",
             learn:"ביקורת עמיתים ובקרת איכות (QA). לומדים לתת ולקבל ביקורת בונה — מה עובד ומה חסר — ומבינים שמוצר טוב עובר כמה סבבי תיקונים לפני שהוא יוצא לקהל.",
             act:"מציגים את הסרטים לכיתה, מקבלים פידבק מהחברים ומבצעים תיקונים אחרונים בחדר העריכה." },
        en:{ t:"The preview screening and polish",
             learn:"Peer review and quality assurance (QA). Kids learn to give and take constructive criticism — what works and what's missing — and see that a good product goes through several rounds of fixes before it reaches the public.",
             act:"Screening the films to the class, getting feedback from friends and making the last fixes in the editing room." } },

      { n:13, sem:"a", part:"a4", event:true, emoji:"🏆",
        he:{ t:"טקס האוסקר של FutureGen",
             d:"אירוע השיא שסוגר את סמסטר א׳: עמידה מול קהל וחגיגת הישגים. הילדים מציגים להורים את תהליך היצירה שלהם בעזרת המצגות שבנו במפגש 4, ומקרינים בגאווה את סרטי ה-AI והקומיקסים שיצרו." },
        en:{ t:"The FutureGen Oscars",
             d:"The showcase that closes semester one: presenting to an audience and celebrating what they achieved. The kids show their parents how they made their work, using the presentations they built in session 4, and proudly screen the AI films and comics they created." } },

      { n:14, sem:"b", part:"b1",
        he:{ t:"האנטומיה של משחק טוב (Game Design)",
             learn:"הפסיכולוגיה של משחקי מחשב: אתגר, תגמול והפסד. מנתחים משחקים מפורסמים ומבינים איך משחקים גדולים מלמדים את השחקן את החוקים בלי לומר מילה אחת — רק דרך עיצוב השלב.",
             act:"״המשחק הגרוע בעולם״: משחקים במשחק כושל בכוונה, מאתרים מה פגום בו ומציעים תיקונים לחוקים." },
        en:{ t:"The anatomy of a good game (game design)",
             learn:"The psychology of video games: challenge, reward and losing. Kids analyse famous games and see how great games teach the rules without a single word — through level design alone.",
             act:"\"The worst game in the world\": playing a deliberately broken game to find what's wrong with it and suggest fixes to its rules." } },

      { n:15, sem:"b", part:"b1",
        he:{ t:"עיצוב נכסי המשחק (Game Assets)",
             learn:"יוצרים ״ספרייטים״ (Sprites) — האלמנטים הגרפיים הדו-ממדיים שמרכיבים כל משחק. מגלים את הסוד שמאחורי הקלעים: כל משחק מחשב הוא בסופו של דבר אוסף של ציורים עם רקע שקוף שזזים לפי פקודות.",
             act:"הילדים מעצבים ב-AI את הגיבור, האויב והמטבע שלהם, מסירים להם את הרקע ומכינים אותם למשחק." },
        en:{ t:"Designing the game assets",
             learn:"Creating sprites — the 2D graphics every game is made of. The secret behind the scenes: every video game is, in the end, a collection of drawings with transparent backgrounds that move on command.",
             act:"Kids design their hero, enemy and coin with AI, remove the backgrounds and get them ready for the game." } },

      { n:16, sem:"b", part:"b1",
        he:{ t:"צעדים ראשונים במנוע המשחקים",
             learn:"היכרות עם סביבת פיתוח ללא קוד (No-Code) ועם הלוגיקה התכנותית הבסיסית ביותר: ״אם/אז״ (If/Then). הילדים מבינים שבלי חוקי פיזיקה מוגדרים מראש, כמו כוח משיכה או קרקע מוצקה, הדמות פשוט נופלת לתהום וירטואלית.",
             act:"פותחים פרויקט חדש, מייבאים את הדמויות ומגדירים כפתורי תזוזה וקפיצה." },
        en:{ t:"First steps in the game engine",
             learn:"Meeting a no-code development environment and the most basic programming logic: if/then. Kids discover that without physics rules set in advance, like gravity or solid ground, the character simply falls into a virtual abyss.",
             act:"Opening a new project, importing the characters and setting up the move and jump buttons." } },

      { n:17, sem:"b", part:"b2",
        he:{ t:"מעצבים את השלב הראשון (Level Design)",
             learn:"אדריכלות וירטואלית ועיצוב חוויית משתמש: בונים מסלול מכשולים שמתחיל קל, כדי לתת לשחקן תחושת הצלחה, ונעשה מאתגר אבל הוגן בהמשך.",
             act:"בונים את ה״רצפות״, הקירות והתהומות. כל ילד בונה מסלול שדורש קפיצות מדויקות ותכנון." },
        en:{ t:"Designing the first level (level design)",
             learn:"Virtual architecture and user-experience design: an obstacle course that starts easy, to give the player a sense of success, and grows challenging but fair.",
             act:"Building the floors, walls and pits. Each kid builds a course that needs precise jumps and planning." } },

      { n:18, sem:"b", part:"b2",
        he:{ t:"הרעים מגיעים — AI של אויבים",
             learn:"מתכנתים התנהגות אוטומטית: מגדירים פקודות של תנועה עצמאית לכמה אובייקטים במקביל, כדי ליצור עולם משחק חי ונושם.",
             act:"מכניסים את האויב למשחק ומגדירים לו מסלול תנועה אוטומטי (פטרול ימינה ושמאלה)." },
        en:{ t:"Here come the bad guys — enemy AI",
             learn:"Programming automatic behaviour: commands that move several objects on their own at the same time, to make the game world feel alive.",
             act:"Adding the enemy to the game and giving it an automatic patrol route, left and right." } },

      { n:19, sem:"b", part:"b3",
        he:{ t:"חשיבה יזמית וניצול הזדמנויות",
             learn:"מפתחים את צורת החשיבה של יזמים (Founders): איך יזמים חושבים, איך הם מזהים הזדמנויות עסקיות במקומות שבהם אחרים רואים רק בעיות ותסכול, ומה אפשר ללמוד ממקרי בוחן של היזמים הגדולים בהיסטוריה.",
             act:"סיעור מוחות קבוצתי לאיתור בעיות יומיומיות בוערות שאפשר למצוא להן פתרון טכנולוגי או פיזי." },
        en:{ t:"Entrepreneurial thinking and spotting opportunities",
             learn:"Developing a founder's mindset: how founders think, how they spot business opportunities where others see only problems and frustration, and what the case studies of history's great founders teach.",
             act:"A team brainstorm to find burning everyday problems that could have a technological or physical solution." } },

      { n:20, sem:"b", part:"b3",
        he:{ t:"גילוי מוצר (Product Discovery) וזיהוי בעיות",
             learn:"תהליך ה-Discovery בעולם ניהול המוצר: איך מאפיינים בעיה לעומק, מבינים מי קהל היעד שסובל ממנה, למה חשוב לעשות מחקר שוק לפני שכותבים שורת קוד אחת, ולמה חברות ההייטק המצליחות ״מתאהבות בבעיה״ לפני שהן מתאהבות בפתרון.",
             act:"בונים פרופיל משתמש וחוקרים בעיה אמיתית שהילדים בחרו לפתור בפרויקט הסיום שלהם." },
        en:{ t:"Product discovery and identifying problems",
             learn:"Discovery in modern product management: how to define a problem in depth, understand who suffers from it, why market research comes before writing a single line of code, and why the most successful tech companies fall in love with the problem before the solution.",
             act:"Building a user profile and researching a real problem the kids chose to solve in their final project." } },

      { n:21, sem:"b", part:"b3",
        he:{ t:"עולם ה-MVP וה-POC",
             learn:"המושגים החשובים ביותר בפיתוח מוצר: מהו ״מוצר מינימלי אפשרי״ (MVP) ומהי ״הוכחת היתכנות״ (POC). מדברים על עקרונות ה-Agile, מבינים למה יזמים חכמים לא מחכים שהמוצר יהיה מושלם כדי להשיק אותו, ואיך בודקים כדאיות של רעיון במינימום זמן וכסף.",
             act:"מאפיינים ומשרטטים את גרסת ה-MVP של המוצר שהצוותים הגו." },
        en:{ t:"The world of MVP and POC",
             learn:"The key ideas of product development: what a minimum viable product (MVP) is and what a proof of concept (POC) is. Agile principles, why smart founders don't wait for a perfect product before launching, and how to test whether an idea is worth it with minimum time and money.",
             act:"Defining and sketching the MVP of the new product the teams came up with." } },

      { n:22, sem:"b", part:"b4",
        he:{ t:"אומנות מצגת המשקיעים (Pitch Deck)",
             learn:"המעבר מרעיון לעסק מולטי-מיליונרי: המבנה של מצגת משקיעים מושלמת בסגנון עמק הסיליקון — איך מציגים את הבעיה, הפתרון, גודל השוק והיתרון התחרותי — ואיך בונים One Pager שיווקי שמסכם את הסטארט-אפ בעמוד אחד קולע.",
             act:"בונים את השלד של מצגת המשקיעים למיזם הקבוצתי." },
        en:{ t:"The art of the investor deck (pitch deck)",
             learn:"From an idea to a multi-million business: the structure of a Silicon Valley–style pitch deck — the problem, the solution, the market size and the competitive edge — and how to write a one-pager that sums up the startup on a single page.",
             act:"Building the backbone of the team's investor deck." } },

      { n:23, sem:"b", part:"b4",
        he:{ t:"הפיץ׳ — עמידה מול קהל ושפת הכסף",
             learn:"מחדדים מנהיגות, כריזמה ורטוריקה: טכניקות להעברת מסר ושכנוע, קריאת שפת גוף, מענה לשאלות קשות של משקיעים תחת לחץ, ושילוב מושגים פיננסיים (השקעות, מניות, החזר השקעה) כדי להראות ל״כרישים״ שמדברים איתם בשפת העסקים.",
             act:"תרגול ראשון של ״נאום המעלית״ (Elevator Pitch) מול הקבוצה, וקבלת פידבק לשיפור." },
        en:{ t:"The pitch — facing an audience and speaking money",
             learn:"Sharpening leadership, charisma and rhetoric: techniques for getting a message across and persuading, reading body language, answering tough investor questions under pressure, and using financial terms (investment, shares, return on investment) to show the sharks you speak business.",
             act:"A first run of the elevator pitch in front of the group, with feedback for improvement." } },

      { n:24, sem:"b", part:"b4",
        he:{ t:"האקתון פיתוח, שלב 1 — זהות ומיתוג",
             learn:"יוצאים לספרינט העבודה המסכם ובונים זהות תאגידית לחברה של הילדים. כל צוות מנהל את הזמן שלו בעצמו, מחלק תפקידים (מנכ״ל, מנהל מוצר, סמנכ״ל עיצוב) ועובד עם כלי ה-AI על כל המיתוג העסקי.",
             act:"בוחרים שם, מעצבים לוגו ופלטת צבעים וכותבים סלוגן מנצח לסטארט-אפ." },
        en:{ t:"Development hackathon, stage 1 — identity and branding",
             learn:"The final work sprint begins with a corporate identity for the kids' company. Each team manages its own time, splits the roles (CEO, product manager, head of design) and uses AI tools for all of its business branding.",
             act:"Choosing a name and creating a logo, a colour palette and a winning slogan for the startup." } },

      { n:25, sem:"b", part:"b4",
        he:{ t:"האקתון פיתוח, שלב 2 — הוכחת היתכנות וחומרי שיווק",
             learn:"יוצרים נכסים שיווקיים שיוכיחו למשקיעים שהמוצר מדהים (POC). הילדים רותמים את כל ארגז הכלים שרכשו עד כה: סרטוני פרומו בווידאו AI, אנימציות של המוצר, הדמיות ונתוני שוק שנאספו בעזרת ChatGPT.",
             act:"מפיקים את חומרי השיווק המרכזיים שיעטפו את המוצר." },
        en:{ t:"Development hackathon, stage 2 — proof of concept and marketing",
             learn:"Creating marketing assets that prove to investors the product is amazing (POC). The kids use the whole toolbox they have built up: AI promo videos, product animations, mock-ups and market data gathered with ChatGPT.",
             act:"Producing the main marketing materials around the product." } },

      { n:26, sem:"b", part:"b4",
        he:{ t:"האקתון פיתוח, שלב 3 — סגירת ה-Pitch Deck",
             learn:"מתכנסים לקו הסיום: הקבוצות לוקחות את התוצרים הוויזואליים, הנתונים הפיננסיים וחקר השוק, ואורזות הכול לתוך מצגת המשקיעים (Pitch Deck) ולתוך ה-One Pager.",
             act:"עיצוב סופי וליטוש של המצגות בכלים הגרפיים, תוך הקפדה על חוק ה-5X5." },
        en:{ t:"Development hackathon, stage 3 — closing the pitch deck",
             learn:"Heading for the finish line: teams take their visuals, financial figures and market research and pack it all into the investor deck and the one-pager.",
             act:"Final design and polish of the decks with graphic tools, sticking to the 5x5 rule." } },

      { n:27, sem:"b", part:"b4",
        he:{ t:"חזרה גנרלית — המנכ״לים על הבמה",
             learn:"הכנה מנטלית וטכנית לאירוע הגיוס: איך מתמודדים עם לחץ, שולטים בטון הקול, משתמשים נכון בתנועות הידיים לשפת גוף מנצחת, ומחלקים את זמני הדיבור בין השותפים למיזם.",
             act:"סימולציה מלאה של הפרזנטציה על הבמה מול המנטור, לליטושים אחרונים לפני הרגע הגדול." },
        en:{ t:"Dress rehearsal — the CEOs on stage",
             learn:"Mental and technical preparation for the fundraising event: handling pressure, controlling the tone of voice, using gestures for winning body language, and sharing the speaking time between the partners.",
             act:"A full on-stage run of the presentation in front of the mentor, for the final polish before the big moment." } },

      { n:28, sem:"b", part:"b4", event:true, emoji:"🦈",
        he:{ t:"״הכרישים״ — Demo Day",
             d:"אירוע השיא של השנה, שבו הכול מתחבר: יזמות, AI, מנהיגות ופיננסים מול העולם האמיתי. הכיתה הופכת לזירת השקעות, וכל צוות של יזמים צעירים עולה להציג את הסטארט-אפ שלו. בעזרת ה-Pitch Deck שהכינו והופעה מהפנטת, הם מנסים לשכנע את פאנל המשקיעים — מנטורים והורים — להשקיע ברעיון שלהם." },
        en:{ t:"\"Shark Tank\" — demo day",
             d:"The year's finale, where it all comes together: entrepreneurship, AI, leadership and finance meet the real world. The classroom becomes an investment arena, and each team of young founders presents its startup. With the pitch deck they built and a captivating performance, they try to convince a panel of investors — mentors and parents — to invest in their idea." } }
    ]
  },

  senior: {
    semesters: [
      { id:"a", emoji:"🎨", he:{ n:"סמסטר א׳", t:"סטודיו למיתוג, תוכן ובינה מלאכותית" },
        en:{ n:"Semester 1", t:"Branding, content and AI studio" } },
      { id:"b", emoji:"🚀", he:{ n:"סמסטר ב׳", t:"Start-up & Money Lab — יזמות, מוצר ופיננסים" },
        en:{ n:"Semester 2", t:"Start-up & Money Lab — entrepreneurship, product and finance" } }
    ],
    parts: {
      a1:{ emoji:"🎨", he:"סטודיו המיתוג וה-AI הוויזואלי", en:"The branding studio and visual AI" },
      a2:{ emoji:"🎙️", he:"אולפן ההפקות והפיץ׳", en:"The production studio and the pitch" },
      a3:{ emoji:"🎬", he:"אקשן! הופכים מותג לווידאו ויראלי", en:"Action! Turning a brand into viral video" },
      a4:{ emoji:"⚡", he:"פרויקט מסכם — האקתון מיתוג והשקה", en:"Final project — a branding and launch hackathon" },
      b1:{ emoji:"💡", he:"חשיבה יזמית, ניהול מוצר ומחקר שוק", en:"Entrepreneurial thinking, product management and market research" },
      b2:{ emoji:"🛠️", he:"בניית המוצר והשיווק — No-Code & Funnels", en:"Building the product and the marketing — no-code and funnels" },
      b3:{ emoji:"💰", he:"פיננסים בעולם האמיתי — שכר, מיסים וכלכלה", en:"Real-world finance — salary, tax and the economy" },
      b4:{ emoji:"🎯", he:"אירוע השיא — פרויקט הדמו-דיי", en:"The finale — the demo day project" }
    },
    sessions: [
      { n:1, sem:"a", part:"a1",
        he:{ t:"מילים שעושות קסמים — הנדסת פרומפטים מסחרית",
             learn:"נוסחת ת.מ.ח.ס — תפקיד, משימה, חוקים, סגנון. בהדגמה חיה רואים את ההבדל התהומי בין פרומפט פשוט (״נעלי ספורט מגניבות״) לבין פרומפט מקצועי עם עדשה, תאורת סטודיו וסגנון צילום מוצר מסחרי.",
             act:"״קולקציית ההשקה״: כל תלמיד או צוות ממציא מותג אופנה או גאדג׳ט ומפיק קולקציה של שלוש תמונות מוצר פוטוריאליסטיות ברמת צילום מסחרי.",
             tools:"Ideogram או Bing Image Creator" },
        en:{ t:"Words that cast spells — commercial prompt engineering",
             learn:"The role, task, rules and style formula. A live demo shows the huge gap between a simple prompt (\"cool sneakers\") and a professional one with a lens, studio lighting and commercial product photography.",
             act:"\"The launch collection\": each student or team invents a fashion or gadget brand and produces a collection of three photorealistic product shots at commercial quality.",
             tools:"Ideogram or Bing Image Creator" } },

      { n:2, sem:"a", part:"a1",
        he:{ t:"״המוצר מדבר״ — פרזנטור דיגיטלי ב-AI",
             learn:"איך תמונה סטטית של דמות מתעוררת לחיים: מקלידים טקסט שיווקי קצר, ובלחיצת כפתור הדמות ממצמצת ומדברת בקול ריאליסטי לחלוטין.",
             act:"״הפרזנטור הדיגיטלי״: כותבים ב-ChatGPT טקסט מכירה קצר (10 שניות) למוצר, יוצרים ב-AI דמות של משפיען או שגריר, ומפיקים סרטון קצר שבו הדמות מדברת וממליצה על המוצר.",
             tools:"D-ID או HeyGen / Kling AI, ו-ChatGPT" },
        en:{ t:"\"The product speaks\" — a digital AI presenter",
             learn:"How a still image of a character comes to life: type a short marketing script, and at the click of a button the character blinks and speaks in a completely realistic voice.",
             act:"\"The digital presenter\": students write a short (ten-second) sales script in ChatGPT, create an influencer or ambassador character with AI, and produce a short clip where the character speaks and recommends the product.",
             tools:"D-ID or HeyGen / Kling AI, and ChatGPT" } },

      { n:3, sem:"a", part:"a1",
        he:{ t:"סטודיו המיתוג — לוגו ופוסטר השקה",
             learn:"איך מבקשים מ-Ideogram לוגו וקטורי נקי עם טקסט מדויק, מייבאים אותו ל-Canva ומשלבים פונטים נקיים בעברית (כמו Rubik, Heebo, Assistant) כדי לבנות פוסטר פרסומי — עם דוגמאות לשימושים עסקיים בפוסטרים.",
             act:"״פוסטר ההשקה״: יוצרים לוגו רשמי ומשלבים אותו בפוסטר קמפיין בגודל מלא למוצר שפיתחו.",
             tools:"Ideogram ו-Canva" },
        en:{ t:"The branding studio — logo and launch poster",
             learn:"How to get Ideogram to produce a clean vector logo with accurate text, bring it into Canva and pair it with clean Hebrew fonts (such as Rubik, Heebo and Assistant) in an advertising poster — with examples of how businesses use posters.",
             act:"\"The launch poster\": creating an official logo and placing it in a full-size campaign poster for the product they developed.",
             tools:"Ideogram and Canva" } },

      { n:4, sem:"a", part:"a2",
        he:{ t:"משחקים את המותג — מיני-גיים ב-AI",
             learn:"מה זה גיימיפיקציה, ולמה מותגים כמו מקדונלדס ורד בול בונים משחקים כדי למשוך קהל. בהדגמה חיה ה-AI בונה משחק דפדפן פשוט — תופסים מוצרים שנופלים, טריוויה על המותג או Flappy Bird ממותג — שרץ תוך שתי דקות.",
             act:"״המשחק של המותג״: מזינים ל-AI את עולם המותג, מייצרים מיני-גיים אינטראקטיבי, משנים בו צבעים וחוקים בעזרת פרומפטים, ומקבלים קישור שאפשר לשחק בו מהטלפון או מהמחשב.",
             tools:"Claude Artifacts או ChatGPT, בלי ידע קודם בקוד" },
        en:{ t:"Playing the brand — an AI mini-game",
             learn:"What gamification is, and why brands like McDonald's and Red Bull build games to win an audience. In a live demo, AI builds a simple browser game — catch the falling products, a quick brand quiz or a branded Flappy Bird — that runs within two minutes.",
             act:"\"The brand's game\": students feed the AI their brand's world, generate an interactive mini-game, change its colours and rules with prompts, and get a link they can play on a phone or a computer.",
             tools:"Claude Artifacts or ChatGPT, with no coding needed" } },

      { n:5, sem:"a", part:"a2",
        he:{ t:"סודות הפיץ׳ — מצגת משקיעים בשניות",
             learn:"מזינים פסקה אחת על רעיון למיזם ומקבלים מצגת מעוצבת של חמישה שקפים בלחיצת כפתור — ואז לומדים לערוך ולדייק את התוכן ידנית.",
             act:"״פיץ׳ 4 השקפים״: כל צוות מזין את פרטי המותג שלו, מייצר מצגת, משלב בה את התמונות והלוגו שיצר ובונה מצגת משקיעים קצרה: בעיה, פתרון, שוק ומוצר.",
             tools:"Gamma או תבניות מצגת ב-Canva" },
        en:{ t:"Pitch secrets — an investor deck in seconds",
             learn:"Type one paragraph about a venture idea and get a designed five-slide deck at the click of a button — then learn to edit and sharpen the content by hand.",
             act:"\"The 4-slide pitch\": each team feeds in its brand details, generates a deck, adds the images and logo it made, and builds a short investor deck: problem, solution, market and product.",
             tools:"Gamma or Canva presentation templates" } },

      { n:6, sem:"a", part:"a3",
        he:{ t:"מפיחים חיים בתמונות — אנימציית וידאו AI",
             learn:"תמונת מוצר סטטית מהמפגש הראשון, תנועת מצלמה (Pan/Zoom) או פרומפט תנועה — ותוך שתי דקות התמונה הופכת לווידאו תלת-ממדי בתנועה חלקה.",
             act:"״צילומי אולפן וירטואליים״: מנפישים שלוש תמונות מפתח של המותג ומייצאים שוטים קצרים (B-Roll) לפרסומת.",
             tools:"Luma Dream Machine או Pika" },
        en:{ t:"Bringing pictures to life — AI video animation",
             learn:"A still product image from the first session, a camera move (pan or zoom) or a motion prompt — and within two minutes the image becomes a smoothly moving 3D video.",
             act:"\"Virtual studio shoots\": students animate three key brand images and export short shots (B-roll) for an advert.",
             tools:"Luma Dream Machine or Pika" } },

      { n:7, sem:"a", part:"a3",
        he:{ t:"עריכת וידאו קצר לרשתות (Reels / TikTok)",
             learn:"סביבת העבודה של עורך וידאו: ייבוא סרטונים, חיתוך מהיר (Jump Cuts), מעברים דינמיים, ובניית ״הוק״ שתופס את הצופה בשלוש השניות הראשונות.",
             act:"״חדר העריכה״: מחברים את קטעי הווידאו שהונפשו לקליפ קצבי ומהיר של 20–30 שניות.",
             tools:"CapCut, במחשב או בטלפון" },
        en:{ t:"Short-form video editing (Reels / TikTok)",
             learn:"A video editor's workspace: importing clips, fast jump cuts, dynamic transitions and building a hook that grabs the viewer in the first three seconds.",
             act:"\"The editing room\": joining the animated clips into a fast, punchy 20–30 second clip.",
             tools:"CapCut, on a computer or a phone" } },

      { n:8, sem:"a", part:"a4",
        he:{ t:"הזנקת ההאקתון — הבריף העסקי ותכנון הקמפיין",
             d:"מקבלים בריף מעשי — השקת מותג חדש לבני נוער — ומתחלקים לקבוצות של שלושה. כל קבוצה עושה סיעור מוחות, מחלקת תפקידים ופותחת קובץ פרויקט משותף.",
             tools:"Google Docs או Canva" },
        en:{ t:"Launching the hackathon — the business brief and campaign plan",
             d:"Teams of three get a practical brief: launching a new brand for teenagers. Each team brainstorms, splits the roles and opens a shared project file.",
             tools:"Google Docs or Canva" } },

      { n:9, sem:"a", part:"a4",
        he:{ t:"ספרינט הפקה 1 — עיצוב, לוגו ושפה ויזואלית",
             d:"ספרינט עם לוח זמנים ברור: הצוותים מפיקים את כל החומרים הגרפיים של המותג — לוגו, באנרים ופוסטר השקה.",
             tools:"Canva ו-Ideogram" },
        en:{ t:"Production sprint 1 — design, logo and visual language",
             d:"A sprint with a clear timetable: teams produce all of the brand's graphic assets — logo, banners and launch poster.",
             tools:"Canva and Ideogram" } },

      { n:10, sem:"a", part:"a4",
        he:{ t:"ספרינט הפקה 2 — פרסומת וידאו וג׳ינגל",
             d:"דגשים אחרונים לעריכת סאונד ווידאו, ואז עבודה: מחברים את הווידאו, מקליטים קריינות ומייצאים את הסרטון הסופי.",
             tools:"Luma / Pika, CapCut ו-Suno" },
        en:{ t:"Production sprint 2 — video advert and jingle",
             d:"Last tips on editing sound and video, then to work: teams put the video together, record narration and export the final film.",
             tools:"Luma / Pika, CapCut and Suno" } },

      { n:11, sem:"a", part:"a4",
        he:{ t:"טרום-השקה — ביקורת עמיתים (QA) וליטוש",
             d:"לומדים איך נותנים פידבק מקצועי ובונה. הצוותים מציגים טיוטות זה לזה, אוספים הערות וסוגרים גרסה סופית.",
             tools:"CapCut ו-Canva" },
        en:{ t:"Pre-launch — peer review (QA) and polish",
             d:"Students learn how to give professional, constructive feedback. Teams show each other their drafts, collect comments and lock a final version.",
             tools:"CapCut and Canva" } },

      { n:12, sem:"a", part:"a4", event:true, emoji:"🎤",
        he:{ t:"אירוע שיא — FutureGen Creators Summit",
             d:"אירוע חגיגי מול הורים ואורחים שסוגר את סמסטר א׳. התלמידים מקרינים את הפרסומות, מציגים את המותגים שבנו ואת המצגות העסקיות שלהם." },
        en:{ t:"Finale — FutureGen Creators Summit",
             d:"A celebration evening for parents and guests that closes semester one. Students screen their adverts and present the brands they built and their business decks." } },

      { n:13, sem:"b", part:"b1",
        he:{ t:"ציידי המתחרים — מודיעין תחרותי ומחקר שוק ב-AI",
             learn:"איך בודקים אם הרעיון כבר קיים בעולם, ומהו ״יתרון יחסי״ (Unfair Advantage). בהדגמה חיה חוקרים מתחרה קיים: מחלצים את החולשות שלו מתוך ביקורות רעות ב-App Store, מנתחים מחירי שוק ומוצאים את ה״חור״ שהמתחרים פספסו.",
             act:"״תיק ריגול עסקי״: כל צוות מאתר שלושה מתחרים ישירים ועקיפים בתחום שלו, ומפיק טבלת השוואה של פיצ׳רים ומחירים שמדגישה במה המיזם שלו שונה וטוב יותר.",
             tools:"Perplexity ו-ChatGPT" },
        en:{ t:"Hunting the competition — competitive intelligence and market research with AI",
             learn:"How to check whether your idea already exists, and what an unfair advantage is. In a live demo we investigate an existing competitor: pulling its weaknesses out of bad App Store reviews, analysing market prices and finding the gap the competitors missed.",
             act:"\"The business spy file\": each team finds three direct and indirect competitors in its field and produces a comparison table of features and prices that shows how its venture is different and better.",
             tools:"Perplexity and ChatGPT" } },

      { n:14, sem:"b", part:"b1",
        he:{ t:"ניהול מוצר 1 — סטודיו דיסקברי: הופכים בעיה להזדמנות",
             learn:"חוק הברזל של עולם המוצר: ״אל תתאהבו בפתרון — תתאהבו בבעיה״. איך מנהלי מוצר מגלים מה מציק לאנשים: ניתוח תלונות וביקורות, ראיונות משתמשים, וההבדל בין ״כאב בוער״ לאי-נוחות קלה. כלי העבודה: מפת אמפתיה (Empathy Map), ופירוק בעיה יומיומית של בני נוער ל״הצהרת בעיה״ (Problem Statement) מדויקת.",
             act:"״ציידי הכאבים״: כל צוות בוחר תחום (גיימינג, לימודים, כסף לנוער, חיי חברה), מריץ ברשת מחקר כאבים בעזרת AI, ממלא לוח FigJam בחמש נקודות כאב מרכזיות ומגדיר את המשתמש הראשי (Persona) שעבורו הוא בונה את המוצר.",
             tools:"FigJam או Miro, ו-Perplexity / ChatGPT" },
        en:{ t:"Product management 1 — discovery studio: turning a problem into an opportunity",
             learn:"The iron law of product: \"don't fall in love with the solution — fall in love with the problem\". How product managers find out what bothers people: analysing complaints and reviews, user interviews, and the difference between a burning pain and a minor inconvenience. The tools: an empathy map, and turning an everyday teen problem into a precise problem statement.",
             act:"\"Pain hunters\": each team picks a field (gaming, school, money for teens, social life), researches pain points online with AI, fills a FigJam board with five key pain points and defines the main user (persona) it is building for.",
             tools:"FigJam or Miro, and Perplexity / ChatGPT" } },

      { n:15, sem:"b", part:"b1",
        he:{ t:"ניהול מוצר 2 — מסיעור מוחות ל-MVP",
             learn:"איך בוררים בין 100 רעיונות ומזקקים את הליבה: סיעור מוחות בשיטת ״איך אנחנו יכולים...?״ (How Might We), מהו MVP — מוצר בר-קיימא מינימלי — דרך דוגמת המכונית מול הסקייטבורד, ומטריצת תעדוף (ערך למשתמש מול מאמץ פיתוח) שמפרידה בין Must Have ל-Nice to Have.",
             act:"״ספרינט ה-MVP״: הצוותים מייצרים עשרה פתרונות אפשריים לכאב שהגדירו, מדרגים אותם במטריצת התעדוף ומגדירים בשורה אחת את ה-MVP שהם הולכים לבנות — הפיצ׳ר האחד שחייב לעבוד בגרסה הראשונה.",
             tools:"FigJam / Canva ו-ChatGPT" },
        en:{ t:"Product management 2 — from brainstorm to MVP",
             learn:"How to sift 100 ideas down to the core: brainstorming with \"How might we…?\", what an MVP (minimum viable product) is through the car-versus-skateboard example, and a prioritisation matrix (value to the user versus development effort) that separates must-haves from nice-to-haves.",
             act:"\"The MVP sprint\": teams generate ten possible solutions to the pain they defined, rank them in the matrix and define in one line the MVP they will build — the one feature that must work in version one.",
             tools:"FigJam / Canva and ChatGPT" } },

      { n:16, sem:"b", part:"b1",
        he:{ t:"ניהול מוצר 3 — מסמך אפיון (PRD): מרעיון למפרט",
             learn:"איך מתכנתים ומעצבים יודעים מה לבנות: מסמך ה-PRD (Product Requirements Document) — רקע ומטרה, סיפורי משתמש (״בתור משתמש אני רוצה X כדי להשיג Y״), דרישות פונקציונליות וקריטריונים להצלחה — והפיכת רעיון מופשט לרשימת משימות (Backlog) בעזרת פרומפט מובנה.",
             act:"״כותבים את ספר ההוראות״: כל צוות כותב PRD של עמוד אחד למיזם שלו — שלושה סיפורי משתמש קריטיים, איך ה-MVP יתפקד, ורשימת משימות לקראת הפיתוח.",
             tools:"Google Docs ו-ChatGPT" },
        en:{ t:"Product management 3 — the PRD: from idea to spec",
             learn:"How developers and designers know what to build: the product requirements document (PRD) — background and goal, user stories (\"as a user I want X so that I can Y\"), functional requirements and success criteria — and turning an abstract idea into a backlog of tasks with a structured prompt.",
             act:"\"Writing the instruction manual\": each team writes a one-page PRD for its venture — three critical user stories, how the MVP will work, and a task list for development.",
             tools:"Google Docs and ChatGPT" } },

      { n:17, sem:"b", part:"b1",
        he:{ t:"ניהול מוצר 4 — עבודה באג׳ייל וניהול ספרינטים",
             learn:"איך צוותים בגוגל, ספוטיפיי ומטא עובדים מהר בלי ללכת לאיבוד: עקרונות האג׳ייל (Agile) — התקדמות בסבבים קצרים, לוח קנבן (To Do, In Progress, Review, Done), ישיבת Standup יומית ורטרוספקטיבה.",
             act:"״הספרינט הראשון באוויר״: הצוותים פותחים לוח Trello, מזינים את המשימות מה-PRD, מחלקים תפקידים ואחריות (עיצוב, טקסטים, אתר) ומריצים סימולציה של ספרינט פיתוח ראשון.",
             tools:"Trello או לוח Kanban ב-FigJam" },
        en:{ t:"Product management 4 — Agile and running sprints",
             learn:"How teams at Google, Spotify and Meta move fast without getting lost: Agile principles — short cycles, a Kanban board (To Do, In Progress, Review, Done), a daily stand-up and a retrospective.",
             act:"\"The first sprint goes live\": teams open a Trello board, enter the tasks from the PRD, assign roles and owners (design, copy, website) and simulate a first development sprint.",
             tools:"Trello or a Kanban board in FigJam" } },

      { n:18, sem:"b", part:"b2",
        he:{ t:"חלון ראווה דיגיטלי — עמוד נחיתה בלי קוד",
             learn:"מה זה עמוד נחיתה ואיך הוא מושך לקוחות: כותרת תופסת, הצגת המוצר, התמונות מסמסטר א׳ וכפתור הנעה לפעולה. בהדגמה חיה עורכים, מתאימים לטלפון ומפרסמים את האתר לאוויר.",
             act:"״האתר באוויר״: הצוותים מעצבים דף נחיתה למיזם, משלבים את השפה הגרפית והתמונות, בודקים איך הוא נראה בטלפון ומפרסמים קישור פעיל ברשת.",
             tools:"Canva Sites או Claude" },
        en:{ t:"A digital shop window — a no-code landing page",
             learn:"What a landing page is and how it draws customers: a catchy headline, the product, the images from semester one and a call-to-action button. A live demo of editing, fitting it to phones and publishing the site.",
             act:"\"The site is live\": teams design a landing page for their venture, add their visual language and images, check it on a phone and publish a working link.",
             tools:"Canva Sites or Claude" } },

      { n:19, sem:"b", part:"b2",
        he:{ t:"מה זה בקאנד? איך אתר חושב ושומר מידע",
             learn:"פרונטאנד (מה שרואים במסך, כמו התפריט במסעדה) מול בקאנד (המטבח ומחסן הנתונים). מה קורה ברגע שלוחצים ״שלח״: איך המידע עובר ברשת, נשמר בבסיס נתונים (Database), ואיך אתרים כמו אינסטגרם וטיקטוק זוכרים מי אנחנו.",
             act:"״מחברים את המוח לאתר״: מטמיעים טופס בעמוד הנחיתה, מחברים אותו לטבלת נתונים, שולחים פרטים מהטלפון ורואים איך המידע עובר בזמן אמת מהפרונטאנד לבקאנד.",
             tools:"Google Forms או Tally, ו-Google Sheets" },
        en:{ t:"What's a backend? How a website thinks and stores data",
             learn:"Frontend (what you see on screen, like a restaurant menu) versus backend (the kitchen and the storeroom). What happens the moment you press \"send\": how the data travels, gets stored in a database, and how sites like Instagram and TikTok remember who we are.",
             act:"\"Connecting the brain to the site\": students embed a form in their landing page, connect it to a data table, send details from their phones and watch the data flow from frontend to backend in real time.",
             tools:"Google Forms or Tally, and Google Sheets" } },

      { n:20, sem:"b", part:"b2",
        he:{ t:"סודות המוניטיזציה — איך משחקים חינמיים מגלגלים מיליארדים?",
             learn:"פורטנייט ובראול סטארס חינמיים לגמרי — אז איך Epic Games מכניסה מיליארדים? מפרקים מודלים עסקיים דרך עולם המשחקים: כלכלת יוצרים ועמלות תיווך (רובלוקס), מנויים (Spotify, Xbox Game Pass) ופרסומות מתגמלות במשחקי מובייל.",
             act:"״פיצוח מנוע הרווח של המיזם״: הצוותים מגדירים את מודל המוניטיזציה שלהם בשלוש שכבות — מה המשתמש מקבל בחינם, על מה בדיוק ישלמו, וטבלת מחירים פשוטה — ומציגים אותו ב״קרב המודלים״ מול הכיתה.",
             tools:"ChatGPT ו-Canva" },
        en:{ t:"Monetisation secrets — how do free games make billions?",
             learn:"Fortnite and Brawl Stars are completely free — so how does Epic Games make billions? Taking business models apart through gaming: the creator economy and marketplace fees (Roblox), subscriptions (Spotify, Xbox Game Pass) and rewarded ads in mobile games.",
             act:"\"Cracking the venture's profit engine\": teams define their monetisation model in three layers — what users get for free, what exactly they pay for, and a simple price table — and present it in a \"battle of the models\" in front of the class.",
             tools:"ChatGPT and Canva" } },

      { n:21, sem:"b", part:"b3",
        he:{ t:"״הקוד הפיננסי הישראלי״ — שכר, מיסים ועסקים",
             learn:"מעבדה מרוכזת: ברוטו מול נטו, שכר מינימום לנוער ודמי נסיעות; מדרגות מס הכנסה ונקודות זיכוי — כולל ניפוץ המיתוס ש״אם עליתי מדרגה יישאר לי פחות ביד״; למה מע״מ הוא מס עקיף שהעסק רק גובה ומעביר, ומה נותן ביטוח לאומי; ועוסק פטור מול עוסק מורשה, ומהי ״הוצאה מוכרת״.",
             act:"״אתגר המנכ״ל והעובד״: בחצי הראשון מנתחים תלוש שכר ומחלצים את הנטו; בחצי השני מתמחרים מוצר עסקי (עלות ועוד מע״מ) וקובעים אילו הוצאות מוכרות יקזזו מס.",
             tools:"סימולטור שכר (כל-זכות / חילן), סימולטור רשות המסים ומחשבון ביטוח לאומי" },
        en:{ t:"\"The Israeli financial code\" — salary, tax and business",
             learn:"A concentrated lab: gross versus net, the minimum wage for young workers and travel allowance; income tax brackets and tax credit points — including busting the myth that moving up a bracket leaves you with less; why VAT is an indirect tax a business only collects and passes on, and what national insurance gives you; and exempt versus licensed businesses, and what a deductible expense is.",
             act:"\"The CEO and employee challenge\": in the first half students read a payslip and work out the net pay; in the second they price a business product (cost plus VAT) and decide which deductible expenses offset tax.",
             tools:"Salary simulators (Kol Zchut / Hilan), the Tax Authority simulator and the National Insurance calculator" } },

      { n:22, sem:"b", part:"b3",
        he:{ t:"איך כסף עושה כסף? שוק ההון ומניות",
             learn:"מה זו ״מניה״, ואיך רכישת שבריר מניה הופכת אותנו לבעלים של חברות כמו Apple, Tesla או Nvidia. עליית ערך מול דיבידנד, מה זה מדד S&P 500 ולמה הימור על מניה בודדת מסוכן לעומת השקעה בסל רחב, ופסיכולוגיה של משקיעים: למה השוק עולה ויורד, ומה ההבדל בין השקעה לטווח ארוך לספקולציה.",
             act:"״אתגר תיק ההשקעות של 100,000 דולר״: כל צוות מקבל תקציב וירטואלי, חוקר 3–4 חברות מתחומים שונים ובונה תיק מגוון בגיליון, עם נימוק לכל בחירה.",
             tools:"Google Finance או סימולטור מניות, ו-Google Sheets" },
        en:{ t:"How does money make money? The stock market and shares",
             learn:"What a share is, and how buying a fraction of one makes us owners of companies like Apple, Tesla or Nvidia. Capital gains versus dividends, what the S&P 500 is and why betting on a single share is riskier than a broad basket, and investor psychology: why markets rise and fall, and the difference between long-term investing and speculation.",
             act:"\"The $100,000 portfolio challenge\": each team gets a virtual budget, researches 3–4 companies from different fields and builds a diversified portfolio in a spreadsheet, explaining every choice.",
             tools:"Google Finance or a stock simulator, and Google Sheets" } },

      { n:23, sem:"b", part:"b3",
        he:{ t:"מונופול בעולם האמיתי — השקעות נדל״ן",
             learn:"למה נדל״ן הוא אפיק ההשקעה הפופולרי ביותר: שכירות חודשית (תזרים מזומנים) מול עליית ערך לאורך שנים, נוסחת התשואה הפשוטה, כוחו של מינוף (משכנתא) והסיכונים שבו, וסוגי נדל״ן — מגורים, מסחרי, דירות נופש וקרנות ריט (REIT). בהדגמה חיה בודקים מחירי עסקאות אמיתיים.",
             act:"״ציידי הדירות להשקעה״: הצוותים בוחרים עיר בישראל, מאתרים דירה פוטנציאלית להשקעה ומחשבים בגיליון את התשואה השנתית ואת ההון העצמי הדרוש.",
             tools:"מדלן / יד2 ו-Google Sheets" },
        en:{ t:"Monopoly in the real world — property investment",
             learn:"Why property is the most popular investment: monthly rent (cash flow) versus value growth over the years, the simple yield formula, the power and risks of leverage (a mortgage), and types of property — homes, commercial, holiday lets and REITs. A live demo checks real transaction prices.",
             act:"\"Investment flat hunters\": teams pick a city in Israel, find a potential investment flat and work out the annual yield and the equity needed in a spreadsheet.",
             tools:"Madlan / Yad2 and Google Sheets" } },

      { n:24, sem:"b", part:"b3",
        he:{ t:"ניהול כסף אישי, תקציב וריבית דריבית",
             learn:"כוחה של ריבית דריבית בהדגמה חיה: מה קורה ל-500 ₪ בחודש שיושבים בעובר ושב, לעומת השקעה שמניבה תשואה — אחרי 10, 20 ו-30 שנה.",
             act:"״מפת העושר העצמאית״: בונים תקציב אישי חודשי — הכנסות מעבודה או מדמי כיס, חסכונות והוצאות — ותוכנית חיסכון אישית צופה פני עתיד.",
             tools:"מחשבון ריבית דריבית מקוון ו-Google Sheets" },
        en:{ t:"Personal money, budgeting and compound interest",
             learn:"The power of compound interest, live: what happens to ₪500 a month sitting in a current account versus an investment that earns a return — after 10, 20 and 30 years.",
             act:"\"The independent wealth map\": building a personal monthly budget — income from work or pocket money, savings and spending — and a forward-looking personal savings plan.",
             tools:"An online compound interest calculator and Google Sheets" } },

      { n:25, sem:"b", part:"b4",
        he:{ t:"סודות הפיץ׳ לכרישים — פיץ׳ משקיעים והשקת הבריף",
             learn:"איך עומדים מול משקיעים ומגייסים כסף: המבנה של פיץ׳ מנצח בשלוש דקות — הוק ובעיה, פתרון ומוצר, גודל שוק ומתחרים, מודל עסקי ורווחיות, בקשת ההשקעה והערכת שווי. כל צוות מקבל את ״בריף אתגר הכרישים״ לקראת אירוע הסיום.",
             act:"״הגדרת המיזם להשקעה״: הצוותים מרכזים במסמך הפרויקט את כל מה שנצבר במהלך השנה — הצורך, הפתרון, קהל היעד והמוניטיזציה — ומגדירים את כותרת הפרויקט ואת מטרות הגיוס.",
             tools:"Google Docs וקטעים מ״הכרישים״" },
        en:{ t:"Pitch secrets for the sharks — the investor pitch and the brief",
             learn:"How to face investors and raise money: the structure of a winning three-minute pitch — hook and problem, solution and product, market size and competitors, business model and profitability, the ask and the valuation. Each team gets the \"Shark Tank challenge brief\" for the finale.",
             act:"\"Defining the venture for investment\": teams gather everything from the year in the project document — the need, the solution, the audience and the monetisation — and set the project title and fundraising goals.",
             tools:"Google Docs and clips from Shark Tank" } },

      { n:26, sem:"b", part:"b4",
        he:{ t:"הדו״ח הפיננסי לכרישים — תחזית והערכת שווי",
             learn:"איך מציגים למשקיע נתונים פיננסיים בבהירות: עלויות פיתוח ושיווק, צפי מכירות, רווח גולמי ורווח נקי, ואיך מחשבים כמה אחוזים מציעים לכרישים תמורת סכום ההשקעה (The Ask & Valuation).",
             act:"״מספרים של מיליונרים״: אחרי עבודה מרוכזת על המוצר, הצוותים מסכמים את הנתונים הפיננסיים של המיזם בגיליון אחד." },
        en:{ t:"The financial report for the sharks — forecast and valuation",
             learn:"How to show an investor financial data clearly: development and marketing costs, a sales forecast, gross and net profit, and how to work out what share of the company to offer the sharks for their investment (the ask and the valuation).",
             act:"\"Millionaire numbers\": after focused work on the product, teams sum up their venture's financial data in one spreadsheet." } },

      { n:27, sem:"b", part:"b4",
        he:{ t:"ספרינט Pitch Deck וחזרה גנרלית",
             learn:"חוקי הפיץ׳ של שלוש דקות: שפת גוף, קשר עין, חלוקת תפקידים חלקה בין חברי הצוות, ומסר חזק עם שקפים נקיים בלי עומס טקסט.",
             act:"״אורזים להשקעה ובודקים על יבש״: בחצי הראשון בונים את מצגת המשקיעים ומשלבים בה את עמוד הנחיתה הפעיל ואת הסרטון; בחצי השני מריצים סבב סימולציות בזוגות קבוצות ומקבלים פידבק.",
             tools:"Gamma / Canva ושעון עצר" },
        en:{ t:"The pitch deck sprint and dress rehearsal",
             learn:"The rules of the three-minute pitch: body language, eye contact, smooth handovers between team members, and a strong message on clean slides without walls of text.",
             act:"\"Packing for investment and a dry run\": in the first half teams build the investor deck with their live landing page and video; in the second they run quick simulations in pairs of teams for peer feedback.",
             tools:"Gamma / Canva and a stopwatch" } },

      { n:28, sem:"b", part:"b4", event:true, emoji:"🏆",
        he:{ t:"FutureGen Shark Tank — Demo Day",
             d:"אירוע הסיום השנתי מול פאנל שופטים של הורים, אורחים ומנטורים מהתעשייה. כל צוות עולה לפיץ׳ של שלוש דקות ומציג מיזם שלם — הצורך בשוק, האתר הפעיל, סרטון הקמפיין, המודל העסקי והתחזית הפיננסית — ועונה על שאלות ועל הצעות השקעה מה״כרישים״." },
        en:{ t:"FutureGen Shark Tank — demo day",
             d:"The annual finale in front of a panel of judges: parents, guests and mentors from the industry. Each team gives a three-minute pitch of a complete venture — the market need, the live site, the campaign film, the business model and the financial forecast — and answers questions and investment offers from the sharks." } }
    ]
  }
};

/* ============================================================
   Supporting content blocks
   ============================================================ */

window.PILLARS = [
  { id:"ai", emoji:"💫", color:"#EDE8FF", ink:"#4A2FD6",
    he:{ t:"בינה מלאכותית (AI) יוצרת", intro:"טכנולוגיה הלכה למעשה — אנחנו לא רק משחקים עם AI, אלא לומדים להשתמש בו כמו מקצוענים כדי לייצר תוכן, לבנות מותגים ולחסוך זמן", items:[
      "הנדסת פרומפטים: איך ״לדבר״ עם המכונה, לנסח פקודות מדויקות ולהוציא תוצאות ברמה הגבוהה ביותר",
      "שליטה בארגז כלים דיגיטלי רחב: שימוש מעשי במגוון כלי AI מתקדמים לטקסט, תמונות, סאונד ווידאו, והתאמת הכלי הנכון לצורך היזמי",
      "הקמת מותג מאפס: יצירת זהות מותגית שלמה — שם, לוגו, צבעים וסלוגן עסקי",
      "מסטוריטלינג לווידאו: טכניקות להנפשת תמונות והפיכתן לווידאו מקצועי שמרתק את הצופים",
      "יישום עסקי אמיתי: חקר שוק מהיר באמצעות AI ובניית מצגות משקיעים מעוצבות, נקיות וממוקדות"
    ]},
    en:{ t:"Generative AI", intro:"Technology in practice — we do not just play with AI, we learn to use it like professionals to create content, build brands and save time", items:[
      "Prompt engineering: how to \"talk\" to the machine, write precise instructions and get top-tier results",
      "A broad digital toolbox: hands-on use of advanced AI tools for text, images, sound and video, and matching the right tool to the need",
      "Building a brand from scratch: a complete brand identity — name, logo, colours and business slogan",
      "Storytelling to video: techniques for animating images into professional video that holds an audience",
      "Real business application: fast AI-driven market research and building clean, focused investor decks"
    ]} },

  { id:"leadership", emoji:"🎤", color:"#D7F5F9", ink:"#0A6A75",
    he:{ t:"מנהיגות וכישורי חיים", intro:"ארגז הכלים להצלחה — הטכנולוגיה היא רק הכלי. כדי להצליח באמת אנו מפתחים אצל הילדים מיומנויות אישיות ברמה הגבוהה ביותר", items:[
      "עמידה מול קהל: ביטחון עצמי ויכולת להעביר מסר מול כיתה או קהל בצורה ברורה, בטוחה וחסרת פחד",
      "אומנות השכנוע: איך לדבר בצורה מרתקת, לספר סיפור נכון ולרכוש את אמונם של ה״משקיעים״",
      "שפת גוף ושליטה בקול: טכניקות שבהן משתמשים המרצים הטובים בעולם — יציבה, קשר עין, טונציה ותנועות ידיים",
      "חיזוק הביטחון האישי: סביבת בוטיק של עד 15 ילדים יוצרת מרחב בטוח לצאת מאזור הנוחות, להעז, לטעות ולצמוח"
    ]},
    en:{ t:"Leadership and life skills", intro:"The toolkit for success — technology is only the instrument. To really succeed we develop the highest level of personal skills", items:[
      "Presenting: confidence and the ability to deliver a message to a class or an audience clearly and without fear",
      "The art of persuasion: how to speak compellingly, tell the story right and win the trust of \"investors\"",
      "Body language and voice: the techniques the world's best speakers use — posture, eye contact, tone and gesture",
      "Building self-belief: a boutique group of up to 15 creates a safe space to leave the comfort zone, dare, fail and grow"
    ]} },

  { id:"venture", emoji:"📈", color:"#FFE9C7", ink:"#8A5A00",
    he:{ t:"יזמות, מוצר ופיננסים", intro:"לחשוב כמו מנכ״ל — צורת החשיבה של יזמי הסטארט-אפ המובילים בעולם, יחד עם הבנה אמיתית של שפת הכסף", items:[
      "מזיהוי בעיה לעסק רווחי: איך מאתרים בעיות בעולם האמיתי, מאפיינים אותן והופכים אותן לרעיון מנצח",
      "חקר שוק ואפיון מוצר: מה הלקוחות באמת צריכים, מה המתחרים עושים, ואיך מתכננים מוצר שפותר את הכאב",
      "עבודה בשיטות של הייטק: היכרות עם עולם ה-Agile — שיטות העבודה, הגמישות והחשיבה המהירה של חברות הטכנולוגיה",
      "השראה ממנהיגים עסקיים: למידה מדרכם, מטעויותיהם ומהצלחותיהם של היזמים הגדולים בהיסטוריה",
      "אוריינות פיננסית לגילאי 13–16: חשיפה מושכלת לעולם ההשקעות, שוק ההון ומניות, מושגי יסוד בנדל״ן, וכוחה של הריבית דריבית"
    ]},
    en:{ t:"Entrepreneurship, product and finance", intro:"Think like a CEO — the mindset of the world's leading startup founders, alongside a real understanding of the language of money", items:[
      "From a problem to a profitable business: spotting real-world problems, defining them and turning them into a winning idea",
      "Market research and product definition: what customers actually need, what competitors do, and how to design a product that solves the pain",
      "Working the way tech companies do: an introduction to Agile — the methods, the flexibility and the fast thinking of technology firms",
      "Inspiration from business leaders: learning from the paths, mistakes and successes of history's great founders",
      "Financial literacy for ages 13–16: an informed introduction to investing, the stock market, property fundamentals, and the power of compound interest"
    ]} }
];

/* ============================================================
   Student / pilot work.

   Empty = the whole section hides itself. Add an entry per item:
     { emoji:"🎮", cat:"ai", url:"https://...",   // url is optional
       he:{ t:"שם", d:"תיאור קצר", a:"מי יצר" },
       en:{ t:"Name", d:"Short description", a:"Made by" } }
   With a `url` the card turns into a link ("שחקו / צפו").
   ============================================================ */
window.PROJECTS = [];

/* ============================================================
   Games: the "משחקים" page (games.html, in the menu).

   One entry per game; the page shows a card for each, up to three in a
   row, in this order. No entries = a short note, never empty cards.
   Add a game: put its page next to game.html (or link elsewhere with a full
   https:// address), a 16:9 picture under assets/, and an entry:
     { href:"game2.html", image:"assets/game2/poster.jpg?v=1",
       he:{ t:"שם", d:"תיאור קצר", learn:"מה לומדים", tags:["…","…"] },
       en:{ t:"Name", d:"Short description", learn:"What it practises", tags:["…","…"] } }
   The games are in Hebrew, so on the English page each card says so
   (gm.heOnly). Then take a new snapshot (README, "רינדור מוקדם").
   ============================================================ */
window.GAMES = [
  { href: "game.html", image: "assets/game/poster.jpg?v=1",
    he: { t: "חילוץ הנסיכה: מסע הפרומפט המושלם",
          d: "קופצים על פלטפורמות מעל לבה, נלחמים בקיפודים ועונים על 15 שאלות בסגנון ״מי רוצה להיות מיליונר״ כדי לחלץ את הנסיכה.",
          learn: "לכתוב פרומפט לפי נוסחת ת.מ.ח.ס: תפקיד, משימה, חוקים וסגנון. הנוסחה של המפגש הראשון בחוג.",
          tags: ["תלת-ממד", "3 שלבים", "15 שאלות"] },
    en: { t: "Rescue the Princess: the Perfect Prompt Quest",
          d: "Jump across platforms over lava, fight hedgehogs and answer 15 \"Who Wants to Be a Millionaire\" questions to rescue the princess.",
          learn: "Writing a prompt with the \"magic formula\": role, task, rules and style. The formula of the first session.",
          tags: ["3D", "3 levels", "15 questions"] } }
];

/* ============================================================
   Payment links.

   The site is static, so checkout is handled entirely by the
   payment provider on THEIR hosted page. We never see, store or
   transmit card details — we only link out.

   Provider: Grow (pay.grow.link), monthly standing orders.
     monthlyUrl → ₪350/month, no commitment
     yearlyUrl  → ₪300/month, two-semester commitment
   The pricing section's button leads to register.html?plan=…, where the
   parent signs the agreement first; only then does the page open the Grow
   link of that plan. To swap a link, paste the new URL here.

   signUrl is the leads Apps Script web app (the address only, never the
   ?key= of the lead webhook). It receives the signature (?action=sign,
   signing.gs) and keeps the signed PDF in Google Drive. README, "הרשמה וחתימה".
   ============================================================ */
window.PAYMENT = {
  enabled: true,
  monthlyUrl: "https://pay.grow.link/MTA2NTc5~93f18edad9767728c15e3b380af84168-NDA4NDg4OQ",
  yearlyUrl: "https://pay.grow.link/MTA2NTc5~d21855f617998fa60214fc75a965d232-NDA4NDg1MA",
  signUrl: "https://script.google.com/macros/s/AKfycbw_U5vPU6RVgVtZuBrmI99orQxl8rklOm8m2hNkrOe8Wn6AxQhfMKGJ5qwv4PGh_LhfwQ/exec",
  /* where the provider should send the parent back after paying */
  returnUrl: "/success.html"
};

/* One programme, one price. Two ways to pay for it. */
window.PRICING = {
  monthly: 350,
  yearly: 300,
  he:{ f:[
    "מפגש שבועי חי בקבוצה של עד 15 תלמידים",
    "כל 28 המפגשים לאורך שנת הלימודים",
    "קהילת דיסקורד סגורה",
    "ליווי אישי לפרויקט המסכם",
    "שני אירועי שיא מול קהל של הורים ואורחים"
  ]},
  en:{ f:[
    "One live weekly session in a group of up to 15 students",
    "All 28 sessions across the school year",
    "A closed Discord community",
    "Personal guidance on the final project",
    "Two showcase events in front of parents and guests"
  ]}
};

window.FAQS = [
  { he:{ q:"מה ההבדל בין קבוצת 10–12 לקבוצת 13–16?", a:"לכל קבוצה סילבוס משלה, שנבנה לגיל שלה. בגילאי 10–12 סמסטר א׳ מוקדש ליצירה עם AI — קומיקס, מיתוג, מצגות וסרטים — עד טקס האוסקר, וסמסטר ב׳ עובר מפיתוח משחק ראשון להקמת סטארט-אפ, עד אירוע ״הכרישים״. בגילאי 13–16 סמסטר א׳ הוא סטודיו מיתוג ותוכן ב-AI, וסמסטר ב׳ הוא מעבדת יזמות ופיננסים: ניהול מוצר, דף נחיתה, מודל עסקי, מיסים, שוק ההון, נדל״ן וכסף אישי, עד ה-Demo Day. בשתי הקבוצות יש 28 מפגשים ושני אירועי שיא, והסילבוס המלא של כל אחת נמצא בעמוד הסילבוס." },
    en:{ q:"What's the difference between the 10–12 and 13–16 groups?", a:"Each group has its own syllabus, built for its age. For ages 10–12, semester 1 is about creating with AI — comics, branding, presentations and film — up to the Oscars night, and semester 2 goes from building a first game to founding a startup, up to the \"Shark Tank\" finale. For ages 13–16, semester 1 is a branding and content studio built on AI, and semester 2 is an entrepreneurship and finance lab: product management, a landing page, a business model, tax, the stock market, property and personal money, up to demo day. Both groups have 28 sessions and two showcase events, and each group's full syllabus is on the syllabus page." } },
  { he:{ q:"צריך ידע קודם בתכנות או בעיצוב?", a:"לא. התוכנית מתחילה מאפס לגמרי — המפגש הראשון הוא הפעם הראשונה שרוב התלמידים כותבים פרומפט מקצועי, וסמסטר ב׳ הוא הפעם הראשונה שהם בונים מיזם אמיתי. הכול נבנה בהדרגה." },
    en:{ q:"Is prior coding or design experience needed?", a:"No. The programme starts from absolute zero — the first session is the first time most students write a professional prompt, and semester 2 is the first time they build a real venture. Everything builds up step by step." } },
  { he:{ q:"איזה ציוד צריך בבית?", a:"מחשב נייד או נייח עם חיבור לאינטרנט, אוזניות ומיקרופון. מצלמה רצויה אבל לא חובה. חלק מהכלים דורשים דפדפן עדכני — זה הכול." },
    en:{ q:"What equipment is needed at home?", a:"A laptop or desktop with an internet connection, headphones and a microphone. A webcam is nice but not required. Some tools need an up-to-date browser — that's it." } },
  { he:{ q:"כמה תלמידים יש בכל קבוצה?", a:"עד 15 ילדים. הלמידה מתבצעת בקבוצות בוטיק קטנות, כדי להבטיח חונכות צמודה וסביבה שבה כל קול יישמע." },
    en:{ q:"How many students per group?", a:"Up to 15 children. Learning happens in small boutique groups, so every child gets close mentoring and every voice is heard." } },
  { he:{ q:"כמה זמן נמשך כל מפגש?", a:"כל מפגש נמשך 60 דקות. המפגשים מתקיימים פעם בשבוע, אונליין ובשידור חי, ובסך הכול יש 28 מפגשים לאורך שנת הלימודים." },
    en:{ q:"How long is each session?", a:"Each session lasts 60 minutes. Sessions run once a week, live and online, with 28 sessions across the school year." } },
  { he:{ q:"אפשר לבטל באמצע?", a:"תלוי במסלול התשלום. בתשלום החודשי (₪350) אפשר לבטל בכל עת, בלי קנסות: הביטול נכנס לתוקף תוך 3 ימי עסקים, ומשלמים רק עד אז. במנוי השנתי (₪300 לחודש) יש התחייבות לשנת הלימודים, בתמורה למחיר הנמוך יותר; ביציאה מוקדמת יש דמי ביטול של 5% מיתרת העסקה או 100 ₪, הנמוך מביניהם." },
    en:{ q:"Can we cancel mid-year?", a:"It depends on how you pay. On the monthly option (₪350) you can cancel at any time with no penalty: the cancellation takes effect within 3 business days, and you pay only up to then. The annual subscription (₪300 a month) carries a commitment to the school year in exchange for the lower price; leaving early costs a cancellation fee of 5% of the remaining balance or ₪100, whichever is lower." } },
  { he:{ q:"יש הנחה לאחים או לבני משפחה?", a:"כמובן! אנחנו מציעים הנחה לבני משפחה. לכל הפרטים פנו אלינו בוואטסאפ, בטלפון או במייל, ונשמח לעזור." },
    en:{ q:"Is there a discount for siblings or family members?", a:"Of course! We offer a discount for family members. For all the details, reach out on WhatsApp, by phone or by email and we'll be happy to help." } },
  { he:{ q:"מי המדריכים?", a:"מדריכים מקצועיים מעולמות ההייטק, עם ידע טכנולוגי רב, שמעבירים לילדים ידע פרקטי ישירות מהתעשייה." },
    en:{ q:"Who are the instructors?", a:"Professional instructors from the tech industry with deep technology experience, who pass practical knowledge to the kids straight from the field." } }
];

window.ROTATE = [
  { he:"בינה מלאכותית יוצרת", en:"generative AI" },
  { he:"מיתוג ופרסום", en:"branding and advertising" },
  { he:"מוזיקה וסאונד", en:"music and sound" },
  { he:"וידאו ועריכה", en:"video and editing" },
  { he:"יזמות ומיזם אמיתי", en:"entrepreneurship and a real venture" },
  { he:"אוריינות פיננסית", en:"financial literacy" }
];
