# Coach landing page — implementation guide

**For:** Codex, working in this repo on localhost
**Owner:** Dario (VANE Science)
**Date:** 13 October 2026
**Page:** `/for/coach`
**Copy source:** `docs/COACH-LANDING-COPY.md` has every headline, sentence, FAQ answer and media item. This file says **how to build it and how it should look and feel**. If the two disagree on wording, the copy file wins. If they disagree on build or design, this file wins.

---

## 0. Before you start

1. **Leave the uncommitted work alone.** `AGENTS.md`, `app/impressum/page.tsx`, `components/layout/AudienceEntry.tsx`, `components/layout/SiteChrome.tsx` and `components/layout/EntryFooter.tsx` have changes that aren't part of this task. Don't edit, stage or commit them. Work on your own branch.
2. Read `AGENTS.md`. This Next.js version differs from the one you know, so check `node_modules/next/dist/docs/` before using any Next API.
3. Read `docs/MQS-WEB-CONTRACT.md`. The seven domains, their order, codes and colours are bound to it. Use `lib/domain-colors.ts` and `lib/mqs-interaction.ts`; never invent domain values.
4. **Don't touch the athlete and partner pages.** The partner page is finished (`components/ui/partner-partnership-sections.tsx`). Any change to shared code must leave both pages pixel-identical.

---

## 1. What we're building, in one paragraph

A long, confident product page that makes a coach feel: *"high-level movement analysis is now easy, and I can do it next week."* It explains the **Movement Quality Score** and **NormVault**, shows the **software itself** in a new click-through product tour, and walks through:
- force plates;
- the iPhone;
- lab validation;
- online coaching;
- the AI report;
- the time it gives back.

It's written in the present tense. The product is finished; visitors join a waitlist.

---

## 2. Architecture

The coach page is now too different from the shared template, so it gets its own component. The athlete and partner pages keep using the template.

| What | Where |
|---|---|
| Route split | `app/for/[audience]/page.tsx`: render `<CoachLanding />` when `audience === 'coach'`, otherwise `<AudienceLanding />` as today. Metadata description for coach comes from the new coach copy (hero subline). |
| Page component | **new** `app/for/[audience]/coach-landing.tsx` (`'use client'`), composing the sections below |
| Shared primitives | Move `AudienceEyebrow` and `ProcessStepCard` out of `audience-landing.tsx` into **new** `components/ui/audience-primitives.tsx` and import them in both landings. Pure move, no visual change. |
| Coach sections | **new** folder `components/coach/`, one file per section (`coach-score.tsx`, `coach-normvault.tsx`, `coach-tour.tsx`, …) |
| Copy | **new** `lib/coach-content.ts`: one typed object per locale, `Record<Locale, CoachCopy>`, following the pattern in `partner-partnership-sections.tsx`. Every visible string lives here, not in JSX. |
| Product tour data | **new** `lib/coach-tour.ts` (steps, images, alt texts, hotspots, per locale) |
| Header nav | `components/layout/SiteHeader.tsx`: the coach entries (currently `#benefits` / `#how-it-works` / `#results`) become the five anchors in §4 |
| Old coach copy | Remove the `coach` entry's now-unused fields from `lib/audience-content.ts` only if nothing else reads them (the home tile and `StructuredData` may). Otherwise leave them in place. |
| Media | **new** `public/media/coach/` (see §7) |

**German:** build both locales in the same pass. Translate the English copy into the same register as the existing German pages ("Bewegungsqualität", "Coach", "Athlet:in" style as already used, informal "du" only if the existing coach DE copy uses it; match it). No English fallbacks on the German page.

---

## 3. Design direction

The site already has a strong system. Use it, and push it further. This section is the taste. Follow it closely.

### 3.1 The system you're working in

