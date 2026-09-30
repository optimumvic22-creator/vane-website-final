# VANE: konkrete Umsetzung des CEO Reviews

Stand: 25. September 2026. Ergänzt `TECHNICAL-HANDOFF.md`, ersetzt dessen technische Freigaben nicht.

## 1. Entscheidung und umgesetzter Umfang

Die bestehende Gestaltung wird beibehalten. Die wichtigste Verbesserung vor dem Launch ist eine eindeutigere Leistungserklärung, nicht eine weitere visuelle Neugestaltung.

| Bereich | Umsetzung | Zweck |
| --- | --- | --- |
| Athlete | Nutzenleiste und bestehende Karten erklären VANEs persönliche Einordnung, das Gespräch mit dem Coach und den Retest. | Aus Zahlen wird eine verständliche Grundlage für Trainingsprioritäten. |
| Athlete Anfrage | Vienna Lab, begleitetes Assessment und Erklärung der Ergebnisse. Ablauf, Dauer und Kosten werden vor einer Buchung besprochen. | Die Anfrage wird als konkreter, unverbindlicher nächster Schritt verständlich. |
| Coach | VANEs Interpretation steht als erstes Argument unter den CTAs und erneut in den bestehenden Nutzenkarten. | VANE liefert Einordnung, das Team entscheidet und setzt im Training um. |
| Partner | Ein Trainingszentrum mit Assessment zu Programmbeginn und Retest dient ausdrücklich als mögliches Beispiel. Zuständigkeiten, Nutzen und Aufwand werden vor breiterem Einsatz geprüft. | Die Zusammenarbeit wird vorstellbar, ohne eine bereits bestehende Integration oder einen Kundenfall zu behaupten. |
| Wartelisten | Coach fragt nach Einordnung für die Trainingsarbeit, Partner nach Einsatz in Einrichtung, Angebot oder Produkt. | Jede Rolle hat einen eigenen Grund, Interesse zu hinterlassen. |
| Wissenschaft | Athlete und Partner beginnen mit dem positiven Beitrag: Ergebnisse verstehen beziehungsweise vor Erweiterung prüfen. Grenzen bleiben sichtbar. | Vertrauen durch nachvollziehbare Leistung statt einer rein defensiven Einleitung. |
| Investoren | Der automatische Benchmarkzuwachs pro Assessment wurde durch Eignung, Qualitätsprüfung, Freigaben und relevante Vergleichsgruppen ersetzt. | Datenmenge wird nicht mit wissenschaftlicher Qualität gleichgesetzt. |

Unverändert: Startseite, H1 und Hero Intro der Zielgruppenseiten, Farben, Fonts, Medien, MQS Berechnung, Slider, Routen, Formularschnittstellen und Einwilligungsversionen. Keine neue Abhängigkeit.

Die Desktop Nutzenleisten bleiben mobil wie zuvor ausgeblendet. Deshalb stehen die zentralen Aussagen auch in den mobilen Nutzenkarten, nicht ausschließlich in der Leiste.

## 2. Angebot: erforderliche Freigaben

Die frühere Angabe von rund 30 Minuten wurde aus dem Athlete Ablauf entfernt. Im geprüften Produktkontext gab es keine separate Freigabe, ob dies die reine Testzeit oder den gesamten Termin bezeichnet. Es wurde keine Ersatzdauer und kein Preis erfunden.

Vor Veröffentlichung bestätigt die verantwortliche Person:

- Gesamtdauer einschließlich Vorbereitung und Erklärung der Ergebnisse.
- Preis sowie tatsächlich enthaltene Leistungen und etwaige zusätzliche Leistungen.
- Wie und wann Athleten ihren Bericht erhalten.
- Wer die Anfragen bearbeitet und die Ergebnisse erklärt.
- Dass vor einer Buchung Ablauf, Dauer und Kosten persönlich besprochen werden, wie nun auf der Seite angekündigt.

