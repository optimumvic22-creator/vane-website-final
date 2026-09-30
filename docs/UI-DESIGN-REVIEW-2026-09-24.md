# VANE: UI, Layout und Design Review

Stand: 24. September 2026. Analyse, keine Freigabe zur Umsetzung.

## Kurzurteil

VANE hat eine erkennbare Gestaltung: dunkle Flächen, Bebas Neue, eine zurückhaltende türkisfarbene Akzentfarbe, echte Menschen und ein interaktives Bewegungsprofil. Die größte Chance liegt nicht in einem weiteren Stilwechsel, sondern in konsequenteren Größen, Abständen, Zuständen und Aussagen.

Gesamturteil: **7/10 als heuristische Designbewertung**, nicht als gemessene Conversion oder objektive Qualitätskennzahl. Die Markenidee ist stärker als ihre durchgängige Ausführung. Insbesondere die Investorenseite fällt gegenüber den Zielgruppenseiten ab.

## Prüfung und Grenzen

Drei unabhängige Agenten haben Typografie und Layout, Copy und Conversion sowie Interaktionen und Zustände im Quellcode geprüft. Der Hauptreview hat die Befunde mit der lokalen Website abgeglichen.

Im Umfang: `/`, `/for/athlete`, `/for/coach`, `/for/partner`, `/team`, `/investors`, `/privacy`, `/terms`, `/impressum`, gemeinsamer Header, Footer, MQS und Formulare. Englisch und Deutsch wurden einbezogen. Visuelle Stichproben: 1440 × 900, 1024 × 768, 768 × 1024, 390 × 844, 320 × 667 und 844 × 390. Nicht jede Seite wurde in jeder Kombination geprüft.

Die Auswertung verwendet aktuelle Screenshots, DOM Maße und Code. Zusammengesetzte Ganzseitenbilder zeigten Aufnahmeüberlappungen; diese wurden nicht als doppelte Seitenabschnitte gewertet. Maßgeblich sind einzelne Viewports und DOM Struktur.

Kein Versand von Formularen, keine Änderungen an Produktionscode, keine neuen Abhängigkeiten. Keine vollständige WCAG Zertifizierung, kein Rechtsgutachten, keine Überprüfung der wissenschaftlichen Engine, keine Messung von Conversion oder Geräteleistung.

## Was bleiben sollte

- Bebas Neue für die markanten Überschriften. Kein weiterer Fontwechsel.
- Instrument Sans für Lesetext und Bedienung.
- Der offene Dreifächer mit drei Zielgruppen und die bestehende Lichtführung.
- Die Startseite als Rollenauswahl für den dokumentierten überwiegend vorinformierten Besucherstrom.
- Weiß als stärkste CTA Fläche, Türkis als gezielter Akzent. Nicht jeden Button zusätzlich einfärben.
- Echte Fotos und Videos statt zusätzlicher generischer Grafiken.
- Die Domänenfarben innerhalb des MQS. Außerhalb des MQS keine zusätzliche Farbpalette.
- Unterschiedliche Ziele: Assessment Anfrage für Athleten, Warteliste für Coaches und Partner.
- Optionale Updates, keine vorausgewählte Einwilligung, schlanke Formulare und sichtbare Bewegungskontrolle.
- H1 und gesperrte Hero Texte bleiben bei einer rein visuellen Umsetzung unangetastet.

## Bewertung nach Dimension

| Dimension | Urteil | Wichtigste Beobachtung |
|---|---:|---|
| Eigenständigkeit und Wiedererkennung | 8/10 | Fan, Farbe und Typografie sind merkfähig |
| Typografische Hierarchie | 7/10 | Gute Schriftpaarung, aber mehrere konkurrierende Größen und kleine technische Labels |
| Abstände und Raster | 7/10 | Hauptachsen meist sauber; Übergangsbreiten und Partner Mediengruppe brauchen Feinschliff |
| Medienintegration | 7/10 | Authentisch, jedoch uneinheitliche Bildgewichte und unklare Pausenzustände |
| Mobile Bedienung | 6/10 | Solide Basis, aber Menü, Footer Ziele und lange Einstiegsstrecken sind verbesserbar |
| Zielgruppensprache | 7/10 | Grundlogik stimmt; Wiederholungen und übersetzt klingende deutsche Stellen bleiben |
| Konsistenz der öffentlichen Seiten | 6/10 | Investoren, Teamdetails und Footer folgen teilweise älteren Mustern |

