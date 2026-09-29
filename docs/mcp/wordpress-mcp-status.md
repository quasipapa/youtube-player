# Aktueller Stand: WordPress MCP und Codex

## Ziel und Anforderungen

Der WordPress MCP Adapter soll WordPress kontrolliert mit Codex verbinden. Der geplante Workflow umfasst das Lesen von WordPress-Zuständen, das Vorbereiten und Erstellen redaktioneller Beiträge, Änderungen an bestehenden Inhalten, die Verwaltung von Kategorien, Schlagwörtern, Medien und SEO-Daten sowie eine nachvollziehbare Bestätigung jeder Schreibaktion.

Beiträge sollen standardmäßig als Entwurf gespeichert werden. Eine Veröffentlichung, Plugin-/Theme-/Core-Änderung oder sonstige administrative Aktion benötigt eine ausdrückliche Nutzerfreigabe. WordPress bleibt das führende System für Zustände und Berechtigungen.

## Erkenntnisse zum WordPress MCP Adapter

Der Default-Server stellt diese Meta-Tools bereit:

- `mcp-adapter-discover-abilities`
- `mcp-adapter-get-ability-info`
- `mcp-adapter-execute-ability`

Der Adapter macht nur registrierte und für MCP freigegebene WordPress Abilities verfügbar. Bei der bisherigen Discovery wurden folgende Abilities gefunden:

- `core/get-site-info`
- `core/get-user-info`
- `core/get-environment-info`
- `ai/alt-text-generation`

Eine Ability zum Erstellen von Beiträgen war bisher nicht vorhanden. Der Adapter kann Beiträge grundsätzlich erstellen, wenn eine entsprechende Ability registriert wird. Diese benötigt unter anderem ein Eingabeschema für Titel, Inhalt und Status, eine Implementierung über `wp_insert_post()`, eine strukturierte Rückgabe sowie eine Capability-Prüfung. Als Standardstatus ist `draft` vorgesehen.

## WordPress-Berechtigungen

Der für MCP verwendete WordPress-Benutzer muss in der aktuellen Konfiguration die Rolle **Administrator** besitzen. **Redakteur** ist für die aktuell bereitgestellten Abilities nicht ausreichend und führte zu `Permission denied`.

Das Application Password authentifiziert den Benutzer, erweitert aber nicht seine WordPress-Capabilities. Berechtigungen werden in WordPress über Rollen, Capabilities und die `permission_callback`-Prüfungen der Abilities erzwungen.

## Secret-Verwaltung

Windows und WSL verwenden getrennte Codex-Konfigurationen:

- Windows/Codex Desktop: `%USERPROFILE%\\.codex\\config.toml`
- WSL-Codex CLI: `/home/<linux-user>/.codex/config.toml`

Bei paralleler Nutzung müssen beide Konfigurationen den MCP-Server enthalten. Credentials gehören nicht in Git, Projektdateien, Chatnachrichten oder Logs.

Verwendet werden Bitwarden Secrets Manager (`bws`), ein schreibgeschützter RO-Token und das Secret `WP_MCP_AUTHORIZATION`. Letzteres enthält den vollständigen WordPress-Authorization-Header. Der RW-Machine-Account wird nur für die einmalige Secret-Einrichtung verwendet.

## Wrapper für Codex

### WSL

```bash
scripts/codex-secrets status
scripts/codex-secrets run -- codex
```

Der WSL-Wrapper liest den lokalen RO-Token und injiziert das Secret nur in den gestarteten Codex-Prozess und dessen Unterprozesse.

### Windows

```powershell
.\scripts\codex-secrets.ps1 status
.\scripts\codex-secrets.ps1 run codex
```

Der Windows-Wrapper verwendet den DPAPI-geschützten RO-Token und stellt das Secret ebenfalls nur temporär über `bws run` bereit. Nach Prozessende werden die Tokenvariablen entfernt.

## Testvoraussetzungen

### WSL

