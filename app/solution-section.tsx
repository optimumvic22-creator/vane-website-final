'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { useLocale } from '@/lib/locale'
import { Section } from '@/components/ui/section'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'

/* ── Trajectories ──────────────────────────────────────────────── */

const SEDENTARY_TRAJECTORY = [
  { age: 20, mqs: 50 }, { age: 25, mqs: 51 }, { age: 30, mqs: 50 },
  { age: 35, mqs: 48 }, { age: 40, mqs: 45 }, { age: 45, mqs: 42 },
  { age: 50, mqs: 39 }, { age: 55, mqs: 36 }, { age: 60, mqs: 33 },
  { age: 65, mqs: 30 }, { age: 70, mqs: 27 }, { age: 74, mqs: 25 },
  { age: 80, mqs: 22 }, { age: 85, mqs: 20 }, { age: 90, mqs: 17 },
]

const ATHLETE_TRAJECTORY = [
  { age: 20, mqs: 80 }, { age: 25, mqs: 82 }, { age: 30, mqs: 84 },
  { age: 35, mqs: 83 }, { age: 40, mqs: 80 }, { age: 45, mqs: 76 },
  { age: 50, mqs: 71 }, { age: 55, mqs: 66 }, { age: 60, mqs: 60 },
  { age: 65, mqs: 54 }, { age: 70, mqs: 48 }, { age: 75, mqs: 44 },
  { age: 80, mqs: 41 }, { age: 85, mqs: 39 }, { age: 90, mqs: 37 },
]

function getMqsAtAge(trajectory: { age: number; mqs: number }[], age: number): number {
  if (age <= trajectory[0].age) return trajectory[0].mqs
  if (age >= trajectory[trajectory.length - 1].age) return trajectory[trajectory.length - 1].mqs
  for (let i = 0; i < trajectory.length - 1; i++) {
    if (age >= trajectory[i].age && age <= trajectory[i + 1].age) {
      const t = (age - trajectory[i].age) / (trajectory[i + 1].age - trajectory[i].age)
      return Math.round(trajectory[i].mqs + t * (trajectory[i + 1].mqs - trajectory[i].mqs))
    }
  }
  return trajectory[0].mqs
}

/* ── MQS Zone Color ────────────────────────────────────────────── */

function getMqsColorClass(mqs: number): string {
  if (mqs < 25) return 'text-red-400'
  if (mqs < 40) return 'text-amber-400'
  if (mqs < 60) return 'text-foreground'
  if (mqs < 80) return 'text-emerald-400'
  if (mqs < 90) return 'text-purple-400'
  return 'text-purple-300'
}

/* ── Age Variant ───────────────────────────────────────────────── */

function variantForAge(age: number): 'young' | 'mid' | 'elder' {
  if (age < 40) return 'young'
  if (age < 65) return 'mid'
  return 'elder'
}

/* ── SVG Gradient Defs (shared) ────────────────────────────────── */

function SilhouetteGradients() {
  return (
    <defs>
      <linearGradient id="silShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#252525" />
        <stop offset="55%" stopColor="#1a1a1a" />
        <stop offset="100%" stopColor="#111111" />
      </linearGradient>
      <linearGradient id="silShadeDarker" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e1e1e" />
        <stop offset="55%" stopColor="#141414" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
    </defs>
  )
}

const ED = { stroke: 'rgba(255,255,255,0.10)', strokeWidth: 0.6 }
const FA = { fill: 'url(#silShade)' }
const FB = { fill: 'url(#silShadeDarker)' }

/* ── Sedentary Silhouettes ─────────────────────────────────────── */

function SedentaryYoung() {
  return (
    <svg className="silhouette" viewBox="0 0 200 380" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <SilhouetteGradients />
      <path d="M 88 30 Q 84 10 103 8 Q 120 10 117 30 Q 122 18 103 14 Q 82 18 88 30 Z" {...FB} {...ED} />
      <path d="M 90 36 Q 87 16 103 14 Q 118 16 115 36 Q 122 48 112 58 Q 103 64 93 58 Q 82 48 90 36 Z" {...FA} {...ED} />
      <path d="M 95 56 L 110 56 L 112 72 L 90 70 Z" {...FB} {...ED} />
      <path d="M 72 74 Q 62 86 64 110 Q 60 130 54 160 Q 52 180 58 200 Q 66 218 88 220 L 112 220 Q 134 218 142 200 Q 148 180 146 160 Q 150 130 146 110 Q 148 86 138 74 Q 124 66 103 66 Q 82 66 72 74 Z" {...FA} {...ED} />
      <path d="M 68 140 Q 58 170 64 200" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
      <path d="M 142 140 Q 148 170 142 200" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
      <path d="M 86 68 Q 103 78 118 68" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <path d="M 64 100 Q 60 102 64 104" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      <path d="M 146 100 Q 150 102 146 104" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      <path d="M 66 214 Q 90 224 103 226 Q 116 224 140 214" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      <rect x="78" y="148" width="14" height="16" rx="2" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 60 216 L 142 216 L 144 230 L 58 230 Z" {...FB} {...ED} />
      <path d="M 62 230 Q 58 278 64 328 Q 66 348 68 362 L 92 362 Q 96 332 94 284 Q 100 258 98 230 Z" {...FA} {...ED} />
      <path d="M 102 230 Q 100 258 106 284 Q 104 332 108 362 L 132 362 Q 134 348 136 328 Q 142 278 138 230 Z" {...FA} {...ED} />
      <path d="M 64 90 Q 50 130 48 180 L 62 182 Q 64 142 72 100 Z" {...FB} {...ED} />
      <path d="M 146 90 Q 160 130 162 180 L 148 182 Q 146 142 138 100 Z" {...FB} {...ED} />
      <path d="M 64 360 Q 68 372 86 372 Q 96 372 94 360 Z" {...FB} {...ED} />
      <path d="M 106 360 Q 104 372 122 372 Q 136 372 132 360 Z" {...FB} {...ED} />
    </svg>
  )
}

