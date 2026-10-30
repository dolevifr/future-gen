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

  /* English is off for now (LANGS in main.js), so the site is always Hebrew */
  setMenuLang("he");
})();
