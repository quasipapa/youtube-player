# ADR 0002: WordPress 6.1 minimum and metadata-driven dynamic rendering

- Status: Accepted – documented retrospectively
- Date of decision: 2026-09-05
- Evidence: commit `5862a17`; plugin header, `readme.txt` and `src/block.json`
- Affected requirements: [NFR-001](../../requirements/quality.md#nfr-001),
  [NFR-002](../../requirements/quality.md#nfr-002)

## Context

The block must render current markup from saved attributes instead of storing a
markup snapshot. WordPress 6.1 introduced the `render` property in `block.json`,
which allows the PHP template to be declared with the rest of block metadata.

## Decision

Require WordPress 6.1 and declare `render: file:./render.php` in block metadata.
Register the block from its generated metadata directory. Require PHP 8.0 as the
runtime language floor.

## Alternatives considered

- Keep WordPress 6.0 and pass a `render_callback` during registration.
- Save frontend markup in post content and migrate it when markup changes.

## Consequences

Registration and dynamic rendering remain metadata-driven and the saved content
stays compact. Sites below WordPress 6.1 cannot install the plugin. Compatibility
claims and release metadata must keep the WordPress and PHP floors synchronized.

The integrated WordPress/Plugin Check environment uses the configured test
versions because Plugin Check requires a newer WordPress installation. CI also
checks the declared PHP minimum statically, but no current integration job
executes the declared WordPress minimum directly. Current values are in the
[version matrix](../../development/versions.md). The coverage gap is tracked as
[IDEA-004](../../ideas.md#idea-004) and must not be confused with direct
minimum-version runtime evidence.