Sobald freigegeben, können Dauer und Preis in einem kurzen Satz beim bestehenden Anfrageformular ergänzt werden. Keine Preistabelle und kein neuer Seitenabschnitt nötig.

Coach und Partner bleiben Wartelisten für einen noch nicht verfügbaren Zugang. Es gibt keine Zusage zu Startdatum, kostenloser Testphase, bevorzugter Aufnahme oder automatischer Zusammenarbeit. Neuigkeiten per E Mail sind eine separate Auswahl mit Bestätigung der Adresse.

## 3. Echter Bericht als fehlender Vertrauensbeleg

In den geprüften öffentlichen Assets und Projektdokumenten liegt kein als real, anonymisiert und zur Veröffentlichung freigegeben gekennzeichneter Berichtsausschnitt vor. Daher wurde kein angeblicher Echtbericht erzeugt und kein leerer Platzhalter veröffentlicht.

Benötigte Lieferung:

1. Ein freigegebener Ausschnitt aus einem tatsächlich verwendeten Bericht.
2. Vollständige Anonymisierung: Namen, Termine, Kontaktdaten und andere identifizierende Angaben entfernen, auch aus Metadaten und Dateinamen.
3. Fachliche Freigabe von Score, Domänenwerten und Interpretation.
4. Kurzer, belegter Zusammenhang: Was wurde erfasst? Wie ordnet VANE es ein? Welche Frage bespricht das Team anschließend?
5. Freigabe der Bildrechte und eine zugängliche Textfassung. Keine fremde Empfehlung oder Erfolgsgeschichte ergänzen.

Geplante Platzierung nach Freigabe: innerhalb von `#results`, neben oder unter den bestehenden Ergebnisargumenten. Ein begrenzter Ausschnitt statt eines unlesbaren kompletten PDF Screenshots. Auf Mobile volle Containerbreite und eine lesbare Textfassung darunter. Der bestehende interaktive MQS bleibt Produktinteraktion und wird nicht zum Beleg für einen echten Fall umgedeutet.

## 4. Direkte Einstiege für das bestehende Netzwerk

Die folgenden Pfade sind einsatzfertige Linkvorlagen. Vor Versand die freigegebene Produktionsdomain ergänzen. Keine automatische Umleitung und keine neue Route nötig.

| Quelle | Zielpfad Deutsch |
| --- | --- |
| Saisantraining, Athleten | `/for/athlete?lang=de&utm_source=saisantraining&utm_medium=referral&utm_campaign=launch` |
| Trainernetzwerk | `/for/coach?lang=de&utm_source=coach_network&utm_medium=referral&utm_campaign=launch` |
| Persönliche Partneransprache | `/for/partner?lang=de&utm_source=partner_outreach&utm_medium=referral&utm_campaign=launch` |

Für Englisch nur `lang=en` einsetzen. Die Startseite bleibt der Einstieg für nicht vorab zugeordnete Besucher. Keine Namen, E Mail Adressen, sportlichen Befunde oder andere personenbezogenen Daten in Linkparametern verwenden.

Wichtig: UTM Parameter ermöglichen Kampagnenzuordnung in entsprechend konfiguriertem Analytics. Sie werden aktuell nicht automatisch in den gespeicherten Lead übernommen. Das Formularfeld `source` bezeichnet die Formularposition. Eine vollständige Zuordnung vom Erstbesuch bis zum gebuchten Termin ist damit noch nicht implementiert.

## 5. Was nach dem Launch gemessen wird

Vorhandene Ereignisse:

- `audience_select`: Auswahl einer Zielgruppe auf der Startseite.
- `audience_inquiry_submit`: erfolgreich bestätigte Anfrage, mit Rolle und Sprache.
- `waitlist_submit`: erfolgreich bestätigter Wartelisteneintrag, mit Segment und Sprache.

Analytics benötigt die eingerichtete Messung und Einwilligung. Es ist keine vollständige Zählung aller Besucher oder Leads. Ohne Einwilligung darf die Anfrage weiterhin funktionieren. Keine Formulardaten oder gesundheitlichen Informationen an Analytics senden.

