"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/locale";
import { trackEvent } from "@/lib/analytics";
import { useMediaPlayback } from "@/lib/use-media-playback";
import { useMotionPaused } from "@/lib/motion-preference";
import { MotionToggle } from "@/components/ui/motion-toggle";

const ENTRY_BAND_HEIGHT =
  "calc(max(var(--entry-intro-min), clamp(220px, 27svh, 260px), clamp(220px, calc(656px - 100vw), 300px)) + env(safe-area-inset-top))";
const PULSE_LENGTH_RATIO = 1;
const PULSE_EASE = [0.16, 1, 0.3, 1] as const;
const TRACER_DURATION = 1.16;
const TRACER_EASE = [0.4, 0, 0.2, 1] as const;
const AUDIENCE_VIDEO_TIMING = {
  athlete: { rest: 0.95, loopStart: 0.45, loopEnd: 4.65 },
  coach: { rest: 0.35, loopStart: 0.15, loopEnd: 4.1 },
  partner: { rest: 1.2, loopStart: 0.8, loopEnd: 10.5 },
} as const;
const AUDIENCE_VIDEO_EDGE_MASK =
  "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.22) 18%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.94) 47%, #000 50%, rgba(0,0,0,0.94) 53%, rgba(0,0,0,0.72) 60%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.22) 82%, rgba(0,0,0,0.08) 92%, transparent 100%)";
const COACH_VIDEO_EDGE_MASK =
  "radial-gradient(ellipse 42% 48% at 50% 50%, #000 0%, #000 18%, rgba(0,0,0,0.98) 28%, rgba(0,0,0,0.9) 39%, rgba(0,0,0,0.78) 52%, rgba(0,0,0,0.62) 65%, rgba(0,0,0,0.45) 76%, rgba(0,0,0,0.29) 85%, rgba(0,0,0,0.15) 92%, rgba(0,0,0,0.06) 97%, transparent 100%)";
const PARTNER_VIDEO_EDGE_MASK =
  "radial-gradient(ellipse 44% 48% at 52% 48%, #000 0%, #000 20%, rgba(0,0,0,0.98) 29%, rgba(0,0,0,0.92) 39%, rgba(0,0,0,0.82) 49%, rgba(0,0,0,0.68) 59%, rgba(0,0,0,0.52) 69%, rgba(0,0,0,0.36) 79%, rgba(0,0,0,0.22) 87%, rgba(0,0,0,0.11) 93%, rgba(0,0,0,0.04) 97%, transparent 100%)";

type AudienceSlug = "athlete" | "coach" | "partner";
type MeshPoint = readonly [number, number];

const formatMeshPoint = ([x, y]: MeshPoint) =>
  `${x.toFixed(3)} ${y.toFixed(3)}`;

type MeasurementCluster = {
  center: MeshPoint;
  radius: MeshPoint;
  count: number;
  phase: number;
};

type MeasurementStarZone = {
  center: MeshPoint;
  radius: MeshPoint;
  count: number;
};

type MeasurementFieldConfig = {
  seed: number;
  starProfile?: "fine";
  clusters: readonly MeasurementCluster[];
  starZones: readonly MeasurementStarZone[];
  starClearance: {
    center: MeshPoint;
    radius: MeshPoint;
    feather: number;
  };
  calibrationPath: string;
  contactPath: string;
  bridgePath: string;
  focusPath: string;
  tracePath: string;
  flowPaths: readonly string[];
  vectorPaths: readonly string[];
};

type MeasurementNode = {
  x: number;
  y: number;
  radius: number;
  cluster: number;
  accent: boolean;
};

type MeasurementStar = {
  x: number;
  y: number;
  radius: number;
  zone: number;
  tier: "far" | "mid" | "near";
};

type MeasurementSpark = {
  x: number;
  y: number;
  radius: number;
  halo: boolean;
};

type MeasurementFieldData = MeasurementFieldConfig & {
  nodes: readonly MeasurementNode[];
  topologyPaths: readonly string[];
  microDotsPath: string;
  constellationEdgesPath: string;
  stars: readonly MeasurementStar[];
  sparks: readonly MeasurementSpark[];
  sparkPath: string;
  starPaths: {
    far: string;
    mid: string;
    near: string;
  };
};

const MEASUREMENT_FIELD_CONFIG = {
  athlete: {
    seed: 2407,
    starProfile: "fine",
    clusters: [
      { center: [24, 31], radius: [5.5, 3.5], count: 18, phase: 0.18 },
      { center: [37, 38], radius: [5, 4.5], count: 18, phase: 0.72 },
      { center: [63, 38], radius: [5, 4.5], count: 18, phase: 1.24 },
      { center: [76, 31], radius: [5.5, 3.5], count: 18, phase: 1.78 },
    ],
    starZones: [
      { center: [24, 31], radius: [14, 6], count: 70 },
      { center: [37, 38], radius: [11, 8], count: 70 },
      { center: [63, 38], radius: [11, 8], count: 70 },
      { center: [76, 31], radius: [14, 6], count: 70 },
    ],
    starClearance: {
      center: [50, 39],
      radius: [11.5, 14],
      feather: 0.5,
    },
    calibrationPath:
      "M 14 28 C 21 29 27 32 33 37 M 18 34 C 25 34 31 37 38 42 M 86 28 C 79 29 73 32 67 37 M 82 34 C 75 34 69 37 62 42 M 18 28 L 23 31 M 26 32 L 31 36 M 74 32 L 69 36 M 82 28 L 77 31",
    contactPath:
      "M 17 32 C 24 32 30 35 37 41 M 63 41 C 70 35 76 32 83 32 M 22 32 L 21.4 30.5 M 28 34 L 27.3 32.4 M 34 38 L 33.2 36.3 M 66 38 L 66.8 36.3 M 72 34 L 72.7 32.4 M 78 32 L 78.6 30.5",
    bridgePath:
      "M 22 31 C 27 32 31 35 34 38 C 36 40 38 42 39 44 M 78 31 C 73 32 69 35 66 38 C 64 40 62 42 61 44",
    focusPath:
      "M 17 31 L 17 28 L 20 28 M 29 36 L 32 36 L 32 39 M 68 39 L 68 36 L 71 36 M 80 28 L 83 28 L 83 31",
    tracePath:
      "M 17 34 L 20 34 L 22 32.8 L 24 35.1 L 26 31.2 L 28 34 L 32 34",
    flowPaths: [
      "M 39 44 C 36 41 35 39 34 38 C 30 34 26 32 22 31 C 19 30 16 29 13 27",
      "M 61 44 C 64 41 65 39 66 38 C 70 34 74 32 78 31 C 81 30 84 29 87 27",
      "M 37 43 C 33 42 29 40 25 37 C 21 34 18 32 15 31",
      "M 63 43 C 67 42 71 40 75 37 C 79 34 82 32 85 31",
    ],
    vectorPaths: ["M 23 39 L 29 33", "M 77 39 L 71 33"],
  },
  coach: {
    seed: 3613,
    starProfile: "fine",
    clusters: [
      { center: [40, 56], radius: [4.8, 4.5], count: 18, phase: 0.4 },
      { center: [30, 66], radius: [6, 5.2], count: 18, phase: 0.92 },
      { center: [17, 78], radius: [6.5, 5.8], count: 18, phase: 1.45 },
      { center: [7, 57], radius: [5.4, 4.8], count: 18, phase: 1.98 },
    ],
    starZones: [
      { center: [7, 57], radius: [15, 22], count: 70 },
      { center: [19, 82], radius: [22, 15], count: 70 },
      { center: [39, 58], radius: [14, 17], count: 70 },
      { center: [34, 88], radius: [17, 12], count: 70 },
    ],
    starClearance: {
      center: [24, 67],
      radius: [13.5, 19.5],
      feather: 0.5,
    },
    calibrationPath:
      "M 44 50 L 4 92 M 44 50 L 20 96 M 44 50 L 39 98 M 39 57 C 31 60 19 66 9 74 M 34 64 C 26 68 15 75 6 84 M 28 73 C 21 78 12 84 4 92",
    contactPath:
      "M 5 84 C 14 82 25 79 36 74 M 10 82.7 L 9.4 80.8 M 17 81.2 L 16.4 79.2 M 24 79.3 L 23.3 77.2 M 31 77 L 30.2 74.9",
    bridgePath:
      "M 42 52 C 39 57 35 62 30 66 C 25 72 21 76 17 78 M 30 66 C 22 62 14 59 7 57",
    focusPath:
      "M 10 58 L 10 53 L 15 53 M 34 53 L 39 53 L 39 58 M 10 75 L 10 80 L 15 80 M 34 80 L 39 80 L 39 75",
    tracePath:
      "M 6 88 L 9 88 L 11 86.8 L 13 89.1 L 15 84.6 L 17 87.9 L 21 87.9",
    flowPaths: [
      "M 44 50 C 38 56 37 63 30 68 C 22 74 14 81 4 92",
      "M 42 52 C 34 55 27 58 20 64 C 13 70 7 77 3 85",
      "M 41 53 C 37 63 32 72 25 82 C 20 88 15 93 10 97",
      "M 39 55 C 33 61 27 69 20 77 C 14 83 9 89 5 96",
    ],
    vectorPaths: ["M 17 81 L 22 61", "M 29 76 L 34 57"],
  },
  partner: {
    seed: 4819,
    starProfile: "fine",
    clusters: [
      { center: [56, 56], radius: [4.8, 4.5], count: 18, phase: 0.7 },
      { center: [66, 66], radius: [6, 5.2], count: 18, phase: 1.22 },
      { center: [80, 78], radius: [6.5, 5.8], count: 18, phase: 1.75 },
      { center: [90, 57], radius: [5.4, 4.8], count: 18, phase: 2.28 },
    ],
    starZones: [
      { center: [92, 57], radius: [17, 22], count: 70 },
      { center: [78, 82], radius: [23, 15], count: 70 },
      { center: [56, 58], radius: [15, 17], count: 70 },
      { center: [59, 88], radius: [18, 12], count: 70 },
    ],
    starClearance: {
      center: [73, 67],
      radius: [13.5, 19.5],
      feather: 0.5,
    },
    calibrationPath:
      "M 50 50 L 94 92 M 50 50 L 77 96 M 50 50 L 57 98 M 57 57 C 66 60 78 66 88 74 M 62 64 C 71 68 82 75 92 84 M 68 73 C 76 78 85 84 94 92",
    contactPath:
      "M 61 74 C 72 79 83 82 92 84 M 66 74.9 L 66.8 72.8 M 73 77.2 L 73.7 75.1 M 80 79.5 L 80.6 77.4 M 87 81.5 L 87.5 79.5",
    bridgePath:
      "M 52 51 C 57 54 61 58 64 62 M 61 86 C 68 91 76 95 84 97 M 88 55 C 92 52 96 48 99 43 M 89 82 C 93 85 96 88 99 92",
    focusPath:
      "M 57 58 L 57 53 L 62 53 M 82 53 L 87 53 L 87 58 M 57 75 L 57 80 L 62 80 M 82 80 L 87 80 L 87 75",
    tracePath:
      "M 76 88 L 80 88 L 82 86.4 L 84 89.2 L 86 85 L 88 87.8 L 92 87.8",
    flowPaths: [
      "M 50 50 C 56 53 60 57 64 61",
      "M 88 79 C 92 82 95 86 99 90",
      "M 52 53 C 55 64 57 76 64 86 C 69 93 76 97 84 99",
      "M 88 54 C 92 50 96 44 99 37",
    ],
    vectorPaths: ["M 59 58 L 74 64", "M 70 69 L 88 78"],
  },
} as const satisfies Record<AudienceSlug, MeasurementFieldConfig>;

