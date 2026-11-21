# ADR 0010: Up-to-date pull requests and verified main commits

- Status: Accepted
- Date of decision: 2026-11-21
- Evidence: maintenance series #117–#138, recorded in the
  [documentation schema audit](../../audits/documentation-schema-practice-2026-11.md)
- Affected requirements: [NFR-006](../../requirements/quality.md#nfr-006)

## Context

Several pull requests were often open at the same time, most of them
Dependabot updates that all change `package-lock.json`. Three effects were
observed:

- After each merge the remaining pull requests conflicted in the lockfile and
  had to be rebuilt one after another.
- The required **CI gate** was not required to run on the current `main`, so a
  pull request could merge after being tested only against an older base. Two
  individually green changes were never verified in combination.
- The CI concurrency group was shared per ref and cancelled runs in progress,
  also on `main`. Two merges in quick succession cancelled the first merge
  commit's run, so that commit was never verified on its own.

A GitHub merge queue would test the combination of waiting pull requests in
order. It is not available for this repository because the repository is owned
by a user account, and no move to an organization is planned.

## Decision

- The `Protect main` ruleset requires branches to be up to date before merging
  (`strict_required_status_checks_policy: true`). A pull request that falls
  behind `main` must be updated and pass **CI gate** again.
- CI cancels outdated runs only for pull requests. Every other event, including
  each push to `main`, runs in its own concurrency group per commit and is
  never cancelled or displaced.
- Dependabot groups the remaining npm minor and patch updates into one weekly
  pull request and all GitHub Actions updates into another, in addition to the
  existing coupled-package groups. Major npm updates stay separate.

## Alternatives considered

- Merge queue: preferred technically, unavailable for user-owned repositories.
- Up-to-date requirement only: leaves merge commits unverified when merges
  follow each other quickly.
- Keeping individual Dependabot pull requests: maximizes lockfile conflicts,
  which the up-to-date requirement turns into additional CI cycles.

## Consequences

Merging becomes serial: after each merge, the other open pull requests must be
updated and wait for another full CI run. For this project the extra waiting
time is accepted. A failure on `main` can be attributed to one merge commit.
Grouped Dependabot pull requests can combine several updates; when one of them
fails, the group must be split or fixed in a follow-up commit. The procedure is
described in [CI operations](../../operations/ci.md#merging-and-main-verification).
