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
- Docker kann nach Installation von `util-linux-extra`, Aufnahme des WSL-Benutzers
  in die `docker`-Gruppe und Aktivierung über `newgrp docker` ohne `sudo`
  angesprochen werden;
- ein zweiter Build mit `--pull --no-cache` hat bestätigt, dass das
  WordPress-PHP-8.0-Image auch mit frisch geladenem Debian-Bullseye-Paketindex eine
  nicht mehr abrufbare Paketdatei anfordert; die tägliche Entwicklungsumgebung
  verwendet deshalb PHP 8.3, während PHP 8.0 als separat zu prüfende
  Mindestplattform bestehen bleibt;
- die lokale WordPress-Entwicklungsinstanz startet mit PHP 8.3 erfolgreich;
- der eindeutige technische Plugin-Slug `yt-playlist-player` ist in Quellcode,
  lokaler WordPress-Einbindung, Paketmetadaten und Dokumentation festgelegt;
- als Plugin-Autor wird durchgängig `quasipapa` verwendet;
- Konfigurationen für aktuelle und minimale WordPress-Testinstanzen sind angelegt;
- README, Entwicklungsanleitung, Drittanbieterhinweise sowie GitHub-Issue- und
  Pull-Request-Templates sind vorbereitet;
- `@wordpress/scripts` 34.2.0 stellt den reproduzierbaren Gutenberg-Build sowie
  ESLint, Stylelint und Formatprüfung bereit; die dabei derzeit gemeldeten
  npm-Advisories betreffen ausschließlich transitive Entwicklungswerkzeuge und
  werden nicht in das Plugin oder sein Release-ZIP übernommen;
- Composer läuft reproduzierbar im Docker-Image `composer:2.9.5`; eine lokale
  PHP- oder Composer-Installation in WSL ist nicht erforderlich;
- PHP-Syntaxprüfung, WordPress Coding Standards und die Kompatibilitätsprüfung
  für PHP 8.0 oder neuer sind eingerichtet und laufen fehlerfrei;
- PHPUnit 9.6 ist über die Docker-basierte Composer-Strategie eingerichtet; ein
  isolierter erster Test lädt das Plugin und prüft seine Laufzeitkonstanten;
- der vorhandene JavaScript-/CSS-Prototyp liegt als bearbeitbare Quelle in `src`,
  wird mit `npm run build` nach `build` übersetzt und besteht ESLint, Stylelint
  sowie die Formatprüfung;
- `npm run check` führt Formatprüfung, JavaScript-/CSS- und PHP-Linting, PHPUnit
  sowie den Produktions-Build gemeinsam aus;
- die sieben Milestones, die geplanten Type-/Area-/Status-Labels und Issues für
  alle Schritte 0 bis 17 sind im GitHub-Repository angelegt;
- vor der Veröffentlichung wurden aktueller Dateistand und Git-Historie auf
  personenbezogene oder vertrauliche Daten geprüft und die Historie bereinigt;
- das bereinigte Hauptrepository ist öffentlich; die frühere GitHub-Instanz wird
  getrennt davon als privates History-Archiv aufbewahrt;
- ein aktiver GitHub-Ruleset verlangt Änderungen an `main` über Pull Requests und
  verhindert das Löschen sowie nicht-lineare Force-Pushes;

Am 6. September 2026 manuell geprüft:

- WordPress ist im Windows-Browser unter `http://localhost:8888/` erreichbar;
- die Anmeldung unter `http://localhost:8888/wp-admin/` funktioniert mit den
  lokalen Standardzugangsdaten `admin` / `password`;
- das Plugin wird als „YouTube Playlist Player“ in Version 0.1.0 angezeigt und
  ist aktiviert.
- die Plugin-Ansicht zeigt `quasipapa` als Autor und bietet kein Update des
  fremden WordPress.org-Plugins mit dem früher kollidierenden Slug an;
- nach `npm run env:stop` und `npm run env:start` sind WordPress, Anmeldung und
  Plugin weiterhin verfügbar und das Plugin ist aktiv;
- Dashboard, Plugin-Seite, Beitragseditor und Website-Frontend laden ohne
  sichtbare PHP- oder JavaScript-Fehler;
