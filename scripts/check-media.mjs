import { spawnSync } from 'node:child_process'
import { closeSync, fstatSync, openSync, readSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const defaultMediaRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../public/media')
const compatibleVideoEntries = new Set(['avc1', 'avc3'])

function readAt(fd, length, position) {
  const bytes = Buffer.alloc(length)
  if (readSync(fd, bytes, 0, length, position) !== length) throw new Error(`truncated data at ${position}`)
  return bytes
}

function boxes(fd, start, end) {
  const result = []
  let position = start
  while (position < end) {
    if (end - position < 8) throw new Error(`incomplete box header at ${position}`)
    const header = readAt(fd, 8, position)
    const type = header.toString('latin1', 4, 8)
    let size = header.readUInt32BE(0)
    let headerLength = 8
    if (size === 1) {
      if (end - position < 16) throw new Error(`incomplete extended box at ${position}`)
      const extended = readAt(fd, 8, position + 8).readBigUInt64BE()
      if (extended > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`oversized box at ${position}`)
      size = Number(extended)
      headerLength = 16
    } else if (size === 0) {
      size = end - position
    }
    if (size < headerLength || size > end - position) throw new Error(`invalid ${type} box size at ${position}`)
    result.push({ type, start: position, payloadStart: position + headerLength, end: position + size })
    position += size
  }
  return result
}

function child(fd, parent, type) {
  return parent && boxes(fd, parent.payloadStart, parent.end).find((entry) => entry.type === type)
}

function readTrack(fd, track) {
  const mdia = child(fd, track, 'mdia')
  const handlerBox = child(fd, mdia, 'hdlr')
  const handler = handlerBox && handlerBox.end - handlerBox.payloadStart >= 12
    ? readAt(fd, 4, handlerBox.payloadStart + 8).toString('latin1')
    : 'unknown'
  const stsd = child(fd, child(fd, child(fd, mdia, 'minf'), 'stbl'), 'stsd')
  const sampleEntries = []
  if (stsd) {
    if (stsd.end - stsd.payloadStart < 8) throw new Error(`incomplete stsd at ${stsd.start}`)
    const count = readAt(fd, 4, stsd.payloadStart + 4).readUInt32BE()
    const entries = boxes(fd, stsd.payloadStart + 8, stsd.end)
    if (entries.length !== count) throw new Error(`invalid stsd entry count at ${stsd.start}`)
    for (const entry of entries) {
      const sample = { codec: entry.type }
      // AudioSampleEntry stores channelcount 16 bytes into its payload.
      if (handler === 'soun' && entry.end - entry.payloadStart >= 18) {
        sample.channels = readAt(fd, 2, entry.payloadStart + 16).readUInt16BE()
      }
      sampleEntries.push(sample)
    }
  }
  return { handler, sampleEntries }
}

export function inspectMp4(file) {
  const issues = []
  const result = { bytes: 0, fastStart: false, tracks: [], issues }
  let fd
  try {
    fd = openSync(file, 'r')
    result.bytes = fstatSync(fd).size
    const top = boxes(fd, 0, result.bytes)
    const ftyp = top.find((entry) => entry.type === 'ftyp')
    const moov = top.find((entry) => entry.type === 'moov')
    const mdat = top.find((entry) => entry.type === 'mdat')
    if (!ftyp) issues.push({ code: 'missing_ftyp' })
    if (!moov) issues.push({ code: 'missing_moov' })
    if (!mdat) issues.push({ code: 'missing_mdat' })
    if (moov && mdat) {
      result.fastStart = moov.start < mdat.start
      if (!result.fastStart) issues.push({ code: 'late_moov' })
    }
    if (moov) {
      result.tracks = boxes(fd, moov.payloadStart, moov.end)
        .filter((entry) => entry.type === 'trak').map((entry) => readTrack(fd, entry))
      if (!result.tracks.some((track) => track.handler === 'vide')) issues.push({ code: 'missing_video_track' })
      for (const track of result.tracks) {
        if (track.handler === 'soun') issues.push({ code: 'audio_track', codecs: track.sampleEntries })
        if (track.handler === 'vide' && track.sampleEntries.some((entry) => !compatibleVideoEntries.has(entry.codec))) {
          issues.push({ code: 'unsupported_video_sample_entry', codecs: track.sampleEntries })
        }
      }
    }
  } catch (error) {
    issues.push({ code: fd === undefined ? 'unreadable_file' : 'malformed_mp4', detail: error instanceof Error ? error.message.replaceAll(file, '[file]') : 'unknown' })
  } finally {
    if (fd !== undefined) closeSync(fd)
  }
  return result
}

function probeWithFfprobe(file, binary) {
  const probe = spawnSync(binary, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], {
    encoding: 'utf8', timeout: 15_000, windowsHide: true, maxBuffer: 2 * 1024 * 1024,
  })
  if (probe.error || probe.status !== 0) throw new Error('ffprobe did not complete')
  const parsed = JSON.parse(probe.stdout)
  const streams = Array.isArray(parsed.streams) ? parsed.streams : []
  const video = streams.find((stream) => stream.codec_type === 'video')
  const seconds = Number(parsed.format?.duration)
  return {
    video: video ? {
      codec: video.codec_name,
      pixelFormat: video.pix_fmt,
      width: video.width,
      height: video.height,
      frameRate: video.avg_frame_rate,
    } : null,
    audio: streams.filter((stream) => stream.codec_type === 'audio').map((stream) => ({
      codec: stream.codec_name, channels: stream.channels, channelLayout: stream.channel_layout,
    })),
    durationSeconds: Number.isFinite(seconds) ? seconds : null,
  }
}

