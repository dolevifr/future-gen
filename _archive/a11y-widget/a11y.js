/* ============================================================
   נגישות — accessibility widget
   Builds the launcher + panel, applies user preference modes as
   classes on <html>, and remembers the choice across visits.

   The widget is an ENHANCEMENT. The page itself is built to meet
   IS 5568 (WCAG 2.0 AA) without it — semantic landmarks, labelled
   controls, keyboard operability, visible focus and AA contrast.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "ng.a11y";
  var SCALES = [1, 1.15, 1.3, 1.45, 1.6];

  /* mode id -> <html> class. `dark` and `light` are mutually exclusive. */
  var MODES = [
    { id: "dark",     cls: "a11y-dark",     icon: "◑", group: "color", exclusive: "contrast" },
    { id: "light",    cls: "a11y-light",    icon: "☀️", group: "color", exclusive: "contrast" },
    { id: "gray",     cls: "a11y-gray",     icon: "▨", group: "color" },
    { id: "links",    cls: "a11y-links",    icon: "🔗", group: "read" },
    { id: "readable", cls: "a11y-readable", icon: "🔤", group: "read" },
    { id: "spacing",  cls: "a11y-spacing",  icon: "↕️", group: "read" },
    { id: "nomotion", cls: "a11y-nomotion", icon: "⏸️", group: "nav" },
    { id: "cursor",   cls: "a11y-cursor",   icon: "🖱️", group: "nav" },
    { id: "focus",    cls: "a11y-focus",    icon: "⌨️", group: "nav" }
  ];

  var state = { scale: 0, on: {} };
  var panel, launcher, overlay, live, lastFocus;

  /* ---------- helpers ---------- */
  function t(key, vars) {
    var dict = (window.I18N && window.I18N[document.documentElement.lang]) ||
               (window.I18N && window.I18N.he) || {};
    var val = dict[key] != null ? dict[key] : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) { val = val.split("{" + k + "}").join(vars[k]); });
    }
    return val;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        state.scale = Math.min(Math.max(parsed.scale | 0, 0), SCALES.length - 1);
        state.on = parsed.on && typeof parsed.on === "object" ? parsed.on : {};
      }
    } catch (e) { /* private mode, corrupt value — ignore */ }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function announce(msg) {
    if (!live) return;
    live.textContent = "";
    window.setTimeout(function () { live.textContent = msg; }, 60);
  }

  /* ---------- applying state to the document ---------- */
  function apply() {
    var root = document.documentElement;
    root.style.setProperty("--a11y-scale", SCALES[state.scale]);
    MODES.forEach(function (m) { root.classList.toggle(m.cls, !!state.on[m.id]); });
    root.classList.toggle("a11y-active", isAnyOn());
    root.classList.toggle("a11y-big", SCALES[state.scale] >= 1.3);
  }
  function isAnyOn() {
    if (state.scale > 0) return true;
    for (var k in state.on) { if (state.on[k]) return true; }
    return false;
  }

  function setMode(id, value) {
    var mode = MODES.filter(function (m) { return m.id === id; })[0];
    if (!mode) return;
    if (value && mode.exclusive) {
      MODES.forEach(function (other) {
        if (other !== mode && other.exclusive === mode.exclusive) state.on[other.id] = false;
      });
    }
    state.on[id] = !!value;
    apply(); save(); paint();
    announce(t("a11y." + id) + " — " + t(value ? "a11y.on" : "a11y.off"));
  }
  function stepScale(delta) {
    var next = Math.min(Math.max(state.scale + delta, 0), SCALES.length - 1);
    if (next === state.scale) return;
    state.scale = next;
    apply(); save(); paint();
    announce(t("a11y.announceSize", { n: Math.round(SCALES[state.scale] * 100) }));
  }
  function resetAll() {
    state = { scale: 0, on: {} };
    apply(); save(); paint();
    announce(t("a11y.announceReset"));
  }

  /* ---------- rendering ---------- */
  function optHtml(m) {
    var on = !!state.on[m.id];
    return '<button type="button" class="a11y-opt" data-mode="' + m.id + '" aria-pressed="' + on + '">' +
      '<span class="ico" aria-hidden="true">' + m.icon + "</span>" +
      '<span class="lbl">' + esc(t("a11y." + m.id)) + "</span>" +
      '<span class="state" aria-hidden="true"></span></button>';
  }
  function groupHtml(key, titleKey) {
    var items = MODES.filter(function (m) { return m.group === key; });
    return '<div class="a11y-group"><h3>' + esc(t(titleKey)) + "</h3>" +
      items.map(optHtml).join("") + "</div>";
  }

  function paint() {
    if (!panel) return;
    var pct = Math.round(SCALES[state.scale] * 100);
    panel.innerHTML =
      '<div class="a11y-head">' +
        '<h2 id="a11yTitle">' + esc(t("a11y.title")) + "</h2>" +
        '<button type="button" class="a11y-close" data-close aria-label="' + esc(t("a11y.close")) + '">✕</button>' +
      "</div>" +
      '<div class="a11y-group"><h3>' + esc(t("a11y.groupText")) + "</h3>" +
        '<div class="a11y-row">' +
          '<button type="button" class="a11y-step" data-scale="-1" aria-label="' + esc(t("a11y.decrease")) + '">A−</button>' +
          '<span class="a11y-size" aria-hidden="true">' + pct + "%</span>" +
          '<button type="button" class="a11y-step" data-scale="1" aria-label="' + esc(t("a11y.increase")) + '">A+</button>' +
        "</div></div>" +
      groupHtml("color", "a11y.groupColor") +
      groupHtml("read", "a11y.groupRead") +
      groupHtml("nav", "a11y.groupNav") +
      '<button type="button" class="a11y-reset" data-reset>' + esc(t("a11y.reset")) + "</button>" +
      '<p class="a11y-foot"><a href="' + "/accessibility.html" + '" data-close-go>' + esc(t("a11y.statementLink")) + "</a></p>";
    if (launcher) launcher.setAttribute("aria-label", t("a11y.btnLabel"));
  }

  /* ---------- open / close with a focus trap ---------- */
  function focusables() {
    return [].slice.call(panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }
  function open() {
    lastFocus = document.activeElement;
    panel.hidden = false; overlay.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    paint();
    var f = focusables();
    if (f.length) f[0].focus();
    document.addEventListener("keydown", onKeydown, true);
  }
  function close(restore) {
    panel.hidden = true; overlay.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onKeydown, true);
    if (restore !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKeydown(ev) {
    if (panel.hidden) return;
    if (ev.key === "Escape") { ev.preventDefault(); close(); return; }
    if (ev.key !== "Tab") return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }

  /* ---------- build ---------- */
  function build() {
    live = document.createElement("div");
    live.className = "sr-only";
    live.id = "a11yLive";
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");

    overlay = document.createElement("div");
    overlay.className = "a11y-overlay";
    overlay.hidden = true;
    overlay.addEventListener("click", function () { close(); });

    launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "a11y-btn";
    launcher.id = "a11yBtn";
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "a11yPanel");
    launcher.setAttribute("aria-label", t("a11y.btnLabel"));
    launcher.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="4" r="2" fill="currentColor" stroke="none"/>' +
      '<path d="M4 8h16"/><path d="M12 8v6"/><path d="m8.5 21 3.5-7 3.5 7"/></svg>';
    launcher.addEventListener("click", function () {
      if (panel.hidden) open(); else close();
    });

    panel = document.createElement("div");
    panel.className = "a11y-panel";
    panel.id = "a11yPanel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "a11yTitle");
    panel.addEventListener("click", function (ev) {
      var el = ev.target.closest("button, a");
      if (!el) return;
      if (el.hasAttribute("data-close")) { close(); return; }
      if (el.hasAttribute("data-close-go")) { close(false); return; }
      if (el.hasAttribute("data-reset")) { resetAll(); return; }
      if (el.hasAttribute("data-scale")) { stepScale(+el.getAttribute("data-scale")); return; }
      var mode = el.getAttribute("data-mode");
      if (mode) setMode(mode, el.getAttribute("aria-pressed") !== "true");
    });

    document.body.appendChild(live);
    document.body.appendChild(overlay);
    document.body.appendChild(launcher);
    document.body.appendChild(panel);
  }

  function init() {
    load();
    build();
    apply();
    paint();
    document.addEventListener("ng:langchange", function () {
      launcher.setAttribute("aria-label", t("a11y.btnLabel"));
      if (!panel.hidden) paint();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.A11Y = { reset: resetAll, apply: apply };
})();
