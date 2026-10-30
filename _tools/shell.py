# -*- coding: utf-8 -*-
"""Shared shell for the secondary pages. `root` is "" for pages served
at the site root and "/" for 404.html, which Netlify serves at any path."""

def page(title, desc, path, body, root="", noindex=False, extra_head="", extra_js="", body_attrs=""):
    r = root
    robots = '<meta name="robots" content="noindex">\n' if noindex else ''
    # Netlify serves the page at /privacy (and rewrites links to it), so that is the address we declare
    url = 'https://future-gen.co.il/' + (path[:-len('.html')] if path.endswith('.html') else path)
    canon = '' if noindex else '<link rel="canonical" href="%s">\n<meta property="og:url" content="%s">\n' % (url, url)
    return f'''<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
{robots}{canon}<meta property="og:type" content="website">
<meta property="og:site_name" content="FutureGen Academy">
<meta property="og:locale" content="he_IL">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://future-gen.co.il/assets/og-image.jpg?v=2">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="FutureGen Academy — בינה מלאכותית, יזמות ואוריינות פיננסית. חוג שנתי לגילאי 10 עד 16.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://future-gen.co.il/assets/og-image.jpg?v=2">
<meta name="theme-color" content="#6B4EFF">
<link rel="icon" href="{r}assets/favicon-64.png" type="image/png" sizes="64x64">
<link rel="icon" href="{r}assets/apple-touch-icon.png" type="image/png" sizes="180x180">
<link rel="apple-touch-icon" href="{r}assets/apple-touch-icon.png">
<link rel="preload" href="{r}assets/fonts/rubik-hebrew.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{r}assets/fonts/heebo-hebrew.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{r}assets/css/fonts.css?v=4">
<link rel="stylesheet" href="{r}assets/css/styles.css?v=4">
{extra_head}</head>
<body{body_attrs}>
<a class="skip-link" href="#main">דילוג לתוכן הראשי</a>

<header class="doc-top">
  <div class="container doc-top-inner">
    <a class="brand" href="{r or ''}index.html" aria-label="FutureGen Academy — לדף הבית">
      <span class="brand-mark" aria-hidden="true"><img src="{r}assets/logo-mark.png" alt="" width="44" height="41" decoding="async"></span>
      <span class="brand-text"><b>FutureGen</b><span>Academy</span></span>
    </a>
    <a class="btn btn-outline doc-back" href="{r or ''}index.html">חזרה לאתר</a>
  </div>
</header>

<main id="main" class="doc">
{body}
</main>

<footer class="doc-foot">
  <div class="container doc-foot-inner">
    <p style="margin:0">© <span dir="ltr">2026 FutureGen Academy</span></p>
    <nav aria-label="קישורים משפטיים">
      <a href="{r}privacy.html">מדיניות פרטיות</a>
      <a href="{r}terms.html">תנאי שימוש</a>
      <a href="{r}cancel.html">ביטול עסקה</a>
      <a href="{r}accessibility.html">הצהרת נגישות</a>
      <a href="{r}privacy.html#p-cookies" data-cookie-settings>בלי עוגיות מעקב</a>
    </nav>
  </div>
</footer>

<script src="{r}assets/js/i18n.js?v=4"></script>
<script src="{r}assets/js/analytics.js?v=4"></script>
<!-- accessibility button and menu (TAB-NAV); a11y-lang.js opens the menu in the page's language -->
<script src="{r}assets/js/a11y-lang.js?v=4"></script>
<script src="https://widget.tabnav.com/widget.min.js.gz" defer></script>
{extra_js}</body>
</html>
'''
