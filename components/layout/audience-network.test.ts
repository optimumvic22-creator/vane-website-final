import { describe, expect, it } from 'vitest'
import { buildAudienceNetwork, containedVideoBounds, videoNetworkClearance } from './audience-network'

type NetworkInput = Parameters<typeof buildAudienceNetwork>[0]
type Point = { x: number; y: number }

const audiences = ['athlete', 'coach', 'partner'] as const
const viewports = [
  { name: 'mobile', width: 390, height: 680, junctionY: 300 },
  { name: 'tablet', width: 768, height: 900, junctionY: 380 },
  { name: 'desktop', width: 1440, height: 780, junctionY: 430 },
  { name: 'ultrawide', width: 2560, height: 1080, junctionY: 570 },
] as const

function fixture(
  audience: NetworkInput['audience'],
  viewport: (typeof viewports)[number],
): NetworkInput {
  const { width, height, junctionY } = viewport
  return {
    audience,
    width,
    height,
    junction: { x: width / 2, y: junctionY },
    clearance: {
      x: width * (audience === 'athlete' ? 0.5 : audience === 'coach' ? 0.22 : 0.78),
      y: audience === 'athlete' ? junctionY * 0.5 : junctionY + (height - junctionY) * 0.45,
      rx: width * 0.15,
      ry: height * 0.1,
    },
  }
}

function ellipseDistanceSquared(point: Point, clearance: NetworkInput['clearance']) {
  return ((point.x - clearance.x) / clearance.rx) ** 2 +
    ((point.y - clearance.y) / clearance.ry) ** 2
}

// Transform the ellipse to a unit circle, then find the segment's closest point.
// Checking only endpoints would miss links crossing the protected text area.
function closestSegmentDistanceSquared(
  from: Point,
  to: Point,
  clearance: NetworkInput['clearance'],
) {
  const x = (from.x - clearance.x) / clearance.rx
  const y = (from.y - clearance.y) / clearance.ry
  const dx = (to.x - from.x) / clearance.rx
  const dy = (to.y - from.y) / clearance.ry
  const lengthSquared = dx * dx + dy * dy
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, -(x * dx + y * dy) / lengthSquared))
  return (x + t * dx) ** 2 + (y + t * dy) ** 2
}

const cases = viewports.flatMap((viewport) => audiences.map((audience) => ({
  name: `${viewport.name} ${audience}`,
  input: fixture(audience, viewport),
})))

