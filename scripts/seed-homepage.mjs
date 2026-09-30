import { createClient } from '@sanity/client'
import { existsSync, readFileSync } from 'node:fs'

function readLocalEnv() {
  if (!existsSync('.env.local')) return {}

  return Object.fromEntries(
    readFileSync('.env.local', 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separator = line.indexOf('=')
        const key = line.slice(0, separator).trim()
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(/^(['"])(.*)\1$/, '$2')
        return [key, value]
      }),
  )
}

const localEnv = readLocalEnv()
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  localEnv.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  localEnv.NEXT_PUBLIC_SANITY_DATASET
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  localEnv.NEXT_PUBLIC_SANITY_API_VERSION ||
  '2024-01-01'
const token =
  process.env.SANITY_SEED_TOKEN ||
  localEnv.SANITY_SEED_TOKEN
const confirmation =
  process.env.SANITY_SEED_CONFIRM ||
  localEnv.SANITY_SEED_CONFIRM

if (!projectId || !dataset || !token) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_SEED_TOKEN.',
  )
}

const expectedConfirmation = `${projectId}/${dataset}`
if (confirmation !== expectedConfirmation) {
  throw new Error(
    `Refusing to overwrite Sanity. Set SANITY_SEED_CONFIRM=${expectedConfirmation} for this explicit run.`,
  )
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

/**
 * Content mirrors the hardcoded fallback copy in the section components
 * (app/*-section.tsx). If you change copy there, change it here too.
 * seeded Sanity content overrides the fallbacks.
 * Language guardrail: follow the MDR-safe wording rules in VANEUPDATE.md
 * before editing any copy here. VANE is a movement quality information
 * tool, not a medical device. No medical claims of any kind.
 */
const doc = {
  _id: 'homepage',
  _type: 'homepage',

  // ── HERO ──
  heroOverline: 'Movement quality. Measured.',
  heroOverlineDe: 'Bewegungsqualität. Gemessen.',
  heroHeadlinePart1: 'We gave Human Movement',
  heroHeadlinePart2: 'a language.',
  heroHeadlineDe: 'Wir haben menschlicher Bewegung eine Sprache gegeben.',
  heroSub: 'Trainers guess. Doctors observe. Trackers count steps. VANE measures how well you move. One score across seven domains, compared with people your age.',
  heroSubDe: 'Trainer schätzen. Ärzte beobachten. Tracker zählen Schritte. VANE misst, wie gut du dich bewegst. Ein Score über sieben Domänen, verglichen mit Menschen deines Alters.',
  heroCta1: 'Discover my score →',
  heroCta1De: 'Warteliste beitreten →',
  heroCta2: 'How it works',
  heroCta2De: "So funktioniert's",
  heroTrustItems: ['Developed in Vienna', 'Built on psychometric test methodology', 'Used with elite athletes'],
  heroTrustItemsDe: ['Entwickelt in Wien', 'Psychometrische Testmethodik', 'Im Einsatz mit Spitzensportlern'],
  // Legacy field (no longer read by the components; kept for structure).
  heroDashboardSubline: 'Above the average for people your age.',
  heroDashboardSublineDe: 'Über dem Durchschnitt für Menschen deines Alters.',

  // ── PROBLEM ──
  problemOverline: 'The problem',
  problemOverlineDe: 'Das Problem',
  problemHeadlineLead: 'The world',
  problemHeadlineLeadDe: 'Die Welt bewegt',
  problemHeadlineEm: 'moves blind.',
  problemHeadlineEmDe: 'sich blind.',
  problemHeadSub: "The data exists. **Decision quality doesn't.** The Movement Quality Score changes that.",
  problemHeadSubDe: 'Daten gibt es. **Entscheidungsqualität fehlt.** Der Movement Quality Score ändert das.',
  problemLeftTitle: 'What everyone says',
  problemLeftTitleDe: 'Was alle sagen',
  problemLeftTag: 'Opinions · observations · counts',
  problemLeftTagDe: 'Meinungen · Beobachtungen · Zahlen',
  problemRightTag: 'Data · seven domains · objective',
  problemRightTagDe: 'Daten · sieben Domänen · objektiv',
  problemVoices: [
    { _type: 'object', _key: 'v1', idx: '01', role: 'Trainer says', roleDe: 'Trainer sagt', quote: 'Looks good.', quoteDe: 'Sieht gut aus.', gaps: ['no number', 'no range', 'no proof'], gapsDe: ['keine Zahl', 'keine Norm', 'kein Nachweis'] },
    { _type: 'object', _key: 'v2', idx: '02', role: 'Doctor says', roleDe: 'Arzt sagt', quote: 'Move more.', quoteDe: 'Beweg dich mehr.', gaps: ['how much?', 'how well?', 'vs whom?'], gapsDe: ['wie viel?', 'wie gut?', 'vs. wem?'] },
    { _type: 'object', _key: 'v3', idx: '03', role: 'Tracker says', roleDe: 'Tracker sagt', quote: '10,000 steps. Resting HR 54.', quoteDe: '10.000 Schritte. Ruhepuls 54.', gaps: ['counted', 'not qualified', 'no peer comparison'], gapsDe: ['gezählt', 'nicht bewertet', 'kein Vergleich'] },
  ],
  // Legacy fields (no longer read by the components; kept for structure).
  problemPanelTitleLead: 'Movement Quality Score',
  problemPanelTitleLeadDe: 'Movement Quality Score',
  problemPanelTitleTail: 'awaiting',
  problemPanelTitleTailDe: 'wartet',
  problemPanelPing: 'no data',
  problemPanelPingDe: 'keine Daten',
  problemScoreUnit: '/ 100',
  problemDomainLabels: ['Gait', 'Postural Control', 'Force', 'Power', 'Motor Control', 'Neuro Response', 'Dual-Task Cost'],
  problemDomainLabelsDe: ['Gangbild', 'Posturale Kontrolle', 'Kraftfähigkeit', 'Power', 'Motorische Kontrolle', 'Neuro Response', 'Dual-Task-Cost'],
  problemCaptionTag: 'The shift',
  problemCaptionTagDe: 'Der Wandel',
  problemCaptionText: 'Data only becomes valuable when it enables a better decision.\nThe MQS turns it into **findings and prioritized next steps**.',
  problemCaptionTextDe: 'Daten werden erst wertvoll, wenn sie eine bessere Entscheidung ermöglichen.\nDer MQS macht daraus **Befunde und priorisierte nächste Schritte**.',
  problemCostPrelude: 'The cost',
  problemCostPreludeDe: 'Die Kosten',
  problemCostAside: 'Two trainers. Same movement. **Different assessment.**',
  problemCostAsideDe: 'Zwei Trainer. Dieselbe Bewegung. **Unterschiedliche Bewertung.**',
  problemCostFix: 'The MQS changes that',
  problemCostFixDe: 'Der MQS ändert das',
  problemCostSportTag: 'In sport',
  problemCostSportTagDe: 'Im Sport',
  problemCostSportLine: 'It costs **careers.**',
  problemCostSportLineDe: 'Es kostet **Karrieren.**',
  problemCostAgingTag: 'In aging',
  problemCostAgingTagDe: 'Im Alter',
  problemCostAgingLine: 'It costs **independence.**',
  problemCostAgingLineDe: 'Es kostet **Unabhängigkeit.**',

  // ── SOLUTION ──
  solutionHeadline: 'Your entire movement. One number.',
  solutionHeadlineDe: 'Deine gesamte Bewegung. Eine Zahl.',
  solutionDescription: 'Like an IQ test, but for your body. The MQS captures seven areas of your movement and compares you to people your age. Above 50? Above average. Below 40? Worth a closer look.',
  solutionDescriptionDe: 'Wie ein IQ Test, aber für deinen Körper. Der MQS misst sieben Bereiche deiner Bewegung und vergleicht dich mit Menschen deines Alters und Geschlechts. Ein Score über 50 heißt: Du bewegst dich besser als der Durchschnitt.',
  solutionSliderStatement: 'How you move today shapes how you age tomorrow.',
  solutionSliderStatementDe: 'Wie du dich heute bewegst, bestimmt, wie du morgen alterst.',
  solutionLifespanItems: ['The MQS stays with you. For life.', "At 25, it shows where you're vulnerable.", 'At 45, which training works best for you.', 'At 65, whether your movement supports independent living.', 'Same metric. Your context gives it meaning.'],
  solutionLifespanItemsDe: ['Der MQS begleitet dich. Für immer.', 'Mit 25 zeigt er, wo du verwundbar bist.', 'Mit 45, welches Training für dich am besten funktioniert.', 'Mit 65, ob deine Bewegung unabhängiges Leben ermöglicht.', 'Gleiche Metrik. Dein Kontext gibt ihr Bedeutung.'],
  solutionPersonA: { label: 'Person A', labelDe: 'Person A', sublabel: 'Sedentary Office Worker', sublabelDe: 'Büroarbeiter ohne Bewegung', bullets: ['Sedentary lifestyle', 'Minimal exercise', 'Average diet'], bulletsDe: ['Sitzender Lebensstil', 'Minimale Bewegung', 'Durchschnittliche Ernährung'] },
  solutionPersonB: { label: 'Person B', labelDe: 'Person B', sublabel: 'Competitive Athlete', sublabelDe: 'Leistungssportler', bullets: ['Active lifestyle', 'Regular training', 'Performance nutrition'], bulletsDe: ['Aktiver Lebensstil', 'Regelmäßiges Training', 'Leistungsernährung'] },

  // ── MQS ──
  mqsOverline: 'The Score',
  mqsOverlineDe: 'Der Score',
  mqsHeadline: 'Movement Quality Score',
  mqsHeadlineDe: 'Movement Quality Score',
  mqsDescription: 'Your overall movement quality in one number, compared to people your age and broken down across seven areas.',
  mqsDescriptionDe: 'Deine gesamte Bewegungsqualität in einer Zahl, verglichen mit Menschen deines Alters und aufgeschlüsselt in sieben Bereiche.',
  mqsDomains: [
    { _type: 'object', _key: 'd1', code: 'GAIT', label: 'Gait', labelDe: 'Gangbild', baselineScore: 58 },
    { _type: 'object', _key: 'd2', code: 'POST', label: 'Postural Control', labelDe: 'Posturale Kontrolle', baselineScore: 52 },
    { _type: 'object', _key: 'd3', code: 'FORCE', label: 'Force', labelDe: 'Kraftfähigkeit', baselineScore: 61 },
    { _type: 'object', _key: 'd4', code: 'POWER', label: 'Power', labelDe: 'Power', baselineScore: 55 },
    { _type: 'object', _key: 'd5', code: 'MOTOR', label: 'Motor Control', labelDe: 'Motorische Kontrolle', baselineScore: 49 },
    { _type: 'object', _key: 'd6', code: 'NEURO', label: 'Neuro Response', labelDe: 'Neuro Response', baselineScore: 54 },
    { _type: 'object', _key: 'd7', code: 'DTC', label: 'Dual-Task Cost', labelDe: 'Dual-Task-Cost', baselineScore: 47 },
  ],

  // ── TECHNOLOGY ──
  techOverline: 'How it works',
  techOverlineDe: "So funktioniert's",
  techHeadline: 'From measurement to decision. Under 30 minutes.',
  techHeadlineDe: 'Von der Messung zur Entscheidung in unter 30 Minuten.',
  techSteps: [
    { _type: 'object', _key: 's1', num: '01', title: 'Measure', titleDe: 'Messen', desc: 'A standardized test battery lasting 30 minutes. It works independently of hardware and runs on the force plate and camera setups already used by gyms, clinics, and performance facilities. There is no proprietary hardware and no dependency on one vendor.', descDe: 'Eine standardisierte Testbatterie von 30 Minuten. Sie funktioniert hardwareunabhängig und läuft auf vorhandenen Setups mit Kraftmessplatten und Kameras in Gyms, Praxen und Performanceeinrichtungen. Es braucht weder proprietäre Hardware noch die Bindung an einen Anbieter.' },
    { _type: 'object', _key: 's2', num: '02', title: 'Analyse', titleDe: 'Analysieren', desc: "Our software scores your results in seconds. It uses the same test theory behind the world's best psychological assessments. No room for interpretation.", descDe: 'Unsere Software wertet deine Ergebnisse in Sekunden aus. Sie nutzt dieselbe Testtheorie, mit der die besten psychologischen Testverfahren der Welt gebaut werden. Kein Interpretationsspielraum.' },
    { _type: 'object', _key: 's3', num: '03', title: 'Understand', titleDe: 'Verstehen', desc: "Your report doesn't stop at a score. It delivers 3 to 5 key findings and prioritized next steps, showing exactly where training makes the biggest difference.", descDe: 'Dein Report bleibt nicht beim Score stehen. Er liefert 3 bis 5 zentrale Befunde und priorisierte nächste Schritte. So weißt du genau, wo Training den größten Unterschied macht.' },
    { _type: 'object', _key: 's4', num: '04', title: 'Improve', titleDe: 'Verbessern', desc: 'Baseline + retest: the same test after your training or therapy block shows what actually changed. The result reveals whether it works, in numbers rather than opinions.', descDe: 'Baseline + Retest: Derselbe Test nach deinem Trainings- oder Therapieblock zeigt, was sich wirklich verändert hat. Das Ergebnis belegt in Zahlen, ob es wirkt.' },
  ],

  // ── USE CASES ──
  useCasesOverline: "Who it's for",
  useCasesOverlineDe: 'Für wen?',
  useCasesHeadline: 'Tested in the lab.\nUsed in elite sport.\nBuilt for every body.',
  useCasesHeadlineEm: 'every body.',
  useCasesHeadlineDe: 'Im Labor getestet.\nIm Spitzensport im Einsatz.\nGebaut für jeden Körper.',
  useCasesTabs: [
    {
      _type: 'object',
      _key: 't1',
      tabId: 'you',
      label: 'For you',
      labelDe: 'Für dich',
      subline: 'Athletes, health-conscious individuals, the curious',
      sublineDe: 'Athleten, Gesundheitsbewusste, Neugierige',
      body: 'You see which movement quality currently limits you and whether your training is working. **One score with seven domains** is compared to people your age and retested over time.',
      bodyDe: 'Du siehst, welche Bewegungsqualität dich aktuell limitiert und ob dein Training Wirkung zeigt. **Ein Score mit sieben Domänen** wird mit Menschen deines Alters verglichen und im Retest über die Zeit verfolgt.',
      features: [
        'Personal MQS report: 3 to 5 key findings and prioritized next steps',
        'Your profile across seven domains: strengths and limiters',
        'Baseline + retest: proof of whether your training works',
        'Body + mind under load: the dual-task quality no wearable measures',
      ],
      featuresDe: [
        'Persönlicher MQS Report: 3 bis 5 zentrale Befunde und priorisierte nächste Schritte',
        'Dein Profil über sieben Domänen: Stärken und Limitierungen',
        'Baseline + Retest: der Beleg, ob dein Training wirkt',
        'Körper + Kopf unter Belastung: Dual-Task-Qualität, die kein Wearable misst',
      ],
      cta: 'Discover my score',
      ctaDe: 'Warteliste beitreten',
    },
    {
      _type: 'object',
      _key: 't2',
      tabId: 'club',
      label: 'For your club',
      labelDe: 'Für deinen Verein',
      subline: 'Sports clubs, federations, performance teams',
      sublineDe: 'Sportvereine, Verbände, Performance-Teams',
      body: 'You measure endurance, strength, and speed. The MQS adds the missing layer: **more systematic baselines, progress tracking, and return-to-performance communication.**',
      bodyDe: 'Du misst Ausdauer, Kraft und Schnelligkeit. Der MQS ergänzt die fehlende Ebene: **mehr Systematik in Baselines, Verlauf und Return-to-Performance-Kommunikation.**',
      features: [
        'Team baselines with an individual MQS profile per athlete',
        'Retest deltas that show whether the training block worked',
        'Dual-task testing can make asymmetries and risk indicators visible',
        'Return to performance: standardized progress data for clear decisions',
      ],
      featuresDe: [
        'Team-Baselines mit individuellem MQS-Profil pro Athlet',
        'Retest-Deltas, die zeigen, ob der Trainingsblock gewirkt hat',
        'Dual-Task-Testung kann Asymmetrien und Risikoindikatoren sichtbar machen',
        'Return to Performance: standardisierte Verlaufsdaten für klare Entscheidungen',
      ],
      cta: 'Request a performance partnership',
      ctaDe: 'Performance-Partnerschaft anfragen',
    },
    {
      _type: 'object',
      _key: 't3',
      tabId: 'practice',
      label: 'For your practice',
      labelDe: 'Für deine Praxis',
      subline: 'Clinics, physios, coaches, performance facilities',
      sublineDe: 'Kliniken, Physios, Coaches, Performance-Einrichtungen',
      body: 'A standardized premium assessment for your clients: **report, retest, and clear priorities.** Progress becomes visible, comparable, and easier to communicate at your site on your existing equipment.',
      bodyDe: 'Ein standardisiertes Premium Assessment für deine Klienten: **Report, Retest und klare Prioritäten.** Fortschritt wird bei dir vor Ort auf deinem bestehenden Equipment sichtbar, vergleichbar und besser kommunizierbar.',
      features: [
        'Standardized test battery and report logic, run by your trained staff',
        'Baseline + retest workflow: progress your clients can see',
        'From measurement data to concrete priorities: strength, control, mobility, symmetry, load tolerance',
        'Partner standards and white-label options: your brand, our methodology',
      ],
      featuresDe: [
        'Standardisierte Testbatterie und Reportlogik, durchgeführt von deinem geschulten Team',
        'Baseline-und-Retest-Workflow: Fortschritt, den deine Klienten sehen',
        'Aus Messdaten werden konkrete Prioritäten: Kraft, Kontrolle, Mobilität, Symmetrie, Belastbarkeit',
        'Partnerstandards und White-Label-Optionen: deine Marke, unsere Methodik',
      ],
      cta: 'Request a discovery call',
      ctaDe: 'Discovery-Gespräch anfragen',
    },
  ],

  // ── MISSION & SCIENCE ──
  missionOverline: 'Our mission',
  missionOverlineDe: 'Unsere Mission',
  scienceOverline: 'The science',
  scienceOverlineDe: 'Die Wissenschaft',
  missionHeadlineLead: 'We gave human movement',
  missionHeadlineLeadDe: 'Wir haben menschlicher Bewegung',
  missionHeadlineEm: 'a language.',
  missionHeadlineEmDe: 'eine Sprache gegeben.',
  missionTag: 'The belief',
  missionTagDe: 'Die Überzeugung',
  missionTitle: 'Understand how humans move,',
  missionTitleDe: 'Verstehen, wie sich Menschen bewegen.',
  missionTitleEm: 'help them move better.',
  missionTitleEmDe: 'damit sie sich besser bewegen.',
  missionBody: 'VANE was built on a simple belief: if we understand how humans move, we can help them move better. Whether that means guiding an athlete back to performance, preserving independence as you age, or teaching machines how humans move in the long term, it starts with the same data. **The Movement Quality Score.**',
  missionBodyDe: 'VANE basiert auf einer einfachen Überzeugung: Wenn wir verstehen, wie sich Menschen bewegen, können wir ihnen helfen, sich besser zu bewegen. Ob das heißt, einen Athleten zurück zur Leistung zu führen, Eigenständigkeit mit dem Alter zu bewahren oder langfristig Maschinen beizubringen, wie Menschen sich wirklich bewegen, es beginnt mit denselben Daten. **Dem Movement Quality Score.**',
  missionDownLead: 'Three lives',
  missionDownLeadDe: 'Drei Leben',
  missionDownTail: 'one metric',
  missionDownTailDe: 'eine Metrik',
  missionPortraitLive: 'LIVE · capture',
  missionPortraitLiveDe: 'LIVE · Aufnahme',
  missionPortraitRec: 'REC · 120 fps',
  missionPortraitRecDe: 'REC · 120 fps',
  missionPortraitWhoLabel: 'The founder',
  missionPortraitWhoLabelDe: 'Der Gründer',
  missionPortraitWhoName: 'Dario Saisan',
  missionPortraitWhereLabel: 'Vienna',
  missionPortraitWhereLabelDe: 'Wien',
  missionPortraitWhereSub: 'VANE Lab · AT',
  missionPortraitWhereSubDe: 'VANE Lab · AT',
  missionMarkerChipTop: '21 MARKERS',
  missionMarkerChipTopDe: '21 MARKER',
  missionMarkerChipBottom: 'FORCE · 0.1 N',
  missionMarkerChipBottomDe: 'KRAFT · 0.1 N',
  scienceTag: 'The method',
  scienceTagDe: 'Die Methode',
  scienceTitle: 'No guessing. No opinions.',
  scienceTitleDe: 'Keine Schätzung. Keine Meinung.',
  scienceTitleEm: 'Just data.',
  scienceTitleEmDe: 'Nur Daten.',
  scienceBody: "VANE applies the same test methodology behind the world's best psychological assessments to movement. Our reference lab in Vienna uses motion capture, force plates, and standardized protocols to **develop and standardize the MQS**. The test battery works independently of hardware and runs on the standard equipment already used by gyms, clinics, and performance facilities. In the long term, the same data quality can support research in movement science and robotics.",
  scienceBodyDe: 'VANE wendet dieselbe Testtheorie, mit der die besten psychologischen Testverfahren der Welt gebaut werden, auf Bewegung an. Unser Referenzlabor in Wien nutzt Motion Capture, Kraftmessplatten und standardisierte Protokolle, um **den MQS zu entwickeln und zu normieren**. Die Testbatterie funktioniert hardwareunabhängig und läuft auf der vorhandenen Standardausstattung von Gyms, Praxen und Performanceeinrichtungen. Langfristig kann dieselbe Datenqualität Forschung in Bewegungswissenschaft und Robotik unterstützen.',
  scienceDownLead: 'Three instruments',
  scienceDownLeadDe: 'Drei Instrumente',
  scienceDownTail: 'one score',
  scienceDownTailDe: 'ein Score',
  missionUcLabelLead: 'Three lives ·',
  missionUcLabelLeadDe: 'Drei Leben ·',
  missionUcLabelTail: 'one metric',
  missionUcLabelTailDe: 'eine Metrik',
  missionUseCases: [
    { _type: 'object', _key: 'uc1', tag: 'Sport', tagDe: 'Sport', title: "An athlete's comeback,", titleDe: 'Das Comeback eines Athleten,', titleEm: 'proven.', titleEmDe: 'belegt.', meta: 'Baseline and retest instead of gut feeling', metaDe: 'Baseline und Retest statt Bauchgefühl' },
    { _type: 'object', _key: 'uc2', tag: 'Aging', tagDe: 'Altern', title: 'Independence,', titleDe: 'Eigenständigkeit,', titleEm: 'preserved.', titleEmDe: 'bewahrt.', meta: 'Movement quality made visible over the years', metaDe: 'Bewegungsqualität über Jahre sichtbar gemacht' },
    { _type: 'object', _key: 'uc3', tag: 'Robotics', tagDe: 'Robotik', title: 'Machines that work', titleDe: 'Maschinen, die', titleEm: 'beside us.', titleEmDe: 'neben uns arbeiten.', meta: 'Taught how humans actually move', metaDe: 'Sie lernen, wie Menschen sich bewegen' },
  ],
  missionMethodTag: 'Inside the reference lab',
  missionMethodTagDe: 'Im Referenzlabor',
  missionMethodTitle: 'Three instruments.',
  missionMethodTitleDe: 'Drei Instrumente.',
  missionMethodTitleEm: 'One number.',
  missionMethodTitleEmDe: 'Eine Zahl.',
  missionInstruments: [
    { _type: 'object', _key: 'i1', num: '01 · Capture', numDe: '01 · Aufnahme', title: 'Motion capture', titleDe: 'Motion Capture', sub: 'Sub-mm precision · 120 fps', subDe: 'Submillimeter · 120 fps' },
    { _type: 'object', _key: 'i2', num: '02 · Force', numDe: '02 · Kraft', title: 'Force plates', titleDe: 'Kraftmessplatten', sub: 'Elite-sport grade · ±0.1 N', subDe: 'Spitzensport-Niveau · ±0.1 N' },
    { _type: 'object', _key: 'i3', num: '03 · Strength', numDe: '03 · Stärke', title: 'Strength testing', titleDe: 'Krafttest', sub: 'Max voluntary output', subDe: 'Maximale willkürliche Kraft' },
  ],
  missionOutputLabel: 'Movement Quality Score',
  missionOutputLabelDe: 'Movement Quality Score',
  missionOutputSub: 'One number · your age, your sex',
  missionOutputSubDe: 'Eine Zahl · dein Alter, dein Geschlecht',
  missionOutputScoreSuffix: 'T-score',
  missionOutputScoreSuffixDe: 'T-Wert',
  missionSynthesisLabel: 'the synthesis',
  missionSynthesisLabelDe: 'die Synthese',
  missionSynthesisText: 'We didn’t set out to believe that human movement could be understood this clearly. We set out to **prove it**. The Movement Quality Score is what happened when we did.',
  missionSynthesisTextDe: 'Wir wollten nicht nur glauben, dass menschliche Bewegung so klar verstanden werden kann. Wir wollten es **beweisen**. Der Movement Quality Score ist das Ergebnis.',

  // ── FOUNDERS (vision section) ──
  foundersOverline: 'The team',
  foundersOverlineDe: 'Das Team',
  foundersHeadline: 'Built on years in the field.',
  foundersHeadlineDe: 'Gebaut auf Jahren in der Praxis.',
  founder1Name: 'Dario Saisan',
  founder1Title: 'Co-Founder, VANE Science',
  founder1TitleDe: 'Co-Founder, VANE Science',
  founder1Quote: 'VANE is the product of six years building performance systems for elite athletes. The same force plate testing used in our Vienna training camps with clients from Bundesliga football and top European basketball leagues is the scientific foundation of the MQS.',
  founder1QuoteDe: 'VANE ist das Ergebnis von sechs Jahren Arbeit mit Leistungssportlern. Dieselbe Force-Plate-Testung, die in unseren Wiener Trainingscamps mit Klienten aus der Deutschen Bundesliga bis zu europäischen Top-Basketball-Ligen eingesetzt wird, ist die wissenschaftliche Grundlage des MQS.',
  founder2Name: 'Co-Founder & CTO',
  founder2Title: 'VANE Science',
  founder2TitleDe: 'VANE Science',
  founder2Quote: "Today everything is being measured, understood, and optimized. Yet the most fundamental layer of human life, how we move, remains largely invisible.\n\nHaving worked with data and performance for years, it became clear that this gap is not just technical, it is structural. Movement shapes health, longevity, and how we exist in the world, but we lack a shared way to understand it.\n\n**MQS is making human movement visible.** A foundation that allows people to understand themselves better, make better decisions, and stay capable for longer.\n\nWe're building this because it's overdue.",
  founder2QuoteDe: 'Heute wird alles gemessen, verstanden und optimiert. Doch die grundlegendste Ebene menschlichen Lebens, nämlich wie wir uns bewegen, bleibt weitgehend unsichtbar.\n\nNach Jahren der Arbeit mit Daten und Leistung wurde klar, dass diese Lücke nicht nur technisch, sondern strukturell ist. Bewegung formt Gesundheit, Langlebigkeit und wie wir in der Welt existieren, aber es fehlt uns eine gemeinsame Sprache, sie zu verstehen.\n\n**MQS macht menschliche Bewegung sichtbar.** Ein Fundament, das Menschen hilft, sich selbst besser zu verstehen, bessere Entscheidungen zu treffen und länger leistungsfähig zu bleiben.\n\nWir bauen das, weil es längst überfällig ist.',

  // ── SOCIAL PROOF ──
  // Legacy fields (superseded by the founders block above; kept for structure).
  proofOverline: 'Already in use',
  proofOverlineDe: 'Bereits im Einsatz',
  proofHeadline: 'Built on years in the field.',
  proofHeadlineDe: 'Gebaut auf Jahren in der Praxis.',
  proofQuote: 'VANE is the product of six years building performance systems for elite athletes. The same force plate testing used in our Vienna training camps with clients from Bundesliga football and top European basketball leagues is the scientific foundation of the MQS.',
  proofQuoteDe: 'VANE ist das Ergebnis von sechs Jahren Arbeit mit Leistungssportlern. Dieselbe Force-Plate-Testung, die in unseren Wiener Trainingscamps mit Klienten aus der Deutschen Bundesliga bis zu europäischen Top-Basketball-Ligen eingesetzt wird, ist die wissenschaftliche Grundlage des MQS.',
  proofQuoteAuthor: 'Dario Saisan',
  proofQuoteRole: 'Co-Founder, VANE Science',
  proofCredibilityItems: ['From lab to life', 'Basketball · Football · Volleyball · American Football', 'European pro leagues', 'Force-plate testing', 'Vienna'],
  proofCredibilityItemsDe: ['Vom Labor in die Praxis', 'Basketball · Fußball · Volleyball · American Football', 'Europäische Profiliga', 'Force-Plate-Testung', 'Wien'],

  // ── FAQ ──
  faqOverline: 'FAQ',
  faqOverlineDe: 'FAQ',
  faqHeadline: 'Frequently asked questions',
  faqHeadlineDe: 'Häufig gestellte Fragen',
  faqItems: [
    {
      _type: 'object',
      _key: 'f1',
      question: 'What exactly is the MQS?',
      questionDe: 'Was genau ist der MQS?',
      answer: 'Like an IQ test, but for your body. The Movement Quality Score captures your movement quality across seven domains, from gait and postural control to strength, power, and movement under cognitive load. Your result is compared to people your age and sex: 50 means average, above 60 is above average. It is never just one number. Behind the score sits a profile of seven domain results.',
      answerDe: 'Wie ein IQ Test, aber für deinen Körper. Der Movement Quality Score erfasst deine Bewegungsqualität in sieben Domänen, vom Gangbild und der posturalen Kontrolle über Kraft und Power bis zur Bewegung unter kognitiver Belastung. Dein Ergebnis wird mit Menschen deines Alters und Geschlechts verglichen: 50 bedeutet durchschnittlich, über 60 überdurchschnittlich. Es ist nie nur eine Zahl. Hinter dem Score steht ein Profil aus sieben Domänenwerten.',
    },
    {
      _type: 'object',
      _key: 'f2',
      question: 'Do I need special equipment?',
      questionDe: 'Brauche ich spezielle Geräte für den Test?',
      answer: 'No. VANE works independently of hardware. The standardized test battery runs on the force plate and camera setups that gyms, clinics, and performance facilities already use. There is no proprietary hardware and no dependency on one vendor. Our lab in Vienna, where the methodology is developed and standardized, serves as the reference environment.',
      answerDe: 'Nein. VANE funktioniert hardwareunabhängig. Die standardisierte Testbatterie läuft auf vorhandenen Setups mit Kraftmessplatten und Kameras in Gyms, Praxen und Performanceeinrichtungen. Es braucht weder proprietäre Hardware noch die Bindung an einen Anbieter. Unser Labor in Wien, wo die Methodik entwickelt und normiert wird, dient als Referenzumgebung.',
    },
    {
      _type: 'object',
      _key: 'f3',
      question: 'How long does an assessment take?',
      questionDe: 'Wie lange dauert ein Assessment?',
      answer: 'Under 30 minutes for the full test battery. Analysis is automatic and delivered in real time.',
      answerDe: 'Unter 30 Minuten für die vollständige Testbatterie. Die Auswertung erfolgt automatisch und in Echtzeit.',
    },
    {
      _type: 'object',
      _key: 'f4',
      question: 'What does it cost?',
      questionDe: 'Was kostet es?',
      answer: 'Launch pricing for the first cohort: MQS Baseline €590, Baseline + Retest €890 (our recommendation because the retest makes progress provable), and Partner Pilot from €1,900 for practices, facilities, and clubs. Team testing days and federation programs on request. Prices excl. VAT.',
      answerDe: 'Die Launchpreise für die erste Kohorte: MQS Baseline 590 €, Baseline + Retest 890 € (unsere Empfehlung, denn im Retest wird Fortschritt belegbar) und Partner Pilot ab 1.900 € für Praxen, Einrichtungen und Vereine. Testtage für Teams und Verbandsprogramme gibt es auf Anfrage. Preise zzgl. USt.',
    },
    {
      _type: 'object',
      _key: 'f5',
      question: 'A good coach or physio sees this anyway. Why measure it?',
      questionDe: 'Ein guter Coach oder Physio sieht das doch auch so?',
      answer: 'A trained eye stays essential. The MQS makes those observations measurable, documented, comparable, and suitable for retesting. It creates a shared reference instead of gut feeling and evidence of progress you can actually show.',
      answerDe: 'Ein geschultes Auge bleibt essenziell. Der MQS macht diese Beobachtungen messbar, dokumentiert, vergleichbar und für Retests geeignet. So entsteht eine gemeinsame Referenz statt Bauchgefühl und ein Beleg für Fortschritt, den du zeigen kannst.',
    },
    {
      _type: 'object',
      _key: 'f6',
      question: 'Why would I come back for a second assessment?',
      questionDe: 'Warum sollte ich zu einem zweiten Assessment kommen?',
      answer: 'Because the retest is the core of the product. The baseline shows where you stand; the retest proves whether training or therapy actually works. The change between two measurements is what turns data into better decisions.',
      answerDe: 'Weil der Retest der Kern des Produkts ist. Die Baseline zeigt, wo du stehst; der Retest belegt, ob Training oder Therapie wirklich wirkt. Die Veränderung zwischen zwei Messungen macht aus Daten bessere Entscheidungen.',
    },
    {
      _type: 'object',
      _key: 'f7',
      question: 'How solid is your reference data this early on?',
      questionDe: 'Wie belastbar sind eure Referenzdaten so früh?',
      answer: 'We are transparent about it: the MQS is built on established psychometric test methodology, published movement research, and our own structured pilot data. Every standardized assessment grows the reference base. Every score is shown with its context, never as a black box.',
      answerDe: 'Wir gehen transparent damit um: Der MQS basiert auf etablierter psychometrischer Testmethodik, publizierter Bewegungsforschung und unseren eigenen strukturierten Pilotdaten. Jedes standardisierte Assessment vergrößert die Referenzbasis. Jeder Score wird mit seinem Kontext gezeigt, nie als Black Box.',
    },
    {
      _type: 'object',
      _key: 'f8',
      question: 'How is VANE different from a fitness tracker?',
      questionDe: 'Wie unterscheidet sich VANE von einem Fitness-Tracker?',
      answer: 'They complement each other. Wearables are strong at measuring volume around the clock, including steps, heart rate, and sleep. The MQS measures movement quality in a standardized test situation: how well you move, not how much. Together, they give the full picture.',
      answerDe: 'Sie ergänzen sich. Wearables messen Volumen rund um die Uhr, darunter Schritte, Herzfrequenz und Schlaf. Der MQS misst Bewegungsqualität in einer standardisierten Testsituation: wie gut du dich bewegst, nicht wie viel. Zusammen ergeben sie das vollständige Bild.',
    },
    {
      _type: 'object',
      _key: 'f9',
      question: 'Is VANE a medical device?',
      questionDe: 'Ist VANE ein Medizinprodukt?',
      answer: 'No. VANE is a movement quality information tool, not a medical device. The MQS is a measurement and decision-support profile: it can make asymmetries and risk indicators visible, but it does not replace medical advice and makes no guarantees about injuries or performance.',
      answerDe: 'Nein. VANE ist ein Informations-Tool für Bewegungsqualität, kein Medizinprodukt. Der MQS ist ein Mess- und Entscheidungsunterstützungs-Profil: Er kann Asymmetrien und Risikoindikatoren sichtbar machen, ersetzt aber keine medizinische Beratung und gibt keine Garantien in Bezug auf Verletzungen oder Leistung.',
    },
    {
      _type: 'object',
      _key: 'f10',
      question: 'What does "compared to your age group" mean?',
      questionDe: 'Was bedeutet "verglichen mit meiner Altersgruppe"?',
      answer: 'Your score is compared to a reference group matched by age and sex. An MQS of 55 means you move better than the average of your comparison group.',
      answerDe: 'Dein Score wird mit einer Referenzgruppe verglichen, die deinem Alter und Geschlecht entspricht. Ein MQS von 55 bedeutet: Du bewegst dich besser als der Durchschnitt deiner Vergleichsgruppe.',
    },
    {
      _type: 'object',
      _key: 'f11',
      question: 'Can I use VANE as a gym owner or clinic?',
      questionDe: 'Kann ich VANE als Gym-Betreiber oder Klinik nutzen?',
      answer: 'Yes. VANE offers a partner model for gyms, clinics, and federations: standardized test battery, automated reports, retest workflows, and long-term client monitoring. Request a discovery call to get started.',
      answerDe: 'Ja. VANE bietet ein Partnermodell für Gyms, Kliniken und Verbände: standardisierte Testbatterie, automatisierte Reports, Retest-Workflows und Langzeit-Monitoring eurer Klienten. Frag ein Discovery-Gespräch an.',
    },
    {
      _type: 'object',
      _key: 'f12',
      question: 'How do you protect my data?',
      questionDe: 'Wie schützt ihr meine Daten?',
      answer: "VANE is GDPR-compliant: all data is processed in line with EU data protection law. We don't sell data, we only use analytics with your consent, and you can request deletion at any time. Details in our privacy policy.",
      answerDe: 'VANE ist DSGVO-konform: Alle Daten werden nach europäischem Datenschutzrecht verarbeitet. Wir verkaufen keine Daten, nutzen Analytics nur mit deiner Zustimmung, und du kannst jederzeit die Löschung deiner Daten verlangen. Details in unserer Datenschutzerklärung.',
    },
  ],

  // ── CTA ──
  ctaOverline: 'Join us',
  ctaOverlineDe: 'Jetzt mitmachen',
  ctaHeadline: "Know where you stand. Know where you're going.",
  ctaHeadlineDe: 'Sehen. Verstehen. Besser bewegen.',
  ctaSub: 'VANE launches soon. The first spots go to those who show up first.',
  ctaSubDe: 'VANE startet bald. Sichere dir deinen Platz und gehöre zu den Ersten, die ihren Bewegungsscore kennen.',
  ctaPlaceholder: 'your@email.com',
  ctaPlaceholderDe: 'deine@email.com',
  ctaButton: 'Discover my score →',
  ctaButtonDe: 'Zugang sichern →',
  ctaTrust: 'No spam. Processed in line with GDPR. Unsubscribe anytime.',
  ctaTrustDe: 'Kein Spam. DSGVO-konform. Jederzeit abmeldbar.',
  ctaSegmentLabel: 'Which best describes you?',
  ctaSegmentLabelDe: 'Was beschreibt dich am besten?',
  ctaSegments: ["I'm an individual", 'I represent a gym or clinic', 'I represent a federation'],
  ctaSegmentsDe: ['Ich bin Einzelperson', 'Ich vertrete ein Gym oder eine Klinik', 'Ich vertrete einen Verband'],
  ctaSuccessMessage: "You're on the list. We'll be in touch.",
  ctaSuccessMessageDe: 'Du bist auf der Liste. Wir melden uns.',
}

try {
  const result = await client.createOrReplace(doc)
  console.log('SUCCESS. Document created with ID:', result._id)
} catch (err) {
  console.error('ERROR:', err instanceof Error ? err.message : err)
  process.exitCode = 1
}
