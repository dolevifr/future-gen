/* ============================================================
   FutureGen Academy — measurement and cookie consent.

   Two separate things live here:

   1. Visitor statistics (Umami). No cookies, nothing written to the
      visitor's browser, no IP address kept, and nothing typed into
      the form is ever sent. So it runs for every visitor, with no
      banner. It only counts on the real domain (SITE_HOSTS), never
      on 127.0.0.1 or a Netlify preview link.
   2. Google Analytics / Meta Pixel. These set cookies, so nothing
      talks to Google or Meta until an ID is filled in below AND the
      visitor agreed. While both IDs are empty, no banner is shown at
      all and the footer says "no tracking cookies". (The accessibility
      menu, TAB-NAV, sets one preferences cookie once it is opened.)

   The privacy policy follows the switches: [data-stats] for (1),
   [data-cookies] / [data-vendor] for (2). The "off" texts are the
   defaults in the HTML (also true with JS off, since then nothing loads).

   To switch on:
     umami:     cloud.umami.is → Websites → Add website → its "Website ID"
     ga4:       Google Analytics → Admin → Data streams → "G-XXXXXXXXXX"
     metaPixel: Meta Events Manager → Data sources → the Pixel's numeric ID

   What is measured, and what each event is called in the dashboard:
   README, "מדידה וסטטיסטיקה".
   ============================================================ */