const createSeededRandom = (seed: number) => {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const createMicroDotPath = (nodes: readonly MeasurementNode[]) =>
  nodes
    .map(({ x, y, radius }) => {
      const dotRadius = radius * 0.58;
      return `M ${(x - dotRadius).toFixed(3)} ${y.toFixed(3)} L ${x.toFixed(3)} ${(y - dotRadius).toFixed(3)} L ${(x + dotRadius).toFixed(3)} ${y.toFixed(3)} L ${x.toFixed(3)} ${(y + dotRadius).toFixed(3)} Z`;
    })
    .join(" ");

const createStarPath = (
  stars: readonly MeasurementStar[],
) =>
  stars
    .map(({ x, y, radius }) => {
      const left = (x - radius).toFixed(3);
      const right = (x + radius).toFixed(3);
      const centerX = x.toFixed(3);
      const centerY = y.toFixed(3);
      const starRadius = radius.toFixed(3);

      return `M ${left} ${centerY} A ${starRadius} ${starRadius} 0 1 0 ${right} ${centerY} A ${starRadius} ${starRadius} 0 1 0 ${left} ${centerY} Z M ${centerX} ${(y - radius * 2.2).toFixed(3)} L ${(x + radius * 0.28).toFixed(3)} ${(y - radius * 0.28).toFixed(3)} L ${centerX} ${(y + radius * 2.2).toFixed(3)} L ${(x - radius * 0.28).toFixed(3)} ${(y + radius * 0.28).toFixed(3)} Z`;
    })
    .join(" ");

const createSparkPath = (sparks: readonly MeasurementSpark[]) =>
  sparks
    .map(({ x, y, radius }) => {
      const left = (x - radius).toFixed(3);
      const right = (x + radius).toFixed(3);
      const centerY = y.toFixed(3);
      const sparkRadius = radius.toFixed(3);

      return `M ${left} ${centerY} A ${sparkRadius} ${sparkRadius} 0 1 0 ${right} ${centerY} A ${sparkRadius} ${sparkRadius} 0 1 0 ${left} ${centerY} Z`;
    })
    .join(" ");

const createConstellationEdgePath = (
  stars: readonly MeasurementStar[],
  clearance: MeasurementFieldConfig["starClearance"],
  fineProfile: boolean,
) => {
  const edges: string[] = [];
  const edgeKeys = new Set<string>();
  const crossesClearance = (
    source: MeasurementStar,
    target: MeasurementStar,
  ) => {
    const safetyPadding = 1.08;
    const sourceX =
      (source.x - clearance.center[0]) /
      (clearance.radius[0] * safetyPadding);
    const sourceY =
      (source.y - clearance.center[1]) /
      (clearance.radius[1] * safetyPadding);
    const targetX =
      (target.x - clearance.center[0]) /
      (clearance.radius[0] * safetyPadding);
    const targetY =
      (target.y - clearance.center[1]) /
      (clearance.radius[1] * safetyPadding);
    const deltaX = targetX - sourceX;
    const deltaY = targetY - sourceY;
    const segmentLengthSquared = deltaX * deltaX + deltaY * deltaY;
    const closestProgress =
      segmentLengthSquared === 0
        ? 0
        : Math.max(
            0,
            Math.min(
              1,
              -(sourceX * deltaX + sourceY * deltaY) /
                segmentLengthSquared,
            ),
          );
    const closestX = sourceX + deltaX * closestProgress;
    const closestY = sourceY + deltaY * closestProgress;

    return Math.hypot(closestX, closestY) <= 1;
  };

  stars.forEach((source, sourceIndex) => {
    const nearest = stars
      .map((target, targetIndex) => ({
        target,
        targetIndex,
        distance: Math.hypot(target.x - source.x, target.y - source.y),
      }))
      .filter(
        ({ target, targetIndex, distance }) =>
          targetIndex !== sourceIndex &&
          target.zone === source.zone &&
          distance < (fineProfile ? 13.5 : 16.5) &&
          !crossesClearance(source, target),
      )
      .sort((first, second) => first.distance - second.distance)
      .slice(
        0,
        fineProfile
          ? sourceIndex % 7 === 0
            ? 4
            : 3
          : sourceIndex % 6 === 0
            ? 5
            : 4,
      );

    nearest.forEach(({ target, targetIndex }) => {
      const edgeKey = `${Math.min(sourceIndex, targetIndex)}-${Math.max(sourceIndex, targetIndex)}`;
      if (edgeKeys.has(edgeKey)) return;
      edgeKeys.add(edgeKey);
      edges.push(
        `M ${formatMeshPoint([source.x, source.y])} L ${formatMeshPoint([target.x, target.y])}`,
      );
    });
  });

  return edges.join(" ");
};

const createTopologyPath = (
  nodes: readonly MeasurementNode[],
  cluster: number,
) => {
  const clusterNodes = nodes.filter((node) => node.cluster === cluster);
  const edgeKeys = new Set<string>();
  const edges: string[] = [];

  clusterNodes.forEach((source, sourceIndex) => {
    const nearestNodes = clusterNodes
      .map((target, targetIndex) => ({
        target,
        targetIndex,
        distance: Math.hypot(target.x - source.x, target.y - source.y),
      }))
      .filter(({ targetIndex }) => targetIndex !== sourceIndex)
      .sort((first, second) => first.distance - second.distance)
      .slice(0, sourceIndex % 5 === 0 ? 3 : 2);

    nearestNodes.forEach(({ target, targetIndex }, edgeIndex) => {
      const key = `${Math.min(sourceIndex, targetIndex)}-${Math.max(sourceIndex, targetIndex)}`;
      if (edgeKeys.has(key)) return;
      edgeKeys.add(key);

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.hypot(dx, dy) || 1;
      const direction = (sourceIndex + targetIndex + cluster) % 2 === 0 ? 1 : -1;
      const bend = direction * (0.12 + edgeIndex * 0.08);
      const controlPoint: MeshPoint = [
        (source.x + target.x) / 2 - (dy / distance) * bend,
        (source.y + target.y) / 2 + (dx / distance) * bend,
      ];

      edges.push(
        `M ${formatMeshPoint([source.x, source.y])} Q ${formatMeshPoint(controlPoint)} ${formatMeshPoint([target.x, target.y])}`,
      );
    });
  });

  return edges.join(" ");
};

const buildMeasurementField = (
  config: MeasurementFieldConfig,
): MeasurementFieldData => {
  const fineProfile = config.starProfile === "fine";
  const random = createSeededRandom(config.seed);
  const nodes = config.clusters.flatMap((cluster, clusterIndex) =>
    Array.from({ length: cluster.count }, (_, index) => {
      const spokes = 6;
      const rings = Math.ceil(cluster.count / spokes);
      const ring = Math.floor(index / spokes) + 1;
      const slot = index % spokes;
      const progress = ring / rings;
      const angle =
        cluster.phase +
        slot * (Math.PI / 3) +
        (ring % 2 === 0 ? Math.PI / 6 : 0) +
        (random() - 0.5) * 0.06;
      const radialJitter = 0.96 + random() * 0.08;
      const x =
        cluster.center[0] +
        Math.cos(angle) * cluster.radius[0] * progress * radialJitter;
      const y =
        cluster.center[1] +
        Math.sin(angle) * cluster.radius[1] * progress * radialJitter;
      const accent = index === 0 || index % 11 === 0;

      return {
        x,
        y,
        cluster: clusterIndex,
        accent,
        radius: accent ? 0.17 : index % 5 === 0 ? 0.11 : 0.075,
      };
    }),
  );
  const starRandom = createSeededRandom(config.seed + 7919);
  const starTiers = {
    far: [] as MeasurementStar[],
    mid: [] as MeasurementStar[],
    near: [] as MeasurementStar[],
  };

  config.starZones.forEach((zone, zoneIndex) => {
    let accepted = 0;
    let attempts = 0;

    while (accepted < zone.count && attempts < zone.count * 16) {
      attempts += 1;
      const angle = starRandom() * Math.PI * 2;
      const progress = Math.sqrt(starRandom());
      const x = zone.center[0] + Math.cos(angle) * zone.radius[0] * progress;
      const y = zone.center[1] + Math.sin(angle) * zone.radius[1] * progress;

      if (x < 0.5 || x > 99.5 || y < 0.5 || y > 99.5) {
        continue;
      }

      const clearanceDistance = Math.hypot(
        (x - config.starClearance.center[0]) /
          config.starClearance.radius[0],
        (y - config.starClearance.center[1]) /
          config.starClearance.radius[1],
      );

      if (clearanceDistance <= 1) {
        continue;
      }

      const clearanceVisibility = Math.min(
        1,
        (clearanceDistance - 1) / config.starClearance.feather,
      );

      if (starRandom() > clearanceVisibility) {
        continue;
      }

      const tierRoll = starRandom();
      const tier = fineProfile
        ? tierRoll < 0.64
          ? "far"
          : tierRoll < 0.92
            ? "mid"
            : "near"
        : tierRoll < 0.5
          ? "far"
          : tierRoll < 0.84
            ? "mid"
            : "near";
      const radius =
        fineProfile
          ? tier === "far"
            ? 0.035 + starRandom() * 0.025
            : tier === "mid"
              ? 0.065 + starRandom() * 0.035
              : 0.11 + starRandom() * 0.05
          : tier === "far"
            ? 0.055 + starRandom() * 0.04
            : tier === "mid"
              ? 0.09 + starRandom() * 0.06
              : 0.16 + starRandom() * 0.09;

      starTiers[tier].push({ x, y, radius, zone: zoneIndex, tier });
      accepted += 1;
    }
  });
  const sparkRandom = createSeededRandom(config.seed + 15401);
  const sparks: MeasurementSpark[] = [];

  config.starZones.forEach((zone, zoneIndex) => {
    const sparkCount = 7;
    let accepted = 0;
    let attempts = 0;

    while (accepted < sparkCount && attempts < sparkCount * 20) {
      attempts += 1;
      const angle = sparkRandom() * Math.PI * 2;
      const progress = Math.sqrt(sparkRandom());
      const x = zone.center[0] + Math.cos(angle) * zone.radius[0] * progress;
      const y = zone.center[1] + Math.sin(angle) * zone.radius[1] * progress;

      if (x < 0.5 || x > 99.5 || y < 0.5 || y > 99.5) {
        continue;
      }

      const clearanceDistance = Math.hypot(
        (x - config.starClearance.center[0]) /
          config.starClearance.radius[0],
        (y - config.starClearance.center[1]) /
          config.starClearance.radius[1],
      );

      if (clearanceDistance <= 1.04) {
        continue;
      }

      const clearanceVisibility = Math.min(
        1,
        (clearanceDistance - 1.04) /
          Math.max(config.starClearance.feather, 0.01),
      );

      if (sparkRandom() > clearanceVisibility) {
        continue;
      }

      sparks.push({
        x,
        y,
        radius: 0.022 + sparkRandom() * 0.018,
        halo: accepted === (zoneIndex * 2) % sparkCount,
      });
      accepted += 1;
    }
  });
  const constellationStars = [
    ...starTiers.mid,
    ...starTiers.near,
    ...starTiers.far,
  ];

  return {
    ...config,
    nodes,
    topologyPaths: config.clusters.map((_, clusterIndex) =>
      createTopologyPath(nodes, clusterIndex),
    ),
    microDotsPath: createMicroDotPath(nodes),
    constellationEdgesPath:
      createConstellationEdgePath(
        constellationStars,
        config.starClearance,
        fineProfile,
      ),
    stars: [
      ...starTiers.far,
      ...starTiers.mid,
      ...starTiers.near,
    ],
    sparks,
    sparkPath: createSparkPath(sparks),
    starPaths: {
      far: createStarPath(starTiers.far),
      mid: createStarPath(starTiers.mid),
      near: createStarPath(starTiers.near),
    },
  };
};

const MEASUREMENT_FIELDS: Record<AudienceSlug, MeasurementFieldData> = {
  athlete: buildMeasurementField(MEASUREMENT_FIELD_CONFIG.athlete),
  coach: buildMeasurementField(MEASUREMENT_FIELD_CONFIG.coach),
  partner: buildMeasurementField(MEASUREMENT_FIELD_CONFIG.partner),
};

function AudienceConstellationField({
  audience,
  isActive,
  reduceMotion,
}: {
  audience: AudienceSlug;
  isActive: boolean;
  reduceMotion: boolean;
}) {
  const field = MEASUREMENT_FIELDS[audience];
  const isFineField = field.starProfile === "fine";
  const glowId = `constellation-glow-${audience}`;
  const depthBlurId = `constellation-depth-${audience}`;
  const hubGlowId = `constellation-hub-${audience}`;
  const subjectFadeMask =
    audience === "athlete"
      ? "radial-gradient(ellipse 28% 32% at 50% 39%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.12) 24%, rgba(0,0,0,0.2) 44%, rgba(0,0,0,0.4) 62%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0.92) 92%, #000 100%)"
      : undefined;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      style={{
        mixBlendMode: "normal",
        maskImage: subjectFadeMask,
        WebkitMaskImage: subjectFadeMask,
      }}
    >
      <defs>
        <filter
          id={glowId}
          filterUnits="userSpaceOnUse"
          x="-4"
          y="-4"
          width="108"
          height="108"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="0.3"
            result="constellation-glow"
          />
          <feMerge>
            <feMergeNode in="constellation-glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id={depthBlurId}
          filterUnits="userSpaceOnUse"
          x="-3"
          y="-3"
          width="106"
          height="106"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.16" />
        </filter>
        <radialGradient id={hubGlowId} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#D3ECEF" stopOpacity="0.72" />
          <stop offset="0.14" stopColor="#88CBD3" stopOpacity="0.55" />
          <stop offset="0.38" stopColor="#4DA6B3" stopOpacity="0.26" />
          <stop offset="0.72" stopColor="#2F8996" stopOpacity="0.08" />
          <stop offset="1" stopColor="#2F8996" stopOpacity="0" />
        </radialGradient>
      </defs>

      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.g
            key={`constellation-field-${audience}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{
              opacity: reduceMotion
                ? isFineField
                  ? 0.62
                  : 0.74
                : isFineField
                  ? [0, 0.74, 0.68]
                  : [0, 0.96, 0.88],
            }}
            exit={{ opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.66,
                    delay: 0.02,
                    times: [0, 0.3, 1],
                    ease: "easeOut",
                  }
            }
          >
            <motion.path
              d={field.starPaths.far}
              className="max-sm:hidden"
              fill={isFineField ? "#4E9CA7" : "#8DEAF6"}
              fillOpacity={isFineField ? 0.46 : 0.36}
              filter={isFineField ? undefined : `url(#${depthBlurId})`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.42, delay: 0.04, ease: "easeOut" }
              }
            />

            <path
              d={field.sparkPath}
              fill="#D9F6F8"
              fillOpacity="0.82"
            />

            {field.sparks
              .filter((spark) => spark.halo)
              .map((spark, index) => (
                <circle
                  key={`constellation-spark-${audience}-${index}`}
                  cx={spark.x}
                  cy={spark.y}
                  r={spark.radius * 4.5}
                  fill="#78D5DF"
                  fillOpacity="0.18"
                  filter={`url(#${glowId})`}
                />
              ))}

            <motion.path
              d={field.constellationEdgesPath}
              fill="none"
              stroke={isFineField ? "#3FA7B4" : "#34DDF3"}
              strokeWidth={isFineField ? 0.26 : 0.4}
              strokeOpacity={isFineField ? 0.42 : 0.44}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.72, delay: 0.08, ease: PULSE_EASE }
              }
            />

            <motion.path
              d={field.constellationEdgesPath}
              fill="none"
              stroke={isFineField ? "#A9D4D8" : "#D7FBFF"}
              strokeWidth={isFineField ? 0.12 : 0.18}
              strokeOpacity={isFineField ? 0.12 : 0.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.64, delay: 0.15, ease: PULSE_EASE }
              }
            />

            <motion.g
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.4, delay: 0.12, ease: "easeOut" }
              }
            >
              {field.stars
                .filter((star) => star.tier === "near")
                .map((star, index) => (
                <circle
                  key={`constellation-star-${audience}-${index}`}
                  className={star.tier === "far" ? "max-sm:hidden" : undefined}
                  cx={star.x}
                  cy={star.y}
                  r={star.radius * (isFineField ? 1.05 : 1.2)}
                  fill={
                    star.tier === "near"
                      ? isFineField
                        ? "#CAE8EA"
                        : "#F7FEFF"
                      : star.tier === "mid"
                        ? isFineField
                          ? "#79C3CB"
                          : "#A1F2FC"
                        : isFineField
                          ? "#4E9CA7"
                          : "#54DCEE"
                  }
                  fillOpacity={isFineField ? 0.52 : 0.94}
                  filter={
                    !isFineField && index % 6 === 0
                      ? `url(#${glowId})`
                      : undefined
                  }
                />
                ))}
            </motion.g>

            <motion.path
              d={field.starPaths.mid}
              fill={isFineField ? "#68B7C1" : "#78E8F7"}
              fillOpacity={isFineField ? 0.52 : 0.64}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.38, delay: 0.12, ease: "easeOut" }
              }
            />

            <motion.path
              d={field.bridgePath}
              fill="none"
              stroke={isFineField ? "#55AAB6" : "#62E7F8"}
              strokeWidth={isFineField ? 0.34 : 0.52}
              strokeOpacity={isFineField ? 0.34 : 0.42}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.58, delay: 0.17, ease: PULSE_EASE }
              }
            />

            <motion.path
              d={field.starPaths.near}
              fill={isFineField ? "#B8DEE2" : "#F3FEFF"}
              fillOpacity={isFineField ? 0.58 : 0.9}
              filter={isFineField ? undefined : `url(#${glowId})`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.34, delay: 0.2, ease: "easeOut" }
              }
            />

            {field.clusters.map((cluster, index) => (
              <motion.g
                key={`constellation-hub-${audience}-${index}`}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.34,
                        delay: 0.22 + index * 0.065,
                        ease: "easeOut",
                      }
                }
              >
                <circle
                  cx={cluster.center[0]}
                  cy={cluster.center[1]}
                  r={isFineField ? 1.16 : 1.65}
                  fill={`url(#${hubGlowId})`}
                  opacity={isFineField ? 0.28 : 0.68}
                />
                <circle
                  cx={cluster.center[0]}
                  cy={cluster.center[1]}
                  r={isFineField ? 0.34 : 0.44}
                  fill="none"
                  stroke="#8CF0FC"
                  strokeOpacity={isFineField ? 0.2 : 0.42}
                  strokeWidth="0.38"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={cluster.center[0]}
                  cy={cluster.center[1]}
                  r={isFineField ? 0.105 : 0.145}
                  fill={isFineField ? "#A8D7DC" : "#F7FEFF"}
                  filter={isFineField ? undefined : `url(#${glowId})`}
                />
              </motion.g>
            ))}

            {field.flowPaths.map((path, index) => (
              <g key={`constellation-signal-${audience}-${index}`}>
                <path
                  d={path}
                  fill="none"
                  stroke={isFineField ? "#4CA6B3" : "#27D9F1"}
                  strokeWidth={isFineField ? 0.3 : 0.48}
                  strokeOpacity={isFineField ? 0.24 : 0.32}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                {reduceMotion || (isFineField && index > 1) ? null : (
                  <>
                    <motion.path
                      d={path}
                      pathLength="1"
                      fill="none"
                      stroke={isFineField ? "#6EBCC5" : "#32E2F7"}
                      strokeWidth={isFineField ? 0.5 : 0.92}
                      strokeOpacity={isFineField ? 0.28 : 0.48}
                      strokeLinecap="round"
                      strokeDasharray="0.18 0.82"
                      filter={isFineField ? undefined : `url(#${glowId})`}
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 1 }}
                      animate={{ strokeDashoffset: [1, 0] }}
                      transition={{
                        duration: 2.3 + index * 0.28,
                        delay: 0.34 + index * 0.22,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <motion.path
                      d={path}
                      pathLength="1"
                      fill="none"
                      stroke={isFineField ? "#C4E3E5" : "#F3FEFF"}
                      strokeWidth={isFineField ? 0.34 : 0.72}
                      strokeOpacity={isFineField ? 0.24 : 1}
                      strokeLinecap="round"
                      strokeDasharray="0.035 0.965"
                      filter={isFineField ? undefined : `url(#${glowId})`}
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 1 }}
                      animate={{ strokeDashoffset: [1, 0] }}
                      transition={{
                        duration: 2.3 + index * 0.28,
                        delay: 0.34 + index * 0.22,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </>
                )}
              </g>
            ))}
          </motion.g>
        ) : null}
      </AnimatePresence>
    </svg>
  );
}

