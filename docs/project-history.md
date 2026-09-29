# Project history

This page is a concise orientation, not the operational backlog or a duplicate
requirements source. Git commits, pull requests, issues, milestones and releases
are the detailed historical record.

## Foundation and MVP

The repository, local WordPress environment, build tools, licensing and GitHub
organization were established in steps 0–5. Steps 6–8 added the dynamic block,
robust playlist parsing and the privacy-gated YouTube player.

## Product completion for the alpha

Steps 8a–12 added the keyless availability check, complete playlist navigation,
responsive sizing, translations, accessibility and consent-manager integration.
The keyless check is documented in [ADR 0001](architecture/decisions/0001-keyless-playlist-availability-check.md).

## Quality and release

Steps 13–17 established the layered local quality gate, GitHub CI, reproducible
ZIP packaging, automated releases and maintenance policy. The first complete
release workflow published [v0.1.0 Alpha](https://github.com/quasipapa/youtube-player/releases/tag/v0.1.0)
on 12 September 2026.

## Current work

- [Issue #35](https://github.com/quasipapa/youtube-player/issues/35) modularizes
  and governs documentation.
- [Issue #73](https://github.com/quasipapa/youtube-player/issues/73) will optimize
  CI for documentation-only changes after the new structure is stable.
- [Issue #22](https://github.com/quasipapa/youtube-player/issues/22) will extract
  the reusable plugin foundation after the proven project documentation is in
  place.

See the [roadmap](roadmap.md) for desired outcomes and GitHub for current task
status.