Die verantwortliche Person ergänzt in der freigegebenen Kontaktverwaltung:

| Rolle | Geschäftsrelevantes Ergebnis | Nicht damit verwechseln |
| --- | --- | --- |
| Athlete | Anfrage, persönlicher Kontakt, vereinbarter Termin, wahrgenommenes Assessment | CTA Klick oder Sliderbewegung |
| Coach | Wartelisteneintrag und später bestätigter Bedarf für konkrete Trainingsarbeit | Newsletterzahl ohne passenden Bedarf |
| Partner | Wartelisteneintrag und später ein konkreter, gemeinsam geprüfter Einsatz | Unverbindliches Interesse ohne Anwendungsfall |

Diese nachgelagerten Zustände sind organisatorische Aufgaben beziehungsweise Anforderungen an die spätere Kontaktverwaltung. Die Webseite behauptet nicht, sie bereits zu erfassen. Keine Conversionsteigerung ohne Daten versprechen.

## 6. Kurze Abnahme mit echten Personen

Vor breiter Verteilung zwei Athleten, zwei Coaches und zwei potenzielle Partner einzeln testen lassen. Das ist eine qualitative Verständlichkeitsprüfung, kein statistischer Beweis.

Je Person:

1. Passende Seite kurz zeigen, anschließend ohne Hilfestellung fragen: Was macht VANE für dich?
2. Fragen: Was kannst du heute bekommen, was ist noch in Entwicklung?
3. Fragen: Was erwartest du nach dem Klick auf den Hauptbutton?
4. Formular bis vor dem Absenden bedienen lassen. Unklare Begriffe und Abbrüche wörtlich notieren.
5. Auf einem echten Smartphone Lesbarkeit, Videoverhalten und Bedienung der MQS Regler prüfen.

Abnahmeziel: Athleten verstehen den persönlichen Termin in Wien; Coaches verstehen Interpretation durch VANE und Entscheidung durch ihr Team; Partner verstehen einen abgestimmten Einsatz. Niemand erwartet sofortigen Softwarezugang oder eine medizinische Diagnose.

## 7. Technische Freigabe bleibt separat

Vor externen Leads müssen die bestehenden Gates aus `TECHNICAL-HANDOFF.md` erfüllt werden:

- Unterstützte Node Version im frischen Release Checkout, Checks, Tests und Produktionsbuild.
- Echte Datenspeicherung mit geprüften Rechten und nicht öffentlich lesbaren Leads.
- Eingang einer Testanfrage beim zuständigen Team, Fehlerüberwachung und Wiederholungslogik.
- Bei optionalen Updates: Bestätigung, Aufnahme in die passende Liste und Abmeldung tatsächlich prüfen.
- Finale Unternehmensangaben, rechtliche Freigaben, Medienrechte und funktionierende Kontaktadresse.
- Hostingkonfiguration, Missbrauchsschutz, Monitoring, freigegebener Commit und Rücksetzplan.

Lokale Tests sind keine Bestätigung dieser externen Funktionen. Hosting, Maildienst und Geheimnisse wurden in diesem Umsetzungsschritt nicht eingerichtet. Nicht auf Basis einer grünen lokalen Vorschau als erledigt abhaken.

## 8. Lokale Prüfung dieses Umsetzungsschritts

