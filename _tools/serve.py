# -*- coding: utf-8 -*-
"""Local preview server for the site.

    python3 _tools/serve.py        then open http://127.0.0.1:4321

It serves the project folder with caching off (so edits show on reload) and
accepts the snapshots posted by _tools/snapshot.html (see README, "רינדור מוקדם"),
and the prompt game's styles and picture posted by _tools/gamebuild.html
(README, "משחק הפרומפטים").
It answers byte-range requests and several requests at once, like Netlify:
Safari plays a video only from a server that does.
"""
import http.server, socketserver, os, re, urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
os.chdir(ROOT)

# What _tools/gamebuild.html may write, and how each file must begin.
GAME_FILES = {
    "tailwind": ("assets/game/tailwind.css", b"/* Built by _tools/gamebuild.html"),
    "poster": ("assets/game/poster.jpg", b"\xff\xd8\xff"),
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def do_POST(self):
        url = urllib.parse.urlparse(self.path)
        if url.path == "/__game":
            self.save_game_file(url)
            return
        if url.path != "/__snapshot":
            self.send_error(404)
            return
        page = urllib.parse.parse_qs(url.query).get("page", ["index"])[0]
        if page not in ("index", "syllabus", "about", "games", "accessibility",
                        "index-en", "syllabus-en", "about-en", "games-en", "accessibility-en"):
            self.send_error(400)
            return
        n = int(self.headers.get("Content-Length", 0))
        with open(os.path.join(HERE, "snap-%s.json" % page), "wb") as f:
            f.write(self.rfile.read(n))
        self.send_response(204)
        self.end_headers()

    def save_game_file(self, url):
        name = urllib.parse.parse_qs(url.query).get("file", [""])[0]
        if name not in GAME_FILES:
            self.send_error(400)
            return
        path, start = GAME_FILES[name]
        n = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(n)
        if not body.startswith(start) or n > 3000000:
            self.send_error(400)
            return
        with open(os.path.join(ROOT, path), "wb") as f:
            f.write(body)
        self.send_response(204)
        self.end_headers()

    def send_head(self):
        """A "Range: bytes=a-b" request gets just that part (206)."""
        path = self.translate_path(self.path)
        m = re.match(r"bytes=(\d*)-(\d*)$", (self.headers.get("Range") or "").strip())
        if not m or not os.path.isfile(path) or not (m.group(1) or m.group(2)):
            return super().send_head()
        size = os.path.getsize(path)
        if m.group(1):
            start = int(m.group(1))
            end = min(int(m.group(2)), size - 1) if m.group(2) else size - 1
        else:                                   # "bytes=-500": the last 500 bytes
            start, end = max(0, size - int(m.group(2))), size - 1
        if start >= size or start > end:
            self.send_error(416)
            return None
        f = open(path, "rb")
        f.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        self.remaining = end - start + 1
        return f

    def copyfile(self, source, outputfile):
        left = getattr(self, "remaining", None)
        if left is None:
            return super().copyfile(source, outputfile)
        self.remaining = None
        while left > 0:
            chunk = source.read(min(65536, left))
            if not chunk:
                break
            outputfile.write(chunk)
            left -= len(chunk)

    def log_message(self, *args):
        pass


class Server(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True


with Server(("127.0.0.1", 4321), Handler) as httpd:
    print("Serving %s at http://127.0.0.1:4321  (Ctrl+C to stop)" % ROOT)
    httpd.serve_forever()
