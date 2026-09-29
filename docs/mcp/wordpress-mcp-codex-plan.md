# Anonymisierter Plan: WordPress MCP Adapter mit Codex

## Ziel

Der WordPress MCP Adapter soll als kontrollierte Schnittstelle zwischen einer WordPress-Instanz und Codex dienen. Codex soll WordPress-Inhalte analysieren und vorbereiten können; schreibende und administrative Aktionen bleiben nachvollziehbar, rollenbasiert und freigabepflichtig.

Wichtig: Der Adapter ist kein vollständiger WordPress-Skill-Katalog. Er übersetzt registrierte WordPress-Abilities in MCP-Tools, MCP-Ressourcen und MCP-Prompts. Die tatsächlich verfügbaren Funktionen hängen von der WordPress-Version, den installierten Plugins und den explizit freigegebenen Abilities ab.

## Klare Aufgabenteilung

### Nutzer

Der Nutzer trägt die fachliche und organisatorische Verantwortung:

- Ziel, Zielgruppe, Tonalität und fachliche Aussage eines Beitrags vorgeben.
- Quellen, Bilder, Marken- und Nutzungsrechte bereitstellen oder bestätigen.
- Festlegen, ob ein Beitrag Entwurf bleiben oder veröffentlicht werden soll.
- Änderungen an bestehenden Inhalten fachlich prüfen.
- Plugin-, Theme- oder Core-Updates ausdrücklich freigeben.
- Risiken, Wartungsfenster, Backups und Rollback-Entscheidungen verantworten.
- Bei unklaren oder widersprüchlichen Daten die Entscheidung treffen.

### Codex

Codex übernimmt die technische und vorbereitende Arbeit:

- Verfügbare MCP-Tools, Ressourcen und Prompts entdecken.
- WordPress-Zustände lesen und vor einer Änderung analysieren.
- Beiträge, Metadaten, Kategorien und Schlagwörter nach den Vorgaben des Nutzers erstellen oder vorbereiten.
- Eingaben validieren und fehlende Informationen benennen.
- Änderungen als Entwurf oder Vorschlag vorbereiten.
- Vor jeder riskanten Aktion Auswirkungen, Ziel und erwartetes Ergebnis zusammenfassen.
- Nur freigegebene Tools und die Berechtigungen des verbundenen WordPress-Benutzers verwenden.
- Nach einer Aktion die tatsächliche WordPress-Antwort, ID, Status und URL ausgeben.
- Fehler nicht verschleiern und keine erfolgreiche Änderung behaupten, wenn WordPress sie nicht bestätigt.

### WordPress und MCP-Adapter

WordPress bleibt das System of Record und erzwingt die technischen Berechtigungen:

- Abilities registrieren und ihre Schemas bereitstellen.
- MCP-Freigaben über `meta.mcp.public` oder `meta.public` umsetzen.
- Berechtigungen über `permission_callback` und WordPress-Capabilities prüfen.
- Aktionen tatsächlich ausführen oder ablehnen.
- Ergebnisse und Fehler an Codex zurückgeben.

Eine Codex-Anweisung ersetzt niemals WordPress-Berechtigungen.

## Verfügbare MCP-Komponenten

### Tools

Tools führen Aktionen aus, zum Beispiel Inhalte lesen, Entwürfe erstellen, Beiträge ändern oder Medien zuordnen. Schreibende Tools müssen grundsätzlich mit einer Codex-Bestätigung beziehungsweise einem geeigneten Freigabemodus betrieben werden.

### Ressourcen

Ressourcen liefern Kontext, etwa Site-Konfiguration, Umgebungsdaten oder redaktionelle Strukturen. Sie sollten bevorzugt für lesende Informationen eingesetzt werden.

### Prompts

Prompts kapseln wiederverwendbare Arbeitsanweisungen, etwa SEO-Prüfungen, Content-Reviews oder Redaktionsbriefings. Sie führen nicht automatisch zu einer Veröffentlichung.

### Adapter-Meta-Tools

Der Default-Server stellt typischerweise diese Fähigkeiten bereit:

- `mcp-adapter-discover-abilities`
- `mcp-adapter-get-ability-info`
- `mcp-adapter-execute-ability`

Damit kann Codex die vorhandenen Abilities entdecken, ihre Schemas lesen und sie ausführen, sofern sie öffentlich und für den verbundenen Benutzer erlaubt sind.

## Verantwortungsmodell für Kern-Workflows