function SedentaryMid() {
  return (
    <svg className="silhouette" viewBox="0 0 200 380" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <SilhouetteGradients />
      <path d="M 90 36 Q 85 14 106 12 Q 122 14 118 36 Q 124 22 106 18 Q 86 22 90 36 Z" {...FB} {...ED} />
      <path d="M 92 42 Q 88 20 106 18 Q 120 20 117 42 Q 124 54 114 64 Q 106 70 94 64 Q 83 54 92 42 Z" {...FA} {...ED} />
      <path d="M 96 62 L 112 62 L 114 78 L 90 76 Z" {...FB} {...ED} />
      <path d="M 70 80 Q 58 92 60 116 Q 54 140 46 172 Q 44 196 52 218 Q 64 238 88 238 L 114 238 Q 138 236 150 218 Q 158 196 156 172 Q 160 140 156 116 Q 158 92 144 80 Q 128 72 106 72 Q 84 72 70 80 Z" {...FA} {...ED} />
      <path d="M 62 148 Q 48 182 56 218" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
      <path d="M 152 148 Q 160 182 154 218" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
      <path d="M 88 74 Q 106 84 120 74" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <path d="M 62 230 Q 88 242 106 244 Q 124 242 148 230" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      <rect x="76" y="156" width="14" height="16" rx="2" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 56 232 L 150 232 L 154 246 L 52 246 Z" {...FB} {...ED} />
      <path d="M 58 246 Q 54 292 62 338 Q 64 356 66 370 L 92 370 Q 96 340 94 294 Q 100 266 98 246 Z" {...FA} {...ED} />
      <path d="M 104 246 Q 102 266 108 294 Q 106 340 110 370 L 136 370 Q 138 356 140 338 Q 148 292 144 246 Z" {...FA} {...ED} />
      <path d="M 60 96 Q 44 138 40 192 L 56 194 Q 60 152 70 106 Z" {...FB} {...ED} />
      <path d="M 156 96 Q 170 138 172 192 L 158 194 Q 156 152 146 106 Z" {...FB} {...ED} />
      <path d="M 62 368 Q 66 380 84 380 Q 96 380 94 368 Z" {...FB} {...ED} />
      <path d="M 108 368 Q 106 380 124 380 Q 140 380 136 368 Z" {...FB} {...ED} />
    </svg>
  )
}

function SedentaryElder() {
  return (
    <svg className="silhouette" viewBox="0 0 200 380" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <SilhouetteGradients />
      <path d="M 94 38 Q 88 16 110 12 Q 128 14 124 38 Q 130 26 110 20 Q 90 24 94 38 Z" {...FB} {...ED} />
      <path d="M 97 48 Q 92 26 110 22 Q 126 24 122 46 Q 128 58 118 66 Q 108 72 96 64 Q 86 56 97 48 Z" {...FA} {...ED} />
      <path d="M 100 64 L 116 66 L 114 82 L 94 80 Z" {...FB} {...ED} />
      <path d="M 72 84 Q 56 100 58 128 Q 48 158 42 192 Q 40 216 50 236 Q 66 254 92 250 L 118 248 Q 142 246 152 228 Q 160 208 158 184 Q 162 152 156 128 Q 158 100 140 84 Q 126 76 106 78 Q 86 80 72 84 Z" {...FA} {...ED} />
      <path d="M 60 138 Q 42 180 50 230" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
      <path d="M 156 138 Q 164 180 158 230" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
      <path d="M 92 80 Q 108 90 122 80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <path d="M 58 242 Q 86 254 106 256 Q 126 254 150 242" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      <path d="M 54 244 L 150 244 L 152 258 L 52 258 Z" {...FB} {...ED} />
      <path d="M 58 258 Q 54 302 62 346 Q 64 360 66 374 L 90 374 Q 94 344 92 298 Q 98 272 96 258 Z" {...FA} {...ED} />
      <path d="M 104 258 Q 102 272 108 298 Q 106 344 110 374 L 134 374 Q 136 360 138 346 Q 146 302 142 258 Z" {...FA} {...ED} />
      <path d="M 58 106 Q 42 148 38 204 L 54 206 Q 56 162 68 116 Z" {...FB} {...ED} />
      <path d="M 156 106 Q 170 148 172 204 L 158 206 Q 156 162 146 116 Z" {...FB} {...ED} />
      <path d="M 62 372 Q 66 384 84 384 Q 94 384 92 372 Z" {...FB} {...ED} />
      <path d="M 108 372 Q 106 384 126 384 Q 138 384 134 372 Z" {...FB} {...ED} />
    </svg>
  )
}

/* ── Athlete Silhouettes ───────────────────────────────────────── */