Die Werte dienen der Priorisierung. Verbesserungen der Conversion sind Hypothesen und müssten mit echten Nutzungsdaten überprüft werden.

## 1. Typografie ordnen, nicht erneut ersetzen

**Befund:** Auf der Startseite sind H1 und Rollen nun wieder Bebas Neue. Bei 1440 Pixel wurden 76,32 Pixel für H1 und 66,24 Pixel für Rollen gemessen. Das Verhältnis funktioniert. Auf den Unterseiten konkurrieren dagegen mehrere Maßstäbe: Benefits H2 60 Pixel, andere Abschnittstitel 64 Pixel, Schluss CTA 72 Pixel, Investor H2 36 Pixel und teilweise nur 10 Pixel kleine Zusatztexte.

Nicht jede Abweichung ist ein Fehler. Eine Investorenseite darf redaktioneller sein als eine Landingpage. Momentan sind diese Unterschiede jedoch nicht als bewusstes System definiert.

**Vorschlag:** Vier benannte Rollen verwenden: Hero, Abschnitt, Karte und redaktionelle Überschrift. Bebas bleibt erhalten. Als Startwerte für eine visuelle Umsetzung:

| Rolle | Mobil | Desktop | Behandlung |
|---|---:|---:|---|
| Marketing Abschnitt | 40–48 px | 56–64 px | Bebas, Zeilenhöhe ca. 1,02 |
| Redaktioneller Abschnitt | 28–32 px | 40–44 px | Bebas, gleiche Grundbehandlung |
| Kartenüberschrift | 22–26 px | 26–30 px | bewusste Variante, Zeilenhöhe 1,1–1,2 |
| Vorzeile | 12–13 px | 13–14 px | Instrument Sans 500/600, 0,08–0,12 em Laufweite |
| Lesetext | 16–17 px | 17–18 px | Instrument Sans, Zeilenhöhe 1,5–1,6 |
| Hilfstext | 12–14 px | 12–14 px | keine zusätzliche geringe Deckkraft |

**Wie:** Zuerst lokale Varianten dokumentieren, danach schrittweise in gemeinsamen Komponenten verwenden. Nicht pauschal alle Überschriften auf eine Größe setzen. Die aktuelle kräftige Bebas Wirkung bleibt Referenz: Der geladene Regular Schnitt wird an mehreren Stellen mit synthetischem Fett und zusätzlicher Kontur kombiniert. Diese Behandlung zentral festlegen, nicht stillschweigend entfernen.

**Warum:** Wiederholung derselben Regeln schafft einen hochwertigeren Gesamteindruck als immer neue Schriftgrößen. Besonders kleine Monospace Texte wirken derzeit teilweise technischer, als ihr Inhalt erfordert.

## 2. Den Übergang bei 1024 Pixel gezielt behandeln

**Bestätigt:** Auf der deutschen Coachseite sind die drei Nutzenzellen bei 1024 Pixel jeweils ungefähr 151 Pixel breit und 206 Pixel hoch. Innenabstände lassen deutlich weniger Textbreite übrig. Das ist kein horizontaler Überlauf, aber eine unruhige Folge sehr kurzer Zeilen.

**Wie:** Unter 1280 Pixel die Nutzenleiste nicht in drei schmale Spalten innerhalb der linken Herohälfte zwingen. Erste Wahl: Bei 1024–1279 Pixel kompakte Zeilen innerhalb der bestehenden linken Spalte; ab 1280 Pixel wieder drei Spalten. Wenn der Hero dadurch zu hoch wird, den gesamten Hero Split erst ab 1280 Pixel aktivieren. Diese zwei Varianten visuell vergleichen, nicht beide gleichzeitig einbauen.

