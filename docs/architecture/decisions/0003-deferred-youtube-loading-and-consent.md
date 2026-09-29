# ADR 0003: Defer YouTube loading behind an extensible consent boundary

- Status: Accepted – documented retrospectively
- Date of decision: 2026-09-06
- Evidence: commits `b10276a`, `bd21073`, `7e7b58b`, `d706fb4`
- Affected requirements: [NFR-PRIV-001](../../requirements/privacy.md#nfr-priv-001)
  through [NFR-PRIV-008](../../requirements/privacy.md#nfr-priv-008)

## Context

An embedded YouTube player contacts third parties. Sites need a useful default
without preventing integration with an existing consent manager, and loading a
playlist must remain distinct from starting media playback.

## Decision

Render only local content until an accepted activation. Default the per-block
gate to enabled, remember an accepted choice per canonical playlist and origin,
and provide a PHP filter plus cancelable/command browser events for external
managers. Use the IFrame API with `youtube-nocookie.com` players and autoplay off.

## Alternatives considered

- Emit an iframe immediately and rely only on YouTube's no-cookie host.
- Require one specific consent-manager plugin.
- Treat a consent grant as permission to autoplay.

## Consequences

Default public rendering initiates no YouTube request. Integrators can veto,
grant and revoke per instance without a hard dependency. Site operators remain
responsible for legal assessment and manager-specific configuration; revocation
cannot undo a request already made.
