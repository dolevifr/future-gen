# -*- coding: utf-8 -*-
"""Copy the header and footer of index.html into the other main pages.

    python3 _tools/sync_shell.py        (add --dry to only report)

index.html is the single source for the header (logo, menu, language switch,
call to action) and the footer. On the other pages, links to sections of the
home page become "./#section" and the logo links to "./".
"""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAGES = ["syllabus.html", "about.html", "games.html", "accessibility.html"]
DRY = "--dry" in sys.argv


def block(h, start_marker, end_marker):
    a = h.index(start_marker)
    b = h.index(end_marker, a) + len(end_marker)
    return a, b


def for_other_page(fragment):
    # in-page anchors on the home page become links back to it
    fragment = re.sub(r'href="#(?!main")([\w-]+)"', r'href="./#\1"', fragment)
    fragment = fragment.replace('href="./#top"', 'href="./"')
    return fragment


home = io.open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
HEADER = ('<header class="site-header"', "</header>")
FOOTER = ('<footer class="site-footer">', "</footer>")
parts = {}
for name, (s, e) in (("header", HEADER), ("footer", FOOTER)):
    a, b = block(home, s, e)
    parts[name] = for_other_page(home[a:b])

for page in PAGES:
    path = os.path.join(ROOT, page)
    h = io.open(path, encoding="utf-8").read()
    before = h
    for name, (s, e) in (("header", HEADER), ("footer", FOOTER)):
        a, b = block(h, s, e)
        h = h[:a] + parts[name] + h[b:]
    if h == before:
        print("%s: already in sync" % page)
    else:
        print("%s: header/footer updated%s" % (page, " (dry run)" if DRY else ""))
        if not DRY:
            io.open(path, "w", encoding="utf-8").write(h)