Für Coach und Partner stehen die Nutzenleisten mobil nach dem MQS. Dadurch wiederholen sie Aussagen, bevor die eigentliche Nutzensektion beginnt. Hier würde ich eine mobile Ausblendung analog zur Athleteseite testen, da die Inhalte im weiteren Verlauf erhalten bleiben. Das ist eine redaktionelle Entscheidung, kein zwingender Bugfix.

**Warum:** Ein Dreierraster ist nur dann schnell lesbar, wenn jedes Element genügend Breite besitzt. Kleine Schrift wäre die falsche Reparatur.

## 3. Gemeinsame Achsen statt alles zu zentrieren

**Befund:** Unterschiedliche Textausrichtungen können sinnvoll sein. Der zentrierte Prozess und die zentrierte Schlussaktion unterscheiden sich bewusst von redaktionellen Bild/Text Abschnitten. Bei einem Bild in voller Inhaltsbreite funktionieren linksbündige Texte darüber, sofern beide dieselbe linke Kante nutzen. Die mobile Athleten Nutzensektion erfüllt diese geometrische Bedingung.

**Regel:**

- Bild/Text Split: gemeinsame linke Achse für Vorzeile, H2 und Einleitung; Bild und Karte beginnen auf einer gemeinsamen Höhe.
- Zentrierter Prozess oder Schluss CTA: Vorzeile, Titel und kurze Einleitung gemeinsam zentrieren.
- Lesetext, Listen und Formularlabels grundsätzlich linksbündig lassen.
- Ein schmales, mittig stehendes Bild unter einem breiten Textblock vermeiden. Entweder Medienbreite an den Textblock angleichen oder die gesamte Einleitung als zentrierte Einheit führen.

**Wie:** Abschnittsvarianten `editorial`, `centered` und `form` definieren. Keine individuellen Korrekturen per zufälligem `translateX`.

**Warum:** Nicht Zentrierung an sich schafft Ruhe, sondern eine nachvollziehbare Achse.

## 4. Die Partner Mediengruppe enger zusammenführen

**Bestätigt:** In der Partner Nutzensektion war das sichtbare Video am Desktop etwa 339 Pixel breit. Bis zum Textpanel blieben ungefähr 137 Pixel freie Strecke. Das Textpanel ist mit etwa 739 Pixel deutlich schwerer gewichtet. Die Gruppe wirkt dadurch lockerer verbunden als die entsprechende Athletenkombination.

**Wie:** Die sichtbare Videobreite als echte Rasterspalte berücksichtigen, nicht nur einen kleinen Player in einer größeren leeren Spalte platzieren. Ausgangspunkt: Medienbreite 340–380 Pixel, Abstand 48–64 Pixel, Textbereich mit sinnvoller Obergrenze um 660–700 Pixel. Diese Gruppe und ihre Einleitung gemeinsam ausrichten. Die drei Textzeilen in ihrer Höhe vom Inhalt bestimmen lassen; keine zusätzliche Mindesthöhe nur zum Füllen.

Video proportional skalieren und eine bewusste `object-position` je Clip verwenden. Personen und Sprung dürfen nicht zugunsten perfekter Boxengleichheit abgeschnitten werden. Mobil Reihenfolge Einleitung, Video, Nutzenliste erhalten.

**Warum:** Zwei Elemente werden eher als zusammengehörig gelesen, wenn ihr sichtbarer Abstand dem übrigen Raster entspricht. Größere Kästen allein schaffen keine hochwertigere Wirkung.

## 5. Videozustände hochwertiger machen

**Bestätigt im Code:** Beim MQS wird bei nicht erlaubter Wiedergabe die Quelle entfernt und `load()` aufgerufen. Das betrifft unter anderem Pause, reduzierte Bewegung, einen unsichtbaren Tab und Offscreen Zustände. Ein Poster fehlt. Das leere Datengitter kann deshalb zusammen mit einer Domänenbezeichnung erscheinen.

In der Browserprüfung war zeitweise ein leeres Feld zu sehen; später spielten andere Domänenvideos. Das belegt keinen generellen Medienfehler. Die Zustandsdarstellung ist dennoch verbesserbar.

