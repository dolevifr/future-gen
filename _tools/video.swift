// Video helper for the hero video, built on the Mac's own AVFoundation
// (nothing to install). Used by _tools/genvideo.py; can also run by hand:
//
//   swift _tools/video.swift probe  <in.mp4>
//   swift _tools/video.swift frame  <in.mp4> <seconds> <out.jpg> [width] [jpeg quality 0-1]
//   swift _tools/video.swift sheet  <in.mp4> <out.jpg> [frames]
//   swift _tools/video.swift encode <in.mp4> <out.mp4> <height> <video kbps> <audio kbps>
//
// encode writes H.264 + AAC in an .mp4 with its index at the start, so a
// browser can start playing before the whole file has arrived.
import AVFoundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

func fail(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

let args = CommandLine.arguments
guard args.count >= 3 else {
    fail("usage: swift video.swift probe|frame|sheet|encode <in.mp4> ...")
}
let command = args[1]
let asset = AVURLAsset(url: URL(fileURLWithPath: args[2]))
guard let videoTrack = asset.tracks(withMediaType: .video).first else { fail("no video track in \(args[2])") }
let audioTrack = asset.tracks(withMediaType: .audio).first
let duration = CMTimeGetSeconds(asset.duration)

func writeJPEG(_ image: CGImage, to path: String, quality: Double) {
    guard let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: path) as CFURL,
                                                     UTType.jpeg.identifier as CFString, 1, nil) else {
        fail("cannot write \(path)")
    }
    CGImageDestinationAddImage(dest, image, [kCGImageDestinationLossyCompressionQuality: quality] as CFDictionary)
    if !CGImageDestinationFinalize(dest) { fail("cannot write \(path)") }
}

func frame(at seconds: Double, width: CGFloat?) -> CGImage {
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.requestedTimeToleranceBefore = .zero
    generator.requestedTimeToleranceAfter = .zero
    if let width = width { generator.maximumSize = CGSize(width: width, height: 0) }
    do {
        return try generator.copyCGImage(at: CMTime(seconds: seconds, preferredTimescale: 600), actualTime: nil)
    } catch {
        fail("no frame at \(seconds)s: \(error.localizedDescription)")
    }
}

