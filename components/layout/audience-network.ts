export type NetworkAudience = "athlete" | "coach" | "partner";
export type NetworkClearance = { x: number; y: number; rx: number; ry: number };
export type NetworkLayout = {
  width: number;
  height: number;
  junction: { x: number; y: number };
  audience: NetworkAudience;
  clearance: NetworkClearance;
  videoClearance?: NetworkClearance;
};
type Point = { x: number; y: number };
type NetworkNode = Point & {
  radius: number;
  tier: "far" | "mid" | "near";
  cluster: number;
};
type NetworkEdge = { from: number; to: number; kind: "fine" | "main" | "bridge" };

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const point = (p: Point) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
const line = (a: Point, b: Point) => `M ${point(a)} L ${point(b)}`;
const dot = (p: NetworkNode) => {
  const r = p.radius.toFixed(2);
  const diameter = (p.radius * 2).toFixed(2);
  return `M ${(p.x - p.radius).toFixed(2)} ${p.y.toFixed(2)} a ${r} ${r} 0 1 0 ${diameter} 0 a ${r} ${r} 0 1 0 -${diameter} 0`;
};

/** The actual object-contain image, including letterboxing and object-position. */
export function containedVideoBounds(
  frame: { x: number; y: number; width: number; height: number },
  aspectRatio: number,
  position: { x: number; y: number },
) {
  const width = Math.min(frame.width, frame.height * aspectRatio);
  const height = width / aspectRatio;
  return {
    x: frame.x + (frame.width - width) * position.x,
    y: frame.y + (frame.height - height) * position.y,
    width,
    height,
  };
}

/** Protect clear footage, while letting the network enter its dark side fades. */
export function videoNetworkClearance(
  visible: ReturnType<typeof containedVideoBounds>, audience: NetworkAudience, viewportWidth: number,
): NetworkClearance {
  const mobile = viewportWidth < 640;
  return {
    x: visible.x + visible.width / 2,
    y: visible.y + visible.height / 2,
    rx: visible.width * (mobile ? audience === "athlete" ? 0.2 : 0.14 : audience === "athlete" ? 0.25 : 0.23),
    ry: visible.height * (mobile ? audience === "athlete" ? 0.36 : 0.25 : 0.38),
  };
}