**Wie:** Laden und Abspielen als getrennte Entscheidungen führen. Bei manueller Pause Quelle und letztes Bild erhalten. Beim Erstaufruf mit reduzierter Bewegung ein bewusst ausgewähltes Standbild anzeigen. Beim Domänenwechsel das vorherige Motiv bis zum ersten decodierten Bild des neuen Clips erhalten. Entladen bleibt für längere Offscreen Phasen oder Datensparmodus möglich.

Auf der Startseite pro Rolle einen starken Ruheframe auswählen und pro Bildschirmklasse den sichtbaren Bildausschnitt prüfen. Im Athletenfeld sind Kopf und Oberkörper am oberen Rand häufig stark beschnitten. Kein neues Effektpaket, sondern die Personen im vorhandenen Material besser positionieren.

**Warum:** Eine ruhiggestellte Inszenierung sollte vollständig aussehen, nicht wie ein noch nicht geladenes Modul.

## 6. MQS funktional deutlicher, nicht dekorativer

Die Dreiergruppe aus Score, Video und Radar sowie die Domänenfarben sind eine gute Markenkomponente. Mehr Glow oder weitere Datenbeschriftungen würden die Bedienung eher schwächen.

**Vorschlag:** Den großen Schieberegler mit einer einzigen knappen Funktionsbezeichnung wie „MQS anpassen“ beziehungsweise „Adjust MQS“ versehen. Er kann wegen der Position unter dem Video sonst wie eine Zeitleiste wirken. Dies ist eine UX Hypothese, kein nachgewiesenes Missverständnis.

**Wie:** 11–12 Pixel Instrument Sans direkt an der Gesamtschiene; keine Tooltip Pflicht, kein zweiter Zahlenkasten. Gesamtschiene etwa 4 Pixel, Domänenschienen etwa 3 Pixel. Bestehende 44 Pixel Eingabeflächen, Oktagongriffe, Radarinitialen und Engine Kopplung erhalten. Die bestehenden feinen Trennlinien reichen aus.

## 7. Menü und Footer auf dasselbe Qualitätsniveau bringen

**Bestätigt:** Escape schließt das Mobile Menü nicht. Bei 844 × 390 Pixel war der CTA noch sichtbar; die Menüfläche endet bei etwa 357 Pixel. Der Code hat jedoch keine maximale Höhe und keinen eigenen vertikalen Scrollbereich. Kürzere Höhen und vergrößerter Text sind deshalb abzusichern.

**Wie:** `max-height` aus sichtbarer Höhe minus Header und sicherem Rand berechnen, `overflow-y:auto`, `overscroll-behavior:contain`. Escape schließen lassen und den Fokus zum Auslöser zurückgeben. Offenen Zustand beim Wechsel zur Desktop Navigation zurücksetzen. Den vorhandenen dunklen Hintergrund beibehalten und seine Lesbarkeit im vollständig geöffneten Zustand prüfen; eine Aufnahme während der Einblendung ist kein Beleg für einen dauerhaften Kontrastfehler.

**Footer:** Die Social Ziele wurden mit nur 20 × 20 Pixel gemessen, Textlinks mit 20 Pixel Zeilenhöhe. Empfehlung: Icons unverändert lassen, ihre Fläche auf 44 × 44 Pixel vergrößern. Mobile Linkzeilen 40–44 Pixel hoch. Abstände zwischen Zeilen entsprechend reduzieren, damit der Footer nicht unnötig wächst.

Dies ist eine Komfortempfehlung. 20 Pixel große Ziele sind wegen der Abstandsausnahmen nicht automatisch ein WCAG Verstoß.

## 8. Formulare: wenig ändern, Zustände verbessern

Die Warteliste ist positiv: ein Eingabefeld, optionale Updates, klarer CTA und keine unnötige Qualifizierung. Die Athletenanfrage verwendet eine optionale Nachricht. Das sollte bleiben.

**Wie:**

