# VANE: technischer und visueller Agenturreview

Stand: 24. September 2026. Prüfung der lokalen Produktionsfassung unter `http://127.0.0.1:3000`.

## 1. Entscheidung in einem Satz

Die Grundgestaltung trägt die Marke. Vor weiteren optischen Effekten sollten wir die technische Fehlerbehandlung, die Verständlichkeit des Angebots und die Lesbarkeit der vorhandenen Interaktion verbessern.

Kein Neubau, kein neues Designsystem, keine neuen Abhängigkeiten. H1 Texte und deren Subtexte bleiben unangetastet. Hosting und Maildienst sind ausdrücklich nicht Bestandteil dieses Reviews.

Dieser Bericht enthält Vorschläge, keine bereits umgesetzten Änderungen an der Website. Die zusätzlichen Vorgaben des Auftraggebers sind aufgenommen: öffentlich nur **MQS**, nicht **MQS Vault**; im Deutschen nicht **Pilotieren**.

## 2. Prüfverfahren und Evidenz

Vier Perspektiven wurden zusammengeführt:

1. Technische Architektur: unabhängiger Agent, Quellcode und gezielte Laufzeitdiagnose der installierten Bibliotheken.
2. UX, Formulare und Angebotslogik: unabhängiger Agent, aktuelle EN und DE Inhalte, Formularzustände und Zugänglichkeit.
3. Art Direction: unabhängiger Agent, Komponenten und vom Hauptreview gemessene Browserbefunde.
4. Redaktionelle Zusammenführung: Hauptagent mit tatsächlichen Screenshots und DOM Messungen der laufenden Website.

Die Agenten haben nicht jeweils eine eigene vollständige Browserprüfung durchgeführt. Die visuelle Verifikation lag zentral beim Hauptreview. So wurden doppelte Arbeit und konkurrierende Browseraktionen vermieden.

### Aktuell erneut geprüft

- Smoke Test: **11 Routen**, **9 H1/Header/Sitemap Prüfungen**, korrekte 404 für unbekannte Zielgruppe, **6 nicht schreibende API Prüfungen**, nicht autorisierter Zugriff auf die Zustellfunktion abgewiesen.
- `git diff --check`: keine Whitespace Fehler. Git meldet lediglich bestehende Hinweise zur Normalisierung von Zeilenenden.
- Sichtprüfungen und Messungen: Startseite bei 320 × 667 und 1440 × 900, Coach Desktop bei 1440 × 900, Partner Laptop bei 1366 × 768 und mobil bei 390 × 844, Athlete mobil bei 390 × 844.
- Englische und deutsche Inhalte gelesen; deutsche Hydration, mobile Navigation und MQS Tastaturbedienung stichprobenartig geprüft.
- Kein horizontaler Seitenüberlauf in den aktuell gemessenen Ansichten.
- MQS Domänenregler reagiert auf Pfeiltaste: Kraft von 62 auf 63. Die mathematische bzw. wissenschaftliche Validierung der Engine wurde dadurch nicht erneut durchgeführt.
- 37 untersuchte konkrete Medienreferenzen sind lokal vorhanden; keine dieser Referenzen verwendet MOV als ausgeliefertes Format.

### Vorhandener Prüfstand, nicht unnötig wiederholt

Für den unveränderten Anwendungscode liegen aus der unmittelbar vorhergehenden Prüfung **161 bestandene Tests in 14 Dateien**, ein erfolgreicher vollständiger Lintlauf und ein erfolgreicher Produktionsbuild unter Node 22.23.2 vor. Für diesen lesenden Review wurde kein neuer Vollbuild gestartet.

### Grenzen

