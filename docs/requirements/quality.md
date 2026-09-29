# Quality and technical requirements

<a id="nfr-001"></a>
## NFR-001 – Supported platform

The declared minimum platform is WordPress 6.1 and PHP 8.0. Current WordPress
and maintained PHP versions are additionally exercised where the test tooling
permits. See [ADR 0002](../architecture/decisions/0002-minimum-wordpress-and-dynamic-rendering.md).

<a id="nfr-002"></a>
## NFR-002 – Metadata-driven dynamic block

The block is registered from `block.json`, uses server-side rendering, and loads
editor or frontend assets only in the relevant context.

<a id="nfr-003"></a>
## NFR-003 – Input and output safety

All external input is validated or normalized, and all generated output is
escaped for its output context. Unexpected values fail safely.

<a id="nfr-004"></a>
## NFR-004 – Internationalization

English is the source language and `yt-playlist-player` is the text domain. PHP,
JavaScript and block metadata use WordPress internationalization mechanisms; a
German translation and reproducibly generated POT, MO and JSON catalogs are
included.

<a id="nfr-005"></a>
## NFR-005 – Reproducible dependencies

JavaScript and PHP development dependencies are locked by `package-lock.json`
and `composer.lock`. Development dependencies are not shipped in the plugin.

<a id="nfr-006"></a>
## NFR-006 – Layered verification

Formatting, static analysis, unit, integration, browser, accessibility, Plugin
Check and production build checks have a common reproducible local entry point.
Human or external-service judgments remain separate manual checks. See
[ADR 0005](../architecture/decisions/0005-layered-quality-gate.md).

<a id="nfr-007"></a>
## NFR-007 – Reproducible release artifact

The release ZIP is built from an explicit runtime allowlist with deterministic
file ordering and timestamps, has one `yt-playlist-player/` root directory and
is accompanied by a SHA-256 checksum. See
[ADR 0006](../architecture/decisions/0006-reproducible-allowlisted-release-package.md).

<a id="nfr-008"></a>
## NFR-008 – License and provenance

Project-owned code is GPL-2.0-or-later. `LICENSE`, plugin metadata, package
metadata and `readme.txt` remain consistent; shipped third-party material is
recorded in `THIRD_PARTY_NOTICES.md` where applicable.

Automated and manual verification is mapped in the
[quality coverage matrix](../testing/coverage.md#quality-requirements).
