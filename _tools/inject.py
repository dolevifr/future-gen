# -*- coding: utf-8 -*-
"""Write the snapshots collected by _tools/snapshot.html back into the pages,
and build the pre-rendered English pages.

    python3 _tools/inject.py            (add --dry to only report)

Hebrew: in index.html, syllabus.html, about.html, games.html and accessibility.html, every container
rendered from data.js and every translated string (data-i18n), the title and
the description are set to exactly what main.js renders, so visitors without
JavaScript and search engines read the same page. On the home page the FAQ is
also written out as FAQPage structured data (faq_schema). Nothing else is touched.

English: index.en.html, syllabus.en.html, about.en.html, games.en.html and accessibility.en.html are rebuilt
from the (updated) Hebrew page: the same markup, with every translated string,
container, title and address in English. The link preview (og:, twitter:)
stays the Hebrew one. _redirects serves them at ?lang=en, so search engines
read English without running JavaScript. Never edit the .en.html files by
hand: change the Hebrew page, i18n.js or data.js, take a new snapshot and run
this again.
"""
import html as htmllib, io, json, os, re, sys
from urllib.parse import parse_qsl, urlencode

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DRY = "--dry" in sys.argv
PAGES = ("index", "syllabus", "about", "games", "accessibility")


def inner_at(h, start_tag):
    """(start, end) of the inner HTML of the element opened by the match `start_tag`."""
    tag, start = start_tag.group(1), start_tag.end()
    depth, pos = 1, start
    pat = re.compile(r'<(/?)%s\b[^>]*>' % tag)
    while depth:
        t = pat.search(h, pos)
        if not t:
            raise SystemExit("unclosed <%s> at offset %d" % (tag, start_tag.start()))
        depth += -1 if t.group(1) else 1
        pos = t.end()
    return start, t.start()


def inner_span(h, el_id):
    m = re.search(r'<([a-zA-Z0-9]+)\b[^>]*\bid="%s"[^>]*>' % re.escape(el_id), h)
    if not m:
        raise SystemExit("#%s not found" % el_id)
    return inner_at(h, m)


def clean(v):
    """Drop runtime-only state: reveal and journey progress classes."""
    def fix(m):
        words = [w for w in m.group(1).split() if w not in ("in", "passed", "current")]
        return 'class="%s"' % " ".join(words)
    return re.sub(r'class="([^"]*)"', fix, v)