function AthleteYoung() {
  return (
    <svg className="silhouette" viewBox="0 0 200 380" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <SilhouetteGradients />
      <path d="M 87 26 Q 83 6 100 4 Q 117 6 113 26 Q 118 12 100 8 Q 82 12 87 26 Z" {...FB} {...ED} />
      <path d="M 88 32 Q 86 10 100 10 Q 114 10 112 32 Q 120 44 108 54 Q 100 60 92 54 Q 80 44 88 32 Z" {...FA} {...ED} />
      <path d="M 92 52 L 108 52 L 110 66 L 90 66 Z" {...FB} {...ED} />
      <path d="M 58 70 Q 42 78 48 106 Q 50 118 56 128 Q 62 142 68 156 Q 72 172 76 186 Q 80 194 90 196 L 110 196 Q 120 194 124 186 Q 128 172 132 156 Q 138 142 144 128 Q 150 118 152 106 Q 158 78 142 70 Q 126 62 100 62 Q 74 62 58 70 Z" {...FA} {...ED} />
      <path d="M 82 64 L 76 72" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <path d="M 118 64 L 124 72" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <path d="M 60 90 Q 56 110 62 130" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
      <path d="M 140 90 Q 144 110 138 130" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
      <line x1="100" y1="78" x2="100" y2="192" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      <path d="M 84 140 L 116 140" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <path d="M 86 154 L 114 154" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 88 168 L 112 168" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 74 194 L 126 194 L 124 242 L 76 242 Z" {...FB} {...ED} />
      <path d="M 100 194 L 100 240" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" fill="none" />
      <path d="M 76 242 Q 70 268 68 290 Q 66 310 70 330 Q 68 348 70 360 L 92 360 Q 94 340 96 320 Q 100 300 98 280 Q 100 262 98 242 Z" {...FA} {...ED} />
      <path d="M 102 242 Q 100 262 102 280 Q 100 300 104 320 Q 106 340 108 360 L 130 360 Q 132 348 130 330 Q 134 310 132 290 Q 130 268 124 242 Z" {...FA} {...ED} />
      <path d="M 80 254 Q 76 274 72 294" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 120 254 Q 124 274 128 294" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 72 318 Q 68 336 70 356" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
      <path d="M 128 318 Q 132 336 130 356" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
      <path d="M 48 82 Q 36 100 34 128 Q 32 150 36 172 L 50 174 Q 52 148 50 124 Q 48 104 60 86 Z" {...FB} {...ED} />
      <path d="M 152 82 Q 164 100 166 128 Q 168 150 164 172 L 150 174 Q 148 148 150 124 Q 152 104 140 86 Z" {...FB} {...ED} />
      <path d="M 50 88 Q 42 108 38 132" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 150 88 Q 158 108 162 132" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M 66 358 Q 68 370 88 370 Q 96 370 94 358 Z" {...FB} {...ED} />
      <path d="M 134 358 Q 132 370 112 370 Q 104 370 106 358 Z" {...FB} {...ED} />
    </svg>
  )
}

function AthleteMid() {
  return (
    <svg className="silhouette" viewBox="0 0 200 380" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <SilhouetteGradients />
      <path d="M 87 28 Q 83 8 100 6 Q 117 8 113 28 Q 118 14 100 10 Q 82 14 87 28 Z" {...FB} {...ED} />
      <path d="M 88 34 Q 86 12 100 12 Q 114 12 112 34 Q 120 46 108 56 Q 100 62 92 56 Q 80 46 88 34 Z" {...FA} {...ED} />
      <path d="M 92 54 L 108 54 L 110 68 L 90 68 Z" {...FB} {...ED} />
      <path d="M 60 72 Q 44 80 50 108 Q 52 120 58 130 Q 64 144 70 158 Q 74 174 78 188 Q 82 198 90 200 L 110 200 Q 118 198 122 188 Q 126 174 130 158 Q 136 144 142 130 Q 148 120 150 108 Q 156 80 140 72 Q 126 64 100 64 Q 76 64 60 72 Z" {...FA} {...ED} />
      <path d="M 82 66 L 76 74" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <path d="M 118 66 L 124 74" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <path d="M 62 92 Q 58 112 64 132" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
      <path d="M 138 92 Q 142 112 136 132" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
      <line x1="100" y1="80" x2="100" y2="196" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      <path d="M 76 198 L 124 198 L 122 242 L 78 242 Z" {...FB} {...ED} />
      <path d="M 78 242 Q 72 268 70 292 Q 68 312 72 332 Q 70 350 72 364 L 92 364 Q 94 342 96 322 Q 100 302 98 282 Q 100 264 98 242 Z" {...FA} {...ED} />
      <path d="M 102 242 Q 100 264 102 282 Q 100 302 104 322 Q 106 342 108 364 L 128 364 Q 130 350 128 332 Q 132 312 130 292 Q 128 268 122 242 Z" {...FA} {...ED} />
      <path d="M 50 84 Q 38 102 36 130 Q 34 152 38 174 L 52 176 Q 54 150 52 126 Q 50 106 62 88 Z" {...FB} {...ED} />
      <path d="M 150 84 Q 162 102 164 130 Q 166 152 162 174 L 148 176 Q 146 150 148 126 Q 150 106 138 88 Z" {...FB} {...ED} />
      <path d="M 68 362 Q 70 374 88 374 Q 96 374 96 362 Z" {...FB} {...ED} />
      <path d="M 132 362 Q 130 374 112 374 Q 104 374 104 362 Z" {...FB} {...ED} />
    </svg>
  )
}

function AthleteElder() {
  return (
    <svg className="silhouette" viewBox="0 0 200 380" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <SilhouetteGradients />
      <path d="M 88 34 Q 84 12 101 10 Q 117 12 114 34 Q 120 20 101 14 Q 84 18 88 34 Z" {...FB} {...ED} />
      <path d="M 90 40 Q 88 18 101 18 Q 115 18 113 40 Q 120 52 109 60 Q 100 66 92 60 Q 82 52 90 40 Z" {...FA} {...ED} />
      <path d="M 93 58 L 108 58 L 110 72 L 91 72 Z" {...FB} {...ED} />
      <path d="M 64 76 Q 50 86 54 112 Q 56 124 62 134 Q 68 148 72 162 Q 76 178 80 192 Q 84 202 92 204 L 110 204 Q 118 202 122 192 Q 126 178 130 162 Q 136 148 142 134 Q 148 124 150 112 Q 154 86 140 76 Q 126 68 100 68 Q 78 68 64 76 Z" {...FA} {...ED} />
      <path d="M 84 70 L 80 78" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <path d="M 116 70 L 120 78" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <line x1="100" y1="84" x2="100" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
      <path d="M 78 202 L 122 202 L 124 246 L 76 246 Z" {...FB} {...ED} />
      <path d="M 78 246 Q 72 272 70 296 Q 68 316 72 336 Q 70 354 72 368 L 92 368 Q 94 346 96 326 Q 100 306 98 286 Q 100 268 98 246 Z" {...FA} {...ED} />
      <path d="M 102 246 Q 100 268 102 286 Q 100 306 104 326 Q 106 346 108 368 L 128 368 Q 130 354 128 336 Q 132 316 130 296 Q 128 272 122 246 Z" {...FA} {...ED} />
      <path d="M 54 90 Q 42 108 40 136 Q 38 156 42 178 L 56 180 Q 58 154 56 130 Q 54 110 66 94 Z" {...FB} {...ED} />
      <path d="M 146 90 Q 158 108 160 136 Q 162 156 158 178 L 144 180 Q 142 154 144 130 Q 146 110 134 94 Z" {...FB} {...ED} />
      <path d="M 68 366 Q 70 378 88 378 Q 96 378 96 366 Z" {...FB} {...ED} />
      <path d="M 132 366 Q 130 378 112 378 Q 104 378 104 366 Z" {...FB} {...ED} />
    </svg>
  )
}

