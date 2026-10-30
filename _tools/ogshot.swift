// Renders a web page to a PNG with the system's own WebKit (no browser to
// install). Used by _tools/genog.py for the link-preview images:
//
//     swift _tools/ogshot.swift <url> <out.png> [width height]
//
// It refuses to save a picture in which something sticks out of the frame.
import Cocoa
import WebKit

let args = CommandLine.arguments
guard args.count >= 3, let url = URL(string: args[1]) else {
    FileHandle.standardError.write("usage: swift ogshot.swift <url> <out.png> [width height]\n".data(using: .utf8)!)
    exit(2)
}
let out = args[2]
let width = args.count > 4 ? (Double(args[3]) ?? 1200) : 1200
let height = args.count > 4 ? (Double(args[4]) ?? 630) : 630

func fail(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

final class Shooter: NSObject, WKNavigationDelegate {
    let web: WKWebView
    let window: NSWindow

    init(url: URL) {
        let frame = NSRect(x: 0, y: 0, width: width, height: height)
        web = WKWebView(frame: frame, configuration: WKWebViewConfiguration())
        // a borderless window far off screen: WebKit paints it, nobody sees it
        window = NSWindow(contentRect: frame.offsetBy(dx: -30000, dy: -30000),
                          styleMask: [.borderless], backing: .buffered, defer: false)
        super.init()
        window.contentView = web
        window.orderFrontRegardless()
        web.navigationDelegate = self
        web.load(URLRequest(url: url))
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        let check = """
            await document.fonts.ready;
            await new Promise(r => setTimeout(r, 400));
            const out = [...document.body.querySelectorAll("*")].filter(el => {
              const r = el.getBoundingClientRect();
              return r.width > 0 && (r.left < -0.5 || r.top < -0.5 || r.right > innerWidth + 0.5 || r.bottom > innerHeight + 0.5);
            }).map(el => el.tagName.toLowerCase() + (el.className ? "." + el.className : ""));
            return out.join(", ");
            """
        webView.callAsyncJavaScript(check, arguments: [:], in: nil, in: .page) { result in
            switch result {
            case .failure(let error): fail("check failed: \(error)")
            case .success(let value):
                if let list = value as? String, !list.isEmpty { fail("outside the frame: \(list)") }
            }
            let conf = WKSnapshotConfiguration()
            conf.rect = NSRect(x: 0, y: 0, width: width, height: height)
            webView.takeSnapshot(with: conf) { image, error in
                guard let image = image, let tiff = image.tiffRepresentation,
                      let rep = NSBitmapImageRep(data: tiff),
                      let png = rep.representation(using: .png, properties: [:]) else {
                    fail("snapshot failed: \(String(describing: error))")
                }
                do { try png.write(to: URL(fileURLWithPath: out)) } catch { fail("cannot write \(out): \(error)") }
                print("\(out): \(rep.pixelsWide)x\(rep.pixelsHigh)")
                exit(0)
            }
        }
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        fail("load failed: \(error.localizedDescription)")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        fail("load failed: \(error.localizedDescription) (is python3 _tools/serve.py running?)")
    }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let shooter = Shooter(url: url)
DispatchQueue.main.asyncAfter(deadline: .now() + 40) { fail("timed out") }
app.run()
