# Umsetzung des Agenturreviews

Stand: 24. September 2026. Grundlage: [Agenturreview](AGENCY-REVIEW-2026-09-24.md).

## Umgesetzt

| Bereich | Änderung | Begründung |
| --- | --- | --- |
| Teamdaten | Höchstens fünf Sekunden Wartezeit, danach vorhandene Ersatzdarstellung; explizite stündliche Aktualisierung | Eine CMS Störung blockiert die Seite nicht über mehrere Minuten |
| Fehlerseite | Wiederholen lädt die Serverdaten neu; deutsche und englische Fehlermeldung | Eine Wiederholung muss die Ursache tatsächlich erneut prüfen |
| Unbekannte Zielgruppe | Echte HTTP 404 Antwort vor Beginn der gestreamten Darstellung | Eine Fehleransicht darf nicht als erfolgreiche Zielgruppenseite ausgeliefert werden |
| Formulare | Lokale, feldbezogene Validierung einschließlich Leerzeichen; Fokus auf ungültiges Feld | Verständliche Rückmeldung ohne unnötige Anfrage und ohne Verlust der Eingaben |
| Dialoge | Sprachdialog vor Cookieauswahl; Hintergrund während des Sprachdialogs nicht bedienbar | Eine klare Aufgabe zur Zeit statt konkurrierender Dialoge |
| Sprache | EN und DE als native Auswahlbuttons; gültige Sprachauswahl bereits beim Serverrendering | Korrekte Bediensemantik und kein anfänglicher Wechsel von Englisch zu Deutsch |
| Bewegung | Gemeinsame Pausensteuerung in den Kopfzeilen; Wahl bleibt während der Sitzung erhalten | Automatische Bewegung bleibt kontrollierbar, auch beim Seitenwechsel |
| Laptop Layout | Kompaktere Hero Typografie und Abstände auf kurzen oder mittleren Desktopansichten | CTA und MQS erhalten mehr nutzbaren Platz, ohne den Wortlaut zu ändern |
| MQS | Größere Beschriftungen und Reglergriffe, sichtbarer Tastaturfokus, Spalten nach tatsächlicher Fensterbreite | Lesbarkeit und Bedienbarkeit statt zusätzlicher Dekoration |
| Partner Medien | Begrenzte mobile Videohöhe und vollständigeres Bild durch eingepasste Darstellung | Bewegung bleibt sichtbar, ohne die Nutzenargumente unverhältnismäßig weit nach unten zu schieben |
| Kommunikation | Öffentlich ausschließlich MQS; klare Trennung zwischen Athletenassessment und zukünftigem Zugang | Der Produktstatus bleibt verständlich und widerspruchsfrei |
| Arbeitsteilung | VANE interpretiert; Coaches entscheiden und setzen in der Praxis um | Die Expertise von VANE unterstützt das Team, ersetzt dessen Entscheidungen aber nicht |
| Deutsche Partnersprache | „Verstehen. Testen. Auswerten.“ und „In der Praxis testen“ | Natürlichere Sprache mit derselben sachlichen Bedeutung |

## Grenzen der Änderung

- H1 Wortlaut, Hero Subtexte und grundlegende Seitenstruktur bleiben erhalten.
- MQS Berechnungen und Beziehungen zwischen den Domänen bleiben unverändert.
- Es wurden keine Abhängigkeiten hinzugefügt oder aktualisiert.
- Hosting, Mailanbieter, Versand, Produktionszugänge und externe Abnahmen wurden nicht eingerichtet.
- Der interne Produktschlüssel bleibt aus Kompatibilitätsgründen `mqs-vault`. Er ist keine öffentliche Produktbezeichnung.
- Neue optionale Updateeinwilligungen verwenden `mqs-updates-v2`. Bereits gespeicherte Einwilligungsnachweise werden nicht verändert.

## Architekturhinweise für die Übergabe

Die öffentliche HTML Ausgabe berücksichtigt einen validierten Sprachparameter oder das funktionale Sprachcookie. Dadurch wird sie anfragebezogen gerendert. Die Teamdaten bleiben davon unabhängig eine Stunde zwischengespeichert. API, Studio und statische Medien sind von der Sprachweiterleitung ausgenommen; eingehende interne Sprachheader werden überschrieben.

Die Bewegungspause ist eine Sitzungseinstellung. Sie ergänzt Betriebssystempräferenzen, Sichtbarkeitsprüfung und Datensparmodus, hebt diese Schutzmaßnahmen aber nicht auf. Beim Pausieren kann ein Video auf sein Standbild wechseln; die Funktion ist keine bildgenaue Transportsteuerung.