// Kept temporarily as a source comparison while the new field is validated.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AudienceDataMesh({
  audience,
  isActive,
  reduceMotion,
}: {
  audience: AudienceSlug;
  isActive: boolean;
  reduceMotion: boolean;
}) {
  const field = MEASUREMENT_FIELDS[audience];
  const arrowId = `measurement-arrow-${audience}`;
  const glowId = `measurement-glow-${audience}`;
  const depthBlurId = `measurement-depth-blur-${audience}`;
  const hubGlowId = `measurement-hub-glow-${audience}`;
  const visibleNodes = field.nodes.filter(
    (node, index) => node.accent || index % 3 === 0,
  );

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      style={{ mixBlendMode: "screen" }}
    >
      <defs>
        <filter
          id={glowId}
          filterUnits="userSpaceOnUse"
          x="-4"
          y="-4"
          width="108"
          height="108"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.22" result="field-glow" />
          <feMerge>
            <feMergeNode in="field-glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id={depthBlurId}
          filterUnits="userSpaceOnUse"
          x="-3"
          y="-3"
          width="106"
          height="106"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.14" />
        </filter>
        <radialGradient id={hubGlowId} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#F3FDFF" stopOpacity="0.92" />
          <stop offset="0.18" stopColor="#8EEDFA" stopOpacity="0.68" />
          <stop offset="0.5" stopColor="#81D8CF" stopOpacity="0.24" />
          <stop offset="1" stopColor="#81D8CF" stopOpacity="0" />
        </radialGradient>
        <marker
          id={arrowId}
          viewBox="0 0 6 6"
          refX="5.2"
          refY="3"
          markerWidth="4.5"
          markerHeight="4.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0.6 L 5.2 3 L 0 5.4 Z" fill="#81D8CF" fillOpacity="0.52" />
        </marker>
      </defs>

      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.g
            key={`measurement-field-${audience}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{
              opacity: reduceMotion ? 0.54 : [0, 0.88, 0.78],
            }}
            exit={{ opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.72,
                    delay: 0.04,
                    times: [0, 0.28, 1],
                    ease: "easeOut",
                  }
            }
          >
            <motion.path
              d={field.starPaths.far}
              className="max-sm:hidden"
              fill="#C6F7FD"
              fillOpacity="0.24"
              filter={`url(#${depthBlurId})`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.5, delay: 0.08, ease: "easeOut" }
              }
            />

            <motion.path
              d={field.starPaths.mid}
              fill="#73E5F5"
              fillOpacity="0.38"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.46, delay: 0.14, ease: "easeOut" }
              }
            />

            <motion.path
              d={field.starPaths.near}
              fill="#F0FDFF"
              fillOpacity="0.64"
              filter={`url(#${glowId})`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.42, delay: 0.22, ease: "easeOut" }
              }
            />

            <motion.path
              d={field.calibrationPath}
              fill="none"
              stroke="#71858A"
              strokeWidth="0.35"
              strokeOpacity="0.24"
              strokeDasharray="0.8 2.1"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.46, delay: 0.06, ease: PULSE_EASE }
              }
            />

            <motion.path
              d={field.contactPath}
              fill="none"
              stroke="#A7EAF4"
              strokeWidth="0.48"
              strokeOpacity="0.3"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.38, delay: 0.12, ease: PULSE_EASE }
              }
            />

            <motion.path
              d={field.microDotsPath}
              className="max-sm:hidden"
              fill="#B5F4FC"
              fillOpacity="0.28"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.3, delay: 0.18, ease: "easeOut" }
              }
            />

            {field.topologyPaths.map((path, index) => (
              <motion.path
                key={`topology-${audience}-${index}`}
                d={path}
                fill="none"
                stroke={index % 2 === 0 ? "#81D8CF" : "#8AB9C0"}
                strokeWidth={index < 2 ? "0.52" : "0.46"}
                strokeOpacity={index < 2 ? "0.42" : "0.32"}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        pathLength: {
                          duration: 0.56,
                          delay: 0.13 + index * 0.075,
                          ease: PULSE_EASE,
                        },
                        opacity: {
                          duration: 0.2,
                          delay: 0.13 + index * 0.075,
                          ease: "easeOut",
                        },
                      }
                }
              />
            ))}

            <motion.path
              d={field.bridgePath}
              fill="none"
              stroke="#81D8CF"
              strokeWidth="0.58"
              strokeOpacity="0.36"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.58, delay: 0.24, ease: PULSE_EASE }
              }
            />

            <motion.g
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.24, delay: 0.34, ease: "easeOut" }
              }
            >
              {visibleNodes.map((node, index) => (
                <circle
                  key={`measurement-node-${audience}-${index}`}
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill={node.accent ? "#7DE6F6" : "#B6DDE2"}
                  fillOpacity={node.accent ? "0.68" : "0.42"}
                  stroke={node.accent ? "#81D8CF" : "none"}
                  strokeOpacity="0.38"
                  strokeWidth="0.34"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {field.clusters.map((cluster, index) => (
                <g key={`measurement-hub-${audience}-${index}`}>
                  <motion.circle
                    cx={cluster.center[0]}
                    cy={cluster.center[1]}
                    r="2.8"
                    fill={`url(#${hubGlowId})`}
                    initial={
                      reduceMotion ? false : { opacity: 0, scale: 0.45 }
                    }
                    animate={{ opacity: 0.46, scale: 1 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 0.5,
                            delay: 0.3 + index * 0.08,
                            ease: PULSE_EASE,
                          }
                    }
                    style={{
                      transformOrigin: `${cluster.center[0]}px ${cluster.center[1]}px`,
                    }}
                  />
                  <circle
                    cx={cluster.center[0]}
                    cy={cluster.center[1]}
                    r="0.72"
                    fill="none"
                    stroke="#81D8CF"
                    strokeOpacity="0.18"
                    strokeWidth="0.42"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx={cluster.center[0]}
                    cy={cluster.center[1]}
                    r="0.16"
                    fill="#81D8CF"
                    fillOpacity="0.72"
                  />
                </g>
              ))}
            </motion.g>

            <motion.path
              d={field.focusPath}
              fill="none"
              stroke="#9EEBF6"
              strokeWidth="0.58"
              strokeOpacity="0.42"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.34, delay: 0.28, ease: PULSE_EASE }
              }
            />

            <motion.path
              d={field.tracePath}
              fill="none"
              stroke="#81D8CF"
              strokeWidth="0.68"
              strokeOpacity="0.52"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.44, delay: 0.32, ease: PULSE_EASE }
              }
            />

            {field.vectorPaths.map((path, index) => (
              <motion.path
                key={`measurement-vector-${audience}-${index}`}
                d={path}
                fill="none"
                stroke="#81D8CF"
                strokeWidth="0.62"
                strokeOpacity="0.4"
                markerEnd={`url(#${arrowId})`}
                vectorEffect="non-scaling-stroke"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.36,
                        delay: 0.26 + index * 0.08,
                        ease: PULSE_EASE,
                      }
                }
              />
            ))}

            {field.flowPaths.map((path, index) => (
              <g key={`measurement-flow-${audience}-${index}`}>
                <motion.path
                  d={path}
                  fill="none"
                  stroke="#81D8CF"
                  strokeWidth="0.58"
                  strokeOpacity="0.34"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          duration: 0.48,
                          delay: 0.22 + index * 0.08,
                          ease: PULSE_EASE,
                        }
                  }
                />
                <motion.path
                  d={path}
                  pathLength="1"
                  fill="none"
                  stroke="#81D8CF"
                  strokeWidth="1.08"
                  strokeLinecap="round"
                  strokeDasharray={reduceMotion ? undefined : "0.22 0.78"}
                  filter={`url(#${glowId})`}
                  vectorEffect="non-scaling-stroke"
                  initial={
                    reduceMotion
                      ? false
                      : { strokeDashoffset: 1, opacity: 0 }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 0.46 }
                      : {
                          strokeDashoffset: [1, 0],
                          opacity: [0, 0.46, 0.3],
                        }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          strokeDashoffset: {
                            duration: 2.4 + index * 0.32,
                            delay: 0.42 + index * 0.24,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          opacity: {
                            duration: 0.42,
                            delay: 0.38 + index * 0.12,
                            ease: "easeOut",
                          },
                    }
                  }
                />
                {!reduceMotion ? (
                  <motion.path
                    d={path}
                    pathLength="1"
                    fill="none"
                    stroke="#B9F8FF"
                    strokeWidth="0.84"
                    strokeLinecap="round"
                    strokeDasharray="0.055 0.945"
                    filter={`url(#${glowId})`}
                    vectorEffect="non-scaling-stroke"
                    initial={{ strokeDashoffset: 1, opacity: 0 }}
                    animate={{
                      strokeDashoffset: [1, 0],
                      opacity: [0, 0.92, 0.66],
                    }}
                    transition={{
                      strokeDashoffset: {
                        duration: 2.4 + index * 0.32,
                        delay: 0.42 + index * 0.24,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      opacity: {
                        duration: 0.32,
                        delay: 0.42 + index * 0.12,
                        ease: "easeOut",
                      },
                    }}
                  />
                ) : null}
              </g>
            ))}
          </motion.g>
        ) : null}
      </AnimatePresence>
    </svg>
  );
}

