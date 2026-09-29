# Development workflow

## Source changes

The editable sources are:

- JavaScript, SCSS and block metadata in `src/`
- PHP helpers in `includes/`
- plugin bootstrap behavior in `yt-playlist-player.php`
- the editor-preview controller in `assets/js/editor-preview-controller.js`

Generate optimized production assets with:

```bash
npm run build
```

Expected result: `wp-scripts` exits successfully. It copies the block metadata
and PHP render template to `build/`. It also writes the compiled JavaScript,
CSS and asset metadata there.

For continuous rebuilding during development, run:

```bash
npm start
```

Expected result: `wp-scripts` performs an initial development build, watches the
source files and rebuilds after changes. The process remains active until it is
stopped, for example with `Ctrl+C`.

Never edit `build/` directly.

## Quality gates

Use focused checks after editing or generating code:

```bash
npm run format:check
npm run lint:js
npm run lint:css
npm run lint:php
npm run test:js
npm run test:php
npm run check:docs
```

| Command | Expected result |
| --- | --- |
| `npm run format:check` | All files supported by the shared formatter already match its rules |
| `npm run lint:js` | ESLint reports no errors in `src/` or `assets/js/` |
| `npm run lint:css` | Stylelint reports no errors in the SCSS sources |
| `npm run lint:php` | PHP syntax, WordPress Coding Standards and checks against the declared PHP minimum pass |
| `npm run test:js` | All Jest suites pass through `wp-scripts test-unit-jest` |
| `npm run test:php` | All PHPUnit suites pass |
| `npm run check:docs` | Local Markdown targets and fragments exist, and stable documentation IDs are unique |

Apply supported automatic fixes with:

```bash
npm run format
npm run format:php
```

Expected result: the commands rewrite supported files in place. The first
command applies the shared formatter and automatically fixable SCSS rules. The
second applies WordPress PHP formatting rules. Review the resulting diff and
run the focused checks again because not every lint problem can be fixed
automatically.

With the development site running, execute the combined source gate before
review:

```bash
npm run check
```

Expected result: formatting, JavaScript, CSS, PHP, PHPUnit, Jest and translation
reproducibility checks pass. JavaScript tests use the project-owned
`jest.config.cjs` and the Scripts 36 maintenance adapter. The command also
refreshes the production assets in `build/`. It does not run `npm run check:docs`;
keep that as a separate review step.

For code, test, dependency or delivery changes, run the complete local gate:

```bash
npm run test:local
```

Expected result:

- locked Composer dependencies are installed
- the isolated WordPress environment from `.wp-env.test.json` is running
- `npm run check` passes
- Plugin Check accepts the staged production files
- all Playwright suites pass against the isolated WordPress site
- any temporary Playwright container created by the script is removed on exit

The WordPress test environment remains running for inspection. Stop it with
`npm run env:test:stop` when it is no longer needed.

Expected result: the command stops the test containers. It retains the test
site's stored data for the next start.

## Translations

English source strings use the `yt-playlist-player` text domain. The editable
German catalog is `languages/yt-playlist-player-de_DE.po`. POT, MO and JSON
catalogs are generated.

With the development site running, update the catalogs after changing a source
string:

```bash
npm run i18n:generate
```

Expected result:

- `languages/yt-playlist-player.pot` reflects the current English source strings
- `languages/yt-playlist-player-de_DE.po` is merged with the updated POT file
- the German MO and JavaScript JSON catalogs are regenerated

Review and complete the German `msgstr` values in
`languages/yt-playlist-player-de_DE.po`. Then regenerate the compiled catalogs
and verify reproducibility:

```bash
npm run i18n:generate
npm run i18n:check
```

Expected result: MO and JSON files contain the reviewed translations. The check
regenerates all catalogs in a temporary directory and finds no difference from
the files in `languages/`.

Commit the PO file together with the generated POT, MO and JSON catalogs. Do not
edit the generated files by hand.

## Change completion

Keep behavior, requirements, decisions, tests and operational instructions in
the same change. Answer the documentation-impact questions in the pull request
template. Update [traceability](../traceability.md) when relationships change.

Start work on new behavior with an identified requirement. Record a
consequential technical choice as an ADR. Ideas without commitment belong in
[ideas](../ideas.md). Scheduled outcomes belong in the
[roadmap](../roadmap.md).

Generated runtime assets required by a release must be reproducible from source.
When the version changes, these declarations must agree:

- `package.json`
- the plugin header in `yt-playlist-player.php`
- the `YTPP_VERSION` constant
- `readme.txt`

The release tag uses the same version with a leading `v`.
