# Requirement verification coverage

This matrix maps accepted requirements to automated evidence and reusable manual
acceptance cases. It shows verification responsibility and known gaps; it does
not define test steps or record execution results.

A listed suite is a verification entry point, not proof that every clause is
asserted or that a run passed. Coverage status describes methods and limitations;
release audits record execution and acceptance.

Coverage status means:

- **automated** — project-controlled automation provides the primary evidence;
- **combined** — automation and manual acceptance cover different material risks;
- **manual required** — external behavior or human perception cannot be accepted
  from automation alone;
- **partial** — a known part of the requirement has no direct evidence.

## Functional requirements

| Requirement | Test objective | Automated evidence | Manual evidence | Status or limit |
| --- | --- | --- | --- | --- |
| [FR-001](../requirements/product.md#fr-001) | Block registration and editor availability | [`src/index.test.js`](../../src/index.test.js), [`tests/unit/test-plugin-metadata.php`](../../tests/unit/test-plugin-metadata.php) | [MAN-001](manual-acceptance.md#man-001) | combined |
| [FR-002](../requirements/product.md#fr-002), [FR-003](../requirements/product.md#fr-003) | Accepted input, canonical persistence and local invalid states | [`src/playlist-parser.test.js`](../../src/playlist-parser.test.js), [`src/edit.test.js`](../../src/edit.test.js), [`tests/unit/test-playlist-parser.php`](../../tests/unit/test-playlist-parser.php), [`tests/e2e/wordpress.pw.js`](../../tests/e2e/wordpress.pw.js) | [MAN-001](manual-acceptance.md#man-001) | combined |
| [FR-004](../requirements/product.md#fr-004) | External preview and three availability outcomes | [`src/edit.test.js`](../../src/edit.test.js), [`assets/js/editor-preview-controller.test.js`](../../assets/js/editor-preview-controller.test.js), [`tests/unit/test-editor-preview.php`](../../tests/unit/test-editor-preview.php) | [MAN-001](manual-acceptance.md#man-001), [MAN-004](manual-acceptance.md#man-004) | combined; real availability needs YouTube |
| [FR-005](../requirements/product.md#fr-005), [FR-006](../requirements/product.md#fr-006), [FR-007](../requirements/product.md#fr-007), [FR-008](../requirements/product.md#fr-008) | Initial cueing, navigation, boundaries and independent players | [`src/view.test.js`](../../src/view.test.js), [`tests/accessibility/player.pw.js`](../../tests/accessibility/player.pw.js) | [MAN-002](manual-acceptance.md#man-002) | combined; autoplay and iframe behavior need YouTube |
| [FR-009](../requirements/product.md#fr-009) | Optional local editorial title | [`src/edit.test.js`](../../src/edit.test.js), [`tests/unit/test-block-render.php`](../../tests/unit/test-block-render.php) | [MAN-001](manual-acceptance.md#man-001) | combined |
| [FR-010](../requirements/product.md#fr-010) | Correct failure classification, announcement and retry | [`src/view.test.js`](../../src/view.test.js), [`tests/accessibility/player.pw.js`](../../tests/accessibility/player.pw.js) | [MAN-004](manual-acceptance.md#man-004), [MAN-006](manual-acceptance.md#man-006) | combined |
| [FR-011](../requirements/product.md#fr-011), [FR-012](../requirements/product.md#fr-012) | Maximum dimensions, ratios and technical minima | [`src/player-sizing.test.js`](../../src/player-sizing.test.js), [`tests/unit/test-block-render.php`](../../tests/unit/test-block-render.php), [`tests/responsive/layout.pw.js`](../../tests/responsive/layout.pw.js) | [MAN-008](manual-acceptance.md#man-008) | combined |
| [FR-013](../requirements/product.md#fr-013), [FR-014](../requirements/product.md#fr-014), [FR-015](../requirements/product.md#fr-015) | Responsive layout, alignments and theme variables | [`src/index.test.js`](../../src/index.test.js), [`tests/responsive/layout.pw.js`](../../tests/responsive/layout.pw.js) | [MAN-008](manual-acceptance.md#man-008) | combined; real themes remain manual |

## Privacy requirements

| Requirement | Test objective | Automated evidence | Manual evidence | Status or limit |
| --- | --- | --- | --- | --- |
| [NFR-PRIV-001](../requirements/privacy.md#nfr-priv-001), [NFR-PRIV-002](../requirements/privacy.md#nfr-priv-002), [NFR-PRIV-003](../requirements/privacy.md#nfr-priv-003) | Local gate, deferred requests and no-cookie iframe host | [`src/view.test.js`](../../src/view.test.js), [`tests/unit/test-editor-preview.php`](../../tests/unit/test-editor-preview.php), [`tests/e2e/wordpress.pw.js`](../../tests/e2e/wordpress.pw.js) | [MAN-003](manual-acceptance.md#man-003) | combined; real network observation remains manual |
| [NFR-PRIV-004](../requirements/privacy.md#nfr-priv-004) | Playlist-scoped preference, clearing and storage failure | [`src/view.test.js`](../../src/view.test.js), [`src/edit.test.js`](../../src/edit.test.js) | [MAN-003](manual-acceptance.md#man-003) | combined |
| [NFR-PRIV-005](../requirements/privacy.md#nfr-priv-005), [NFR-PRIV-006](../requirements/privacy.md#nfr-priv-006) | External veto, grant, revocation and isolation | [`src/view.test.js`](../../src/view.test.js), [`tests/accessibility/player.pw.js`](../../tests/accessibility/player.pw.js), [`tests/unit/test-block-render.php`](../../tests/unit/test-block-render.php) | [MAN-005](manual-acceptance.md#man-005) | manual required for the site's actual consent manager |
| [NFR-PRIV-007](../requirements/privacy.md#nfr-priv-007) | Absence of plugin telemetry and visitor identity records | No dedicated behavioral automation | [MAN-003](manual-acceptance.md#man-003) | manual required; also requires source and network review |
| [NFR-PRIV-008](../requirements/privacy.md#nfr-priv-008) | Explicit editor-triggered external access | [`src/edit.test.js`](../../src/edit.test.js), [`assets/js/editor-preview-controller.test.js`](../../assets/js/editor-preview-controller.test.js) | [MAN-001](manual-acceptance.md#man-001), [MAN-004](manual-acceptance.md#man-004) | combined |

## Accessibility requirements

| Requirement | Test objective | Automated evidence | Manual evidence | Status or limit |
| --- | --- | --- | --- | --- |
| [NFR-A11Y-001](../requirements/accessibility.md#nfr-a11y-001) | Keyboard reachability and operation | [`tests/accessibility/player.pw.js`](../../tests/accessibility/player.pw.js) | [MAN-006](manual-acceptance.md#man-006) | combined |
| [NFR-A11Y-002](../requirements/accessibility.md#nfr-a11y-002), [NFR-A11Y-003](../requirements/accessibility.md#nfr-a11y-003) | Native named controls and disabled states | [`src/view.test.js`](../../src/view.test.js), [`tests/accessibility/player.pw.js`](../../tests/accessibility/player.pw.js) | [MAN-006](manual-acceptance.md#man-006), [MAN-007](manual-acceptance.md#man-007) | combined |
| [NFR-A11Y-004](../requirements/accessibility.md#nfr-a11y-004), [NFR-A11Y-005](../requirements/accessibility.md#nfr-a11y-005) | Status/error announcements and focus continuity | [`src/view.test.js`](../../src/view.test.js), [`tests/accessibility/player.pw.js`](../../tests/accessibility/player.pw.js) | [MAN-006](manual-acceptance.md#man-006), [MAN-007](manual-acceptance.md#man-007) | manual required for assistive-technology behavior |
| [NFR-A11Y-006](../requirements/accessibility.md#nfr-a11y-006) | Logical order during responsive reflow | [`tests/responsive/layout.pw.js`](../../tests/responsive/layout.pw.js), [`tests/accessibility/player.pw.js`](../../tests/accessibility/player.pw.js) | [MAN-006](manual-acceptance.md#man-006), [MAN-008](manual-acceptance.md#man-008) | combined |
| [NFR-A11Y-007](../requirements/accessibility.md#nfr-a11y-007) | Default and theme-compatible contrast | [`tests/accessibility/player.pw.js`](../../tests/accessibility/player.pw.js) | [MAN-008](manual-acceptance.md#man-008) | combined; theme overrides remain site responsibility |
| [NFR-A11Y-008](../requirements/accessibility.md#nfr-a11y-008) | Screen-reader context without duplicate output | [`tests/accessibility/player.pw.js`](../../tests/accessibility/player.pw.js) | [MAN-007](manual-acceptance.md#man-007) | manual required; third-party iframe is outside Axe scope |

## Quality requirements

| Requirement | Test objective | Automated evidence | Manual evidence | Status or limit |
| --- | --- | --- | --- | --- |
| [NFR-001](../requirements/quality.md#nfr-001) | Declared platform compatibility | PHP compatibility lint, CI PHP matrix and [`scripts/check-docs.mjs`](../../scripts/check-docs.mjs) | None | partial; declared minimum WordPress has no direct integration lane |
| [NFR-002](../requirements/quality.md#nfr-002) | Metadata registration and dynamic rendering | [`src/index.test.js`](../../src/index.test.js), [`tests/unit/test-plugin-metadata.php`](../../tests/unit/test-plugin-metadata.php), [`tests/unit/test-block-render.php`](../../tests/unit/test-block-render.php) | None | automated |
| [NFR-003](../requirements/quality.md#nfr-003) | Input validation, normalization and output safety | Parser/render unit tests, PHP/JavaScript lint and Plugin Check | [MAN-001](manual-acceptance.md#man-001) | combined |
| [NFR-004](../requirements/quality.md#nfr-004) | Complete and reproducible localization | [`src/i18n.test.js`](../../src/i18n.test.js), [`tests/unit/test-i18n.php`](../../tests/unit/test-i18n.php), translation reproducibility check | [MAN-009](manual-acceptance.md#man-009) | combined |
| [NFR-005](../requirements/quality.md#nfr-005) | Locked dependencies excluded from releases | Locked installation, CI and release allowlist checks | None | automated |
| [NFR-006](../requirements/quality.md#nfr-006) | Reproducible layered quality gate | [`scripts/local-tests.sh`](../../scripts/local-tests.sh), CI workflow and test suites listed above | Applicable manual cases | combined |
| [NFR-007](../requirements/quality.md#nfr-007) | Deterministic allowlisted ZIP and checksum | [`scripts/build-zip.sh`](../../scripts/build-zip.sh) and release workflow checks | [MAN-010](manual-acceptance.md#man-010) | combined |
| [NFR-008](../requirements/quality.md#nfr-008) | License and metadata consistency | Plugin metadata tests, version checks and release allowlist | [MAN-010](manual-acceptance.md#man-010) | combined |

Actual execution, failures, waivers and accepted residual risks belong in the
corresponding [release audit](../audits/releases/index.md).
