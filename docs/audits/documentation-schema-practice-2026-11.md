# Documentation schema in practice, November 2026

- Date: 2026-11-20 to 2026-11-21
- Scope: documentation, development
- Purpose: practical-use evidence for
  [IDEA-001](../ideas.md#idea-001) and [RM-005](../roadmap.md#rm-005)
- Decision: open in [issue #137](https://github.com/quasipapa/youtube-player/issues/137)

## Trigger and scope

RM-005 defers extracting the documentation schema until the local schema has
been used in practice. This record collects that use from one maintenance
series: dependency updates, a toolchain upgrade, a platform-minimum correction
and a new CI lane. The changes were prepared by an AI coding agent (Claude Code)
following [AGENTS.md](../../AGENTS.md) and reviewed and merged on the
maintainer's instruction.

Reviewed changes:

| Change | Subject |
| --- | --- |
| [#123](https://github.com/quasipapa/youtube-player/pull/123) | Declare `jsdom` and pin the Vitest toolchain |
| [#124](https://github.com/quasipapa/youtube-player/pull/124) | markdown-it 15 with a matching `linkify-it` override |
| [#126](https://github.com/quasipapa/youtube-player/pull/126) | Dependabot group for the Markdown tooling |
| [#127](https://github.com/quasipapa/youtube-player/pull/127) | Scope the `minimatch` override per `markdownlint-cli` version |
| [#130](https://github.com/quasipapa/youtube-player/pull/130) | Playwright 1.65.1 |
| [#131](https://github.com/quasipapa/youtube-player/pull/131) | Node.js 24.22.3 and npm 11 |
| [#135](https://github.com/quasipapa/youtube-player/pull/135) | WordPress 6.6 minimum, ADR 0009 |
| [#136](https://github.com/quasipapa/youtube-player/pull/136) | Minimum-platform integration lane (open when this record was written) |

The record evaluates the schema, not the individual changes. Their own evidence
is in the pull requests.

## Observations

### Version matrix and consistency checks

`npm run check:docs` detected real drift three times:

- In #130 Dependabot raised `@playwright/test` only. CI failed with
  `Version matrix Playwright: expected 1.65.1, found 1.63.0` and the same
  mismatch for `scripts/local-tests.sh`. The check forced the coupled container
  and matrix update that the dependency bot cannot make.
- In #135 a negative test with `readme.txt` reset to WordPress 6.1 failed with
  `readme.txt WordPress minimum: expected 6.6, found 6.1`.
- In #136 a negative test with the minimum-lane configuration set to WordPress
  6.5 and PHP 8.3 produced four mismatch errors against the matrix and the
  declared minimums.

New coupling rules were added with little code because `checkVersion` already
compares one declared value with named references. The checks read values from
named project files, such as the plugin header, `readme.txt`, `.wp-env*.json`,
workflows and scripts. They are therefore specific to this WordPress plugin.

### Document update rules and PR documentation questions

The change table in the [documentation policy](../documentation-policy.md#document-update-rules)
decided which documents each change touched. Examples:

- tool version change (#131): version matrix and setup guide; operations
  documents link to the matrix and needed no edit;
- Dependabot handling (#126): maintenance guide;
- platform minimum (#135): requirement, new ADR, ADR index, traceability and
  matrix.

The PR template required an explicit rationale when no document changed. #124
and #127 recorded that the dated dependency audit keeps its historical values
and that the matrix does not list the updated packages. The rule "dated records
preserve observed values" removed the temptation to edit old evidence.

The rationale "not in the version matrix, therefore no documentation change"
depends on which tools the matrix lists. That scope is a judgment call that the
schema does not state.

### ADR lifecycle

ADR 0009 replaced the WordPress minimum of ADR 0002 while ADR 0002's
dynamic-rendering decision stays in force. The status vocabulary has
`superseded` but no partial form, so ADR 0002's status line spells out which
part is superseded.

### Ideas, issues and traceability

The idea lifecycle worked as intended:
[IDEA-004](../ideas.md#idea-004) → [#115](https://github.com/quasipapa/youtube-player/issues/115)
→ lane delivered, with its first run exposing
[#132](https://github.com/quasipapa/youtube-player/issues/132) → ADR 0009.
A new idea, IDEA-005, was refused by `check:docs` with
`Traceability index does not reference idea-005` until the traceability index
linked it. Follow-up decisions (#133, #134, #137) were captured as tickets with
explicit criteria rather than as notes.

### Agent entry point

The agent followed the reading path in `AGENTS.md`, the WSL rule, the exact-pin
rule for development dependencies and the no-force-push rule. When the agent
attempted a force-push after a rebase, the tool's permission classifier blocked
it, and the agent used a merge commit instead. The binding rules were found
through `AGENTS.md` without additional prompting.

## Friction

- **Append conflicts**: `docs/ideas.md` and `docs/traceability.md` collect
  entries at the end of central files. Two branches adding entries produced
  merge conflicts, which were resolved by keeping both entries.
- **Partial supersession**: there is no status value for an ADR that is only
  partly superseded (see above).
- **Matrix scope**: which tools belong in the version matrix is not defined.
- **Tooling outside the schema**: deleting a merged base branch from a script
  closed a stacked pull request instead of retargeting it. This is a workflow
  matter, not a documentation-schema matter, but it affects how stacked
  documentation and code changes are delivered.

## Assessment for IDEA-001

These observations support the open questions of IDEA-001 as follows:

- **Useful after real maintenance**: the version matrix with its checker, the
  change → documents table, the PR documentation questions, stable IDs with
  enforced traceability, and the agent entry point.
- **Needs generalization**: the checker's value sources and file names; a
  generic core would compare configured declarations, with WordPress-specific
  rules as an optional profile.
- **Not yet answered**: distribution as a skill, a repository template or both,
  and evidence from a second, non-WordPress project.

## Remaining risk

The evidence comes from one project, one maintainer and a short period. Most
changes were tooling and platform changes, and none was a larger functional
feature, so the requirement and coverage parts saw only small updates. The
assessment is an input to [issue #137](https://github.com/quasipapa/youtube-player/issues/137),
not a decision.
