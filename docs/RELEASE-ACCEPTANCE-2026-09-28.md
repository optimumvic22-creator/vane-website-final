# Technische Launchabnahme vom 28. September 2026

## Ergebnis

Der aktuelle Arbeitsstand besteht die lokale Abnahme unter Node 22. Eine Freigabe für echte Leads oder einen öffentlichen Launch ist damit nicht erteilt. Es wurden keine Anwendungstexte, Layouts, Abhängigkeiten, Zugangsdaten oder MQS Berechnungen geändert.

| Angeforderte Abnahme | Status | Tatsächlich geprüft |
| --- | --- | --- |
| Vorgesehene Node Laufzeit | Lokal bestanden | Signierte portable Node Version 22.23.2, ESLint, TypeScript, 313 Tests, Produktionsbuild und Produktionstestserver |
| Echte Kontaktstrecken | Durch fehlende Anbindung blockiert | Lokale Fehlerbehandlung und bestehende isolierte Tests; keine echte Speicherung, Zustellung oder Bestätigung |
| Reale Mobilgeräte | Nicht verfügbar, Browser Vorprüfung bestanden | Schmale Desktopbrowser Ansichten, Formulare, Menü, Regler und Medien; keine iOS oder Android Abnahme |
| Nach Deployment | Noch nicht möglich, Domain Vorprüfung auffällig | Öffentliche HTTP und HTTPS HEAD Anfragen; kein freigegebenes Deployment und kein Hostingzugang vorhanden |

## 1. Laufzeit und lokale Produktionsprüfung

Verwendet wurde die bereits vorhandene Datei `.vane-tools/node22.exe` im übergeordneten Projektworkspace. Die Windows Signatur ist gültig und stammt von der OpenJS Foundation. Gemeldete Version: `v22.23.2`. Die globale Node Installation wurde nicht geändert.

Erfolgreich mit dieser ausführbaren Datei:

- `node_modules/eslint/bin/eslint.js .`
- `node_modules/typescript/bin/tsc --noEmit`
- `node_modules/vitest/vitest.mjs run`: 313 Tests in 26 Dateien bestanden
- `node_modules/next/dist/bin/next build`: erfolgreich einschließlich TypeScript
- Produktionsserver auf `http://127.0.0.1:3030`
- `scripts/smoke.mjs http://127.0.0.1:3030`: elf Routen, neun H1 und Headerprüfungen, Sitemap, unbekannte Zielgruppe mit 404, sechs nicht schreibende API Prüfungen und verweigerter unauthentifizierter Zustellungsaufruf bestanden

Der Sanity Teamabruf nutzte den vorhandenen lokalen Fallback. Vitest meldete eine nicht blockierende Warnung zur zukünftigen nativen Vite Konfigurationsladung. Keines von beidem wurde als erfolgreiche externe Anbindung gewertet.

Wichtig: Geprüft wurde der aktuelle Arbeitsstand mit den vorhandenen installierten Abhängigkeiten, nicht ein frischer Release Checkout mit `npm ci`. Ein geprüfter Commit, Installation aus dem Lockfile in einer sauberen Umgebung und tatsächlich ausgeführte Remote CI bleiben für die Übergabe erforderlich. Die bisherigen fremden Änderungen wurden nicht gestaged, committed oder gepusht.

Wiederholung vom Websiteverzeichnis in PowerShell:

```powershell
$node = 'C:/Users/optim/OneDrive/Dokumente/New project/.vane-tools/node22.exe'
& $node --version
& $node node_modules/eslint/bin/eslint.js .
& $node node_modules/typescript/bin/tsc --noEmit
& $node node_modules/vitest/vitest.mjs run
& $node node_modules/next/dist/bin/next build
```

Jeden folgenden Schritt nur nach Exitcode 0 des vorherigen ausführen. Auf anderen Rechnern stattdessen den dort installierten Node 22 Pfad verwenden. Kein automatischer Austausch der Systemlaufzeit ist nötig.

## 2. Kontaktstrecken

Die Offlineprüfung unter Node 22 meldet acht offene Prüfungen:

