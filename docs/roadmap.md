# Roadmap

The roadmap describes desired outcomes and order. GitHub issues contain concrete
tasks, milestones contain mutable release scope, and GitHub releases record what
was delivered. Dates and target releases are commitments only when explicitly
approved by the project owner.

<a id="rm-001"></a>
## RM-001 – Establish the privacy-aware playlist player

**Scope:** product\
**Status:** delivered\
**Requirements:** [product](requirements/product.md),
[privacy](requirements/privacy.md), [accessibility](requirements/accessibility.md)\
**Milestone:** M6 – Release 0.1.0\
**Delivered in:** [v0.1.0 Alpha](https://github.com/quasipapa/youtube-player/releases/tag/v0.1.0)

Deliver the first installable Gutenberg playlist player with robust input,
privacy gating, navigation, sizing, internationalization, accessibility,
automated quality checks and reproducible release packaging.

<a id="rm-002"></a>
## RM-002 – Make project knowledge durable and navigable

**Scope:** documentation\
**Status:** in progress\
**Issue:** [#35](https://github.com/quasipapa/youtube-player/issues/35)\
**Milestone:** M5 – Tests and CI\
**Target release:** none; documentation and development infrastructure

Separate authoritative requirements, architecture, tests, operations, user
guidance, ideas and roadmap information. Preserve traceability for humans and AI
systems and make functionally equivalent reconstruction possible.

<a id="rm-003"></a>
## RM-003 – Shorten CI safely for documentation-only changes

**Scope:** development, testing, documentation\
**Status:** planned after RM-002\
**Origin:** [IDEA-003](ideas.md#idea-003)\
**Issue:** [#73](https://github.com/quasipapa/youtube-player/issues/73)\
**Milestone:** M5 – Tests and CI\
**Target release:** none; development infrastructure

Classify documentation, release metadata and code/tooling changes in an always
started workflow. Keep a stable required gate and default unknown paths to the
complete test suite.

<a id="rm-004"></a>
## RM-004 – Extract a reusable WordPress plugin foundation

**Scope:** development, operations\
**Status:** planned after the documentation and CI foundations\
**Related idea:** [IDEA-001](ideas.md#idea-001)\
**Issue:** [#22](https://github.com/quasipapa/youtube-player/issues/22)\
**Milestone:** M7 – Reusable plugin foundation\
**Target release:** a separately versioned foundation; not a player release

Extract the proven build, test, packaging and release base into a versioned
template, reusable workflows and a Codex skill without making the player project
the source of truth for the generic base.

<a id="rm-005"></a>
## RM-005 – Evaluate reusable specification and documentation workflows

**Scope:** documentation, development\
**Status:** deferred until the local schema has been used in practice\
**Ideas:** [IDEA-001](ideas.md#idea-001), [IDEA-002](ideas.md#idea-002)\
**Target release:** none

After practical use, decide whether to extract the documentation schema and
whether OpenSpec should manage future behavioral change specifications. Avoid
two authoritative requirement sets.
