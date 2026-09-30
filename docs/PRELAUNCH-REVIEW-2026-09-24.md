# VANE Launch Review und Freigabeprozess

Stand: 24. September 2026. Umfang: öffentliche Website, Assessmentanfrage,
MQS Vault Wartelisten, Datenschutzgrenzen und technische Übergabe.

## Entscheidung

**Aktuell NO GO für einen öffentlichen Launch mit funktionierenden Formularen.**
Die lokale Codequalität ist nicht gleichbedeutend mit einer funktionierenden
Produktionsanbindung. Fehlende Sanity Konfiguration, Versand und rechtliche
Freigaben sind echte Blocker, keine kosmetischen Restpunkte.

H1, Hero Texte, Markenfarben und Seitenstruktur bleiben in diesem Durchlauf
unverändert. Keine neuen Features, Abhängigkeiten oder Designexperimente kurz
vor dem Launch. Bestehende Änderungen im Arbeitsverzeichnis bleiben erhalten.

## Ablauf in sieben verbindlichen Gates

| Gate | Prüfung und Vorgehen | Freigabekriterium | Verantwortlich |
| --- | --- | --- | --- |
| 1. Release fixieren | Vollständigen Diff prüfen, gewünschten Stand committen, sauberen Checkout mit Lockfile und Node 22 verwenden. Preview und Production getrennt konfigurieren. | Eindeutiger Commit, keine unbekannten Änderungen oder Secrets im Commit. | Entwicklung |
| 2. Startfähigkeit | `npm run launch:check`; echte Konfiguration, keine Platzhalter, getrennte serverseitige Secrets, vollständiges Impressum. | Keine automatischen Blocker; manuelle Abnahmen weiterhin erforderlich. | Entwicklung und Geschäftsführung |
| 3. Technische Integrität | Einmal gebündelt Lint, TypeScript, Tests, Produktionsbuild und Audit. Nicht nach jeder Textänderung erneut bauen. | Alle Befehle erfolgreich; keine offenen kritischen oder hohen Auditbefunde. | Entwicklung |
| 4. Echte Nutzerwege | Athlete Anfrage, Coach und Partner Warteliste mit und ohne freiwillige Updates. EN und DE, Tastatur, schmale Displays, Fehler und erneuter Versuch. | Richtiger Datensatz und Empfänger; keine Doppelanlage, falsche Buchung oder ungewollte Anmeldung. | Entwicklung und fachlicher Owner |
| 5. Datenschutz und Betrieb | Anonyme Lead Sichtbarkeit, Rollen und Token, Providerbestätigung, Abmeldung, Retry und Ausfälle, Missbrauchsschutz. | Keine anonym lesbaren Leads; nachvollziehbare Einwilligung; Ausfälle sichtbar und zuständigem Owner zugewiesen. | Entwicklung und Datenschutzverantwortliche |
| 6. Produktionsähnliche Abnahme | HTTPS Preview des Release Commits: Smoke, Browsermatrix, echte Mobilgeräte, Medien auf langsamer Verbindung, Studio und externe Links. | Keine blockierte Kernaktion, abgeschnittene Rolle, defekte Datei oder ungeklärte Rechtsangabe. | Entwicklung, Inhalt und Geschäftsführung |
| 7. Veröffentlichung und Rückweg | Exakt freigegebenen Commit veröffentlichen, kritische Checks auf echter Domain wiederholen, Rücksetzung proben. | Monitoring und Reaktionsperson benannt; vorheriger Release oder kontrollierte Wartungsseite wiederherstellbar. | Deployment Owner |

## Ausführbare Checks

`npm run launch:check` ist ein schneller, rein lokaler Konfigurationscheck.
Er lädt `.env.local`, falls vorhanden, gibt niemals deren Werte aus und sendet
keine Daten. Fehlende Voraussetzungen liefern Exitcode 1. Auch ein bestandener
Check meldet ausdrücklich `MANUAL_ACCEPTANCE_REQUIRED`, niemals automatisch GO.
Im Hosting müssen dieselben Prüfungen mit den tatsächlichen Deploymentwerten
laufen; eine lokale Datei ist kein Beweis für die Hostingkonfiguration.

```bash
npm ci
npm run launch:check
npm run check
npm test
npm run build
npm audit --omit=dev --audit-level=high
npm run start
# In einem zweiten Terminal:
npm run smoke -- http://127.0.0.1:3000
```

`npm run launch:privacy` liest ausschließlich aggregierte Leadzahlen mit und
ohne Authentifizierung aus dem konfigurierten Sanity Dataset. Erst ausführen,
nachdem Ziel und Berechtigung bestätigt sind. Keine Kontaktinhalte, keine
Migration und keine Löschung. Der Check ersetzt keine Prüfung der Tokenrechte.

Die laufende lokale Produktionsvorschau ist für gezielte Sichtprüfungen nutzbar.
Nach Änderungen am Anwendungscode erfolgt genau ein gebündelter neuer Build.
Dokumentationsänderungen lösen keinen weiteren Build aus.

## Verbindliche Testfälle