- Geänderte Dateien: `lib/audience-content.ts`, `app/investors/investors-content.tsx`, `lib/audience-content.test.ts` und dieses Dokument.
- `npm run check`: erfolgreich, einschließlich ESLint und TypeScript.
- 54 gezielte Tests: erfolgreich. Die bestehenden Schutztests sichern weiterhin Hero Texte, Rollenverteilung, Verfügbarkeit und getrennte Einwilligung ab.
- Ein veralteter Test erwartete noch den früheren kombinierten Erfolgstext der Warteliste. Er prüft jetzt die bereits zuvor getrennten, unveränderten Bestätigungssätze.
- `npm run build`: erfolgreich. Der Sanity Abruf der Teamdaten verwendete den vorhandenen lokalen Fallback; ein erfolgreicher Liveabruf ist damit nicht bestätigt.
- `git diff --check`: erfolgreich. Git meldet lediglich die bestehenden Hinweise zur Normalisierung von CRLF auf LF.
- Frische Produktionsvorschau auf Port 3030 neu gestartet. Athlete, Coach und Partner jeweils in Deutsch und Englisch bei 320 und 1440 Pixeln im Browser geprüft: genau eine H1, kein horizontaler Seitenüberlauf, keine überbreiten Textblöcke in den geprüften Überschriften, Absätzen und Listenelementen.
- Lokale Laufzeit: Node 24.14.0. Die unterstützte Releaseumgebung ist weiterhin Node 22 gemäß `package.json`; ein Lauf im endgültigen Release Checkout bleibt erforderlich. Die Enginevorgabe wurde nicht aufgeweicht.
- Keine neuen Abhängigkeiten, keine Formularübermittlung an externe Dienste, kein Commit, Push oder Deployment in diesem Schritt.

## 9. Nachprüfung der Kontaktstrecke

Bei der anschließenden technischen Prüfung wurde eine Lücke in der Bestätigung von Assessmentanfragen gefunden und geschlossen:

- Vorher wertete `submitInquiry` jede HTTP Erfolgsantwort als Erfolg, selbst einen leeren Antworttext oder eine HTML Seite.
- Jetzt wird wie bei der Warteliste ausdrücklich eine gültige JSON Antwort mit `ok: true` verlangt. Erst danach zeigt das Formular Erfolg und meldet gegebenenfalls eine Conversion an Analytics.
- Ungültige oder unklare Antworten führen nicht zu einer Erfolgsmeldung. Die Eingaben bleiben im Formular. Der Fehlertext behauptet nicht mehr, die Anfrage sei sicher nicht gesendet worden.
- Das Zeitlimit bleibt bis zum vollständigen Lesen der Bestätigung aktiv. Es wird kein automatischer erneuter Versand hinzugefügt.
- 114 gezielte Tests für Anfragen, Wartelisten, Eingabeprüfung, Einwilligung, private Lead IDs und die lokale Zustellungslogik sind erfolgreich. Darunter sind neue Regressionstests für leere, ungültige und falsche Bestätigungen sowie für fehlende Erfolgsmeldungen und Analyticsereignisse im Fehlerfall.
- Gezielte ESLint Prüfung, Produktionsbuild einschließlich TypeScript und Diffprüfung sind erfolgreich. Die Vorschau auf Port 3030 wurde mit diesem Build neu gestartet.
- Der Fehlerfall wurde zusätzlich über das echte Browserformular mit synthetischen Testeingaben geprüft: keine Erfolgsmeldung bei fehlender Anbindung, verständlicher Hinweis, erneut bedienbarer Button und sichtbar erhaltene Eingaben. Das ist kein Nachweis erfolgreicher externer Speicherung oder Zustellung.

Geänderte Dateien dieser Nachprüfung: `lib/inquiry-request.ts`, `lib/inquiry-request.test.ts`, `components/ui/audience-inquiry-form.tsx`, `components/ui/audience-inquiry-form.test.ts` und dieses Dokument. Layout, H1, Hero Texte und MQS Berechnung bleiben unverändert.

Der erneute Offlinecheck meldet weiterhin neun offene Konfigurationsprüfungen. Er umfasst neben der Laufzeit und rechtlichen Angaben insbesondere die echten Sanity Schreibzugänge und die Zustellungsanbindung. Erfolgreiche lokale Tests ersetzen keinen Nachweis, dass ein echter Kontakt gespeichert oder eine Nachricht tatsächlich zugestellt wurde. Der nächste externe Abnahmeschritt ist nach Einrichtung dieser Verbindungen eine ausdrücklich freigegebene Testanfrage mit Prüfung des Eingangs beim zuständigen Team.