- `npm run env:logs` enthält nach diesen Aufrufen keine neuen pluginbedingten
  Warnungen oder Fehler;
- IntelliJ behandelt `build` als ausgeschlossenes, generiertes Verzeichnis;
- die JavaScript-Codevervollständigung funktioniert und die PHP-Vervollständigung
  bietet die von PHPUnit geerbten Assertions an. Die direkte Navigation von
  `TestCase` zur Herstellerdatei funktioniert in der aktuellen IDE-Konfiguration
  nicht, die Abhängigkeit selbst wird jedoch erkannt.

Noch offen in M0:

- den Schutz von `main` nach dem ersten erfolgreichen CI-Lauf um verpflichtende
  Statusprüfungen ergänzen.

### 3.2 Fortschritt in M1

Für Schritt 6 technisch umgesetzt:

- die Mindestplattform wurde auf WordPress 6.1 angehoben, damit dynamische Blöcke
  über die `render`-Eigenschaft in `block.json` aufgebaut werden können;
- der Block `yt-playlist-player/player` ist serverseitig aus den gebauten
  Metadaten registriert;
- der Editor bietet ein übersetzbares Feld für eine reine Playlist-ID und
  speichert diese als Blockattribut;
- die PHP-Render-Vorlage erzeugt je nach Eingabe ein leeres Platzhalter-Markup
  oder das minimale Player-Markup mit Navigation;
- Editor-JavaScript, Block-CSS und View-JavaScript werden über `block.json`
  bedarfsgerecht geladen;
- erste PHPUnit-Tests prüfen Registrierung, leeren Zustand, Escaping und
  Player-Markup; Jest-Tests prüfen Blockregistrierung, dynamisches Speichern und
  das Editorfeld;
- der vollständige lokale Lauf `npm run check` ist erfolgreich und WordPress
  registriert und rendert den Block mit der vereinbarten Test-Playlist-ID.

Für Schritt 6 manuell geprüft:

- der Block lässt sich in einen Testbeitrag einfügen und speichert die
  Playlist-ID über ein erneutes Laden des Editors hinweg;
- Editor und Frontend zeigen das erwartete Grundgerüst;
- eine ungültige ID kann im minimalen Stand noch gespeichert werden; im Frontend
  zeigt YouTube anschließend an, dass das Video nicht vorhanden ist. Lokale
  Validierung und verständliches Plugin-Feedback folgen in Schritt 7.

Für Schritt 7 technisch umgesetzt:

- ein separater Playlist-Parser in PHP und JavaScript normalisiert reine IDs
  sowie unterstützte YouTube-Links auf dieselbe kanonische Playlist-ID;
- unterstützt werden ausschließlich die dokumentierten Hosts `youtube.com`,
  `www.youtube.com`, `m.youtube.com`, `music.youtube.com`, `youtu.be`,
  `www.youtu.be`, `youtube-nocookie.com` und `www.youtube-nocookie.com`;
- fremde Hosts, Zugangsdaten in URLs, nicht standardmäßige Ports, fehlende oder
  mehrfach angegebene `list`-Parameter und syntaktisch ungültige IDs werden
  verworfen;
- der Editor zeigt übersetzbares Feedback für leere, gültige und ungültige
  Eingaben; das Frontend rendert bei ungültiger Syntax eine sichere lokale
  Fehlermeldung statt Player und Navigation;
- die Rückmeldung unterscheidet ausdrücklich zwischen gültiger Syntax und einer
  noch nicht geprüften Verfügbarkeit bei YouTube. Die Remote-Prüfung bleibt als
  Schritt 8a beziehungsweise GitHub-Issue #25 separat geplant;
- PHPUnit- und Jest-Datensätze decken gültige URL-Varianten, Normalisierung und
  manipulierte Eingaben ab; `npm run check` ist vollständig erfolgreich.

Für Schritt 7 manuell geprüft:

- mehrere reale URL-Formen werden im Editor auf dieselbe ID normalisiert;
- die Meldungen für gültige und ungültige Syntax sind verständlich;
- Speichern, erneutes Laden und Frontend-Ausgabe verhalten sich wie dokumentiert;
- eine syntaktisch gültige, aber nicht verfügbare ID wird korrekt von einer
  syntaktisch ungültigen Eingabe unterschieden und nicht fälschlich als bei
  YouTube geprüft dargestellt.

Damit ist Schritt 7 vollständig abgenommen. Die tatsächliche Remote-Prüfung der
Playlist-Verfügbarkeit bleibt bewusst Gegenstand von Schritt 8a.

Für Schritt 8 technisch umgesetzt:

- die Playlist-ID beziehungsweise URL wird ausschließlich im Block-Inspector
  bearbeitet; der Block zeigt bei gültiger Syntax direkt eine Editorvorschau von
  `youtube-nocookie.com`;
- der Inspector weist darauf hin, dass diese Vorschau bereits beim Bearbeiten
  eine externe Verbindung herstellt;
- im Frontend ist das lokale Datenschutz-Gate standardmäßig aktiv und das
  serverseitige Markup enthält vor der bewussten Freigabe weder YouTube-Script,
  IFrame noch externes Vorschaubild;
- die IFrame API wird erst nach Freigabe, konfliktverträglich und auch bei
  mehreren Blöcken höchstens einmal geladen;
- der erzeugte Player verwendet `youtube-nocookie.com`, Playlist-Index `0` und
  deaktiviertes Autoplay;
- das Gate kann pro Block im Inspector deaktiviert werden, wenn ein externes
  Consent-Management- oder Content-Blocker-System die YouTube-Anfragen übernimmt;
- lokale Lade- und Playerfehler werden zugänglich angezeigt, Navigation bleibt
  bis zur Player-Bereitschaft deaktiviert;
- `docs/privacy.md` dokumentiert Domains, Ladezeitpunkt, Editorvorschau,
  Verantwortungsübergang und das JavaScript-Ereignis `ytpp:consent`;
- PHPUnit und Jest prüfen beide Datenschutzmodi, ausbleibende Vorab-Anfragen,
  einmaliges API-Laden, Callback-Verträglichkeit, Playerparameter und Fehlerfälle.

Für Schritt 8 manuell erfolgreich geprüft:

- vor Betätigung des Consent-Buttons erscheint im Netzwerkprotokoll keine
  YouTube-Anfrage;
- danach wird das erste Video ohne Autoplay in einem
  `youtube-nocookie.com`-IFrame angezeigt;
- Eingabe im Inspector, Editorvorschau und Umschaltung für einen externen Content
  Blocker sind verständlich und funktionieren wie dokumentiert;
- ein Klick auf die nicht interaktive Vorschau wählt den Block zuverlässig aus
  und zeigt seine Eigenschaften in der Sidebar;
- die Editorvorschau erscheint ohne YouTube-Playerfehler 153;
- die Navigationsleiste ist in der Editorvorschau sichtbar;
- eine erteilte Zustimmung bleibt nach einem Refresh der Beitragsseite erhalten;
- nach dem Löschen der gespeicherten Zustimmung im Block-Inspector erscheint das
  Consent-Gate beim erneuten Laden der Beitragsseite wieder;
- Undo und Redo für Änderungen der Playlist-Eigenschaft funktionieren.

Nach der ersten manuellen Prüfung von Schritt 8 korrigiert:

- die Editorvorschau ist nicht interaktiv, sodass ein Klick den Block zuverlässig
  auswählt und dessen Eigenschaften in der Sidebar öffnet;
- die Vorschau wird über ein authentifiziertes, Nonce-geschütztes Dokument auf
  derselben WordPress-Instanz geladen. Dieses bettet den eigentlichen Player nur
  von `youtube-nocookie.com` ein und erhält auch innerhalb des Gutenberg-Canvas
  den für YouTube notwendigen HTTP-Referrer, um Playerfehler 153 zu vermeiden;
- unter der Editorvorschau wird die nicht interaktive Navigationsleiste sichtbar
  dargestellt;
- eine bewusste Freigabe wird playlistbezogen und ohne Besucheridentität im
  lokalen Browser-Speicher abgelegt, sodass sie einen Seiten-Refresh überdauert;
