import { mkdtempSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { checkMedia, inspectMp4 } from './check-media.mjs'

function box(type: string, payload = Buffer.alloc(0)) {
  const header = Buffer.alloc(8)
  header.writeUInt32BE(payload.length + 8)
  header.write(type, 4, 4, 'latin1')
  return Buffer.concat([header, payload])
}

function track(handler: 'vide' | 'soun', codec: string) {
  const sample = Buffer.alloc(handler === 'soun' ? 28 : 0)
  if (handler === 'soun') sample.writeUInt16BE(2, 16)
  const stsdHeader = Buffer.alloc(8)
  stsdHeader.writeUInt32BE(1, 4)
  const stsd = box('stsd', Buffer.concat([stsdHeader, box(codec, sample)]))
  const handlerPayload = Buffer.alloc(12)
  handlerPayload.write(handler, 8, 4, 'latin1')
  return box('trak', box('mdia', Buffer.concat([
    box('hdlr', handlerPayload),
    box('minf', box('stbl', stsd)),
  ])))
}

function movie({ late = false, audio = false, codec = 'avc1' } = {}) {
  const moov = box('moov', Buffer.concat([
    track('vide', codec),
    ...(audio ? [track('soun', 'mp4a')] : []),
  ]))
  const mdat = box('mdat', Buffer.from('sample'))
  return Buffer.concat([box('ftyp', Buffer.from('isom0000')), ...(late ? [mdat, moov] : [moov, mdat])])
}

describe('read-only MP4 media gate', () => {
  let root: string
  let files: string[]
  let directories: string[]

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'vane-media-check-'))
    files = []
    directories = []
  })

  afterEach(() => {
    for (const file of files) unlinkSync(file)
    for (const directory of directories.reverse()) rmdirSync(directory)
    rmdirSync(root)
  })

  function fixture(name: string, data: Buffer) {
    const file = join(root, name)
    writeFileSync(file, data)
    files.push(file)
    return file
  }

  it('recognizes a fast-start video-only H.264 MP4', () => {
    const result = inspectMp4(fixture('good.mp4', movie()))
    expect(result.fastStart).toBe(true)
    expect(result.tracks).toEqual([{ handler: 'vide', sampleEntries: [{ codec: 'avc1' }] }])
    expect(result.issues).toEqual([])
  })

  it('flags late metadata and an audio track with its codec and channel count', () => {
    const result = inspectMp4(fixture('late.mp4', movie({ late: true, audio: true })))
    expect(result.fastStart).toBe(false)
    expect(result.issues).toContainEqual({ code: 'late_moov' })
    expect(result.issues).toContainEqual({ code: 'audio_track', codecs: [{ codec: 'mp4a', channels: 2 }] })
  })

  it('flags missing boxes, malformed sizes and non-H.264 sample entries', () => {
    const missing = inspectMp4(fixture('missing.mp4', box('ftyp')))
    expect(missing.issues).toContainEqual({ code: 'missing_moov' })
    expect(missing.issues).toContainEqual({ code: 'missing_mdat' })
    expect(inspectMp4(fixture('hevc.mp4', movie({ codec: 'hvc1' }))).issues)
      .toContainEqual({ code: 'unsupported_video_sample_entry', codecs: [{ codec: 'hvc1' }] })
    const broken = box('ftyp')
    broken.writeUInt32BE(1000)
    expect(inspectMp4(fixture('broken.mp4', broken)).issues[0]?.code).toBe('malformed_mp4')
  })

  it('walks MP4 files only and reports per-file issue counts', () => {
    const subdirectory = join(root, 'nested')
    mkdirSync(subdirectory)
    directories.push(subdirectory)
    fixture('source.mov', movie({ late: true }))
    fixture('good.mp4', movie())
    const late = join(subdirectory, 'late.mp4')
    writeFileSync(late, movie({ late: true }))
    files.push(late)

    const report = checkMedia(root)
    expect(report.ok).toBe(false)
    expect(report.files.map((file: { path: string }) => file.path)).toEqual(['good.mp4', 'nested/late.mp4'])
    expect(report.summary).toMatchObject({ files: 2, filesWithIssues: 1, issues: { late_moov: 1 } })
  })

  it('fails closed for an empty media tree or an unavailable requested probe', () => {
    expect(checkMedia(root)).toMatchObject({ ok: false, summary: { issues: { no_mp4_files: 1 } } })
    fixture('video.mp4', movie())
    const report = checkMedia(root, { ffprobe: 'vane-unavailable-ffprobe' })
    expect(report.summary.issues).toMatchObject({ probe_failed: 1 })
  })
})