- echtes Sanity Projekt statt Platzhalter
- Token für die Speicherung von Leads
- separates Scheduler Geheimnis
- separates Bridge Geheimnis
- Nachweis, dass diese beiden Geheimnisse verschieden sind
- echte HTTPS Adresse der Zustellungsbridge
- vollständige rechtliche Unternehmensangaben
- Freigabe der rechtlichen Verweise für den österreichischen Kontext

Ohne diese Anbindung wird kein erfolgreicher Kontaktversand behauptet. Im lokalen Browser wurden ausschließlich synthetische Eingaben mit einer nicht zustellbaren Adresse unter `example.invalid` verwendet:

- Athlete: Sport und E Mail eingegeben, Anfrage abgesendet. Verständlicher Fehler, keine Erfolgsmeldung, Eingaben erhalten und Button erneut bedienbar.
- Coach: Warteliste ohne optionale Updates. Verständlicher Fehler, keine Erfolgsmeldung und Button erneut bedienbar.
- Partner: Warteliste mit optionalen Updates. Verständlicher Fehler, Adresse und gesetzte Auswahl sichtbar erhalten, Button erneut bedienbar.

Es wurde kein echter Kontakt erstellt und keine E Mail gesendet. Die Tests mit simulierten Diensten ersetzen keine Bestätigung eines realen Dienstes.

### Abnahme nach Einrichtung, mit kontrollierten Testadressen

| Fall | Erwarteter Nachweis |
| --- | --- |
| Athlete Anfrage | Ein privater Datensatz; Nachricht erreicht das verantwortliche Team; keine Terminbestätigung und kein Newsletterabo |
| Coach ohne Updates | Wartelisteneintrag im richtigen Segment; keine Marketingeinwilligung und keine Updatebestätigung |
| Partner mit Updates | Richtige Rolle und Sprache; genaue Einwilligungsversion und Wortlaut gespeichert; genau eine Bestätigungsanfrage |
| Wiederholte Warteliste | Keine ungewollten Dubletten; frühere Abmeldung wird nicht stillschweigend aufgehoben |
| Bestätigungslink | Anmeldung erst nach der ausdrücklichen Bestätigung aktiv; korrekte Rolle und Sprache |
| Abmeldung | Weitere Updates unterdrückt; alte Zustellungsjobs reaktivieren die Adresse nicht |
| Dienstfehler oder Timeout | Sichtbarer Zustellungsstatus, begrenzte Wiederholung und kein Doppelversand |
| Anonymer Zugriff | Kein öffentlicher Zugriff auf die Testleads; zusätzlich kontrollierte Prüfung vorhandener Altbestände |

Durchführung erst mit der freigegebenen Preview Umgebung, einem kontrollierten Empfängerpostfach und Einsicht in Sanity sowie den Zustellungsdienst. Zugangsdaten gehören in lokale oder gehostete Geheimnisverwaltung, nicht in dieses Dokument oder öffentliche Variablen. Bestehende fehlgeschlagene Zustellungsjobs nicht pauschal erneut versenden.

## 3. Mobile Vorprüfung und echte Geräte

Verfügbar war ausschließlich der Codex Desktopbrowser. Es wurde keine physische Smartphoneverbindung und kein realer Safari oder Android Browser genutzt.

Browserprüfung:

- 390 × 844: Athlete, Coach und Partner jeweils in Deutsch und Englisch; genau eine H1, acht MQS Regler und kein horizontaler Seitenüberlauf.
- 320 × 667: Startseite und alle drei Zielgruppen auf Deutsch; genau eine H1 und kein horizontaler Seitenüberlauf.
- Formularfelder verwenden in den geprüften Zielgruppenansichten 16 Pixel Schriftgröße.
- Power Regler per Tastatur von 57 auf 58 verändert; passendes Power Video wurde geladen und spielte ohne gemeldeten Medienfehler ab. Beobachteter Zeitfortschritt von 0 auf 3,24 Sekunden. Dies ist keine neue wissenschaftliche Validierung der Berechnung.
- Globales Pausieren stoppte alle Videos und entfernte deren aktive Quellen. Fortsetzen blieb erreichbar.
- Mobiles Menü öffnete sich und schloss per Escape. Fokuszustand am Regler war sichtbar.
- Fehlerzustände der drei Formulare bei 320 Pixeln wie oben geprüft.
- Die vorübergehende Bildschirmgrößenvorgabe wurde anschließend zurückgesetzt.