- Redakteure können den gespeicherten Consent für die gewählte Playlist im
  Block-Inspector löschen und den Datenschutzablauf dadurch erneut testen;
- Undo und Redo für Änderungen der Playlist-Eigenschaft wurden manuell
  erfolgreich geprüft.

Damit ist Schritt 8 technisch, automatisiert und manuell vollständig abgenommen.

Für Schritt 8a technisch umgesetzt:

- die Entscheidung für die schlüssellose IFrame Player API ist in
  `docs/adr/0001-keyless-playlist-availability-check.md` mit Alternativen,
  Datenschutzfolgen und Grenzen dokumentiert;
- erst nach gültiger lokaler Syntax und einer bewussten Redakteursaktion erzeugt
  der Inspector ein separates, visuell verborgenes Same-Origin-Prüf-IFrame und
  lädt darin die zusätzliche YouTube-IFrame-API;
- der Editor zeigt die Zustände „wird geprüft“, „verfügbar“, „nicht verfügbar“
  und „derzeit nicht eindeutig prüfbar“ mit übersetzbaren Texten;
- ein positives Ergebnis setzt mindestens einen vom bereiten Player gemeldeten
  Playlist-Eintrag voraus;
- fehlende/private Inhalte sowie Einbettungsfehler 100, 101 und 150 werden als
  nicht verfügbar behandelt; andere Playerfehler, blockierte Anfragen,
  Ladefehler und ein 15-Sekunden-Timeout bleiben ausdrücklich unbestimmt;
- das Prüf-IFrame ist direktes Kind des Inspectors und umgeht dadurch die
  zusätzliche Gutenberg-Canvas-IFrame-Grenze; seine Rückmeldung wird nach Quelle,
  Origin, Typ und erlaubtem Status validiert;
- Jest prüft die bewusste Auslösung, ausbleibendes vorzeitiges API-Laden,
  Same-Origin-Grenze, Erfolg, leere Playlist, bekannte Playerfehler,
  Ladefehler und unbestimmte Ergebnisse.

Für Schritt 8a manuell erfolgreich geprüft:

- mehrere verfügbare Playlists liefern den positiven Status und werden weiterhin
  im Editor sowie auf der Beitragsseite angezeigt;
- eine syntaktisch gültige, aber nicht verfügbare beziehungsweise nicht
  einbettbare Playlist liefert einen negativen Status, soweit YouTube diesen
  eindeutig meldet;
- der Aufruf von `youtube.com/iframe_api` wurde in Microsoft Edge über **Network
  > Block request URL** gezielt blockiert; die Prüfung endet nach dem vorgesehenen
  Timeout mit dem unbestimmten Status und bezeichnet die Playlist nicht als
  ungültig;
- Texte, bewusster Auslösezeitpunkt und Datenschutzhinweis sind verständlich.

Damit ist Schritt 8a technisch, automatisiert und manuell vollständig abgenommen.

Für Schritt 9 technisch umgesetzt:

- die Frontend-Navigation bietet erstes, vorheriges, nächstes und letztes Video;
- die Positionsanzeige und alle vier Buttonzustände werden anhand der von der
  YouTube-IFrame-API gemeldeten Playlist und Position aktualisiert;
- am Anfang sind die beiden Rückwärtsaktionen, am Ende die beiden
  Vorwärtsaktionen deaktiviert; bei einer Ein-Video-Playlist sind alle Aktionen
  deaktiviert;
- bei ungültigem Playerzustand oder einem Playerfehler bleiben sämtliche
  Navigationsaktionen deaktiviert;
- jede Blockinstanz verwaltet ausschließlich ihren eigenen Player und ihre
  eigenen Steuerelemente;
- die nicht interaktive Editorvorschau zeigt alle vier übersetzbaren
  Navigationsbezeichnungen;
- Jest deckt Anfang, Mitte, Ende, Ein-Video-Playlist, Navigation zu beiden
  Grenzen, Fehlerzustand und mehrere unabhängige Player mit einer gemockten
  YouTube-API ab; PHPUnit prüft das vollständige serverseitige Markup.