describe('audience network geometry', () => {
  it.each(cases)('keeps $name nodes finite, in their panel, and outside text clearance', ({ input }) => {
    const { nodes } = buildAudienceNetwork(input)
    expect(nodes.length).toBeGreaterThan(0)

    for (const node of nodes) {
      expect([node.x, node.y, node.radius, node.cluster].every(Number.isFinite)).toBe(true)
      expect(node.radius).toBeGreaterThan(0)
      expect(Number.isInteger(node.cluster)).toBe(true)
      expect(node.cluster).toBeGreaterThanOrEqual(0)
      expect(['far', 'mid', 'near']).toContain(node.tier)
      expect(node.x).toBeGreaterThanOrEqual(0)
      expect(node.x).toBeLessThanOrEqual(input.width)
      expect(node.y).toBeGreaterThanOrEqual(0)
      expect(node.y).toBeLessThanOrEqual(input.height)

      const panelBoundary = input.junction.y - Math.abs(node.x - input.junction.x) / Math.sqrt(3)
      if (input.audience === 'athlete') {
        expect(node.y).toBeLessThanOrEqual(panelBoundary + 1e-6)
      } else {
        expect(node.y).toBeGreaterThanOrEqual(panelBoundary - 1e-6)
        if (input.audience === 'coach') expect(node.x).toBeLessThanOrEqual(input.junction.x)
        else expect(node.x).toBeGreaterThanOrEqual(input.junction.x)
      }
      expect(ellipseDistanceSquared(node, input.clearance)).toBeGreaterThan(1)
    }
  })

  it.each(cases)('keeps $name edges unique, bounded, and clear of protected text', ({ input }) => {
    const { nodes, edges } = buildAudienceNetwork(input)
    const seen = new Set<string>()
    const degree = Array.from({ length: nodes.length }, () => 0)
    expect(edges.length).toBeGreaterThan(0)

    for (const edge of edges) {
      expect(Number.isInteger(edge.from)).toBe(true)
      expect(Number.isInteger(edge.to)).toBe(true)
      expect(edge.from).toBeGreaterThanOrEqual(0)
      expect(edge.to).toBeGreaterThanOrEqual(0)
      expect(edge.from).toBeLessThan(nodes.length)
      expect(edge.to).toBeLessThan(nodes.length)
      expect(edge.from).not.toBe(edge.to)
      expect(['fine', 'main', 'bridge']).toContain(edge.kind)
      const key = [edge.from, edge.to].sort((a, b) => a - b).join(':')
      expect(seen.has(key)).toBe(false)
      seen.add(key)
      degree[edge.from] += 1
      degree[edge.to] += 1
      expect(closestSegmentDistanceSquared(nodes[edge.from], nodes[edge.to], input.clearance))
        .toBeGreaterThanOrEqual(1 - 1e-6)
    }

    expect(Math.max(...degree)).toBeLessThanOrEqual(6)
  })

  it.each(cases)('limits $name emphasis and emits finite SVG paths', ({ input }) => {
    const { nodes, hubs, signalPaths, paths } = buildAudienceNetwork(input)
    expect(hubs.length).toBeLessThanOrEqual(4)
    expect(new Set(hubs).size).toBe(hubs.length)
    for (const hub of hubs) {
      expect(Number.isInteger(hub)).toBe(true)
      expect(hub).toBeGreaterThanOrEqual(0)
      expect(hub).toBeLessThan(nodes.length)
    }
    expect(signalPaths.length).toBeLessThanOrEqual(2)
    for (const path of signalPaths) expect(path.length).toBeGreaterThan(0)
    expect(Object.keys(paths).sort()).toEqual(['bridge', 'far', 'fine', 'main', 'mid', 'near'])
    for (const path of [...Object.values(paths), ...signalPaths]) {
      expect(typeof path).toBe('string')
      expect(path).not.toMatch(/NaN|Infinity|undefined|null/)
      const coordinates = path.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g) ?? []
      expect(coordinates.every((coordinate) => Number.isFinite(Number(coordinate)))).toBe(true)
    }
  })

  it.each(audiences)('generates deterministic %s output without mutating input', (audience) => {
    const input = fixture(audience, viewports[2])
    const before = structuredClone(input)
    const first = buildAudienceNetwork(input)
    expect(buildAudienceNetwork(structuredClone(input))).toEqual(first)
    expect(input).toEqual(before)
  })

  it.each(audiences)('reduces %s network density on mobile', (audience) => {
    const mobile = buildAudienceNetwork(fixture(audience, viewports[0]))
    const desktop = buildAudienceNetwork(fixture(audience, viewports[2]))
    expect(mobile.nodes.length).toBeLessThan(desktop.nodes.length)
  })

  it.each(cases)('protects the actual $name video footprint without emptying the margins', ({ input }) => {
    const videoClearance = {
      x: input.clearance.x,
      y: input.clearance.y - input.height * 0.08,
      rx: input.width * 0.09,
      ry: input.height * 0.23,
    }
    const graph = buildAudienceNetwork({ ...input, videoClearance })
    expect(graph.nodes.length).toBeGreaterThan(input.width < 640 ? 60 : 180)
    expect(graph.nodes.length).toBeLessThanOrEqual(input.width < 640 ? 360 : 1000)
    expect(graph.edges.length).toBeGreaterThan(graph.nodes.length * 1.3)
    for (const node of graph.nodes) expect(ellipseDistanceSquared(node, videoClearance)).toBeGreaterThan(1)
    for (const edge of graph.edges) {
      expect(closestSegmentDistanceSquared(graph.nodes[edge.from], graph.nodes[edge.to], videoClearance))
        .toBeGreaterThanOrEqual(1 - 1e-6)
    }
  })

  it('uses a landscape video footprint rather than the surrounding portrait wrapper', () => {
    const bounds = containedVideoBounds({ x: 10, y: 20, width: 360, height: 640 }, 16 / 9, { x: 0.5, y: 0.24 })
    expect(bounds).toEqual({ x: 10, y: 125, width: 360, height: 202.5 })
  })

  it('accounts for horizontal letterboxing and a scaled mobile video frame', () => {
    const bounds = containedVideoBounds({ x: 40, y: 80, width: 296, height: 296 }, 9 / 16, { x: 0.5, y: 0.72 })
    expect(bounds).toEqual({ x: 104.75, y: 80, width: 166.5, height: 296 })
  })

  it.each(cases)('covers both $name video margins rather than concentrating in one corner', ({ input }) => {
    const videoWidth = input.width * (input.width < 640 ? 0.65 : 0.35)
    const videoHeight = videoWidth * 16 / 9
    const video = videoNetworkClearance({
      x: input.clearance.x - videoWidth / 2,
      y: input.clearance.y - videoHeight / 2,
      width: videoWidth, height: videoHeight,
    }, input.audience, input.width)
    const { nodes, edges } = buildAudienceNetwork({ ...input, videoClearance: video })
    // The text core stays protected. Check the newly visible transition band,
    // outside the 25% text feather and inside/beyond the video side feather.
    for (const side of [-1, 1]) {
      const visible = nodes.map((node, index) => ({ node, index })).filter(({ node }) => {
        const offset = (node.x - video.x) * side
        return offset > video.rx && ellipseDistanceSquared(node, input.clearance) > 1.25 ** 2 &&
          ellipseDistanceSquared(node, video) > 1.2 ** 2
      })
      expect(visible.length).toBeGreaterThan(5)
      const connected = new Set(edges.flatMap((edge) => [edge.from, edge.to]))
      expect(visible.filter(({ index }) => connected.has(index)).length).toBeGreaterThan(5)
      const verticalBand = (input.audience === 'athlete' ? input.junction.y : input.height) / 4
      expect(new Set(visible.map(({ node }) => Math.floor(node.y / verticalBand))).size).toBeGreaterThan(1)
    }
  })
})