Keine realen Kundendaten abgeschickt. Keine Mailzustellung, keine Hostingkonfiguration, keine Live CMS Schreibprüfung. Keine pauschale WCAG Zertifizierung, keine realen Safari/iPhone Tests, keine gemessenen Conversion Effekte oder Feldwerte zur Ladeleistung. Nicht jede Kombination aus neun Seiten, zwei Sprachen und allen Bildschirmgrößen wurde erneut visuell geöffnet. Rechtliche Veröffentlichungsdaten bleiben ein separat dokumentierter Freigabepunkt.

## 3. Bewertung

Die Scores sind fachliche Heuristiken, keine Nutzertestresultate.

| Bereich | Score | Einordnung |
| --- | ---: | --- |
| Markenidentität | 8/10 | Eigenständige Eingangsszene, reale Sportmedien, klare Farbwelt |
| Typografisches Gesamtsystem | 8/10 | Gute Rollenverteilung zwischen Bebas Neue, Instrument Sans und Mono |
| Zielgruppenführung | 7/10 | Richtige drei Wege, passende Anfrage bzw. Warteliste |
| Aussagekonsistenz | 6/10 | Interpretation und Produktverfügbarkeit noch nicht durchgehend eindeutig |
| Hero Hierarchie auf Laptops | 6/10 | Hauptaktion wird durch die große Headline nach unten gedrückt |
| MQS Lesbarkeit | 5/10 | Starker Gesamtscore, zu kleine Detailbeschriftung |
| Formularführung | 8/10 | Wenige Felder, getrennte Einwilligung, klare Zustände; ein Validierungsrandfall |
| Technische Robustheit | 7/10 | Gute Testbasis, aber Restfehler bei CMS Ausfall und Wiederholen |
| Zugänglichkeit | 6/10 | Gute Grundelemente, Lücken bei Dialogen, Sprachschalter und Bewegungskontrolle |

Ein Gesamtwert wäre irreführend: Ein guter Markenauftritt kompensiert keine fehlerhafte Wiederholen Funktion.

## 4. Technische Befunde

### T1: CMS Fallback kommt bei einer Störung zu spät

**Priorität P1, bestätigt.**

`sanity/lib/client.ts:4` setzt weder ein eigenes Zeitlimit noch eine Wiederholungsgrenze. `app/team/page.tsx:24` wartet auf diesen Abruf, bevor die vorhandenen Ersatzinhalte verwendet werden. Die installierte Clientfassung erlaubt standardmäßig 300.000 Millisekunden pro Request und mehrere Wiederholungen. Das passt zur zuletzt beobachteten langen Wartezeit im Build.

**Warum relevant:** Der Fallback ist vorhanden, schützt aber nicht rechtzeitig vor Verzögerungen. Ein redaktioneller Teaminhalt sollte keinen minutenlangen Build oder Seitenabruf verursachen.

**Vorschlag:** Öffentliche Teamabfrage mit einem expliziten Zeitlimit von etwa fünf Sekunden und ohne zusätzliche Wiederholung begrenzen. Danach vorhandene Inhalte rendern. Nur den öffentlichen Leseweg ändern, nicht pauschal Anfragen und Lead Speicherung. Fehler kompakt nach Kategorie protokollieren, nicht das gesamte Requestobjekt.

**Abnahme:** Ein absichtlich hängender Abruf endet innerhalb des festgelegten Budgets; die Teamseite liefert dennoch ihre Ersatzinhalte. Test mit kontrollierter Uhr, nicht mit realer fünfminütiger Wartezeit.

### T2: „Try Again“ fordert nicht zwingend neue Serverdaten an

**Priorität P2, bestätigt.**

`app/error.tsx:8` und `:14` verwenden `reset`. In der installierten Next Fassung 16.3.4 unterscheidet die Error Boundary zwischen lokalem Zurücksetzen und `retry`, das zusätzlich Serverinhalte aktualisiert. Ein gezielter Test der installierten Boundary ergab null Router Refreshes bei `reset` und einen bei `retry`.

**Warum relevant:** Bei einem vorübergehenden Serverfehler kann der Besucher trotz Klick im gleichen Fehlerzustand landen.