| Workflow | Nutzer liefert/entscheidet | Codex erledigt | Freigabe |
|---|---|---|---|
| Blogbeitrag erstellen | Briefing, Quellen, Zielstatus | Recherchekontext strukturieren, Text erstellen, Entwurf anlegen | Vor dem Anlegen: Bestätigung bei produktiven Daten; vor Veröffentlichung immer explizit |
| Bestehenden Beitrag ändern | Beitrag, gewünschte Änderung, fachliche Prüfung | aktuellen Inhalt lesen, Änderung vorschlagen und umsetzen | Vor dem Speichern; bei umfangreichen Änderungen zusätzlich Diff bestätigen |
| Beitrag veröffentlichen | finale fachliche Freigabe | Status ändern und Ergebnis verifizieren | Immer explizit durch Nutzer |
| Kategorien/Tags pflegen | gewünschte Taxonomie | vorhandene Begriffe prüfen, Vorschläge erstellen, zuordnen | Vor neuen oder massenhaften Begriffen |
| Medien verwenden | Datei oder bestätigte Quelle, Rechte | Medium suchen/hochladen, Alt-Text und Zuordnung vorbereiten | Vor Upload und bei externen Quellen |
| SEO-Metadaten ändern | SEO-Ziel und Vorgaben | bestehende Werte analysieren, Vorschlag erstellen, speichern | Vor dem Speichern |
| Plugin-Updates prüfen | gewünschte Plugins und Wartungsfenster | verfügbare Updates und Risiken zusammenfassen | Keine Schreibaktion ohne separate Freigabe |
| Plugin aktualisieren | ausdrücklicher Plugin-Slug und Freigabe | genau dieses Update ausführen, Smoke-Test durchführen, Ergebnis melden | Immer explizit; kein „alle aktualisieren“ |
| Theme/Core ändern | Wartungsauftrag und Rollback-Plan | nur vorbereiten oder über dedizierte Ability ausführen | Immer explizit und administrativ |

## Empfohlene Ausbaustufen

### Stufe 1: Lesen und redaktionelle Entwürfe

Zuerst sollten nur diese Funktionsgruppen aktiviert werden:

```text
content/list-posts
content/get-post
content/create-draft
content/update-post
content/list-categories
content/list-tags
media/search
seo/get-metadata
```

Regel: Beiträge werden standardmäßig als Entwurf gespeichert. Veröffentlichung ist ein separater, bestätigungspflichtiger Schritt.

### Stufe 2: Kontrollierte redaktionelle Änderungen

Danach können folgende Funktionen hinzukommen:

```text
content/publish-post
content/set-taxonomy
media/upload
media/set-featured-image
seo/update-metadata
content/check-links
content/check-required-fields
```

Jede Ability benötigt ein präzises Input- und Output-Schema, einen Permission Callback und aussagekräftige MCP-Annotationen wie read-only, destructive und idempotent.

### Stufe 3: Wartung

Plugin-, Theme- und Core-Updates sollten nicht über allgemeine Shell- oder WP-CLI-Rechte erfolgen. Stattdessen wird ein eigenes Wartungs-Plugin mit eng begrenzten Abilities erstellt, zum Beispiel:

```text
maintenance/list-plugin-updates
maintenance/get-plugin-details
maintenance/update-approved-plugin
maintenance/get-site-health
maintenance/run-smoke-tests
```

`maintenance/update-approved-plugin` sollte mindestens:

- nur eine Allowlist von Plugin-Slugs akzeptieren,
- niemals pauschal alle Plugins aktualisieren,
- Version und Changelog vorab melden,
- einen Backup- oder Snapshot-Status verlangen,
- ein Wartungsfenster voraussetzen,
- nach dem Update definierte Smoke-Tests ausführen,
- das Ergebnis auditierbar protokollieren,
- eine Rollback-Option dokumentieren.

## Berechtigungs- und Benutzerkonzept

Für jede Umgebung wird ein separater WordPress-Benutzer eingesetzt:

| Umgebung | Zweck | Grundsatz |
|---|---|---|
| Staging | Tests und Entwicklung | Schreibrechte für Entwürfe und freigegebene Tests |
| Produktion/Live | Redaktion | geringstmögliche Rechte, keine Wartungsrechte |
| Wartung | Updates | separater Benutzer, nur bei Bedarf aktiviert |

### Erforderliche Rolle für den MCP-Benutzer

Für den aktuell eingesetzten WordPress-MCP-Adapter muss der authentifizierte
Benutzer die WordPress-Rolle **Administrator** (`admin`) besitzen. Die Rolle
**Redakteur** (`editor`) ist für den Zugriff auf die aktuell bereitgestellten
Abilities nicht ausreichend und führt beim Ausführen von `core/get-site-info`
zu `Permission denied`.

