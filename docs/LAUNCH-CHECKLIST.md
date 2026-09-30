# VANE Science — Launch-Checkliste

Kompakte Handover-Checkliste für den Go-Live von **vanescience.com**. Punkte 2 und 4 erfordern
Freigaben bzw. Inhalte, die nur die Gründer liefern können.

---

## 1. Vercel-Deployment

- [ ] Repository in Vercel als neues Projekt verbinden (Framework: Next.js, Root: Projektwurzel).
- [ ] Domain **vanescience.com** (inkl. `www`-Redirect) im Projekt hinterlegen und DNS umstellen.
- [ ] Environment-Variablen für **Production** (und Preview) setzen:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity-Projekt-ID
  - `NEXT_PUBLIC_SANITY_DATASET` — z. B. `production`
  - `NEXT_PUBLIC_SANITY_API_VERSION` — versioniertes API-Datum aus `.env.example`
  - `SANITY_API_WRITE_TOKEN` — Token **mit Schreibrechten** (Editor/Write), damit Wartelisten-Einträge
    und Zielgruppenanfragen in Sanity gespeichert werden. Nur die notwendigen Dokumentrechte vergeben.
    Ohne Token antworten `/api/waitlist` und `/api/inquiry` mit HTTP 503.
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` — optional; nur setzen, wenn Google Analytics aktiv sein soll
    (GA4 lädt ausschließlich nach Cookie-Zustimmung „Alle akzeptieren“).
- [ ] Preview und Production verwenden bewusst getrennte Sanity-Datasets für Testanfragen und echte Leads.
- [ ] Nach dem ersten Deploy prüfen: `/`, `/for/athlete`, `/for/coach`, `/for/partner`, `/team`,
  `/investors`, `/impressum`, `/privacy`, `/terms`, `/sitemap.xml` und `/robots.txt` liefern 200.
- [ ] Sprachumschalter EN/DE, MQS-Regler, alle Videos und beide Form-Endpunkte prüfen.

## 2. Offene Inhalte — nur von den Gründern zu liefern

- [ ] **CTO-Name & Profil** ersetzen (aktuell Platzhalter „Co-Founder & CTO / Ankündigung folgt“):
  - `app/team/team-content.tsx` (Founder-Karte)
  - `app/vision-section.tsx` (Founder-2-Block: Name, Titel, Zitat)
  - `app/investors/investors-content.tsx` (Foundation-Block: `ctoLine` / `ctoMeta`)
- [ ] **Impressumsdaten** in `app/impressum/page.tsx` eintragen (ersetzt „Wird ergänzt.“):
  Adresse, Geschäftsführung, Firmenbuchnummer/Registergericht, UID (Umsatzsteuer-ID).
- [ ] **Medienrechte und Einwilligungen** für alle öffentlich sichtbaren Personen dokumentieren.
- [ ] Die aktuellen Audience- und MQS-Medien liegen als weboptimierte Dateien in `public/media`.
  Originaldateien werden außerhalb des Web-Repositories archiviert.
- [ ] **Social-Handles verifizieren** (aktuell im Footer & JSON-LD hinterlegt):
  `linkedin.com/company/vanescience`, `instagram.com/vanescience` — Links müssen live sein.

## 3. Leads und Anfragen

- [ ] In Sanity Studio (`/studio`) die Dokumente vom Typ **`waitlistSignup`** öffnen.
- [ ] Pro Eintrag werden gespeichert: `email`, `segment`, `locale`, `source`, `createdAt`.
  Dedupe erfolgt automatisch (gleiche E-Mail wird nicht doppelt angelegt).
- [ ] Dokumente vom Typ **`audienceInquiry`** für Athlete-, Coach- und Partner-Anfragen prüfen.
- [ ] Eine Benachrichtigung oder CRM-Weiterleitung einrichten, damit neue Sanity-Dokumente nicht
  unbemerkt bleiben.
- [ ] Plattformseitiges Rate-Limit und Monitoring für `/api/waitlist` und `/api/inquiry` aktivieren.

## 4. Metadaten und sichtbare Aussagen

- [ ] Seitentitel, Beschreibungen, Open Graph, JSON-LD und sichtbare Copy gegeneinander prüfen.
- [ ] Keine Preise, FAQs oder Produktclaims in strukturierten Daten veröffentlichen, die auf der
  jeweiligen Seite nicht sichtbar und freigegeben sind.
- [ ] Social-Handles, Canonicals und Produktionsdomain nach dem Domain-Switch erneut prüfen.

## 5. Seed-Script-Hinweis

- [ ] `scripts/seed-homepage.mjs` bedient nur die ältere CMS-Homepage und nicht die aktuellen
  `/for/*` Inhalte aus `lib/audience-content.ts`.
- [ ] Ausführung überschreibt bestehende CMS-Inhalte. Vorher Backup erstellen und
  `SANITY_SEED_CONFIRM=<project-id>/<dataset>` exakt für den beabsichtigten Lauf setzen.
- [ ] `SANITY_SEED_TOKEN` nur lokal verwenden und nicht als Hosting-Variable hinterlegen.

## 6. Technische Release-Gates

- [ ] Frischer Clone außerhalb eines synchronisierten Cloud-Ordners.
- [ ] Node 22 und die in `package.json` festgelegte npm-Version verwenden.
- [ ] `npm ci`, `npm run check`, `npm test` und `npm run build` sind erfolgreich.
- [ ] `npm audit --omit=dev` enthält keine ungeklärten kritischen oder hohen Findings.
- [ ] Preview-Deploy mit echten Sanity-Lesevariablen und einem sicheren Test-Dataset geprüft.
- [ ] Keine `.env.local`, Tokens, lokalen Logs oder PID-Dateien im Commit.
- [ ] Cookie-Einstellungen können nachträglich geöffnet und Analytics-Einwilligung widerrufen werden.
- [ ] Finales Impressum und finale Datenschutzprüfung durch die Verantwortlichen freigegeben.

## 7. Sprachregeln-Merkblatt (für alle zukünftigen Texte)

VANE ist **kein Medizinprodukt**. Folgende Begriffe/Claims sind zu **vermeiden** (EN & DE), damit keine
medizinischen oder unbelegten Versprechen entstehen:

- „Diagnose“ / „diagnostisch“ / **„Bewegungsdiagnostik“**
- „klinisch validiert“ / „clinically validated“
- „Patient“ / „patient“
- Verletzungen/Krankheiten **vorhersagen, verhindern oder erkennen**
  („predict/prevent/detect injury/disease“)
- Alt-Markenname **„VIDE“** (nur die technischen Legacy-Migrationsschlüssel
  `vide-lang` / `vide-cookie-consent` dürfen im Code verbleiben).

Erlaubte, geprüfte Formulierungen: „Informations-Tool für Bewegungsqualität“, „Mess- und
Entscheidungsunterstützung“, „kann Asymmetrien und Risikoindikatoren sichtbar machen“.
Datenschutz-Wording: „DSGVO-konform / nach europäischem Datenschutzrecht verarbeitet“ statt
konkreter Server-Standort-Zusagen.
