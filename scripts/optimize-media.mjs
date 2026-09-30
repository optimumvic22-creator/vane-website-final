import { spawnSync } from 'node:child_process'
import { existsSync, renameSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ffmpeg = process.argv[2] || 'ffmpeg'
const ffprobe = process.argv[3] || 'ffprobe'
const sources = [
  'audience-entry/athlete-dario-acceleration',
  'audience-entry/coach-niklas-cmj',
  'mqs-domains/gait-colin-side-view',
  'mqs-domains/posture-img-7757',
  'mqs-domains/force-dario-tb-deadlift',
  'mqs-domains/power-dario-keiser-push-pull',
  'mqs-domains/motor-img-6130',
  'mqs-domains/neuro-julius-single-leg-line-hop',
  'mqs-domains/dtc-colin-crossover-step',
  'audience-motion/partner-niklas-cmj-2',
  'audience-motion/partner-niklas-vertec-jump',
  'audience-motion/partner-konate-depth-jump-outlier',
  'audience-motion/dario-max-v-sprint',
  'audience-motion/dario-accel-usc',
]

function run(binary, args) {
  const result = spawnSync(binary, args, {
    encoding: 'utf8', timeout: 90_000, windowsHide: true,
    maxBuffer: 2 * 1024 * 1024,
  })
  if (result.error || result.status !== 0) {
    throw new Error(result.error?.message || result.stderr || `${binary} failed`)
  }
  return result.stdout
}

function probe(path) {
  return JSON.parse(run(ffprobe, [
    '-v', 'error', '-show_streams', '-show_format', '-of', 'json', path,
  ]))
}

let originalBytes = 0
let webBytes = 0
for (const source of sources) {
  const input = join(root, 'public/media', `${source}.mov`)
  const output = join(root, 'public/media', `${source}-web.mp4`)
  const before = probe(input)
  const inputStream = before.streams.find((stream) => stream.codec_type === 'video')
  if (!inputStream) throw new Error(`No video stream: ${source}`)
  if (['smpte2084', 'arib-std-b67'].includes(inputStream.color_transfer)) {
    throw new Error(`HDR input needs a reviewed tone mapping pass: ${source}`)
  }
  const isValid = (media) => {
    const video = media.streams.find((entry) => entry.codec_type === 'video')
    return video?.codec_name === 'h264' && ['yuv420p', 'yuvj420p'].includes(video.pix_fmt) &&
      !media.streams.some((entry) => entry.codec_type === 'audio') &&
      Math.abs(Number(before.format.duration) - Number(media.format.duration)) <= 0.15
  }
  let after
  try {
    if (existsSync(output) && statSync(output).mtimeMs >= statSync(input).mtimeMs) after = probe(output)
  } catch {
    // An interrupted earlier encode is regenerated, never accepted as complete.
  }
  if (!after || !isValid(after)) {
    const temporary = output.replace(/\.mp4$/, '.partial.mp4')
    run(ffmpeg, [
      '-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-threads', '2', '-i', input,
      '-map', '0:v:0', '-an', '-sn', '-dn',
      '-t', before.format.duration, '-filter_threads', '1',
      '-vf', "fps=30,scale=w='min(1280,iw)':h='min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1",
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-threads', '2',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-map_metadata', '-1', temporary,
    ])
    after = probe(temporary)
    if (!isValid(after)) throw new Error(`Output failed codec/audio/duration verification: ${source}`)
    renameSync(temporary, output)
  }
  const stream = after.streams.find((entry) => entry.codec_type === 'video')
  // Full-range H.264 4:2:0 is reported as yuvj420p for some camera sources.
  if (!stream || stream.codec_name !== 'h264' || !['yuv420p', 'yuvj420p'].includes(stream.pix_fmt) ||
      after.streams.some((entry) => entry.codec_type === 'audio') ||
      Math.abs(Number(before.format.duration) - Number(after.format.duration)) > 0.15) {
    throw new Error(`Output failed codec/audio/duration verification: ${source}`)
  }
  originalBytes += statSync(input).size
  webBytes += statSync(output).size
  console.log(`${source}: ${stream.width}x${stream.height}, ${(statSync(output).size / 1048576).toFixed(2)} MiB`)
}
console.log(JSON.stringify({ files: sources.length, originalBytes, webBytes, savedPercent: Math.round((1 - webBytes / originalBytes) * 100) }))
