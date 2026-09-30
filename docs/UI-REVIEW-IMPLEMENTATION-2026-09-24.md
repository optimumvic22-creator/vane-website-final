# Umsetzung des UI Reviews

Stand: 24. September 2026. Grundlage: `UI-DESIGN-REVIEW-2026-09-24.md` und anschließende Freigabe.

## Bewahrt

- Bebas Neue, bestehende H1 Inhalte und Hero Einleitungen.
- Startseite mit Dreifächer, Lichtführung, Videoausschnitten und Rollenwahl.
- Domänenfarben, Reglerverhalten und MQS Berechnung.
- Assessment Anfrage für Athleten, Warteliste für Coaches und Partner.
- Gespeicherte Einwilligungsversionen, optionale Updates und Formularschutz.
- Keine neuen Paketabhängigkeiten, keine Veröffentlichung oder Git Änderungen an Branches.

## Umgesetzt

### Bedienung

- Das mobile Menü ist auf die verfügbare Viewporthöhe begrenzt und bei Bedarf scrollbar.
- Escape schließt das Menü und setzt den Fokus auf den Menüknopf zurück.
- Beim Wechsel auf das Desktoplayout schließt der mobile Menüzustand.
- Social Links im Footer besitzen 44 × 44 Pixel Bedienflächen. Textlinks erhalten mobil 40 Pixel Mindesthöhe und sichtbaren Tastaturfokus.
- Die Investorenseite führt im Header und bereits im Einstieg zum Briefing statt zurück zur Zielgruppenwahl.

### Layout und Typografie

- Die Hero Nutzenleisten stehen bei 1024 bis 1279 Pixel untereinander. Ab 1280 Pixel bilden sie drei Spalten. Unter 768 Pixel entfallen sie nun auf allen drei Zielgruppenseiten.
- Die Partner Benefits nutzen ein begrenztes Raster: 360 Pixel Medienbreite, 48 Pixel Abstand und eine anschließende Textspalte. Der zuvor lose Abstand von etwa 137 Pixel entfällt.
- Benefits Überschriften erhalten ausgewogene Zeilenumbrüche, ohne andere Worttrennungsregeln einzuführen.
- Prozessüberschriften besitzen eine explizite Zeilenhöhe von 1,1.
- Das Teamfoto verwendet im Tabletformat 16:9 und erhält seinen bisherigen Fokus. Qualifikationen sind eine lesbare vertikale Liste statt kleiner umbruchanfälliger Labels. Die Biografie bekommt eine Absatzpause.
- Gemeinsame Vorzeilen und Investor Labels verwenden Instrument Sans mit kontrollierter Laufweite. Investor H2 bleiben eine redaktionelle Größenstufe mit 32 Pixel mobil und 44 Pixel ab Tablet.
- Relevante Investorentexte verlieren die kontrastschwache zusätzliche Transparenz.
- Datumszeilen der rechtlichen Seiten bleiben auch auf Desktop 14 Pixel groß. Abschnittstitel haben eine klare Zeilenhöhe. Die bestehende Datenschutzpassage wird nach vorhandenen Zweckbezeichnungen gegliedert, ohne rechtlichen Wortlaut neu zu schreiben.
- Zwei Hintergrundraster erhalten eine gemeinsame korrekte Größenangabe statt drei widersprüchlicher Werte.

### Medien und Zustände

- Wiedergabeerlaubnis und Quellenverfügbarkeit sind getrennt. Beim Pausieren bleibt ein bereits geladenes Motiv erhalten. Außerhalb des sichtbaren Bereichs, im Hintergrundtab und im Datensparmodus wird die Quelle wieder freigegeben.
- Sieben passende JPEG Standbilder wurden aus den vorhandenen Domänenvideos extrahiert, insgesamt rund 155 KB. Keine neuen Bildmotive oder Stock Assets.
- MQS zeigt auch ohne laufendes Video ein Motiv. Beim Domänenwechsel überbrückt ein passendes Standbild das Laden.
- Der Gesamtregler ist mit „MQS anpassen“ beziehungsweise „Adjust MQS“ beschriftet. Berechnung, Wertebereich und Domäneninteraktion bleiben unverändert.
- Anfragefelder bleiben während des Sendens lesbar, aber nicht editierbar. Eine synchrone Sperre verhindert Doppelsendungen.
- Ein Analyticsfehler nach erfolgreicher Anfrage erzeugt keinen irreführenden Versandfehler.
- Formulare zeigen ein deutliches Erfolgsfeedback. Fehler stehen direkt unter dem Button mit einem nutzbaren Kontaktlink. Buttonbreiten bleiben beim Statuswechsel stabiler.