- Bei Versand Sport, Mail und Nachricht im Athletenformular schreibgeschützt setzen. Der sichtbare Inhalt soll dem abgesendeten Stand entsprechen.
- Buttonbreite zwischen Normalzustand und „Wird gesendet“ stabil halten.
- Erfolg mit kurzer Überschrift und einem nächsten Schritt darstellen, nicht nur als Absatz mit Icon.
- Allgemeine Fehler direkt beim CTA vor den rechtlichen Hinweisen anzeigen, 14 Pixel statt 12 Pixel.
- Timeout weiterhin ehrlich als unklaren Versandstatus behandeln, nicht automatisch als sicher gescheitert.
- Einwilligung, Bestätigung und Abmeldung technisch und textlich getrennt erhalten. Historische Einwilligungsversionen nicht überschreiben.

**Warum:** Gute Zustände schaffen nach der Handlung Vertrauen. Dafür braucht es keinen größeren Formularrahmen und keine zusätzlichen Felder.

## 9. Wiederholung durch einen klaren Informationsfortschritt ersetzen

Die Aussagen zu Profil, sieben Domänen, Prioritäten und Veränderung wiederholen sich in Hero Leiste, Benefits, Ablauf und Ergebnis. Einzelne Sätze stimmen, im Verlauf kommt jedoch teilweise zu wenig neue Information hinzu.

**Wie:** Jedem vorhandenen Abschnitt eine eigene Aufgabe zuweisen:

| Abschnitt | Einzige Hauptfrage |
|---|---|
| Hero | Was ist für mich relevant und was kann ich jetzt tun? |
| Benefits | Welches konkrete Problem löst das für mich? |
| Ablauf | Wer macht was und wie läuft es ab? |
| Ergebnis | Was erhalte ich tatsächlich? |
| Einordnung | Wofür hilft das Ergebnis und wo liegen Grenzen? |
| Schluss | Was passiert nach meiner Anfrage oder Anmeldung? |

Keine Abschnitte automatisch löschen. Doppelte Einleitungen kürzen und Platz für einen konkreten Reportausschnitt oder eine verständliche Erklärung vorhandener Reportbestandteile verwenden, sofern diese freigegeben sind.

Wichtig für spätere Umsetzung: Die englische Athleten Benefits Einleitung ist zusätzlich im Renderer hinterlegt. Eine Änderung nur in den Textdaten reicht dort nicht.

## 10. Textfeinschliff pro Zielgruppe

### Athlet

Der praktische Nutzen sollte stärker als das bloße Vorhandensein von sieben Zahlen wirken. Beispiele für die Ergebnispunkte, ohne zusätzliche Leistungsversprechen:

- „Erkenne, wo du mit deinem Coach genauer hinschauen solltest“
- „Ordne deine Ergebnisse mit einer nachvollziehbaren Referenz ein“
- „Lege deine nächsten Trainingsschwerpunkte fest“
- „Vergleiche deine Entwicklung beim nächsten Assessment“

Vergleichsgruppen müssen der tatsächlich verwendeten Referenz entsprechen. Keine Vergleiche mit Profis, Positionen oder Sportarten behaupten, solange diese nicht belegt und verfügbar sind.

„Weniger Vermutung. Mehr Richtung.“ klingt übersetzt. Als separate Copy Freigabe wäre „Mehr Überblick. Klarere Prioritäten.“ natürlicher. H1 und Hero Einleitung bleiben gesperrt.

Der Standort Wien erscheint erst am Schluss. Weil der Nutzer die frühere Zeile unter dem CTA ausdrücklich entfernen ließ, sollte sie nicht stillschweigend zurückkehren. Bessere Option zur Freigabe: den vorhandenen Ablaufpunkt „Measure/Erfassen“ um den Standort ergänzen. So kommt die praktische Information früher, ohne die verworfene Gestaltung wiederherzustellen.

### Coach

„We interpret. You decide.“ trifft die Rollenverteilung am stärksten. Diese Aussage sollte der inhaltliche Bezugspunkt sein, ohne sie in jedem Abschnitt zu wiederholen.

