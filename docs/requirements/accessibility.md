# Accessibility requirements

<a id="nfr-a11y-001"></a>
## NFR-A11Y-001 – Keyboard operation

All block functions are reachable and operable using a keyboard.

<a id="nfr-a11y-002"></a>
## NFR-A11Y-002 – Native controls and names

Actions use native `button` elements with translatable accessible names.
Decorative icons are hidden from assistive technology.

<a id="nfr-a11y-003"></a>
## NFR-A11Y-003 – Semantic disabled states

Unavailable navigation actions use the native `disabled` state.

<a id="nfr-a11y-004"></a>
## NFR-A11Y-004 – Status communication

Position and non-error status updates use polite live regions. Errors are
announced as alerts without duplicating ordinary status output.

<a id="nfr-a11y-005"></a>
## NFR-A11Y-005 – Focus continuity

Visible focus remains apparent. When an active control becomes disabled or a
player fails or is revoked, focus moves to a logical usable target.

<a id="nfr-a11y-006"></a>
## NFR-A11Y-006 – Logical responsive order

Responsive visual reflow does not change logical DOM or tab order.

<a id="nfr-a11y-007"></a>
## NFR-A11Y-007 – Theme-compatible contrast

Default controls and focus indicators meet the documented contrast targets.
Colors remain customizable through documented variables; site themes remain
responsible for preserving sufficient contrast after overrides.

<a id="nfr-a11y-008"></a>
## NFR-A11Y-008 – Screen-reader context

The player region, controls, current item and total item count expose enough
context for non-visual operation without announcing decorative or duplicate
content.

Automated and manual verification is mapped in the
[accessibility coverage matrix](../testing/coverage.md#accessibility-requirements).
