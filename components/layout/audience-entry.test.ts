import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const source = readFileSync(new URL('./AudienceEntry.tsx', import.meta.url), 'utf8')

// Run the actual production effect with native-media doubles, without duplicating
// its playback logic or requiring a browser renderer for these lifecycle checks.
const parsedSource = ts.createSourceFile('AudienceEntry.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const component = parsedSource.statements.find(
  (statement): statement is ts.FunctionDeclaration =>
    ts.isFunctionDeclaration(statement) && statement.name?.text === 'AudienceEntry',
)
const playbackEffect = component?.body?.statements.flatMap((statement) => {
  if (!ts.isExpressionStatement(statement) || !ts.isCallExpression(statement.expression)) return []
  const call = statement.expression
  const callback = call.arguments[0]
  return ts.isIdentifier(call.expression) && call.expression.text === 'useEffect' &&
    callback && ts.isArrowFunction(callback) && callback.body.getText(parsedSource).includes('const videos =')
    ? [callback]
    : []
})[0]
if (!playbackEffect) throw new Error('AudienceEntry playback effect was not found')
const effectCode = ts.transpileModule(`(${playbackEffect.getText(parsedSource)})()`, {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText

function createVideoLifecycle(audience: 'athlete' | 'coach' | 'partner') {
  const src = `/media/${audience}.mp4`
  const video = Object.assign(new EventTarget(), {
    src,
    currentSrc: src,
    currentTime: 0,
    readyState: 4,
    preload: 'none',
    pause: vi.fn(),
    play: vi.fn().mockResolvedValue(undefined),
    removeAttribute: vi.fn(),
    load: vi.fn(),
  })
  video.removeAttribute.mockImplementation((attribute: string) => {
    if (attribute === 'src') video.src = ''
  })
  video.load.mockImplementation(() => {
    video.currentTime = 0
    video.readyState = 0
    video.currentSrc = video.src
  })
  const activatedVideosRef = { current: new Set<string>() }
  let cleanup: (() => void) | undefined
  return {
    video,
    activatedVideosRef,
    attachSource() { video.src = src },
    render(mediaAllowed: boolean, activeAudience: string | null = audience) {
      cleanup?.()
      cleanup = runInNewContext(effectCode, {
        athleteVideoRef: { current: audience === 'athlete' ? video : null },
        coachVideoRef: { current: audience === 'coach' ? video : null },
        partnerVideoRef: { current: audience === 'partner' ? video : null },
        AUDIENCE_VIDEO_TIMING: {
          athlete: { rest: 0.95 }, coach: { rest: 0.35 }, partner: { rest: 1.2 },
        },
        loadedAudiences: new Set([audience]),
        failedAudiences: new Set(),
        mediaAllowed,
        activeAudience,
        reduceMotion: false,
        activatedVideosRef,
        HTMLMediaElement: { HAVE_METADATA: 1, HAVE_FUTURE_DATA: 3 },
        window: { setTimeout, clearTimeout },
      }) as () => void
    },
    dispose() { cleanup?.() },
  }
}

describe('entry video source lifecycle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const audiences = [
    ['athlete', 0.95], ['coach', 0.35], ['partner', 1.2],
  ] as const

  it.each(audiences)('restores the %s timeline after releasing and reattaching its source', (audience, restTime) => {
    const lifecycle = createVideoLifecycle(audience)
    const { video, activatedVideosRef } = lifecycle
    lifecycle.render(true)
    expect(video.currentTime).toBe(restTime)
    expect(activatedVideosRef.current.has(audience)).toBe(true)

    lifecycle.render(false)
    expect(video.pause).toHaveBeenCalledOnce()
    expect(video.removeAttribute).toHaveBeenCalledWith('src')
    expect(video.load).toHaveBeenCalledOnce()
    expect(activatedVideosRef.current.has(audience)).toBe(false)

    lifecycle.attachSource()
    lifecycle.render(true)
    video.readyState = 1
    video.dispatchEvent(new Event('loadedmetadata'))
    video.readyState = 4
    video.dispatchEvent(new Event('canplay'))
    expect(video.currentTime).toBe(restTime)
    expect(video.play).toHaveBeenCalledTimes(2)
    expect(activatedVideosRef.current.has(audience)).toBe(true)
    lifecycle.dispose()
  })

  it.each(audiences)('retains the loaded %s source on ordinary pointer leave', (audience, restTime) => {
    const lifecycle = createVideoLifecycle(audience)
    const { video, activatedVideosRef } = lifecycle
    lifecycle.render(true)
    video.currentTime = restTime + 1
    lifecycle.render(true, null)

    expect(video.pause).toHaveBeenCalledOnce()
    expect(video.removeAttribute).not.toHaveBeenCalled()
    expect(video.load).not.toHaveBeenCalled()
    expect(video.src).not.toBe('')
    expect(activatedVideosRef.current.has(audience)).toBe(true)
    vi.advanceTimersByTime(299)
    expect(video.currentTime).toBe(restTime + 1)
    vi.advanceTimersByTime(1)
    expect(video.currentTime).toBe(restTime)
    lifecycle.dispose()
  })
})

describe('approved entry typography and copy', () => {
  it('uses the existing Bebas display font and keeps the restrained hover', () => {
    expect(source).not.toContain('BarlowCondensed-SemiBold.woff2')
    expect(source.match(/font-display/g)).toHaveLength(2)
    expect(source).not.toContain('-webkit-text-stroke')
    expect(source).toContain('font-[650]')
    expect(source).not.toContain('scale-[1.2]')
    expect(source).toContain('group-hover:scale-[1.09]')
  })

  it('preserves the claim, role order and routes', () => {
    expect(source.match(/<h1\b/g)).toHaveLength(1)
    expect(source).toContain('Human Movement now has')
    expect(source).toContain('<span className="whitespace-nowrap">a language</span>')
    expect(source.indexOf('slug: "athlete"')).toBeLessThan(source.indexOf('slug: "coach"'))
    expect(source.indexOf('slug: "coach"')).toBeLessThan(source.indexOf('slug: "partner"'))
    expect(source).toContain('href={`/for/${role.slug}`}')
  })

  it.each([
    'WE MAKE MOVEMENT QUALITY COMPARABLE',
    'WIR MACHEN BEWEGUNGSQUALITÄT VERGLEICHBAR',
    'MAKE MOVEMENT QUALITY YOUR ADVANTAGE',
    'DATA TO SUPPORT YOUR DECISIONS',
    'DATEN FÜR DEINE ENTSCHEIDUNGEN',
    'INTEGRATE A MOVEMENT QUALITY STANDARD',
    'INTEGRIERE EINEN STANDARD FÜR BEWEGUNGSQUALITÄT',
  ])('keeps approved copy: %s', (copy) => {
    expect(source).toContain(`"${copy}"`)
  })
})