Die sichtbare Vorzeile „Planned workflow for coaches and teams“ widerspricht der vereinbarten Wortwahl. Ersatz: „Planned assessment process for coaches and teams“. Deutsch ist an dieser Stelle bereits „Geplanter Ablauf für Coaches und Teams“.

Im Ergebnisabschnitt nicht nochmals nur „Gesamtscore plus sieben Domänen“ erklären. Zeigen, welche gemeinsame Gesprächsgrundlage das Team bekommt, welche Einordnung von VANE kommt und welche Entscheidung beim Coach bleibt.

### Partner

Hero und erste Benefits Überschrift wiederholen nahezu denselben Satz. H1 bleibt unverändert; die Benefits Überschrift könnte nach Freigabe eine neue Frage beantworten, etwa „So ergänzt MQS dein bestehendes Angebot“ / „How MQS fits your existing offer“.

„Setup“, „Reporting Ebene“ und „praktische Passung“ wirken im Deutschen teilweise wie interne Projektsprache. Beispiel: „eine gemeinsame Grundlage für standardisierte Assessments und Berichte“ statt „eine standardisierte Assessment und Reporting Ebene“.

## 11. Investorenseite als prioritäre Konsistenzaufgabe

### Darstellung

Hier sind Monospace Vorzeilen, kleine Labels, nummerierte Abschnitte und andere Größen stärker vertreten als im übrigen Auftritt. Die Seite wirkt dadurch eher wie ein ausgearbeitetes internes Memo.

Vorzeilen auf den gemeinsamen Instrument Sans Stil bringen. Kleine Labels auf mindestens 12 Pixel anheben. `text-muted-foreground/60` für relevante Texte entfernen: Aus den CSS Farben ergibt sich auf dunklem Hintergrund ungefähr 3,4:1 Kontrast. Das liegt für normalen kleinen Text unter dem üblichen 4,5:1 Mindestziel. Dekorative Linien dürfen zurückhaltend bleiben.

Den redaktionellen Charakter und die schmalere Lesespalte erhalten. Nicht jede Investor H2 auf 64 Pixel aufblasen. Eine bewusste redaktionelle Variante von 40–44 Pixel reicht als Ausgangspunkt.

### Glaubwürdigkeit und Aussage

- „Reports that decide“ widerspricht der Produktlogik. Vorschlag: „Reports that support decisions“ / „Reports als Entscheidungsgrundlage“.
- „Baseline + retest proves whether training or rehab works“ ist stärker als die auf der Seite dargestellte Begründung. Vorschlag: Veränderung zwischen Ausgangsmessung und Retest beschreiben; keine unfreigegebene Wirksamkeitsaussage.
- Verfügbarkeit heute, Entwicklung und langfristige Optionen sichtbar unterscheiden.
- Roadmap Zahlen als Planungsziele mit bestätigtem Bezugsdatum kennzeichnen, nicht als aktuelle Traktion wirken lassen.
- Den unankündigten CTO Platzhalter nicht als öffentliche Personenkarte darstellen. Dieselbe Sichtbarkeitsregel wie auf `/team` verwenden.
- Einen passenden Kontakt zum Investorenbriefing bereits oben oder im seitenbezogenen Header anbieten. Der aktuelle dominante „Choose your path“ Link schickt bereits segmentierte Leser zurück zum Eingang.

Status, Zahlen, NormVault Bezeichnung und öffentliche Aussagen brauchen vor Änderungen die Bestätigung der Verantwortlichen. Keine Werte oder Freigaben erfinden.

## 12. Teamseite menschlicher und leichter lesbar machen

Bei 768 Pixel ist das Teamfoto ungefähr 687 × 516 Pixel groß, bevor die Biografie beginnt. Das Motiv ist authentisch, dominiert aber den Tablet Einstieg stark.

**Wie:** Im mittleren Breakpoint ein flacheres Seitenverhältnis wie 16:9 prüfen; den Bildfokus auf Gesicht und Gestik setzen. Falls der Ausschnitt nicht funktioniert, lieber bei 4:3 bleiben und den Textblock näher anschließen. Kein Crop nur für ein starres Raster.

