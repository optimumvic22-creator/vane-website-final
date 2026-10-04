export type AudienceSlug = "athlete" | "coach" | "partner";

type AudienceItem = {
  title: string;
  description: string;
};

type AudienceValuePoint = {
  title: string;
  detail: string;
};

export type AudienceCopy = {
  role: string;
  eyebrow: string;
  headline: string;
  intro: string;
  primaryCta: string;
  availabilityNote?: string;
  secondaryCta: string;
  heroValueRail: AudienceValuePoint[];
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsIntro: string;
  benefits: AudienceItem[];
  processEyebrow: string;
  processTitle: string;
  steps: AudienceItem[];
  outputEyebrow: string;
  outputTitle: string;
  outputIntro: string;
  deliverables: string[];
  decisionLabel: string;
  decisionText: string;
  scienceEyebrow: string;
  scienceTitle: string;
  scienceText: string;
  sciencePoints: string[];
  finalEyebrow: string;
  finalTitle: string;
  finalText: string;
  finalCta: string;
  finalNote: string;
};

type LocalizedAudience = {
  en: AudienceCopy;
  de: AudienceCopy;
};

export const audienceSlugs: AudienceSlug[] = ["athlete", "coach", "partner"];

export function isAudienceSlug(value: string): value is AudienceSlug {
  return audienceSlugs.includes(value as AudienceSlug);
}