/* ── Chart Labels (locale-aware) ───────────────────────────────── */

interface ChartLabels {
  ariaLabel: string
  populationAverage: string
  zoneDependent: string
  zoneUnfit: string
  zoneAverage: string
  zoneAboveAvg: string
  zoneAthlete: string
  phaseBuilding: string
  phaseCruise: string
  phaseCritical: string
  phaseIndependence: string
  axisMqs: string
  axisAge: string
  sliderMin: string
  sliderMax: string
  badgeDependent: string
  badgeIndependent: string
  legendAthlete: string
  legendSedentary: string
}

const CHART_LABELS: { en: ChartLabels; de: ChartLabels } = {
  en: {
    ariaLabel: 'Lifespan trajectory chart',
    populationAverage: 'POPULATION AVERAGE',
    zoneDependent: 'DEPENDENT',
    zoneUnfit: 'UNFIT',
    zoneAverage: 'AVERAGE',
    zoneAboveAvg: 'ABOVE AVG',
    zoneAthlete: 'ATHLETE',
    phaseBuilding: 'BUILDING',
    phaseCruise: 'CRUISE CONTROL',
    phaseCritical: 'CRITICAL DROP',
    phaseIndependence: 'INDEPENDENCE WINDOW',
    axisMqs: 'MQS',
    axisAge: 'AGE',
    sliderMin: 'Age 20',
    sliderMax: 'Age 90',
    badgeDependent: 'DEPENDENT',
    badgeIndependent: 'INDEPENDENT',
    legendAthlete: 'Athlete',
    legendSedentary: 'Sedentary',
  },
  de: {
    ariaLabel: 'Lebensverlauf Diagramm',
    // Space-constrained axis/zone/phase labels use short synonyms so the
    // longer German words don't overflow their SVG slots.
    populationAverage: 'DURCHSCHNITT',
    zoneDependent: 'FRAGIL',
    zoneUnfit: 'TRÄGE',
    zoneAverage: 'MITTEL',
    zoneAboveAvg: 'STARK',
    zoneAthlete: 'ATHLET',
    phaseBuilding: 'AUFBAU',
    phaseCruise: 'AUTOPILOT',
    phaseCritical: 'KRITISCHER ABFALL',
    phaseIndependence: 'UNABHÄNGIGKEIT',
    axisMqs: 'MQS',
    axisAge: 'ALTER',
    sliderMin: 'Alter 20',
    sliderMax: 'Alter 90',
    badgeDependent: 'ABHÄNGIG',
    badgeIndependent: 'UNABHÄNGIG',
    legendAthlete: 'Athlet',
    legendSedentary: 'Sitzend',
  },
}

/* ── Lifespan Chart ────────────────────────────────────────────── */