Die Qualifikationen sind derzeit klein, gesperrt und teils durch Positionsrahmen getrennt. Bei Zeilenumbruch bleibt ein linker Trenner am Zeilenanfang stehen. Als ruhige vertikale Liste in 12–13 Pixel Instrument Sans wäre der eigentliche Vertrauensbeleg schneller lesbar. Biografie in zwei inhaltliche Absätze teilen, ohne Qualifikationen zu kürzen.

Die Überschrift „Meet the Founders“ steht im aktuellen Fallback über einer öffentlich sichtbaren Person. Das ist eine redaktionelle Inkonsistenz, keine Einladung, Personen zu ergänzen. Eine neue H1 würde gesonderte Freigabe brauchen.

## 13. Footer und Wissenschaftszugang präzisieren

Englisch endet der Footer mit „For a safer world“, Deutsch mit „Bewegungsanalyse aus Wien“. Das sind unterschiedliche Aussagen. Eine gemeinsame, belegbare Produktbeschreibung ist stärker als ein zusätzliches großes Weltversprechen.

Der Link „Science/Wissenschaft“ führt zur Athletensektion mit Einordnung und Grenzen, nicht zu einer Evidenzübersicht. Kurzfristig das Ziel ehrlicher benennen, etwa „Einordnung und Grenzen“. Mittelfristig dort überprüfbare Methodik und Quellen anbieten. Keine generischen Wissenschaftsbadges als Ersatz für Belege.

„Become a partner“ führt zur Warteliste. „Partner waitlist“ wäre der präzisere Aktionsname, solange das das tatsächliche Ziel ist.

## 14. Rechtliche Seiten: visuelle Pflege und sichtbare Platzhalter

Die Grundgestaltung funktioniert: ruhige einspaltige Texte, keine Werbeelemente, kontrollierte deutsche Worttrennung und keine beobachteten horizontalen Überläufe in der mobilen Stichprobe.

Feinschliff: Lange Datenschutzabsätze nach Zweck gliedern, etwa Analyse, Warteliste und Anfrage. Zwischen Absätzen 16–20 Pixel, zwischen Themen 32–40 Pixel. Die Datumszeile bleibt mit 14 Pixel auch auf Desktop sekundär. Kleine Bebas Abschnittstitel mit klar definierter Zeilenhöhe darstellen.

Im Impressum sind mehrere „Wird ergänzt“ Platzhalter sichtbar. Das wirkt öffentlich unfertig und ist vor Veröffentlichung mit bestätigten Firmendaten zu vervollständigen. Dieser Review beurteilt nicht, ob die rechtlichen Angaben inhaltlich korrekt oder vollständig sind; dafür ist eine separate fachliche Prüfung erforderlich.

## Umsetzungsvorschlag in begrenzten Paketen

### Paket A: Bedienung und Lesbarkeit

1. Mobile Menühöhe, Escape und Fokus.
2. Größere Footer Bedienflächen.
3. Investor Textkontrast und kleine Labels.

Prüfung: Tastatur, 320 Pixel Breite, kurze Querformate, beide Sprachen, Textzoom. Noch keine Copy Neuausrichtung.

### Paket B: Responsive Raster

1. Hero Nutzenleiste im Bereich 1024–1279 Pixel.
2. Partner Medienabstand und Raster.
3. Team Qualifikationen und mittleres Bildformat.

Prüfung: 768, 1024, 1152, 1280 und 1440 Pixel, jeweils deutsche längere Texte. Titel, Medien und Beschreibung dürfen nicht gegeneinander verschoben werden.

### Paket C: Medien und Formularzustände

1. Pause mit erhaltenem Motiv.
2. Sauberer Domänenwechsel ohne leeres Zwischenbild.
3. Stabiler Versandzustand und deutliches Ergebnisfeedback.

Prüfung: Reduced Motion, Datensparmodus, Fokuswechsel, langsames Laden und Fehlerfälle. Keine echten Leads oder E Mails während der Tests erzeugen.

### Paket D: Redaktionsfreigabe

