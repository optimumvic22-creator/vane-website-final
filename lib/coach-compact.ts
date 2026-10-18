import type { Locale } from './locale'
import { audienceContent, type AudienceCopy } from './audience-content'
import { coachIntroduction } from './coach-introduction'

// The owner's review replaces the 14-section implementation guide with the
// original six-section frame plus a compact score, tour and NormVault section.
export const coachCompactCopy: Record<Locale, AudienceCopy> = {
  en: {
    ...audienceContent.coach.en,
    availabilityNote: undefined,
    eyebrow: 'FOR COACHES, PHYSIOS AND PERFORMANCE TEAMS',
    headline: coachIntroduction.en.headline.join(' '),
    intro: coachIntroduction.en.intro,
    secondaryCta: coachIntroduction.en.setupCta,
    heroValueRail: [
      { title: 'Starts with one iPhone', detail: 'Use the equipment you have' },
      {
        title: 'Compare with the world',
        detail: 'Every score and every metric',
      },
      { title: 'Get your time back', detail: 'A clear report in minutes' },
    ],
    benefitsEyebrow: 'YOUR SETUP',
    benefitsTitle: 'START WITH WHAT YOU HAVE.',
    benefitsIntro:
      'One iPhone gets you started. Add force plates or lab equipment for more detail. The same MQS assessment, comparison and interpretation connect every setup.',
    benefits: [
      {
        title: 'One iPhone. Real movement insight.',
        description:
          'Record in person or let your athlete film remotely. Get movement mechanics, jump height and force estimates from video, with a confidence score on every measurement.',
      },
      {
        title: 'Your force plates. More useful answers.',
        description:
          'Connect Hawkin Dynamics, VALD or CC Athletics. Bring in your entire test history, match video to each trial, and see the metrics that matter without building spreadsheets.',
      },
      {
        title: 'Your lab. Everything together.',
        description:
          'Capture Bertec 3D plates, OptiTrack and high-speed cameras from one desktop app. Get the most precise MQS with all your measurements synchronised.',
      },
    ],
    processEyebrow: 'FROM TESTING TO TRAINING',
    processTitle: 'ASSESS. UNDERSTAND. COACH.',
    steps: [
      {
        title: 'Assess',
        description:
          'Follow one guided assessment with your iPhone, force plates, or both. No biomechanics degree or years of analysis experience needed.',
      },
      {
        title: 'Understand',
        description:
          'MQS brings force and movement together, compares with NormVault, and identifies the qualities that need training.',
      },
      {
        title: 'Coach',
        description:
          'Start from a clear list of needs. Choose the exercises and build the plan around the athlete, the sport and the season.',
      },
    ],
    outputEyebrow: '',
    outputTitle: 'ONE CLEAR REPORT.',
    outputIntro:
      'MQS reads force and movement data together and writes an expert-level needs analysis in plain language. An hour of analysis becomes a few minutes of review, so you can spend that time with your athletes.',
    deliverables: [
      'Training needs ranked, explained and compared with NormVault',
      'Kinetics and kinematics interpreted together, with your progress in context',
      'Every analysis and report builds on your athlete’s history. More context, more precise interpretation.',
      'Export a PDF your athlete understands and your team can act on',
      'Integrate seamlessly with Relay and your coaching brain',
    ],
    decisionLabel: 'YOU KEEP EVERY DECISION',
    decisionText:
      'The report tells you what to train. You choose the exercises, add your context and make every training decision.',
    scienceEyebrow: 'VALIDATED IN OUR VIENNA LAB',
    scienceTitle: 'KNOW HOW FAR TO TRUST THE DATA.',
    scienceText:
      'We record the same movements with iPhones, force plates and OptiTrack, then compare the results. Every measurement carries a confidence score, so you can see how much to trust it. The lab work keeps improving the phone analysis.',
    sciencePoints: [
      'Joint angles and movement timing cross-checked against OptiTrack',
      'Jump height from flight time calibrated against force plates',
      'Confidence shown with every result, whatever your setup',
    ],
    finalEyebrow: 'YOUR NEXT STEP',
    finalTitle: 'BE ONE OF THE FIRST COACHES ON MQS.',
    finalText:
      "Join the waitlist and we'll contact you as soon as your access opens.",
  },
  de: {
    ...audienceContent.coach.de,
    availabilityNote: undefined,
    eyebrow: 'FÜR COACHES, PHYSIOS UND PERFORMANCE-TEAMS',
    headline: coachIntroduction.de.headline.join(' '),
    intro: coachIntroduction.de.intro,
    secondaryCta: coachIntroduction.de.setupCta,
    heroValueRail: [
      {
        title: 'Ein iPhone reicht zum Start',
        detail: 'Nutze deine vorhandene Ausstattung',
      },
      {
        title: 'Vergleiche mit der Welt',
        detail: 'Jeder Score und jede Messgröße',
      },
      { title: 'Gewinne Zeit zurück', detail: 'Ein klarer Bericht in Minuten' },
    ],
    benefitsEyebrow: 'DEIN SETUP',
    benefitsTitle: 'STARTE MIT DEM, WAS DU HAST.',
    benefitsIntro:
      'Ein iPhone reicht zum Start. Kraftplatten oder Laborausstattung ergänzen weitere Details. Dasselbe MQS Assessment, derselbe Vergleich und dieselbe Interpretation verbinden jedes Setup.',
    benefits: [
      {
        title: 'Ein iPhone. Echte Bewegungseinblicke.',
        description:
          'Filme vor Ort oder lass deine Athleten aus der Ferne aufnehmen. Erhalte Bewegungsmechanik, Sprunghöhe und Kraftschätzungen aus Video, mit einem Konfidenzwert für jede Messung.',
      },
      {
        title: 'Deine Kraftplatten. Klarere Antworten.',
        description:
          'Verbinde Hawkin Dynamics, VALD oder CC Athletics. Übernimm deine gesamte Testhistorie, ordne Videos den Versuchen zu und sieh die relevanten Messgrößen ohne Tabellenarbeit.',
      },
      {
        title: 'Dein Labor. Alles verbunden.',
        description:
          'Erfasse Bertec 3D-Platten, OptiTrack und Hochgeschwindigkeitskameras aus einer Desktop-App. Alle Messungen sind synchronisiert, für den präzisesten MQS.',
      },
    ],
    processEyebrow: 'VOM TEST ZUM TRAINING',
    processTitle: 'ERFASSEN. VERSTEHEN. COACHEN.',
    steps: [
      {
        title: 'Erfassen',
        description:
          'Folge einem geführten Assessment mit iPhone, Kraftplatten oder beidem. Ohne Biomechanikstudium oder jahrelange Analyseerfahrung.',
      },
      {
        title: 'Verstehen',
        description:
          'MQS verbindet Kraft und Bewegung, vergleicht mit NormVault und zeigt, welche Qualitäten Training brauchen.',
      },
      {
        title: 'Coachen',
        description:
          'Starte mit einer klaren Bedarfsliste. Wähle die Übungen und plane das Training passend zu Athlet, Sportart und Saison.',
      },
    ],
    outputEyebrow: '',
    outputTitle: 'EIN KLARER BERICHT.',
    outputIntro:
      'MQS liest Kraft- und Bewegungsdaten gemeinsam und schreibt eine verständliche Bedarfsanalyse auf Expertenniveau. Aus einer Stunde Analyse werden wenige Minuten Durchsicht. Die gewonnene Zeit gehört deinen Athleten.',
    deliverables: [
      'Trainingsbedarf priorisiert, erklärt und mit NormVault verglichen',
      'Kinetik und Kinematik gemeinsam interpretiert, mit deinem Fortschritt im Kontext',
      'Jede Analyse und jeder Bericht baut auf der Historie deines Athleten auf. Mehr Kontext, präzisere Interpretation.',
      'Als verständliches PDF für deine Athleten und dein Team exportierbar',
      'Nahtlos in Relay und dein Coaching-Denken integrierbar',
    ],
    decisionLabel: 'JEDE ENTSCHEIDUNG BLEIBT BEI DIR',
    decisionText:
      'Der Bericht zeigt, was Training braucht. Du wählst die Übungen, ergänzt deinen Kontext und triffst jede Trainingsentscheidung.',
    scienceEyebrow: 'IN UNSEREM WIENER LABOR VALIDIERT',
    scienceTitle: 'WISSE, WIE VERLÄSSLICH DEINE DATEN SIND.',
    scienceText:
      'Wir erfassen dieselben Bewegungen mit iPhones, Kraftplatten und OptiTrack und vergleichen die Ergebnisse. Jede Messung erhält einen Konfidenzwert, damit du ihre Verlässlichkeit einschätzen kannst. Die Laborarbeit verbessert die Videoanalyse laufend.',
    sciencePoints: [
      'Gelenkwinkel und Bewegungstiming mit OptiTrack abgeglichen',
      'Sprunghöhe aus Flugzeit gegen Kraftplatten kalibriert',
      'Konfidenz bei jedem Ergebnis, unabhängig von deinem Setup',
    ],
    finalEyebrow: 'DEIN NÄCHSTER SCHRITT',
    finalTitle: 'SEI EINER DER ERSTEN COACHES AUF MQS.',
    finalText:
      'Trag dich auf die Warteliste ein. Wir melden uns, sobald dein Zugang öffnet.',
  },
}