### Text und Produktlogik

- „workflow“ wurde in der Coach Vorzeile durch „assessment process“ ersetzt.
- Der Athletenablauf nennt Wien bereits beim bestehenden ersten Schritt. Die zuvor entfernte Zeile unter dem Hero CTA wurde nicht wieder eingeführt.
- Athleten Ergebnispunkte formulieren den praktischen Nutzen, ohne garantierte Leistungssteigerung oder unbestätigte Referenzgruppen zu behaupten.
- Die deutsche Athleten Benefits Überschrift lautet „Mehr Überblick. Klarere Prioritäten.“
- Die Partner Benefits beantworten „So ergänzt MQS dein bestehendes Angebot“ statt die H1 zu wiederholen.
- „Reporting Ebene“ wurde an der Ergebnisstelle durch verständliche Assessments und Berichte ersetzt.
- Der Footer beschreibt in beiden Sprachen den Bezug zu Wien. „Einordnung und Grenzen“ sowie „Partner Warteliste“ benennen die tatsächlichen Linkziele.
- Investor Reports unterstützen Entscheidungen, sie treffen sie nicht. Ein Retest zeigt Veränderungen, beweist aber für sich keine Trainingswirkung.
- Verfügbares Angebot, Entwicklung und langfristige Perspektive sind getrennt. Roadmapmengen sind als Planungsziele gekennzeichnet, nicht als erreichte Traktion.
- Der nicht angekündigte CTO Platzhalter wird analog zur Teamseite ausgeblendet.

## Geänderte Dateien

- `components/layout/SiteHeader.tsx`
- `components/layout/SiteFooter.tsx`
- `app/investors/investors-content.tsx`
- `app/for/[audience]/audience-landing.tsx`
- `app/team/team-content.tsx`
- `app/privacy/privacy-content.tsx`
- `app/terms/terms-content.tsx`
- `components/ui/typography.tsx`
- `components/ui/mqs-dashboard.tsx`
- `components/ui/ambient-video.tsx`
- `components/ui/audience-video-playlist.tsx`
- `components/ui/audience-inquiry-form.tsx`
- `components/ui/audience-waitlist-form.tsx`
- `lib/use-media-playback.ts`
- `lib/audience-content.ts`
- `lib/use-media-playback.test.ts`
- `lib/audience-content.test.ts`
- `components/ui/audience-inquiry-form.test.ts` (neu)
- `scripts/extract-domain-posters.ps1` (neu, reproduzierbare Windows Thumbnail Extraktion)
- Sieben `*-poster.jpg` in `public/media/mqs-domains/`
- Dieses Umsetzungsprotokoll

## Prüfung

- Gesamter Testlauf: 266 Tests bestanden.
- Fokussierter Lauf nach der letzten Nachschärfung: 31 Tests bestanden.
- ESLint und TypeScript: bestanden.
- Produktionsbuild: bestanden. Das bekannte Sanity Fallback wird verwendet, falls Teamdaten nicht erreichbar sind.
- `git diff --check`: bestanden.
- Lokaler Smoke Test: 11 Routen, neun H1/Header/Sitemap Prüfungen, unbekannte Zielgruppe mit 404, sechs nicht schreibende API Prüfungen und gesperrter Versand ohne Authentifizierung bestanden.
- Browser: Deutsche Unterseiten bei 320 Pixel auf Überlauf geprüft; ergänzende Sichtprüfungen bei 390, 768, 1024, 1152 und 1440 Pixel sowie Menütest bei 844 × 390.
- Pause im MQS hält den geladenen Frame mit vorhandener Quelle. Escape schließt das Menü und setzt den Fokus korrekt zurück.
- Der MQS Gesamtregler erreicht 99. Einzelne Domänen bleiben separat bedienbar und wechseln zum passenden Video beziehungsweise Standbild.
- Keine echten Anfragen, Wartelisteneinträge oder E Mails als Teil der Prüfung versendet.

## Bewusst nicht erfunden oder ungefragt verändert

- Firmendaten hinter den Impressum Platzhaltern müssen vom Verantwortlichen ergänzt werden.
- Konkreter Bezugszeitpunkt der Investorenroadmap, bestätigte Traktion und öffentliche Freigabe der NormVault Aussagen bleiben fachlich zu bestätigen.
- Die gesperrte Team H1 im Plural bleibt bestehen, obwohl aktuell eine Person öffentlich gezeigt wird.
- Ein globaler Typografieumbau, weitere Effekte oder zusätzliche Startseitenmotive wurden nicht eingeführt.
- Eine vollständige Geräte-, Browser- oder WCAG Zertifizierung ist mit den visuellen Stichproben nicht verbunden.