/** Decorative geometry only. It is not derived from, or presented as, assessment data. */
export function buildAudienceNetwork(layout: NetworkLayout) {
  const { width, height, junction, audience, clearance, videoClearance } = layout;
  const nodes: NetworkNode[] = [];
  const edges: NetworkEdge[] = [];
  const hubs: number[] = [];
  const paths = { far: "", mid: "", near: "", fine: "", main: "", bridge: "" };
  const empty = { nodes, edges, hubs, paths, signalPaths: [] as string[] };
  if (!(width > 0 && height > 0 && clearance.rx > 0 && clearance.ry > 0)) return empty;

  let state = { athlete: 2407, coach: 3613, partner: 4819 }[audience];
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const mobile = width < 640;
  const inPanel = ({ x, y }: Point) => {
    const boundary = junction.y - Math.abs(x - junction.x) / Math.sqrt(3);
    return audience === "athlete"
      ? y < boundary - 8
      : y > boundary + 8 && (audience === "coach" ? x < junction.x - 8 : x > junction.x + 8);
  };
  const clearances = [clearance, ...(videoClearance ? [videoClearance] : [])];
  const ellipseDistance = (p: Point, ellipse: NetworkClearance) => Math.hypot(
    (p.x - ellipse.x) / ellipse.rx,
    (p.y - ellipse.y) / ellipse.ry,
  );
  const clearanceDistance = (p: Point) => Math.min(...clearances.map((ellipse) => ellipseDistance(p, ellipse)));
  const crossesClearance = (a: Point, b: Point) => clearances.some((ellipse) => {
    const ax = (a.x - ellipse.x) / ellipse.rx;
    const ay = (a.y - ellipse.y) / ellipse.ry;
    const dx = (b.x - a.x) / ellipse.rx;
    const dy = (b.y - a.y) / ellipse.ry;
    const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(ax + t * dx, ay + t * dy) <= 1;
  });

  // Count visible panel area, not the oversized and mostly cropped fan stage.
  let areaSamples = 0;
  for (let x = 10; x < width; x += 20) {
    for (let y = 10; y < height; y += 20) {
      if (inPanel({ x, y }) && clearanceDistance({ x, y }) > 1) areaSamples++;
    }
  }
  const target = Math.min(mobile ? 360 : 1000, Math.max(24, Math.round(areaSamples * 400 / (mobile ? 220 : 350))));
  const minimumSpacing = mobile ? 5.5 : 7;
  const clusterSize = mobile ? 45 : 80;
  const clusters: Point[] = [];
  const clusterCount = Math.max(3, Math.min(mobile ? 9 : 20, Math.round(target / 45)));
  for (let attempt = 0; clusters.length < clusterCount && attempt < 500; attempt++) {
    const p = { x: random() * width, y: random() * height };
    if (inPanel(p) && clearanceDistance(p) > 1.15 && clusters.every((c) => distance(c, p) > clusterSize)) clusters.push(p);
  }
  // Spatial buckets keep denser fields local: no all-node scan per candidate.
  const cellSize = mobile ? 52 : 76;
  const buckets = new Map<string, number[]>();
  const nearby = (p: Point, radius: number) => {
    const found: number[] = [];
    for (let x = Math.floor((p.x - radius) / cellSize); x <= Math.floor((p.x + radius) / cellSize); x++) {
      for (let y = Math.floor((p.y - radius) / cellSize); y <= Math.floor((p.y + radius) / cellSize); y++) {
        found.push(...(buckets.get(`${x}:${y}`) ?? []));
      }
    }
    return found;
  };
  const addNode = (p: Point, cluster: number) => {
    const clear = clearanceDistance(p);
    if (p.x < 4 || p.x > width - 4 || p.y < 4 || p.y > height - 4 || !inPanel(p) || clear <= 1) return;
    if (nearby(p, minimumSpacing).some((index) => distance(nodes[index], p) < minimumSpacing)) return;
    const tierRoll = random();
    const tier = tierRoll < 0.66 ? "far" : tierRoll < 0.96 ? "mid" : "near";
    nodes.push({
      ...p, tier,
      radius: tier === "far" ? 0.5 : tier === "mid" ? 0.85 : 1.35,
      cluster,
    });
    const cell = `${Math.floor(p.x / cellSize)}:${Math.floor(p.y / cellSize)}`;
    const bucket = buckets.get(cell) ?? [];
    bucket.push(nodes.length - 1);
    buckets.set(cell, bucket);
  };

  // Cover every eligible part of the field before adding denser neighborhoods.
  // Jitter prevents a visible grid; shuffling prevents top/left sampling bias.
  const coverageStep = Math.max(minimumSpacing * 2, Math.sqrt(areaSamples * 400 / (target * 0.72)));
  const coverage: Point[] = [];
  for (let x = coverageStep / 2; x < width; x += coverageStep) {
    for (let y = coverageStep / 2; y < height; y += coverageStep) {
      coverage.push({ x: x + (random() - 0.5) * coverageStep * 0.85, y: y + (random() - 0.5) * coverageStep * 0.85 });
    }
  }
  for (let index = coverage.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [coverage[index], coverage[swap]] = [coverage[swap], coverage[index]];
  }
  for (const p of coverage) {
    if (nodes.length >= Math.ceil(target * 0.76)) break;
    addNode(p, clusters.length + Math.floor(p.x / clusterSize) + Math.floor(p.y / clusterSize) * Math.ceil(width / clusterSize));
  }
  for (let attempt = 0; nodes.length < target && attempt < target * 65; attempt++) {
    const cluster = Math.floor(random() * clusters.length);
    const anchor = clusters[cluster];
    const clustered = anchor && random() < 0.7;
    // Overlapping organic neighborhoods, not a regular mesh or radial web.
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(-2 * Math.log(Math.max(0.0001, random()))) * clusterSize * 0.6;
    const p = clustered
      ? { x: anchor.x + Math.cos(angle) * radius, y: anchor.y + Math.sin(angle) * radius * 0.75 }
      : { x: 4 + random() * Math.max(0, width - 8), y: 4 + random() * Math.max(0, height - 8) };
    addNode(p, clustered ? cluster : clusters.length);
  }

  const degree = nodes.map(() => 0);
  const keys = new Set<string>();
  const edgeBuckets = new Map<string, number[]>();
  const segmentCells = (a: Point, b: Point) => {
    const cells: string[] = [];
    for (let x = Math.floor(Math.min(a.x, b.x) / cellSize); x <= Math.floor(Math.max(a.x, b.x) / cellSize); x++) {
      for (let y = Math.floor(Math.min(a.y, b.y) / cellSize); y <= Math.floor(Math.max(a.y, b.y) / cellSize); y++) cells.push(`${x}:${y}`);
    }
    return cells;
  };
  const intersects = (a: Point, b: Point, c: Point, d: Point) => {
    const cross = (p: Point, q: Point, r: Point) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
    return cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0;
  };
  const addEdge = (from: number, to: number, kind: NetworkEdge["kind"]) => {
    const key = `${Math.min(from, to)}:${Math.max(from, to)}`;
    if (from === to || keys.has(key) || degree[from] >= 6 || degree[to] >= 6) return false;
    if (crossesClearance(nodes[from], nodes[to])) return false;
    const cells = kind === "bridge" ? segmentCells(nodes[from], nodes[to]) : [];
    const adjacentEdges = new Set(cells.flatMap((cell) => edgeBuckets.get(cell) ?? []));
    // Fine connections may overlap like a layered neural graph. Only the
    // brighter inter-cluster routes avoid crossing each other.
    if (kind === "bridge" && [...adjacentEdges].some((index) => {
      const edge = edges[index];
      return (
      edge.kind === "bridge" &&
      edge.from !== from && edge.to !== from && edge.from !== to && edge.to !== to &&
      intersects(nodes[from], nodes[to], nodes[edge.from], nodes[edge.to])
      );
    })) return false;
    keys.add(key);
    edges.push({ from, to, kind });
    cells.forEach((cell) => {
      const bucket = edgeBuckets.get(cell) ?? [];
      bucket.push(edges.length - 1);
      edgeBuckets.set(cell, bucket);
    });
    degree[from]++;
    degree[to]++;
    return true;
  };

  nodes.forEach((source, from) => {
    const neighbors = nearby(source, cellSize).map((to) => ({ to, target: nodes[to], length: distance(source, nodes[to]) }))
      .filter(({ to, length }) => to !== from && length < cellSize)
      .sort((a, b) => a.length - b.length || a.to - b.to);
    const limit = source.tier === "near" ? 5 : source.tier === "mid" ? 4 : 3;
    for (const { to, target } of neighbors) {
      if (degree[from] >= limit) break;
      addEdge(from, to, source.tier === "near" || target.tier === "near" ? "main" : "fine");
    }
  });

  // Sparse bridges connect local neighborhoods without a central radial hub.
  let bridges = 0;
  nodes.forEach((source, from) => {
    if (bridges >= (mobile ? 16 : 36) || source.tier === "far") return;
    const candidates = nearby(source, mobile ? 100 : 150).map((to) => ({ to, target: nodes[to], length: distance(source, nodes[to]) }))
      .filter(({ to, target, length }) => to !== from && target.cluster !== source.cluster && length > 35 && length < (mobile ? 100 : 150))
      .sort((a, b) => a.length - b.length || a.to - b.to);
    for (const { to } of candidates) {
      if (addEdge(from, to, "bridge")) { bridges++; break; }
    }
  });

  nodes.forEach((node, index) => {
    if (hubs.length < 4 && node.tier === "near" && degree[index] >= 2 && hubs.every((hub) => distance(nodes[hub], node) > (mobile ? 70 : 125))) hubs.push(index);
    paths[node.tier] += `${dot(node)} `;
  });
  edges.forEach(({ from, to, kind }) => { paths[kind] += `${line(nodes[from], nodes[to])} `; });
  const signalPaths = hubs.slice(0, 2).flatMap((start) => {
    const route = [start];
    for (let step = 0; step < 4; step++) {
      const neighbors = edges.flatMap(({ from, to }) => from === route[route.length - 1] ? [to] : to === route[route.length - 1] ? [from] : [])
        .filter((index) => !route.includes(index))
        .sort((a, b) => distance(nodes[b], nodes[start]) - distance(nodes[a], nodes[start]));
      if (!neighbors.length) break;
      route.push(neighbors[0]);
    }
    return route.length > 2 ? [`M ${route.map((index) => point(nodes[index])).join(" L ")}`] : [];
  });
  return { nodes, edges, hubs, paths, signalPaths };
}
