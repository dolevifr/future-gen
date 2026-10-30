# -*- coding: utf-8 -*-
"""Prepare the hero video: a lighter copy for the site and its cover picture.

    python3 _tools/genvideo.py "<the original video>" [cover second]

Writes assets/hero.mp4 (H.264, 720p, 2 Mbit/s video + 128 kbit/s sound) and
assets/hero-poster.jpg (the frame at [cover second], 960px wide), which shows
until the visitor presses play. Uses _tools/video.swift, i.e. the Mac's own
AVFoundation: nothing to install.

Why 720p at 2 Mbit/s: the October 2026 clips (and version 2, 4 October)
arrived as 1080p at 5 Mbit/s (46 MB for 69 seconds). Side by side, frame for
frame, the 720p copy looked the same, also full screen and in the fast-motion
scene (the source has no more detail than that), at 17.5 MB; 1080p would be
30 MB for no visible gain. The cover default, 13.5 s, is the three-pillar
frame in both versions; pick another second for another video
(swift _tools/video.swift sheet <video> <out.jpg> shows frames to choose from).
"""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if len(sys.argv) < 2:
    sys.exit(__doc__)
SOURCE = sys.argv[1]
COVER = sys.argv[2] if len(sys.argv) > 2 else "13.5"


def swift(*args):
    if subprocess.run(["swift", "-suppress-warnings", os.path.join(HERE, "video.swift")] + list(args)).returncode:
        sys.exit("stopped: see the message above")


swift("encode", SOURCE, os.path.join(ROOT, "assets", "hero.mp4"), "720", "2000", "128")
swift("frame", SOURCE, COVER, os.path.join(ROOT, "assets", "hero-poster.jpg"), "960", "0.72")