(function () {
  "use strict";

  var CONFIG = {
    umami: "b41cf8ec-91fd-40e2-a491-33f9935e9ae3",
    ga4: "",
    metaPixel: ""
  };
  var SITE_HOSTS = ["future-gen.co.il", "www.future-gen.co.il"];

  var KEY = "ng.consent";                 /* "granted" | "denied" */
  var loaded = false, queue = [], banner = null;

  /* ---------- helpers ---------- */
  function lang() { return document.documentElement.lang === "en" ? "en" : "he"; }
  var TXT = {
    he: {
      region: "הגדרות עוגיות",
      body: "נשמח להשתמש בעוגיות ניתוח ופרסום כדי להבין איך מגיעים אלינו ולשפר את האתר. בלי הסכמה, שום דבר כזה לא נטען.",
      more: "מדיניות הפרטיות",
      yes: "מאשר/ת",
      no: "רק הכרחיות"
    },
    en: {
      region: "Cookie settings",
      body: "We'd like to use analytics and advertising cookies to understand how people find us and to improve the site. Without your consent, none of it loads.",
      more: "Privacy policy",
      yes: "Accept",
      no: "Essential only"
    }
  };
  function tx(k) { return TXT[lang()][k]; }
  function configured() { return !!(CONFIG.ga4 || CONFIG.metaPixel); }
  function measuring() { return !!CONFIG.umami || configured(); }
  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ } }
  function privacyHref() { return /\/404\.html$|^\/[^/]+\/./.test(location.pathname) ? "/privacy.html" : "privacy.html"; }
  function cookiesHref() { return privacyHref() + (lang() === "en" ? "#en-cookies" : "#p-cookies"); }

  /* ---------- visitor statistics (Umami: no cookies, so no consent needed) ---------- */
  var stats = { started: false, ready: false, queue: [] };

  /* Only these URL parameters reach the statistics. Anything else
     (ad click ids such as fbclid or gclid) is dropped on the way out. */
  var KEEP_PARAMS = /^(utm_(source|medium|campaign|content|term)|lang|track|sem)$/;
  /* Netlify serves every page at two addresses (/syllabus and /syllabus.html,
     / and /index.html). One name per page, so the dashboard doesn't split it. */
  function onePath(p) { return p.replace(/\/index\.html$/, "/").replace(/\.html$/, ""); }
  function cleanUrl(u) {
    try {
      var x = new URL(u, location.href), keep = new URLSearchParams();
      x.searchParams.forEach(function (v, k) { if (KEEP_PARAMS.test(k)) keep.append(k, v); });
      x.search = keep.toString();
      x.hash = "";
      x.pathname = onePath(x.pathname);
      return x.toString();
    } catch (e) { return u; }
  }
  /* where people came from is the site they were on, not the full link */
  function cleanReferrer(r) {
    try {
      var x = new URL(r, location.href);
      return x.origin === location.origin ? onePath(x.pathname) : x.origin + x.pathname;
    } catch (e) { return r; }
  }
  window.fgStatsClean = function (type, payload) {
    if (payload && payload.url) payload.url = cleanUrl(payload.url);
    if (payload && payload.referrer) payload.referrer = cleanReferrer(payload.referrer);
    return payload;
  };

  function startStats() {
    if (!CONFIG.umami || stats.started) return;
    stats.started = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://cloud.umami.is/script.js";
    s.setAttribute("data-website-id", CONFIG.umami);
    s.setAttribute("data-domains", SITE_HOSTS.join(","));
    s.setAttribute("data-before-send", "fgStatsClean");
    /* The page view is sent below, once. Left to itself the tracker would
       count a second page whenever the URL changes, e.g. on a language switch. */
    s.setAttribute("data-auto-track", "false");
    s.onload = function () {
      if (!window.umami) return;
      stats.ready = true;
      window.umami.track();
      stats.queue.splice(0).forEach(function (e) { window.umami.track(e[0], e[1]); });
    };
    document.head.appendChild(s);
  }

  /* What each event is called in the statistics dashboard. Only the site
     owner sees these names, so they are in Hebrew. Age ranges are written
     "10 עד 12": a dash between two numbers shows reversed in Hebrew text. */
  var GROUP_HE = { junior: "10 עד 12", senior: "13 עד 16" };
  var SECTION_HE = {
    program: "התוכנית", learn: "מה לומדים", journey: "המסע", game: "משחק הפרומפטים", about: "למה לבחור בנו",
    plans: "מחירים", faq: "שאלות נפוצות", contact: "הטופס", syllabus_end: "סוף הסילבוס"
  };
  var CONTACT_HE = { whatsapp: "לחצו על וואטסאפ", phone: "לחצו על טלפון", email: "לחצו על מייל" };
  var PLACE_HE = { floating: "הכפתור הצף", contact: "אזור יצירת הקשר", footer: "תחתית העמוד", page: "גוף העמוד" };
  var FIELD_HE = { fName: "שם", fPhone: "טלפון", fEmail: "מייל" };
  var CTA_HE = {
    cta_header: "כפתור: לפרטים והרשמה בראש העמוד",
    cta_syllabus: "כפתור: לסילבוס מהפתיחה",
    cta_details: "כפתור: לפרטים נוספים מהפתיחה",
    cta_journey: "כפתור: לסילבוס מהמסע",
    cta_pricing: "כפתור: לפרטים מהמחירים",
    cta_band: "כפתור: לפרטים מסוף הסילבוס",
    video_play: "הפעילו את הסרטון",
    cta_game: "כפתור: למשחק הפרומפטים",
    cta_games_card: "כפתור: משחק בעמוד המשחקים",
    begin_checkout: "כפתור: לתשלום"
  };
  var STAT = {
    section_view: function (p) { return ["גללו עד: " + (SECTION_HE[p.section] || p.section)]; },
    form_start: function () { return ["התחילו למלא את הטופס"]; },
    form_error: function (p) {
      return ["שגיאה בטופס", { "שדות": p.fields.split(",").map(function (f) { return FIELD_HE[f] || f; }).join(", ") }];
    },
    generate_lead: function () { return ["השאירו פרטים"]; },
    contact: function (p) { return [CONTACT_HE[p.method], { "מאיפה": PLACE_HE[p.place] || p.place }]; },
    select_track: function (p) { return [GROUP_HE[p.track] && "התעניינו בגילאי " + GROUP_HE[p.track]]; },
    select_plan: function (p) { return [p.plan === "monthly" ? "בחרו תשלום חודשי" : "בחרו מנוי שנתי"]; },
    faq_open: function (p) { return ["פתחו שאלה נפוצה", { "שאלה": p.question }]; },
    lang_switch: function (p) { return [p.to === "en" ? "עברו לאנגלית" : "עברו לעברית"]; },
    page_not_found: function (p) { return ["עמוד לא נמצא", { "כתובת": p.path }]; },
    video_progress: function (p) { return [p.mark === "end" ? "צפו בסרטון עד הסוף" : "צפו בחצי מהסרטון"]; },
    /* game.html (game.js): started, reached level 2 / 3, finished */
    game_start: function () { return ["התחילו את משחק הפרומפטים"]; },
    game_level: function (p) { return ["משחק הפרומפטים: הגיעו לשלב " + p.level]; },
    game_win: function () { return ["סיימו את משחק הפרומפטים"]; }
  };
  function stat(name, params) {
    if (!CONFIG.umami) return;
    var ev = STAT[name] ? STAT[name](params || {}) : [CTA_HE[name]];
    if (!ev[0]) return;
    if (stats.ready) window.umami.track(ev[0], ev[1]);
    else stats.queue.push(ev);
  }

  /* The site owner's own visits: open any page once with ?nocount=1, on each
     browser you use, and that browser stops being counted (?nocount=0 counts
     it again). The key is Umami's own; it never exists on visitors' browsers. */
  function ownerSwitch() {
    var m = /[?&]nocount=([01])(?:&|$)/.exec(location.search);
    if (!m) return;
    var off = m[1] === "1";
    try {
      if (off) localStorage.setItem("umami.disabled", "1");
      else localStorage.removeItem("umami.disabled");
    } catch (e) { return; }
    try {
      var q = new URLSearchParams(location.search);
      q.delete("nocount");
      var s = q.toString();
      history.replaceState(history.state, "", location.pathname + (s ? "?" + s : "") + location.hash);
    } catch (e) { /* the message below still shows */ }
    window.setTimeout(function () {
      window.alert(off ? "הביקורים מהדפדפן הזה לא ייספרו יותר בסטטיסטיקה."
                       : "הביקורים מהדפדפן הזה ייספרו שוב בסטטיסטיקה.");
    }, 300);
  }

  /* ---------- Google Analytics / Meta Pixel (cookies, only after consent) ---------- */
  function loadGA(id) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
  }
  function loadPixel(id) {
    /* Meta's standard bootstrap, unrolled */
    if (window.fbq) return;
    var n = window.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    window.fbq("init", id);
    window.fbq("track", "PageView");
  }
  function start() {
    if (loaded || !configured() || getConsent() !== "granted") return;
    loaded = true;
    if (CONFIG.ga4) loadGA(CONFIG.ga4);
    if (CONFIG.metaPixel) loadPixel(CONFIG.metaPixel);
    queue.splice(0).forEach(function (e) { send(e[0], e[1]); });
  }

  /* ---------- events ---------- */
  /* Meta gets the conversions only, not how people move around the site */
  var PIXEL = { generate_lead: "Lead", contact: "Contact", begin_checkout: "InitiateCheckout" };
  function send(name, params) {
    if (window.gtag && CONFIG.ga4) window.gtag("event", name, params || {});
    if (window.fbq && CONFIG.metaPixel && PIXEL[name]) window.fbq("track", PIXEL[name], params || {});
  }
  function track(name, params) {
    stat(name, params);
    if (!configured() || getConsent() === "denied") return;
    if (loaded) send(name, params); else queue.push([name, params]);
  }
  window.fgTrack = track;

  /* text as the owner should read it: no direction marks, ranges as "10 עד 12" */
  function plain(s) {
    return String(s).replace(/[‎‏⁠‪-‮]/g, "")
      .replace(/(\d+)\s*[–-]\s*(\d+)/g, "$1 עד $2")
      .replace(/[\s?]+$/, "").trim().slice(0, 120);
  }

  /* Delegated clicks: contact links anywhere, age groups, language,
     and anything with data-ev (the main buttons). Runs in the capture
     phase, before the page's own handlers change anything. */
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a, button");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var method = /^tel:/.test(href) ? "phone" : /^mailto:/.test(href) ? "email" : /wa\.me|whatsapp/.test(href) ? "whatsapp" : "";
    if (method) {
      var place = a.closest(".wa-btn") ? "floating" : a.closest("#contact") ? "contact"
                : a.closest(".site-footer, .doc-foot") ? "footer" : "page";
      track("contact", { method: method, place: place });
    }
    var group = a.getAttribute("data-track");
    if (group && a.getAttribute("aria-pressed") !== "true") track("select_track", { track: group });
    var to = a.getAttribute("data-lang");
    if (to && a.classList.contains("lang-btn") && !a.classList.contains("is-active")) track("lang_switch", { to: to });
    var evName = a.getAttribute("data-ev");
    if (evName) track(evName, { label: (a.textContent || "").trim().slice(0, 60) });
  }, true);

  /* monthly or annual price */
  document.addEventListener("change", function (ev) {
    var t = ev.target;
    if (t && t.name === "planChoice" && t.checked) track("select_plan", { plan: t.value });
  });

  /* which questions parents open; named by the Hebrew question whatever the site language */
  document.addEventListener("toggle", function (ev) {
    var d = ev.target;
    if (!d || !d.open || !d.closest || !d.closest("#faqList")) return;
    var i = Array.prototype.indexOf.call(d.parentNode.querySelectorAll("details"), d);
    var faq = window.FAQS && window.FAQS[i];
    var q = faq && faq.he ? faq.he.q : (d.querySelector("summary") || d).textContent;
    track("faq_open", { question: plain(q) });
  }, true);   /* toggle doesn't bubble, so it is caught on the way down */

  /* how far the hero video is watched: half way and to the end, once each per page view */
  var watched = {};
  function videoProgress(ev) {
    var v = ev.target;
    if (!v || v.tagName !== "VIDEO" || !v.closest("#heroVideo") || !v.duration) return;
    var mark = ev.type === "ended" ? "end" : v.currentTime / v.duration >= 0.5 ? "half" : "";
    if (!mark || watched[mark]) return;
    watched[mark] = true;
    track("video_progress", { mark: mark });
  }
  document.addEventListener("timeupdate", videoProgress, true);   /* media events don't bubble either */
  document.addEventListener("ended", videoProgress, true);

  /* The lead form: first field touched, and which fields failed validation.
     Only field names are sent, never what was typed. A sent form is
     counted on thanks.html, where Netlify lands it. */
  var formStarted = false;
  document.addEventListener("focusin", function (ev) {
    var el = ev.target;
    if (formStarted || !el.closest || !el.closest("#leadForm")) return;
    if (!/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) || el.type === "hidden" || el.name === "company") return;
    formStarted = true;
    track("form_start");
  });
  document.addEventListener("submit", function (ev) {
    var f = ev.target;
    if (!f || f.id !== "leadForm" || !ev.defaultPrevented) return;   /* main.js blocks an invalid form */
    var bad = Array.prototype.map.call(f.querySelectorAll('[aria-invalid="true"]'), function (el) { return el.id; });
    if (bad.length) track("form_error", { fields: bad.join(",") });
  });

  /* How far people get: a checkpoint counts once per page view, as soon as
     its top is above the lower quarter of the screen. A section jumped over
     (a menu link straight to the prices) counts too, so each number in the
     dashboard is "got at least this far" and can only shrink down the page. */
  var CHECKPOINTS = [
    ["#program h2", "program"], ["#learn h2", "learn"], ["#journey h2", "journey"], ["#game h2", "game"],
    ["#about h2", "about"], ["#plans h2", "plans"], ["#faq h2", "faq"], ["#contact h2", "contact"],
    ['[data-page="syllabus"] .cta-band', "syllabus_end"]
  ];
  function watchCheckpoints() {
    if (!measuring()) return;
    var left = [], timer = 0;
    CHECKPOINTS.forEach(function (c) {
      var el = document.querySelector(c[0]);
      if (el && !el.closest("[hidden]")) left.push([el, c[1]]);
    });
    if (!left.length) return;
    function check() {
      timer = 0;
      var line = window.innerHeight * 0.75;
      left = left.filter(function (c) {
        var box = c[0].getClientRects()[0];
        if (!box || box.top > line) return true;     /* not laid out yet, or still below */
        track("section_view", { section: c[1] });
        return false;
      });
      if (!left.length) window.removeEventListener("scroll", onScroll);
    }
    function onScroll() { if (!timer) timer = window.setTimeout(check, 150); }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.setTimeout(check, 1000);                   /* a tall screen may show a section without scrolling */
  }

  /* pages that are themselves an event: <body data-page-event="..."> */
  function pageEvent() {
    var name = document.body && document.body.getAttribute("data-page-event");
    if (!name) return;
    track(name, name === "page_not_found" ? { path: location.pathname.slice(0, 100) } : undefined);
  }

  /* ---------- banner ---------- */
  function close() {
    if (!banner) return;
    banner.remove();
    banner = null;
  }
  function render() {
    close();
    banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("aria-label", tx("region"));
    banner.setAttribute("lang", lang());
    banner.setAttribute("dir", lang() === "en" ? "ltr" : "rtl");
    banner.innerHTML =
      '<p class="cb-text">' + tx("body") + ' <a href="' + cookiesHref() + '">' + tx("more") + "</a></p>" +
      '<div class="cb-actions">' +
        '<button type="button" class="btn btn-primary cb-btn" data-cb="yes">' + tx("yes") + "</button>" +
        '<button type="button" class="btn btn-outline cb-btn" data-cb="no">' + tx("no") + "</button>" +
      "</div>";
    /* early in the reading order, but it never steals focus */
    var skip = document.querySelector(".skip-link");
    if (skip && skip.nextSibling) skip.parentNode.insertBefore(banner, skip.nextSibling);
    else document.body.insertBefore(banner, document.body.firstChild);
    banner.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-cb]");
      if (!b) return;
      var v = b.getAttribute("data-cb");
      if (v === "yes") { setConsent("granted"); close(); start(); }
      else if (v === "no") { setConsent("denied"); queue.length = 0; close(); }
    });
  }

  /* ---------- footer link + privacy policy text ---------- */
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function syncPage() {
    var on = configured(), st = !!CONFIG.umami;
    each("[data-cookies]", function (el) { el.hidden = el.getAttribute("data-cookies") !== (on ? "on" : "off"); });
    each("[data-stats]", function (el) { el.hidden = el.getAttribute("data-stats") !== (st ? "on" : "off"); });
    each("[data-vendor]", function (el) { el.hidden = !CONFIG[el.getAttribute("data-vendor")]; });
    each("[data-cookie-settings]", function (a) {
      a.setAttribute("href", cookiesHref());
      if (!on) return;                   /* keeps the "no tracking cookies" wording */
      a.removeAttribute("data-i18n");    /* so a language switch doesn't put it back */
      a.textContent = tx("region");
    });
  }

  /* With cookies in play, the footer link reopens the consent choice.
     Without them it is an ordinary link to the policy. */
  document.addEventListener("click", function (ev) {
    var l = ev.target.closest && ev.target.closest("[data-cookie-settings]");
    if (!l || !configured()) return;
    ev.preventDefault();
    render();
    var first = banner && banner.querySelector("button");
    if (first) first.focus();          /* the visitor asked for it, so focus is expected here */
  });

  document.addEventListener("ng:langchange", function () {
    syncPage();
    if (banner) render();
  });

  function init() {
    ownerSwitch();
    syncPage();
    startStats();
    watchCheckpoints();
    pageEvent();
    if (!configured()) return;
    var c = getConsent();
    if (c === "granted") start();
    else if (c !== "denied") render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
