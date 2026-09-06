# YouTube Playlist Player – Anforderungen und Umsetzungsplan

Stand: 6. September 2026
Status: Milestone M0 in Arbeit

## 1. Ziel des Projekts

Das Projekt liefert ein frei verfügbares WordPress-Plugin, das eine öffentliche
YouTube-Playlist als Gutenberg-Block einbindet. Der Player zeigt initial das erste
Video der Playlist und bietet außerhalb des YouTube-Players deutlich sichtbare
Steuerelemente für das erste, vorherige, nächste und letzte Video.

Das Plugin soll lokal unter WSL und Docker entwickelt und getestet werden. GitHub
dient als zentrale Quelle für Code, Anforderungen, Issues, Pull Requests,
Qualitätsprüfungen und Releases. Zu jedem Release wird automatisch ein direkt in
WordPress installierbares ZIP erzeugt und als GitHub-Release-Asset veröffentlicht.

## 2. Erfüllte Vorbedingungen

Folgende Voraussetzungen sind bereits erfüllt und nicht Bestandteil der weiteren
Einrichtung:

- WSL mit Docker Engine
- npm
- Node.js
- in Codex eingerichtetes Projekt mit Windows-Frontend und WSL
- initial angelegtes Projektverzeichnis

Alles Weitere in diesem Dokument ist noch umzusetzen.

## 3. Aktueller Ausgangsstand

Im Projekt liegen derzeit ein PHP-Einstiegspunkt sowie ein JavaScript- und ein
CSS-Prototyp. Der Prototyp demonstriert die Ansteuerung einer YouTube-Playlist,
ist aber noch kein vollständig verwendbarer WordPress-Block.

Insbesondere fehlen derzeit:

- ein erster Git-Commit und eine konfigurierte Verbindung zu GitHub;
- ein Gutenberg-Block, der den Player im Editor konfigurierbar macht und im
  Frontend ausgibt;
- die Annahme und Normalisierung von Playlist-ID oder Playlist-Link;
- die Navigation zum ersten und letzten Video;
- konfigurierbare Maximalgröße und Seitenverhältnis;
- vollständige Internationalisierung;
- ein belastbares Datenschutzkonzept;
- automatisierte Tests;
- eine reproduzierbare lokale WordPress-Umgebung;
- Build-, CI- und Release-Prozesse;
- Projekt-, Benutzer- und Entwicklerdokumentation;
- Lizenzdateien.

Die vorhandenen Dateien werden als Prototyp behandelt. Sie werden schrittweise
überführt und nicht ungeprüft als fertige Architektur beibehalten.

### 3.1 Fortschritt in M0

Bereits umgesetzt:

- lokaler Branch `main` baut auf der vorhandenen GitHub-Historie auf und verfolgt
  `origin/main`;
- GitHub-Remote `git@github.com:quasipapa/youtube-player.git` ist eingerichtet;
- GPL-v2-Lizenztext ist im initialen GitHub-Commit vorhanden;
- grundlegende Git-, EditorConfig- und Ignore-Regeln sind angelegt;
- `@wordpress/env` ist als feste Entwicklungsabhängigkeit eingerichtet und eine
  reproduzierbare npm-Lockdatei ist vorhanden;
- npm wurde in WSL auf Version 10.9.9 aktualisiert und erfüllt damit die
  Versionsanforderung der Entwicklungsabhängigkeiten;
- Konfigurationen für aktuelle und minimale WordPress-Testinstanzen sind angelegt;
- README, Entwicklungsanleitung, Drittanbieterhinweise sowie GitHub-Issue- und
  Pull-Request-Templates sind vorbereitet;
- die npm-Entwicklungsabhängigkeiten weisen nach einer gezielten
  Sicherheitsüberschreibung keine bekannten `npm audit`-Funde auf.

Noch offen in M0:

- `wp-env` über die Docker Engine starten und im Windows-Browser abnehmen;
- PHP-/Composer-Strategie festlegen und die PHP-Qualitätswerkzeuge ergänzen;
- GitHub-Milestones, Labels und Issues anlegen;
- Branch-Schutz nach Vorhandensein der ersten CI-Prüfungen abschließend aktivieren;
- einen echten Playlist-Link mit mindestens drei Videos für den Smoke-Test
  bereitstellen;
- Mindestplattform und Copyright-Angabe bestätigen.

## 4. Anforderungen

### 4.1 Funktionale Anforderungen

1. Das Plugin stellt einen Block im Gutenberg-Editor bereit.
2. Im Block kann eine YouTube-Playlist als reine ID oder als unterstützter
   YouTube-Link eingegeben werden.
3. Aus Links wird die Playlist-ID extrahiert, validiert und kanonisch gespeichert
   beziehungsweise gerendert.
4. Nach dem Laden der Playlist ist das erste Video, Index `0`, ausgewählt. Es wird
   nicht automatisch abgespielt.
5. Der Frontend-Player verwendet für Video-IFrames ausschließlich
   `https://www.youtube-nocookie.com`.
6. Außerhalb des YouTube-Players stehen mindestens diese Bedienelemente bereit:
   - erstes Video;
   - vorheriges Video;
   - Positionsanzeige, zum Beispiel „Video 2 von 12“;
   - nächstes Video;
   - letztes Video.
