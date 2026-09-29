# Privacy requirements

These accepted requirements constrain all player and editor behavior. Technical
privacy features do not guarantee legal compliance for an entire website.

<a id="nfr-priv-001"></a>
## NFR-PRIV-001 – No external request before frontend consent

With the built-in gate enabled, no YouTube or Google script, iframe, image or
other external player resource is requested before deliberate visitor action.

<a id="nfr-priv-002"></a>
## NFR-PRIV-002 – Local gate by default

The default frontend state is a locally rendered explanation and consent button.
Only after activation may the IFrame API and player load.

<a id="nfr-priv-003"></a>
## NFR-PRIV-003 – No-cookie player host

Plugin-created video iframes use `https://www.youtube-nocookie.com` exclusively.
Documentation must state that this host does not eliminate all data transfer to
Google or YouTube.

<a id="nfr-priv-004"></a>
## NFR-PRIV-004 – Playlist-scoped local preference

Local consent is stored without visitor identity for one canonical playlist,
site origin and browser. Missing or unavailable storage must not prevent a
one-page grant. An editor can clear the selected playlist's stored preference.

<a id="nfr-priv-005"></a>
## NFR-PRIV-005 – External consent-manager integration

The built-in gate may be disabled per block only when an external system
provides equivalent blocking. A WordPress filter and per-block JavaScript events
allow an adapter to veto, grant and revoke loading. The site operator remains
responsible for provider-specific configuration and verification.

<a id="nfr-priv-006"></a>
## NFR-PRIV-006 – Revocation boundary

Revocation removes the plugin's iframe, disables its controls and clears its
stored preference. It cannot undo prior data transfer, cancel every in-flight
request or remove a shared API script that other page components may use.

<a id="nfr-priv-007"></a>
## NFR-PRIV-007 – No plugin telemetry

The plugin creates no analytics or telemetry and stores no server-side visitor
identity or consent audit log.

<a id="nfr-priv-008"></a>
## NFR-PRIV-008 – Explicit editor external access

The editor explains that a valid preview contacts YouTube. The separate
availability check makes no request until the editor explicitly starts it.

The detailed integration contract is in
[consent integration](../integrations/consent.md). Observed network behavior is
recorded in the [dated network audit](../audits/network-2026-09-10.md). The core loading decision is recorded in
[ADR 0003](../architecture/decisions/0003-deferred-youtube-loading-and-consent.md).
Automated and manual verification is mapped in the
[privacy coverage matrix](../testing/coverage.md#privacy-requirements).