def esc_text(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def esc_attr(s):
    return esc_text(s).replace('"', "&quot;")


def load_dictionary():
    src = io.open(os.path.join(ROOT, "assets", "js", "i18n.js"), encoding="utf-8").read()
    body = src[src.index("window.I18N = ") + len("window.I18N = "):].rstrip().rstrip(";")
    return json.loads(re.sub(r'(\n\s*)(he|en):', r'\1"\2":', body))


def apply_snapshot(h, snap, words, previews=True):
    """Put one language's rendered strings and containers into the page markup.
    `words` (that language's dictionary) covers strings the browser never
    rendered, e.g. inside <noscript>. previews=False leaves the link-preview
    tags (og:, twitter:) as they are. Returns the page and what changed."""
    changed = []

    def put(pattern, value, what):
        nonlocal h
        m = re.search(pattern, h)
        if not m:
            return
        if m.group(2) != value:
            changed.append(what)
            h = h[:m.start(2)] + value + h[m.end(2):]

    title, desc = esc_text(snap["title"]), esc_attr(snap["desc"])
    put(r'(<title>)([^<]*)</title>', title, "title")
    put(r'(<meta name="description" content=")([^"]*)"', desc, "description")
    if previews:
        put(r'(<meta property="og:title" content=")([^"]*)"', esc_attr(snap["title"]), "og:title")
        put(r'(<meta property="og:description" content=")([^"]*)"', desc, "og:description")
        put(r'(<meta name="twitter:title" content=")([^"]*)"', esc_attr(snap["title"]), "twitter:title")
        put(r'(<meta name="twitter:description" content=")([^"]*)"', desc, "twitter:description")

    for key in sorted(set(re.findall(r'\sdata-i18n="([^"]+)"', h))):
        value = snap["i18n"].get(key)
        if value is None:
            raw = words[key]
            value = raw if "<" in raw else esc_text(raw)
        value = clean(value)
        rx = re.compile(r'<([a-zA-Z0-9]+)\b[^>]*\sdata-i18n="%s"[^>]*>' % re.escape(key))
        pos = 0
        while True:
            m = rx.search(h, pos)
            if not m:
                break
            a, b = inner_at(h, m)
            if h[a:b] != value:
                changed.append(key)
            h = h[:a] + value + h[b:]
            pos = a + len(value)

    for spec, vals in snap["aria"].items():
        rx = re.compile(r'<[a-zA-Z0-9]+\b[^>]*\sdata-i18n-aria="%s"[^>]*>' % re.escape(spec))

        def fix_tag(m, vals=vals, spec=spec):
            tag = m.group(0)
            for name, val in vals.items():
                if val is not None:
                    tag = re.sub(r'(\s%s=")[^"]*(")' % re.escape(name),
                                 lambda mm: mm.group(1) + esc_attr(val) + mm.group(2), tag)
            if tag != m.group(0):
                changed.append(spec)
            return tag
        h = rx.sub(fix_tag, h)

    for el_id, value in snap["html"].items():
        a, b = inner_span(h, el_id)
        value = clean(value)
        if h[a:b] != value:
            changed.append("#" + el_id)
        h = h[:a] + value + h[b:]
    return h, sorted(set(changed))


def faq_schema(h):
    """The home page's questions and answers as FAQPage structured data, rebuilt
    from the page's own FAQ list, so the two never drift apart. It goes right
    after the main structured-data block. Returns the page and whether it changed."""
    a, b = inner_span(h, "faqList")
    items = re.findall(r'<summary>(.*?)</summary>\s*<div class="answer">(.*?)</div>', h[a:b], re.S)
    if not items:
        raise SystemExit("index.html: no questions found in #faqList")

    def text(s):
        s = htmllib.unescape(re.sub(r"<[^>]+>", "", s))
        return re.sub(r"\s+", " ", re.sub("[‎‏⁠]", "", s)).strip()

    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": text(q), "acceptedAnswer": {"@type": "Answer", "text": text(ans)}}
        for q, ans in items]}
    block = ('<script type="application/ld+json">\n' +
             json.dumps(data, ensure_ascii=False, indent=1) + "\n</script>\n")
    old = re.search(r'<script type="application/ld\+json">\n\{\n "@context": "https://schema.org",\n'
                    r' "@type": "FAQPage".*?</script>\n', h, re.S)
    if old:
        return h[:old.start()] + block + h[old.end():], old.group(0) != block
    first = re.search(r'<script type="application/ld\+json">.*?</script>\n', h, re.S)
    return h[:first.end()] + block + h[first.end():], True


# Same rule as syncLangLinks() in main.js: links to the bilingual pages keep ?lang=en.
BILINGUAL = re.compile(r'^(?:\.?/)?(?:index|syllabus|about|games|accessibility)?(?:\.html)?$')


def english_href(href):
    hash_ = ""
    if "#" in href:
        href, hash_ = href.split("#", 1)
        hash_ = "#" + hash_
    query = ""
    if "?" in href:
        href, query = href.split("?", 1)
    if not href and not query:
        return None                      # "#section" stays on this page
    if not BILINGUAL.match(href):
        return None                      # other sites, mail, phone, legal pages
    params = parse_qsl(query, keep_blank_values=True)
    if any(k == "lang" for k, _ in params):
        params = [(k, "en" if k == "lang" else v) for k, v in params]
    else:
        params.append(("lang", "en"))
    return href + "?" + urlencode(params) + hash_