function mp4Files(root) {
  const files = []
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) visit(path)
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp4')) files.push(path)
    }
  }
  visit(root)
  return files.sort()
}

export function checkMedia(root = defaultMediaRoot, { ffprobe } = {}) {
  const files = mp4Files(root).map((path) => {
    const entry = { path: relative(root, path).replaceAll('\\', '/'), ...inspectMp4(path) }
    if (ffprobe) {
      try {
        entry.probe = probeWithFfprobe(path, ffprobe)
        if (entry.probe.audio.length && !entry.issues.some((issue) => issue.code === 'audio_track')) {
          entry.issues.push({ code: 'audio_track', codecs: entry.probe.audio })
        }
        if (entry.probe.video?.codec && entry.probe.video.codec !== 'h264' &&
            !entry.issues.some((issue) => issue.code === 'unsupported_video_sample_entry')) {
          entry.issues.push({ code: 'unsupported_video_codec', codec: entry.probe.video.codec })
        }
        if (entry.probe.video?.pixelFormat && !['yuv420p', 'yuvj420p'].includes(entry.probe.video.pixelFormat)) {
          entry.issues.push({ code: 'unsupported_pixel_format', pixelFormat: entry.probe.video.pixelFormat })
        }
      } catch {
        entry.issues.push({ code: 'probe_failed' })
      }
    }
    return entry
  })
  const counts = {}
  for (const file of files) for (const issue of file.issues) counts[issue.code] = (counts[issue.code] || 0) + 1
  if (!files.length) counts.no_mp4_files = 1
  return { ok: Object.keys(counts).length === 0, files, summary: { files: files.length, filesWithIssues: files.filter((file) => file.issues.length).length, issues: counts } }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2)
  const value = (flag) => {
    const index = args.indexOf(flag)
    return index >= 0 ? args[index + 1] : undefined
  }
  const root = value('--root') || defaultMediaRoot
  const ffprobe = value('--ffprobe')
  try {
    if (args.length !== (args.includes('--root') ? 2 : 0) + (args.includes('--ffprobe') ? 2 : 0) ||
        (args.includes('--root') && !value('--root')) || (args.includes('--ffprobe') && !ffprobe)) {
      throw new Error('Usage: check-media.mjs [--root directory] [--ffprobe executable]')
    }
    const report = checkMedia(root, { ffprobe })
    console.log(JSON.stringify(report, null, 2))
    if (!report.ok) process.exitCode = 1
  } catch {
    console.log(JSON.stringify({ ok: false, error: 'Media inspection could not complete.' }))
    process.exitCode = 1
  }
}