export const compactUi = {
  en: {
    scoreEyebrow: 'INTRODUCING THE MOVEMENT QUALITY SCORE',
    scoreTitle: 'ONE ASSESSMENT. SEVEN DOMAINS. ONE SCORE.',
    scoreIntro:
      'See how well an athlete moves, and which qualities need attention. One standardised assessment makes scores comparable across athletes, retests and facilities. The seven domains keep the detail behind the number visible.',
    scoreNote:
      'The overall score needs all seven domains. With fewer tests, you still get results for the domains covered, with confidence shown.',
    normTitle: 'COMPARE WITH THE WORLD.',
    setupDetails: 'See what this includes',
    reportDetail: 'How MQS interprets the data',
    questions: 'Questions about MQS, your data and access',
    privacy:
      'NormVault contains anonymised numbers only. Your athletes stay yours.',
  },
  de: {
    scoreEyebrow: 'DER MOVEMENT QUALITY SCORE',
    scoreTitle: 'EIN ASSESSMENT. SIEBEN DOMÄNEN. EIN SCORE.',
    scoreIntro:
      'Erkenne, wie gut sich ein Athlet bewegt und welche Qualitäten Aufmerksamkeit brauchen. Ein standardisiertes Assessment macht Scores zwischen Athleten, Retests und Einrichtungen vergleichbar. Die sieben Domänen zeigen die Details hinter der Zahl.',
    scoreNote:
      'Der Gesamtscore braucht alle sieben Domänen. Mit weniger Tests erhältst du Ergebnisse für die erfassten Domänen, jeweils mit Konfidenz.',
    normTitle: 'VERGLEICHE MIT DER WELT.',
    setupDetails: 'Was darin steckt',
    reportDetail: 'Wie MQS die Daten interpretiert',
    questions: 'Fragen zu MQS, deinen Daten und dem Zugang',
    privacy:
      'NormVault enthält nur anonymisierte Zahlen. Deine Athleten bleiben deine.',
  },
} satisfies Record<Locale, Record<string, string>>