switch command {
case "probe":
    print(String(format: "duration %.2fs, %d bytes", duration,
                 (try? FileManager.default.attributesOfItem(atPath: args[2])[.size] as? Int) ?? 0))
    for track in asset.tracks {
        let codec = (track.formatDescriptions.first.map { desc -> String in
            let code = CMFormatDescriptionGetMediaSubType(desc as! CMFormatDescription)
            return String(bytes: [24, 16, 8, 0].map { UInt8((code >> $0) & 0xff) }, encoding: .ascii) ?? "?"
        }) ?? "?"
        if track.mediaType == .video {
            let size = track.naturalSize.applying(track.preferredTransform)
            print(String(format: "video %@ %.0fx%.0f, %.2f fps, %.0f kbps", codec,
                         abs(size.width), abs(size.height), track.nominalFrameRate, track.estimatedDataRate / 1000))
        } else if track.mediaType == .audio {
            var detail = ""
            if let desc = track.formatDescriptions.first,
               let asbd = CMAudioFormatDescriptionGetStreamBasicDescription(desc as! CMAudioFormatDescription)?.pointee {
                detail = String(format: ", %.0f Hz, %d channel(s)", asbd.mSampleRate, asbd.mChannelsPerFrame)
            }
            print(String(format: "audio %@, %.0f kbps", codec, track.estimatedDataRate / 1000) + detail)
        }
    }

case "frame":
    guard args.count >= 5, let seconds = Double(args[3]) else { fail("frame <in> <seconds> <out.jpg> [width] [quality]") }
    let width = args.count > 5 ? Double(args[5]).map { CGFloat($0) } : nil
    let quality = args.count > 6 ? (Double(args[6]) ?? 0.8) : 0.8
    let image = frame(at: seconds, width: width)
    writeJPEG(image, to: args[4], quality: quality)
    print("\(args[4]): \(image.width)x\(image.height)")

case "sheet":
    // a grid of evenly spaced frames, to see what the video shows at a glance
    guard args.count >= 4 else { fail("sheet <in> <out.jpg> [frames]") }
    let count = args.count > 4 ? max(1, Int(args[4]) ?? 12) : 12
    let columns = 4, rows = (count + columns - 1) / columns, cellW = 480
    let first = frame(at: 0.1, width: CGFloat(cellW))
    let cellH = first.height
    guard let ctx = CGContext(data: nil, width: cellW * columns, height: cellH * rows, bitsPerComponent: 8,
                              bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(),
                              bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { fail("no canvas") }
    ctx.setFillColor(gray: 1, alpha: 1)
    ctx.fill(CGRect(x: 0, y: 0, width: cellW * columns, height: cellH * rows))
    for i in 0..<count {
        let t = count == 1 ? 0.1 : 0.1 + (duration - 0.3) * Double(i) / Double(count - 1)
        let image = frame(at: t, width: CGFloat(cellW))
        let x = (i % columns) * cellW, y = (rows - 1 - i / columns) * cellH
        ctx.draw(image, in: CGRect(x: x, y: y, width: cellW, height: cellH))
        print(String(format: "cell %d: %.1fs", i + 1, t))
    }
    writeJPEG(ctx.makeImage()!, to: args[3], quality: 0.8)

case "encode":
    guard args.count >= 7, let height = Int(args[4]), let videoKbps = Int(args[5]), let audioKbps = Int(args[6]) else {
        fail("encode <in> <out.mp4> <height> <video kbps> <audio kbps>")
    }
    let outURL = URL(fileURLWithPath: args[3])
    try? FileManager.default.removeItem(at: outURL)

    // output size: the same shape, `height` pixels tall at most, even numbers (H.264 needs them)
    let shown = videoTrack.naturalSize.applying(videoTrack.preferredTransform)
    let srcW = abs(shown.width), srcH = abs(shown.height)
    let outH = min(CGFloat(height), srcH)
    let outW = (srcW * outH / srcH / 2).rounded() * 2
    let rotated = abs(videoTrack.naturalSize.width - srcW) > 1    // a portrait clip stored sideways
    let encW = Int(rotated ? (outH / 2).rounded() * 2 : outW), encH = Int(rotated ? outW : (outH / 2).rounded() * 2)

    let reader: AVAssetReader
    let writer: AVAssetWriter
    do {
        reader = try AVAssetReader(asset: asset)
        writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
    } catch { fail("cannot open: \(error.localizedDescription)") }
    writer.shouldOptimizeForNetworkUse = true

    let videoOut = AVAssetReaderTrackOutput(track: videoTrack, outputSettings: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange])
    videoOut.alwaysCopiesSampleData = false
    reader.add(videoOut)
    let fps = videoTrack.nominalFrameRate > 0 ? Double(videoTrack.nominalFrameRate) : 30
    let videoIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: encW,
        AVVideoHeightKey: encH,
        AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: videoKbps * 1000,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoH264EntropyModeKey: AVVideoH264EntropyModeCABAC,
            AVVideoMaxKeyFrameIntervalDurationKey: 2.0,
            AVVideoExpectedSourceFrameRateKey: Int(fps.rounded()),
        ] as [String: Any],
    ])
    videoIn.transform = videoTrack.preferredTransform
    videoIn.expectsMediaDataInRealTime = false
    writer.add(videoIn)

    var audioOut: AVAssetReaderTrackOutput?
    var audioIn: AVAssetWriterInput?
    if let track = audioTrack {
        var rate = 48000.0, channels = 2
        if let desc = track.formatDescriptions.first,
           let asbd = CMAudioFormatDescriptionGetStreamBasicDescription(desc as! CMAudioFormatDescription)?.pointee {
            rate = asbd.mSampleRate
            channels = min(2, Int(asbd.mChannelsPerFrame))
        }
        let out = AVAssetReaderTrackOutput(track: track, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM])
        reader.add(out)
        let input = AVAssetWriterInput(mediaType: .audio, outputSettings: [
            AVFormatIDKey: kAudioFormatMPEG4AAC,
            AVNumberOfChannelsKey: channels,
            AVSampleRateKey: rate,
            AVEncoderBitRateKey: audioKbps * 1000,
        ])
        input.expectsMediaDataInRealTime = false
        writer.add(input)
        audioOut = out
        audioIn = input
    }

    guard reader.startReading() else { fail("cannot read: \(String(describing: reader.error))") }
    guard writer.startWriting() else { fail("cannot write: \(String(describing: writer.error))") }
    writer.startSession(atSourceTime: .zero)

    let group = DispatchGroup()
    func pump(_ input: AVAssetWriterInput, _ output: AVAssetReaderTrackOutput, _ name: String) {
        group.enter()
        var done = false
        input.requestMediaDataWhenReady(on: DispatchQueue(label: name)) {
            while !done && input.isReadyForMoreMediaData {
                if let buffer = output.copyNextSampleBuffer() {
                    if input.append(buffer) { continue }
                }
                done = true
                input.markAsFinished()
                group.leave()
            }
        }
    }
    pump(videoIn, videoOut, "video")
    if let input = audioIn, let output = audioOut { pump(input, output, "audio") }
    group.wait()

    if reader.status == .failed { fail("reading failed: \(String(describing: reader.error))") }
    let finished = DispatchSemaphore(value: 0)
    writer.finishWriting { finished.signal() }
    finished.wait()
    guard writer.status == .completed else { fail("writing failed: \(String(describing: writer.error))") }
    let size = (try? FileManager.default.attributesOfItem(atPath: args[3])[.size] as? Int) ?? 0
    print(String(format: "%@: %dx%d, %.1f MB", args[3], Int(outW), Int(outH), Double(size) / 1_048_576))

default:
    fail("unknown command \(command)")
}