Für die manuelle Abnahme von Schritt 9 noch zu prüfen:

- Navigation in alle vier Richtungen mit einer Playlist mit mindestens drei
  Videos sowie korrekte Positions- und Buttonzustände an Anfang, Mitte und Ende;
- eine Playlist mit genau einem abspielbaren Video;
- zwei Blöcke auf derselben Seite, die unabhängig voneinander navigiert werden;
- Verständlichkeit der Bezeichnungen und Bedienung per Tastatur.

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
15. Der Editor prüft IDs und unterstützte Links zunächst lokal und ohne externe
    Anfrage auf syntaktische Gültigkeit.
16. Nach erfolgreicher lokaler Prüfung kann der Redakteur die tatsächliche
    Verfügbarkeit der Playlist und mindestens eines abspielbaren Eintrags bereits
    im Editor prüfen. Das Ergebnis unterscheidet zwischen verfügbar, nicht
    verfügbar und wegen Netzwerk-, Datenschutz- oder API-Einschränkungen nicht
    eindeutig prüfbar.

### 4.2 Datenschutzanforderungen

`youtube-nocookie.com` verhindert nicht jeden Datentransfer an Google. Bereits das
Laden eines externen Scripts, IFrames oder Vorschaubildes stellt eine Verbindung zu
einem Drittdienst her. Deshalb gelten zusätzlich folgende Anforderungen:

- Vor einer bewussten Freigabe durch den Besucher werden keine externen
  YouTube-Ressourcen geladen.
- Der Standardmodus ist ein lokaler Platzhalter mit einer Schaltfläche wie
  „YouTube-Playlist laden“.
- Erst nach dieser Aktion werden die IFrame API und der Player geladen.
- Die Freigabe wird ohne Besucheridentität playlistbezogen im lokalen
  Browser-Speicher gehalten, damit dieselbe Playlist nach einem Refresh nicht
  erneut bestätigt werden muss. Löscht der Besucher die Website-Daten oder ist
  der Speicher nicht verfügbar, ist eine erneute Freigabe erforderlich.
- Redakteure können die gespeicherte Freigabe für die im Block gewählte Playlist
  im Inspector gezielt löschen, um das Einwilligungsverhalten erneut zu testen.
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

- Technischer Plugin-Slug und Text Domain: `yt-playlist-player`.
- Der Plugin-Header enthält eine eindeutige `Update URI` zum GitHub-Repository,
  damit WordPress das Plugin nicht mit ähnlich benannten Plugins aus dem
  WordPress.org-Verzeichnis verwechselt.
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

- Mindestplattform zum Projektstart: WordPress 6.1 und PHP 8.0.
- Zusätzlich wird gegen die jeweils aktuelle stabile WordPress-Version getestet.
- Registrierung des Blocks über `block.json`.
- Dynamisches, serverseitiges Rendering über die seit WordPress 6.1 verfügbare
  `render`-Eigenschaft in `block.json` und eine PHP-Render-Vorlage.
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

Copyright-Inhaber ist `quasipapa`.

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
yt-playlist-player/
├── yt-playlist-player.php
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
Ordner `yt-playlist-player/`, damit es direkt über die WordPress-Oberfläche
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
8. `M7 – Wiederverwendbare Plugin-Basis`

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
6. Dokumentiert, dass diese lokale Prüfung keine Aussage über Existenz,
   Sichtbarkeit oder Abspielbarkeit der Playlist bei YouTube trifft.

**Du:**

1. Prüfst mehrere reale URL-Formen im Editor.
2. Bestätigst die Verständlichkeit der Validierungsmeldungen.
3. Prüfst Speichern, erneutes Laden und Frontend-Ausgabe für eine gültige URL und
   eine syntaktisch ungültige Eingabe.

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
7. Verschiebt die Playlist-Eingabe in den Block-Inspector und zeigt im Block eine
   direkte, als externe Verbindung gekennzeichnete
   `youtube-nocookie.com`-Editorvorschau.
8. Bietet im Inspector die standardmäßig aktive Datenschutzoption an, die für
   einen anderweitig abgesicherten Content Blocker pro Block deaktiviert werden
   kann.