- **Display type:** Bebas Neue (`font-display`), uppercase, tight leading (`leading-[0.94]`–`[0.96]`), `tracking-[0.02em]`, with the existing `[-webkit-text-stroke:0.2px_currentColor] [paint-order:stroke_fill]` trick. Every section headline uses this.
- **Body:** Instrument Sans (`font-sans`), `text-muted-foreground`, 15–17 px, `leading-[1.55]`, never wider than `max-w-[60ch]`.
- **Data:** JetBrains Mono (`font-mono`) for step numbers (`01`, `02`), percentiles, values and labels on product visuals. Mono is what makes the page feel like an instrument rather than a brochure.
- **Accent:** `var(--mqs-value-inv)` (#81D8CF) is the **only** accent colour. Use it for:
  - eyebrow dots;
  - active states;
  - the athlete marker on norm bands;
  - progress lines;
  - one hairline per media frame.
  Never use it for large fills, and never more than one accent element per card.
- **Domain colours** (`DOMAIN_COLORS`) appear **only** where the seven domains are shown: the score section, the setup cards' domain row and the report. They're never decoration anywhere else.
- **Surfaces:** page `bg-background`, alternate bands `bg-[#08090A]`, cards `bg-[#0B0C0E]`, `border-white/10`, `rounded-xl`. Joined card grids use the existing `gap-px` on `bg-white/10` technique, which gives a crisp 1 px grid.
- **Photography treatment** (already used on the site; keep it identical): `brightness-[0.82] contrast-[1.06] saturate-[0.9]`, a bottom gradient scrim `from-black/30`, and a 1 px top hairline in `var(--mqs-value-inv)/55`.

### 3.2 Page rhythm

A long page stays alive through **rhythm**: no two sections in a row may share a layout. Use this map exactly:

| # | Section | Band | Layout |
|---|---|---|---|
| 1 | Hero | background + 80 px grid | Split: copy left, `MqsDashboard` right (existing) |
| 2 | Needs analysis | `#08090A` | Centered headline → 3 joined cards (Assess → Needs analysis → Training) |
| — | Breather | background | **Full-width statement**, display type only |
| 3 | **Product tour** | `#08090A` + 80 px grid | Split: step list left (5/12), app window right (7/12) |
| 4 | The Movement Quality Score | background | Centered headline → flow strip → domain explainer |
| 5 | NormVault | full-bleed network artwork | Split over the artwork: copy left, live norm visual right → 2×2 cards → **breather statement** |
| 6 | Force plates | `#08090A` | Reversed split: visual left, copy right → provider wordmark row → 2×2 joined grid |
| 7 | iPhone & video | background | Centered phone with floating output chips → two-column "add what you have" → 4-step strip |
| 8 | Lab validation | `#08090A` | Split: lab photo left, proof cards right → **breather line** |
| 9 | Online coaching | background | Centered headline → 3-step horizontal with drawn connector |
| 10 | Report | `#08090A` | Split: fanned report pages left, copy + 3 benefits right |
| 11 | Time back | background + ambient video (existing `#results` treatment) | Headline → shrinking-bar visual → "MQS does / You do" split |
| 12 | Setups | `#08090A` | 3 cards, middle one emphasised |
| 13 | FAQ | background | Narrow centered column, existing `accordion` |
| 14 | Waitlist | `#08090A` | Existing waitlist section |

**Breathers** are the luxury moments. These three lines get a full band with nothing else in it, set in display type at `text-6xl md:text-8xl`, centered, `max-w-5xl`:
1. "No biomechanics degree. No learning curve. Objective movement analysis from day one."
2. "Built to become the largest movement-quality database in the world."
3. "Even with one iPhone, you can do serious movement assessment today."

Generous vertical space, `py-24 md:py-36`. One word per line may be tinted with the accent; pick the most important word, at most once per breather.

**Section padding:** keep the existing `py-[4.5rem] md:py-24`, with `scroll-mt-[88px] md:scroll-mt-[104px]` on every anchored section.

### 3.3 Motion: move like the product

- **Easing:** use the desktop app's own curve, `cubic-bezier(0.22, 1, 0.32, 1)`, for every UI transition (tour, tabs, bars), so the website moves like the software. Add it to `lib/motion.ts` as `EASE_MQS` and `TRANSITION_MQS = { duration: 0.45, ease: EASE_MQS }`.
- **Reveals:** `sectionReveal()` for headlines and `staggerReveal(0.08)` with `staggerItem()` for card grids. Reveal **once** (`VIEWPORT_ONCE`).
- **No bounce.** Don't use `SPRING_BOUNCE` or `hoverScale` anywhere on this page. Hover is a quiet `border-white/20` and a 2 px lift at most.
- **Data animates once, meaningfully:**
  - domain bars fill on view (`domainBarFill`);
  - the norm-band marker glides from the 50th percentile to its value;
  - the score counts up once, in mono.
  Nothing loops except video.
- **Respect both switches** on every animated element: `useReducedMotion()` (framer-motion) **and** the site's own pause toggle `useMotionPaused()` (`lib/motion-preference.ts`). With either on, show the final state instantly: no autoplay, no counting, no sliding.

### 3.4 Product visuals: a frame system

Product imagery appears in only two frames, so it always reads as "the software":

- **App window:**
  - `rounded-[14px] border border-white/10 bg-[#0B0C0E]`;
  - a 30 px title bar with three 8 px dots in `#3a3c3f` (muted, not traffic-light colours);
  - shadow `0 30px 80px rgba(0,0,0,0.45)`;
  - a faint accent glow under it (radial gradient `rgba(129,216,207,0.07)`, about 60 % of the frame width, blurred);
  - aspect **16:10**.
- **Phone:** a minimal iPhone outline (`rounded-[44px]`, 10 px bezel `#111`, dynamic-island pill), aspect **9:19.5**. No glossy reflections.

Build both as components (`components/coach/app-window.tsx`, `components/coach/phone-frame.tsx`) and use them everywhere.

**Never show invented UI.** Screenshots come from the real MQS desktop app (§7). The norm band and output chips in §5 are drawn in code as **illustrations**, and their values are labelled "Example athlete".

---

## 4. Navigation

Coach header links, five at most:

| Label EN | Label DE | Anchor |
|---|---|---|
| Product tour | Produkttour | `#tour` |
| The Score | Der Score | `#score` |
| NormVault | NormVault | `#normvault` |
| iPhone & video | iPhone & Video | `#video` |
| Report | Bericht | `#report` |

The rest keep their anchors (`#how`, `#force-plates`, `#validation`, `#online`, `#coach`, `#setups`, `#faq`, `#waitlist`) for deep links, but aren't in the header. The header CTA stays "Join the waitlist" → `#waitlist`.

---

## 5. Section-by-section build

Section numbers in brackets point to the matching part of `COACH-LANDING-COPY.md`.

### 5.1 Hero `#top` [copy 3.1]

- Reuse the existing hero markup (grid background, split, `MqsDashboard variant="audience"`). **The dashboard stays in the hero.** The copy file says to move it to the score section, but the product tour now does the "show the software" job, and the score section gets its own visual (§5.4). So the widget isn't shown twice.
- Use headline option A. The subline is the new one.
- Drop `availabilityNote`. Buttons: "Join the waitlist" → `#waitlist`, and "See how it works" → `#tour`.
- Replace `heroValueRail` with three points (title + detail):
  - **Compare with the world** / *NormVault*
  - **Starts with one iPhone** / *Force plates optional*
  - **Report in minutes** / *You make the call*
- Small print under the buttons, in mono, `text-xs text-white/50`: `MAC · WINDOWS · IPHONE · HAWKIN DYNAMICS · VALD · CC ATHLETICS`.

### 5.2 Needs analysis `#how` [copy 3.2]

- Centered eyebrow + headline + body (cap the body at three short paragraphs).
- Then three **joined** `ProcessStepCard`s: ASSESS / NEEDS ANALYSIS / TRAINING.
  - The middle card carries the accent: a 1 px top border in `var(--mqs-value-inv)` and the label "MQS" in mono.
  - The third card carries the label "YOU".
- Between the cards on desktop, draw a thin chevron in the grid gap (`text-white/30`).
- Follow with **Breather 1**.

### 5.3 Product tour `#tour`: NEW, see §6

### 5.4 The Movement Quality Score `#score` [copy 3.3]

The intellectual centre of the page. Make it feel definitive.

- Centered eyebrow "THE CORE OF MQS", headline "INTRODUCING THE MOVEMENT QUALITY SCORE.", subline.
- **Flow strip:** three joined cards in one row:
  - THE MQS ASSESSMENT → THE MOVEMENT QUALITY SCORE → NORMVAULT;
  - mono step numbers;
  - between them, an SVG connector line that draws itself on view (`pathLength` 0 → 1, `TRANSITION_MQS`, 0.15 s stagger);
  - the middle card is visually heaviest: the score number `55` in display type at `text-8xl`, counting up once.
- **Domain explainer:** seven rows, each with:
  - a 3 px colour bar in its `DOMAIN_COLORS` value, filling on view;
  - the domain name (`font-sans font-semibold`);
  - the one-line explanation (`text-muted-foreground`).
  Use two columns on desktop (4 + 3) and one on mobile. Order and codes follow the web contract.
- Body copy sits in a `max-w-[60ch]` column above the explainer, at most three paragraphs.
- Small print about the overall score and confidence: `text-sm text-white/50`, at the end.

### 5.5 NormVault `#normvault` [copy 3.4]

- **Background:** `/audiences/normvault-network-v2.webp`, full-bleed, `opacity-[0.35]`, with a radial scrim so text stays readable. Slow parallax (≤ 40 px over the section) with motion on; static with motion off.
- **Split:** copy left; right, a **live two-level visual** built in code inside an `app-window` frame:
  - **Top, "The score":** a compact MQS + seven thin domain bars.
  - **Bottom, "Every data point":** two norm bands (one force-plate metric, one kinematic variable). Each band is:
    - a 10 px track with a soft gradient from `white/5` to `white/15`;
    - percentile ticks at 10/25/50/75/90 in mono `text-[10px] text-white/40`;
    - an accent marker (12 px circle with a 1 px ring) that glides from 50 to its value;
    - a label row in mono, e.g. `JUMP HEIGHT · 38.4 CM · P72`.
  - Filter chips above the bands (`Female · 25–34 · Competitive`) as static, non-interactive pills.
  - A tiny caption: "Example athlete".
- **2×2 joined cards** below the split. The first card, "More than a score: every data point", gets the accent hairline.
- End with **Breather 2**, on the same artwork band.

### 5.6 Force plates `#force-plates` [copy 3.5]

- **Reversed split:** visual left, copy right.
- **Visual:** the app window showing the **sync** screenshot (tour step 1 image, reused). Until it exists, show a code-drawn list of 6 test rows staggering in (`date · athlete · test · ✓ synced`, mono). It mimics history arriving.
- **Provider row:** text wordmarks, not logos: `HAWKIN DYNAMICS · VALD · CC ATHLETICS · BERTEC · CSV`, in display type at `text-2xl text-white/45`, spaced with thin separators. On hover a name goes to `text-white`.
- **2×2 joined grid** with the four benefit points and mono numbers.

### 5.7 iPhone & video `#video` [copy 3.6]

- **Centerpiece:** a `phone-frame` playing an existing clip (`/media/audience-motion/konate-depth-jump-web.mp4` via `AmbientVideo`, poster `konate-depth-jump-poster.jpg`) until the real Capture-app recording exists.
- **Floating output chips** around the phone (desktop: two left, two right; mobile: a 2×2 grid below the phone). Each chip has a mono label, a value and a tiny accent dot, and they appear staggered:
  - `KNEE ANGLE · LANDING`
  - `JUMP HEIGHT · FLIGHT TIME`
  - `KINETICS FROM VIDEO`
  - `CONFIDENCE · 0.92`

  Draw thin 1 px leader lines (`white/15`) from each chip to the phone. Label the group "Example athlete" in small print.
- Under it, two columns, "iPhone + force plate" / "Lab setup". Use plain columns with a vertical hairline between them, not cards; we've had enough cards by now.
- The 4-step "How it works" strip: horizontal, mono numbers, with a hairline that runs through all four step dots and fills with accent as it scrolls into view.

### 5.8 Lab validation `#validation` [copy 3.7]

- **Split:** photo left (`/audiences/athlete-training-lab-jump.webp`, standard treatment, `aspect-[4/5]` on desktop), copy right.
- Three proof cards stacked on the right.
  - Each one gets a mono label ("OPTITRACK", "FORCE PLATE", "CONFIDENCE"), a one-line claim and an empty slot for the validation number.
  - **Leave the number slot out** until Dario supplies real numbers (`value?: string` in the copy). Never put a placeholder number in it.
- Use headline option A.
- End with **Breather 3**.

### 5.9 Online coaching `#online` [copy 3.8]

- Centered headline.
- Three steps in a row with lucide icons (`Smartphone` → `Upload` → `FileText`):
  - icons in 44 px rounded squares, `border-white/10`;
  - a dashed connector (`stroke-dasharray`) that draws itself;
  - on mobile, the steps stack vertically with the connector running down the left.
- The closing line "Online coaching has never had data this good." is set larger, in `font-sans font-medium text-2xl`.

### 5.10 Report `#report` [copy 3.9]

- **Split:** left, **three report pages fanned out**:
  - `rotate(-6deg) / 0 / 6deg`, overlapping, `rounded-lg`, white paper cards at 92 % brightness with the report screenshot;
  - on view they spread from stacked to fanned (`TRANSITION_MQS`);
  - on hover the front page lifts 4 px.
- Until the real report renders exist, use `components/mqs-sample-report.tsx` if it fits; otherwise ship without the visual and keep the split with the copy only.
- Right: copy + three benefit bullets with accent check circles (the existing deliverables style).

### 5.11 Time back + coach in control `#coach` [copy 3.10]

- Reuse the existing `#results` band treatment: `AmbientVideo` `dario-accel-usc-web.mp4` behind dark scrims.
- **Shrinking-bar visual:** a long bar labelled "Analysis by hand · up to an hour" and a short accent bar labelled "With MQS · minutes of review". The long bar animates to its length first, then the short one. No exact minute number.
- **"MQS does / You do":** two columns divided by a vertical hairline.
  - Left items get accent check circles.
  - Right items get white check circles, and the right column header is in the accent ("YOU").
  - On mobile, pairs stack row by row so each "MQS does" sits above its matching "You do".
- Footnote in `text-xs text-white/50`: "MQS gives you movement information, not a medical diagnosis."

### 5.12 Setups `#setups` [copy 3.11]

- Three cards in a row. **The middle card** ("Force plate + iPhone(s)") is emphasised:
  - 1 px accent top border;
  - a slightly lighter surface (`bg-[#0E1012]`);
  - a mono badge "THE COMPLETE SETUP".
- The left card carries the badge "WHERE EVERYONE STARTS".
- Each card shows equipment, then what you get, then the bold outcome line at the bottom.
- The line under the cards is centered and muted.

### 5.13 FAQ `#faq` [copy 3.12]

- Use the existing `components/ui/accordion.tsx`, in a narrow centered column (`max-w-3xl`).
- Question text `font-sans font-medium text-lg`; answers `text-muted-foreground`.
- Only one item is open at a time. The first item ("What is the Movement Quality Score?") starts open.

### 5.14 Waitlist `#waitlist` [copy 3.13]

- Keep the existing section and `AudienceContactForm` untouched.
- Change only the eyebrow, headline and intro text.
- Remove every "still in development" string from the coach copy.

---

## 6. The product tour `#tour`: the new showpiece

A click-through of the real software. The screenshot and its explanation change together with a smooth animation. The section sells the product to the eye before the page explains it to the mind.

### 6.1 Content

- **Eyebrow:** SEE MQS IN ACTION
- **Headline:** **FROM RAW DATA TO A CLEAR PLAN.**
- **Subline:** "Click through the software. This is what working with MQS looks like."

| # | Step title | Text (1–2 sentences) | Visual |
|---|---|---|---|
| 01 | **Connect your force plates** | Connect Hawkin Dynamics, VALD or CC Athletics once. Your whole test history comes in, matched to the right athletes. | App window: sync / connections screen |
| 02 | **Record with your iPhone** | The MQS Capture app records the test. Clips go straight to your account, paired with the right jump. | Phone frame: Capture app record screen |
| 03 | **Video, skeleton and force on one timeline** | Scrub through the movement frame by frame, with the skeleton and the force curve moving together. | App window: trial window with the synced scrubber |
| 04 | **The Movement Quality Score** | One score, seven domains, built from one unified assessment. | App window: athlete page with MQS + domains |
| 05 | **Compared with the world** | Every score and every single metric, compared with athletes worldwide in NormVault. | App window: NormVault comparison / norm band |
| 06 | **The report: what to train next** | The needs, ranked and explained. Export it as a PDF and share it with your athlete. | App window: report + Export PDF |

Each step in `lib/coach-tour.ts` has:
- `id`;
- `title`, `text` (per locale);
- `frame: 'window' | 'phone'`;
- `image: { src, width, height }`;
- `alt` (per locale; describe what's on screen);
- optional `hotspot: { x, y, w, h }` (percentages of the image);
- `ready: boolean`.

**Steps with `ready: false` aren't rendered.** The tour renders when at least 3 steps are ready, and the whole section is hidden otherwise. That way we never ship a placeholder.

### 6.2 Layout

**Desktop (`lg+`): two columns, 5/12 and 7/12, vertically centered.**

- **Left, the step list:** a vertical `tablist`. Each step is a row:
  - mono number (`01`) in `text-white/40`;
  - the title in `font-sans font-semibold text-lg`;
  - a 2 px vertical progress line along the row's left edge.
- **Inactive rows:** title at `text-white/55`, text hidden, and on hover the title goes to `text-white/80`.
- **The active row:**
  - title in `text-white`;
  - the text expands below it (height + opacity, `TRANSITION_MQS`);
  - the number turns accent;
  - the progress line fills with accent over the autoplay interval.
- **Right, the visual:** the `app-window` (or the `phone-frame`, centered inside the same 16:10 stage) with the screenshot.

**Mobile (`< lg`): visual on top, caption card below.**

- The visual sits in a stage that keeps a fixed 16:10 ratio, so the page never jumps.
- The caption card shows:
  - the step number;
  - the title;
  - the text;
  - prev/next buttons (`ChevronLeft` / `ChevronRight`, 40 px hit areas);
  - a row of 6 progress dots, with the active one as a 20 px pill in accent.
- **Swipe:** `drag="x"` on the visual with `dragConstraints={{ left: 0, right: 0 }}`, `dragElastic={0.12}`. Change step when the offset is over 60 px or the velocity over 400.

### 6.3 Animation

- **Image change:** `AnimatePresence mode="popLayout"`, direction-aware.
  - Moving forward: the new image enters from `x: 24, opacity: 0, scale: 0.985` and the old one exits to `x: -24, opacity: 0`.
  - Moving back: mirror both.
  - Use `TRANSITION_MQS` (0.45 s, MQS easing).
- **Text change:** opacity + `y: 8`, 0.3 s, starting 0.05 s after the image.
- **Window ↔ phone change** (steps 1→2→3): the frame cross-fades. The phone scales in from `0.96`. The stage keeps its size, so the layout doesn't shift.
- **Hotspot** (if set): a rounded rectangle with a 1.5 px accent ring and a soft outer glow. It fades in 0.35 s after the image settles, then pulses gently (opacity 0.55 ↔ 1, 2.4 s ease-in-out, infinite) while that step is active. This is the one allowed loop on the page. It stops with reduced motion or the pause toggle.
- **Autoplay:**
  - 7 s per step, starting only when the section is ≥ 50 % in view (`useInView`, `amount: 0.5`);
  - it pauses on hover over the section, on focus within it, and when the browser tab is hidden (`visibilitychange`);
  - it **stops for good** after the first manual interaction (click, key, swipe);
  - after step 6 it loops back to 1, at most two full cycles, then stops on step 1;
  - with reduced motion or the motion pause, there's no autoplay at all, and step changes swap instantly.
- **Visible pause control:** a small `Pause` / `Play` icon button (lucide) in the top-right corner of the stage while autoplay runs (WCAG 2.2.2).

### 6.4 Accessibility

- Follow the WAI-ARIA tabs pattern:
  - `role="tablist"` with `aria-orientation="vertical"` on desktop and horizontal on mobile;
  - each step is a `role="tab"` with `aria-selected` and `aria-controls`;
  - the visual and caption sit in a `role="tabpanel"`;
  - roving `tabIndex`.
- **Keys:**
  - Up/Down on desktop, Left/Right on mobile and desktop, move between steps;
  - Home/End jump to the first and last step;
  - Enter/Space activate a step.
- An `aria-live="polite"` region announces "Step 3 of 6: Video, skeleton and force on one timeline" **only on manual change**, never during autoplay.
- Every image has its locale's `alt` text. The decorative frame chrome is `aria-hidden`.

### 6.5 Performance

- `next/image` with explicit `width`/`height` and `sizes="(min-width: 1024px) 58vw, 100vw"`.
- Images are WebP, 2400 px wide for window shots (phone shots 1170×2532), **≤ 250 KB each**.
- Preload the **next** step's image after the current one has loaded (`new window.Image().src = …`).
- Only the active image and the one leaving are in the DOM.
- No layout shift: the stage has a fixed aspect ratio.

---

## 7. Media

**Folder:** `public/media/coach/`

**Naming:** `tour-01-sync.webp`, `tour-02-capture.webp`, `tour-03-trial-scrubber.webp`, `tour-04-score.webp`, `tour-05-normvault.webp`, `tour-06-report.webp`, `report-page-1.webp` … `report-page-3.webp`, `capture-app-loop-web.mp4` (+ `-poster.webp`).

**Where screenshots come from:**
- Dario captures them from the real MQS desktop app with a **demo athlete** ("Alex Demo"). Never use real athlete names, faces or data.
- Capture the window at **2×**, then crop away the macOS window chrome, since `app-window` draws its own.
- Use dark mode only (the app is dark-only).

**Videos:** run them through `scripts/optimize-media.mjs`, then check with `npm run media:check`. Format is MP4 H.264, muted, `playsinline`, ≤ 4 MB, with a poster image. Use `AmbientVideo` for loops; it already handles the motion pause.

**Existing assets to reuse until new ones arrive:**

| Section | Asset |
|---|---|
| Needs analysis (optional side image) | `/audiences/coach-training-decisions.jpg` |
| NormVault background | `/audiences/normvault-network-v2.webp` |
| iPhone phone-frame clip | `/media/audience-motion/konate-depth-jump-web.mp4` |
| Lab validation photo | `/audiences/athlete-training-lab-jump.webp` |
| Time back background | `/media/audience-motion/dario-accel-usc-web.mp4` |

**Never ship a fake screenshot or a placeholder number.** If a visual isn't ready, the layout must still look intentional without it (see §6.1 `ready`, §5.6, §5.8 and §5.10).

---

## 8. Tests and checks

1. **Intended test changes.** `lib/audience-content.test.ts` asserts the old coach copy (e.g. "still in development", and VANE as the interpreter). This is a deliberate product change by Dario, so update or move those assertions to cover the new `lib/coach-content.ts` instead of deleting them silently.
2. **New tests** (vitest, next to the files):
   - `coach-content` has every key in both locales, and no "still in development", "coming soon" or "will" phrases in either locale;
   - `coach-tour` hides steps with `ready: false` and hides the section with fewer than 3 ready steps;
   - tour keyboard navigation moves the selection and only announces manual changes;
   - the domain explainer order matches `DOMAIN_REGISTRY` order from the web contract.
3. **Run:** `npm run check`, `npm test`, `npm run build`, `npm run smoke`, `npm run media:check`.
4. **In the browser on localhost:**
   - widths 375 / 768 / 1280 / 1600 with no horizontal scroll;
   - both locales;
   - reduced motion on (OS setting) and the site's motion pause toggle on;
   - keyboard-only pass through the tour;
   - a Lighthouse pass (performance ≥ 90 on desktop, CLS < 0.05).
5. **Bugs from the copy file** (its §6): check whether the language picker still pops up mid-scroll and whether text shows through the sticky header. Fix them if they still happen. They may already be fixed.

---

## 9. Done when

- [ ] `/for/coach` renders all 14 sections in the order of §3.2, in EN and DE, with the copy from `COACH-LANDING-COPY.md`
- [ ] The product tour works with mouse, touch swipe and keyboard; autoplays only in view; stops after interaction; respects both motion switches
- [ ] No "still in development", "coming soon" or future tense on the page
- [ ] No invented UI, placeholder numbers or fake screenshots; illustrations are labelled "Example athlete"
- [ ] Athlete and partner pages unchanged (compare screenshots before and after)
- [ ] All checks in §8 pass
- [ ] The five pre-existing uncommitted files are untouched
- [ ] Commit on a branch with a short summary for Dario: what changed, which screenshots are still missing (the `ready: false` steps), and a few localhost screenshots of the page