def build_english(page, h, snap, words):
    def sub1(pattern, repl):
        nonlocal h
        new, n = re.subn(pattern, repl, h, count=1)
        if n != 1:
            raise SystemExit("%s.en.html: not found: %s" % (page, pattern))
        h = new

    sub1(r'<!doctype html>\n', lambda m: m.group(0) +
         "<!-- Built by _tools/inject.py from %s.html; served at ?lang=en. Don't edit by hand. -->\n" % page)
    sub1(r'<html lang="he" dir="rtl">', lambda m: '<html lang="en" dir="ltr">')
    # The link preview (WhatsApp, Facebook: og:, twitter:) stays Hebrew, the same
    # card as the Hebrew page, even for an English link: the owner's choice
    # (3 Oct 2026). Only the title and description that Google shows are English.
    base = re.search(r'<link rel="canonical" href="([^"]*)">', h).group(1)
    sub1(r'<link rel="canonical" href="[^"]*">',
         lambda m: '<link rel="canonical" href="%s?lang=en" data-base="%s">' % (base, base))
    # the structured data describes the business once, on the Hebrew pages
    h = re.sub(r'<script type="application/ld\+json">.*?</script>\n', "", h, flags=re.S)
    # English text is set in the Latin font files: preload those instead of the Hebrew ones
    for font in ("rubik", "heebo"):
        sub1(r'href="([^"]*)%s-hebrew\.woff2"' % font,
             lambda m, font=font: 'href="%s%s-latin.woff2"' % (m.group(1), font))

    h, _ = apply_snapshot(h, snap, words, previews=False)

    # the language switch shows English as the current language
    for old, new in (('class="lang-btn is-active" data-lang="he"', 'class="lang-btn" data-lang="he"'),
                     ('class="lang-btn" data-lang="en"', 'class="lang-btn is-active" data-lang="en"')):
        if h.count(old) != 1:
            raise SystemExit("%s.en.html: language switch not found" % page)
        h = h.replace(old, new)

    def fix_href(m):
        new = english_href(htmllib.unescape(m.group(2)))
        return m.group(0) if new is None else m.group(1) + esc_attr(new) + m.group(3)
    h = re.sub(r'(<a\b[^>]*?\shref=")([^"]*)(")', fix_href, h)
    # the cookies link opens the English part of the privacy policy (analytics.js does the same)
    h = re.sub(r'(<a\b[^>]*\shref="[^"#]*)#p-cookies("[^>]*\sdata-cookie-settings)', r'\1#en-cookies\2', h)

    # report any Hebrew left in text or in attributes people (or crawlers) read
    shown = re.sub(r'<script\b.*?</script>|<style\b.*?</style>|<!--.*?-->', " ", h, flags=re.S)
    shown = re.sub(r'<meta (?:property="og:|name="twitter:)[^>]*>', " ", shown)   # Hebrew on purpose
    left = [t.strip() for t in re.findall(r'>([^<]*[֐-׿][^<]*)<', shown)]
    left += re.findall(r'\s(?:aria-label|title|alt|placeholder|content)="([^"]*[֐-׿][^"]*)"', shown)
    left = [t for t in left if t != "עב"]    # the name of the Hebrew button stays Hebrew
    if left:
        print("%s.en.html: Hebrew left in %d place(s):" % (page, len(left)))
        for t in left:
            print("   ", t[:90])
    return h


words = load_dictionary()
for page in PAGES:
    html_path = os.path.join(ROOT, page + ".html")
    h = io.open(html_path, encoding="utf-8").read()

    he_path = os.path.join(HERE, "snap-%s.json" % page)
    if not os.path.exists(he_path):
        print("%s: no Hebrew snapshot (open /_tools/snapshot.html first)" % page)
    else:
        h, changed = apply_snapshot(h, json.load(open(he_path, encoding="utf-8")), words["he"])
        if page == "index":
            h, faq_changed = faq_schema(h)
            if faq_changed:
                changed.append("FAQ structured data")
        if not DRY:
            io.open(html_path, "w", encoding="utf-8").write(h)
            os.remove(he_path)
        print("%s.html: %s%s" % (page, ("updated: " + ", ".join(changed)) if changed else "already in sync",
                                 " (dry run)" if DRY else ""))

    en_path = os.path.join(HERE, "snap-%s-en.json" % page)
    if not os.path.exists(en_path):
        print("%s: no English snapshot (open /_tools/snapshot.html first)" % page)
        continue
    out = build_english(page, h, json.load(open(en_path, encoding="utf-8")), words["en"])
    out_path = os.path.join(ROOT, page + ".en.html")
    same = os.path.exists(out_path) and io.open(out_path, encoding="utf-8").read() == out
    if not DRY:
        io.open(out_path, "w", encoding="utf-8").write(out)
        os.remove(en_path)
    print("%s.en.html: %s%s" % (page, "unchanged" if same else "written", " (dry run)" if DRY else ""))