**Vorschlag:** Die Wiederholen Aktion auf die für diese installierte Version vorgesehene `retry` Funktion umstellen; Fehlerseite zugleich sprachlich lokalisieren. Keine vollständige Navigation oder Endlosschleife als Ersatz einbauen.

**Abnahme:** Erster Serverabruf schlägt fehl, zweiter gelingt; ein Klick stellt den Inhalt wieder her.

### T3: Aktualität der Teamdaten ist nicht eindeutig umgesetzt

**Priorität P2, Integrationslücke bestätigt; tatsächliche Veraltung im Live CMS nicht geprüft.**

`sanity/lib/live.ts:4` stellt `SanityLive` bereit, bindet es aber nicht aktiv ein. Die verwendete `sanityFetch` Implementierung setzt für den Datenabruf `revalidate: false`. Die scheinbare stündliche Erneuerung in `app/team/page.tsx:6` ist damit kein verlässlicher Aktualitätsvertrag für diese Abfrage.

**Vorschlag:** Für die einzelne Teamseite ist ein expliziter, begrenzter Abruf mit `revalidate: 3600` einfacher als eine unvollständige Live Architektur. Alternative nur bei tatsächlichem Bedarf: vollständige Live Invalidierung integrieren.

**Abnahme:** Dokumentiert ist genau eine Strategie; ein Test belegt, wann neue CMS Inhalte übernommen werden. Kein zweiter paralleler Cachemechanismus ohne Nutzen.

### T4: Sportfeld kann eine unverständliche Fehlerschleife erzeugen

**Priorität P2, aus Client und Serverschema bestätigt.**

`components/ui/audience-inquiry-form.tsx:87` sendet den Kontext unverändert. Zwei Leerzeichen erfüllen die HTML Mindestlänge, werden vom Serverschema nach dem Trimmen aber abgewiesen. Die allgemeine Meldung fordert nur zum erneuten Versuch auf.

**Vorschlag:** Getrimmten Inhalt vor dem Versand prüfen. Fehler direkt dem Sportfeld zuordnen, `aria-invalid` setzen und den Fokus dorthin bringen. Beispiel: „Bitte gib deine Sportart an.“ Eingaben bei Fehlern vollständig erhalten.

**Abnahme:** Leere bzw. nur aus Leerzeichen bestehende Angaben lösen eine verständliche lokale Korrektur aus und keinen nutzlosen Versandversuch.

## 5. UX und Zugänglichkeit

### U1: Beim Erstbesuch darf nur ein Dialog die Führung übernehmen

**Priorität P1, Quellcodekonflikt bestätigt; Überdeckung in einer frischen Sitzung noch gezielt zu reproduzieren.**

`components/layout/SiteChrome.tsx:36` kann auf Unterseiten Sprachwahl und Cookieauswahl gleichzeitig darstellen. Beide liegen auf `z-50`. Der Cookiebanner wird nach dem modalen Sprachdialog gerendert. Dessen Tastaturbehandlung greift nur innerhalb des eigenen Containers; der Hintergrund ist nicht tatsächlich per `inert` deaktiviert.

**Vorschlag:** Zuerst die Sprachwahl abschließen, dann Cookieauswahl zeigen. Während des modalen Dialogs Hintergrund inaktiv halten und Fokus innerhalb des Dialogs führen. Die Startseite mit eigener Sprachwahl bleibt ein eigener, einfacher Fall.

**Warum:** Zwei gleichzeitige Entscheidungen erzeugen Konkurrenz und können die Tastaturführung widersprüchlich machen. Das ist kein Problem, das mit einem höheren z-index allein gelöst wird.

**Abnahme:** Frische Sitzung auf einer direkten Zielgruppen URL, 320 und 390 Pixel, Tab und Shift+Tab: genau ein führender Dialog, anschließend normale Bedienung.

