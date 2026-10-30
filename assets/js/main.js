/* ============================================================
   FutureGen Academy — behaviour
   Language switching (he/en + rtl/ltr), the two age tracks,
   syllabus rendering and filtering, navigation, lead form.
   ============================================================ */
(function () {
  "use strict";

  /* English is off for now (README, "דו־לשוניות"): ?lang=en and a saved "en"
     both fall back to Hebrew. Add "en" back to turn it on. */
  var LANGS = ["he"];
  var LANG_KEY = "ng.lang";
  var TRACK_KEY = "ng.track";
  var state = { lang: "he", track: "junior", filter: "all", q: "", plan: "yearly" };
  /* which page this is: <body data-page="home|syllabus|about|games|accessibility"> */
  var PAGE = (document.body && document.body.getAttribute("data-page")) || "home";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- storage (may throw in private mode) ---------- */
  function readStored(key, allowed, fallback) {
    try {
      var v = localStorage.getItem(key);
      if (allowed.indexOf(v) > -1) return v;
    } catch (e) { /* ignore */ }
    return fallback;
  }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  /* ---------- translation ---------- */
  function t(key, vars) {
    var dict = window.I18N[state.lang] || window.I18N.he;
    var val = dict[key];
    if (val == null) val = (window.I18N.he[key] != null ? window.I18N.he[key] : key);
    if (vars) {
      Object.keys(vars).forEach(function (k) { val = val.split("{" + k + "}").join(vars[k]); });
    }
    return ltrRanges(val);
  }
  /* In Hebrew, a range like "10–12" would be flipped by the bidi algorithm and
     show as "12–10". Invisible left-to-right marks around the dash keep it in
     reading order, as in print. A right-to-left mark after the range stops a
     number that follows ("10\u201312 \u00B7 13\u201316") from joining its left-to-right run,
     which would show 13\u201316 first to a Hebrew reader. */
  function ltrRanges(str) {
    return state.lang === "he" ? String(str).replace(/(\d)\s*\u2013\s*(\d+(?:[.,:]\d+)*)/g, "$1\u200E\u2013\u2060\u200E$2\u200F") : String(str);
  }
  function loc(obj) { return obj[state.lang] || obj.he; }
  function esc(str) {
    return ltrRanges(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function applyStaticStrings() {
    $$("[data-i18n]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n"));
      if (val.indexOf("<") > -1) el.innerHTML = val; else el.textContent = val;
    });
    $$("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    $$("[data-i18n-aria]").forEach(function (el) {
      el.getAttribute("data-i18n-aria").split("|").forEach(function (pair) {
        var bits = pair.split(":");
        el.setAttribute(bits[0].trim(), t(bits[1].trim()));
      });
    });
  }

  function renderAll() {
    applyStaticStrings();
    /* a landing link gets a badge that names its own age group */
    var badge = document.querySelector('[data-i18n="hero.badge"]');
    if (badge && state.landing) badge.textContent = t("hero.badge." + state.landing);
    /* WhatsApp opens with a greeting in the visitor's language */
    $$(".wa-btn").forEach(function (a) {
      a.setAttribute("href", "https://wa.me/972525281662?text=" + encodeURIComponent(t("wa.text")));
    });
    renderHeroVideo();
    renderTracks();
    renderTrackSwitch();
    renderChips();
    renderSyllabus();
    renderJourney();
    renderPillars();
    renderProjects();
    renderGames();
    renderPlans();
    renderFaq();
    renderFooterTracks();
    paintTicker();
    paintStatementDate();
    document.dispatchEvent(new CustomEvent("ng:langchange"));
    fillSelects();
    syncLangLinks();
  }

  /* In English, links to the other bilingual pages carry ?lang=en, so a visitor
     who arrived on an English address (a search result, a shared link) stays in
     English, and a search engine following the link reaches the English page. */
  var BILINGUAL = /^(?:\.?\/)?(?:index|syllabus|about|games|accessibility)?(?:\.html)?$/;
  function syncLangLinks() {
    $$("a[href]").forEach(function (a) {
      var href = a.getAttribute("href"), hash = "", query = "";
      var i = href.indexOf("#");
      if (i > -1) { hash = href.slice(i); href = href.slice(0, i); }
      i = href.indexOf("?");
      if (i > -1) { query = href.slice(i + 1); href = href.slice(0, i); }
      if (!href && !query) return;            /* "#section" stays on this page */
      if (!BILINGUAL.test(href)) return;      /* other sites, mail, phone, legal pages */
      var params = new URLSearchParams(query);
      if (state.lang === "en") params.set("lang", "en"); else params.delete("lang");
      query = params.toString();
      a.setAttribute("href", href + (query ? "?" + query : "") + hash);
    });
  }

  function setLang(lang, persist) {
    state.lang = LANGS.indexOf(lang) > -1 ? lang : "he";
    var rtl = state.lang === "he";
    document.documentElement.lang = state.lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    var suffix = PAGE === "home" ? "" : "." + PAGE;
    document.title = t("meta.title" + suffix);
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.desc" + suffix));
    $$(".lang-btn").forEach(function (b) {
      var on = b.getAttribute("data-lang") === state.lang;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (persist) {
      store(LANG_KEY, state.lang);
      if (window.fgA11yLang) window.fgA11yLang(state.lang);   /* the accessibility menu follows (a11y-lang.js) */
      /* the address follows the choice, so an English link can be shared */
      if (window.history && history.replaceState) {
        var url = new URL(location.href);
        if (state.lang === "en") url.searchParams.set("lang", "en"); else url.searchParams.delete("lang");
        history.replaceState(history.state, "", url.pathname + url.search + url.hash);
      }
    }
    syncCanonical();
    renderAll();
  }

  /* The English view lives at ?lang=en; its canonical address says so. */
  function syncCanonical() {
    var link = $('link[rel="canonical"]');
    if (!link) return;
    var base = link.getAttribute("data-base") || link.getAttribute("href");
    link.setAttribute("data-base", base);
    link.setAttribute("href", state.lang === "en" ? base + "?lang=en" : base);
  }

  /* ---------- age tracks ---------- */
  function trackById(id) {
    for (var i = 0; i < window.TRACKS.length; i++) {
      if (window.TRACKS[i].id === id) return window.TRACKS[i];
    }
    return window.TRACKS[0];
  }
  function setTrack(id, persist) {
    state.track = id === "senior" ? "senior" : "junior";
    if (persist) store(TRACK_KEY, state.track);
    renderTracks();
    renderTrackSwitch();
    renderChips();
    renderSyllabus();
    renderJourney();
    /* motion.js lays the new journey stops out on the map */
    document.dispatchEvent(new CustomEvent("ng:trackchange"));
  }

  function renderHeroVideo() {
    var box = $("#heroVideo");
    if (!box) return;
    var v = window.HERO_VIDEO || {};
    var src = (v.src || "").trim();
    if (!src) {
      box.className = "hero-video is-empty";
      box.innerHTML = '<div class="hv-tiles">' + window.PILLARS.map(function (p) {
        return '<span class="hv-tile" style="--pillar:' + p.color + ';--pillar-ink:' + p.ink + '">' +
          '<span class="hv-ico" aria-hidden="true">' + p.emoji + "</span>" +
          '<span class="hv-t">' + esc(loc(p).t) + "</span></span>";
      }).join("") + "</div>";
      return;
    }
    box.className = "hero-video";
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(src)) {
      /* once the video has started, a language switch only relabels it, so it keeps
         playing (its play button is gone by then); before that it is drawn afresh */
      var current = box.querySelector("video");
      if (current && current.getAttribute("src") === src && (current.currentTime > 0 || !current.paused)) {
        current.setAttribute("aria-label", t("hero.videoTitle"));
        syncHeroBar(box);
        return;
      }
      /* Nothing downloads until the visitor presses play (preload="none"); the
         cover picture stands in. The big button starts it, then our own bar
         takes over (heroBarHtml): the browser's controls are never switched on. */
      box.innerHTML = '<video playsinline preload="none" disablepictureinpicture' +
        (v.poster ? ' poster="' + esc(v.poster) + '"' : "") +
        ' aria-label="' + esc(t("hero.videoTitle")) + '" src="' + esc(src) + '"></video>' +
        '<button type="button" class="hv-start" data-ev="video_play" aria-label="' + esc(t("hero.videoPlay")) + '">' +
        '<span class="hv-start-ico" aria-hidden="true"></span></button>';
    } else {
      /* YouTube / Vimeo bring their own player, full screen included */
      box.innerHTML = '<iframe src="' + esc(src) + '" title="' + esc(t("hero.videoTitle")) +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" ' +
        'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>';
    }
  }

  /* The hero video's own control bar: play / pause, position and sound, and no
     full screen. The clip is only sharp at the size of its frame, so the owner
     chose to keep it there (4 October 2026). Media controls stay left to right
     in Hebrew too, like the timeline of any player. */
  function hvIcon(name) {
    var paths = {
      play: '<path d="M8 5v14l11-7z"/>',
      pause: '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>',
      sound: '<path d="M3 9v6h4l5 4V5L7 9H3z"/><path class="hv-stroke" d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.8a7.5 7.5 0 0 1 0 10.4"/>',
      muted: '<path d="M3 9v6h4l5 4V5L7 9H3z"/><path class="hv-stroke" d="M15.5 9.5l5 5M20.5 9.5l-5 5"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + paths[name] + "</svg>";
  }
  function clock(s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
  }
  function heroBarHtml() {
    return '<div class="hv-bar" dir="ltr">' +
      '<button type="button" class="hv-btn hv-toggle"></button>' +
      '<input type="range" class="hv-seek" min="0" max="1000" step="1" value="0">' +
      '<span class="hv-time" aria-hidden="true"></span>' +
      '<button type="button" class="hv-btn hv-mute"></button></div>';
  }
  /* the bar follows the video: icons and labels (in the page's language), then the position */
  function syncHeroBar(box) {
    var video = $("video", box), bar = $(".hv-bar", box);
    if (!video || !bar) return;
    var playing = !video.paused && !video.ended;
    box.classList.toggle("is-playing", playing);
    var key = state.lang + (playing ? "1" : "0") + (video.muted ? "1" : "0");
    if (bar.getAttribute("data-key") !== key) {
      bar.setAttribute("data-key", key);
      var toggle = $(".hv-toggle", bar), mute = $(".hv-mute", bar);
      toggle.innerHTML = hvIcon(playing ? "pause" : "play");
      toggle.setAttribute("aria-label", t(playing ? "hero.videoPause" : "hero.videoPlay"));
      mute.innerHTML = hvIcon(video.muted ? "muted" : "sound");
      mute.setAttribute("aria-label", t(video.muted ? "hero.videoUnmute" : "hero.videoMute"));
      $(".hv-seek", bar).setAttribute("aria-label", t("hero.videoSeek"));
    }
    var d = video.duration || 0, now = video.currentTime || 0, seek = $(".hv-seek", bar);
    seek.value = d ? Math.round(now / d * 1000) : 0;
    seek.setAttribute("aria-valuetext", t("hero.videoAt", { a: clock(now), b: clock(d) }));
    $(".hv-time", bar).textContent = clock(now) + " / " + clock(d);
  }
  function playHero(video) {
    var playing = video.play();
    /* if the browser refuses, the bar's play button is there to try again */
    if (playing && playing.catch) playing.catch(function () {});
  }
  function startHeroVideo(box, video) {
    var start = $(".hv-start", box);
    if (start) start.remove();
    if (!$(".hv-bar", box)) box.insertAdjacentHTML("beforeend", heroBarHtml());
    /* the floating chips around the frame would hide the ends of the bar: the frame comes forward */
    var frame = box.closest(".scene-screen");
    if (frame) frame.classList.add("video-on");
    syncHeroBar(box);
    /* the big button is gone, so keyboard focus moves on to the bar */
    $(".hv-toggle", box).focus({ preventScroll: true });
    playHero(video);
  }

  function renderTracks() {
    var wrap = $("#trackGrid");
    if (!wrap) return;
    wrap.innerHTML = window.TRACKS.map(function (tr) {
      var c = loc(tr);
      var picked = state.landing === tr.id;
      return '<article class="track-card' + (picked ? " is-active" : "") +
        '" style="--track:' + tr.color + ';--track-ink:' + tr.ink + '">' +
        '<span class="track-ico" aria-hidden="true">' + tr.emoji + "</span>" +
        "<h3>" + esc(c.t) + "</h3>" +
        '<span class="track-badge">' + esc(c.n) + "</span>" +
        '<a class="btn btn-primary' +
        '" href="syllabus.html?track=' + tr.id + '" data-track="' + tr.id + '">' + esc(t("track.cta")) +
        '<span class="sr-only"> — ' + esc(c.t) + "</span></a>" +
        "</article>";
    }).join("");
  }

  /* the age switch on the syllabus page, and the one on the home page journey */
  function renderTrackSwitch() {
    var html = window.TRACKS.map(function (tr) {
      var on = state.track === tr.id;
      return '<button type="button" class="track-btn' + (on ? " is-active" : "") +
        '" data-track="' + tr.id + '" aria-pressed="' + on + '">' +
        '<span aria-hidden="true">' + tr.emoji + "</span>" + esc(loc(tr).t) + "</button>";
    }).join("");
    ["#trackSwitch", "#journeySwitch"].forEach(function (sel) {
      var wrap = $(sel);
      if (wrap) wrap.innerHTML = html;
    });
  }

  /* ---------- syllabus ----------
     Each age track has its own syllabus (SYLLABI in data.js). */
  function syllabusOf(id) { return window.SYLLABI[id] || window.SYLLABI.junior; }
  function syllabus() { return syllabusOf(state.track); }

  function meetingText(m) {
    var bits = [];
    [m.he, m.en].forEach(function (c) { bits.push(c.t, c.learn, c.act, c.d); });
    return bits.filter(Boolean).join(" ").toLowerCase();
  }

  function matches(m) {
    if (state.filter === "a" && m.sem !== "a") return false;
    if (state.filter === "b" && m.sem !== "b") return false;
    if (state.filter === "events" && !m.event) return false;
    var q = state.q.trim().toLowerCase();
    if (!q) return true;
    var n = parseInt(q, 10);
    if (!isNaN(n) && String(n) === q) return m.n === n;
    var hay = meetingText(m);
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) > -1; });
  }

  function renderChips() {
    var wrap = $("#sylChips");
    if (!wrap) return;
    var all = syllabus().sessions;
    var items = [
      { id: "all", label: t("chip.all"), emoji: "✨", count: all.length },
      { id: "a", label: t("chip.semA"), emoji: "🎬", count: all.filter(function (m) { return m.sem === "a"; }).length },
      { id: "b", label: t("chip.semB"), emoji: "🚀", count: all.filter(function (m) { return m.sem === "b"; }).length },
      { id: "events", label: t("chip.events"), emoji: "🏆", count: all.filter(function (m) { return m.event; }).length }
    ];
    wrap.innerHTML = items.map(function (it) {
      return '<button type="button" class="chip' +
        '" data-filter="' + it.id + '" aria-pressed="' + (state.filter === it.id) + '">' +
        '<span aria-hidden="true">' + it.emoji + "</span>" + esc(it.label) +
        '<span class="cnt">' + it.count + "</span></button>";
    }).join("");
  }

  /* an open session shows what is taught and what the kids do, or one paragraph */
  function meetingHtml(m, openIt) {
    var c = loc(m);
    var flags = m.event ? '<span class="meet-flag event">' + esc(t("syl.event")) + "</span>" : "";
    var body = c.learn ? meetingRow(t("syl.learn"), c.learn) + meetingRow(t("syl.act"), c.act)
                       : '<p class="meet-d">' + esc(c.d) + "</p>";
    return '<details class="meet' + (m.event ? " is-event" : "") + '"' + (openIt ? " open" : "") + ">" +
      '<summary><span class="meet-n">' + m.n + "</span>" +
      '<span class="meet-t">' + esc(c.t) + "</span>" +
      '<span class="meet-flags">' + flags + "</span></summary>" +
      '<div class="meet-body">' + body + "</div></details>";
  }
  function meetingRow(label, text) {
    return '<div class="meet-row"><b class="meet-k">' + esc(label) + '</b><p class="meet-d">' + esc(text) + "</p></div>";
  }

  /* one track's semesters and parts, holding the sessions that pass the filter */
  function semestersHtml(data, visible, openAll) {
    var html = "";
    data.semesters.forEach(function (sem) {
      var inSem = visible.filter(function (m) { return m.sem === sem.id; });
      if (!inSem.length) return;
      var sc = loc(sem);
      html += '<section class="sem sem-' + sem.id + '">' +
        '<header class="sem-head"><span class="sem-n">' + esc(sc.n) + "</span>" +
        "<h3>" + esc(sc.t) + "</h3>" +
        '<span class="sem-count">' + esc(t("syl.results", { n: inSem.length })) + "</span></header>";

      var seenParts = [];
      inSem.forEach(function (m) { if (seenParts.indexOf(m.part) < 0) seenParts.push(m.part); });
      seenParts.forEach(function (partId, idx) {
        html += '<div class="part"><h4 class="part-title"><span>' +
          esc(t("syl.part", { n: idx + 1 })) + "</span>" + esc(loc(data.parts[partId])) + "</h4>" +
          '<div class="meetings">' +
          inSem.filter(function (m) { return m.part === partId; })
               .map(function (m) { return meetingHtml(m, openAll); }).join("") +
          "</div></div>";
      });
      html += "</section>";
    });
    return html;
  }

  /* Both syllabi are in the page, so search engines read both; the other
     age group's stays hidden until the visitor switches to it. */
  function renderSyllabus() {
    var list = $("#syllabusList");
    if (!list) return;
    var openAll = state.q.trim().length > 0, shown = 0;
    list.innerHTML = window.TRACKS.map(function (tr) {
      var data = syllabusOf(tr.id), visible = data.sessions.filter(matches), on = tr.id === state.track;
      if (on) shown = visible.length;
      return '<div class="syl-track" data-syllabus="' + tr.id + '"' + (on ? "" : " hidden") + ">" +
        semestersHtml(data, visible, openAll) + "</div>";
    }).join("");
    var empty = $("#emptyState");
    if (empty) empty.hidden = shown !== 0;
    var count = $("#resultCount");
    if (count) count.textContent = shown === 1 ? t("syl.results1") : t("syl.results", { n: shown });
  }

  /* ---------- the year's journey (home page) ----------
     Four stages built from the chosen age track's syllabus — each semester,
     then its showcase event — so the journey can never drift from it. */
  function journeyStops() {
    var data = syllabus(), stops = [];
    data.semesters.forEach(function (sem) {
      var inSem = data.sessions.filter(function (m) { return m.sem === sem.id; });
      var lessons = inSem.filter(function (m) { return !m.event; });
      var parts = [];
      lessons.forEach(function (m) { if (parts.indexOf(m.part) < 0) parts.push(m.part); });
      stops.push({ kind: "semester", sem: sem, lessons: lessons, parts: parts });
      inSem.filter(function (m) { return m.event; }).forEach(function (m) {
        stops.push({ kind: "event", sem: sem, m: m });
      });
    });
    return stops;
  }

  function sessionsLabel(a, b) {
    return a === b ? t("journey.session", { n: a }) : t("journey.sessions", { a: a, b: b });
  }

  function renderJourney() {
    var wrap = $("#journeyStops");
    if (!wrap) return;
    var data = syllabus(), total = data.sessions.length;
    /* Each stop has a round node (the map marker, decorative) and a full card.
       Screen readers and the no-motion timeline read the cards; on the map,
       the card of the stop the kid has reached shows in the side panel. */
    wrap.innerHTML = journeyStops().map(function (st) {
      var head, body, ico, first, last;
      if (st.kind === "semester") {
        first = st.lessons[0].n; last = st.lessons[st.lessons.length - 1].n;
        ico = st.sem.emoji || "📘";
        head = '<span class="stop-sem">' + esc(loc(st.sem).n) + "</span>" +
          '<span class="stop-range">' + esc(sessionsLabel(first, last)) + "</span>";
        body = "<h3>" + esc(loc(st.sem).t) + "</h3>" +
          '<ul class="stop-parts">' + st.parts.map(function (pid) {
            var ms = st.lessons.filter(function (m) { return m.part === pid; });
            var a = ms[0].n, b = ms[ms.length - 1].n;
            return '<li><span class="sp-ico" aria-hidden="true">' + (data.parts[pid].emoji || "•") + "</span>" +
              '<span class="sp-t">' + esc(loc(data.parts[pid])) + "</span>" +
              '<span class="sp-n">' + esc(sessionsLabel(a, b)) + "</span></li>";
          }).join("") + "</ul>";
      } else {
        first = last = st.m.n;
        ico = st.m.emoji || "🏆";
        var d = loc(st.m).d, cut = d.indexOf(". ");
        head = '<span class="stop-range">' + esc(sessionsLabel(first, last)) + "</span>";
        body = "<h3>" + esc(loc(st.m).t) + "</h3><p>" + esc(cut > 0 ? d.slice(0, cut + 1) : d) + "</p>";
      }
      var range = first === last ? String(first) : first + "–" + last;
      return '<li class="stop stop-' + st.kind + '" data-first="' + first + '" data-last="' + last + '">' +
        '<button type="button" class="stop-node" tabindex="-1" aria-hidden="true"><span class="node-ico">' + ico + "</span>" +
        '<span class="node-range">' + range + "</span></button>" +
        '<div class="stop-card"><div class="stop-head">' + head + "</div>" + body + "</div></li>";
    }).join("");
    var j = $("#journey");
    if (j) {
      j.setAttribute("data-total", total);
      j.setAttribute("data-progress-tpl", t("journey.progress", { n: "{n}", t: total }));
    }
  }

  function setFilter(id) {
    state.filter = id;
    $$("#sylChips .chip").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === id));
    });
    renderSyllabus();
  }

  /* ---------- supporting content blocks ---------- */
  function catById(id) {
    for (var i = 0; i < window.CATEGORIES.length; i++) {
      if (window.CATEGORIES[i].id === id) return window.CATEGORIES[i];
    }
    return window.CATEGORIES[0];
  }

  var phone = window.matchMedia ? window.matchMedia("(max-width: 820px)") : null;
  function renderPillars() {
    var wrap = $("#pillarGrid");
    if (!wrap) return;
    var compact = !!(phone && phone.matches);
    wrap.innerHTML = window.PILLARS.map(function (p) {
      var c = loc(p);
      return '<article class="pillar" style="--pillar:' + p.color + ';--pillar-ink:' + p.ink + '">' +
        '<span class="pillar-ico" aria-hidden="true">' + p.emoji + "</span>" +
        "<h3>" + esc(c.t) + "</h3>" +
        '<p class="pillar-intro">' + esc(c.intro) + "</p>" +
        /* on phones the list folds away, so each card stays shorter than the screen */
        (compact ? '<details class="pillar-more"><summary class="pillar-eg">' : '<p class="pillar-eg">') +
        esc(t("pillars.eg")) + (compact ? "</summary>" : "</p>") +
        "<ul>" + c.items.map(function (li) { return "<li>" + esc(li) + "</li>"; }).join("") + "</ul>" +
        (compact ? "</details>" : "") +
        "</article>";
    }).join("");
  }

  function renderProjects() {
    var wrap = $("#projectGrid");
    if (!wrap) return;
    var list = window.PROJECTS || [];
    var section = wrap.closest("section");
    if (section) section.hidden = list.length === 0;
    if (!list.length) { wrap.innerHTML = ""; return; }
    wrap.innerHTML = list.map(function (pr) {
      var c = loc(pr);
      var cat = catById(pr.cat) || { color: "#EDE8FF", ink: "#4A2FD6", he: "", en: "" };
      var inner =
        '<div class="project-top" style="background:' + cat.color + '">' +
          '<span aria-hidden="true">' + pr.emoji + "</span></div>" +
        '<div class="project-body">' +
          "<h3>" + esc(c.t) + "</h3><p>" + esc(c.d) + "</p>" +
          (c.a ? '<p class="project-by">' + esc(t("proj.by")) + " " + esc(c.a) + "</p>" : "") +
          (pr.url ? '<span class="project-link">' + esc(t("proj.open")) + "</span>" : "") +
        "</div>";
      return pr.url
        ? '<a class="project is-link" href="' + esc(pr.url) + '" target="_blank" rel="noopener">' + inner + "</a>"
        : '<article class="project">' + inner + "</article>";
    }).join("");
  }

  /* The games page: a card per game in GAMES (data.js), up to three in a row. The title
     is the card's link and stretches over the whole card; with no games, a note instead
     of empty cards. The games are in Hebrew, so in English each card says so. */
  function renderGames() {
    var wrap = $("#gameGrid");
    if (!wrap) return;
    var list = window.GAMES || [];
    if (!list.length) { wrap.innerHTML = '<p class="games-empty">' + esc(t("gm.empty")) + "</p>"; return; }
    wrap.innerHTML = list.map(function (g) {
      var c = loc(g);
      var tags = (state.lang === "he" ? "" : '<li class="is-lang">' + esc(t("gm.heOnly")) + "</li>") +
        (c.tags || []).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      return '<article class="game-tile">' +
        '<div class="game-tile-shot"><img src="' + esc(g.image) + '" width="1200" height="675" alt="" loading="lazy" decoding="async">' +
          '<span class="game-tile-play" aria-hidden="true">▶</span></div>' +
        '<div class="game-tile-body">' +
          (tags ? '<ul class="game-tile-tags">' + tags + "</ul>" : "") +
          '<h2><a class="game-tile-link" href="' + esc(g.href) + '" data-ev="cta_games_card">' + esc(c.t) + "</a></h2>" +
          "<p>" + esc(c.d) + "</p>" +
          (c.learn ? '<p class="game-tile-learn"><b>' + esc(t("gm.learn")) + "</b> " + esc(c.learn) + "</p>" : "") +
          '<span class="btn btn-primary game-tile-cta" aria-hidden="true">' + esc(t("gm.play")) + "</span>" +
        "</div></article>";
    }).join("");
  }

  function renderPlans() {
    var wrap = $("#planGrid");
    if (!wrap) return;
    var P = window.PRICING;

    /* The two ways to pay are a radio group: the visitor picks one and it stays marked.
       Once a payment provider is configured, the checkout button follows the choice. */
    function option(id, amount, noteKey, best) {
      var on = state.plan === id;
      return '<label class="price-opt' + (on ? " is-selected" : "") + '">' +
        '<input class="price-radio" type="radio" name="planChoice" value="' + id + '"' + (on ? " checked" : "") + ">" +
        (best ? '<span class="price-flag">' + esc(t("plans.bestValue")) + "</span>" : "") +
        '<span class="price-kind">' + esc(t("plans." + id)) + "</span>" +
        '<span class="price-amount"><span class="cur">₪</span>' + amount +
        '<span class="per">' + esc(t("plans.perMonth")) + "</span></span>" +
        '<span class="price-note">' + esc(t(noteKey)) + "</span>" +
        (best ? '<span class="price-save">' + esc(t("plans.save")) + "</span>" : "") +
        "</label>";
    }

    var buyUrl = payUrl();
    wrap.innerHTML = '<div class="pricing">' +
      '<fieldset class="price-options rk rk-alt" data-reveal><legend class="sr-only">' + esc(t("plans.choose")) + "</legend>" +
        option("monthly", P.monthly, "plans.noCommit", false) +
        option("yearly", P.yearly, "plans.commit", true) +
      "</fieldset>" +
      '<div class="price-includes" data-reveal="up">' +
        "<h3>" + esc(t("plans.included")) + "</h3>" +
        "<ul>" + loc(P).f.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
      "</div>" +
      (buyUrl ? '<a class="btn btn-primary btn-lg btn-block price-buy" href="' + esc(buyUrl) +
        '" rel="noopener" data-ev="begin_checkout">' + esc(t("plans.payNow")) + "</a>" : "") +
      '<a class="btn ' + (buyUrl ? "btn-outline" : "btn-primary") +
        ' btn-lg btn-block" href="#contact" data-ev="cta_pricing">' + esc(t("plans.cta")) + "</a>" +
      "</div>";
  }
  /* Once payment is on, the button leads to the registration page: the parent
     signs the agreement there, and only then goes on to the provider's link. */
  function payUrl() {
    var pay = window.PAYMENT || {};
    if (!pay.enabled) return "";
    return "register.html?plan=" + (state.plan === "monthly" ? "monthly" : "yearly");
  }
  function selectPlan(id) {
    state.plan = id;
    $$(".price-opt").forEach(function (o) {
      o.classList.toggle("is-selected", o.querySelector(".price-radio").value === id);
    });
    var buy = $(".price-buy");
    if (buy) buy.setAttribute("href", payUrl());
  }

  function renderFaq() {
    var wrap = $("#faqList");
    if (!wrap) return;
    wrap.innerHTML = window.FAQS.map(function (f) {
      var item = loc(f);
      return "<details><summary>" + esc(item.q) + '</summary><div class="answer">' + esc(item.a) + "</div></details>";
    }).join("");
  }

  function renderFooterTracks() {
    var wrap = $("#footerTracks");
    if (!wrap) return;
    wrap.innerHTML = window.TRACKS.map(function (tr) {
      return '<li><a href="syllabus.html?track=' + tr.id + '" data-track="' + tr.id + '">' + esc(loc(tr).t) + "</a></li>";
    }).join("") +
      '<li><a href="syllabus.html?sem=a" data-filter="a">' + esc(t("chip.semA")) + "</a></li>" +
      '<li><a href="syllabus.html?sem=b" data-filter="b">' + esc(t("chip.semB")) + "</a></li>";
  }

  function fillSelects() {
    var age = $("#fAge");
    if (age) {
      var prevAge = age.value;
      var opts = ['<option value="">' + esc(t("form.ageAny")) + "</option>"];
      /* derived from TRACKS so the dropdown can never drift from the programme */
      var lo = Math.min.apply(null, window.TRACKS.map(function (tr) { return tr.min; }));
      var hi = Math.max.apply(null, window.TRACKS.map(function (tr) { return tr.max; }));
      for (var n = lo; n <= hi; n++) opts.push('<option value="' + n + '">' + esc(t("form.ageOpt", { n: n })) + "</option>");
      age.innerHTML = opts.join("");
      age.value = prevAge;
    }
    var track = $("#fTrack");
    if (track) {
      var prevTrack = track.value;
      track.innerHTML = ['<option value="">' + esc(t("form.trackAny")) + "</option>"].concat(
        window.TRACKS.map(function (tr) { return '<option value="' + tr.id + '">' + esc(loc(tr).t) + "</option>"; })
      ).join("");
      track.value = prevTrack || state.landing || "";
    }
  }

  /* rotating word in the hero */
  var tickerIdx = 0, tickerTimer = null;
  function paintStatementDate() {
    var stamp = $(".a11y-updated span");
    if (!stamp) return;
    /* a fixed date: the day the statement was last actually reviewed (data.js) */
    var d = new Date((window.STATEMENT_UPDATED || "2026-10-01") + "T12:00:00");
    stamp.textContent = t("st.updated", {
      d: d.toLocaleDateString(state.lang === "he" ? "he-IL" : "en-GB", { day: "numeric", month: "long", year: "numeric" })
    });
  }

  function paintTicker() {
    var el = $("#tickerWord");
    if (el) el.textContent = loc(window.ROTATE[tickerIdx % window.ROTATE.length]);
    /* The rotating word is decorative motion. Screen readers get the whole
       list once, instead of a fresh announcement every few seconds. */
    var all = $("#tickerAll");
    if (all) all.textContent = window.ROTATE.map(function (w) { return loc(w); }).join(", ");
  }
  function startTicker() {
    if (tickerTimer || !$("#tickerWord")) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    tickerTimer = window.setInterval(function () {
      var el = $("#tickerWord");
      if (!el) return;
      el.classList.add("out");
      window.setTimeout(function () {
        tickerIdx++;
        paintTicker();
        el.classList.remove("out");
      }, 260);
    }, 2600);
  }

  /* ---------- lead form ---------- */
  function validate() {
    var ok = true;
    /* each error sits in an element the field points to with aria-describedby,
       and the field is flagged aria-invalid, so screen readers announce both */
    function fail(input, key) {
      ok = false;
      var field = input.closest(".field") || input.parentNode;
      field.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
      var box = $('[data-err="' + input.id + '"]');
      if (box) box.textContent = t(key);
    }
    function clear(input) {
      var field = input.closest(".field") || input.parentNode;
      field.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
      var box = $('[data-err="' + input.id + '"]');
      if (box) box.textContent = "";
    }

    var name = $("#fName"), phone = $("#fPhone"), email = $("#fEmail");
    [name, phone, email].forEach(clear);

    if (name.value.trim().length < 2) fail(name, "err.name");
    if (phone.value.replace(/\D/g, "").length < 9) fail(phone, "err.phone");
    var mail = email.value.trim();   /* optional, but checked when given */
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) fail(email, "err.email");
    return ok;
  }

  /* picking an age fills in the matching group, unless the parent chose one */
  function wireAgeToGroup() {
    var age = $("#fAge"), group = $("#fTrack");
    if (!age || !group) return;
    group.addEventListener("change", function () { group.setAttribute("data-chosen", group.value ? "1" : ""); });
    age.addEventListener("change", function () {
      if (group.getAttribute("data-chosen")) return;
      var n = parseInt(age.value, 10), pick = "";
      window.TRACKS.forEach(function (tr) { if (n >= tr.min && n <= tr.max) pick = tr.id; });
      group.value = pick;
    });
  }

  /* ---------- wiring ---------- */

  /* ---------- landing links and lead attribution ---------- */
  /* /10-12, /13-16 (Netlify rewrites) or ?track=junior|senior preselect a track. */
  function landingTrack() {
    var path = location.pathname.replace(/\/+$/, "");
    if (/\/10-12$/.test(path)) return "junior";
    if (/\/13-16$/.test(path)) return "senior";
    var m = /[?&]track=(junior|senior)\b/.exec(location.search);
    return m ? m[1] : null;
  }

  /* Remember how the visitor arrived (first touch in this session) so the
     lead form can send it along. Netlify stores the hidden fields with the lead. */
  var ATTR_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  function captureAttribution() {
    var saved = {};
    try { saved = JSON.parse(sessionStorage.getItem("ng.attr") || "{}"); } catch (e) { saved = {}; }
    var params = new URLSearchParams(location.search);
    var fresh = {};
    ATTR_FIELDS.forEach(function (k) { var v = params.get(k); if (v) fresh[k] = v.slice(0, 120); });
    if (Object.keys(fresh).length || !saved.landing) {
      if (!saved.landing) saved.landing = (location.pathname + location.search).slice(0, 200);
      Object.keys(fresh).forEach(function (k) { saved[k] = fresh[k]; });
      try { sessionStorage.setItem("ng.attr", JSON.stringify(saved)); } catch (e) { /* private mode */ }
    }
    ATTR_FIELDS.concat(["landing"]).forEach(function (k) {
      var input = document.querySelector('#leadForm input[name="' + k + '"]');
      if (input && saved[k]) input.value = saved[k];
    });
  }

  /* Links that moved off the home page keep working: old #anchors forward to the new pages. */
  function forwardOldAnchors() {
    if (PAGE !== "home") return false;
    var moved = { "#accessibility": "accessibility.html", "#syllabus": "syllabus.html" };
    var to = moved[location.hash];
    if (to) { location.replace(to); return true; }
    return false;
  }

  function init() {
    if (forwardOldAnchors()) return;
    /* a refresh starts at the top (the <head> script already dropped any #section) */
    var navEntry = window.performance && performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
    if (navEntry && navEntry.type === "reload") window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    var sem = /[?&]sem=(a|b)\b/.exec(location.search);
    if (sem) state.filter = sem[1];
    state.landing = landingTrack();
    state.track = state.landing || readStored(TRACK_KEY, ["junior", "senior"], "junior");
    if (state.landing) store(TRACK_KEY, state.landing);
    var urlLang = /[?&]lang=(he|en)\b/.exec(location.search);
    /* the pre-rendered English files (index.en.html …) say lang="en" in their markup */
    var pageLang = document.documentElement.lang === "en" ? "en" : "he";
    setLang(urlLang ? urlLang[1] : readStored(LANG_KEY, LANGS, pageLang), false);
    captureAttribution();
    /* the site's own accessibility menu (now replaced by the TAB-NAV plugin) kept its settings here */
    try { localStorage.removeItem("ng.a11y"); } catch (e) { /* storage blocked */ }

    $$(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang"), true); });
    });

    // the pillar cards fold their lists on phones only
    if (phone && phone.addEventListener) phone.addEventListener("change", renderPillars);

    // the hero video: the big button (or the cover around it) starts it, then its own bar runs it
    document.addEventListener("click", function (ev) {
      var box = ev.target.closest && ev.target.closest("#heroVideo");
      var video = box && box.querySelector("video");
      if (!video) return;
      var start = box.querySelector(".hv-start");
      if (start) {
        /* a click on the cover goes through the button, so it is counted the same way */
        if (ev.target === video) start.click();
        else if (ev.target.closest(".hv-start")) startHeroVideo(box, video);
        return;
      }
      if (ev.target === video || ev.target.closest(".hv-toggle")) {
        if (video.paused || video.ended) playHero(video); else video.pause();
      } else if (ev.target.closest(".hv-mute")) {
        video.muted = !video.muted;
      }
    });
    document.addEventListener("input", function (ev) {
      var seek = ev.target.classList && ev.target.classList.contains("hv-seek") ? ev.target : null;
      var video = seek && seek.closest("#heroVideo").querySelector("video");
      if (video && video.duration) video.currentTime = seek.value / 1000 * video.duration;
    });
    ["play", "pause", "ended", "volumechange", "timeupdate", "durationchange"].forEach(function (type) {
      document.addEventListener(type, function (ev) {     /* media events don't bubble: capture */
        var box = ev.target.tagName === "VIDEO" && ev.target.closest("#heroVideo");
        if (box) syncHeroBar(box);
      }, true);
    });
    /* no "full screen", "show controls" or picture-in-picture from the right-click menu either */
    document.addEventListener("contextmenu", function (ev) {
      if (ev.target.tagName === "VIDEO" && ev.target.closest("#heroVideo")) ev.preventDefault();
    });

    // monthly / annual price choice
    document.addEventListener("change", function (ev) {
      if (ev.target.classList && ev.target.classList.contains("price-radio")) selectPlan(ev.target.value);
    });

    // track buttons (switch, cards, footer) and chip / footer filters
    document.addEventListener("click", function (ev) {
      /* On the syllabus page these links switch the view in place; elsewhere
         the choice is stored and the link opens the syllabus page. */
      var here = $("#syllabusList");
      var trackEl = ev.target.closest("[data-track]");
      if (trackEl) {
        var id = trackEl.getAttribute("data-track");
        if (!here && trackEl.tagName === "A") {
          /* going to the syllabus page: remember the choice, don't re-render —
             redrawing the cards would detach this link and cancel the navigation */
          store(TRACK_KEY, id === "senior" ? "senior" : "junior");
          return;
        }
        setTrack(id, true);
        if (here && trackEl.tagName === "A") {
          ev.preventDefault();
          $("#syllabus").scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }
      var filterEl = ev.target.closest("[data-filter]");
      if (filterEl && here) {
        setFilter(filterEl.getAttribute("data-filter"));
        if (filterEl.tagName === "A") {
          ev.preventDefault();
          $("#syllabus").scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });

    // mobile navigation
    var toggle = $("#navToggle"), nav = $("#mainNav");
    if (toggle && nav) {
      var backdrop = document.createElement("div");
      backdrop.className = "nav-backdrop";
      backdrop.hidden = true;
      document.body.appendChild(backdrop);
      var setMenu = function (open, refocus) {
        nav.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        backdrop.hidden = !open;
        window.requestAnimationFrame(function () { backdrop.classList.toggle("on", open); });
        if (!open && refocus) toggle.focus();
      };
      toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open"), false); });
      backdrop.addEventListener("click", function () { setMenu(false, false); });
      nav.addEventListener("click", function (ev) {
        if (ev.target.tagName === "A") setMenu(false, false);
      });
      document.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape" && nav.classList.contains("open")) setMenu(false, true);
      });
      /* back on a wide screen the menu is a plain row again. The width where the
         menu button hides differs by language (styles.css), so ask the button. */
      window.addEventListener("resize", function () {
        if (nav.classList.contains("open") && getComputedStyle(toggle).display === "none") setMenu(false, false);
      });
    }

    // sticky header shadow
    var header = $("#siteHeader");
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // active nav link
    $$(".main-nav a").forEach(function (a) {
      if (a.getAttribute("data-page") === PAGE) { a.classList.add("active"); a.setAttribute("aria-current", "page"); }
    });
    var sections = ["program", "learn", "journey", "plans", "faq"]
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      /* The link of the section in the middle of the screen. In the opening, in
         "about" and at the form (not in the menu) no link is marked, instead of
         the last one staying lit. */
      var inBand = {};
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { inBand[e.target.id] = e.isIntersecting; });
        var current = sections.filter(function (s) { return inBand[s.id]; })[0];
        $$(".main-nav a").forEach(function (a) {
          if (a.getAttribute("data-page")) return;
          a.classList.toggle("active", !!current && a.getAttribute("href") === "#" + current.id);
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { spy.observe(s); });
    }

    /* On phones the WhatsApp button would sit on top of the form and the
       footer, where the phone number is shown anyway: let it step aside there. */
    var wa = $(".wa-btn");
    var spots = [$("#contact"), $(".site-footer")].filter(Boolean);
    if (wa && spots.length && "IntersectionObserver" in window) {
      var seen = [];
      var away = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var i = seen.indexOf(e.target);
          if (e.isIntersecting && i < 0) seen.push(e.target);
          if (!e.isIntersecting && i > -1) seen.splice(i, 1);
        });
        wa.classList.toggle("is-away", seen.length > 0 && !!(phone && phone.matches));
      }, { threshold: 0.1 });
      spots.forEach(function (el) { away.observe(el); });
    }

    // lead form
    var form = $("#leadForm");
    wireAgeToGroup();
    if (form) {
      form.addEventListener("submit", function (ev) {
        /* Validation runs first; a valid form is then submitted natively so the
           host (Netlify Forms) captures it and redirects to the action URL. */
        var note = $("#formSuccess");
        if (!validate()) {
          ev.preventDefault();
          var firstBad = $(".field.invalid input, .field.invalid select");
          if (firstBad) firstBad.focus();
          if (note) note.hidden = true;
          return;
        }
        if (note) note.hidden = true;
        // valid -> let the browser POST it; Netlify captures the submission.
      });
    }

    startTicker();

    var year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
