/* ============================================================
   FutureGen Academy — motion.

   Everything here decorates content that is already in the page:
   cards sliding in, parallax layers, the rocket journey, counters
   and mobile carousels. It all switches off when the visitor asks
   for less motion (the system "reduce motion" setting), and the
   page reads the same without it.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  function calm() { return !!(mq && mq.matches); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function isRtl() { return root.dir === "rtl"; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  /* Browsers pause animation frames in background tabs; a hidden tab doesn't
     scroll either, so a plain timer there is harmless and keeps state current. */
  function nextFrame(cb) { return document.hidden ? window.setTimeout(cb, 16) : requestAnimationFrame(cb); }

  /* The smallest viewport height (address bar shown) — stable while phone
     browsers slide their toolbars in and out during scrolling. */
  var probe = null;
  function stableHeight() {
    if (!probe) {
      probe = document.createElement("div");
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none";
      document.body.appendChild(probe);
    }
    return probe.offsetHeight || window.innerHeight;
  }

  /* the sticky header's height, for the pinned journey */
  function headerH() {
    var h = $("#siteHeader");
    return h ? h.offsetHeight : 0;
  }

  /* ============================================================
     1. Reveal on scroll
     [data-reveal] fades in (up / start / end / zoom). A container with
     class "rk" reveals its children one after another instead.
     ============================================================ */
  var io = null, watched = [];
  function revealAll() { $$("[data-reveal]").forEach(function (el) { el.classList.add("in"); }); }

  function setupReveal() {
    if (io) { io.disconnect(); io = null; }
    var els = $$("[data-reveal]");
    if (calm() || !("IntersectionObserver" in window)) {
      revealAll();
      root.classList.remove("motion-ok");
      return;
    }
    /* whatever is already on screen stays put instead of blinking out and back */
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add("in");
    });
    root.classList.add("motion-ok");
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
        countUp(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    watched = els.filter(function (el) { return !el.classList.contains("in"); });
    watched.forEach(function (el) { io.observe(el); });
  }
  /* content re-rendered after a language switch shows at once */
  function revealRerendered() {
    $$("[data-reveal]").forEach(function (el) {
      if (watched.indexOf(el) < 0) el.classList.add("in");
    });
  }

  /* ============================================================
     2. Count-up numbers ([data-count])
     ============================================================ */
  function countUp(scope) {
    if (calm()) return;
    $$("[data-count]", scope).forEach(function (el) {
      if (el.getAttribute("data-counted")) return;
      el.setAttribute("data-counted", "1");
      var end = parseInt(el.getAttribute("data-count"), 10), t0 = null;
      function step() {
        var ts = window.performance ? performance.now() : Date.now();
        if (t0 === null) t0 = ts;
        var p = clamp((ts - t0) / 1100, 0, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) nextFrame(step);
      }
      el.textContent = "0";
      nextFrame(step);
    });
  }

  /* ============================================================
     3. Parallax layers ([data-speed]) and the hero rocket
     ============================================================ */
  var layers = [], heroRocket = null, pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  function setupParallax() {
    layers = $$("[data-speed]").map(function (el) {
      return {
        el: el,
        speed: parseFloat(el.getAttribute("data-speed")) || 0,
        tilt: parseFloat(el.getAttribute("data-tilt")) || 0,
        box: el.closest(".scene, .page-hero") || el.parentNode,
        top: !!el.closest(".hero, .page-hero")
      };
    });
    heroRocket = $("[data-rocket]");
    cacheBoxes();
  }
  /* Where each layer's box sits on the page, measured once (and again after
     any layout change) so scrolling only does arithmetic, never layout reads. */
  function cacheBoxes() {
    var y = window.scrollY;
    layers.forEach(function (l) {
      var prev = l.el.style.transform;
      l.el.style.transform = "";
      var r = l.box.getBoundingClientRect();
      l.boxTop = r.top + y;
      l.boxH = r.height;
      l.el.style.transform = prev;
    });
    var hero = heroRocket && heroRocket.closest(".hero");
    heroH = hero ? hero.offsetHeight : 0;
  }
  var heroH = 0;
  function paintParallax() {
    var y = window.scrollY, mid = window.innerHeight / 2;
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    var vh = window.innerHeight;
    layers.forEach(function (l) {
      var top = l.boxTop - y;
      if (top + l.boxH < -200 || top > vh + 200) return;
      /* drift relative to where the box sits on screen, so a layer far down the
         page starts from its resting place; at the top of the page that is the scroll */
      var shift = l.top ? y : mid - (top + l.boxH / 2);
      l.el.style.transform = "translate3d(" + (pointer.x * l.tilt).toFixed(1) + "px," +
        (shift * l.speed + pointer.y * l.tilt).toFixed(1) + "px,0)";
    });
    if (heroRocket) {
      var p = heroH ? clamp(y / (heroH * 0.9), 0, 1) : 0;
      var dir = isRtl() ? -1 : 1;
      heroRocket.style.transform = "translate3d(" + (dir * p * 160).toFixed(1) + "px," + (-p * 340).toFixed(1) + "px,0)" +
        " rotate(" + (dir * p * 10).toFixed(2) + "deg)";
      heroRocket.style.opacity = String(clamp(1.15 - p * 1.1, 0, 1));
    }
  }
  function resetParallax() {
    layers.forEach(function (l) { l.el.style.transform = ""; });
    if (heroRocket) { heroRocket.style.transform = ""; heroRocket.style.opacity = ""; }
  }
  /* the hero scene follows the mouse a little (fine pointers only) */
  function setupPointer() {
    var scene = $("#heroScene");
    if (!scene || !window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;
    var hero = scene.closest(".hero");
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    });
    hero.addEventListener("pointerleave", function () { pointer.tx = 0; pointer.ty = 0; kick(); });
  }

  /* ============================================================
     4. The journey: the whole year as a map on one screen. The section
     stays pinned while the visitor scrolls, and a kid walks the winding
     path from stop to stop; the stop reached shows in the side panel.
     Falls back to a vertical timeline when there is no room or no motion.
     ============================================================ */
  var J = { on: false, cur: -1 };
  function journeyEls() {
    J.sec = $("#journey");
    if (!J.sec) return false;
    J.pin = $("#journeyPin");
    J.map = $("#journeyMap");
    J.svg = $("#journeyLine");
    J.base = $(".jl-base", J.svg);
    J.trail = $(".jl-trail", J.svg);
    J.kid = $("#journeyKid");
    J.panel = $("#journeyPanel");
    J.count = $("#journeyCount");
    return true;
  }

  function unpin() {
    J.on = false;
    J.cur = -1;
    if (!J.sec) return;
    J.sec.classList.remove("is-pinned");
    J.sec.style.height = "";
    $$("#journeyStops > .stop").forEach(function (s) {
      s.classList.add("passed"); s.classList.remove("current");
      s.style.transform = "";
    });
    if (J.panel) { J.panel.innerHTML = ""; J.panel.style.minHeight = ""; }
  }

  /* what the panel shows for stop i: its card, with a large icon on top */
  function panelHtml(stop) {
    var ico = $(".node-ico", stop);
    var kind = (/\bstop-(semester|event)\b/.exec(stop.className) || [0, "semester"])[1];
    return '<div class="panel-stop panel-' + kind + '">' +
      '<div class="stop-card">' + (ico ? '<span class="stop-ico-big">' + ico.textContent + "</span>" : "") +
      $(".stop-card", stop).innerHTML + "</div></div>";
  }

  function measureJourney() {
    if (!journeyEls()) return;
    unpin();
    var stops = $$("#journeyStops > .stop"), n = stops.length;
    if (calm() || stableHeight() < 540 || n < 2) return;

    var hh = headerH() + "px";
    if (root.style.getPropertyValue("--header-h") !== hh) root.style.setProperty("--header-h", hh);
    J.sec.classList.add("is-pinned");
    $$("#journeyStops > .stop").forEach(function (s) { s.classList.remove("passed"); });

    /* the panel keeps the height of its tallest card, so the map never jumps */
    var tallest = 0;
    stops.forEach(function (s) { J.panel.innerHTML = panelHtml(s); tallest = Math.max(tallest, J.panel.offsetHeight); });
    J.panel.style.minHeight = tallest + "px";

    /* ---- a few stops sit on one winding trail, zigzagging up and down;
       more than six would wrap into a snake, row by row ---- */
    var W = J.map.clientWidth, H = J.map.clientHeight;
    var single = n <= 6;
    var cols = single ? n : (W >= 290 ? 4 : 3), rows = Math.ceil(n / cols);
    var node = single ? clamp(Math.min(W / n * 0.46, H * 0.28), 44, 84)
                      : clamp(Math.min(W / cols * 0.42, H / rows * 0.5), 34, 58);
    var kid = clamp(node * 0.9, 36, 70);
    J.sec.style.setProperty("--node", Math.round(node) + "px");
    J.sec.style.setProperty("--kid", Math.round(kid) + "px");
    var padX = node * 0.9, rowH = H / rows;
    var colW = cols > 1 ? (W - padX * 2) / (cols - 1) : 0;
    var rtl = isRtl();
    var pts = stops.map(function (s, i) {
      var r = Math.floor(i / cols), c = i % cols;
      var k = r % 2 === 0 ? c : cols - 1 - c;              /* snake: every other row runs back */
      var x = rtl ? W - padX - k * colW : padX + k * colW;
      var y = single ? H * (c % 2 ? 0.68 : 0.3)             /* up, down, up, down */
                     : rowH * (r + 0.42) + (c % 2 ? 6 : -6); /* a little up-and-down, like a trail */
      s.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      return { x: x, y: y, r: r };
    });

    /* the map must be tall enough for its rows, and the panel must fit on screen */
    J.panel.innerHTML = "";
    var body = $("#journeyBody").getBoundingClientRect();
    var tooSmall = (single ? H < node * 2 + 36 : rowH < node + 30) || W < 260 ||
                   J.panel.getBoundingClientRect().bottom > body.bottom + 1;
    if (tooSmall) { unpin(); return; }

    /* ---- the path: gentle curves along a row, a U-turn between rows ---- */
    var d = "M" + pts[0].x.toFixed(1) + " " + pts[0].y.toFixed(1);
    for (var i = 1; i < n; i++) {
      var a = pts[i - 1], b = pts[i];
      if (a.r === b.r) {
        var dx = (b.x - a.x) / (single ? 1.8 : 3), wob = single ? 0 : (i % 2 ? 14 : -14);
        d += " C" + (a.x + dx).toFixed(1) + " " + (a.y + wob).toFixed(1) + " " +
             (b.x - dx).toFixed(1) + " " + (b.y - wob).toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
      } else {
        var prev = pts[i - 2] || { x: a.x - (rtl ? -1 : 1) };
        var out = a.x - prev.x >= 0 ? 1 : -1, bulge = Math.max(colW * 0.42, node);
        d += " C" + (a.x + out * bulge).toFixed(1) + " " + a.y.toFixed(1) + " " +
             (b.x + out * bulge).toFixed(1) + " " + b.y.toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
      }
    }
    J.svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    J.base.setAttribute("d", d);
    J.trail.setAttribute("d", d);
    J.len = J.trail.getTotalLength();
    J.trail.style.strokeDasharray = J.len + " " + J.len;

    /* where along the path each stop sits (nearest sampled point, in order) */
    var N = 900, k0 = 0, samples = [];
    for (var q = 0; q <= N; q++) samples.push(J.trail.getPointAtLength(J.len * q / N));
    J.stopAt = pts.map(function (p) {
      var best = k0, bestD = Infinity;
      for (var q2 = k0; q2 <= N; q2++) {
        var dd = Math.pow(samples[q2].x - p.x, 2) + Math.pow(samples[q2].y - p.y, 2);
        if (dd < bestD) { bestD = dd; best = q2; }
      }
      k0 = best;
      return best / N;
    });
    J.stops = stops;

    /* a short walk: a couple of scroll steps per stop */
    J.pinH = J.pin.offsetHeight;
    J.scrollLen = clamp(n * 170, 560, 1400);
    J.sec.style.height = Math.round(J.pinH + J.scrollLen) + "px";
    J.on = true;
    J.cur = -1;
    paintJourney();
  }

  var walkT = null, lastP = -1;
  function paintJourney() {
    if (!J.on) return;
    var top = J.sec.getBoundingClientRect().top - headerH();
    var p = clamp(-top / J.scrollLen, 0, 1);
    /* a short rest at both ends, so the first and last stops are clearly "reached" */
    var walk = clamp((p - 0.03) / 0.94, 0, 1);
    var at = J.len * walk;
    var pt = J.trail.getPointAtLength(at);
    var ahead = J.trail.getPointAtLength(Math.min(at + 3, J.len));
    var behind = J.trail.getPointAtLength(Math.max(at - 3, 0));
    var face = ahead.x - behind.x < -0.3 ? -1 : ahead.x - behind.x > 0.3 ? 1 : (isRtl() ? -1 : 1);
    J.kid.style.transform = "translate3d(" + pt.x.toFixed(1) + "px," + pt.y.toFixed(1) + "px,0) translate(-50%,-92%)";
    J.kid.style.setProperty("--face", face);
    J.trail.style.strokeDashoffset = (J.len - at).toFixed(1);

    if (Math.abs(p - lastP) > 0.0005) {
      J.kid.classList.add("walking");
      window.clearTimeout(walkT);
      walkT = window.setTimeout(function () { J.kid.classList.remove("walking"); }, 180);
      lastP = p;
    }

    var last = 0;
    J.stops.forEach(function (s, i) {
      var passed = walk >= J.stopAt[i] - 0.006;
      s.classList.toggle("passed", passed);
      if (passed) last = i;
    });
    if (last !== J.cur) {
      J.cur = last;
      J.stops.forEach(function (s, i) { s.classList.toggle("current", i === last); });
      J.panel.innerHTML = panelHtml(J.stops[last]);
    }
    if (J.count) {
      var nSes = 1;
      for (var i = last; i >= 0; i--) {
        var v = parseInt(J.stops[i].getAttribute("data-last"), 10);
        if (v) { nSes = v; break; }
      }
      var tpl = J.sec.getAttribute("data-progress-tpl") || "{n}";
      J.count.textContent = tpl.replace("{n}", nSes);
    }
  }

  /* tapping a stop on the map scrolls to the moment the kid reaches it */
  function setupJourneyClicks() {
    var sec = $("#journey");
    if (!sec || sec.getAttribute("data-clicks")) return;
    sec.setAttribute("data-clicks", "1");
    sec.addEventListener("click", function (e) {
      var n = e.target.closest && e.target.closest(".stop-node");
      if (!n || !J.on) return;
      var i = J.stops.indexOf(n.parentNode);
      if (i < 0) return;
      var secTop = J.sec.getBoundingClientRect().top + window.scrollY - headerH();
      var walk = J.stopAt[i], p = walk * 0.94 + 0.03 + 0.004;
      window.scrollTo({ top: secTop + p * J.scrollLen, behavior: "smooth" });
    });
  }

  /* ============================================================
     5. Mobile carousels ([data-carousel] + .carousel-dots)
     ============================================================ */
  var small = window.matchMedia ? window.matchMedia("(max-width: 820px)") : null;
  function setupCarousels() {
    $$("[data-carousel]").forEach(function (c) {
      var dots = $('[data-dots-for="' + c.id + '"]');
      var on = !!(small && small.matches);
      /* a scrollable strip must be reachable by keyboard */
      if (on) {
        c.setAttribute("tabindex", "0");
        c.setAttribute("role", "region");
        var h = c.closest("section") && $("h2", c.closest("section"));
        if (h) c.setAttribute("aria-label", h.textContent);
      } else {
        c.removeAttribute("tabindex"); c.removeAttribute("role"); c.removeAttribute("aria-label");
      }
      if (!dots) return;
      var n = c.children.length;
      if (dots.children.length !== n) dots.innerHTML = new Array(n + 1).join("<i></i>");
      var paint = function () {
        var w = c.children[0] ? c.children[0].getBoundingClientRect().width : 1;
        var i = clamp(Math.round(Math.abs(c.scrollLeft) / (w + 14)), 0, n - 1);
        $$("i", dots).forEach(function (d, k) { d.classList.toggle("on", k === i); });
      };
      if (!c.getAttribute("data-dots-wired")) {
        c.setAttribute("data-dots-wired", "1");
        c.addEventListener("scroll", paint, { passive: true });
      }
      paint();
    });
  }

  /* ============================================================
     Frame loop and wiring
     ============================================================ */
  var queued = false;
  function frame() {
    queued = false;
    if (calm()) return;
    paintParallax();
    paintJourney();
    /* keep easing the pointer tilt until it settles */
    if (Math.abs(pointer.tx - pointer.x) > 0.002 || Math.abs(pointer.ty - pointer.y) > 0.002) kick();
  }
  var queuedAt = 0;
  function kick() {
    /* a frame requested just before the tab went hidden may never arrive;
       don't let that block later updates */
    var now = Date.now();
    if (queued && now - queuedAt < 250) return;
    queued = true; queuedAt = now;
    nextFrame(frame);
  }

  function layoutSig() {
    return root.className.replace(/\bmotion-ok\b/, "").replace(/\s+/g, " ").trim() +
      "|" + window.getComputedStyle(root).fontSize + "|" + root.dir;
  }

  /* Phone browsers fire "resize" whenever the address bar slides in or out.
     Only a real change (width, or a big height change such as rotating the
     phone) is worth re-measuring the page for. */
  var lastW = window.innerWidth, lastH = window.innerHeight;
  function onResize() {
    var w = window.innerWidth, h = window.innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 160) { kick(); return; }
    lastW = w; lastH = h;
    relayout();
  }

  var resizeT = null;
  function relayout() {
    window.clearTimeout(resizeT);
    resizeT = window.setTimeout(function () {
      keepView(measureJourney);
      cacheBoxes();
      setupCarousels();
      kick();
    }, 120);
  }

  /* switching motion on or off (the system setting can change while the page is open) */
  var wasCalm = null;
  function applyMode() {
    var c = calm();
    if (c === wasCalm) return;
    wasCalm = c;
    if (c) {
      revealAll();
      root.classList.remove("motion-ok");
      resetParallax();
      unpin();
    } else {
      setupReveal();
      keepView(measureJourney);
      cacheBoxes();
      kick();
    }
  }

  /* Re-measuring unpins the journey for a moment, and the page is shorter while it
     is unpinned. Scrolled near the end of the page, the browser pulls the scroll
     position up to fit, and it stayed there once the journey was pinned again: a
     link to #contact ended 180-220px short of the form (12 Oct 2026), because the
     page re-measures at "load", when the fonts are ready and when the accessibility
     plugin touches <html>. So keep the view where it was: below the journey, move
     with its change in height; above or inside it, stay put. */
  function keepView(fn) {
    var sec = document.getElementById("journey");
    if (!sec) { fn(); return; }
    var y = window.scrollY, h = sec.offsetHeight, bottom = sec.getBoundingClientRect().top + y + h;
    fn();
    var want = y >= bottom ? y + (sec.offsetHeight - h) : y;
    if (Math.abs(window.scrollY - want) > 1) window.scrollTo({ top: want, behavior: "instant" });
  }

  function init() {
    setupParallax();
    setupPointer();
    setupReveal();
    keepView(measureJourney);
    cacheBoxes();          /* after the journey, which changes the page height */
    setupJourneyClicks();
    setupCarousels();
    wasCalm = calm();
    kick();

    /* the pinned journey changes the page height; land on the right anchor anyway */
    if (location.hash && J.on) {
      var target = document.getElementById(location.hash.slice(1));
      /* instant: a smooth flight across the whole page on arrival is disorienting */
      if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
    }

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize);
    if (mq && mq.addEventListener) mq.addEventListener("change", applyMode);
    if (small && small.addEventListener) small.addEventListener("change", setupCarousels);
    document.addEventListener("ng:langchange", function () {
      revealRerendered();
      setupParallax();
      relayout();
    });
    /* another age group redraws the journey's stops */
    document.addEventListener("ng:trackchange", relayout);
    /* An accessibility plugin may change classes or styles (text size, font,
       spacing) on <html>. Re-measure only when something that affects layout changed —
       this script writes to <html> too, and must not react to itself. */
    if ("MutationObserver" in window) {
      var sig = layoutSig();
      new MutationObserver(function () {
        applyMode();
        var now = layoutSig();
        if (now !== sig) { sig = now; relayout(); }
      }).observe(root, { attributes: true, attributeFilter: ["class", "style"] });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    window.addEventListener("load", relayout);
    window.addEventListener("beforeprint", revealAll);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
