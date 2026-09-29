# Site configuration

For website administrators responsible for enabling the plugin on a site.
Editorial use is described in [block configuration](../user/configuration.md).

## Consent configuration

Keep the built-in gate enabled unless the site's external consent manager or
content blocker provides equivalent protection. Disabling the gate alone allows
loading when the page initializes. Agree this setting with editors before they
publish content.

An external adapter must be configured and verified for the actual site. No
vendor-specific adapter is shipped. Give its developer the
[consent integration contract](../integrations/consent.md).
The site's other plugins and embeds require their own assessment.

## Verification and responsibilities

Use [MAN-003](../testing/manual-acceptance.md#man-003) for network and storage
verification and [MAN-005](../testing/manual-acceptance.md#man-005) for the actual
consent manager. Record the environment, results and remaining limitations in a
dated audit. A [historical network observation](../audits/network-2026-09-10.md)
is available as evidence for that session, not a permanent host allowlist.

Review the site's privacy information and consent configuration with the
responsible specialist. The plugin's technical features do not establish legal
compliance for the complete website. Theme changes also require
[manual presentation checks](../testing/manual-acceptance.md#man-008).