- Athlete: Sport und E Mail erforderlich, Nachricht optional. Nach Erfolg
  tatsächlich in Sanity und beim Team angekommen. Keine automatische Buchung
  und kein Newsletter. Keine Gesundheitsdaten für Tests verwenden.
- Coach/Partner: E Mail genügt. Updates standardmäßig aus. Beide Rollen bleiben
  getrennt. Wiederholte Anmeldung derselben Rolle bleibt sicher.
- Updates: Bestätigungslink, abgelaufener Link, Abmeldung, erneute Anmeldung und
  unterdrückte Adresse mit dem echten Provider prüfen. Ein Formularhäkchen ist
  noch keine bestätigte Anmeldung. Erneute Bestätigung wird providerseitig gelöst.
- Fehler: Leere/ungültige Eingabe, Doppelklick, Timeout, 429, Speicherfehler und
  Providerfehler. Eingaben bleiben erhalten; keine falsche Erfolgsmeldung.
- Bedienung: sichtbarer Tastaturfokus, verständliche Labels, Menü schließen,
  Sprachwechsel, Browser zurück, Sprunglinks, Cookie Einstellungen und Widerruf
  in einem zweiten Tab.
- Viewports: 320 × 667, 390 × 844, 768 × 1024, 844 × 390, 1440 × 900.
  Kernwege in beiden Sprachen. Zusätzlich echtes iOS Safari und Android Chrome,
  Desktop Chrome/Firefox/Safari. Browseremulation ersetzt keine echten Geräte.
- Medien: Poster sichtbar, Hoverstart ohne Blockade der Navigation, nur relevante
  Videos aktiv, Tabwechsel und reduzierte Bewegung respektiert, fehlende Datei
  führt nicht zu endlosen Ladeversuchen. Mobile Datenmenge im Preview messen.
- Suchmaschinen und Teilen: Titel, Beschreibung, kanonische URLs, Sitemap,
  robots, Vorschaubild. Preview darf nicht als echte Produktionsseite indexiert
  werden. Sprachspezifische Suchmaschinenoptimierung bleibt separat zu bewerten.

## Festgestellte Blocker und Entscheidungen

| Befund | Konsequenz | Nächster konkreter Schritt |
| --- | --- | --- |
| Aktuell Platzhalterprojekt und kein Sanity Schreibzugang | Formulare können nicht live speichern | Separate echte Preview/Production Werte und begrenzte Token einrichten, End to End prüfen |
| Kein Mailbridge Empfänger, keine Secrets, kein Scheduler | Gespeicherte Anfragen erreichen noch keinen verifizierten Empfänger | Provider auswählen, Vertrag anbinden, DOI und Benachrichtigung mit Testadresse abnehmen |
| Impressum enthält `Wird ergänzt.` sowie deutsche Rechtsverweise | Keine inhaltliche/rechtliche Launchfreigabe | Verifizierte Firmendaten liefern und österreichischen Kontext fachlich prüfen lassen |
| Kein nachgewiesener produktiver Missbrauchsschutz | Öffentliche Formulare wären unzureichend gegen massenhafte Einsendungen abgesichert | Hosting wählen, vorhandene Rate Limit Schnittstelle oder Edge Schutz verbinden und 429 testen |
| Kein Nachweis realer Dataset Privatsphäre | Öffentliche Lead Sichtbarkeit nicht ausgeschlossen | Aggregatcheck und Rollenprüfung vor der ersten echten Einsendung |
| GitHub Anmeldung, Remote CI, Hosting und Rücksetzprobe ausständig | Lokaler Erfolg ist kein freigegebener Release | Release Commit, Preview Pipeline, Verantwortliche und Rollback abnehmen |

Die acht automatischen Fehlprüfungen sind Teilaspekte dieser Blocker, nicht acht
zusätzliche unabhängige Produktfehler. Keine Firmendaten oder Dienste wurden
erfunden und keine externen Konten angelegt.