Die Rolle wird in WordPress unter `Benutzer → [MCP-Benutzer]` gesetzt. Ein
Application Password authentifiziert den Benutzer lediglich; es erweitert
nicht dessen WordPress-Capabilities. Änderungen an Rollen oder Capabilities
müssen daher in WordPress vorgenommen werden, nicht in Codex.

Application Passwords dürfen nicht in Git, `AGENTS.md`, Projektdateien oder Chatnachrichten gespeichert werden. Sie gehören in eine lokale Secret-Verwaltung oder Umgebungsvariablen.

## Einbindung in Codex unter Windows mit WSL

### Welche Codex-Umgebung verwendet welche Konfiguration?

Windows und WSL haben getrennte Codex-Konfigurationen:

| Codex-Umgebung | Konfigurationsdatei | Typischer Aufruf |
|---|---|---|
| Codex Desktop oder Windows-CLI | `%USERPROFILE%\\.codex\\config.toml` | Codex Desktop, `codex.exe` |
| Codex CLI innerhalb von WSL | `/home/<linux-user>/.codex/config.toml` | `codex` in einem WSL-Terminal |
| projektlokal | `<projekt>/.codex/config.toml` | nur in einem vertrauenswürdigen Projekt |

Die WSL-Integration des Desktops ändert daran nichts: Ein im WSL-Terminal gestartetes `codex` liest die Linux-Datei. Codex Desktop liest die Windows-Datei. Wenn beide Oberflächen verwendet werden sollen, muss der MCP-Eintrag in beiden Dateien vorhanden sein. Der Endpunkt darf in beiden Konfigurationen identisch sein; Credentials müssen in der jeweiligen Umgebung verfügbar sein.

Die Dateien unter `docs/mcp/` sind Vorlagen und werden nicht automatisch geladen. Die anonymisierte Vorlage liegt in [`wordpress-mcp-server.toml`](wordpress-mcp-server.toml). Eine lokale, nicht versionierte Konfiguration kann in `docs/mcp/wordpress-mcp-server.local.toml` vorbereitet werden.

### Schritt 1: Secret im Bitwarden Secrets Manager vorbereiten

Der aktuelle Wrapper verwendet Bitwarden Secrets Manager (`bws`), nicht den
Bitwarden Password Manager (`bw`). Es gibt daher keinen Master-Passwort-Unlock
im MCP-Ablauf und keine manuelle Credential-Datei für den MCP-Header.

Der Wrapper verwendet das Projekt `codex-apps`, im Normalbetrieb den RO-Token
und das Secret `WP_MCP_AUTHORIZATION`. Der Secret-Wert ist der vollständige
WordPress-Authorization-Header:

```text
Basic <base64-von-benutzer-und-application-password>
```

Das Secret wird einmalig mit dem RW-Machine-Account angelegt. In WSL:

```bash
cd /home/<secrets-project>
read -r -s -p 'BWS RW-Token: ' BWS_ACCESS_TOKEN_RW
printf '\\n'
export BWS_ACCESS_TOKEN_RW
scripts/codex-secrets set WP_MCP_AUTHORIZATION
unset BWS_ACCESS_TOKEN_RW
```

Die Eingabe erfolgt verdeckt. Der RW-Token wird nur für diesen Vorgang
verwendet. Der Normalbetrieb nutzt ausschließlich den RO-Token.

### Schritt 2: WSL-Codex mit dem WSL-Wrapper starten

Der WSL-Wrapper liest den RO-Token aus:

```text
/home/<linux-user>/.config/codex-secrets/bws-ro.token
```

Die Datei muss Modus `600` besitzen. Der Wrapper prüft dies selbst.

Zunächst prüfen:

```bash
cd /home/<secrets-project>
scripts/codex-secrets status
```

Codex wird anschließend nicht direkt, sondern über `bws run` gestartet:

```bash
scripts/codex-secrets run -- codex
```

`bws run` injiziert `WP_MCP_AUTHORIZATION` nur in den gestarteten Codex-
Prozess und dessen Unterprozesse. Das Secret wird nicht in der Shell-Ausgabe
angezeigt.

### Schritt 3: Windows-Codex mit dem Windows-Wrapper starten

Für Windows wird der native Wrapper verwendet:

```text
scripts\\codex-secrets.ps1
```

Er verwendet die vorhandene CLI:

```text
D:\\apps\\bitwarden-cli\\bws.exe
```

Der RO-Token wird einmalig über das Setup-Skript DPAPI-geschützt abgelegt:

```powershell
.\\scripts\\Set-CodexBwsToken.ps1
```

Danach prüfen:

```powershell
.\\scripts\\codex-secrets.ps1 status
```

Codex CLI oder ein Windows-Prozess wird über den Wrapper gestartet:

```powershell
.\\scripts\\codex-secrets.ps1 run codex
```

Der Wrapper lädt den RO-Token aus
`%LOCALAPPDATA%\\CodexSecrets\\bws-ro.token.dpapi`, ermittelt das Projekt
`codex-apps` und injiziert die Secrets über `bws run`. Nach dem Prozessende
werden die Tokenvariablen entfernt.

### Schritt 4: TOML-Eintrag in WSL konfigurieren

Wenn die WSL-Codex-CLI verwendet wird, den folgenden Eintrag in
`/home/<linux-user>/.codex/config.toml` übernehmen:

```toml
[mcp_servers.wordpress_staging]
url = "https://<wordpress-host>/wp-json/mcp/mcp-adapter-default-server"
env_http_headers = { Authorization = "WP_MCP_AUTHORIZATION" }
default_tools_approval_mode = "writes"
startup_timeout_sec = 20
tool_timeout_sec = 120
enabled = true

enabled_tools = [
  "mcp-adapter-discover-abilities",
  "mcp-adapter-get-ability-info",
  "mcp-adapter-execute-ability"
]

[mcp_servers.wordpress_staging.tools.mcp-adapter-execute-ability]
approval_mode = "writes"
```

Die konkrete URL wird nur in der lokalen Konfiguration eingesetzt. Die drei zunächst erlaubten Tools dienen der Bestandsaufnahme; weitere Tools werden erst nach Prüfung der Ability-Schemas und Berechtigungen ergänzt.

### Schritt 5: TOML-Eintrag in Windows konfigurieren

Wenn Codex Desktop oder die Windows-CLI verwendet wird, denselben MCP-Block in
`%USERPROFILE%\\.codex\\config.toml` eintragen. Die URL und die Tool-Allowlist
sind identisch. Die Variable `WP_MCP_AUTHORIZATION` wird nicht manuell gesetzt,
sondern durch den Windows-Wrapper über `bws run` injiziert.

Wird ausschließlich innerhalb von WSL gearbeitet, ist die Windows-Datei nicht
erforderlich. Werden WSL-CLI und Desktop parallel verwendet, müssen beide
Konfigurationen gepflegt und die jeweiligen Wrapper verwendet werden.

### Schritt 6: Initialen Verbindungstest in WSL durchführen

Zuerst ohne Schreibaktion prüfen:

```bash
codex mcp list
```

Erwartet wird ein Eintrag wie:

```text
wordpress_staging
```

Danach Codex innerhalb von WSL starten:

```bash
cd /home/<secrets-project>
scripts/codex-secrets run -- codex
```

Im Codex-Chat ausführen:

```text
/mcp
```

Der Server muss als aktiv beziehungsweise erreichbar erscheinen. Anschließend in natürlicher Sprache testen:

```text
Prüfe den WordPress-MCP-Server. Liste die verfügbaren Tools, Ressourcen und Prompts auf. Führe keine schreibende Aktion aus.
```

Danach:

```text
Nutze die WordPress-MCP-Discovery, um die verfügbaren WordPress-Abilities mit Name, Beschreibung, Eingabeschema und erforderlichen Berechtigungen aufzulisten.
```

### Schritt 7: Verbindung in Codex Desktop testen

Nach Eintrag in der Windows-Konfiguration:

1. Codex Desktop vollständig beenden.
2. Sicherstellen, dass `bws-ro.token.dpapi` eingerichtet ist.
3. Codex Desktop über `scripts\\codex-secrets.ps1 run ...` starten, damit `bws run` die Secrets injiziert.
4. Settings → MCP servers öffnen und den Serverstatus prüfen.
5. Im Chat `/mcp` ausführen.
6. Den gleichen lesenden Discovery-Test wie in WSL ausführen.

Ein erfolgreicher WSL-Test beweist nicht automatisch, dass Codex Desktop
authentifiziert ist, weil beide Umgebungen getrennte Wrapper, Tokenablagen und
Prozesse verwenden.

### Schritt 8: Kontrollierter Schreibtest

Erst wenn Discovery und Authentifizierung funktionieren:

```text
Erstelle auf Staging einen Beitrag mit dem Titel „MCP-Integrationstest – Entwurf“.
Speichere ihn ausschließlich als Entwurf. Veröffentliche ihn nicht.
Gib Post-ID, Status und URL zurück.
```

