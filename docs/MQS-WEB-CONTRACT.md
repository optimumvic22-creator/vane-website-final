# MQS-Web-Vertrag

Dieser Vertrag stabilisiert die interaktive MQS-Darstellung der Website. Er
definiert keine wissenschaftliche Bewertungslogik und ersetzt keine
MQS-Assessment-Ausgabe.

## Autoritative Quelle

Die MQS Engine ist für Domänen, Reihenfolge, Gewichte, Scoremodell und
Versionierung maßgeblich:

- `packages/engine/mqs-engine/src/domain-registry.js` definiert
  `MQS_ENGINE_VERSION`, die geordnete `DOMAIN_REGISTRY` und
  `DEFAULT_DOMAIN_WEIGHTS`.
- `packages/engine/mqs-engine/src/score-model-bundle.js` bindet diese Werte an
  das Default-Bundle `mqs-score-model-default@0.1.0`.
- `packages/engine/mqs-engine/MQS_ENGINE_HANDBUCH.md` beschreibt die
  wissenschaftliche und operative Grenze der 0-bis-100-Engine-Ausgabe.

Die Website spiegelt nur einen eng begrenzten Teil dieses Vertrags. Bei einem
Widerspruch dürfen Websitewerte nicht als neue Wahrheit behandelt werden. Die
Engine und das freigegebene Scoremodell-Bundle müssen zuerst geklärt und
versioniert werden.

## Aktuell gebundener Stand

| Feld | Gebundener Wert |
|---|---|
| Web-Vertrags-ID | `mqs-website-interaction-contract` |
| Web-Vertragsversion | `1.0.0` |
| Engine-Version | `0.2.0-provisional` |
| Scoremodell-Bundle | `mqs-score-model-default@0.1.0` |
| Engine-Skala | 0 bis 100 |
| Darstellungsbereich der Website | 1 bis 99 |
| Profilkopplung | gleicher Offset, Rundung, danach Begrenzung je Domäne |

Der Bereich 1 bis 99 gehört ausschließlich zum öffentlichen Explorer. Er
ändert die 0-bis-100-Skala der Engine nicht.

## Domänenspiegel

| Reihenfolge | Websitecode | Engine-ID | Gewicht |
|---:|---|---|---:|
| 1 | `GAIT` | `gait` | 0,16 |
| 2 | `POST` | `postural_control` | 0,15 |
| 3 | `FORCE` | `force_capacity` | 0,16 |
| 4 | `POWER` | `power` | 0,14 |
| 5 | `MOTOR` | `motor_control` | 0,16 |
| 6 | `NEURO` | `neuro_response` | 0,13 |
| 7 | `DTC` | `dual_task_cost` | 0,10 |

Die Websiteberechnung ist eine illustrative Darstellung. Sie bildet keine
Hard Gates, DQI-Prüfung, Score Eligibility, Normauflösung, Unsicherheit oder
Claim Gates der Engine nach. Das Verschieben des Gesamtwerts wendet denselben
Offset auf alle dargestellten Domänen an und erhält deren Abstände, bis eine
einzelne Domäne an 1 oder 99 begrenzt wird. Daraus folgt keine kausale
Abhängigkeit zwischen Domänen.

## Sicheres Änderungsverfahren für Partner

1. Die Änderung zuerst in der MQS Engine prüfen und als neue Engine- oder
   Bundle-Version freigeben. Websitecode darf keine Engineänderung vorwegnehmen.
2. Geordnete Domänen-IDs, Gewichte, Scoregrenzen und relevante
   Berechnungsregeln direkt aus der freigegebenen Enginequelle vergleichen.
3. In `lib/mqs-interaction.ts` Engine-Referenz und gespiegelte Konstanten
   bewusst aktualisieren. Bei jeder Vertragsänderung
   `MQS_WEB_CONTRACT_VERSION` erhöhen.
4. Die Golden-Erwartungen in `lib/mqs-interaction.test.ts` im selben
   Änderungssatz aktualisieren. Ein fehlschlagender Golden-Test ist ein
   Prüfauftrag, kein Grund für eine automatische Snapshot-Übernahme.
5. Zuerst die maßgeblichen Engine-Matrizen ausführen, danach mindestens:

   ```text
   npm.cmd test -- lib/mqs-interaction.test.ts
   npm.cmd run typecheck
   npm.cmd run lint -- lib/mqs-interaction.ts lib/mqs-interaction.test.ts
   ```

6. Vor Freigabe bestätigen, dass sichtbare Texte, Labels, Dashboarddarstellung
   und Nutzerverhalten unverändert bleiben, sofern dafür keine gesonderte
   Anforderung und Freigabe vorliegt.

Gewichte, Codes oder Grenzen dürfen nicht aus Marketingtexten, Screenshots oder
einer Partnerkopie übernommen werden. Eine neue Website-Vertragsversion ist
erst freigabefähig, wenn Engine-Referenz, Golden-Test und Dokumentation
denselben Stand nennen.