function LifespanChart({ reducedMotion, labels }: { reducedMotion: boolean | null; labels: ChartLabels }) {
  return (
    <svg viewBox="0 0 760 500" preserveAspectRatio="none" aria-label={labels.ariaLabel} className="h-full w-full">
      {/* Zone background bands */}
      <rect x="60" y="325" width="660" height="95" fill="rgba(224,90,90,0.05)" />
      <rect x="60" y="268" width="660" height="57" fill="rgba(224,90,90,0.03)" />
      <rect x="60" y="116" width="660" height="76" fill="rgba(107,203,119,0.04)" />
      <rect x="60" y="40" width="660" height="76" fill="rgba(155,114,233,0.04)" />

      {/* Gridlines */}
      <line className="stroke-white/[0.08]" x1="60" y1="325" x2="720" y2="325" strokeWidth="1" />
      <line className="stroke-white/[0.08]" x1="60" y1="268" x2="720" y2="268" strokeWidth="1" />
      <line className="stroke-white/[0.08]" x1="60" y1="192" x2="720" y2="192" strokeWidth="1" />
      <line className="stroke-white/[0.08]" x1="60" y1="116" x2="720" y2="116" strokeWidth="1" />
      <line className="stroke-white/[0.08]" x1="154.3" y1="40" x2="154.3" y2="420" strokeWidth="1" />
      <line className="stroke-white/[0.08]" x1="248.6" y1="40" x2="248.6" y2="420" strokeWidth="1" />
      <line className="stroke-white/[0.08]" x1="342.9" y1="40" x2="342.9" y2="420" strokeWidth="1" />
      <line className="stroke-white/[0.08]" x1="437.1" y1="40" x2="437.1" y2="420" strokeWidth="1" />
      <line className="stroke-white/[0.08]" x1="531.4" y1="40" x2="531.4" y2="420" strokeWidth="1" />
      <line className="stroke-white/[0.08]" x1="625.7" y1="40" x2="625.7" y2="420" strokeWidth="1" />

      {/* Axes */}
      <line className="stroke-white/[0.14]" x1="60" y1="40" x2="60" y2="420" strokeWidth="1" />
      <line className="stroke-white/[0.14]" x1="60" y1="420" x2="720" y2="420" strokeWidth="1" />

      {/* Population average */}
      <line className="stroke-white/[0.14]" x1="60" y1="230" x2="720" y2="230" strokeWidth="1" strokeDasharray="3 4" />
      <text className="fill-white/[0.58] font-mono text-[9px] uppercase tracking-[0.2em]" x="640" y="224">{labels.populationAverage}</text>

      {/* Y-axis ticks */}
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="46" y="329" textAnchor="end">25</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="46" y="272" textAnchor="end">40</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="46" y="234" textAnchor="end">50</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="46" y="196" textAnchor="end">60</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="46" y="120" textAnchor="end">80</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="46" y="44" textAnchor="end">100</text>

      {/* Zone labels on right */}
      <text className="fill-red-400 font-mono text-[8px] uppercase tracking-[0.14em]" x="726" y="355">{labels.zoneDependent}</text>
      <text className="fill-white/[0.58] font-mono text-[8px] uppercase tracking-[0.14em]" x="726" y="298">{labels.zoneUnfit}</text>
      <text className="fill-white/[0.58] font-mono text-[8px] uppercase tracking-[0.14em]" x="726" y="234">{labels.zoneAverage}</text>
      <text className="fill-emerald-400 font-mono text-[8px] uppercase tracking-[0.14em]" x="726" y="174">{labels.zoneAboveAvg}</text>
      <text className="fill-purple-400 font-mono text-[8px] uppercase tracking-[0.14em]" x="726" y="98">{labels.zoneAthlete}</text>

      {/* X-axis ticks */}
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="60" y="440" textAnchor="middle">20</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="154.3" y="440" textAnchor="middle">30</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="248.6" y="440" textAnchor="middle">40</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="342.9" y="440" textAnchor="middle">50</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="437.1" y="440" textAnchor="middle">60</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="531.4" y="440" textAnchor="middle">70</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="625.7" y="440" textAnchor="middle">80</text>
      <text className="fill-white/[0.58] font-mono text-[11px] tracking-[0.04em]" x="720" y="440" textAnchor="middle">90</text>

      {/* Age-phase brackets */}
      {/* BUILDING 20-35 */}
      <line x1="60" y1="455" x2="201.4" y2="455" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1="60" y1="452" x2="60" y2="458" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1="201.4" y1="452" x2="201.4" y2="458" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <text className="fill-white/[0.58] font-mono text-[8.5px] uppercase tracking-[0.14em]" x="130.7" y="470" textAnchor="middle">{labels.phaseBuilding}</text>

      {/* CRUISE CONTROL 35-45 */}
      <line x1="201.4" y1="455" x2="295.7" y2="455" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1="295.7" y1="452" x2="295.7" y2="458" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <text className="fill-white/[0.58] font-mono text-[8.5px] uppercase tracking-[0.14em]" x="248.6" y="470" textAnchor="middle">{labels.phaseCruise}</text>

      {/* CRITICAL DROP 45-65 */}
      <line x1="295.7" y1="455" x2="484.3" y2="455" stroke="#E9B872" strokeWidth="1" />
      <line x1="295.7" y1="452" x2="295.7" y2="458" stroke="#E9B872" strokeWidth="1" />
      <line x1="484.3" y1="452" x2="484.3" y2="458" stroke="#E9B872" strokeWidth="1" />
      <text className="fill-amber-400 font-mono text-[8.5px] uppercase tracking-[0.14em]" x="390" y="470" textAnchor="middle">{labels.phaseCritical}</text>

      {/* INDEPENDENCE WINDOW 65-90 */}
      <line x1="484.3" y1="455" x2="720" y2="455" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1="484.3" y1="452" x2="484.3" y2="458" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1="720" y1="452" x2="720" y2="458" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <text className="fill-white/[0.58] font-mono text-[8.5px] uppercase tracking-[0.14em]" x="602.1" y="470" textAnchor="middle">{labels.phaseIndependence}</text>

      {/* Athlete trajectory */}
      <path
        className={reducedMotion ? '' : 'animate-[draw_2.2s_cubic-bezier(.16,1,.3,1)_.3s_forwards]'}
        fill="none"
        stroke="var(--mqs-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={reducedMotion ? 'none' : '1400'}
        strokeDashoffset={reducedMotion ? '0' : '1400'}
        d="M 60 116 C 75 112, 90 110, 107.1 108.4 S 140 102, 154.3 100.8 S 185 103, 201.4 104.6 S 235 112, 248.6 116 S 280 127, 295.7 131.2 S 325 145, 342.9 150.2 S 375 164, 390 169.2 S 420 186, 437.1 192 S 468 208, 484.3 214.8 S 515 232, 531.4 237.6 S 562 248, 578.6 252.8 S 610 260, 625.7 264.2 S 657 268, 672.9 271.8 S 705 276, 720 279.4"
      />

      {/* Sedentary trajectory */}
      <path
        className={reducedMotion ? '' : 'animate-[draw_2.2s_cubic-bezier(.16,1,.3,1)_.6s_forwards]'}
        fill="none"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={reducedMotion ? 'none' : '1400'}
        strokeDashoffset={reducedMotion ? '0' : '1400'}
        d="M 60 230 C 75 228, 90 227, 107.1 226.2 S 140 229, 154.3 230 S 185 235, 201.4 237.6 S 235 245, 248.6 249 S 280 256, 295.7 260.4 S 325 267, 342.9 271.8 S 375 279, 390 283.2 S 420 290, 437.1 294.6 S 468 302, 484.3 306 S 515 313, 531.4 317.4 S 555 322, 569.1 325 S 610 332, 625.7 336.4 S 657 340, 672.9 344 S 705 352, 720 355.4"
      />
    </svg>
  )
}

/* ── Default Copy ──────────────────────────────────────────────── */