Der Test gilt nur als erfolgreich, wenn WordPress den Status `draft` bestätigt. Plugin-, Theme- oder Core-Updates gehören nicht in diesen initialen Test.

### Fehlerdiagnose

| Ergebnis | Wahrscheinliche Ursache |
|---|---|
| `No MCP servers configured yet` | Falsche Umgebung oder MCP-Block fehlt in der dortigen `config.toml` |
| `401 Unauthorized` | `WP_MCP_AUTHORIZATION` fehlt im Codex-Prozess oder ist falsch |
| `403 Forbidden` oder `Permission denied` | MCP-Benutzer ist nicht als **Administrator** angelegt; **Redakteur** ist für die aktuellen Abilities nicht ausreichend |
| `404 Not Found` | Endpunkt oder Server-ID ist falsch |
| Server erscheint, Tools fehlen | Abilities sind nicht für MCP öffentlich oder Allowlist filtert sie heraus |
| WSL funktioniert, Desktop nicht | Windows-Wrapper, DPAPI-Token oder Windows-TOML fehlt |

Falls der direkte Streamable-HTTP-Transport nicht funktioniert, kann als Fallback der lokale WordPress-MCP-Proxy über STDIO verwendet werden. Auch dann müssen WSL und Windows separat konfiguriert und authentifiziert werden.

## Dauerhafte Codex-Arbeitsregeln

Diese Regeln können in einer projektspezifischen `AGENTS.md` festgehalten werden:

```text
- Vor jeder Schreibaktion den aktuellen Zustand lesen.
- Beiträge standardmäßig als Entwurf speichern.
- Niemals veröffentlichen ohne explizite Bestätigung.
- Bestehende Inhalte vor dem Überschreiben zusammenfassen und bei größeren Änderungen einen Diff zeigen.
- Plugins nur aktualisieren, wenn der Nutzer den konkreten Plugin-Slug und die Freigabe nennt.
- Niemals „alle Plugins aktualisieren“ ausführen.
- Bei fehlenden Rechten oder unklaren Daten abbrechen und die Ursache nennen.
- Nach jeder Schreibaktion WordPress-ID, Status und URL ausgeben.
- Keine Zugangsdaten in Antworten, Dateien oder Logs ausgeben.
```

## Bestandsaufnahme vor der Umsetzung

Da der Adapter nur registrierte und freigegebene Abilities sichtbar macht, ist eine authentifizierte Inventarisierung erforderlich:

- WordPress-Version und Adapter-Version feststellen.
- `tools/list`, `resources/list` und `prompts/list` ausführen.
- Abilities über `mcp-adapter-discover-abilities` erfassen.
- Input-/Output-Schemas und Permission Callbacks dokumentieren.
- Vorhandene Content-, Medien-, SEO- und Wartungs-Abilities klassifizieren.
- Fehlende Funktionen als eigene, versionierte Abilities planen.

Das Ergebnis dieser Inventarisierung ist die verbindliche Tool-Allowlist für Staging und Produktion.

## Akzeptanzkriterien

Das Setup gilt als erfolgreich, wenn:

1. Codex den MCP-Server in `/mcp` anzeigt.
2. Codex verfügbare Abilities und ihre Schemas lesen kann.
3. Codex einen Testbeitrag als Entwurf anlegen kann.
4. Codex vor jeder Veröffentlichung eine Nutzerfreigabe verlangt.
5. ein Benutzer ohne `publish_posts` nicht veröffentlichen kann.
6. Codex jede tatsächliche Schreibaktion mit ID, Status und URL bestätigt.
7. nicht vorhandene Fähigkeiten nicht simuliert werden.
8. Plugin-Updates nur für explizit erlaubte Slugs und nach manueller Freigabe möglich sind.
9. Fehler, Berechtigungsprobleme und Rollback-Anforderungen nachvollziehbar protokolliert werden.

## Quellen

- [WordPress MCP Adapter](https://github.com/WordPress/mcp-adapter)
- [WordPress MCP Adapter: Getting Started](https://github.com/WordPress/mcp-adapter/blob/trunk/docs/getting-started/README.md)
- [WordPress MCP Adapter: Creating Abilities](https://github.com/WordPress/mcp-adapter/blob/trunk/docs/guides/creating-abilities.md)
- [WordPress MCP Adapter: CLI Usage](https://github.com/WordPress/mcp-adapter/blob/trunk/docs/guides/cli-usage.md)
- [OpenAI Docs: Model Context Protocol in Codex](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)
- [OpenAI Docs: Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference)