## 10. Technische Fehlerkorrekturen nach parallelem Audit

Drei reproduzierte Fehler wurden mit begrenztem Dateiumfang korrigiert:

1. **Einwilligung zur Wartelistenkommunikation:** Die API speicherte bereits `mqs-updates-v2`, während die Zustellung nur `mqsvault-updates-v1` akzeptierte. Neue Einträge mit optionalen Updates konnten dadurch als ungültig abgewiesen werden. Die Zustellung akzeptiert jetzt ausdrücklich beide bekannten Versionen und übernimmt den unveränderten gespeicherten Einwilligungstext. Unbekannte Versionen bleiben gesperrt. Bereits extern als fehlgeschlagen markierte Datensätze werden nicht automatisch erneut versandt. Falls solche Datensätze existieren, muss die verantwortliche Person sie gezielt prüfen, bevor sie eine erneute Verarbeitung freigibt.
2. **Sprachwechsel und Browserhistorie:** Eine explizite Sprache in der URL blieb beim Umschalten unverändert und setzte die Auswahl beim Neuladen zurück. Der Sprachwechsel aktualisiert jetzt auch `lang` über die öffentliche History Schnittstelle von Next. Pfad, andere Parameter und Seitenanker bleiben erhalten. Zurück und Vorwärts synchronisieren eine gültige Sprache aus der URL. Gesperrter Browserspeicher verhindert die Auswahl im laufenden Fenster nicht.
3. **Startseitenvideos nach dem Entladen:** Nach dem Freigeben einer Videoquelle blieb deren Initialisierungsmarkierung bestehen. Beim erneuten Laden konnte dadurch die konfigurierte Startposition fehlen. Die Markierung wird jetzt genau beim Freigeben zurückgesetzt. Normales Verlassen eines Auswahlfelds behält Quelle, Pauseverhalten und vorhandene Verzögerung bei.

Die Zustellungsregression und die drei Videoregressionen wurden vor der Korrektur als fehlschlagend reproduziert. Danach bestehen alle 313 Tests in 26 Testdateien sowie die gezielte ESLint Prüfung aller sechs geänderten Quelldateien und Tests. Es wurden keine Abhängigkeiten, Designänderungen, neuen Texte oder Änderungen an der MQS Berechnung eingeführt.

Dateien: `lib/lead-delivery.ts`, `lib/lead-delivery.test.ts`, `lib/locale.tsx`, `lib/locale.test.ts`, `components/layout/AudienceEntry.tsx`, `components/layout/audience-entry.test.ts` und dieses Dokument. Die Umsetzung erfolgte in zwei getrennten Gruppen mit jeweils höchstens vier Dateien. Die externen Freigaben aus Abschnitt 7 bleiben erforderlich.

Abschlussprüfung: Ein gemeinsamer Produktionsbuild einschließlich TypeScript ist erfolgreich. Die frische Vorschau läuft auf Port 3030. Der lokale Smoke Test besteht für elf Routen, neun H1 und Headerprüfungen, Sitemap, unbekannte Zielgruppen mit Status 404, sechs nicht schreibende API Fehlerprüfungen und den gesperrten unauthentifizierten Zustellungsaufruf. Im echten Browser wurde Englisch auf Deutsch und zurück geschaltet und jeweils neu geladen: Auswahl, Seitenanker und Kampagnenparameter bleiben erhalten; die geprüfte Ansicht hat genau eine H1 und keinen horizontalen Überlauf. `git diff --check` ist erfolgreich. Der Build nutzt weiterhin Node 24.14.0 und beim fehlgeschlagenen Sanity Teamabruf den vorhandenen lokalen Fallback. Das sind keine Nachweise für die vorgesehene Node 22 Releaseumgebung oder eine funktionierende externe Anbindung. Keine echten Anfragen, Zustellungen, Commits, Pushes oder Deployments wurden ausgeführt.
