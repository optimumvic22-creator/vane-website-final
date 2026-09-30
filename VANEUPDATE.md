# VANE Science — Final Website Audit
# Handoff-Dokument für die Implementierung
# Stand: April 2026
#
# Dieses Dokument enthält ALLE Text- und Designänderungen
# für die live EN-Website. Jede Änderung ist final.
# Format: CURRENT (aktueller Text) → NEW (neuer Text)
# Priority: ★★★ heute, ★★ diese Woche, ★ wenn bereit

---

## BRAND ESSENCE

Kernaussage, die VANE in einem Satz erklärt — für Website,
Pitch, Social, Investor-Gespräche, alles:

**"We gave human movement a language."**

Verwendung:
- Website: Hero-Section, About, Footer
- Pitch Deck: Slide 1
- Social Bios: "We gave human movement a language. Vienna."
- Antwort auf "Was macht ihr?": Dieser Satz.

---

## GLOBAL ★★★

| Find | Replace with | Est. occurrences |
|---|---|---|
| VIDE | VANE | 15-20 |
| vide.science | vane.science | 3-5 |
| hello@vide.science | hello@vane.science | 2 |

---

## NAVIGATION

CURRENT: VIDE
NEW: **VANE**

CURRENT: "Join waitlist →"
NEW: **"Discover my score →"**