9. Zeigt die Navigationsleiste auch in der nicht interaktiven Editorvorschau an.
10. Bietet im Inspector das playlistbezogene Löschen eines zuvor gespeicherten
    Consents für erneute Datenschutztests an.

**Du:**

1. Prüfst im Browser-Netzwerkprotokoll, dass vor der Freigabe keine YouTube-Anfrage
   erfolgt.
2. Prüfst mit der vereinbarten Testplaylist, dass das erste Video angezeigt wird.
3. Prüfst Eingabe und Datenschutzumschaltung im Block-Inspector sowie die direkte
   Editorvorschau.
4. Prüfst, dass die Editorvorschau ohne Playerfehler 153 und mit sichtbarer
   Navigationsleiste erscheint.
5. Prüfst Undo und Redo für eine Änderung der Playlist-Eigenschaft.
6. Löschst den gespeicherten Consent im Inspector und prüfst nach einem Reload
   der Beitragsseite, dass das lokale Consent-Gate erneut erscheint.

**Fertig, wenn:** Datenschutz-Gate und erster Playlist-Eintrag lokal und in Tests
nachweisbar funktionieren.

### Schritt 8a – Playlist-Verfügbarkeit im Editor prüfen

**Milestone:** `M2 – Playlist-Navigation`

**Voraussetzung:** Die lokale syntaktische Validierung aus Schritt 7 und die
Player-/Fehlerbehandlung aus Schritt 8 sind umgesetzt.

**Architekturentscheidung:** Für diesen Schritt wird die schlüssellose YouTube
IFrame Player API verwendet. Die genauere Data API wird wegen notwendigem
Google-Cloud-Projekt, API-Key-/OAuth-Verwaltung und Quota vorerst nicht
integriert. Technische Unsicherheit wird ausdrücklich als nicht eindeutig
prüfbar behandelt. Details und Quellen stehen in
[`docs/adr/0001-keyless-playlist-availability-check.md`](docs/adr/0001-keyless-playlist-availability-check.md).

**Codex:**

1. Vergleicht für die Remote-Prüfung die YouTube-IFrame-API ohne Data-API-Key mit
   der genaueren YouTube Data API, die API-Key beziehungsweise OAuth und Quota
   erfordert, und dokumentiert Grenzen und Datenschutzfolgen.
2. Implementiert die gewählte Prüfung erst nach erfolgreicher lokaler Validierung
   und nach einer bewussten Aktion des Redakteurs, damit nicht bereits beim Tippen
   unnötige externe Anfragen entstehen.
3. Zeigt die Zustände „wird geprüft“, „verfügbar“, „nicht verfügbar“ und „derzeit
   nicht eindeutig prüfbar“ verständlich und übersetzbar im Editor an.
4. Prüft neben der Existenz der Playlist, soweit die gewählte Schnittstelle dies
   zuverlässig erlaubt, dass mindestens ein abspielbarer beziehungsweise
   einbettbarer Eintrag vorhanden ist.
5. Behandelt private, gelöschte, leere oder nicht einbettbare Inhalte sowie
   Netzwerkfehler, API-Limits und blockierte YouTube-Anfragen ohne falsche
   Erfolgsmeldung.
6. Ergänzt automatisierte JavaScript-Tests mit simulierten Erfolgs-, Fehler- und
   nicht eindeutig entscheidbaren Antworten.

**Du:**

1. Hast nach Gegenüberstellung der Varianten die eingeschränkte schlüssellose
   Prüfung ohne Data-API-Key gewählt.
2. Prüfst im Editor eine verfügbare, eine ungültige und soweit möglich eine leere
   oder nicht einbettbare Playlist.
3. Bestätigst Texte, Auslösezeitpunkt und Datenschutzhinweis der externen Prüfung.

**Fertig, wenn:** Der Editor nach lokaler Validierung eine kontrolliert ausgelöste
Remote-Prüfung anbietet, den ermittelbaren Verfügbarkeitszustand korrekt anzeigt
und technische Unsicherheit nicht als ungültige Playlist ausgibt.

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

