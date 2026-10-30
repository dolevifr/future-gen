# -*- coding: utf-8 -*-
import sys, io, os
# Run from anywhere:  python3 _tools/gen404.py
# Writes the page into the project root, next to index.html.
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
os.chdir(os.path.dirname(HERE))
from shell import page
body = '''  <div class="container nf">
    <p class="nf-code" aria-hidden="true">404</p>
    <h1>העמוד לא נמצא</h1>
    <p class="lead">הקישור שלחצתם עליו לא קיים, או שהעמוד הועבר. אפשר לחזור לדף הבית או לקפוץ ישר לסילבוס.</p>
    <div class="nf-actions">
      <a class="btn btn-primary btn-lg" href="/">לדף הבית</a>
      <a class="btn btn-outline btn-lg" href="/syllabus.html">לסילבוס המלא</a>
    </div>
    <p lang="en" dir="ltr" class="muted">Page not found. <a href="/">Back to the home page</a>.</p>
  </div>'''
io.open('404.html','w',encoding='utf-8').write(
    page('העמוד לא נמצא — FutureGen Academy', 'העמוד המבוקש לא נמצא.', '404.html', body, root='/', noindex=True,
         body_attrs=' data-page-event="page_not_found"'))
print('404.html written')