## Abschließende Prüfung

- 252 Tests in 21 Dateien erfolgreich.
- Vollständiger ESLint Lauf erfolgreich; nach der letzten Korrektur zusätzlich gezieltes ESLint für Proxy und Fehlerseite.
- Produktionsbuild einschließlich TypeScript erfolgreich auf Node 22 und Next 16.3.4.
- Produktions Smoke Test erfolgreich: elf Routen, neun Einzel H1 und Headerprüfungen, Sitemap, unbekannte Zielgruppe mit HTTP 404, sechs nicht schreibende API Prüfungen, nicht autorisierter Versandauftrag abgewiesen.
- `git diff --check` erfolgreich.
- Browserprüfung im eingebauten Chromium Browser bei 320, 390, 768, 1024, 1366 und 1440 Pixeln, verteilt auf Startseite und alle drei Zielgruppen. Deutsch und Englisch geprüft. In den geprüften Ansichten keine horizontale Seitenausdehnung und genau eine H1.
- Partner bei 1366 × 768: beide Hero Buttons vollständig sichtbar; Oberkante 648 Pixel, Unterkante 696 Pixel. Vorher lag die Unterkante bei etwa 781 Pixeln.
- Mobile MQS Domänensteuerung einspaltig; Tastatureingabe erhöht den Kraftwert von 62 auf 63; Eingabehöhe weiterhin 44 Pixel. Diagrammkürzel bei 390 Pixeln jetzt 10 Pixel groß.
- Mobile Partnersequenz bei 390 Pixeln: Bildhöhe 440 Pixel und `object-fit: contain`.
- Bewegungspause stoppt die Medien, bleibt beim Wechsel von Partner zu Athlete zu Coach erhalten und lässt sich wieder aufheben.
- Ungültige Sporteingabe erzeugt eine konkrete Meldung und fokussiert das Sportfeld, ohne eine Anfrage zu versenden. Mobiles Menü und EN / DE Auswahl bedienbar.
- Startseitenkopf bei 320 Pixeln: Logo, Pause und beide Sprachtasten passen ohne Überlappung; alle Steuerungen haben 44 Pixel Höhe.

Die CMS Abfrage war in dieser lokalen Umgebung nicht erfolgreich. Die Seite hat die vorgesehene Ersatzdarstellung genutzt, und Build sowie Routentest sind trotzdem erfolgreich. Das ist ein bestandener Ausfalltest, keine Bestätigung des späteren CMS Zugangs.

Vite weist auf eine mögliche Konfigurationsänderung in einer zukünftigen Hauptversion hin. Dieser Hinweis ist nicht blockierend; die Konfiguration wurde für diese Produktkorrekturen nicht umgebaut.

Eine lokale Abnahme ersetzt weder die Prüfung auf echten Safari und iOS Geräten noch einen Test der externen Speicherung und Zustellung im späteren Produktionssystem. Es wurden keine echten Interessentendaten geschrieben oder Nachrichten verschickt. Keine Veröffentlichung und kein Git Push durchgeführt.

## Geänderte Quellbereiche

- Teamabfrage: `app/team/page.tsx`, `app/team/team-data.ts`, zugehöriger Test.
- Fehlerbehandlung: `app/error.tsx`, zugehöriger Test.
- Sprache: `proxy.ts`, `proxy.test.ts`, `app/layout.tsx`, `lib/locale.tsx`, `components/layout/SiteChrome.tsx`, `LanguageGate.tsx`, `LanguageToggle.tsx`, `site-chrome.test.ts`.
- Bewegung: `lib/motion-preference.ts`, `lib/use-media-playback.ts`, zugehörige Tests, `components/ui/motion-toggle.tsx`, `components/layout/SiteHeader.tsx`, `AudienceEntry.tsx`.
- Formulare und Kommunikation: `components/ui/audience-inquiry-form.tsx`, `audience-waitlist-form.tsx`, `lib/inquiry-field-validation.ts`, `lib/audience-content.ts`, `lib/waitlist-consent.ts`, zugehörige Tests, `app/api/waitlist/route.test.ts`, `app/privacy/privacy-content.tsx`, `.agents/product-marketing.md`.
- Layout: `app/for/[audience]/audience-landing.tsx`, `components/ui/mqs-dashboard.tsx`, `components/ui/audience-video-playlist.tsx`, `app/globals.css`.

Die bereits vor diesem Auftrag vorhandenen Änderungen im Arbeitsverzeichnis bleiben unangetastet. Der vollständige Git Diff enthält deshalb mehr als diesen Umsetzungsschritt.