7. Nicht mögliche Aktionen sind deaktiviert, zum Beispiel „vorheriges Video“ am
   Anfang der Playlist.
8. Mehrere Player-Blöcke auf derselben Seite funktionieren unabhängig voneinander.
9. Für den Player können eine maximale Breite und/oder maximale Höhe eingestellt
   werden.
10. Das Seitenverhältnis ist konfigurierbar. Mindestens `16:9`, `4:3`, `1:1` und
    ein gültiges benutzerdefiniertes Verhältnis werden unterstützt.
11. Der Player überschreitet weder seinen Inhaltscontainer noch die konfigurierte
    Maximalgröße.
12. Block und Bedienelemente werden auf Mobiltelefon, Tablet und Desktop vollständig
    und bedienbar dargestellt.
13. Ungültige, private, leere, gelöschte oder nicht einbettbare Playlists führen zu
    einer verständlichen, übersetzbaren Fehlermeldung.
14. Es gibt standardmäßig kein Autoplay.

### 4.2 Datenschutzanforderungen

`youtube-nocookie.com` verhindert nicht jeden Datentransfer an Google. Bereits das
Laden eines externen Scripts, IFrames oder Vorschaubildes stellt eine Verbindung zu
einem Drittdienst her. Deshalb gelten zusätzlich folgende Anforderungen:

- Vor einer bewussten Freigabe durch den Besucher werden keine externen
  YouTube-Ressourcen geladen.
- Der Standardmodus ist ein lokaler Platzhalter mit einer Schaltfläche wie
  „YouTube-Playlist laden“.