const DEFAULTS = {
  overline: 'The solution',
  overlineDe: 'Die Lösung',
  headline: 'Your entire movement. One number.',
  headlineDe: 'Deine gesamte Bewegung. Eine Zahl.',
  description: 'Like an IQ test, but for your body. The MQS captures seven areas of your movement and compares you to people your age. Above 50? Above average. Below 40? Worth a closer look.',
  descriptionDe: 'Wie ein IQ Test, aber f\u00fcr deinen K\u00f6rper. Der MQS misst sieben Bereiche deiner Bewegung und vergleicht dich mit Menschen deines Alters und Geschlechts. Ein Score \u00fcber 50 hei\u00dft: Du bewegst dich besser als der Durchschnitt.',
  sliderStatement: 'How you move today shapes how you age tomorrow.',
  sliderStatementDe: 'Wie du dich heute bewegst, bestimmt, wie du morgen alterst.',
  lifespanItems: [
    'The MQS stays with you. For life.',
    "At 25, it shows where you're vulnerable.",
    'At 45, which training works best for you.',
    'At 65, whether your movement supports independent living.',
    'Same metric. Your context gives it meaning.',
  ],
  lifespanItemsDe: [
    'Der MQS begleitet dich. Für immer.',
    'Mit 25 zeigt er, wo du verwundbar bist.',
    'Mit 45, welches Training für dich am besten funktioniert.',
    'Mit 65, ob deine Bewegung unabhängiges Leben ermöglicht.',
    'Gleiche Metrik. Dein Kontext gibt ihr Bedeutung.',
  ],
  personA: {
    label: 'Person A',
    labelDe: 'Person A',
    sublabel: 'Sedentary Office Worker',
    sublabelDe: 'Bürojob, wenig Bewegung',
    bullets: ['Sedentary lifestyle', 'Minimal exercise', 'Average diet'],
    bulletsDe: ['Sitzender Lebensstil', 'Minimale Bewegung', 'Durchschnittliche Ernährung'],
  },
  personB: {
    label: 'Person B',
    labelDe: 'Person B',
    sublabel: 'Competitive Athlete',
    sublabelDe: 'Leistungssportler',
    bullets: ['Active lifestyle', 'Regular training', 'Performance nutrition'],
    bulletsDe: ['Aktiver Lebensstil', 'Regelm\u00E4\u00DFiges Training', 'Leistungsern\u00E4hrung'],
  },
}

const LIFESPAN_AGES: { en: string; de: string }[] = [
  { en: 'FOR LIFE', de: 'FÜR IMMER' },
  { en: 'AGE 25', de: 'MIT 25' },
  { en: 'AGE 45', de: 'MIT 45' },
  { en: 'AGE 65', de: 'MIT 65' },
  { en: 'SAME METRIC', de: 'GLEICHE METRIK' },
]
const LIFESPAN_ANCHORED = [false, true, true, true, false]

/* ── Scale Bar Segments ────────────────────────────────────────── */

const SCALE_SEGMENTS: { label: { en: string; de: string }; width: string; bg: string }[] = [
  { label: { en: 'Dependent', de: 'Abhängig' }, width: '25%', bg: 'bg-red-500/40' },
  { label: { en: 'Unfit', de: 'Untrainiert' }, width: '15%', bg: 'bg-red-500/25' },
  { label: { en: 'Average', de: 'Durchschnitt' }, width: '20%', bg: 'bg-white/[0.18]' },
  { label: { en: 'Above Average', de: 'Überdurchschnitt' }, width: '20%', bg: 'bg-emerald-500/40' },
  { label: { en: 'Athlete', de: 'Athlet' }, width: '10%', bg: 'bg-purple-500/35' },
  { label: { en: 'Elite Athlete', de: 'Elite-Athlet' }, width: '10%', bg: 'bg-purple-400/45' },
]

/* ── Component Interface ───────────────────────────────────────── */

interface SolutionSectionProps {
  data?: {
    solutionHeadline?: string
    solutionHeadlineDe?: string
    solutionDescription?: string
    solutionDescriptionDe?: string
    solutionSliderStatement?: string
    solutionSliderStatementDe?: string
    solutionLifespanItems?: string[]
    solutionLifespanItemsDe?: string[]
    solutionPersonA?: {
      label?: string
      labelDe?: string
      sublabel?: string
      sublabelDe?: string
      bullets?: string[]
      bulletsDe?: string[]
    }
    solutionPersonB?: {
      label?: string
      labelDe?: string
      sublabel?: string
      sublabelDe?: string
      bullets?: string[]
      bulletsDe?: string[]
    }
  } | null
}

/* ── Main Component ────────────────────────────────────────────── */