1. Investor Aussagen und Statusdarstellung.
2. Verbleibendes „workflow“, deutsche Übersetzungsstellen und Footer.
3. Wiederholungen durch konkrete Informationen ersetzen.

H1, gesperrte Hero Einleitungen, bestehende Einwilligungsversionen und wissenschaftliche Aussagen nicht automatisch ändern.

### Paket E: Typografische Konsolidierung

Erst nach den lokalen Korrekturen die bewährten Maße als wiederverwendbare Varianten zusammenführen. Kein globales Refactoring vor dem visuellen Vergleich und keine neue Schriftabhängigkeit.

Je Umsetzungsschritt maximal drei bis fünf betroffene Dateien. Quelltests und visuelle Prüfungen passend zum Risiko; keine wiederholten vollständigen Builds für reine Textvarianten. Ein Produktionsbuild ist für den abschließenden integrierten Stand sinnvoll.

## Abnahmekriterien

- Keine unbeabsichtigten horizontalen Überläufe oder abgeschnittenen Wörter ab 320 Pixel.
- Ein H1 pro Seite; unveränderte gesperrte H1 Inhalte.
- Stabile Text/Bild Achsen und nachvollziehbare Kartenabstände.
- Vergleichbare Bedienflächen und sichtbarer Tastaturfokus.
- Menü, MQS und Formulare besitzen eindeutige Normal-, Fokus-, Pause-, Lade- und Fehlerzustände.
- Keine unbestätigten Angebote, Ergebnisse, Personen oder Referenzgruppen.
- Datensparmodus, reduzierte Bewegung und Formularschutz bleiben erhalten.
- Keine neue Dekoration ohne funktionalen Nutzen.

## Fachliche Referenzen

- [W3C: Kontrast für normale und große Texte](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum/)
- [W3C: Reflow bei schmalen Ansichten](https://www.w3.org/WAI/WCAG21/Understanding/reflow/)
- [WCAG 2.2: Mindestgröße und Ausnahmen bei Bedienflächen](https://www.w3.org/TR/wcag/#target-size-minimum)

Die CRO und Copy Editing Skills haben die Prüfung auf Verständlichkeit, Informationsfortschritt, Reibung und belegbare Aussagen strukturiert. Die empfohlenen optischen Werte sind Designentscheidungen und Startpunkte zur Verifikation, keine wissenschaftlich garantierten Optima.

## Codeanker

Relativ zum VANE Repository:

- `components/layout/AudienceEntry.tsx`: Startseite, Rollen, Typografie, Medien.
- `app/for/[audience]/audience-landing.tsx:256`: Hintergrundraster; zwei Gradienten erhalten derzeit drei background-size Werte. Separat als kleine Konfigurationskorrektur behandeln.
- `app/for/[audience]/audience-landing.tsx:262`: Hero Raster.
- `app/for/[audience]/audience-landing.tsx:321`: Nutzenleiste und mobile Unterschiede.
- `app/for/[audience]/audience-landing.tsx:388`: zusätzlich fest hinterlegte englische Benefits Einleitung.
- `components/ui/typography.tsx`: gemeinsam verwendete Schriftrollen.
- `components/layout/SiteHeader.tsx:180`: Mobiles Menü.
- `components/layout/SiteFooter.tsx:33`: Footer Text, Ziele und Bedienflächen.
- `components/ui/mqs-dashboard.tsx:246`: Videoquelle und Wiedergabezustand.
- `components/ui/audience-inquiry-form.tsx`: Anfragezustände.
- `components/ui/audience-waitlist-form.tsx`: Warteliste und Zustandsdarstellung.
- `app/team/team-content.tsx:146`: Bildraster; `:191`: Qualifikationen.
- `app/investors/investors-content.tsx:91`: Reportaussagen; `:338`, `:392`, `:451`: schwache Textkontraste; `:419`: CTO Platzhalter.
- `lib/audience-content.ts:287`: verbleibendes öffentliches „workflow“.
- `.agents/product-marketing.md`: verbindliche Produkt-, Zielgruppen- und Verfügbarkeitslogik.