export const audienceContent: Record<AudienceSlug, LocalizedAudience> = {
  athlete: {
    en: {
      role: "Athlete",
      eyebrow: "Movement quality for athletes",
      headline: "UNDERSTAND HOW YOU MOVE. TRAIN WHAT MATTERS.",
      intro:
        "VANE turns a standardized assessment into one Movement Quality Score, a profile across seven domains, and clear areas to discuss with your coach or therapist.",
      primaryCta: "Join the waitlist",
      secondaryCta: "See what you receive",
      heroValueRail: [
        {
          title: "Know where to focus",
          detail: "Your results explained by the VANE team",
        },
        {
          title: "Plan with your coach",
          detail: "Use your profile to set training priorities",
        },
        {
          title: "See what changes",
          detail: "Compare your results when you retest",
        },
      ],
      benefitsEyebrow: "Why it matters",
      benefitsTitle: "Less guessing. More direction.",
      benefitsIntro:
        "Your result should help you ask better questions, choose clearer priorities, and understand change over time.",
      benefits: [
        {
          title: "See your starting point",
          description:
            "We explain your score, the seven domains behind it, and how your results compare with reference values. You leave knowing what the numbers mean.",
        },
        {
          title: "Focus your training",
          description:
            "Take VANE's interpretation into your next conversation with your coach. Together, decide which areas to work on and how they fit your training.",
        },
        {
          title: "Make change visible",
          description:
            "Retest on the same basis after a period of training. See which results have changed and discuss whether your priorities need to change too.",
        },
      ],
      processEyebrow: "Your assessment",
      processTitle: "Measure. Understand. Act.",
      steps: [
        {
          title: "Measure",
          description:
            "Visit the VANE Training Lab in Vienna. Our team guides you through a standardized assessment across seven domains.",
        },
        {
          title: "Understand",
          description:
            "The VANE team explains your MQS, your seven domain results, and the areas that deserve a closer look.",
        },
        {
          title: "Act",
          description:
            "Discuss the findings with your coach, therapist, or performance team and define the next priorities.",
        },
      ],
      outputEyebrow: "Your result",
      outputTitle: "More than one number.",
      outputIntro:
        "The MQS gives you a compact view of movement quality while keeping the seven individual domains visible.",
      deliverables: [
        "Understand which areas of your movement to focus on",
        "See your results in context, not as isolated numbers",
        "Bring VANE's interpretation into your training decisions",
        "Find out what has changed when you retest",
      ],
      decisionLabel: "Your next training conversation",
      decisionText:
        "What should we work on next, and how will we check whether it has changed?",
      scienceEyebrow: "Responsible interpretation",
      scienceTitle: "Results you can understand.",
      scienceText:
        "VANE interprets your assessment and explains what your results can tell you. We use a standardized protocol and reference values to put your movement profile in context. The assessment does not provide a medical diagnosis or guarantee performance gains.",
      sciencePoints: [
        "One protocol for your first assessment and retest",
        "Your results explained by the VANE team",
        "Clear about what the assessment can and cannot show",
      ],
      finalEyebrow: "Your next step",
      finalTitle: "Join the VANE athlete waitlist.",
      finalText:
        "Interested in an assessment at the VANE Training Lab in Vienna? Join the athlete waitlist and we will contact you when assessment places are available. Development updates are a separate, optional choice below.",
      finalCta: "Join the waitlist",
      finalNote: "Joining the waitlist does not book an assessment.",
    },
    de: {
      role: "Athlet",
      eyebrow: "Bewegungsqualität für Athleten",
      headline: "Verstehe deine Bewegung. Trainiere, was zählt.",
      intro:
        "VANE übersetzt ein standardisiertes Assessment in einen Movement Quality Score, ein Profil über sieben Domänen und klare Bereiche für das Gespräch mit Coach oder Therapeut.",
      primaryCta: "Auf die Warteliste",
      secondaryCta: "Ergebnis ansehen",
      heroValueRail: [
        {
          title: "Wisse, worauf es ankommt",
          detail: "Das VANE Team erklärt dir deine Ergebnisse",
        },
        {
          title: "Plane mit deinem Coach",
          detail: "Dein Profil als Grundlage für Trainingsprioritäten",
        },
        {
          title: "Sieh, was sich verändert",
          detail: "Vergleiche deine Ergebnisse beim Retest",
        },
      ],
      benefitsEyebrow: "Warum es zählt",
      benefitsTitle: "Mehr Überblick. Klarere Prioritäten.",
      benefitsIntro:
        "Dein Ergebnis soll dir helfen, bessere Fragen zu stellen, klare Prioritäten zu wählen und Veränderungen zu verstehen.",
      benefits: [
        {
          title: "Erkenne deinen Ausgangspunkt",
          description:
            "Wir erklären dir deinen Score, die sieben Domänen dahinter und den Vergleich mit Referenzwerten. Du erfährst, was die Zahlen über dein Bewegungsprofil aussagen.",
        },
        {
          title: "Fokussiere dein Training",
          description:
            "Nimm VANEs Einordnung mit ins nächste Gespräch mit deinem Coach. Entscheidet gemeinsam, welche Bereiche ihr angeht und wie sie in dein Training passen.",
        },
        {
          title: "Mache Veränderung sichtbar",
          description:
            "Wiederhole das Assessment nach einer Trainingsphase nach demselben Protokoll. Sieh, welche Ergebnisse sich verändert haben, und besprecht, ob ihr eure Prioritäten anpassen solltet.",
        },
      ],
      processEyebrow: "Dein Assessment",
      processTitle: "Messen. Verstehen. Handeln.",
      steps: [
        {
          title: "Messen",
          description:
            "Komm ins VANE Training Lab in Wien. Unser Team begleitet dich durch ein standardisiertes Assessment über sieben Domänen.",
        },
        {
          title: "Verstehen",
          description:
            "Das VANE Team erklärt dir deinen MQS, die Ergebnisse der sieben Domänen und die Bereiche, die einen genaueren Blick verdienen.",
        },
        {
          title: "Handeln",
          description:
            "Besprich die Ergebnisse mit Coach, Therapeut oder Leistungsteam und definiere die nächsten Prioritäten.",
        },
      ],
      outputEyebrow: "Dein Ergebnis",
      outputTitle: "Mehr als eine Zahl.",
      outputIntro:
        "Der MQS zeigt Bewegungsqualität kompakt, ohne die sieben einzelnen Domänen dahinter zu verstecken.",
      deliverables: [
        "Verstehe, welche Bereiche deiner Bewegung du angehen kannst",
        "Sieh deine Ergebnisse im Vergleich statt als einzelne Zahlen",
        "Nutze VANEs Einordnung für deine Trainingsentscheidungen",
        "Erkenne beim Retest, was sich verändert hat",
      ],
      decisionLabel: "Dein nächstes Gespräch über das Training",
      decisionText:
        "Woran arbeiten wir als Nächstes und wie prüfen wir, was sich verändert hat?",
      scienceEyebrow: "Verantwortungsvolle Einordnung",
      scienceTitle: "Ergebnisse, die du verstehst.",
      scienceText:
        "VANE interpretiert dein Assessment und erklärt dir, was deine Ergebnisse aussagen. Ein standardisiertes Protokoll und Referenzwerte helfen uns, dein Bewegungsprofil einzuordnen. Das Assessment stellt keine medizinische Diagnose und garantiert keine Leistungssteigerung.",
      sciencePoints: [
        "Ein Protokoll für dein erstes Assessment und den Retest",
        "Das VANE Team erklärt dir deine Ergebnisse",
        "Klare Grenzen dessen, was das Assessment zeigen kann",
      ],
      finalEyebrow: "Dein nächster Schritt",
      finalTitle: "Auf die VANE Athleten Warteliste.",
      finalText:
        "Du interessierst dich für ein Assessment im VANE Training Lab in Wien? Trag dich in die Athleten Warteliste ein. Wir melden uns, sobald Assessment Plätze verfügbar sind. Entwicklungsupdates kannst du unten separat und freiwillig auswählen.",
      finalCta: "Auf die Warteliste",
      finalNote: "Der Wartelisteneintrag ist keine Assessment Buchung.",
    },
  },
  coach: {
    en: {
      role: "Coach",
      eyebrow: "For coaches, physios, and performance teams",
      headline: "WE MAKE MOVEMENT MEASURABLE. YOU DECIDE WHAT MATTERS.",
      intro:
        "VANE makes movement quality measurable through one standardized assessment. You connect the results with the athlete, the sport, and your training plan.",
      primaryCta: "Join the waitlist",
      availabilityNote: "MQS access for coaches and teams is still in development.",
      secondaryCta: "See how the assessment works",
      heroValueRail: [
        {
          title: "We interpret your results",
          detail: "VANE explains what deserves attention",
        },
        {
          title: "You decide what comes next",
          detail: "Apply the findings to your athlete and training plan",
        },
        {
          title: "Compare each retest",
          detail: "The same protocol makes changes easier to review",
        },
      ],
      benefitsEyebrow: "Beyond isolated tests",
      benefitsTitle: "All results in one movement profile",
      benefitsIntro:
        "Individual tests answer individual questions. VANE brings the results of a standardized assessment into one profile that athletes and staff can review together.",
      benefits: [
        {
          title: "Assess on the same basis",
          description:
            "Use the same protocol at baseline and retest.",
        },
        {
          title: "Get our interpretation",
          description:
            "VANE explains which results deserve attention and how they relate across the seven domains. You do not have to start with a table of numbers alone.",
        },
        {
          title: "Set the next training priorities",
          description:
            "Use our interpretation alongside your observations, the athlete's training history, and the demands of the sport. Your team decides what to change.",
        },
      ],
      processEyebrow: "Planned assessment process for coaches and teams",
      processTitle: "Assess. Interpret. Apply.",
      steps: [
        {
          title: "Assess",
          description:
            "Run the standardized assessment with one athlete or a group.",
        },
        {
          title: "Interpret",
          description:
            "Review VANE's interpretation together and discuss how it relates to the athlete and sport.",
        },
        {
          title: "Apply",
          description:
            "Decide what to change in training, using VANE's interpretation, your observations, and the current plan.",
        },
      ],
      outputEyebrow: "What your team receives",
      outputTitle: "The overall score never stands alone",
      outputIntro:
        "Every report keeps the profile across all seven domains visible. Athletes and staff work from the same information without reducing any athlete to a single number.",
      deliverables: [
        "Overall MQS with seven visible domain results",
        "VANE's interpretation of what deserves attention",
        "One shared report for athletes and staff",
        "Baseline and retest in direct comparison",
      ],
      decisionLabel: "The question your team answers",
      decisionText:
        "What deserves attention now, and how does it fit this athlete, this sport, and our plan?",
      scienceEyebrow: "Measurement with context",
      scienceTitle: "Your expertise stays essential",
      scienceText:
        "VANE interprets your assessment results and explains what deserves attention. Your team brings the athlete and sport context, decides what to do next, and puts it into practice. MQS supports those decisions. It does not provide a medical diagnosis.",
      sciencePoints: [
        "VANE interprets the assessment results",
        "Your team decides and applies the next steps",
        "Movement information, not a medical diagnosis",
      ],
      finalEyebrow: "MQS for coaches and teams",
      finalTitle: "Join the MQS waitlist.",
      finalText:
        "Want VANE's interpretation alongside your assessment results? MQS access for coaches and teams is still in development. Join the waitlist and we will contact you when access is available. Development updates are a separate, optional choice below.",
      finalCta: "Join the waitlist",
      finalNote:
        "Joining the waitlist does not give you access or start a trial.",
    },
    de: {
      role: "Coach",
      eyebrow: "Für Coaches, Physios und Performance Teams",
      headline: "WIR MACHEN BEWEGUNG MESSBAR. DU ENTSCHEIDEST, WAS ZÄHLT.",
      intro:
        "VANE macht Bewegungsqualität mit einem standardisierten Assessment messbar. Du verbindest die Ergebnisse mit dem Athleten, seiner Sportart und deinem Trainingsplan.",
      primaryCta: "Auf die Warteliste",
      availabilityNote: "Der MQS Zugang für Coaches und Teams ist noch in Entwicklung.",
      secondaryCta: "So läuft das Assessment ab",
      heroValueRail: [
        {
          title: "Wir ordnen die Ergebnisse ein",
          detail: "VANE erklärt, was Aufmerksamkeit verdient",
        },
        {
          title: "Du entscheidest, was folgt",
          detail: "Nutze die Ergebnisse für deinen Athleten und Trainingsplan",
        },
        {
          title: "Vergleiche jeden Retest",
          detail: "Dasselbe Protokoll hilft, Veränderungen zu beurteilen",
        },
      ],
      benefitsEyebrow: "Mehr als einzelne Tests",
      benefitsTitle: "Alle Ergebnisse in einem Bewegungs\u00ADprofil",
      benefitsIntro:
        "Einzelne Tests beantworten einzelne Fragen. VANE führt die Ergebnisse eines standardisierten Assessments in einem Profil zusammen, das der Athlet und das Team gemeinsam besprechen können.",
      benefits: [
        {
          title: "Auf derselben Grundlage erfassen",
          description:
            "Nutze bei Baseline und Retest dasselbe Protokoll.",
        },
        {
          title: "Unsere Einordnung nutzen",
          description:
            "VANE erklärt, welche Ergebnisse Aufmerksamkeit verdienen und wie sie über die sieben Domänen zusammenhängen. Du musst nicht bei einer Tabelle voller Zahlen anfangen.",
        },
        {
          title: "Die nächsten Trainingsprioritäten setzen",
          description:
            "Verbinde unsere Einordnung mit deinen Beobachtungen, der Trainingshistorie und den Anforderungen der Sportart. Dein Team entscheidet, was ihr verändert.",
        },
      ],
      processEyebrow: "Geplanter Ablauf für Coaches und Teams",
      processTitle: "Erfassen. Einordnen. Anwenden.",
      steps: [
        {
          title: "Erfassen",
          description:
            "Führe das standardisierte Assessment mit einem Athleten oder einer Gruppe durch.",
        },
        {
          title: "Einordnen",
          description:
            "Geht VANEs Interpretation gemeinsam durch und besprecht den Bezug zum Athleten und seiner Sportart.",
        },
        {
          title: "Anwenden",
          description:
            "Entscheide anhand von VANEs Interpretation, deinen Beobachtungen und dem aktuellen Plan, was du im Training anpasst.",
        },
      ],
      outputEyebrow: "Was dein Team erhält",
      outputTitle: "Der Gesamtscore steht nie allein",
      outputIntro:
        "Jeder Report zeigt die sieben Domänen hinter dem MQS. Der Athlet und das Team sprechen auf derselben Grundlage, ohne den Athleten auf eine Zahl zu reduzieren.",
      deliverables: [
        "Ein MQS mit sieben sichtbaren Domänenergebnissen",
        "VANEs Einordnung der Bereiche, die Aufmerksamkeit verdienen",
        "Ein gemeinsamer Report für Athlet und Team",
        "Baseline und Retest im direkten Vergleich",
      ],
      decisionLabel: "Die Frage für dein Team",
      decisionText:
        "Was verdient jetzt Aufmerksamkeit und wie passt es zu diesem Athleten, dieser Sportart und unserem Plan?",
      scienceEyebrow: "Messung mit Kontext",
      scienceTitle: "Deine Expertise bleibt entscheidend",
      scienceText:
        "VANE interpretiert die Ergebnisse und erklärt, was Aufmerksamkeit verdient. Dein Team kennt den Athleten und die Anforderungen seiner Sportart, entscheidet über die nächsten Schritte und setzt sie im Training um. MQS unterstützt diese Entscheidungen. Es stellt keine medizinische Diagnose.",
      sciencePoints: [
        "VANE interpretiert die Ergebnisse des Assessments",
        "Dein Team entscheidet und setzt die nächsten Schritte um",
        "Bewegungsinformationen, keine medizinische Diagnose",
      ],
      finalEyebrow: "MQS für Coaches und Teams",
      finalTitle: "Auf die MQS Warteliste.",
      finalText:
        "Du möchtest zu deinen Testergebnissen auch VANEs Einordnung? Der MQS Zugang für Coaches und Teams ist noch in Entwicklung. Trag dich ein. Wir melden uns, sobald der Zugang verfügbar ist. Neuigkeiten zur Entwicklung kannst du unten zusätzlich auswählen.",
      finalCta: "Auf die Warteliste",
      finalNote:
        "Der Wartelisteneintrag schaltet keinen Zugang frei und startet keine Testphase.",
    },
  },
  partner: {
    en: {
      role: "Partner",
      eyebrow: "For partners",
      headline: "ADD A MOVEMENT QUALITY STANDARD TO WHAT YOU ALREADY DO WELL.",
      intro:
        "VANE adds a standardized movement quality assessment and reporting layer to the services, programs, or products you already provide. We start with your existing setup and define a focused pilot around one clear use case.",
      primaryCta: "Join the waitlist",
      availabilityNote: "MQS access for partners is still in development.",
      secondaryCta: "Explore the partner model",
      heroValueRail: [
        {
          title: "Build on your existing offer",
          detail: "Explore where MQS can add value for your users",
        },
        {
          title: "Start with one practical test",
          detail: "Agree the scope and responsibilities together",
        },
        {
          title: "Decide what comes next",
          detail: "Review usefulness and practical fit before expanding",
        },
      ],
      benefitsEyebrow: "Why it matters",
      benefitsTitle: "How MQS fits your existing offer",
      benefitsIntro:
        "We start with what already works in your organization and test one clear use case in a focused pilot.",
      benefits: [
        {
          title: "Add one consistent assessment",
          description:
            "For example, a training facility could use the same movement assessment at the start of a program and at retest. We agree the fit with your team before testing it.",
        },
        {
          title: "Create one shared language",
          description:
            "Bring results and VANE's interpretation into one profile your team can discuss with its users. Agree who assesses, who explains, and who decides what follows.",
        },
        {
          title: "Decide what comes next",
          description:
            "Check whether the assessment answers your users' questions and fits the way your team works. Decide together what needs to change before wider use.",
        },
      ],
      processEyebrow: "How we plan to work together",
      processTitle: "Discover. Pilot. Learn.",
      steps: [
        {
          title: "Discover",
          description:
            "Together, we clarify who will use MQS, which questions it needs to answer, and what is already available on site.",
        },
        {
          title: "Pilot",
          description:
            "We agree on the scope, responsibilities, and success criteria for a limited practical test.",
        },
        {
          title: "Learn",
          description:
            "We review how useful the results are and what is still needed for wider use.",
        },
      ],
      outputEyebrow: "What the pilot delivers",
      outputTitle: "A model built around your context.",
      outputIntro:
        "The exact scope depends on the partner. The common foundation is a standardized assessment and reporting layer.",
      deliverables: [
        "Defined use case and pilot scope",
        "Assessment protocol and onboarding",
        "Reports designed for your users",
        "Review of results, limitations, and next steps",
      ],
      decisionLabel: "The decision it supports",
      decisionText:
        "Where can a shared movement quality standard create real value in our organization or product?",
      scienceEyebrow: "How we assess the evidence",
      scienceTitle: "Evidence before expansion.",
      scienceText:
        "We agree what a practical test needs to show, then review the results and data quality together. That gives both teams a basis for deciding whether to expand. Findings from a limited test are not proof of medical or performance outcomes.",
      sciencePoints: [
        "Agree what the assessment can and cannot show",
        "Data quality reviewed before scale",
        "Transparent responsibilities and limitations",
      ],
      finalEyebrow: "MQS for partners",
      finalTitle: "Join the MQS waitlist.",
      finalText:
        "Interested in bringing MQS into your facility, service, or product? MQS access for partners is still in development. Join the waitlist and we will contact you when access is available. Development updates are a separate, optional choice below.",
      finalCta: "Join the waitlist",
      finalNote:
        "Joining the waitlist does not give you access or start a trial.",
    },
    de: {
      role: "Partner",
      eyebrow: "Für Partner",
      headline: "ERGÄNZE DEIN ANGEBOT UM EINEN STANDARD FÜR BEWEGUNGS\u00ADQUALITÄT.",
      intro:
        "VANE ergänzt deine bestehenden Angebote, Programme oder Produkte um ein standardisiertes Assessment und Reporting für Bewegungsqualität. Wir beginnen mit deinem bestehenden Ablauf und definieren einen fokussierten Pilot für einen klaren Anwendungsfall.",
      primaryCta: "Auf die Warteliste",
      availabilityNote: "Der MQS Zugang für Partner ist noch in Entwicklung.",
      secondaryCta: "Partnermodell ansehen",
      heroValueRail: [
        {
          title: "Ergänze dein bestehendes Angebot",
          detail: "Prüfe, wo MQS deinen Nutzern weiterhilft",
        },
        {
          title: "Beginne mit einem Praxistest",
          detail: "Vereinbart Umfang und Zuständigkeiten gemeinsam",
        },
        {
          title: "Entscheide, was als Nächstes kommt",
          detail: "Prüft Nutzen und Aufwand vor einem breiteren Einsatz",
        },
      ],
      benefitsEyebrow: "Warum es zählt",
      benefitsTitle: "So ergänzt MQS dein bestehendes Angebot",
      benefitsIntro:
        "Wir beginnen mit dem, was in deiner Organisation bereits funktioniert, und prüfen einen konkreten Einsatz in einem begrenzten Praxistest.",
      benefits: [
        {
          title: "Ergänze ein einheitliches Assessment",
          description:
            "Ein Trainingszentrum könnte zum Beispiel zu Beginn eines Programms und beim Retest dasselbe Assessment nutzen. Vor dem Praxistest klären wir mit deinem Team, wie MQS dazu passt.",
        },
        {
          title: "Schaffe eine gemeinsame Sprache",
          description:
            "Ergebnisse und VANEs Einordnung bilden ein Profil, das dein Team mit seinen Nutzern besprechen kann. Wir klären, wer erfasst, wer erklärt und wer die nächsten Schritte bestimmt.",
        },
        {
          title: "Entscheide, was danach folgt",
          description:
            "Prüft, ob das Assessment die Fragen eurer Nutzer beantwortet und in eure tägliche Arbeit passt. Entscheidet gemeinsam, was sich vor einem breiteren Einsatz ändern muss.",
        },
      ],
      processEyebrow: "So ist die Zusammenarbeit geplant",
      processTitle: "Verstehen. Testen. Auswerten.",
      steps: [
        {
          title: "Bedarf klären",
          description:
            "Wir klären gemeinsam, wer MQS nutzen soll, welche Fragen es beantworten muss und was vor Ort bereits vorhanden ist.",
        },
        {
          title: "In der Praxis testen",
          description:
            "Wir vereinbaren Umfang, Zuständigkeiten und Erfolgskriterien für einen begrenzten Praxistest.",
        },
        {
          title: "Gemeinsam auswerten",
          description:
            "Wir prüfen, welchen Nutzen die Ergebnisse bringen und was für einen breiteren Einsatz noch nötig ist.",
        },
      ],
      outputEyebrow: "Was der Praxistest liefert",
      outputTitle: "Ein Modell rund um deinen Kontext.",
      outputIntro:
        "Den Umfang stimmen wir auf deinen Bedarf ab. Die gemeinsame Grundlage sind standardisierte Assessments und verständliche Berichte.",
      deliverables: [
        "Ein konkreter Einsatz und ein vereinbarter Testumfang",
        "Assessmentprotokoll und Einführung",
        "Berichte für deine Nutzer",
        "Prüfung von Ergebnissen, Grenzen und nächsten Schritten",
      ],
      decisionLabel: "Die Frage für deine Organisation",
      decisionText:
        "Hilft MQS unseren Nutzern weiter und passt es in unsere tägliche Arbeit?",
      scienceEyebrow: "So prüfen wir die Evidenz",
      scienceTitle: "Erst prüfen. Dann erweitern.",
      scienceText:
        "Wir vereinbaren, was der Praxistest zeigen soll, und prüfen Ergebnisse und Datenqualität gemeinsam. So können beide Teams entscheiden, ob ein breiterer Einsatz sinnvoll ist. Ein begrenzter Test ist kein Nachweis für medizinische Wirkungen oder Leistungssteigerungen.",
      sciencePoints: [
        "Klären, was das Assessment zeigen kann und was nicht",
        "Datenqualität vor einer Skalierung prüfen",
        "Verantwortlichkeiten und Grenzen transparent halten",
      ],
      finalEyebrow: "MQS für Partner",
      finalTitle: "Auf die MQS Warteliste.",
      finalText:
        "Du möchtest MQS in deiner Einrichtung, deinem Angebot oder deinem Produkt nutzen? Der MQS Zugang für Partner ist noch in Entwicklung. Trag dich ein. Wir melden uns, sobald der Zugang verfügbar ist. Neuigkeiten zur Entwicklung kannst du unten zusätzlich auswählen.",
      finalCta: "Auf die Warteliste",
      finalNote:
        "Der Wartelisteneintrag schaltet keinen Zugang frei und startet keine Testphase.",
    },
  },
};
