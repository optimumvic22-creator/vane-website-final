import { defineType, defineField } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: '1 · Hero' },
    { name: 'problem', title: '2 · Problem' },
    { name: 'solution', title: '3 · Solution' },
    { name: 'mqs', title: '4 · MQS Score' },
    { name: 'technology', title: '5 · How It Works' },
    { name: 'useCases', title: '6 · Use Cases' },
    { name: 'mission', title: '7 · Mission & Science' },
    { name: 'socialProof', title: '8 · Founders' },
    { name: 'faq', title: '9 · FAQ' },
    { name: 'cta', title: '10 · CTA / Waitlist' },
  ],
  fields: [
    /* ═══════════════════════════════════════════════════════════════
       1 · HERO
       ═══════════════════════════════════════════════════════════════ */
    defineField({ name: 'heroOverline', title: 'Overline (EN)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroOverlineDe', title: 'Overline (DE)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroHeadlinePart1', title: 'Headline Line 1 (EN)', type: 'string', group: 'hero', description: 'e.g. "We gave Human Movement"' }),
    defineField({ name: 'heroHeadlinePart2', title: 'Headline Line 2 (EN)', type: 'string', group: 'hero', description: 'Gradient text, e.g. "a language."' }),
    defineField({ name: 'heroHeadlineDe', title: 'Headline (DE)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroSub', title: 'Subheadline (EN)', type: 'text', rows: 4, group: 'hero' }),
    defineField({ name: 'heroSubDe', title: 'Subheadline (DE)', type: 'text', rows: 4, group: 'hero' }),
    defineField({ name: 'heroCta1', title: 'Primary CTA (EN)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroCta1De', title: 'Primary CTA (DE)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroCta2', title: 'Secondary CTA (EN)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroCta2De', title: 'Secondary CTA (DE)', type: 'string', group: 'hero' }),
    defineField({ name: 'heroTrustItems', title: 'Trust Bar Items (EN)', type: 'array', of: [{ type: 'string' }], group: 'hero' }),
    defineField({ name: 'heroTrustItemsDe', title: 'Trust Bar Items (DE)', type: 'array', of: [{ type: 'string' }], group: 'hero' }),
    defineField({ name: 'heroVideo', title: 'Hintergrundvideo', type: 'file', options: { accept: 'video/*' }, group: 'hero', description: 'Hero-Hintergrundvideo im Querformat 16:9. Empfohlen sind etwa 10 bis 20 Sekunden ohne Ton. Es wird stummgeschaltet in Endlosschleife abgespielt. Optional: Ohne Video zeigt die Seite den animierten Standardhintergrund.' }),
    defineField({ name: 'heroVideoPoster', title: 'Standbild (Video-Poster)', type: 'image', options: { hotspot: true }, group: 'hero', description: 'Standbild, das vor dem Laden des Videos und als Fallback ohne Video gezeigt wird. Querformat 16:9, min. 1920×1080 px, JPG oder WebP.' }),

    /* ═══════════════════════════════════════════════════════════════
       2 · PROBLEM
       ═══════════════════════════════════════════════════════════════ */
    defineField({ name: 'problemOverline', title: 'Overline (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemOverlineDe', title: 'Overline (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemHeadlineLead', title: 'Headline Lead (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemHeadlineLeadDe', title: 'Headline Lead (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemHeadlineEm', title: 'Headline Emphasis (EN)', type: 'string', group: 'problem', description: 'Rendered in italic' }),
    defineField({ name: 'problemHeadlineEmDe', title: 'Headline Emphasis (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemHeadSub', title: 'Subtitle (EN)', type: 'text', rows: 2, group: 'problem', description: 'Use **bold** for emphasis' }),
    defineField({ name: 'problemHeadSubDe', title: 'Subtitle (DE)', type: 'text', rows: 2, group: 'problem' }),
    // Left column
    defineField({ name: 'problemLeftTitle', title: 'Left Col Title (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemLeftTitleDe', title: 'Left Col Title (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemLeftTag', title: 'Left Col Tag (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemLeftTagDe', title: 'Left Col Tag (DE)', type: 'string', group: 'problem' }),
    // Right column
    defineField({ name: 'problemRightTag', title: 'Right Col Tag (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemRightTagDe', title: 'Right Col Tag (DE)', type: 'string', group: 'problem' }),
    // Voices
    defineField({
      name: 'problemVoices',
      title: 'Voices',
      type: 'array',
      group: 'problem',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'idx', title: 'Index (e.g. 01)', type: 'string' }),
          defineField({ name: 'role', title: 'Role (EN)', type: 'string' }),
          defineField({ name: 'roleDe', title: 'Role (DE)', type: 'string' }),
          defineField({ name: 'quote', title: 'Quote (EN)', type: 'string' }),
          defineField({ name: 'quoteDe', title: 'Quote (DE)', type: 'string' }),
          defineField({ name: 'gaps', title: 'Gap Chips (EN)', type: 'array', of: [{ type: 'string' }] }),
          defineField({ name: 'gapsDe', title: 'Gap Chips (DE)', type: 'array', of: [{ type: 'string' }] }),
        ],
        preview: { select: { title: 'role', subtitle: 'quote' } },
      }],
    }),
    // Caption
    defineField({ name: 'problemCaptionTag', title: 'Caption Tag (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCaptionTagDe', title: 'Caption Tag (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCaptionText', title: 'Caption Text (EN)', type: 'text', rows: 3, group: 'problem', description: 'Use **bold** for emphasis. New lines = line breaks.' }),
    defineField({ name: 'problemCaptionTextDe', title: 'Caption Text (DE)', type: 'text', rows: 3, group: 'problem' }),
    // Cost
    defineField({ name: 'problemCostPrelude', title: 'Cost Label (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCostPreludeDe', title: 'Cost Label (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCostAside', title: 'Cost Aside (EN)', type: 'text', rows: 2, group: 'problem', description: 'Use **bold** for emphasis' }),
    defineField({ name: 'problemCostAsideDe', title: 'Cost Aside (DE)', type: 'text', rows: 2, group: 'problem' }),
    defineField({ name: 'problemCostFix', title: 'Cost Fix Line (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCostFixDe', title: 'Cost Fix Line (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCostSportTag', title: 'Sport Tag (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCostSportTagDe', title: 'Sport Tag (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCostSportLine', title: 'Sport Line (EN)', type: 'string', group: 'problem', description: 'Use **bold** for emphasis' }),
    defineField({ name: 'problemCostSportLineDe', title: 'Sport Line (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCostAgingTag', title: 'Aging Tag (EN)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCostAgingTagDe', title: 'Aging Tag (DE)', type: 'string', group: 'problem' }),
    defineField({ name: 'problemCostAgingLine', title: 'Aging Line (EN)', type: 'string', group: 'problem', description: 'Use **bold** for emphasis' }),
    defineField({ name: 'problemCostAgingLineDe', title: 'Aging Line (DE)', type: 'string', group: 'problem' }),
    // MQS Preview in problem section
    defineField({ name: 'problemMqsOverallScore', title: 'MQS Overall Score', type: 'number', group: 'problem', validation: r => r.min(0).max(100) }),
    defineField({
      name: 'problemMqsDomains',
      title: 'MQS Domain Scores',
      type: 'array',
      group: 'problem',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'code', title: 'Domain Code', type: 'string' }),
          defineField({ name: 'label', title: 'Label (EN)', type: 'string' }),
          defineField({ name: 'labelDe', title: 'Label (DE)', type: 'string' }),
          defineField({ name: 'score', title: 'Score', type: 'number', validation: r => r.min(0).max(100) }),
        ],
        preview: { select: { title: 'label', subtitle: 'code' } },
      }],
    }),

    /* ═══════════════════════════════════════════════════════════════
       3 · SOLUTION
       ═══════════════════════════════════════════════════════════════ */
    defineField({ name: 'solutionHeadline', title: 'Headline (EN)', type: 'string', group: 'solution' }),
    defineField({ name: 'solutionHeadlineDe', title: 'Headline (DE)', type: 'string', group: 'solution' }),
    defineField({ name: 'solutionDescription', title: 'Description (EN)', type: 'text', rows: 4, group: 'solution' }),
    defineField({ name: 'solutionDescriptionDe', title: 'Description (DE)', type: 'text', rows: 4, group: 'solution' }),
    defineField({ name: 'solutionSliderStatement', title: 'Slider Statement (EN)', type: 'string', group: 'solution' }),
    defineField({ name: 'solutionSliderStatementDe', title: 'Slider Statement (DE)', type: 'string', group: 'solution' }),
    defineField({ name: 'solutionLifespanItems', title: 'Lifespan Items (EN)', type: 'array', of: [{ type: 'string' }], group: 'solution' }),
    defineField({ name: 'solutionLifespanItemsDe', title: 'Lifespan Items (DE)', type: 'array', of: [{ type: 'string' }], group: 'solution' }),
    defineField({
      name: 'solutionPersonA',
      title: 'Person A (Sedentary)',
      type: 'object',
      group: 'solution',
      fields: [
        defineField({ name: 'label', title: 'Label (EN)', type: 'string' }),
        defineField({ name: 'labelDe', title: 'Label (DE)', type: 'string' }),
        defineField({ name: 'sublabel', title: 'Sublabel (EN)', type: 'string' }),
        defineField({ name: 'sublabelDe', title: 'Sublabel (DE)', type: 'string' }),
        defineField({ name: 'bullets', title: 'Attributes (EN)', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'bulletsDe', title: 'Attributes (DE)', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
    defineField({
      name: 'solutionPersonB',
      title: 'Person B (Athlete)',
      type: 'object',
      group: 'solution',
      fields: [
        defineField({ name: 'label', title: 'Label (EN)', type: 'string' }),
        defineField({ name: 'labelDe', title: 'Label (DE)', type: 'string' }),
        defineField({ name: 'sublabel', title: 'Sublabel (EN)', type: 'string' }),
        defineField({ name: 'sublabelDe', title: 'Sublabel (DE)', type: 'string' }),
        defineField({ name: 'bullets', title: 'Attributes (EN)', type: 'array', of: [{ type: 'string' }] }),
        defineField({ name: 'bulletsDe', title: 'Attributes (DE)', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),

    /* ═══════════════════════════════════════════════════════════════
       4 · MQS SCORE
       ═══════════════════════════════════════════════════════════════ */
    defineField({ name: 'mqsOverline', title: 'Overline (EN)', type: 'string', group: 'mqs' }),
    defineField({ name: 'mqsOverlineDe', title: 'Overline (DE)', type: 'string', group: 'mqs' }),
    defineField({ name: 'mqsHeadline', title: 'Headline (EN)', type: 'string', group: 'mqs' }),
    defineField({ name: 'mqsHeadlineDe', title: 'Headline (DE)', type: 'string', group: 'mqs' }),
    defineField({ name: 'mqsDescription', title: 'Description (EN)', type: 'text', rows: 3, group: 'mqs' }),
    defineField({ name: 'mqsDescriptionDe', title: 'Description (DE)', type: 'text', rows: 3, group: 'mqs' }),
    defineField({
      name: 'mqsDomains',
      title: 'MQS Domains',
      type: 'array',
      group: 'mqs',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'code', title: 'Code (e.g. GAIT)', type: 'string' }),
          defineField({ name: 'label', title: 'Label (EN)', type: 'string' }),
          defineField({ name: 'labelDe', title: 'Label (DE)', type: 'string' }),
          defineField({ name: 'baselineScore', title: 'Baseline Score', type: 'number' }),
          defineField({ name: 'video', title: 'Domänenvideo', type: 'file', options: { accept: 'video/*' }, description: 'Kurzes Video zur Domäne. Empfohlen sind etwa 3 bis 6 Sekunden ohne Ton. Es wird in Schleife abgespielt. Optional.' }),
        ],
        preview: { select: { title: 'label', subtitle: 'code' } },
      }],
    }),

    /* ═══════════════════════════════════════════════════════════════
       5 · HOW IT WORKS (Technology)
       ═══════════════════════════════════════════════════════════════ */
    defineField({ name: 'techOverline', title: 'Overline (EN)', type: 'string', group: 'technology' }),
    defineField({ name: 'techOverlineDe', title: 'Overline (DE)', type: 'string', group: 'technology' }),
    defineField({ name: 'techHeadline', title: 'Headline (EN)', type: 'string', group: 'technology' }),
    defineField({ name: 'techHeadlineDe', title: 'Headline (DE)', type: 'string', group: 'technology' }),
    defineField({
      name: 'techSteps',
      title: 'Steps',
      type: 'array',
      group: 'technology',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'num', title: 'Step Number', type: 'string' }),
          defineField({ name: 'title', title: 'Title (EN)', type: 'string' }),
          defineField({ name: 'titleDe', title: 'Title (DE)', type: 'string' }),
          defineField({ name: 'desc', title: 'Description (EN)', type: 'text', rows: 3 }),
          defineField({ name: 'descDe', title: 'Description (DE)', type: 'text', rows: 3 }),
        ],
        preview: { select: { title: 'title', subtitle: 'num' } },
      }],
    }),

    /* ═══════════════════════════════════════════════════════════════
       6 · USE CASES
       ═══════════════════════════════════════════════════════════════ */
    defineField({ name: 'useCasesOverline', title: 'Overline (EN)', type: 'string', group: 'useCases' }),
    defineField({ name: 'useCasesOverlineDe', title: 'Overline (DE)', type: 'string', group: 'useCases' }),
    defineField({ name: 'useCasesHeadline', title: 'Headline (EN)', type: 'text', rows: 3, group: 'useCases', description: 'Use **bold** for emphasis. Lines = line breaks.' }),
    defineField({ name: 'useCasesHeadlineEm', title: 'Headline Italic Part (EN)', type: 'string', group: 'useCases', description: 'e.g. "every body."' }),
    defineField({ name: 'useCasesHeadlineDe', title: 'Headline (DE)', type: 'text', rows: 3, group: 'useCases' }),
    defineField({
      name: 'useCasesTabs',
      title: 'Audience Tabs',
      type: 'array',
      group: 'useCases',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'tabId', title: 'Tab ID', type: 'string' }),
          defineField({ name: 'label', title: 'Tab Label (EN)', type: 'string' }),
          defineField({ name: 'labelDe', title: 'Tab Label (DE)', type: 'string' }),
          defineField({ name: 'subline', title: 'Subline (EN)', type: 'string' }),
          defineField({ name: 'sublineDe', title: 'Subline (DE)', type: 'string' }),
          defineField({ name: 'body', title: 'Body (EN)', type: 'text', rows: 4, description: 'Use **bold** for emphasis' }),
          defineField({ name: 'bodyDe', title: 'Body (DE)', type: 'text', rows: 4 }),
          defineField({ name: 'features', title: 'Features (EN)', type: 'array', of: [{ type: 'string' }] }),
          defineField({ name: 'featuresDe', title: 'Features (DE)', type: 'array', of: [{ type: 'string' }] }),
          defineField({ name: 'cta', title: 'CTA Text (EN)', type: 'string' }),
          defineField({ name: 'ctaDe', title: 'CTA Text (DE)', type: 'string' }),
        ],
        preview: { select: { title: 'label', subtitle: 'tabId' } },
      }],
    }),

    /* ═══════════════════════════════════════════════════════════════
       7 · MISSION & SCIENCE
       ═══════════════════════════════════════════════════════════════ */
    // Header
    defineField({ name: 'missionOverline', title: 'Mission Overline (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionOverlineDe', title: 'Mission Overline (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceOverline', title: 'Science Overline (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceOverlineDe', title: 'Science Overline (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionHeadlineLead', title: 'Headline Lead (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionHeadlineLeadDe', title: 'Headline Lead (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionHeadlineEm', title: 'Headline Emphasis (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionHeadlineEmDe', title: 'Headline Emphasis (DE)', type: 'string', group: 'mission' }),
    // Mission panel
    defineField({ name: 'missionTag', title: 'Mission Tag (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionTagDe', title: 'Mission Tag (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionTitle', title: 'Mission Title (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionTitleDe', title: 'Mission Title (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionTitleEm', title: 'Mission Title Emphasis (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionTitleEmDe', title: 'Mission Title Emphasis (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionBody', title: 'Mission Body (EN)', type: 'text', rows: 5, group: 'mission', description: 'Use **bold** for emphasis' }),
    defineField({ name: 'missionBodyDe', title: 'Mission Body (DE)', type: 'text', rows: 5, group: 'mission' }),
    defineField({ name: 'missionDownLead', title: 'Mission Down Lead (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionDownLeadDe', title: 'Mission Down Lead (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionDownTail', title: 'Mission Down Tail (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionDownTailDe', title: 'Mission Down Tail (DE)', type: 'string', group: 'mission' }),
    // Portrait
    defineField({ name: 'missionPortraitImage', title: 'Porträtbild', type: 'image', options: { hotspot: true }, group: 'mission', description: 'Porträt im Labor-/Motion-Capture-Look. Hochformat empfohlen (ca. 3:4), min. 1200×1600 px, JPG. Bildausschnitt über den Fokuspunkt (Hotspot) festlegen.' }),
    defineField({ name: 'missionPortraitLive', title: 'Portrait Live Label (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitLiveDe', title: 'Portrait Live Label (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitRec', title: 'Portrait Rec Label (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitRecDe', title: 'Portrait Rec Label (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitWhoLabel', title: 'Who Label (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitWhoLabelDe', title: 'Who Label (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitWhoName', title: 'Who Name', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitWhereLabel', title: 'Where Label (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitWhereLabelDe', title: 'Where Label (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitWhereSub', title: 'Where Sub (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionPortraitWhereSubDe', title: 'Where Sub (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionMarkerChipTop', title: 'Marker Chip Top (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionMarkerChipTopDe', title: 'Marker Chip Top (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionMarkerChipBottom', title: 'Marker Chip Bottom (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionMarkerChipBottomDe', title: 'Marker Chip Bottom (DE)', type: 'string', group: 'mission' }),
    // Science panel
    defineField({ name: 'scienceTag', title: 'Science Tag (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceTagDe', title: 'Science Tag (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceTitle', title: 'Science Title (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceTitleDe', title: 'Science Title (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceTitleEm', title: 'Science Title Emphasis (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceTitleEmDe', title: 'Science Title Emphasis (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceBody', title: 'Science Body (EN)', type: 'text', rows: 5, group: 'mission', description: 'Use **bold** for emphasis' }),
    defineField({ name: 'scienceBodyDe', title: 'Science Body (DE)', type: 'text', rows: 5, group: 'mission' }),
    defineField({ name: 'scienceDownLead', title: 'Science Down Lead (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceDownLeadDe', title: 'Science Down Lead (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceDownTail', title: 'Science Down Tail (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'scienceDownTailDe', title: 'Science Down Tail (DE)', type: 'string', group: 'mission' }),
    // Use cases within mission
    defineField({ name: 'missionUcLabelLead', title: 'UC Label Lead (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionUcLabelLeadDe', title: 'UC Label Lead (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionUcLabelTail', title: 'UC Label Tail (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionUcLabelTailDe', title: 'UC Label Tail (DE)', type: 'string', group: 'mission' }),
    defineField({
      name: 'missionUseCases',
      title: 'Mission Use Cases',
      type: 'array',
      group: 'mission',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'tag', title: 'Tag (EN)', type: 'string' }),
          defineField({ name: 'tagDe', title: 'Tag (DE)', type: 'string' }),
          defineField({ name: 'title', title: 'Title (EN)', type: 'string' }),
          defineField({ name: 'titleDe', title: 'Title (DE)', type: 'string' }),
          defineField({ name: 'titleEm', title: 'Title Emphasis (EN)', type: 'string' }),
          defineField({ name: 'titleEmDe', title: 'Title Emphasis (DE)', type: 'string' }),
          defineField({ name: 'meta', title: 'Meta (EN)', type: 'string' }),
          defineField({ name: 'metaDe', title: 'Meta (DE)', type: 'string' }),
        ],
        preview: { select: { title: 'tag', subtitle: 'title' } },
      }],
    }),
    // Method / Instruments
    defineField({ name: 'missionMethodTag', title: 'Method Tag (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionMethodTagDe', title: 'Method Tag (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionMethodTitle', title: 'Method Title (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionMethodTitleDe', title: 'Method Title (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionMethodTitleEm', title: 'Method Title Em (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionMethodTitleEmDe', title: 'Method Title Em (DE)', type: 'string', group: 'mission' }),
    defineField({
      name: 'missionInstruments',
      title: 'Instruments',
      type: 'array',
      group: 'mission',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'num', title: 'Number Label (EN)', type: 'string' }),
          defineField({ name: 'numDe', title: 'Number Label (DE)', type: 'string' }),
          defineField({ name: 'title', title: 'Title (EN)', type: 'string' }),
          defineField({ name: 'titleDe', title: 'Title (DE)', type: 'string' }),
          defineField({ name: 'sub', title: 'Subtitle (EN)', type: 'string' }),
          defineField({ name: 'subDe', title: 'Subtitle (DE)', type: 'string' }),
        ],
        preview: { select: { title: 'title', subtitle: 'num' } },
      }],
    }),
    defineField({ name: 'missionOutputLabel', title: 'Output Label (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionOutputLabelDe', title: 'Output Label (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionOutputSub', title: 'Output Sub (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionOutputSubDe', title: 'Output Sub (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionOutputScoreSuffix', title: 'Score Suffix (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionOutputScoreSuffixDe', title: 'Score Suffix (DE)', type: 'string', group: 'mission' }),
    // Synthesis
    defineField({ name: 'missionSynthesisLabel', title: 'Synthesis Label (EN)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionSynthesisLabelDe', title: 'Synthesis Label (DE)', type: 'string', group: 'mission' }),
    defineField({ name: 'missionSynthesisText', title: 'Synthesis Text (EN)', type: 'text', rows: 3, group: 'mission', description: 'Use **bold** for emphasis' }),
    defineField({ name: 'missionSynthesisTextDe', title: 'Synthesis Text (DE)', type: 'text', rows: 3, group: 'mission' }),

    /* ═══════════════════════════════════════════════════════════════
       8 · FOUNDERS (formerly Social Proof)
       ═══════════════════════════════════════════════════════════════ */
    defineField({ name: 'foundersOverline', title: 'Overline (EN)', type: 'string', group: 'socialProof' }),
    defineField({ name: 'foundersOverlineDe', title: 'Overline (DE)', type: 'string', group: 'socialProof' }),
    defineField({ name: 'foundersHeadline', title: 'Headline (EN)', type: 'string', group: 'socialProof' }),
    defineField({ name: 'foundersHeadlineDe', title: 'Headline (DE)', type: 'string', group: 'socialProof' }),
    // Founder 1
    defineField({ name: 'founder1Name', title: 'Founder 1 · Name', type: 'string', group: 'socialProof' }),
    defineField({ name: 'founder1Title', title: 'Founder 1 · Title (EN)', type: 'string', group: 'socialProof' }),
    defineField({ name: 'founder1TitleDe', title: 'Founder 1 · Title (DE)', type: 'string', group: 'socialProof' }),
    defineField({ name: 'founder1Image', title: 'Founder 1 · Foto', type: 'image', options: { hotspot: true }, group: 'socialProof', description: 'Foto von Gründer 1. Quadratisch oder Hochformat, min. 800×800 px, JPG. Bildausschnitt über den Fokuspunkt (Hotspot) festlegen.' }),
    defineField({ name: 'founder1Quote', title: 'Founder 1 · Quote (EN)', type: 'text', rows: 6, group: 'socialProof', description: 'Use **bold** for emphasis. Separate paragraphs with blank lines.' }),
    defineField({ name: 'founder1QuoteDe', title: 'Founder 1 · Quote (DE)', type: 'text', rows: 6, group: 'socialProof' }),
    // Founder 2
    defineField({ name: 'founder2Name', title: 'Founder 2 · Name', type: 'string', group: 'socialProof' }),
    defineField({ name: 'founder2Title', title: 'Founder 2 · Title (EN)', type: 'string', group: 'socialProof' }),
    defineField({ name: 'founder2TitleDe', title: 'Founder 2 · Title (DE)', type: 'string', group: 'socialProof' }),
    defineField({ name: 'founder2Image', title: 'Founder 2 · Foto', type: 'image', options: { hotspot: true }, group: 'socialProof', description: 'Foto von Gründer 2. Quadratisch oder Hochformat, min. 800×800 px, JPG. Bildausschnitt über den Fokuspunkt (Hotspot) festlegen.' }),
    defineField({ name: 'founder2Quote', title: 'Founder 2 · Quote (EN)', type: 'text', rows: 6, group: 'socialProof', description: 'Use **bold** for emphasis. Separate paragraphs with blank lines.' }),
    defineField({ name: 'founder2QuoteDe', title: 'Founder 2 · Quote (DE)', type: 'text', rows: 6, group: 'socialProof' }),

    /* ═══════════════════════════════════════════════════════════════
       9 · FAQ
       ═══════════════════════════════════════════════════════════════ */
    defineField({ name: 'faqOverline', title: 'Overline (EN)', type: 'string', group: 'faq' }),
    defineField({ name: 'faqOverlineDe', title: 'Overline (DE)', type: 'string', group: 'faq' }),
    defineField({ name: 'faqHeadline', title: 'Headline (EN)', type: 'string', group: 'faq' }),
    defineField({ name: 'faqHeadlineDe', title: 'Headline (DE)', type: 'string', group: 'faq' }),
    defineField({
      name: 'faqItems',
      title: 'FAQ Items',
      type: 'array',
      group: 'faq',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'question', title: 'Question (EN)', type: 'string' }),
          defineField({ name: 'questionDe', title: 'Question (DE)', type: 'string' }),
          defineField({ name: 'answer', title: 'Answer (EN)', type: 'text', rows: 4 }),
          defineField({ name: 'answerDe', title: 'Answer (DE)', type: 'text', rows: 4 }),
        ],
        preview: { select: { title: 'question' } },
      }],
    }),

    /* ═══════════════════════════════════════════════════════════════
       10 · CTA / WAITLIST
       ═══════════════════════════════════════════════════════════════ */
    defineField({ name: 'ctaOverline', title: 'Overline (EN)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaOverlineDe', title: 'Overline (DE)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaHeadline', title: 'Headline (EN)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaHeadlineDe', title: 'Headline (DE)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaSub', title: 'Subtitle (EN)', type: 'text', rows: 2, group: 'cta' }),
    defineField({ name: 'ctaSubDe', title: 'Subtitle (DE)', type: 'text', rows: 2, group: 'cta' }),
    defineField({ name: 'ctaPlaceholder', title: 'Email Placeholder (EN)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaPlaceholderDe', title: 'Email Placeholder (DE)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaButton', title: 'Button Text (EN)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaButtonDe', title: 'Button Text (DE)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaTrust', title: 'Trust Line (EN)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaTrustDe', title: 'Trust Line (DE)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaSegmentLabel', title: 'Segment Label (EN)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaSegmentLabelDe', title: 'Segment Label (DE)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaSegments', title: 'Segment Options (EN)', type: 'array', of: [{ type: 'string' }], group: 'cta' }),
    defineField({ name: 'ctaSegmentsDe', title: 'Segment Options (DE)', type: 'array', of: [{ type: 'string' }], group: 'cta' }),
    defineField({ name: 'ctaSuccessMessage', title: 'Success Message (EN)', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaSuccessMessageDe', title: 'Success Message (DE)', type: 'string', group: 'cta' }),
  ],
  preview: { prepare() { return { title: 'Homepage' } } },
})