const roles = [
  {
    slug: "athlete",
    image: "/audiences/athlete-placeholder.png",
    video: "/media/audience-entry/athlete-dario-acceleration-web.mp4",
    poster: "/media/audience-entry/athlete-poster.webp",
    videoWrapperClass:
      "absolute left-1/2 top-[-3%] h-[58%] aspect-[9/16] -translate-x-1/2",
    videoObjectClass: "object-contain",
    videoMask: AUDIENCE_VIDEO_EDGE_MASK,
    videoToneClass:
      "brightness-[1.08] group-hover:scale-[1.05] group-focus-visible:scale-[1.05]",
    objectPosition: "center 72%",
    mediaClass: "scale-[1.06] translate-y-[3%]",
    tracerBranches: [
      { path: "M 50 50 L 0 21.1325", length: 57.735 },
      { path: "M 50 50 L 100 21.1325", length: 57.735 },
    ],
    clipPath: "polygon(50% 50%, 0% 21.1325%, 0% 0%, 100% 0%, 100% 21.1325%)",
    contentClass: "items-center text-center",
    contentStyle: {
      left: "50%",
      top: "calc(50% - var(--entry-athlete-offset) + 2mm)",
      transform: "translate(-50%, -50%)",
    },
    overlayClass:
      "bg-[linear-gradient(180deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.38)_52%,rgba(0,0,0,0.62)_100%)] transition-opacity duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:duration-[620ms] group-hover:opacity-70 group-focus-visible:duration-[620ms] group-focus-visible:opacity-70 motion-reduce:transition-none",
    en: {
      title: "Athlete",
      description: "MAKE MOVEMENT QUALITY YOUR ADVANTAGE",
    },
    de: {
      title: "Athlet",
      description: "MACH BEWEGUNGSQUALITÄT ZU DEINEM VORTEIL",
    },
  },
  {
    slug: "coach",
    image: "/audiences/coach-placeholder.png",
    video: "/media/audience-entry/coach-niklas-cmj-web.mp4",
    poster: "/media/audience-entry/coach-poster.webp",
    videoWrapperClass:
      "absolute left-[calc(50%_-_25vw)] top-[29%] h-[62%] aspect-[9/16] -translate-x-1/2 md:left-[25%] md:top-[25.5%] md:h-[49%]",
    videoObjectClass: "object-contain object-center",
    videoMask: COACH_VIDEO_EDGE_MASK,
    videoToneClass:
      "scale-[0.74] group-hover:scale-[0.78] group-focus-visible:scale-[0.78] md:scale-100 md:group-hover:scale-[1.02] md:group-focus-visible:scale-[1.02]",
    objectPosition: "center 22%",
    mediaClass: "scale-[1.02]",
    tracerBranches: [
      { path: "M 50 50 L 50 100", length: 50 },
      { path: "M 50 50 L 0 21.1325", length: 57.735 },
    ],
    clipPath: "polygon(50% 50%, 50% 100%, 0% 100%, 0% 21.1325%)",
    contentClass: "items-center text-center",
    contentStyle: {
      left: "calc(50% - clamp(76px, 26vw, 420px))",
      top: "calc(50% + clamp(24px, 5svh, 52px) - clamp(0px, calc(30vw - 190px), 110px))",
      transform: "translate(-50%, 0)",
    },
    overlayClass:
      "bg-black/40 transition-opacity duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:duration-[620ms] group-hover:opacity-70 group-focus-visible:duration-[620ms] group-focus-visible:opacity-70 motion-reduce:transition-none",
    en: {
      title: "Coach",
      description: "DATA TO SUPPORT YOUR DECISIONS",
    },
    de: {
      title: "Coach",
      description: "DATEN FÜR DEINE ENTSCHEIDUNGEN",
    },
  },
  {
    slug: "partner",
    image: "/audiences/partner-placeholder.png",
    video: "/media/audience-entry/partner-dario-milan-presentation.mp4",
    poster: "/media/audience-entry/partner-poster.webp",
    videoWrapperClass:
      "absolute left-[calc(50%_+_25vw_-_19px)] top-[29%] h-[62%] aspect-[9/16] -translate-x-1/2 md:left-[73%] md:top-[25.5%] md:h-[49%]",
    videoObjectClass: "object-contain object-center",
    videoMask: PARTNER_VIDEO_EDGE_MASK,
    videoToneClass:
      "group-hover:scale-[1.04] group-focus-visible:scale-[1.04]",
    objectPosition: "center 24%",
    mediaClass: "scale-[1.02]",
    tracerBranches: [
      { path: "M 50 50 L 100 21.1325", length: 57.735 },
      { path: "M 50 50 L 50 100", length: 50 },
    ],
    clipPath: "polygon(50% 50%, 100% 21.1325%, 100% 100%, 50% 100%)",
    contentClass: "items-center text-center",
    contentStyle: {
      left: "calc(50% + clamp(76px, 26vw, 420px))",
      top: "calc(50% + clamp(24px, 5svh, 52px) - clamp(0px, calc(30vw - 190px), 110px))",
      transform: "translate(-50%, 0)",
    },
    overlayClass:
      "bg-[linear-gradient(90deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.76)_100%)] transition-opacity duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:duration-[620ms] group-hover:opacity-70 group-focus-visible:duration-[620ms] group-focus-visible:opacity-70 motion-reduce:transition-none",
    en: {
      title: "Partner",
      description: "INTEGRATE A MOVEMENT QUALITY STANDARD",
    },
    de: {
      title: "Partner",
      description: "INTEGRIERE EINEN STANDARD FÜR BEWEGUNGSQUALITÄT",
    },
  },
] as const;