Rest of nav links (How it works / Who it's for / The science) — no change.

---

## SECTION 1: HERO ★★★

### Overline
CURRENT: "MOVEMENT DIAGNOSTICS, REIMAGINED"
NEW: **"MOVEMENT QUALITY. MEASURED."**

### H1
CURRENT: "HOW WELL DO YOU MOVE — REALLY?"
NEW: **"Your movement. Finally, a number."**

### Subline
CURRENT: "Your fitness tracker counts steps. VIDE measures how well
you actually move. One score. Seven areas. Compared to people your age."

NEW: **"Trainers guess. Doctors observe. Trackers count steps.
But nobody measures how well you actually move.
VANE does — like an IQ test, but for your body."**

### Primary CTA
CURRENT: "Join the waitlist →"
NEW: **"Discover my score →"**

### Secondary CTA
CURRENT: "↓ How it works"
NEW: No change.

### Trust bar
CURRENT: "BUILT IN VIENNA · SCIENTIFICALLY VALIDATED · GDPR-COMPLIANT"
NEW: **"BUILT IN VIENNA · SCIENTIFICALLY VALIDATED · SAME TECHNOLOGY USED IN ELITE SPORT"**

### Design change ★★★
CURRENT: Right side of hero is empty.
NEW: **Move MQS score dashboard (currently in Section 5) into the hero.**
Show: Score ring (55), progress badge (↑ +6 since October),
7 domain bars with color codes. Animate score counter on scroll.
Reference: vane-hero-block-option-c.html (delivered separately).

---

## SECTION 2: THE PROBLEM ★★

### Overline
CURRENT: "THE PROBLEM"
NEW: No change.

### H2
CURRENT: "Movement is judged. Not measured."
NEW: **"The world moves blind."**

### Body paragraph 1
CURRENT: "Trainers estimate. Doctors observe. Apps count steps.
But nobody measures how well you actually move. No norms, no
comparison, no trajectory."

NEW: **"A trainer says: 'Looks good.' A doctor says: 'Move more.'
A tracker says: '10,000 steps.' None of them tells you how well
you actually move."**

### Body paragraph 2
CURRENT: "In sport, that means injuries that didn't have to happen.
As you age, it means you notice too late that something has changed."

NEW: **"In sport, that costs careers. In aging, it costs independence.
Movement quality declines after 40 — quietly, a little more each year.
By the time you notice, you've lost years."**

Note: This paragraph should be visually separated from the body text —
as a pull-quote or accent block with left border. It's the emotional
peak of the page.

### ADD after body (new element) ★★
**"Imagine standing on one leg while counting backwards from 100.
How steady do you stay? That's what VANE measures — what happens
to your movement when your brain has to work at the same time."**

Style: Italic, slightly muted color. Indented or in a card.

### Accent statement
CURRENT: "Two trainers. Same movement. Different assessment."
NEW: No change. Perfect as is.

---

## SECTION 3: THE SOLUTION ★

### Overline
CURRENT: "THE SOLUTION" (or similar)
NEW: No change.

### H2
CURRENT: "Your entire movement. One number."
NEW: No change. Apple-grade.

### Subline
CURRENT: "Like an IQ test — but for your body. The MQS measures
seven areas of your movement and compares you to people your age
and sex. A score above 50 means you move better than average."

NEW: **"Like an IQ test — but for your body. The MQS captures seven
areas of your movement and compares you to people your age.
Above 50? Above average. Below 40? Worth a closer look."**

### Domain cards
Only change the DTC card:

CURRENT: "What happens to your movement when you have to think at
the same time? The earliest warning sign of change."

NEW: **"What happens when body and brain have to work at once?
The signal no wearable can detect."**

All other domain cards: no change.

### ADD after domain cards (new element) ★★

**"The MQS stays with you. For life.
At 25, it shows where you're vulnerable.
At 45, which training works best for you.
At 65, whether your movement supports independent living.
Same metric. Your context gives it meaning."**

Style: Accent block with left teal border.
Format: Each line on its own row, not as running text.

---

## SECTION 4: THE SCORE (MQS Visualization) ★

### Progress indicator
CURRENT: Circle with "55 MQS" — static.
NEW: **Add badge below score: "↑ +6 since October"**

No other changes to this section.

---

## SECTION 5: HOW IT WORKS ★★

### H2
CURRENT: "From measurement to results in under 30 minutes."
NEW: **"From measurement to results. Under 30 minutes."**
(Period after "results" creates a pause that emphasizes speed.)

### Step 01
CURRENT: "Standardised test battery, performable in any gym, clinic,
or sports club. No special hardware needed."

NEW: **"30 minutes. Standardised test battery. Performable in any gym,
clinic, or sports club. No equipment you don't already have."**

### Step 02 ★★★ (MDR CRITICAL)
CURRENT: "Our software analyses your results automatically — using
the same scientific methodology found in clinical diagnostics."

NEW: **"Our software analyses your results in seconds — using the same
test theory behind the world's best psychological assessments.
No room for interpretation."**

Reason: "Clinical diagnostics" risks EU Medical Device Regulation
classification. "Psychological assessments" is accurate and safe.

### Step 03
CURRENT: "Your report shows exactly where you stand — in absolute
terms and by comparison. With specific recommendations for the area
where you can improve the most."

NEW: **"Your report shows exactly where you stand — in absolute terms
and by comparison. With specific recommendations for where training
makes the biggest difference."**

### ADD: Step 04 (new element) ★★
**"04 — Improve"**
**"12 weeks later: same test. New score. Proof that something has changed."**

Update CSS grid from 3 columns to 4 columns for the steps.

---

## SECTION 6: WHO IT'S FOR ★★

### H2
CURRENT: "Whether you train, treat, or want to understand yourself."

NEW: **"Tested in the lab. Used in elite sport. Built for every body."**

### Tab labels
CURRENT: "For professionals" / "For you"
NEW: **"For you" / "For your club" / "For your practice"**
(3 tabs instead of 2)

### Tab "For you" — body text
CURRENT: (not fully visible in screenshots)

NEW: **"You track sleep, heart rate, steps, and calories. But the metric
that determines injury or independence as you age is missing from your
dashboard. The MQS is the missing number."**

Features:
- Personal MQS report with age-appropriate interpretation
- Your strengths and weaknesses: where does training matter most?
- Long-term tracking: see how you develop over months and years
- Brain + body: the metric no wearable has

### Tab "For your club" — body text
NEW: **"You measure endurance, strength, and speed. But not how well
your athletes actually move — or when they become injury-prone."**

Features:
- Team dashboard with individual MQS per athlete
- Dual-task monitoring as an early warning system for injuries
- Comparison against sport-specific reference groups
- Return from injury: data-driven decisions on when an athlete is ready

CTA: "Request a performance partnership →"

### Tab "For your practice" — body text
NEW: **"Your biggest problem isn't the treatment. It's the proof.
VANE gives your assessments a common language — normed scores that
make progress measurable, convince clients, and differentiate you."**

Features:
- Standardised test battery, performable by trained staff
- Automated reports with reference values for every age group
- Progress monitoring for long-term client retention
- White-label ready: your branding, our methodology

CTA: "Request a partnership →"

---

## SECTION 7: THE SCIENCE ★★

### H2
CURRENT: "No guessing. No opinions. Just data."
NEW: No change.

### Body text ★★★ (MDR + HALO + MISSION)
CURRENT: "VIDE uses the same kind of test theory behind the world's
best psychological and medical tests. No algorithm marketing — just
clinically validated diagnostics, computed in seconds."

NEW: **"VANE uses the same test methodology behind the world's best
psychological and medical assessments — applied to movement.
Our lab in Vienna works with sub-millimetre-precision motion capture
and force plates at elite sport level. The same data quality feeds
our research in robotics and exoskeletons — because when machines
understand how humans move, they can work beside us, not against us.
That's not a future vision. That's what we're building."**

### Stats grid
CURRENT: (if present — partially visible in screenshots)

NEW:
| 7 | Areas |
| ✓ | Compared to your age group |
| <30 | Minutes per assessment |
| 0 | Special equipment for you |

---

## SECTION 8: EARLY PARTNERS ★

### H2
CURRENT: "Already in use."
NEW: No change.

### Testimonial attribution
CURRENT: "Pilot Partner — Intelligent Strength, Vienna"
NEW: **"[Real name], Head Coach — Intelligent Strength, Vienna"**
(Get a real name. Named testimonials convert 3-4× better.)

### ADD: Credibility row (new element) ★★
Below the testimonial card, add a horizontal row of credentials:

**"From lab to life: Elite athletes · Ages 18 to 85 ·
OptiTrack motion capture · Robotics & exoskeleton research"**

Style: Same as trust bar — small caps, muted color, dot-separated.

---

## SECTION 9: FAQ ★

### FAQ questions — update naming
All instances of "VIDE" → "VANE"

### ADD: New FAQ question ★
**"Is VANE a medical device?"**
Answer: **"No. VANE is a movement quality information tool, not a
medical device. It provides data and insights that you and your
health professional can use to inform training and wellness decisions.
It does not diagnose, treat, or prevent medical conditions."**

### Existing FAQ — minor fix
CURRENT: "What exactly is the MQS?"
Answer should include: **"Like an IQ test — but for your body."**
(If not already present.)

---

## SECTION 10: CTA / WAITLIST ★★★

### Overline
CURRENT: (varies)
NEW: **"JOIN US"**

### H2 (Tagline)
CURRENT: "See. Understand. Move better."
NEW: **"Know where you stand. Know where you're going."**

### Subline
CURRENT: "VIDE launches soon. Secure your spot — be among the first
to know your movement score."

NEW: **"VANE launches soon. The first spots go to those who show up first."**

### Segment selector (behavioral change)
CURRENT: Segments appear BEFORE email input.
NEW: **Email input FIRST, then segments below.**
Reduces cognitive friction at the moment of conversion.

### CTA Button
CURRENT: "Secure access →"
NEW: **"Discover my score →"**

### Trust line
CURRENT: "No spam. GDPR-compliant. Unsubscribe anytime."
NEW: **"No spam. Your data stays in the EU. Unsubscribe anytime."**

---

## SECTION 11: FOOTER ★

### Brand line
CURRENT: "Movement diagnostics from Vienna."
NEW: **"We gave human movement a language.
For people. For research. For a safer world."**

### Email
CURRENT: hello@vide.science
NEW: **hello@vane.science**

### Links
CURRENT: "About VIDE"
NEW: **"About VANE"**

CURRENT: "Careers"
NEW: **Remove entirely** (or replace with "Join us" linking to team@vane.science)

### Copyright
CURRENT: "© 2026 VIDE Sports Science GmbH"
NEW: **"© 2026 VANE Science GmbH. All rights reserved."**

---

## NEW SECTION: WHY WE EXIST ★★
(Add between Science and Early Partners)

Overline: **"OUR MISSION"**

H2: **"We gave human movement a language."**

Body: **"VANE was built on a simple belief: if we understand how humans
move, we can help them move better. Whether that means preventing
an athlete's injury, preserving independence as you age, or teaching
machines to work safely beside us — it starts with the same data.
The Movement Quality Score."**

Style: Full-width, light background (or subtle teal tint),
centered text, generous whitespace above and below.

---

## META / SEO ★★

### Title tag
CURRENT: (varies)
NEW: **"VANE Science — Movement Quality Score | How Well Do You Move?"**

### Meta description
CURRENT: (varies)
NEW: **"VANE measures movement quality across 7 areas — like an IQ test
for your body. Compared to your age group. Built in Vienna.
Join the waitlist."**

### OG Title
NEW: **"VANE Science — Your movement. Finally, a number."**

### OG Description
NEW: **"The Movement Quality Score captures how well you move across
7 areas. Compared to your age group. Built in Vienna."**

---

## LANGUAGE SAFETY CHECKLIST

Before publishing any text change, verify:

☐ The word "diagnostics" does NOT appear (MDR risk)
☐ The word "diagnose" does NOT appear
☐ No claim says VANE "detects" or "predicts" disease/injury
☐ "Clinically validated" is NOT used (use "scientifically validated")
☐ "Patient" is NOT used (use "client" or "user")
☐ All instances of VIDE are replaced with VANE
☐ All instances of vide.science are replaced with vane.science

---

## IMPLEMENTATION CHECKLIST

### Do today (★★★) — estimated 1 hour
☐ Global VIDE → VANE replace
☐ Hero: Overline, H1, Subline, Trust bar, CTA button
☐ Step 02: Remove "clinically validated diagnostics"
☐ CTA Section: Tagline, subline, button text
☐ Science body: Full rewrite with lab + robotics + mission
☐ Meta tags: Title, description, OG

### Do this week (★★) — estimated 3 hours
☐ Problem Section: H2, body paragraphs, add DTC scenario
☐ For Whom: New H2, expand to 3 tabs
☐ Add: Mission section ("Why we exist")
☐ Add: Credibility row below testimonial
☐ Add: Step 04 "Improve" (+ CSS grid update to 4 columns)
☐ Add: Lifespan passage after domain cards
☐ Add: MDR FAQ question
☐ Footer: Brand line, remove Careers, update copyright
☐ Swap email/segment order in waitlist form

### Do when ready (★) — estimated 2-4 hours
☐ Move MQS dashboard into hero (design change)
☐ Add progress badge to score visualization
☐ Get named testimonial from Intelligent Strength
☐ Solution subline: Minor update
☐ DTC domain card: Copy update
☐ Process H2: Minor punctuation fix

---

## SUMMARY: The 10 lines that define the website

1. **Brand:** "We gave human movement a language."
2. **H1:** "Your movement. Finally, a number."
3. **Subline:** "Trainers guess. Doctors observe. Trackers count steps."
4. **Problem:** "The world moves blind."
5. **Loss Frame:** "In sport, that costs careers. In aging, it costs independence."
6. **Solution:** "Your entire movement. One number."
7. **Halo:** "Tested in the lab. Used in elite sport. Built for every body."
8. **Science:** "When machines understand how humans move, they can work beside us."
9. **Tagline:** "Know where you stand. Know where you're going."
10. **Mission:** "For people. For research. For a safer world."