### U2: Sprachschalter korrekt als Bedienelement auszeichnen

**Priorität P2, bestätigt.**

`components/layout/LanguageToggle.tsx:11` verwendet eine Radiogruppe, ohne das dazugehörige Pfeiltastenverhalten und die passende Tab Reihenfolge umzusetzen.

**Vorschlag:** Für nur zwei Sprachen sind einfache Auswahlbuttons mit `aria-pressed` die kleinste konsistente Lösung. Die Startseite verwendet dieses Muster bereits. Alternativ native Radios vollständig korrekt implementieren. Sichtbar überall EN und DE statt EN/GER und EN/DE mischen.

### U3: Dauerbewegung steuerbar machen

**Priorität P1.**

Gut umgesetzt sind bereits Reduced Motion, Datensparmodus, Sichtbarkeit und das Pausieren in inaktiven Tabs. In `ambient-video.tsx`, `audience-video-playlist.tsx` und `mqs-dashboard.tsx` fehlt jedoch eine sichtbare manuelle Pause Möglichkeit.

**Vorschlag:** Eine ruhige, gemeinsam wirkende Einstellung „Bewegung pausieren“ mit mindestens 44 Pixel Bedienfläche. Auf Unterseiten im konstant erreichbaren Header bzw. mobilen Menü; auf der Startseite kompakt bei den vorhandenen Steuerungen. Sie stoppt Videos und kontinuierliche dekorative Bewegung, ohne Navigation oder Regler zu blockieren. Die Wahl bleibt für die Sitzung erhalten. Keine Zeitleiste und keine Playerumrandung hinzufügen.

**Warum:** Wer lesen möchte, sollte dafür nicht seine Betriebssystemeinstellungen ändern müssen. Ein einziges verständliches Bedienelement ist ruhiger als zahlreiche Playercontrols.