export function AudienceEntry() {
  const { locale, setLocale, dismissGate } = useLocale();
  const systemReducedMotion = useReducedMotion();
  const motionPaused = useMotionPaused();
  const reduceMotion = systemReducedMotion || motionPaused;
  const { mediaContainerRef, mediaAllowed } = useMediaPlayback<HTMLElement>({ minVisibleRatio: 0.01 });
  const [failedAudiences, setFailedAudiences] = useState<ReadonlySet<AudienceSlug>>(() => new Set());
  const athleteVideoRef = useRef<HTMLVideoElement>(null);
  const coachVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);
  const activatedVideosRef = useRef(new Set<AudienceSlug>());
  const videoLoadTimerRef = useRef<number | null>(null);
  const [loadedAudiences, setLoadedAudiences] = useState<
    ReadonlySet<AudienceSlug>
  >(() => new Set());
  const [activeAudience, setActiveAudience] = useState<
    (typeof roles)[number]["slug"] | null
  >(null);
  const isGerman = locale === "de";
  const activeRole = roles.find((role) => role.slug === activeAudience);

  useEffect(() => {
    if (!activeAudience || !mediaAllowed || loadedAudiences.has(activeAudience) || failedAudiences.has(activeAudience)) return;
    const timer = window.setTimeout(() => {
      setLoadedAudiences((current) => new Set(current).add(activeAudience));
    }, 120);
    return () => window.clearTimeout(timer);
  }, [activeAudience, mediaAllowed, loadedAudiences, failedAudiences]);

  useEffect(() => {
    const elements = [athleteVideoRef.current, coachVideoRef.current, partnerVideoRef.current];
    return () => elements.forEach((video) => {
      if (!video) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
    });
  }, []);

  useEffect(() => {
    const videos = [
      {
        audience: "athlete",
        element: athleteVideoRef.current,
        restTime: AUDIENCE_VIDEO_TIMING.athlete.rest,
      },
      {
        audience: "coach",
        element: coachVideoRef.current,
        restTime: AUDIENCE_VIDEO_TIMING.coach.rest,
      },
      {
        audience: "partner",
        element: partnerVideoRef.current,
        restTime: AUDIENCE_VIDEO_TIMING.partner.rest,
      },
    ] as const;
    const cleanups: Array<() => void> = [];

    videos.forEach(({ audience, element, restTime }) => {
      if (!element) {
        return;
      }

      if (!loadedAudiences.has(audience) || !mediaAllowed || failedAudiences.has(audience)) {
        element.preload = "none";
        element.pause();
        if (!mediaAllowed && element.currentSrc) {
          activatedVideosRef.current.delete(audience);
          element.removeAttribute("src");
          element.load();
        }
        return;
      }

      if (activeAudience === audience && !reduceMotion) {
        const prepareTimeline = () => {
          if (activatedVideosRef.current.has(audience)) return;

          try {
            element.currentTime = restTime;
            activatedVideosRef.current.add(audience);
          } catch {
            // The media timeline may not be ready yet.
          }
        };
        const playWhenReady = () => {
          prepareTimeline();
          void element.play().catch(() => undefined);
        };

        element.preload = "auto";

        if (element.readyState >= HTMLMediaElement.HAVE_METADATA) {
          prepareTimeline();
        } else {
          element.addEventListener("loadedmetadata", prepareTimeline, {
            once: true,
          });
          cleanups.push(() =>
            element.removeEventListener("loadedmetadata", prepareTimeline),
          );
        }

        if (element.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          playWhenReady();
          return;
        }

        element.addEventListener("canplay", playWhenReady, { once: true });
        cleanups.push(() =>
          element.removeEventListener("canplay", playWhenReady),
        );
        element.load();
        return;
      }

      element.pause();
      element.preload = "none";

      const showRestFrame = () => {
        try {
          element.currentTime = restTime;
        } catch {
          // The media metadata may not be ready yet.
        }
      };

      if (element.readyState >= 1 && activatedVideosRef.current.has(audience)) {
        const resetTimer = window.setTimeout(showRestFrame, 300);
        cleanups.push(() => window.clearTimeout(resetTimer));
        return;
      }
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [activeAudience, loadedAudiences, reduceMotion, mediaAllowed, failedAudiences]);

  useEffect(
    () => () => {
      if (videoLoadTimerRef.current !== null) {
        window.clearTimeout(videoLoadTimerRef.current);
      }
    },
    [],
  );

  const selectLanguage = (language: "en" | "de") => {
    setLocale(language);
    dismissGate();
  };

  const selectAudience = (audience: string) => {
    setLocale(locale);
    dismissGate();
    trackEvent("audience_select", {
      audience,
      locale,
    });
  };

  const loadAudienceVideo = (audience: AudienceSlug) => {
    setLoadedAudiences((current) => {
      if (current.has(audience)) return current;

      const next = new Set(current);
      next.add(audience);
      return next;
    });
  };

  const activateAudience = (
    audience: AudienceSlug,
    loadDelay = 120,
  ) => {
    setActiveAudience(audience);
    if (reduceMotion || !mediaAllowed || failedAudiences.has(audience)) return;

    if (videoLoadTimerRef.current !== null) {
      window.clearTimeout(videoLoadTimerRef.current);
    }

    if (loadDelay === 0) {
      loadAudienceVideo(audience);
      return;
    }

    videoLoadTimerRef.current = window.setTimeout(() => {
      loadAudienceVideo(audience);
      videoLoadTimerRef.current = null;
    }, loadDelay);
  };

  const deactivateAudience = (audience: AudienceSlug) => {
    if (videoLoadTimerRef.current !== null) {
      window.clearTimeout(videoLoadTimerRef.current);
      videoLoadTimerRef.current = null;
    }

    setActiveAudience((current) =>
      current === audience ? null : current,
    );
  };

  return (
    <section
      ref={mediaContainerRef}
      className="relative overflow-hidden bg-[#050607] [--entry-intro-min:320px] [--entry-mobile-junction-min:240px] [--entry-athlete-offset:clamp(84px,23vw,160px)] md:[--entry-intro-min:0px] md:[--entry-mobile-junction-min:0px] md:[--entry-athlete-offset:clamp(86px,max(20svh,min(32svh,19vw)),290px)]"
      style={{ minHeight: "max(100svh, 680px)" }}
    >
      <div
        className="absolute inset-x-0 top-0 z-40 bg-[#050607]"
        style={{ height: ENTRY_BAND_HEIGHT }}
      >
        <header className="absolute inset-x-0 top-0 z-50 mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] max-[359px]:px-3 md:px-8 md:pb-6 md:pt-[calc(1.5rem+env(safe-area-inset-top))]">
          <Link
            href="/"
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center whitespace-nowrap text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          >
            <Image
              src="/vane-science-wordmark.png"
              alt="VANE Science"
              width={770}
              height={100}
              sizes="(min-width: 768px) 146px, 139px"
              className="h-[18px] w-auto md:h-[19px]"
            />
          </Link>
          <div className="flex items-center gap-1 md:gap-2">
          <MotionToggle />
          <div
            className="flex shrink-0 items-center rounded-full border border-white/8 bg-black/25 p-1 backdrop-blur-md max-[359px]:p-0"
            role="group"
            aria-label={isGerman ? "Sprache" : "Language"}
          >
            <button
              type="button"
              onClick={() => selectLanguage("en")}
              aria-pressed={!isGerman}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs font-medium text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border transition-colors ${
                  !isGerman
                    ? "border-[var(--mqs-accent)]/70 bg-[var(--mqs-accent)]/14 text-[var(--mqs-value-inv)]"
                    : "border-transparent"
                }`}
              >
                EN
              </span>
            </button>
            <button
              type="button"
              onClick={() => selectLanguage("de")}
              aria-pressed={isGerman}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-xs font-medium text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border transition-colors ${
                  isGerman
                    ? "border-[var(--mqs-accent)]/70 bg-[var(--mqs-accent)]/14 text-[var(--mqs-value-inv)]"
                    : "border-transparent"
                }`}
              >
                DE
              </span>
            </button>
          </div>
          </div>
        </header>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.45,
            delay: reduceMotion ? 0 : 0.12,
          }}
          className="pointer-events-none absolute inset-x-0 bottom-[calc(clamp(18px,2.8svh,30px)-3mm)] z-40 px-5 text-center md:bottom-[clamp(18px,2.8svh,30px)]"
        >
          <p className="font-sans text-[clamp(12px,0.95vw,14px)] font-medium uppercase tracking-[0.10em] text-[var(--mqs-value-inv)]">
            {isGerman ? "Willkommen bei VANE" : "Welcome to VANE"}
          </p>
          <h1 className="mx-auto mt-2 max-w-[1440px] font-display text-[clamp(2.5rem,11vw,3.125rem)] font-[650] uppercase leading-[1.02] tracking-[0.012em] text-white sm:text-[clamp(3rem,5.3vw,5.5rem)]">
            Human Movement now has{" "}
            <span className="whitespace-nowrap">a language</span>
          </h1>
          <p className="mx-auto mt-3 max-w-full whitespace-normal text-balance font-sans text-[clamp(0.75rem,3.35vw,0.875rem)] font-normal uppercase leading-[1.45] tracking-[0.04em] text-white/80 sm:text-[clamp(0.875rem,1.15vw,1.125rem)]">
            {isGerman
              ? "WIR MACHEN BEWEGUNGSQUALITÄT VERGLEICHBAR"
              : "WE MAKE MOVEMENT QUALITY COMPARABLE"}
          </p>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 z-30 h-3 bg-gradient-to-b from-[#050607] to-transparent"
        style={{ top: ENTRY_BAND_HEIGHT }}
      />

      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ top: ENTRY_BAND_HEIGHT }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
          className="absolute left-1/2 isolate aspect-square -translate-x-1/2 -translate-y-1/2 bg-[#08090A]"
          style={{
            // Narrow screens need enough visible wedge height below the intro
            // for the complete Athlete label, not an offset based on screen height.
            top: "max(var(--entry-mobile-junction-min), clamp(41%, calc(33.333% + 13.25vw), 68%))",
            width: "max(122vmax, 1100px)",
          }}
        >
          {roles.map((role) => {
            const copy = isGerman ? role.de : role.en;

            return (
              <Link
                key={role.slug}
                href={`/for/${role.slug}`}
                onClick={() => selectAudience(role.slug)}
                onMouseEnter={() => activateAudience(role.slug)}
                onMouseLeave={() => deactivateAudience(role.slug)}
                onFocus={() => activateAudience(role.slug, 0)}
                onBlur={() => deactivateAudience(role.slug)}
                className="group absolute inset-0 z-10 overflow-hidden focus-visible:z-20 focus-visible:outline-none"
                style={{ clipPath: role.clipPath }}
                aria-labelledby={`${role.slug}-title`}
                aria-describedby={`${role.slug}-description`}
              >
                <div className={`absolute inset-0 ${role.mediaClass}`}>
                  <div
                    className={role.videoWrapperClass}
                    style={{
                      maskImage: role.videoMask,
                      WebkitMaskImage: role.videoMask,
                    }}
                  >
                    <video
                      ref={
                        role.slug === "athlete"
                          ? athleteVideoRef
                          : role.slug === "coach"
                            ? coachVideoRef
                            : partnerVideoRef
                      }
                      src={
                        loadedAudiences.has(role.slug) && mediaAllowed && !failedAudiences.has(role.slug)
                          ? role.video
                          : undefined
                      }
                      poster={role.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      tabIndex={-1}
                      onError={(event) => {
                        if (mediaAllowed && event.currentTarget.getAttribute("src") === role.video) {
                          setFailedAudiences((current) => new Set(current).add(role.slug));
                        }
                      }}
                      onTimeUpdate={(event) => {
                        if (
                          event.currentTarget.currentTime >=
                          AUDIENCE_VIDEO_TIMING[role.slug].loopEnd
                        ) {
                          event.currentTarget.currentTime =
                            AUDIENCE_VIDEO_TIMING[role.slug].loopStart;
                        }
                      }}
                      className={`h-full w-full ${role.videoObjectClass} ${role.videoToneClass} transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:duration-[620ms] group-focus-visible:duration-[620ms] motion-reduce:transition-none`}
                      style={{ objectPosition: role.objectPosition }}
                    />
                    {role.slug === "coach" ? (
                      <>
                        <span className="pointer-events-none absolute inset-y-0 left-0 w-[36%] bg-gradient-to-r from-[#08090A] via-[#08090A]/60 to-transparent" />
                        <span className="pointer-events-none absolute inset-y-0 right-0 w-[36%] bg-gradient-to-l from-[#08090A] via-[#08090A]/60 to-transparent" />
                        <span className="pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-[#08090A] via-[#08090A]/55 to-transparent" />
                        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#08090A] via-[#08090A]/55 to-transparent" />
                      </>
                    ) : null}
                  </div>
                </div>
                <div className={`absolute inset-0 ${role.overlayClass}`} />
                <div className="absolute inset-0 bg-black/[0.50] transition-colors duration-500 group-hover:bg-black/[0.12] group-focus-visible:bg-black/[0.12] motion-reduce:transition-none" />
                <AudienceConstellationField
                  audience={role.slug}
                  isActive={activeAudience === role.slug}
                  reduceMotion={Boolean(reduceMotion)}
                />

                <div
                  className={`absolute z-10 flex w-[calc(50vw-24px)] flex-col sm:w-[clamp(180px,26vw,430px)] ${role.contentClass} ${
                    role.slug === "coach"
                      ? "max-[359px]:translate-x-2 [@media(max-width:639px)_and_(max-height:700px)]:-translate-y-6"
                      : role.slug === "partner"
                        ? "max-[359px]:-translate-x-2 [@media(max-width:639px)_and_(max-height:700px)]:-translate-y-6"
                        : ""
                  }`}
                  style={role.contentStyle}
                >
                  <h2
                    id={`${role.slug}-title`}
                    className="origin-center whitespace-nowrap rounded-sm px-2 py-1 font-display text-[clamp(2rem,4.6vw,4.75rem)] font-bold uppercase leading-none tracking-[0.015em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] transition-[color,scale] duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.09] group-hover:duration-[620ms] group-hover:text-[var(--mqs-value-inv)] group-focus-visible:scale-[1.09] group-focus-visible:duration-[620ms] group-focus-visible:text-[var(--mqs-value-inv)] group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-black motion-reduce:transition-none"
                  >
                    {copy.title}
                  </h2>
                  <p
                    id={`${role.slug}-description`}
                    aria-label={copy.description}
                    className="mt-1.5 min-h-[1.25em] w-full whitespace-normal break-normal px-0 text-balance text-center font-sans text-[clamp(0.6875rem,3.2vw,0.8125rem)] font-medium uppercase leading-[1.3] tracking-[0.025em] text-white/[0.88] transition-colors duration-[260ms] ease-out group-hover:text-white group-focus-visible:text-white sm:px-2 sm:text-[clamp(0.8125rem,0.98vw,0.9375rem)] sm:tracking-[0.03em] motion-reduce:transition-none"
                  >
                    {copy.description}
                  </p>
                </div>
              </Link>
            );
          })}

          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-30 h-full w-full"
          >
            <defs>
              <linearGradient
                id="seam-left"
                gradientUnits="userSpaceOnUse"
                x1="50"
                y1="50"
                x2="0"
                y2="21.1325"
              >
                <stop offset="0%" stopColor="#F4F1EC" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#F4F1EC" stopOpacity="0.27" />
                <stop offset="100%" stopColor="#F4F1EC" stopOpacity="0.14" />
              </linearGradient>
              <linearGradient
                id="seam-right"
                gradientUnits="userSpaceOnUse"
                x1="50"
                y1="50"
                x2="100"
                y2="21.1325"
              >
                <stop offset="0%" stopColor="#F4F1EC" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#F4F1EC" stopOpacity="0.27" />
                <stop offset="100%" stopColor="#F4F1EC" stopOpacity="0.14" />
              </linearGradient>
              <linearGradient
                id="seam-down"
                gradientUnits="userSpaceOnUse"
                x1="50"
                y1="50"
                x2="50"
                y2="100"
              >
                <stop offset="0%" stopColor="#F4F1EC" stopOpacity="0.38" />
                <stop offset="60%" stopColor="#F4F1EC" stopOpacity="0.27" />
                <stop offset="100%" stopColor="#F4F1EC" stopOpacity="0.14" />
              </linearGradient>
              <filter
                id="audience-trail-glow"
                filterUnits="userSpaceOnUse"
                primitiveUnits="userSpaceOnUse"
                x="-4"
                y="-4"
                width="108"
                height="108"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="0.24"
                  result="pulse-glow"
                />
                <feMerge>
                  <feMergeNode in="pulse-glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g
              fill="none"
              stroke="#050607"
              strokeOpacity="0.92"
              strokeWidth="4.8"
            >
              <line
                x1="50"
                y1="50"
                x2="0"
                y2="21.1325"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="50"
                y1="50"
                x2="100"
                y2="21.1325"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="100"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
            </g>
            <g fill="none" strokeWidth="1.25">
              <line
                x1="50"
                y1="50"
                x2="0"
                y2="21.1325"
                stroke="url(#seam-left)"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="50"
                y1="50"
                x2="100"
                y2="21.1325"
                stroke="url(#seam-right)"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="100"
                stroke="url(#seam-down)"
                strokeLinecap="butt"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            <AnimatePresence initial={false} mode="sync">
              {activeRole ? (
                <motion.g
                  key={activeRole.slug}
                  fill="none"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.1,
                    ease: "easeOut",
                  }}
                >
                  {activeRole.tracerBranches.map((branch) => {
                    const pulseLength =
                      branch.length * PULSE_LENGTH_RATIO;

                    return reduceMotion ? (
                      <path
                        key={branch.path}
                        d={branch.path}
                        stroke="var(--mqs-accent)"
                        strokeOpacity="0.72"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.9"
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : (
                      <motion.path
                        key={branch.path}
                        d={branch.path}
                        stroke="var(--mqs-accent)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="0.14"
                        filter="url(#audience-trail-glow)"
                        strokeDasharray={`${pulseLength} 500`}
                        initial={{ strokeDashoffset: pulseLength }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{
                          strokeDashoffset: {
                            duration: TRACER_DURATION,
                            ease: TRACER_EASE,
                          },
                        }}
                      />
                    );
                  })}
                </motion.g>
              ) : null}
            </AnimatePresence>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