Noch auf mindestens einem aktuellen iPhone in Safari und einem Android Smartphone in Chrome ausführen, jeweils mit Gerätemodell, OS und Browserversion protokollieren:

1. Startseite öffnen, EN und DE, Hochformat und Querformat. Rollen auswählen und zurückgehen.
2. Alle acht MQS Regler per Finger bewegen. Scrollen darf nicht ungewollt den Wert verstellen. Endwerte und Fokus sichtbar halten.
3. Videostart, Wechsel, Pause, Rückkehr nach Appwechsel sowie reduzierte Bewegung und langsame Verbindung prüfen.
4. E Mail Feld fokussieren. Bildschirmtastatur darf das aktive Feld und den erreichbaren Absendeweg nicht dauerhaft verdecken. Eingabezoom und Safe Area kontrollieren.
5. Menü, Sprache, Cookieauswahl, ungültige Eingaben und erhaltene Eingaben nach Fehlern prüfen.
6. Nach externer Einrichtung einen kontrollierten erfolgreichen Formularfall durchführen und serverseitig nachweisen.

Eine Änderung der Desktopbrowser Breite simuliert weder mobile Touchereignisse noch die Bildschirmtastatur oder Safari Autoplayregeln. Diese Abnahme bleibt offen.

## 4. Öffentliche Domain und Deployment

Nur lesende HEAD Anfragen, ohne Formularinhalt und ohne Umgehung von Zertifikatsprüfungen:

| Adresse | Beobachtung am 28.09.2026 |
| --- | --- |
| `http://vanescience.com/` | HTTP 200; Endadresse bleibt HTTP; keine Weiterleitung auf HTTPS; kein HSTS Header |
| `https://vanescience.com/` | TLS Verbindung konnte aus dieser Umgebung nicht erfolgreich hergestellt werden |
| `https://www.vanescience.com/` | TLS Verbindung konnte aus dieser Umgebung nicht erfolgreich hergestellt werden |

Diese Antworten beweisen nicht, dass dort der aktuelle Websitecode läuft. Die genaue Ursache der TLS Fehler wurde nicht ermittelt. Keine Sicherheitsprüfung wurde deaktiviert. Domain, DNS, Zertifikate und Hosting wurden nicht geändert.

### Nach dem tatsächlichen Deployment

1. Zertifikate für Hauptdomain und `www` korrekt bereitstellen. HTTP auf die freigegebene HTTPS Hauptadresse umleiten; Pfad und Parameter erhalten. Keine Redirectschleife.
2. Erst gegen das bestätigte VANE Deployment `npm run smoke -- https://vanescience.com` ausführen. Das Skript beinhaltet absichtlich ungültige, nicht schreibende API POST Prüfungen. Keine Honeypotoption gegen reale Leads aktivieren.
3. Statische Medien auf korrekten Inhaltstyp, Byte Range Antworten und Cacheverhalten prüfen. HTTPS Seiten dürfen keine HTTP Medien nachladen.
4. Die realen Kontaktfälle aus Abschnitt 2 ausführen. Speicherung ist nicht gleichbedeutend mit Zustellung.
5. Hostingseitigen Missbrauchsschutz, anonymisierte Fehlerprotokolle und Alarmierung an die verantwortliche Person überprüfen. Keine Token, vollständigen Formulare oder Gesundheitsangaben protokollieren.
6. Freigegebene Releasekennung und vorheriges Deployment festhalten. Rollback auf den vorherigen Stand am gewählten Host einmal kontrolliert proben, ohne Lead Daten zu löschen.

## Benötigte nächste Eingaben

Für weitere selbstständige Durchführung werden benötigt: gewählter Hostinganbieter und freigegebene Preview URL, eingerichtetes Sanity Projekt mit passender Berechtigung, gewählter Zustellungsdienst mit Bridge und Testempfänger sowie ein zugänglicher Weg zur Prüfung auf realen Smartphones. Kein zusätzlicher Designauftrag ist nötig. Unternehmensdaten und rechtliche Freigaben müssen von der verantwortlichen Person kommen.
