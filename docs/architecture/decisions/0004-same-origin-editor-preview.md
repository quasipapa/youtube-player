# ADR 0004: Serve editor previews through an authenticated same-origin document

- Status: Accepted – documented retrospectively
- Date of decision: 2026-09-06
- Evidence: commits `bd21073`, `a090da2`
- Affected requirements: [FR-005](../../requirements/product.md#fr-005),
  [NFR-PRIV-007](../../requirements/privacy.md#nfr-priv-007)

## Context

Gutenberg may render its canvas from a `blob:` URL. Direct YouTube embeds there
can lack the HTTP referrer expected by YouTube and fail with player error 153.
The preview must still validate input and must not expose an unauthenticated
embedding endpoint.

## Decision

Create a nonce-protected authenticated WordPress AJAX URL for valid playlist
input. That endpoint returns a minimal same-origin document containing a
`youtube-nocookie.com` preview. Require `edit_posts`, validate the nonce and
parse the playlist again on the server. Keep the editor preview non-interactive.

## Alternatives considered

- Embed YouTube directly in the Gutenberg canvas.
- Proxy media through WordPress.
- Omit a real editor preview.

## Consequences

The preview receives a stable site origin without proxying media. Editing valid
content contacts YouTube before public-page consent, so the editor displays that
fact. Empty or invalid input creates no preview or external request.