Automatisch beginnende Bewegung über fünf Sekunden parallel zu anderen Inhalten erfordert unter den in WCAG beschriebenen Bedingungen eine Möglichkeit zum Pausieren, Stoppen oder Ausblenden. Das gilt auch für indirekte Auslöser wie Hover oder Scrollen. [W3C: Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

### U4: Sprache ohne sichtbaren Wechsel nach dem Laden

**Priorität P2, Verhalten beobachtet; Dauer und Layoutverschiebung nicht quantifiziert.**

`lib/locale.tsx:51` beginnt grundsätzlich mit Englisch. URL Parameter und gespeicherte deutsche Auswahl werden erst nach dem Mount übernommen. Bei den Prüfungen war deshalb zunächst englischer DOM Inhalt und anschließend deutscher Inhalt vorhanden.

**Vorschlag:** Die Initialsprache künftig auch serverseitig bestimmen, etwa aus einem expliziten Sprachparameter und einer gespeicherten Sprachwahl. Vorher bewusst die Auswirkung auf statische Auslieferung und Cachevarianten festlegen. Kein kurzfristiger Workaround, der die gesamte Seite bis zur Hydration versteckt.

Dies ist eine kleine Architekturentscheidung, nicht bloß ein kosmetischer Austausch einer CSS Klasse. Sie gehört nach den konkreten Funktionskorrekturen eingeplant.

## 6. Art Direction und Layout

### D1: Die Hero Höhe an Laptopbildschirme anpassen

**Priorität P1, gemessen.**

Partner bei 1366 × 768: H1 rund 361 Pixel hoch; Haupt CTA von y=733 bis y=781, damit teilweise unter dem sichtbaren Bereich. Coach bei 1440 × 900: H1 rund 451 Pixel hoch. Die Handlungsoption im Header hilft, behebt aber nicht die Gewichtung im Hero.

**Lösung:** Wortlaut nicht ändern. Auf kurzen Desktopansichten und Breiten zwischen 1280 und 1535 Pixel zunächst etwa 80 statt 96 Pixel H1 testen. Obere und untere Hero Abstände von 96 auf etwa 72 Pixel reduzieren. Das MQS Fenster an der oberen Inhaltsgruppe ausrichten statt am gesamten, sehr hohen Textblock.

**Abnahme:** Bei 1366 × 768 sind H1, Intro und primärer CTA vollständig sichtbar. Der MQS Kopf beginnt ungefähr auf Höhe der Headline, nicht erst im unteren Drittel. 96 Pixel bleiben für wirklich große Ansichten möglich.

**Abwägung:** Etwas weniger monumentale Wirkung, dafür bessere Balance aus Marke, Produkt und Aktion.

### D2: Die MQS Detailbeschriftung muss lesbar werden

**Priorität P1, gemessen und im Code bestätigt.**

Aktuell sind Domänenlabels 9 Pixel, Werte 11 Pixel und Videocaptions 8 Pixel groß. Die Radar Initialen verwenden 6,4 Einheiten innerhalb einer 160 Einheiten breiten SVG. Mobil wurde eine tatsächliche Breite von 86,34 Pixel gemessen. Das ergibt etwa **3,45 CSS Pixel Schriftgröße**.

**Lösung:**

- Domänenlabels auf 11 bis 12 Pixel, Werte auf 12 Pixel.
- Videobeschriftung mindestens 10 Pixel und passend zur gewählten Sprache.
- Radar Initialen nicht zusammen mit der gesamten Grafik verkleinern. Entweder feste HTML Beschriftung um die Grafik oder eine gezielt auf reale Darstellungsgröße abgestimmte SVG Typografie. Mindestziel 9 Pixel, besser 10 Pixel.
- Grafik innerhalb der vorhandenen Spalte leicht verkleinern, damit lesbare Initialen außen Platz bekommen.
- Vorhandene Domänenfarben behalten. Keine zusätzliche Legendenkarte nötig.

**Warum:** Ein scheinbar präzises Instrument verliert Glaubwürdigkeit, wenn seine Informationen kaum lesbar sind. Größere Labels sind hier hochwertiger als zusätzliche technische Dekoration.

Quelle: `components/ui/mqs-dashboard.tsx:421`, `:577`, `:679`, `:720`.

### D3: Regler sichtbarer greifen lassen

**Priorität P2.**

Die tatsächlichen Eingabeflächen sind bereits 44 Pixel hoch. Das ist gut. Nur der sichtbare Griff ist mit 14 Pixeln und starkem Innenrand sehr klein.

**Lösung:** Sichtbares Oktagon auf 18 Pixel, bei Touch gegebenenfalls 20 Pixel. Innenrand reduzieren. Vorhandene 44 Pixel Eingabehöhe erhalten. Tastaturfokus als klar erkennbare Kontur der Range Fläche ergänzen, nicht allein als subtilen Glow am geclippten Griff. Keine dauerhafte Pulsanimation.

Die Tastaturbedienung funktioniert in der Stichprobe. Die visuelle Erkennbarkeit des Fokus muss nach einer Anpassung gesondert per Tab abgenommen werden. [W3C: Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html).

### D4: Mobile Partner Videos nicht zur eigenen Langstrecke machen

**Priorität P2, gestalterische Empfehlung.**

Bei 390 Pixel Breite ist das Partner Video rund 593 Pixel hoch. Die komplette Benefits Sektion umfasst mit deutscher Copy rund 1903 Pixel. Der Film nimmt damit einen großen Teil der mobilen Lesestrecke ein, bevor der konkrete Partnernutzen folgt.

**Lösung:** Für diesen mobilen Abschnitt eine Medienhöhe um 400 bis 440 Pixel testen. Originalproportionen erhalten: kein horizontal gestrecktes Video. Zuerst ein 4:5 Fenster mit pro Clip geprüftem Bildausschnitt ausprobieren. Wenn die vollständige Bewegung dadurch nicht sichtbar bleibt, auf proportional eingepasstes Video in einer ruhigen dunklen Fläche zurückgehen. Keine unscharfe Doppelkopie im Hintergrund.

**Abwägung:** Die Person und die Bewegung haben Vorrang vor einem starren Höhenziel. Die kleinere Variante nur übernehmen, wenn alle fünf Clips tatsächlich funktionieren.

### D5: Ausrichtung als System behalten, nicht alles zentrieren

**Beibehalten.**

Auf Desktop funktioniert im Coach Benefits Abschnitt: Überschrift und Intro auf linker Achse, darunter Foto links und kompakte Textreihen rechts. Beide Blöcke wirken zusammengehörig. Eine pauschale Zentrierung würde diese Leseführung schwächen.

Die Regel sollte lauten:

- Zweispaltige redaktionelle Abschnitte: gemeinsame linke Achse.
- Symmetrische Prozessdarstellung und finale zentrale Aktion: zentrierte Einführung.
- Mobile Text und Bild: innerhalb derselben Breite und derselben gewählten Achse führen.
- Fließtexte innerhalb von Karten bleiben linksbündig.

Das wirkt konsistent, obwohl nicht jede Überschrift dieselbe Ausrichtung hat.

## 7. Angebotslogik und Sprache

### C1: Wer interpretiert, muss eindeutig sein

**Priorität P1, objektiver Widerspruch in beiden Sprachen.**

Coach: „We interpret. You decide.“ steht im Gegensatz zu „The interpretation stays with your team.“ Deutsch zeigt denselben Konflikt. Quellen: `lib/audience-content.ts:262`, `:322`, `:326`, `:355`, `:415`, `:419`.

Die vom Auftraggeber festgelegte Rollenverteilung ist: **VANE interpretiert. Der Coach entscheidet und setzt im sportlichen Alltag um.**

Vorschlag für den bearbeitbaren Fließtext im Wissenschaftsabschnitt:

**EN:**

> VANE interprets your assessment results and explains what deserves attention. Your team brings the athlete and sport context, decides what to do next, and puts it into practice. MQS supports those decisions. It does not provide a medical diagnosis.

**DE:**

> VANE interpretiert die Ergebnisse und erklärt, was Aufmerksamkeit verdient. Dein Team kennt den Athleten und die Anforderungen seiner Sportart, entscheidet über die nächsten Schritte und setzt sie im Training um. MQS unterstützt diese Entscheidungen. Es stellt keine medizinische Diagnose.

Dazu den Prozessschritt nicht mehr als eigenständige Auswertung durch den Coach formulieren, sondern als gemeinsames Durchgehen der Interpretation von VANE. H1 und Hero Subtext bleiben außerhalb dieser Änderung.

### C2: MQS statt MQS Vault, konsequent an allen Kontaktpunkten

**Verbindliche neue Vorgabe.**

Nicht nur die sichtbare Überschrift ersetzen. Betroffen sind Entwicklungsnotiz, finale Vorzeile, Wartelistentitel, Erklärung, Checkbox, Erfolgsbestätigung und relevante redaktionelle Dokumentation.

| Stelle | EN Vorschlag | DE Vorschlag |
| --- | --- | --- |
| Button | Join the waitlist | Auf die Warteliste |
| Finale Überschrift | Join the MQS waitlist | Auf die MQS Warteliste |
| Coach Vorzeile | MQS for coaches and teams | MQS für Coaches und Teams |
| Partner Vorzeile | MQS for partners | MQS für Partner |
| Status | MQS access for coaches and teams is still in development | Der MQS Zugang für Coaches und Teams ist noch in Entwicklung |
| Partner Status | MQS access for partners is still in development | Der MQS Zugang für Partner ist noch in Entwicklung |
| Formularerklärung | Leave your email and we will contact you when access is available | Hinterlasse deine E Mail Adresse. Wir melden uns, sobald der Zugang verfügbar ist |
| Erfolgsbestätigung | You’re on the MQS waitlist. We’ll contact you when access is available | Du stehst auf der MQS Warteliste. Wir melden uns, sobald der Zugang verfügbar ist |

**Warum nicht einfach „MQS is in development“?** Das würde auch den bereits angebotenen Athleten Assessmentservice nach unfertigem Produkt klingen lassen. In Entwicklung ist der Zugang für Coaches und Partner. Diese Differenz muss trotz kürzerem Namen erhalten bleiben.

Die optionale Checkbox kann lauten:

**EN:** “Also send me email updates about MQS development and access. I can unsubscribe at any time.”

**DE:** „Ich möchte auch per E Mail über die Entwicklung und den Zugang zu MQS informiert werden. Ich kann mich jederzeit abmelden.“

Technischer Hinweis: Die Checkboxtexte sind versionierte Einwilligungstexte in `lib/waitlist-consent.ts`. Bei einer Umsetzung die Version für neue Einwilligungen erhöhen. Bereits gespeicherte Nachweise weder ersetzen noch nachträglich umbenennen. Tests müssen die neue Fassung prüfen. Die Trennung von Warteliste und optionalen Updates bleibt vollständig erhalten.

### C3: Natürliches Deutsch statt „Pilotieren“

**Verbindliche neue Vorgabe.**

Empfehlung für die Prozessüberschrift:

> **Verstehen. Testen. Auswerten.**

Die drei Schritttitel:

1. **Bedarf klären**
2. **In der Praxis testen**
3. **Gemeinsam auswerten**

Passende Beschreibungen:

1. „Wir klären gemeinsam, wer MQS nutzen soll, welche Fragen es beantworten muss und was vor Ort bereits vorhanden ist.“
2. „Wir vereinbaren Umfang, Zuständigkeiten und Erfolgskriterien für einen begrenzten Praxistest.“
3. „Wir prüfen, welchen Nutzen die Ergebnisse bringen und was für einen breiteren Einsatz noch nötig ist.“

**Warum:** „Testen“ benennt eine reale Handlung. „Auswerten“ sagt präziser als „Lernen“, was am Ende gemeinsam geschieht. „Begrenzter Praxistest“ bewahrt die Bedeutung des kontrollierten Pilotvorhabens, ohne künstliche Unternehmenssprache.

Für noch nicht verfügbare Prozesse vor dem Abschnitt knapp kennzeichnen: „So ist die Zusammenarbeit geplant“. Keine sofortige Pilotverfügbarkeit versprechen, solange sie nicht verbindlich bestätigt ist.

### C4: Jeder Abschnitt sollte eine neue Frage beantworten

**Priorität P2, redaktionelle Empfehlung.**

Der Coach liest mehrfach „ein Score, sieben Domänen, ein Profil“. Der Partner erhält häufig Begriffe wie „Evidenzgrenze“, „Reporting Ebene“, „Kontext“ und „operative Passung“. Das ist sachlich, aber nicht immer konkret.

Für bearbeitbare Body Texte gilt künftig:

| Abschnitt | Aufgabe |
| --- | --- |
| Nutzen | Was wird für mich in meinem Alltag besser verständlich? |
| Ablauf | Was mache ich, was übernimmt VANE? |
| Ergebnis | Was habe ich anschließend konkret vorliegen? |
| Wissenschaft | Was kann ich daraus ableiten und wo liegen Grenzen? |
| CTA | Was passiert jetzt nach meiner Anfrage oder Anmeldung? |

Ein vorhandener Inhalt darf an einer strategischen Stelle wiederholt werden. Er sollte aber nicht die Antwort auf jede dieser fünf Fragen ersetzen.

Athlete braucht vor allem Richtung für das Training und Klarheit über den Besuch im Vienna Lab. Coach braucht eine klare Arbeitsteilung und konkrete Nutzung. Partner braucht einen verständlichen, begrenzten Einstieg statt abstrakter Integrationssprache.

Vergleiche nur benennen, die das Produkt tatsächlich liefert. Keine sportartspezifischen oder Profikader Benchmarks erfinden, um den bestehenden Altersbezug attraktiver zu machen. Falls konkrete Vergleichsgruppen noch nicht freigegeben sind, neutral und ehrlich „Einordnung deiner Ergebnisse anhand passender Referenzwerte“ formulieren.

## 8. Was ausdrücklich bleiben sollte

- Der offene Dreifächer als Startseite für den überwiegend vorinformierten Traffic.
- Die bestehende Rollenreihenfolge und getrennten Zielgruppenseiten.
- Die realen Sportbilder und Videos statt neuer generischer Assets.
- Der aktuelle Türkiston als gezielter Akzent, nicht als großflächige Dekoration.
- Bebas Neue für dominante Aussagen, Instrument Sans für Lesetext. Kein weiterer Fontwechsel erforderlich.
- Domänenfarben als funktionale Zuordnung.
- Sichtbare Entwicklungsinformation für Coach und Partner.
- Athletenanfrage ohne automatische Buchung oder Newsletteranmeldung.
- Warteliste mit einer notwendigen Adresse und getrennten, freiwilligen Updates.
- Bestehende Reduced Motion und Medienlade Schutzmaßnahmen.

## 9. Empfohlene Umsetzung in kleinen Paketen

### Paket 1: Ausfallsicherheit

Teamabfrage zeitlich begrenzen, Cachevertrag vereinfachen, Fehlerseite korrigieren. Je Schritt höchstens drei bis fünf Dateien einschließlich Tests. Keine Installation und kein globaler Umbau.

### Paket 2: Eindeutige Kommunikation

Öffentlich MQS vereinheitlichen, versionierte Einwilligung korrekt aktualisieren, „Pilotieren“ ersetzen und den Interpretationswiderspruch in EN und DE auflösen. H1 und Hero Subtexte bleiben geschützt. Genau diese Inhalte bekommen eine gezielte Textregression.

### Paket 3: Bedienbarkeit

Erstbesuch Dialoge koordinieren, Sprachschalter semantisch vereinheitlichen, Sportfeld sinnvoll validieren. Keyboard und schmale Ansichten gezielt prüfen.

### Paket 4: Visuelle Qualität

Kurze Laptop Hero Ansichten kompakter, MQS Labels lesbar und Griffe deutlicher. Danach gemeinsame Bewegungspause integrieren. Mobile Partner Medienhöhe als separaten, visuell geprüften Schritt behandeln.

### Paket 5: Abschlussprüfung

Pro geändertem Paket gezielte Tests und Lint. Erst nach Abschluss aller Pakete ein vollständiger Build und der Routentest. Visuelle Abnahme mindestens bei 320, 390, 768, 1024, 1366 und 1440 Pixeln; Desktop, Touch, Tastatur, EN und DE. Keine neue vollständige Prüfungsschleife nach jeder rein textlichen Kleinigkeit.

## 10. Freigabeempfehlung

**Gestaltung:** Grundrichtung freigeben, keinen neuen Entwurf starten.

**Technik:** Die lokale Basis ist solide, die belegten Restpunkte vor einer endgültigen technischen Übergabe gezielt schließen.

**Kommunikation:** Vor Veröffentlichung die Verantwortlichkeit für Interpretation und den Produktstatus eindeutig machen. Die neue Namensvorgabe MQS ist sinnvoll, darf die Unterscheidung zwischen bereits verfügbarem Assessment und künftigem Zugang nicht verwischen.

**Nächste Entscheidung:** Zuerst die Pakete 1 bis 3, dann die visuellen Korrekturen. Zusätzliche Effekte, neue Farben oder eine erneute Umstrukturierung hätten im jetzigen Stand die geringere Priorität.
