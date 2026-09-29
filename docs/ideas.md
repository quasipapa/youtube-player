# Ideas

Ideas preserve possibilities and questions without promising implementation or
a release. An idea remains as provenance when formalized, rejected or deferred.

<a id="idea-001"></a>
## IDEA-001 – Reusable documentation schema and Codex skill

**Scope:** documentation, development\
**Status:** evaluating\
**Roadmap:** [RM-004](roadmap.md#rm-004), [RM-005](roadmap.md#rm-005)

Extract the documentation model proven here into a technology-neutral,
versioned template plus a focused Codex skill with initialize, audit, update and
trace workflows. Keep the generic schema independent from the WordPress plugin
foundation so non-WordPress projects can use it.

Open questions:

- Which parts remain useful after several real maintenance changes?
- Should distribution be a standalone skill, a repository template or both?
- Which link and relationship checks justify deterministic scripts?

<a id="idea-002"></a>
## IDEA-002 – Pilot OpenSpec for a substantial future change

**Scope:** documentation, development\
**Status:** deferred\
**Roadmap:** [RM-005](roadmap.md#rm-005)

Evaluate OpenSpec on one bounded, meaningful functional change after the current
documentation structure is stable. If adopted, OpenSpec specs would become the
authoritative behavioral specification and `docs/requirements/` would become an
overview rather than a competing source. Adoption requires a separate ADR.

<a id="idea-003"></a>
## IDEA-003 – Change-sensitive CI paths

**Scope:** development, testing, documentation\
**Status:** formalized\
**Roadmap:** [RM-003](roadmap.md#rm-003)\
**Formalized as:** [Issue #73](https://github.com/quasipapa/youtube-player/issues/73)

Use a short documentation validation path for known docs-only changes while
preserving complete checks for code, tooling and uncertain paths. The workflow
change follows documentation modularization and will have its own ADR.

<a id="idea-004"></a>
## IDEA-004 – Direct minimum-WordPress integration coverage

**Scope:** testing\
**Status:** idea

The integrated Plugin Check site uses a newer WordPress installation than the
declared minimum; the concrete values are in the
[version matrix](development/versions.md). Consider a separate minimum-version
integration lane that does not run Plugin Check. Static PHP compatibility checks
do not prove WordPress runtime behavior.