export function SolutionSection({ data }: SolutionSectionProps) {
  const { locale } = useLocale()
  const reducedMotion = useReducedMotion()
  const [age, setAge] = useState(20)

  const isDE = locale === 'de'
  const chart = isDE ? CHART_LABELS.de : CHART_LABELS.en

  const overline = isDE ? DEFAULTS.overlineDe : DEFAULTS.overline
  const headline = (isDE ? data?.solutionHeadlineDe : data?.solutionHeadline) || (isDE ? DEFAULTS.headlineDe : DEFAULTS.headline)
  const description = (isDE ? data?.solutionDescriptionDe : data?.solutionDescription) || (isDE ? DEFAULTS.descriptionDe : DEFAULTS.description)
  const sliderStatement = (isDE ? data?.solutionSliderStatementDe : data?.solutionSliderStatement) || (isDE ? DEFAULTS.sliderStatementDe : DEFAULTS.sliderStatement)
  const lifespanItems = (isDE ? data?.solutionLifespanItemsDe : data?.solutionLifespanItems) || (isDE ? DEFAULTS.lifespanItemsDe : DEFAULTS.lifespanItems)

  const personALabel = (isDE ? data?.solutionPersonA?.labelDe : data?.solutionPersonA?.label) || (isDE ? DEFAULTS.personA.labelDe : DEFAULTS.personA.label)
  const personABullets = (isDE ? data?.solutionPersonA?.bulletsDe : data?.solutionPersonA?.bullets) || (isDE ? DEFAULTS.personA.bulletsDe : DEFAULTS.personA.bullets)
  const personBLabel = (isDE ? data?.solutionPersonB?.labelDe : data?.solutionPersonB?.label) || (isDE ? DEFAULTS.personB.labelDe : DEFAULTS.personB.label)
  const personBBullets = (isDE ? data?.solutionPersonB?.bulletsDe : data?.solutionPersonB?.bullets) || (isDE ? DEFAULTS.personB.bulletsDe : DEFAULTS.personB.bullets)

  const personASublabel = (isDE ? data?.solutionPersonA?.sublabelDe : data?.solutionPersonA?.sublabel) || (isDE ? DEFAULTS.personA.sublabelDe : DEFAULTS.personA.sublabel)
  const personBSublabel = (isDE ? data?.solutionPersonB?.sublabelDe : data?.solutionPersonB?.sublabel) || (isDE ? DEFAULTS.personB.sublabelDe : DEFAULTS.personB.sublabel)

  const mqsA = useMemo(() => getMqsAtAge(SEDENTARY_TRAJECTORY, age), [age])
  const mqsB = useMemo(() => getMqsAtAge(ATHLETE_TRAJECTORY, age), [age])
  const variant = useMemo(() => variantForAge(age), [age])
  const showBadges = age >= 74

  const handleAgeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(parseInt(e.target.value, 10))
  }, [])

  return (
    <Section spacing="xl" className="bg-[#0A0B0D]">
      <Container>
        {/* Section Header */}
        <motion.div {...sectionReveal()}>
          <SectionHeader overline={overline} title={headline} description={description} align="center" />
        </motion.div>

        {/* MQS Scale Bar */}
        <motion.div {...sectionReveal(0.2)} className="relative mt-12 mb-16">
          <div className="relative flex h-10 overflow-visible rounded-md">
            {SCALE_SEGMENTS.map((seg, i) => (
              <div
                key={seg.label.en}
                className={`relative flex items-center justify-center ${seg.bg} ${i < SCALE_SEGMENTS.length - 1 ? 'border-r border-white/[0.14]' : ''} ${i === 0 ? 'rounded-l-md' : ''} ${i === SCALE_SEGMENTS.length - 1 ? 'rounded-r-md' : ''}`}
                style={{ width: seg.width }}
              >
                {/* Labels physically can't fit at <sm (they collide and overflow);
                    zone names remain visible in the lifespan chart below. */}
                <span className="pointer-events-none hidden select-none font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 whitespace-nowrap sm:inline">
                  {isDE ? seg.label.de : seg.label.en}
                </span>
              </div>
            ))}

            {/* Sedentary Marker */}
            <div
              className="pointer-events-none absolute bottom-full z-[3] mb-1 flex -translate-x-1/2 flex-col items-center transition-[left] duration-400"
              style={{ left: `${mqsA}%`, transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
            >
              <span className="mb-0.5 whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-white/[0.58]">
                {personALabel}
              </span>
              <span className="rounded-[3px] bg-[#C6CBD3] px-1.5 py-0.5 font-mono text-[11px] font-medium leading-tight tracking-[0.06em] text-[#101318] tabular-nums">
                {mqsA}
              </span>
              <div className="mt-[-1px] h-0 w-0 border-x-[6px] border-t-[7px] border-x-transparent border-t-[#C6CBD3]" />
            </div>

            {/* Athlete Marker */}
            <div
              className="pointer-events-none absolute bottom-full z-[3] mb-1 flex -translate-x-1/2 flex-col items-center transition-[left] duration-400"
              style={{ left: `${mqsB}%`, transitionTimingFunction: 'cubic-bezier(.16,1,.3,1)' }}
            >
              <span className="mb-0.5 whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-white/[0.58]">
                {personBLabel}
              </span>
              <span className="rounded-[3px] bg-[var(--mqs-accent)] px-1.5 py-0.5 font-mono text-[11px] font-medium leading-tight tracking-[0.06em] text-[#050607] tabular-nums">
                {mqsB}
              </span>
              <div className="mt-[-1px] h-0 w-0 border-x-[6px] border-t-[7px] border-x-transparent border-t-[var(--mqs-accent)]" />
            </div>
          </div>
        </motion.div>

        {/* Two Figures */}
        <motion.div {...sectionReveal(0.3)} className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-12">
          {/* LEFT - Sedentary */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            {/* Side panel - MQS + bullets */}
            <div className="flex flex-col items-center pt-6 md:min-w-[140px] md:items-start">
              <span className="mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/[0.58]">MQS</span>
              <span className={`mb-6 font-mono text-7xl font-light leading-[0.9] tracking-[-0.04em] tabular-nums transition-colors duration-400 ${getMqsColorClass(mqsA)}`}>
                {mqsA}
              </span>
              <ul className="flex flex-col gap-2">
                {personABullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/[0.58]">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-white/[0.18]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Figure center */}
            <div className="flex flex-col items-center shrink-0">
              <div className="mb-4 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-white/[0.58]">
                {personALabel} &middot; {personASublabel}
              </div>
              <div className="relative h-[380px] w-[180px]">
                <div className={`absolute inset-0 transition-opacity duration-300 ${variant === 'young' ? 'opacity-100' : 'opacity-0'}`}>
                  <SedentaryYoung />
                </div>
                <div className={`absolute inset-0 transition-opacity duration-300 ${variant === 'mid' ? 'opacity-100' : 'opacity-0'}`}>
                  <SedentaryMid />
                </div>
                <div className={`absolute inset-0 transition-opacity duration-300 ${variant === 'elder' ? 'opacity-100' : 'opacity-0'}`}>
                  <SedentaryElder />
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-white/[0.58]">{chart.axisAge}</span>
                <span className="font-mono text-[56px] font-light leading-none tracking-[-0.03em] text-foreground tabular-nums">{age}</span>
              </div>
            </div>
          </div>

          {/* RIGHT - Athlete */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            {/* Figure center */}
            <div className="flex flex-col items-center shrink-0 order-1 md:order-none">
              <div className="mb-4 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-white/[0.58]">
                {personBLabel} &middot; {personBSublabel}
              </div>
              <div className="relative h-[380px] w-[180px]">
                <div className={`absolute inset-0 transition-opacity duration-300 ${variant === 'young' ? 'opacity-100' : 'opacity-0'}`}>
                  <AthleteYoung />
                </div>
                <div className={`absolute inset-0 transition-opacity duration-300 ${variant === 'mid' ? 'opacity-100' : 'opacity-0'}`}>
                  <AthleteMid />
                </div>
                <div className={`absolute inset-0 transition-opacity duration-300 ${variant === 'elder' ? 'opacity-100' : 'opacity-0'}`}>
                  <AthleteElder />
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-white/[0.58]">{chart.axisAge}</span>
                <span className="font-mono text-[56px] font-light leading-none tracking-[-0.03em] text-foreground tabular-nums">{age}</span>
              </div>
            </div>

            {/* Side panel - MQS + bullets */}
            <div className="flex flex-col items-center pt-6 order-2 md:min-w-[140px] md:items-start">
              <span className="mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-white/[0.58]">MQS</span>
              <span className={`mb-6 font-mono text-7xl font-light leading-[0.9] tracking-[-0.04em] tabular-nums transition-colors duration-400 ${getMqsColorClass(mqsB)}`}>
                {mqsB}
              </span>
              <ul className="flex flex-col gap-2">
                {personBBullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/[0.58]">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-white/[0.18]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Flash Badges */}
        <div className="pointer-events-none mb-6 grid min-h-[72px] grid-cols-1 gap-12 md:grid-cols-2">
          <div
            className={`flex items-center justify-center gap-3 rounded-lg border px-6 py-4 font-mono text-sm font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
              showBadges
                ? 'scale-100 opacity-100'
                : 'scale-95 opacity-0'
            } border-red-500/50 bg-red-500/20 text-red-400`}
          >
            <span>{chart.badgeDependent}</span>
            <span className="text-[28px] font-normal tracking-[-0.02em]">{mqsA}</span>
          </div>
          <div
            className={`flex items-center justify-center gap-3 rounded-lg border px-6 py-4 font-mono text-sm font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
              showBadges
                ? 'scale-100 opacity-100'
                : 'scale-95 opacity-0'
            } border-emerald-500/50 bg-emerald-500/20 text-emerald-400`}
          >
            <span>{chart.badgeIndependent}</span>
            <span className="text-[28px] font-normal tracking-[-0.02em]">{mqsB}</span>
          </div>
        </div>

        {/* Slider Zone */}
        <motion.div {...sectionReveal(0.3)} className="mb-24 text-center">
          <p className="mb-8 text-2xl font-normal leading-relaxed text-foreground">{sliderStatement}</p>
          <input
            type="range"
            min={20}
            max={90}
            step={1}
            value={age}
            onChange={handleAgeChange}
            aria-label={isDE ? 'Alter' : 'Age'}
            className="vane-slider w-full cursor-pointer appearance-none bg-transparent outline-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-track]:h-0.5 [&::-moz-range-track]:rounded-none [&::-moz-range-track]:border-none [&::-moz-range-track]:bg-white/[0.14] [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:rounded-none [&::-webkit-slider-runnable-track]:bg-white/[0.14] [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-250 hover:[&::-webkit-slider-thumb]:scale-[1.18]"
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/[0.58]">
            <span>{chart.sliderMin}</span>
            <span>{chart.sliderMax}</span>
          </div>
        </motion.div>

        {/* Lifespan Chart + Right Panel */}
        <motion.div {...sectionReveal(0.4)} className="mt-10 grid grid-cols-1 items-stretch gap-12 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
          {/* Chart Card */}
          <div className="relative min-h-[500px] border-y border-white/[0.08] py-7 pr-5 pl-[60px]">
            {/* Axis titles */}
            <div className="absolute top-1/2 left-2 origin-left -rotate-90 translate-x-0 translate-y-[40%] font-mono text-[10px] uppercase tracking-[0.24em] text-white/[0.58] whitespace-nowrap">
              MQS
            </div>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/[0.58]">
              {chart.axisAge}
            </div>
            {/* Legend */}
            <div className="absolute top-5 right-5 z-[2] flex flex-col gap-2 rounded border border-white/[0.08] bg-black/40 px-3.5 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/[0.58] backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <span className="inline-block h-[1.5px] w-5 bg-[var(--mqs-accent)]" />
                {chart.legendAthlete}
              </div>
              <div className="flex items-center gap-2.5">
                <span className="inline-block h-[1.5px] w-5 bg-[#9CA3AF]" />
                {chart.legendSedentary}
              </div>
            </div>
            <LifespanChart reducedMotion={reducedMotion} labels={chart} />
          </div>

          {/* Life List */}
          <ul className="flex flex-col justify-between border-t border-white/[0.14] lg:border-t-0 lg:border-l lg:border-white/[0.14]">
            {lifespanItems.map((item, i) => (
              <li
                key={i}
                className={`relative flex flex-1 flex-col justify-center border-b border-white/[0.08] py-6 pl-0 text-[15px] font-normal leading-relaxed text-white/[0.58] last:border-b-0 lg:pl-7 ${
                  LIFESPAN_ANCHORED[i] ? '' : ''
                }`}
              >
                {/* Horizontal tick mark (desktop only) */}
                <span
                  className={`absolute top-1/2 left-[-1px] hidden h-px w-3.5 lg:block ${
                    LIFESPAN_ANCHORED[i] ? 'bg-[var(--mqs-accent)]' : 'bg-white/[0.14]'
                  }`}
                />
                <span className={`mb-1.5 inline-block font-mono text-[10px] uppercase tracking-[0.2em] ${LIFESPAN_ANCHORED[i] ? 'text-[var(--mqs-value-inv)]' : 'text-white/[0.58]'}`}>
                  {isDE ? LIFESPAN_AGES[i].de : LIFESPAN_AGES[i].en}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </Section>
  )
}
