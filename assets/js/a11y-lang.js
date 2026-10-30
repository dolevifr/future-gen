/* TAB-NAV (the accessibility button) opens its menu in the language set for
   this domain on TabNav's side, which is English. Until a visitor picks a
   language in the menu, open it in the language of the page instead.

   The widget keeps its settings in localStorage "userSettings" and reads
   "language" from there when the menu first opens; it fills in everything
   else itself. "ng.a11yLang" remembers what this script set, so a language
   the visitor chose in the menu is never replaced. The values are the ones
   the menu itself stores (checked on the live site, 7 Oct 2026).

   Loaded right before the TAB-NAV tag. main.js calls fgA11yLang() when the
   visitor switches the site's language. */
(function () {
  var MENU = {
    he: { acronym: "HE", lang: "עברית (Hebrew)" },
    en: { acronym: "US", lang: "English (USA)" }
  };

  function setMenuLang(lang) {
    try {
      var want = MENU[lang] || MENU.he;
      var settings = JSON.parse(localStorage.getItem("userSettings") || "null") || {};
      var have = settings.language && settings.language.acronym;
      if (have && have !== localStorage.getItem("ng.a11yLang")) return;   /* chosen in the menu */
      settings.language = want;
      localStorage.setItem("userSettings", JSON.stringify(settings));
      localStorage.setItem("ng.a11yLang", want.acronym);
    } catch (e) { /* storage blocked or unreadable: the menu opens in its own default */ }
  }
  window.fgA11yLang = setMenuLang;

  /* the same order main.js uses: ?lang= in the address, then the visitor's
     saved choice, then the language the page is written in */
  var fromUrl = /[?&]lang=(he|en)\b/.exec(location.search);
  var saved = null;
  try { saved = localStorage.getItem("ng.lang"); } catch (e) { /* storage blocked */ }
  setMenuLang(fromUrl ? fromUrl[1]
    : saved === "he" || saved === "en" ? saved
    : document.documentElement.lang === "en" ? "en" : "he");
})();
