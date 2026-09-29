# Automated verification

Commands, selection guidance and expected results for focused checks and the
complete local gate are defined in the development
[quality-gate workflow](../development/workflow.md#quality-gates). This document
describes what the automated tests cover and where their limits are.
Requirement-level automated and manual responsibility is maintained in the
[coverage matrix](coverage.md).

## Automated suite inventory

- `tests/unit/`: PHP metadata, parsing, rendering, preview and translation.
- `src/*.test.js`: editor, frontend, parser, sizing and internationalization.
- `tests/e2e/wordpress.pw.js`: Gutenberg persistence and frontend privacy gate.
- `tests/responsive/`: production markup at representative dimensions, portrait
  and landscape ratios, separate and combined size limits, narrow columns and
  alignment reflow. Tests use local iframe doubles and make no YouTube requests.
- `tests/accessibility/`: keyboard, focus, status, contrast, forced colors,
  multiple blocks and consent integration with local API doubles.

Plugin Check runs only against staged production files. Narrow exemptions are
recorded in its script/configuration and cover block API version 2 for WordPress
6.1, the GitHub update URI, the YouTube name and explicit bundled translation
loading. Other warnings or errors require investigation.

The integration site uses the configured WordPress and PHP test versions because
Plugin Check requires a newer WordPress installation than the declared minimum.
CI separately exercises the configured PHP compatibility boundaries. The
declared WordPress minimum has no direct integration coverage. Concrete values
and their sources are in the [version matrix](../development/versions.md).