Zum Impressum: Die derzeitigen Verweise werden nicht ungeprüft durch andere
Paragraphen ersetzt. Der verantwortliche Owner muss die passende österreichische
Fassung bestätigen. Grundlage für die Abnahme:
[WKO Informationen für GmbH Websites](https://www.wko.at/internetrecht/website-impressum-gmbh).

## Fehlerpriorität und Stopregel

Launchblocker sind verlorene oder falsch adressierte Anfragen, ungewollte
Marketinganmeldung, offengelegte Daten, nicht erreichbare Kernaktionen,
verdeckte Zielgruppenauswahl und fehlende Pflichtangaben. Kein Launch mit einem
solchen offenen Befund. Jede Korrektur erhält Reproduktion, Ursache, minimalen
Patch und Regressionstest oder messbare Sichtprüfung.

Feine Abstände, neue Animationen, zusätzliche Copyvarianten und optionale
Optimierungen werden nachgelagert. Ein späterer Fund hebt eine frühere Freigabe
auf, wenn er denselben Release betrifft.

## Ergebnis des durchgeführten lokalen Reviews

Behoben, nicht nur empfohlen:

1. **Verdeckte Athlete Auswahl bei 320 Pixeln:** Der alte vertikale Abstand
   orientierte sich an der Bildschirmhöhe statt am sichtbaren Dreiecksraum.
   Der mobile Mittelpunkt erhält jetzt eine Mindestposition von 240 Pixeln
   innerhalb des Bildbereichs, der Text einen breitenabhängigen Abstand.
   Beschriftung und Subtext bleiben vollständig im sichtbaren Segment.
2. **Begrüßung am Logo bei 390 Pixeln:** Die mobile Introzone reserviert mindestens
   320 Pixel. Gemessener Abstand zwischen Headerunterkante und Vorzeile: rund
   12 Pixel bei 390, rund 46 Pixel bei 320. Desktopwerte bleiben erhalten.
   H1 und alle vorhandenen Texte wurden nicht geändert.
3. **Analysewiderruf in zweitem Tab:** Storage Ereignisse deaktivieren den bereits
   geladenen Tracker. Entfernte Einwilligung öffnet die Abfrage erneut. Eine
   Freigabe aus einem anderen Tab startet nicht ungefragt neues Tracking.
   Neun zusätzliche Regressionfälle sichern dieses Verhalten ab.

| Prüfung | Ergebnis und Grenze |
| --- | --- |
| Automatischer Konfigurationscheck | Ausgeführt: `BLOCKED`, acht fehlgeschlagene Teilprüfungen zu Sanity, Versand und Impressum. Keine Secrets ausgegeben. |
| Tests | 161 Tests in 14 Dateien bestanden, darunter zwölf Tests für den neuen Launchcheck. |
| Lint und TypeScript | Vollständiges ESLint bestanden; TypeScript im finalen Build bestanden; letzte CSS Änderung erneut gezielt gelintet. |
| Produktionsbuild | Bestanden. Erwarteter Team Fallback wegen Platzhalter Sanity Projekt; kein Beleg für eine echte CMS Verbindung. |
| Produktionssmoke | Elf Routen, neun H1/Header/Sitemap Checks, 404, sechs nicht schreibende API Prüfungen und verweigerter unauthentifizierter Versand bestanden. |
| Browser | Startseite bei 320, 390, 768, 844 und 1440 Pixeln geprüft; die korrigierten 320/390 Ansichten nach finalem Build nochmals visuell vermessen. Kein horizontaler Überlauf in diesen Checks. |
| Cookie Synchronisierung | Echter Test mit zwei lokalen Tabs: geöffnete Einstellungen in Tab A reagierten auf Ablehnung in Tab B. GA ist lokal nicht konfiguriert; das Abschalten eines geladenen Trackers ist zusätzlich isoliert getestet. |
| Formulare | Vorherige EN/DE Desktop/Mobilprüfung weiterhin gültig, Formcode unverändert. Echte Speicherung und Versand benötigen weiterhin Preview Zugangsdaten. |
| Unabhängiges API Review | Kein weiterer bestätigter Blocker in Authentifizierung, privaten IDs, CAS, Retry, Nullwertbehandlung und Consent Übergaben gefunden. |
| Dependencies | Lockfile unverändert gegenüber dem unmittelbar vorherigen vollständigen und produktiven Audit mit null Befunden; kein redundanter Installationslauf. |
| Repository | `git diff --check` bestanden. Unter den geprüften getrackten Umgebungs/Schlüsseldateien nur `.env.example`; dies ist kein vollständiger Scan der Git Historie. |

Geänderte Dateien dieses Durchlaufs: `components/layout/AudienceEntry.tsx`,
`components/layout/CookieBanner.tsx`, `lib/analytics.ts`, `lib/analytics.test.ts`,
`scripts/check-launch-readiness.mjs`, `lib/launch-readiness.test.ts`,
`package.json`, dieses Protokoll und `docs/TECHNICAL-HANDOFF.md`.
Keine neue Abhängigkeit, keine Änderung von Routen, H1 Texten oder Scoringregeln.
Keine Veröffentlichung, kein Versand und keine Änderung echter Lead Datensätze.

## Betrieb unmittelbar nach Veröffentlichung

Vor Veröffentlichung einen technischen und einen fachlichen Ansprechpartner
benennen. In der ersten Stunde kritische Seiten und je einen kontrollierten
Kontaktweg prüfen. Nach 24 Stunden Fehlerquote, wartende/fehlgeschlagene
Versandevents und reale Anfragen abgleichen, ohne personenbezogene Inhalte in
Analytics oder Logs zu kopieren. Dies ist ein Betriebsplan, kein bereits
eingerichteter Monitoringdienst oder Zeitplan.

Bei Datenoffenlegung oder ausgefallenen Formularen Kampagnenzufluss stoppen und
nach dem bestätigten Hostingverfahren zurücksetzen. Leads niemals als Teil eines
Code Rollbacks löschen oder den Seed ausführen.

Weitere Vertragsdetails: [Kontakt und MQS Vault](MQS-VAULT-LAUNCH-AND-CONTACT.md),
[technische Übergabe](TECHNICAL-HANDOFF.md),
[Dependencyprüfung](SANITY-MIGRATION-2026-09-24.md).
