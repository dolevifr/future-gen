# -*- coding: utf-8 -*-
"""Render the link-preview images: the picture WhatsApp, Facebook and others
show with a shared link. The source is _archive/og-card.html.

    python3 _tools/serve.py            (in another window)
    python3 _tools/genog.py

Writes assets/og-image.jpg, 1200x630. Every page uses it, the English ones
too: the owner wants every shared link to show the Hebrew card. (The card
still renders in English with ?lang=en, should that change.) After changing
the picture, raise the ?v= number in the og:image addresses (README,
"תצוגה מקדימה בשיתוף"), or apps keep showing the old one.
"""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CARD = "http://127.0.0.1:4321/_archive/og-card.html"
TMP = os.path.join(HERE, "og-tmp.png")

OUT = os.path.join(ROOT, "assets", "og-image.jpg")

if subprocess.run(["swift", os.path.join(HERE, "ogshot.swift"), CARD, TMP]).returncode:
    sys.exit("og-image.jpg: not rendered (see the message above)")
subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "86",
                "-z", "630", "1200", TMP, "--out", OUT], check=True, stdout=subprocess.DEVNULL)
os.remove(TMP)
print("%s: %d KB" % (OUT, os.path.getsize(OUT) // 1024))