- Erst nach dieser Aktion werden die IFrame API und der Player geladen.
- Es werden vor der Freigabe auch keine externen YouTube-Vorschaubilder verwendet.
- Die eingebauten Datenschutzfunktionen können für einen einzelnen Block
  deaktiviert werden, wenn die erforderliche Einwilligung beziehungsweise
  Blockierung anderweitig sichergestellt wird, beispielsweise durch ein
  Consent-Management-Plugin mit Content Blocker wie
  [Borlabs Cookie](https://de.borlabs.io/borlabs-cookie/).
- Bei deaktivierten eingebauten Datenschutzfunktionen rendert das Plugin den
  Player ohne eigenen Einwilligungsplatzhalter. Die Verantwortung dafür, dass der
  externe Content Blocker sämtliche YouTube-Ressourcen bis zur erforderlichen
  Einwilligung zuverlässig blockiert, liegt dann beim Website-Betreiber.
- Die Umschaltmöglichkeit wird im Block-Inspector verständlich bezeichnet und mit
  einem deutlichen Hinweis auf die mögliche externe Datenübertragung versehen.
- Das Plugin erzeugt keine eigene Telemetrie und speichert keine personenbezogenen
  Besucherdaten.
- Aufgerufene Domains, Zeitpunkt und Zweck der Verbindung werden dokumentiert.
- Für die spätere Anbindung an Consent-Management-Plugins werden dokumentierte
  WordPress-Filter beziehungsweise JavaScript-Ereignisse vorgesehen.
- Die Option zum unmittelbaren Laden dient insbesondere der Integration mit einem
  externen Consent-Management- oder Content-Blocker-System und darf nicht
  stillschweigend aktiviert werden.

Das Plugin stellt technische Datenschutzfunktionen bereit, garantiert aber nicht
pauschal die rechtliche Konformität einer gesamten Website.

### 4.3 Internationalisierung

- Text Domain: `youtube-playlist-player`.
- Die Quellsprache des Plugins ist Englisch.
- Sämtliche sichtbaren Texte in PHP, JavaScript und `block.json` verwenden die
  WordPress-i18n-Mechanismen.
- Eine deutsche Übersetzung wird mitgeliefert.
- Aus den Quellen kann reproduzierbar eine POT-Datei erzeugt werden.
- Texte werden nicht dauerhaft als deutsche String-Literale im Frontend-Code
  hinterlegt.

### 4.4 Barrierefreiheit

- Alle Funktionen sind per Tastatur erreichbar.
- Schaltflächen verwenden echte `button`-Elemente und verständliche Namen.
- Deaktivierte Zustände werden semantisch über `disabled` abgebildet.
- Die Positionsanzeige wird mit `aria-live="polite"` aktualisiert.
- Sichtbare Fokusmarkierungen bleiben erhalten.
- Status- und Fehlermeldungen sind für Screenreader zugänglich.
- Responsive Umbrüche verändern nicht die logische Tab-Reihenfolge.
- Farbgestaltung und Kontraste werden nicht ausschließlich vom Plugin erzwungen,
  sondern bleiben über dokumentierte Variablen themefähig.

### 4.5 Gestaltung und Theme-Anpassung

- Die Basisklassen verwenden konsequent das Präfix `ytpp-`.
- Anpassbare Werte werden als CSS Custom Properties dokumentiert, darunter:
  - maximale Breite und Höhe;
  - Seitenverhältnis;
  - Abstände;
  - Button-Hintergrund und -Textfarbe;
  - Rahmen, Radius und Fokusdarstellung.
- Blockausrichtungen wie `wide` und `full` werden unterstützt, soweit das Theme sie
  anbietet.
- Editor- und Frontend-Darstellung sollen möglichst übereinstimmen.
- Die CSS-Dokumentation enthält Beispiele für klassische Themes und `theme.json`.
- Die Mindestgröße des eingebetteten Players wird gegen die technischen
  Mindestanforderungen von YouTube validiert.

### 4.6 Technische Anforderungen

- Mindestplattform zum Projektstart: WordPress 6.0 und PHP 8.0.
- Zusätzlich wird gegen die jeweils aktuelle stabile WordPress-Version getestet.
- Registrierung des Blocks über `block.json`.
- Dynamisches, serverseitiges Rendering über einen PHP-`render_callback`, damit
  die deklarierte Unterstützung für WordPress 6.0 erhalten bleibt.
- Block-Assets werden nur auf Seiten geladen, auf denen der Block vorkommt.
- Sämtliche Eingaben werden validiert und sämtliche Ausgaben kontextbezogen
  escaped.
- Die YouTube-IFrame-API wird pro Seite höchstens einmal geladen.
- Ein bereits von einem Theme oder anderen Plugin verwendeter
  `onYouTubeIframeAPIReady`-Callback wird nicht zerstört.
- Für die reine Playlist-Wiedergabe wird kein YouTube-Data-API-Key benötigt.
- Abhängigkeiten werden über `package-lock.json` und `composer.lock` reproduzierbar
  festgeschrieben.

### 4.7 Lizenzierung

Das gesamte eigene Plugin wird unter **GNU General Public License v2.0 or later**
veröffentlicht. Der SPDX-Ausdruck lautet:

```text
GPL-2.0-or-later
```

Folgende Stellen müssen konsistent sein:

- vollständiger Lizenztext in `LICENSE`;
- `License: GPL-2.0-or-later` im Plugin-Header;
- passende `License URI` im Plugin-Header;
- Lizenzangabe in `README.md` und `readme.txt`;
- Lizenzangabe in Paketmetadaten;
- `THIRD_PARTY_NOTICES.md` für gegebenenfalls mitgelieferte Fremdkomponenten.

Die GPL verlangt keine sichtbare Urhebernennung im Frontend des Plugins. Bei
Weitergabe gelten jedoch die GPL-Bedingungen, insbesondere hinsichtlich Lizenz,
Quellcode und Erhalt rechtlicher Hinweise. Dieses Verhalten ersetzt die zunächst
erwogene Anforderung einer bedingungslosen Nutzung ohne Lizenzpflichten.

## 5. Vorgesehene Projektstruktur

```text
youtube-playlist-player/
├── youtube-playlist-player.php
├── includes/
│   ├── class-plugin.php
│   └── class-playlist-parser.php
├── src/
│   ├── block.json
│   ├── index.js
│   ├── edit.js
│   ├── view.js
│   ├── editor.scss
│   └── style.scss
├── build/
├── languages/
├── tests/
│   ├── php/
│   ├── js/
│   └── e2e/
├── docs/
│   ├── development.md
│   ├── styling.md
│   ├── privacy.md
│   └── release.md
├── scripts/
│   └── build-zip.sh
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release.yml
│   ├── dependabot.yml
│   └── pull_request_template.md
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .wp-env.json
├── composer.json
├── composer.lock
├── package.json
├── package-lock.json
├── phpcs.xml.dist
├── phpunit.xml.dist
├── README.md
├── readme.txt
├── LICENSE
└── THIRD_PARTY_NOTICES.md
```

`build/` enthält die kompilierten Block-Assets. `dist/` wird nur temporär beim
Paketbau angelegt und nicht versioniert. Das Release-ZIP enthält einen obersten
Ordner `youtube-playlist-player/`, damit es direkt über die WordPress-Oberfläche
installiert werden kann.

## 6. Rollen und Zusammenarbeit

### Du

Du übernimmst Entscheidungen und Aktionen, die Konten, Berechtigungen oder
Produktentscheidungen erfordern:

- GitHub-Repository, Besitzer, Sichtbarkeit und URL festlegen;
- Codex beziehungsweise Git die erforderlichen GitHub-Zugriffe geben;
- Branch-Schutz und andere Repository-Regeln bestätigen, falls GitHub dafür eine
  interaktive Freigabe verlangt;
- reale Test-Playlist bestimmen;
- fachliche Abnahme im Gutenberg-Editor und in unterschiedlichen Themes;
- Version und Veröffentlichung eines Releases freigeben;
- rechtliche und datenschutzrechtliche Endprüfung für den tatsächlichen Einsatz.

### Codex

Ich übernehme nach deiner jeweiligen Beauftragung die Arbeiten im Repository:

- Dateien und Projektstruktur erstellen oder ändern;
- vorhandenen Prototyp schrittweise umbauen;
- lokale Entwicklungsumgebung konfigurieren;
- Tests schreiben und ausführen;
- Build- und GitHub-Action-Workflows erstellen;
- Dokumentation pflegen;
- Fehler analysieren und innerhalb des beauftragten Schritts beheben;
- Änderungen und Prüfergebnisse zur Abnahme zusammenfassen.

Ich erstelle keine Veröffentlichung und ändere keine externen GitHub-Einstellungen,
solange du dies nicht ausdrücklich beauftragst beziehungsweise freigibst.

### GitHub Actions

Nach ihrer Einrichtung übernehmen die Workflows automatisch:

- Linting, Builds und Tests bei Pull Requests und Pushes;
- Erzeugung eines Test-ZIPs als CI-Artefakt;
- Prüfung der Versionskonsistenz;
- Erzeugung und Veröffentlichung des installierbaren ZIPs bei Release-Tags.

## 7. GitHub-Struktur für inkrementelle Entwicklung

Die Arbeit soll nicht nur in diesem Dokument, sondern auch in GitHub sichtbar und
nachvollziehbar sein.

### 7.1 Milestones

Folgende GitHub-Milestones werden angelegt:

1. `M0 – Projektbasis`
2. `M1 – Gutenberg MVP`
3. `M2 – Playlist-Navigation`
4. `M3 – Responsive Design und i18n`
5. `M4 – Datenschutz und Barrierefreiheit`
6. `M5 – Tests und CI`
7. `M6 – Release 0.1.0`

### 7.2 Labels

Mindestens folgende Labels werden verwendet:

- `type:feature`
- `type:test`
- `type:documentation`
- `type:build`
- `type:bug`
- `area:block-editor`
- `area:frontend`
- `area:php`
- `area:privacy`
- `area:accessibility`
- `area:github-actions`
- `status:blocked`
- `status:ready-for-review`

### 7.3 Arbeitsweise

- Jeder unten beschriebene Entwicklungsschritt erhält mindestens ein GitHub-Issue.
- Ein Issue enthält Ziel, Teilaufgaben, Akzeptanzkriterien und Testhinweise.
- Implementierung erfolgt auf einem Branch mit dem Präfix `codex/`, zum Beispiel
  `codex/02-block-skeleton`.
- Ein Pull Request löst CI aus und verweist auf das zugehörige Issue.
- Ein Schritt gilt erst als abgeschlossen, wenn seine Akzeptanzkriterien erfüllt,
  Tests grün und Dokumentation angepasst sind.
- Funktionale Schritte bleiben möglichst klein genug für einen einzeln prüfbaren
  Pull Request.
- Neue Erkenntnisse werden als GitHub-Issue aufgenommen und nicht nur in Chat- oder
  Commit-Nachrichten festgehalten.

## 8. Schritt-für-Schritt-Umsetzung

### Schritt 0 – GitHub-Ziel und Produktentscheidungen festlegen

**Milestone:** `M0 – Projektbasis`

**Du:**

1. Bestätigst GitHub-Besitzer, Repository-Namen und Sichtbarkeit.
2. Stellst die Repository-URL bereit, falls das Repository schon existiert.
3. Bestätigst, ob mittelfristig eine Veröffentlichung auf WordPress.org vorgesehen
   ist.
4. Legst eine öffentliche, stabile Playlist für manuelle Smoke-Tests fest.

**Codex:**

1. Prüft den lokalen Git-Status und schützt vorhandene Änderungen.
2. Dokumentiert die vier Entscheidungen in `README.md` beziehungsweise einem
   GitHub-Issue.
3. Prüft die gewählte Playlist-ID syntaktisch, ohne sie als feste Abhängigkeit für
   automatisierte Tests zu verwenden.

**Fertig, wenn:** GitHub-Ziel, Veröffentlichungsweg und Testplaylist eindeutig
festgelegt sind.

### Schritt 1 – Repository initialisieren und mit GitHub verbinden

**Milestone:** `M0 – Projektbasis`

**Codex:**

1. Ergänzt `.gitignore`, `.gitattributes` und `.editorconfig`.
2. Entfernt IntelliJ-Benutzerdaten aus der vorgesehenen Versionsverwaltung; nur
   ausdrücklich gewünschte gemeinsame IDE-Einstellungen bleiben erhalten.
3. Benennt den lokalen Standard-Branch von `master` in `main` um.
4. Erstellt den nachvollziehbaren Initial-Commit.
5. Konfiguriert `origin`, sobald URL und Zugriff vorliegen.
6. Pusht `main`, wenn du das ausdrücklich beauftragt hast.

**Du:**

1. Erstellst das leere GitHub-Repository, falls es noch nicht existiert, ohne dort
   zusätzlich README, Lizenz oder `.gitignore` generieren zu lassen.
2. Erteilst bei Bedarf die GitHub-Anmeldung oder Push-Freigabe.
3. Aktivierst nach dem ersten Push den Schutz für `main`: Pull Request und später
   erfolgreiche CI erforderlich, Force-Push und Löschen gesperrt.

**GitHub-Artefakte:** Issue „Repository initialisieren und verbinden“.

**Fertig, wenn:** `main` auf GitHub vorhanden ist, der Working Tree sauber ist und
lokales sowie entferntes Repository dieselbe Historie besitzen.

### Schritt 2 – GitHub-Projektorganisation anlegen

**Milestone:** `M0 – Projektbasis`

**Codex:**

1. Erstellt Issue- und Pull-Request-Templates.
2. Formuliert Issues für alle Schritte dieses Plans inklusive Akzeptanzkriterien.
3. Bereitet die oben genannten Milestones und Labels vor beziehungsweise legt sie
   nach erteiltem GitHub-Zugriff an.
4. Richtet Dependabot für npm, Composer und GitHub Actions ein.

**Du:**

1. Bestätigst Milestones, Labels und initiales Backlog.
2. Entscheidest optional, ob zusätzlich ein GitHub Project Board verwendet wird.

**Fertig, wenn:** Jede geplante Ausbaustufe als Issue auffindbar und einem
Milestone zugeordnet ist.

### Schritt 3 – Lokale WordPress-Entwicklungsumgebung erstellen

**Milestone:** `M0 – Projektbasis`

**Codex:**

1. Erstellt `package.json` mit festgelegten npm-Scripts.
2. Installiert und fixiert `@wordpress/env` als Entwicklungsabhängigkeit.
3. Erstellt `.wp-env.json` mit dem aktuellen Plugin als Mount.
4. Richtet getrennte Entwicklungs- und Testports ein.
5. Startet die Umgebung und prüft Plugin-Aktivierung, Adminbereich und Frontend.
6. Dokumentiert Start, Stopp, Reset, Logs, WP-CLI-Zugriff und typische Fehler in
   `docs/development.md`.
7. Dokumentiert die IntelliJ-Konfiguration für WSL-Node, Git und PHP/Composer.

**Du:**

1. Bestätigst, dass Docker Engine in WSL läuft.
2. Öffnest `http://localhost:8888` und prüfst die Erreichbarkeit im
   Windows-Browser.
3. Änderst das lokale Standardpasswort, falls die Instanz außerhalb des lokalen
   Rechners erreichbar gemacht wird.

**Fertig, wenn:** `npm install` und `npm run env:start` eine dokumentierte,
reproduzierbare WordPress-Instanz mit aktiviertem Plugin liefern.

### Schritt 4 – Build- und Qualitätswerkzeuge vorbereiten

**Milestone:** `M0 – Projektbasis`

**Codex:**

1. Richtet `@wordpress/scripts` oder die benötigten einzelnen WordPress-Pakete für
   Block-Build, ESLint, Stylelint und Formatierung ein.
2. Erstellt `composer.json` mit PHPUnit und WordPress Coding Standards.
3. Erstellt PHPCS- und PHPUnit-Konfiguration.
4. Fügt npm-Scripts für Build, Watch, Lint, Formatprüfung und Tests hinzu.
5. Erzeugt und versioniert `package-lock.json` und `composer.lock`.
6. Baut den vorhandenen Prototyp einmal durch die neue Toolchain, ohne in diesem
   Schritt bereits sein Verhalten grundlegend zu ändern.

**Du:**

1. Prüfst, ob IntelliJ die PHP- und JavaScript-Abhängigkeiten korrekt erkennt.
2. Bestätigst, dass Build-Ordner nicht als manuell zu bearbeitende Quelle verwendet
   werden.

**Fertig, wenn:** Build und alle zunächst verfügbaren Linter lokal mit einem
einzigen dokumentierten Kommando laufen.

### Schritt 5 – Lizenz und Basisdokumentation ergänzen

**Milestone:** `M0 – Projektbasis`

**Codex:**

1. Legt `LICENSE` mit dem vollständigen Text der GPL Version 2 an.
2. Kennzeichnet die Wahl „Version 2 oder jede spätere Version“ konsistent über
   `GPL-2.0-or-later`.
3. Passt Plugin-Header und Paketmetadaten an.
4. Erstellt `README.md`, WordPress-`readme.txt` und
   `THIRD_PARTY_NOTICES.md`.
5. Prüft Lizenzen aller eingebundenen Laufzeitkomponenten.

**Du:**

1. Prüfst und bestätigst die Lizenzentscheidung und gegebenenfalls die gewünschte
   Autor-/Copyright-Angabe.

**Fertig, wenn:** GitHub und das spätere Plugin-ZIP die vollständige und konsistente
Lizenzinformation enthalten.

### Schritt 6 – Minimalen Gutenberg-Block implementieren

**Milestone:** `M1 – Gutenberg MVP`

**Codex:**

1. Erstellt `block.json` und registriert den Block serverseitig.
2. Implementiert einen dynamischen PHP-Renderer.
3. Fügt im Editor zunächst ein Feld für eine reine Playlist-ID ein.
4. Gibt im Frontend semantisches Player- und Platzhalter-Markup aus.
5. Lädt Block-CSS und -JavaScript nur bei tatsächlicher Blockverwendung.
6. Schreibt erste PHP- und JavaScript-Tests für Registrierung und Rendering.

**Du:**

1. Fügst den Block in einem Testbeitrag ein, speicherst und lädst den Beitrag neu.
2. Prüfst, ob Editor und Frontend das erwartete Grundgerüst zeigen.

**Fertig, wenn:** Ein gespeicherter Block eine Playlist-ID behält und im Frontend
das erwartete, noch minimale Player-Markup rendert.

### Schritt 7 – Playlist-ID und Links robust verarbeiten

**Milestone:** `M1 – Gutenberg MVP`

**Codex:**

1. Implementiert einen separaten Playlist-Parser.
2. Unterstützt reine IDs sowie definierte `youtube.com`, `youtu.be` und
   `youtube-nocookie.com`-Links mit `list`-Parameter.
3. Verwirft unerlaubte Hosts, fehlende IDs und manipulierte Eingaben.
4. Zeigt Validierungsfeedback im Editor und eine sichere Meldung im Frontend.
5. Ergänzt tabellarische PHPUnit-Datensätze für gültige und ungültige Eingaben.

**Du:**

1. Prüfst mehrere reale URL-Formen im Editor.
2. Bestätigst die Verständlichkeit der Validierungsmeldungen.

**Fertig, wenn:** Alle dokumentierten URL-Formen zum selben kanonischen Ergebnis
führen und ungültige Eingaben keine unsichere Ausgabe erzeugen.

### Schritt 8 – Datenschutzfreundliches Laden und erster Player

**Milestone:** `M2 – Playlist-Navigation`

**Codex:**

1. Implementiert den lokalen Einwilligungsplatzhalter.
2. Stellt per automatisiertem Test sicher, dass vor dem Klick keine Anfrage an
   YouTube erfolgt.
3. Lädt die IFrame API nach Freigabe einmalig und konfliktfrei.
4. Erstellt den IFrame ausschließlich mit `youtube-nocookie.com`.
5. Lädt die Playlist mit Index `0` ohne Autoplay.
6. Behandelt Lade- und API-Fehler.

**Du:**

1. Prüfst im Browser-Netzwerkprotokoll, dass vor der Freigabe keine YouTube-Anfrage
   erfolgt.
2. Prüfst mit der vereinbarten Testplaylist, dass das erste Video angezeigt wird.

**Fertig, wenn:** Datenschutz-Gate und erster Playlist-Eintrag lokal und in Tests
nachweisbar funktionieren.

### Schritt 9 – Vollständige Playlist-Navigation ergänzen

**Milestone:** `M2 – Playlist-Navigation`

**Codex:**

1. Implementiert erstes, vorheriges, nächstes und letztes Video.
2. Aktualisiert Position und Buttonzustände bei jeder Zustandsänderung.
3. Unterstützt mehrere Blockinstanzen und bestehende YouTube-API-Nutzer.
4. Ergänzt Tests für Anfang, Mitte, Ende, Ein-Video-Playlist und mehrere Player.
5. Mockt die YouTube-API in automatisierten Tests, damit CI nicht von Google
   abhängig ist.

**Du:**

1. Führst einen manuellen Navigationstest mit einer Playlist mit mindestens drei
   Videos aus.
2. Bestätigst Verhalten und Bezeichnungen der Bedienelemente.

**Fertig, wenn:** Alle vier Navigationsrichtungen, Statusanzeigen und Randfälle
funktionieren.

### Schritt 10 – Größen, Seitenverhältnis und Responsive Design

**Milestone:** `M3 – Responsive Design und i18n`

**Codex:**

1. Ergänzt Inspector Controls für maximale Breite, maximale Höhe und
   Seitenverhältnis.
2. Validiert Werte und verhindert technisch unbrauchbare Größen.
3. Implementiert responsive Größenberechnung über CSS `aspect-ratio`, `min()` und
   CSS Custom Properties.
4. Macht die Navigationsleiste auf kleinen Viewports umbrechbar.
5. Dokumentiert alle öffentlichen CSS-Variablen in `docs/styling.md`.
6. Ergänzt responsive Playwright-Tests.

**Du:**

1. Prüfst den Block in mindestens einem klassischen und einem Block-Theme.
2. Prüfst Mobil-, Tablet-, Desktop- und Gutenberg-Vorschau.

**Fertig, wenn:** Der gesamte Block bei allen Testgrößen ohne horizontales
Abschneiden bedienbar bleibt und die konfigurierten Grenzen einhält.

### Schritt 11 – Internationalisierung fertigstellen

**Milestone:** `M3 – Responsive Design und i18n`

**Codex:**

1. Überführt alle Quelltexte in Englisch.
2. Verwendet WordPress-i18n in PHP, Blockmetadaten und JavaScript.
3. Richtet die reproduzierbare POT-Erzeugung ein.
4. Erstellt die deutsche Übersetzung.
5. Ergänzt Prüfungen gegen nicht internationalisierte sichtbare Texte.

**Du:**

1. Prüfst den Block mit deutscher und englischer WordPress-Sprache.
2. Nimmst die deutschen Formulierungen fachlich ab.

**Fertig, wenn:** Editor und Frontend vollständig auf Sprachwechsel reagieren.

### Schritt 12 – Barrierefreiheit und Datenschutzintegration härten

**Milestone:** `M4 – Datenschutz und Barrierefreiheit`

**Codex:**

1. Ergänzt ARIA-Status, Fokusbehandlung und semantische Fehlerausgabe.
2. Testet vollständige Tastaturbedienung.
3. Prüft Kontraste der Standarddarstellung.
4. Erstellt dokumentierte Integrationspunkte für Consent-Manager.
5. Ergänzt `docs/privacy.md` und optional einen WordPress-Datenschutztextbaustein.
6. Dokumentiert alle tatsächlich kontaktierten externen Dienste und Bedingungen.

**Du:**

1. Prüfst Bedienung nur mit Tastatur.
2. Lässt die Datenschutzhinweise vor produktivem Einsatz fachlich oder rechtlich
   bewerten.

**Fertig, wenn:** Die definierten Accessibility- und Datenschutz-Akzeptanztests
bestanden sind.

### Schritt 13 – Vollständige Testpyramide und lokale Qualitätsprüfung

**Milestone:** `M5 – Tests und CI`

**Codex:**

1. Vervollständigt PHPUnit-Tests für Parser, Validierung, Escaping und Rendering.
2. Vervollständigt JavaScript-Tests für API-Lader, Playerzustände und Navigation.
3. Erstellt Playwright-Tests für Editor, Speicherung, Frontend, Datenschutz und
   responsive Ansichten.
4. Richtet WordPress Plugin Check ein.
5. Erstellt ein gemeinsames Kommando, das alle lokal relevanten Prüfungen ausführt.
6. Dokumentiert reale Smoke-Tests getrennt von deterministischen Tests.

**Du:**

1. Führst das gemeinsame Prüfkommando anhand der Dokumentation einmal selbst aus.
2. Meldest unklare oder nicht reproduzierbare Schritte als GitHub-Issue.

**Fertig, wenn:** Eine frische Installation alle Prüfungen ohne manuelle
Zwischenschritte ausführen kann.

### Schritt 14 – GitHub-CI-Action einrichten

**Milestone:** `M5 – Tests und CI`

**Codex:**

1. Erstellt `.github/workflows/ci.yml` für Pull Requests und Pushes nach `main`.
2. Verwendet minimale `GITHUB_TOKEN`-Berechtigungen.
3. Pinnt verwendete Actions auf überprüfte vollständige Commit-SHAs.
4. Richtet mindestens folgende Jobs ein:
   - Build und Versionsprüfung;
   - PHP-Lint und PHPCS;
   - JavaScript-/CSS-Lint;
   - PHP- und JavaScript-Unit-Tests;
   - WordPress-Integration und E2E;
   - Plugin Check;
   - Bau und Smoke-Test eines installierbaren ZIPs.
5. Lädt das geprüfte ZIP bei jedem erfolgreichen CI-Lauf als zeitlich begrenztes
   Workflow-Artefakt hoch.
6. Testet mindestens WordPress 6.0/PHP 8.0 sowie aktuelle WordPress- und
   PHP-Versionen in einer sinnvollen Matrix.

**Du:**

1. Bestätigst erforderliche GitHub-Action-Berechtigungen.
2. Aktivierst die erfolgreichen CI-Jobs als erforderliche Statusprüfungen für
   `main`.

**Fertig, wenn:** Ein Test-Pull-Request sämtliche Jobs auslöst und ein absichtlich
fehlerhafter Test den Merge zuverlässig blockiert.

### Schritt 15 – Reproduzierbaren Plugin-ZIP-Build erstellen

**Milestone:** `M6 – Release 0.1.0`

**Codex:**

1. Erstellt `scripts/build-zip.sh` und das npm-Kommando `plugin:zip`.
2. Baut Produktionsassets und kopiert nur eine Positivliste auslieferbarer Dateien.
3. Schließt insbesondere `.git`, `.github`, `src`, `tests`, `node_modules`, lokale
   IDE-Dateien und Entwicklungsberichte aus.
4. Legt alles unter dem obersten ZIP-Ordner `youtube-playlist-player/` ab.
5. Erzeugt eine SHA-256-Prüfsumme.
6. Installiert und aktiviert genau das erzeugte ZIP in einer frischen
   WordPress-Testinstanz.
7. Dokumentiert Inhalt und lokalen Ablauf in `docs/release.md`.

**Du:**

1. Installierst das lokale ZIP einmal über „Plugins > Installieren > Plugin
   hochladen“.
2. Prüfst Aktivierung, Blockeinfügung und eine reale Playlist.

**Fertig, wenn:** Das lokal erzeugte ZIP ohne Quelldateien oder Entwicklungsballast
direkt installierbar ist.

### Schritt 16 – Automatische GitHub-Release-Action einrichten

**Milestone:** `M6 – Release 0.1.0`

**Codex:**

1. Erstellt `.github/workflows/release.yml`, ausgelöst durch Tags `v*`.
2. Prüft, dass Tag, Plugin-Header, `package.json` und `readme.txt` dieselbe Version
   enthalten.
3. Führt vor Veröffentlichung die vollständige Qualitätsprüfung aus.
4. Baut und installiert das Release-ZIP in einer frischen Testinstanz.
5. Erstellt ein GitHub Release mit generierten Release Notes.
6. Hängt Plugin-ZIP und SHA-256-Datei als Release-Assets an.
7. Verwendet nur die benötigte Berechtigung `contents: write` im Release-Job.
8. Verhindert die Veröffentlichung, sobald eine Prüfung fehlschlägt.

**Du:**

1. Aktivierst die erforderliche Workflow-Schreibberechtigung beziehungsweise
   bestätigst die entsprechende Repository-Einstellung.
2. Gibst die Version `0.1.0` fachlich frei.
3. Beauftragst das Erstellen und Pushen des Tags `v0.1.0` oder führst es selbst aus.
4. Prüfst nach dem Lauf Release Notes, ZIP und Prüfsumme auf GitHub.

**Fertig, wenn:** Das GitHub Release `v0.1.0` ein getestetes, herunterladbares und
direkt installierbares Plugin-ZIP enthält.

### Schritt 17 – Abnahme und laufende Pflege

**Milestone:** `M6 – Release 0.1.0`

**Codex:**

1. Erstellt eine Release-Checkliste und dokumentiert bekannte Einschränkungen.
2. Prüft Dokumentation, Changelog, Lizenz und Versionsnummern.
3. Konfiguriert Dependabot-Updates so, dass sie die vollständige CI durchlaufen.
4. Dokumentiert den Ablauf für Patch-, Minor- und Major-Releases.

**Du:**

1. Führst die fachliche Endabnahme in den vorgesehenen Themes und Geräten durch.
2. Entscheidest über Veröffentlichung außerhalb GitHubs, insbesondere WordPress.org.
3. Priorisierst neue Anforderungen über GitHub-Issues und Milestones.

**Fertig, wenn:** Release, Dokumentation und Backlog den tatsächlichen Zustand des
Plugins widerspiegeln.

## 9. Geplanter CI- und Release-Ablauf

```text
Feature-Branch
    ↓
Pull Request
    ↓
CI: Build → Lint → Unit → Integration → E2E → Plugin Check → ZIP-Smoke-Test
    ↓
Review und Merge nach main
    ↓
Version in allen Metadaten anheben
    ↓
Tag vX.Y.Z
    ↓
Release-CI wiederholt alle Prüfungen
    ↓
ZIP + SHA-256 erzeugen
    ↓
GitHub Release veröffentlichen
```

Die von GitHub automatisch angebotenen „Source code“-Archive ersetzen nicht das
Plugin-ZIP. Nur das explizit erzeugte ZIP besitzt die geprüfte WordPress-Struktur
und die definierte Positivliste von Produktionsdateien.

## 10. Testumfang

### PHP

- Playlist-ID- und URL-Parser;
- Eingabevalidierung und Grenzwerte;
- kontextbezogenes Escaping;
- dynamisches Block-Markup;
- lokalisierte Texte;
- bedingtes Asset-Laden.

### JavaScript

- konfliktfreier, einmaliger API-Lader;
- Initialisierung eines und mehrerer Player;
- Anfang, vorheriges, nächstes und letztes Video;
- Buttonzustände und Positionsanzeige;
- Ein-Video- und leere Playlist;
- Fehlerzustände;
- keine externe Verbindung vor Einwilligung.

### End-to-End

- Block suchen und einfügen;
- ID und URL eingeben;
- Attribute speichern und erneut öffnen;
- Frontenddarstellung prüfen;
- Einwilligung und Netzwerkverhalten prüfen;
- Tastaturbedienung;
- Mobil-, Tablet- und Desktop-Viewport;
- ZIP installieren, aktivieren und Block rendern.

Automatisierte Tests verwenden eine simulierte YouTube-API. Ein echter
YouTube-Aufruf bleibt ein bewusst separater manueller Smoke-Test, damit externe
Verfügbarkeit oder Playliständerungen die CI nicht unzuverlässig machen.

## 11. Definition of Done für jeden Entwicklungsschritt

Ein Issue oder Pull Request ist erst abgeschlossen, wenn:

- die zugehörigen Akzeptanzkriterien erfüllt sind;
- neue Logik angemessen getestet ist;
- alle bestehenden Tests weiterhin erfolgreich sind;
- Linter und Formatprüfungen erfolgreich sind;
- keine Geheimnisse oder lokalen Zugangsdaten eingecheckt wurden;
- Benutzer- oder Entwicklerdokumentation angepasst wurde;
- Datenschutz-, Sicherheits-, Übersetzungs- und Accessibility-Auswirkungen geprüft
  wurden;
- der Pull Request das Issue verknüpft und die Änderung verständlich beschreibt;
- generierte Release-Dateien nicht versehentlich als Quellcode bearbeitet wurden.

## 12. Entscheidungen, die vor Schritt 1 noch benötigt werden

Aktueller Entscheidungsstand:

- Die Veröffentlichung erfolgt vorerst über GitHub. Eine zusätzliche
  Veröffentlichung auf WordPress.org ist mittelfristig denkbar.
- Als Smoke-Test-Kandidat wurde
  `https://youtu.be/TsCvNtCgKZ8?si=EVPpNXAjKe4APUbM` angegeben. Dieser Link
  verweist auf ein einzelnes Video und enthält keine Playlist-ID. Für die
  Navigationstests wird deshalb noch ein Playlist-Link mit `list`-Parameter oder
  eine reine Playlist-ID benötigt.
- Die lokale Git-Identität ist in WSL als `quasipapa` mit einer
  GitHub-Noreply-Adresse eingerichtet.
- Das GitHub-Repository ist
  `https://github.com/quasipapa/youtube-player`. Es enthält bereits einen
  initialen Commit mit dem vollständigen Text der GPL Version 2.

Noch zu entscheiden beziehungsweise bereitzustellen:

- Sichtbarkeit des GitHub-Repositorys;
- gewünschte Autor-/Copyright-Angabe unter GPL-2.0-or-later;
- öffentliche Playlist mit mindestens drei Videos für manuelle Smoke-Tests;
- Bestätigung, dass WordPress 6.0/PHP 8.0 tatsächlich langfristig als
  Mindestplattform beibehalten werden soll.

Diese Entscheidungen blockieren nicht die technische Planung, müssen aber vor den
jeweils betroffenen Implementierungs- und Veröffentlichungsschritten getroffen
werden.

## 13. Referenzen

- [WordPress Plugin Guidelines](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/)
- [WordPress: Software License](https://developer.wordpress.org/plugins/plugin-basics/including-a-software-license/)
- [WordPress: Block Metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/)
- [WordPress: wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/)
- [WordPress Plugin Privacy](https://developer.wordpress.org/plugins/privacy/)
- [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [GitHub Actions: Secure Use](https://docs.github.com/en/actions/reference/security/secure-use)
- [GNU GPL Version 2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