1. MCP-Block in der Linux-`config.toml` eintragen.
2. Secret-Wrapper und RO-Token einrichten.
3. Mit `codex mcp list` prüfen, ob der Server registriert ist.
4. Codex über den WSL-Wrapper starten.
5. Im Chat `/mcp` und anschließend einen lesenden Discovery-Test ausführen.
6. Erst nach erfolgreicher Authentifizierung einen Entwurfstest durchführen.

### Windows/Codex Desktop

1. MCP-Block in der Windows-`config.toml` eintragen.
2. DPAPI-geschützten RO-Token einrichten.
3. Codex Desktop vollständig beenden.
4. Codex Desktop über den Windows-Wrapper starten.
5. MCP-Status und `/mcp` prüfen.
6. Den lesenden Discovery-Test wiederholen.

Ein erfolgreicher WSL-Test beweist nicht automatisch die Authentifizierung in Codex Desktop, da beide Umgebungen getrennte Konfigurationen, Tokenablagen und Prozesse verwenden.

## Aktueller Funktionsumfang des Projekt-Plugins

Das Projekt-Plugin ist ein datenschutzbewusster Gutenberg-Block für öffentliche YouTube-Playlists. Es bietet derzeit:

- Verarbeitung und Normalisierung von Playlist-IDs und Playlist-URLs,
- Eingabevalidierung,
- responsive Größen- und Seitenverhältnis-Einstellungen,
- Vor-/Zurück-Navigation,
- optionalen Playlist-Titel,
- Editor-Vorschau,
- eine Verfügbarkeitsprüfung über die YouTube-IFrame-API,
- Nutzung von `youtube-nocookie.com`,
- eine Einwilligungsschranke vor dem Laden externer Inhalte,
- playlistbezogene Speicherung und Widerruf der Einwilligung,
- Tastatur- und Screenreader-Unterstützung.

Das Plugin stellt selbst keine MCP-Abilities zum Erstellen oder Ändern von WordPress-Beiträgen bereit.

## Alternative und ergänzende Plugins

### Postnova for MCP

Ergänzt den bestehenden WordPress MCP Adapter um Blog-Abilities wie `blog/create-post`, `blog/update-post`, `blog/get-post` und `blog/schedule-post`. Es ist damit die naheliegendste Erweiterung der aktuellen Architektur. Berechtigungen werden weiterhin über WordPress-Capabilities geprüft.

### WSP MCP

Ein eigenständiger MCP-Server, der Beiträge, Seiten, Kategorien, Schlagwörter und Kommentare lesen, erstellen, ändern und löschen kann. Schreibfähigkeiten sind einzeln steuerbar. Er verwendet einen eigenen MCP-Endpunkt und ersetzt damit den bisherigen Adapterzugang.

### AI Engine

Ein umfangreicherer eigenständiger MCP-Server mit Beitrags- und Medienverwaltung, Kommentaren, SEO und weiteren WordPress-Funktionen. Die Werkzeuge sind laut Plugin-Dokumentation permission-aware.

### Easy MCP AI

Unterstützt Beitrags- und Seitenverwaltung, OAuth/Bearer-Authentifizierung, Token-Berechtigungen, Audit-Logs und Rate-Limits. Mit „Force Draft on Create“ können neue Beiträge unabhängig von der angeforderten Aktion immer als Entwurf gespeichert werden.

## Empfehlung

Für die bestehende Adapter-Konfiguration sollte zuerst eine kompatible Erweiterung wie Postnova for MCP geprüft werden. Wenn ein eigenständiger MCP-Server mit granularen Token-Rechten, Audit-Log und erzwungenen Entwürfen gewünscht ist, sind Easy MCP AI oder WSP MCP geeignete Kandidaten.

Vor jeder Installation sind Wartungsstatus, Codequalität, Datenschutz, Backups und Rollback-Möglichkeiten zu prüfen. Auf einer Live-Instanz sollten Schreibrechte möglichst begrenzt und Beiträge standardmäßig als Entwürfe angelegt werden.

## Weiterführende lokale Dokumentation

- [WordPress MCP Codex Plan](wordpress-mcp-codex-plan.md)
- [Anonymisierte MCP-Konfigurationsvorlage](wordpress-mcp-server.toml)
