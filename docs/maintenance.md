# Maintenance and support

This document describes the maintenance process for YouTube Playlist Player
after the 0.1.x release line.

## Supported platforms

The supported baseline is:

- WordPress 6.1 or later;
- PHP 8.0 or later;
- a current version of a supported evergreen browser with JavaScript enabled;
- the current stable WordPress release is used for development and smoke tests.

The CI matrix checks PHP 8.0 and 8.3. WordPress compatibility is verified with
the configured `@wordpress/env` version and the browser suites. Older WordPress,
PHP, or browser versions may work, but are not guaranteed or tested.

The plugin depends on YouTube's IFrame Player API and on behavior outside the
plugin's control. Availability, embedding permissions, contacted hosts and
privacy behavior must be rechecked before deployment; see
[the privacy documentation](privacy.md).

## Support process

Use the repository issue templates for reproducible bugs and planned work:

1. Search existing issues and confirm the problem on the current release.
2. Include the plugin version, WordPress version, PHP version, browser, theme,
   configuration, reproduction steps and relevant console or server output.
3. Do not include passwords, tokens, personal data, full visitor URLs or private
   playlist identifiers in an issue.
4. A maintainer triages new reports, assigns labels and records the affected
   supported versions.

Questions and feature requests should be kept separate from security reports.
There is no guaranteed response or fix time for unsupported platform versions.

## Security process

Do not report a suspected vulnerability in a public issue. Follow
[SECURITY.md](../SECURITY.md) for private reporting and the information needed
to investigate it.

Security fixes are developed on a dedicated branch, reviewed through a pull
request, and verified against the complete quality gate before release. The
release notes state the affected versions, severity where appropriate, and the
upgrade or mitigation instructions.

## Dependency and compatibility review

Dependabot checks npm and GitHub Actions dependencies weekly. Pull requests from
Dependabot must pass the same CI checks as all other changes. A maintainer
reviews, at least monthly and before each release:

- open Dependabot alerts and pull requests;
- the PHP and WordPress versions exercised by CI;
- the pinned GitHub Action SHAs and their upstream release notes;
- YouTube IFrame API and privacy documentation changes;
- the release ZIP contents and version declarations.

Development dependencies are not shipped in the plugin ZIP. Do not apply
automatic breaking upgrades or `npm audit fix --force`; update intentionally,
review the lockfile, and run the complete local and CI quality gates.

## Release cadence and records

Patch releases are for compatible bug or security fixes. Minor releases may add
backward-compatible features. Major releases may change supported platforms or
behavior and require migration notes. Every release updates the changelog,
documents user-visible changes and records any manual privacy, accessibility or
theme checks that were repeated.

The release procedure, ZIP verification and tag approval are documented in
[docs/release.md](release.md). Creating and pushing a release tag is an explicit
maintainer action.