### Schritt 13a – Gesamtdokumentation modularisieren

**Milestone:** `M5 – Tests und CI`

**GitHub:** Issue [#35](https://github.com/quasipapa/youtube-player/issues/35)

**Zeitpunkt und Abgrenzung:** Dieser Schritt wird als eigener
Dokumentations-Pull-Request nach Stabilisierung der wesentlichen Funktionen und
vor dem ersten Release durchgeführt. Er enthält keine funktionalen Codeänderungen.

**Vorgeschlagene Zielstruktur:**

- `docs/index.md` als Einstieg und Inhaltsverzeichnis;
- `docs/requirements/` für funktionale, nichtfunktionale sowie Datenschutz- und
  Barrierefreiheitsanforderungen;
- `docs/architecture/overview.md` für den Gesamtüberblick sowie getrennte
  Dokumente für Entwicklungs- und Laufzeitarchitektur;
- `docs/architecture/decisions/` für nummerierte Architekturentscheidungen;
- `docs/testing/` für Teststrategie, automatisierte Tests, manuelle Smoke-Tests
  und Abnahmeprotokolle;
- `docs/development/` für lokale Einrichtung, IDE, Build und Arbeitsablauf;
- `docs/operations/` für GitHub, CI, Release, ZIP und laufende Pflege;
- `docs/user/` für Blockkonfiguration, Styling und Datenschutzhinweise.

**Codex:**

1. Erstellt eine Bestandsaufnahme mit Zuordnung jedes vorhandenen Abschnitts zum
   Zieldokument.
2. Schlägt vor der Verschiebung die endgültige, möglichst flache Struktur vor und
   kennzeichnet maßgebliche Dokumente, damit Inhalte nicht redundant gepflegt
   werden.
3. Verschiebt Anforderungen, Tests, Architekturüberblicke und Entscheidungen in
   getrennte Dokumente und erstellt `docs/index.md` als zentralen Einstieg.
4. Ersetzt alte Fundstellen durch stabile Links oder kurze Verweisseiten und
   aktualisiert README, GitHub-Issue-Vorlagen und Entwicklungsanweisungen.
5. Prüft interne Links und stellt sicher, dass Anforderungen, Implementierung und
   Testnachweise weiterhin nachvollziehbar miteinander verbunden sind.
6. Führt die reine Dokumentationsänderung in einem separaten Pull Request ohne
   funktionale Codeänderungen durch.

**Du:**

1. Nimmst Zielstruktur, Benennungen und Navigation vor der Verschiebung ab.
2. Prüfst anschließend, ob typische Informationen ohne Kenntnis der Historie
   schnell auffindbar sind.

**Fertig, wenn:** Die Dokumentation einen eindeutigen Einstieg, klar getrennte
Themenbereiche, keine widersprüchlichen Duplikate und geprüfte interne Links hat.

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
6. Testet mindestens WordPress 6.1/PHP 8.0 sowie aktuelle WordPress- und
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
4. Legt alles unter dem obersten ZIP-Ordner `yt-playlist-player/` ab.
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

### Schritt 18 – Wiederverwendbare Plugin-Basis extrahieren

**Milestone:** `M7 – Wiederverwendbare Plugin-Basis`

**Zeitpunkt und Voraussetzung:** Dieser Schritt beginnt erst, nachdem die Schritte
14 bis 17 abgeschlossen sind und mindestens ein Plugin-Release den vollständigen
CI-, ZIP- und Release-Prozess erfolgreich durchlaufen hat. Dadurch wird ein
praktisch bewährter Stand verallgemeinert und kein noch instabiles Zwischenmodell.

**Codex:**

1. Trennt die allgemein wiederverwendbare Projektbasis von Player-spezifischem
   Quellcode, Testdaten, Anforderungen und Dokumentation.
2. Erstellt ein eigenständiges, versioniertes GitHub-Template-Repository mit
   Entwicklungsumgebung, Build, Qualitätswerkzeugen, Testgrundgerüst,
   Dokumentationsvorlagen und Initialisierung für projektspezifische Werte wie
   Plugin-Name, Slug, Text-Domain, Namespace, Autor und Repository.
3. Ergänzt in abgeleiteten Projekten eine maschinenlesbare Angabe über verwendete
   Basisversion und zentral verwaltete Dateien beziehungsweise Bereiche.
4. Lagert geeignete CI- und Release-Bestandteile als versionierte,
   wiederverwendbare GitHub-Actions beziehungsweise Workflows aus. Die einzelnen
   Plugin-Repositories behalten kleine, nachvollziehbare Aufruf-Workflows.
5. Erstellt einen passenden Codex-Skill mit getrennten Abläufen zum Erzeugen eines
   neuen Plugins, Prüfen des Basisstands und Aktualisieren auf eine neue
   Basisversion. Das Template-Repository bleibt dabei die maßgebliche Quelle; der
   Skill dupliziert die Basisdateien nicht.
6. Definiert Releases, Changelog und konkrete Migrationshinweise für Änderungen
   der Basis und lässt Aktualisierungen bestehender Plugins ausschließlich über
   prüfbare Branches und Pull Requests einfließen.
7. Kombiniert Dependabot für Paket- und Action-Abhängigkeiten, zentrale
   wiederverwendbare Workflows und eine regelmäßige Prüfung der Basisversion, um
   veraltete Plugin-Projekte erkennbar zu machen.
8. Erzeugt ein neutrales Beispiel-Plugin aus dem Template, aktualisiert es mit dem
   Skill und prüft lokal sowie in GitHub den vollständigen Build-, Test-, ZIP- und
   Release-Ablauf.

**Du:**

1. Bestätigst Namen, Sichtbarkeit und Lizenz des Template- und Skill-Projekts.
2. Prüfst die Trennung zwischen zentral verwalteter Basis und
   Plugin-spezifischen Dateien.
3. Erzeugst mit der Anleitung einmal selbst ein Beispielprojekt und testest den
   installierten Skill.
4. Legst fest, in welchem Rhythmus bestehende Plugins auf neue Basisversionen
   geprüft und aktualisiert werden sollen.

**Fertig, wenn:** Ein neues Plugin reproduzierbar aus dem versionierten
GitHub-Template erzeugt werden kann, die zentralen Actions verwendet, der Skill
Basisstand und Abweichungen erkennt und ein kontrolliertes Upgrade auf eine neuere
Basisversion als überprüfbaren Pull Request vorbereitet.

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
- Das Hauptrepository `https://github.com/quasipapa/youtube-player` ist öffentlich.
  Die frühere Repository-Instanz bleibt unter
  `https://github.com/quasipapa/youtube-player-private-history-archive` privat und
  wird nicht als Projektquelle weitergeführt.
- Der technische Plugin-Slug lautet `yt-playlist-player`. Der sichtbare Name
  „YouTube Playlist Player“ und die GitHub-Repository-URL bleiben davon
  unberührt.
- Für manuelle Playlist-Smoke-Tests wird
  `https://youtube.com/playlist?list=OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU&si=xkRDc2cSiYN9u7jP`
  verwendet. Die daraus extrahierte Playlist-ID lautet
  `OLAK5uy_mIGiJKnSXHRCdD6WbGjuZWNTpeXhIo2TU`.
- Die Mindestplattform ist WordPress 6.1 mit PHP 8.0; zusätzlich werden aktuelle
  WordPress- und PHP-Versionen getestet.
- Copyright-Inhaber ist `quasipapa`; das Plugin wird unter
  `GPL-2.0-or-later` veröffentlicht.
- Die lokale Git-Identität ist in WSL als `quasipapa` mit einer
  GitHub-Noreply-Adresse eingerichtet.
- Die Autorenangabe des Plugins lautet `quasipapa`.
- Das GitHub-Repository ist
  `https://github.com/quasipapa/youtube-player`. Es enthält bereits einen
  initialen Commit mit dem vollständigen Text der GPL Version 2.

Damit sind die für den Projektstart benötigten Produktentscheidungen getroffen.
Der Basisschutz von `main` ist im öffentlichen Repository aktiviert.
Verpflichtende Statusprüfungen folgen, sobald die erste CI-Action erfolgreich
gelaufen ist.

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
