# Coach landing page — local review

Reviewed 13 October 2026. Dario's subsequent direction replaces the fourteen-section structure in `COACH-LANDING-IMPLEMENTATION.md`: retain the old page's frame, preserve the software's benefits and capabilities, and add at most three sections. The sample AI report is explicitly a placeholder until Dario supplies it.

## Page sequence

The original six-section shared audience layout remains. Three additions bring the page to nine sections:

1. Hero: understand the benefit and see the existing interactive MQS dashboard.
2. Compact MQS introduction directly after the hero (new).
3. Existing benefits section: iPhone/remote, force plates, and lab setups. Expandable details retain the deeper capabilities.
4. Existing workflow: assess, understand, coach.
5. Seven-step software tour (new).
6. Compact NormVault comparison section (new).
7. Existing results section: AI interpretation, practical deliverables, and a clearly labelled report placeholder.
8. Existing science section: validation and confidence, with detailed questions in a disclosure.
9. Existing waitlist.

Visible copy is in `lib/coach-compact.ts`; supporting detail is in `lib/coach-content.ts`. Both English and German are implemented. The source copy document remains available for reference.

## Images and report

All seven supplied software screenshots are included, oldest first by capture filename and filesystem creation metadata. Each has a description and alternative text based on its contents. The asset manifest records provenance; each optimised WebP is below 250 KB. Dario confirmed that names and measurements are fictional demo content approved for this website.

The tour displays one subtle preliminary-prototype disclaimer. No software screenshots are missing. The sample AI report is still to be supplied; its labelled placeholder contains no invented report results.

## Verification

- `npm run check`, `npm test`: passed; 481 tests across 35 files.
- `npm run build`: passed.
- Production smoke check: 11 routes, 9 H1/header/sitemap checks, unknown-audience 404, 6 non-writing API checks, and unauthenticated delivery denied.
- Media check: all 21 files passed. Seven existing MP4 containers were repaired without re-encoding video; video packet hashes matched before and after. The already-muted decorative partner video had its unused audio track removed.
- Chrome checks at 375, 768, 1280 and 1600 px in English and German. No horizontal overflow. The German hero received a discretionary line break and was rechecked at 1600 px after the initial clipping finding.
- Tour keyboard navigation, wrapping, manual announcements, autoplay stopping after interaction, and a mobile-size drag were verified. The tour reducer covers the two-cycle autoplay limit.
- Page motion pause and reduced-motion handling were checked during implementation. Expandable report details were opened and closed in the final production build.
- Desktop Lighthouse 12.8.2 on the final local production build: performance 98, CLS 0.0000036, FCP 0.3 s, LCP 1.1 s. These are local measurements, not production guarantees.
- Athlete and partner pages were compared visually; their default layout and copy remain unchanged.
- The five pre-existing dirty files identified by the implementation brief were preserved byte-for-byte and excluded from the coach commit.

QA screenshots and machine-readable results are in `/private/tmp/vane-coach-qa/`. Local preview: `http://127.0.0.1:3000/for/coach?lang=en`. Nothing was pushed or deployed.
