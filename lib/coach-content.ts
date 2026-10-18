import type { Locale } from './locale'
// Detailed approved wording for the compact page's tour, NormVault and disclosures.
export type CoachPoint = { title: string; description: string }
export type CoachSectionCopy = {
  eyebrow: string
  title: string
  intro: string
  body: string[]
  cards: CoachPoint[]
}
export type CoachSectionId =
  'normvault' | 'force' | 'video' | 'online' | 'report' | 'faq'
const uiEnglish = {
  example: 'Example athlete',
  scoreLabel: 'The score',
  dataLabel: 'Every data point',
  filters: ['Female', '25-34', 'Competitive'],
  normMetrics: [
    'JUMP HEIGHT · 38.4 CM · P72',
    'KNEE ANGLE · LANDING · 92° · P61',
  ],
  videoOutputs: [
    {
      title: 'Kinematic variables',
      description:
        'joint angles, movement depth, landing mechanics, left vs. right and movement timing',
    },
    {
      title: 'Jump height from flight time',
      description: 'without a force plate',
    },
    {
      title: 'Kinetics from video',
      description: 'force estimates straight from the camera',
    },
    {
      title: 'A confidence score on every measurement',
      description: 'so you always know how far to trust it',
    },
  ],
  videoSteps: [
    {
      title: 'Record.',
      description:
        'Test on your plate as usual and press record on the iPhone at the same time.',
    },
    {
      title: 'Upload.',
      description:
        'Clips go straight from the MQS Capture app to your MQS account.',
    },
    {
      title: 'Sync.',
      description:
        'Press “Sync” for your force-plate account. MQS finds the athlete and pairs every video with its force curve.',
    },
    {
      title: 'Analyse.',
      description:
        'Scrub through video, skeleton and force curve together, frame by frame.',
    },
  ],
  setupsNote:
    'Same software, same Movement Quality Score, same interpretation, same report. A bigger setup gives you a more precise result, and the confidence score always tells you how precise.',
  medicalNote: 'MQS gives you movement information, not a medical diagnosis.',
  prototype: 'Preliminary prototype shown. Not the finished software.',
  pauseMotion: 'Pause page motion',
  resumeMotion: 'Resume page motion',
  tourEyebrow: 'SEE MQS IN ACTION',
  tourTitle: 'MORE CONTEXT. CLEARER DECISIONS.',
  tourIntro:
    "Put your athletes' results in context with access to a growing reference database.",
  tourLabel: 'MQS product tour',
  previous: 'Previous step',
  next: 'Next step',
  pauseTour: 'Pause tour',
  playTour: 'Play tour',
  step: 'Step',
  of: 'of',
  domainNames: [
    'Gait',
    'Postural control',
    'Force capacity',
    'Power',
    'Motor control',
    'Neuro response',
    'Dual-task cost',
  ],
}
export type CoachCopy = {
  sections: Record<CoachSectionId, CoachSectionCopy>
  ui: typeof uiEnglish
}
export const coachContent: Record<Locale, CoachCopy> = {
  en: {
    sections: {
      normvault: {
        eyebrow: 'NORMVAULT',
        title: 'COMPARE EVERY ATHLETE TO THE WORLD. DOWN TO EVERY DATA POINT.',
        intro:
          "Your own data tells you if an athlete improved. NormVault tells you if they're actually good. Compare their Movement Quality Score, and every single force-plate metric and kinematic variable behind it, with athletes of the same sex, age and level from around the world.",
        body: [],
        cards: [
          {
            title: 'More than a score: every data point.',
            description:
              'Compare the overall MQS, each domain, and every force-plate metric and kinematic variable on its own. You see the big picture and the detail behind it.',
          },
          {
            title: 'Find the real weakness.',
            description:
              'An athlete can improve on themselves and still lag far behind their peers. NormVault shows the gaps that matter, so you train the right quality.',
          },
          {
            title: 'It gets sharper every week.',
            description:
              'The more coaches assess with MQS, the more precise the reference gets, and you get that progress automatically.',
          },
          {
            title: 'Fully anonymised.',
            description:
              'NormVault holds anonymised numbers only: no names, no faces, no video. Your athletes stay yours.',
          },
        ],
      },
      force: {
        eyebrow: 'FORCE-PLATE ANALYSIS',
        title: 'BRING THE PLATES YOU ALREADY OWN.',
        intro:
          'Connect Hawkin Dynamics, VALD, CC Athletics or your lab plates, sync your entire history in one click, and finally see what your data is telling you.',
        body: [],
        cards: [
          {
            title: 'Your whole history, synced.',
            description:
              'Connect your account once. Every past test comes in, matched to the right athlete. No exports, no spreadsheets.',
          },
          {
            title: 'The metrics that matter, already sorted.',
            description:
              'No more scrolling through a hundred numbers. MQS puts the metrics that matter for each test first, explains every one in plain language and shows where it ranks in NormVault.',
          },
          {
            title: 'The easiest way into force-plate analytics.',
            description:
              "New to force plates? You'll work at a high level from day one. Experienced? You'll get to the answer faster than in any tool you've used.",
          },
          {
            title: 'Left vs. right, trends, retests: at a glance.',
            description:
              'Asymmetries, progress over time and before/after comparisons, without building a single chart yourself.',
          },
        ],
      },
      video: {
        eyebrow: 'IPHONE & MOTION CAPTURE',
        title: 'SEE THE MOVEMENT BEHIND THE NUMBERS.',
        intro:
          'Force plates tell you what an athlete produced. Video shows you how. MQS gives you markerless motion capture on your iPhone, and syncs it with your force plate on one timeline.',
        body: [
          "Download the MQS Capture app, put your iPhone on a tripod and record. That's all you need to start. MQS turns the video into markerless motion capture and gives you:",
          'One iPhone gets you started. Two or three give you more angles and even better data.',
        ],
        cards: [
          {
            title: 'iPhone + force plate',
            description:
              'Use your Hawkin, VALD or CC Athletics plate exactly as you do today. When you start the test on your force-plate tablet, press record on the iPhone. MQS matches each clip to the right athlete and the right jump automatically.',
          },
          {
            title: 'Lab setup',
            description:
              'High-speed cameras, OptiTrack, Bertec 3D plates. Connect them directly to the MQS desktop app and capture everything from one place, already synchronised.',
          },
        ],
      },
      online: {
        eyebrow: 'ONLINE COACHING',
        title: 'ASSESS ANY ATHLETE, ANYWHERE.',
        intro:
          "Your athletes don't have to be in the room. They film a standardized assessment, and you analyse it at the same level as an in-person session.",
        body: [
          'Send your athlete the MQS assessment instructions. They film the tests with their phone, following the same standardized setup every time, and send you the videos. You upload them to the MQS desktop app, and MQS does the rest: markerless motion capture, kinematic variables, jump height, comparison with NormVault and the report.',
          "High-level movement assessment, for clients you've never met in person. Online coaching has never had data this good.",
        ],
        cards: [
          {
            title: 'Your athlete films.',
            description:
              'Standardized assessment videos, following clear instructions.',
          },
          {
            title: 'You upload.',
            description: 'Drop the videos into your MQS desktop app.',
          },
          {
            title: 'You get the full analysis.',
            description:
              'Kinematics, NormVault comparison and the report, just like in person.',
          },
        ],
      },
      report: {
        eyebrow: 'INTERPRETATION & REPORT',
        title: 'AN EXPERT READ OF EVERY ASSESSMENT, IN MINUTES.',
        intro:
          'MQS reads the force data and the movement data together and writes a clear report: which qualities need training and where to focus first.',
        body: [
          "The interpretation is built on years of high-level force-plate work with athletes, turned into a system and powered by AI. It looks at far more of the data at once than anyone can by hand, and it explains what it finds in plain language. You get an expert's read of every athlete, even if you're new to movement analysis, and every report teaches you something.",
          "The report tells you what to train. It doesn't tell you which exercises to use. That stays your decision. Export it as a PDF, share it with your athlete or use it in your staff meeting.",
        ],
        cards: [
          {
            title: 'The needs, ranked.',
            description: 'Which qualities to train, in what order, and why.',
          },
          {
            title: 'Kinetics and kinematics, read together.',
            description:
              'What the force curve shows and what the video shows, in one interpretation.',
          },
          {
            title: 'A report your athlete understands.',
            description:
              'The Movement Quality Score, the seven domains and the key findings: clean, visual, ready to send.',
          },
        ],
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'YOUR QUESTIONS. ANSWERED.',
        intro: '',
        body: [],
        cards: [
          {
            title: 'What is the Movement Quality Score?',
            description:
              'One score for how well someone moves, built from a unified assessment across seven domains: gait, postural control, force capacity, power, motor control, neuro response and dual-task cost. Every coach assesses the same way, so every score means the same thing everywhere.',
          },
          {
            title: "I've never done movement analysis. Is MQS for me?",
            description:
              "Yes. That's exactly who it's built for. MQS guides you through the tests, sorts the data and explains every result, so you work at a high level from your first assessment.",
          },
          {
            title: 'What can I compare in NormVault?',
            description:
              'Everything: the overall MQS, each of the seven domains, and every single force-plate metric and kinematic variable.',
          },
          {
            title: 'Which force plates work with MQS?',
            description:
              'Hawkin Dynamics, VALD and CC Athletics connect through your account. Lab plates such as Bertec connect directly to the desktop app. Other data can be imported as files.',
          },
          {
            title: 'Do I need a force plate?',
            description:
              'No. Every coach starts with an iPhone: you get kinematic variables, jump height from flight time and kinetics from video, calibrated in our lab. A force plate adds the full force-time analysis.',
          },
          {
            title: 'How many iPhones do I need?',
            description:
              'One is enough to start. Two or three give you more angles and better data.',
          },
          {
            title: 'Can I assess athletes remotely?',
            description:
              'Yes. Your athlete films a standardized assessment and sends you the videos. You upload them to the MQS desktop app and get the full analysis.',
          },
          {
            title: 'Does the AI decide the training?',
            description:
              'No. MQS tells you which qualities need training. You choose the exercises and build the plan.',
          },
          {
            title: "Who can see my athletes' data?",
            description:
              'Only you and the people you invite. NormVault receives anonymised numbers only, never names or video.',
          },
          {
            title: 'Mac or Windows?',
            description: 'Both. The MQS Capture app runs on iPhone.',
          },
          {
            title: 'Is MQS a medical device?',
            description:
              'No. MQS gives movement information for training decisions, not a medical diagnosis.',
          },
          {
            title: 'What does it cost?',
            description:
              "We'll share pricing with everyone on the waitlist first.",
          },
        ],
      },
    },
    ui: uiEnglish,
  },
  de: {
    sections: {
      normvault: {
        eyebrow: 'NORMVAULT',
        title:
          'VERGLEICHE JEDEN ATHLETEN MIT DER WELT. BIS ZUM EINZELNEN DATENPUNKT.',
        intro:
          'Deine eigenen Daten zeigen, ob sich ein Athlet verbessert hat. NormVault zeigt, wo er wirklich steht. Vergleiche den Movement Quality Score und jede einzelne Kraftplatten- und kinematische Messgröße dahinter mit Athleten gleichen Geschlechts, Alters und Leistungsniveaus aus der ganzen Welt.',
        body: [],
        cards: [
          {
            title: 'Mehr als ein Score: jeder Datenpunkt.',
            description:
              'Vergleiche den Gesamt-MQS, jede Domäne und jede Kraftplatten- und kinematische Messgröße einzeln. Du siehst das Gesamtbild und die Details dahinter.',
          },
          {
            title: 'Finde die entscheidende Schwäche.',
            description:
              'Ein Athlet kann sich verbessern und trotzdem weit hinter seiner Vergleichsgruppe liegen. NormVault zeigt die relevanten Lücken, damit du die richtige Qualität trainierst.',
          },
          {
            title: 'Jede Woche präziser.',
            description:
              'Je mehr Coaches mit MQS testen, desto genauer wird die Referenz. Du profitierst automatisch davon.',
          },
          {
            title: 'Vollständig anonymisiert.',
            description:
              'NormVault enthält nur anonymisierte Zahlen: keine Namen, keine Gesichter, keine Videos. Deine Athleten bleiben deine Athleten.',
          },
        ],
      },
      force: {
        eyebrow: 'KRAFTPLATTENANALYSE',
        title: 'NUTZE DIE PLATTEN, DIE DU SCHON HAST.',
        intro:
          'Verbinde Hawkin Dynamics, VALD, CC Athletics oder deine Laborplatten. Synchronisiere deine gesamte Testhistorie mit einem Klick und verstehe endlich, was deine Daten dir sagen.',
        body: [],
        cards: [
          {
            title: 'Deine gesamte Historie, synchronisiert.',
            description:
              'Verbinde dein Konto einmal. Alle bisherigen Tests werden den richtigen Athleten zugeordnet. Keine Exporte, keine Tabellen.',
          },
          {
            title: 'Die relevanten Messgrößen, bereits sortiert.',
            description:
              'Kein Scrollen durch hundert Zahlen. MQS zeigt zuerst die relevanten Messgrößen für jeden Test, erklärt sie verständlich und ordnet sie in NormVault ein.',
          },
          {
            title: 'Der einfache Einstieg in die Kraftplattenanalyse.',
            description:
              'Neu an der Kraftplatte? Du arbeitest ab Tag eins auf hohem Niveau. Schon erfahren? Du kommst schneller zur Antwort als mit jedem bisherigen Werkzeug.',
          },
          {
            title: 'Links gegen rechts, Trends, Retests: auf einen Blick.',
            description:
              'Asymmetrien, Entwicklung und Vorher-nachher-Vergleiche, ohne selbst ein einziges Diagramm zu bauen.',
          },
        ],
      },
      video: {
        eyebrow: 'IPHONE & MOTION CAPTURE',
        title: 'SIEH DIE BEWEGUNG HINTER DEN ZAHLEN.',
        intro:
          'Kraftplatten zeigen, was ein Athlet produziert. Video zeigt, wie. MQS bringt markerlose Bewegungserfassung auf dein iPhone und synchronisiert sie mit deiner Kraftplatte auf einer Zeitachse.',
        body: [
          'Lade die MQS Capture App herunter, stelle dein iPhone auf ein Stativ und nimm auf. Mehr brauchst du zum Start nicht. MQS macht aus dem Video eine markerlose Bewegungserfassung und liefert dir:',
          'Ein iPhone reicht zum Start. Zwei oder drei liefern mehr Perspektiven und noch bessere Daten.',
        ],
        cards: [
          {
            title: 'iPhone + Kraftplatte',
            description:
              'Nutze deine Hawkin-, VALD- oder CC-Athletics-Platte wie gewohnt. Wenn du den Test auf dem Kraftplatten-Tablet startest, starte die Aufnahme auf dem iPhone. MQS ordnet jeden Clip automatisch dem richtigen Athleten und Sprung zu.',
          },
          {
            title: 'Labor-Setup',
            description:
              'Highspeed-Kameras, OptiTrack, Bertec-3D-Platten. Verbinde sie direkt mit der MQS Desktop App und erfasse alles zentral, bereits synchronisiert.',
          },
        ],
      },
      online: {
        eyebrow: 'ONLINE-COACHING',
        title: 'TESTE JEDEN ATHLETEN. ÜBERALL.',
        intro:
          'Deine Athleten müssen nicht im selben Raum sein. Sie filmen ein standardisiertes Assessment. Du analysierst es auf demselben Niveau wie vor Ort.',
        body: [
          'Schicke deinem Athleten die MQS Assessment-Anleitung. Er filmt die Tests mit seinem Handy, jedes Mal mit demselben standardisierten Aufbau, und schickt dir die Videos. Du lädst sie in die MQS Desktop App. MQS übernimmt den Rest: markerlose Bewegungserfassung, kinematische Messgrößen, Sprunghöhe, NormVault-Vergleich und Bericht.',
          'Bewegungsassessment auf hohem Niveau, auch für Athleten, die du noch nie persönlich getroffen hast. Online-Coaching hatte noch nie so gute Daten.',
        ],
        cards: [
          {
            title: 'Dein Athlet filmt.',
            description:
              'Standardisierte Assessment-Videos nach klaren Anweisungen.',
          },
          {
            title: 'Du lädst hoch.',
            description: 'Ziehe die Videos in deine MQS Desktop App.',
          },
          {
            title: 'Du bekommst die vollständige Analyse.',
            description:
              'Kinematik, NormVault-Vergleich und Bericht, genau wie vor Ort.',
          },
        ],
      },
      report: {
        eyebrow: 'INTERPRETATION & BERICHT',
        title: 'EIN EXPERTENBLICK AUF JEDES ASSESSMENT. IN MINUTEN.',
        intro:
          'MQS liest Kraft- und Bewegungsdaten gemeinsam und schreibt einen klaren Bericht: Welche Qualitäten brauchen Training, und wo setzt du zuerst an?',
        body: [
          'Die Interpretation basiert auf jahrelanger Kraftplattenarbeit auf hohem Niveau mit Athleten, in ein System übersetzt und von KI unterstützt. Sie betrachtet mehr Daten gleichzeitig, als ein Mensch von Hand verarbeiten kann, und erklärt die Ergebnisse verständlich. Du bekommst einen Expertenblick auf jeden Athleten, auch als Einsteiger in die Bewegungsanalyse. Jeder Bericht vermittelt dir neues Wissen.',
          'Der Bericht zeigt, was du trainieren solltest. Welche Übungen du nutzt, entscheidest du. Exportiere ihn als PDF, teile ihn mit deinem Athleten oder nutze ihn im Teammeeting.',
        ],
        cards: [
          {
            title: 'Der Bedarf, priorisiert.',
            description:
              'Welche Qualitäten du trainieren solltest, in welcher Reihenfolge und warum.',
          },
          {
            title: 'Kinetik und Kinematik, gemeinsam gelesen.',
            description:
              'Kraftkurve und Video in einer gemeinsamen Interpretation.',
          },
          {
            title: 'Ein Bericht, den dein Athlet versteht.',
            description:
              'Movement Quality Score, sieben Domänen und die wichtigsten Ergebnisse: klar, visuell, bereit zum Teilen.',
          },
        ],
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'DEINE FRAGEN. BEANTWORTET.',
        intro: '',
        body: [],
        cards: [
          {
            title: 'Was ist der Movement Quality Score?',
            description:
              'Ein Score dafür, wie gut sich jemand bewegt. Er basiert auf einem einheitlichen Assessment über sieben Domänen: Gang, Haltungskontrolle, Kraftfähigkeit, Power, motorische Kontrolle, neuronale Reaktion und Dual-Task-Kosten. Jeder Coach testet gleich. Jeder Score bedeutet überall dasselbe.',
          },
          {
            title:
              'Ich habe noch nie Bewegungsanalysen gemacht. Ist MQS für mich?',
            description:
              'Ja. Genau dafür ist MQS da. MQS führt dich durch die Tests, sortiert die Daten und erklärt jedes Ergebnis. So arbeitest du ab dem ersten Assessment auf hohem Niveau.',
          },
          {
            title: 'Was kann ich in NormVault vergleichen?',
            description:
              'Alles: den Gesamt-MQS, jede der sieben Domänen und jede einzelne Kraftplatten- und kinematische Messgröße.',
          },
          {
            title: 'Welche Kraftplatten funktionieren mit MQS?',
            description:
              'Hawkin Dynamics, VALD und CC Athletics verbindest du über dein Konto. Laborplatten wie Bertec verbindest du direkt mit der Desktop App. Andere Daten kannst du als Dateien importieren.',
          },
          {
            title: 'Brauche ich eine Kraftplatte?',
            description:
              'Nein. Jeder Coach kann mit einem iPhone starten: kinematische Messgrößen, Sprunghöhe aus Flugzeit und Kinetik aus Video, in unserem Labor kalibriert. Eine Kraftplatte ergänzt die vollständige Kraft-Zeit-Analyse.',
          },
          {
            title: 'Wie viele iPhones brauche ich?',
            description:
              'Eines reicht zum Start. Zwei oder drei liefern mehr Perspektiven und bessere Daten.',
          },
          {
            title: 'Kann ich Athleten aus der Ferne testen?',
            description:
              'Ja. Dein Athlet filmt ein standardisiertes Assessment und schickt dir die Videos. Du lädst sie in die MQS Desktop App und bekommst die vollständige Analyse.',
          },
          {
            title: 'Entscheidet die KI über das Training?',
            description:
              'Nein. MQS zeigt, welche Qualitäten Training brauchen. Du wählst die Übungen und erstellst den Plan.',
          },
          {
            title: 'Wer sieht die Daten meiner Athleten?',
            description:
              'Nur du und die Personen, die du einlädst. NormVault erhält nur anonymisierte Zahlen, niemals Namen oder Videos.',
          },
          {
            title: 'Mac oder Windows?',
            description: 'Beides. Die MQS Capture App läuft auf dem iPhone.',
          },
          {
            title: 'Ist MQS ein Medizinprodukt?',
            description:
              'Nein. MQS liefert Bewegungsinformationen für Trainingsentscheidungen, keine medizinische Diagnose.',
          },
          {
            title: 'Was kostet MQS?',
            description: 'Alle auf der Warteliste erfahren die Preise zuerst.',
          },
        ],
      },
    },
    ui: {
      example: 'Beispielathlet',
      scoreLabel: 'Der Score',
      dataLabel: 'Jeder Datenpunkt',
      filters: ['Weiblich', '25-34', 'Wettkampfniveau'],
      normMetrics: [
        'SPRUNGHÖHE · 38,4 CM · P72',
        'KNIEWINKEL · LANDUNG · 92° · P61',
      ],
      videoOutputs: [
        {
          title: 'Kinematische Messgrößen',
          description:
            'Gelenkwinkel, Bewegungstiefe, Landemechanik, links gegen rechts und Bewegungszeitpunkte',
        },
        {
          title: 'Sprunghöhe aus der Flugzeit',
          description: 'ohne Kraftplatte',
        },
        {
          title: 'Kinetik aus Video',
          description: 'Kraftschätzungen direkt aus der Kamera',
        },
        {
          title: 'Ein Konfidenzwert für jede Messung',
          description: 'damit du weißt, wie weit du ihr vertrauen kannst',
        },
      ],
      videoSteps: [
        {
          title: 'Aufnehmen.',
          description:
            'Teste auf deiner Platte wie gewohnt und starte gleichzeitig die iPhone-Aufnahme.',
        },
        {
          title: 'Hochladen.',
          description:
            'Clips gelangen aus der MQS Capture App direkt in dein MQS Konto.',
        },
        {
          title: 'Synchronisieren.',
          description:
            'Drücke „Sync“ für dein Kraftplattenkonto. MQS findet den Athleten und verbindet jedes Video mit seiner Kraftkurve.',
        },
        {
          title: 'Analysieren.',
          description:
            'Gehe Video, Skelett und Kraftkurve gemeinsam durch, Bild für Bild.',
        },
      ],
      setupsNote:
        'Dieselbe Software, derselbe Movement Quality Score, dieselbe Interpretation, derselbe Bericht. Ein größeres Setup liefert präzisere Ergebnisse. Der Konfidenzwert zeigt dir immer, wie präzise.',
      medicalNote:
        'MQS liefert Bewegungsinformationen, keine medizinische Diagnose.',
      prototype: 'Vorläufiger Prototyp. Nicht die fertige Software.',
      pauseMotion: 'Bewegung auf der Seite pausieren',
      resumeMotion: 'Bewegung auf der Seite fortsetzen',
      tourEyebrow: 'MQS IN AKTION',
      tourTitle: 'MEHR KONTEXT. KLARERE ENTSCHEIDUNGEN.',
      tourIntro:
        'Ordne die Ergebnisse deiner Athleten mit Zugang zu einer wachsenden Referenzdatenbank ein.',
      tourLabel: 'MQS Produkttour',
      previous: 'Vorheriger Schritt',
      next: 'Nächster Schritt',
      pauseTour: 'Tour pausieren',
      playTour: 'Tour abspielen',
      step: 'Schritt',
      of: 'von',
      domainNames: [
        'Gang',
        'Haltungskontrolle',
        'Kraftfähigkeit',
        'Power',
        'Motorische Kontrolle',
        'Neuronale Reaktion',
        'Dual-Task-Kosten',
      ],
    },
  },
}
