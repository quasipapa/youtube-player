# Project documentation

This is the authoritative entry point for the YouTube Playlist Player
documentation. It is written for maintainers, contributors, reviewers and AI
systems. Start here instead of inferring project intent from source files or old
issue chronology.

## Start by role

Follow the starting documents in the listed order, then select further reading
for your task. A person may use more than one role's path.

| Role | Start here | Further reading for typical tasks |
| --- | --- | --- |
| WordPress editor | [Block configuration](user/configuration.md), [appearance](user/appearance.md), [privacy](user/privacy.md) | Understand playback and availability messages in the [message guide](user/configuration.md#understand-messages) |
| WordPress website administrator | [Site configuration](operations/site-configuration.md), [supported platforms](operations/maintenance.md#supported-platforms) | Verify the site with [manual acceptance](testing/manual-acceptance.md); install release candidates using the [release procedure](operations/releases.md) |
| WordPress theme and integration developer | [Integration contracts](integrations/index.md), then the applicable theme, consent or attribute contract | Consult [architecture](architecture/overview.md), [requirements](requirements/product.md) and [coverage](testing/coverage.md) for integration work |
| Plugin developer | [Setup](development/setup.md), [workflow](development/workflow.md), [architecture overview](architecture/overview.md) | Follow the affected [requirements and decisions](traceability.md#requirements-decisions-and-verification), [interfaces](integrations/index.md) and [coverage](testing/coverage.md) |
| Plugin tester | [Test strategy](testing/strategy.md), [coverage matrix](testing/coverage.md) | Follow linked requirements, [automated suites](testing/automated.md) and [manual cases](testing/manual-acceptance.md); consult [release audits](audits/releases/index.md) for results |
| Plugin maintainer / release owner | [CI](operations/ci.md), [release process](operations/releases.md), [maintenance](operations/maintenance.md) | Review [coverage gaps](testing/coverage.md), [release audits](audits/releases/index.md), [roadmap](roadmap.md) and [pre-release acceptance](operations/releases.md#pre-release-acceptance) |
| Plugin product owner | [Product requirements](requirements/product.md), [quality requirements](requirements/quality.md), [roadmap](roadmap.md) | Assess [ideas](ideas.md), [traceability](traceability.md), [privacy](requirements/privacy.md), [accessibility](requirements/accessibility.md) and [audit findings](audits/index.md) when deciding scope or accepting risk |

## Working with AI assistance

AI assistance follows the reading path for the role being performed, such as
plugin developer or tester.

1. Read the applicable repository and agent instructions.
2. Consult the [documentation policy](documentation-policy.md) and the relevant
   role's reading path above.
3. Identify the requirements, interfaces and evidence affected by the task.
4. Apply the [document update rules](documentation-policy.md#document-update-rules)
   when preparing changes.

Binding agent instructions remain in their designated instruction files.

## Look up by question

- To understand the product, read the [product requirements](requirements/product.md),
  [quality requirements](requirements/quality.md), [privacy requirements](requirements/privacy.md)
  and [accessibility requirements](requirements/accessibility.md).
- To understand or recreate the implementation, read the
  [architecture overview](architecture/overview.md),
  [runtime architecture](architecture/runtime.md),
  [development architecture](architecture/development.md) and the
  [architecture decisions](architecture/decisions/).
- To build or change the project, use the
  [project version matrix](development/versions.md),
  [local setup](development/setup.md) and the
  [development workflow](development/workflow.md).
- To continue the separate WordPress/Codex MCP investigation, start with the
  [MCP status and reading path](mcp/index.md). This material is an excursus and
  is not part of the plugin's core development workflow.
- To verify behavior, use the [test strategy](testing/strategy.md),
  [requirement coverage](testing/coverage.md),
  [automated checks](testing/automated.md) and
  [manual acceptance checks](testing/manual-acceptance.md).
- To inspect dated investigations and their evidence, use the
  [audit records](audits/).
- To operate or release the project, read [CI](operations/ci.md),
  [release packaging](operations/releases.md) and
  [maintenance](operations/maintenance.md).
- As an editor, start with [block configuration](user/configuration.md),
  [appearance](user/appearance.md) and [privacy for editors](user/privacy.md).
- As a website administrator, follow [site configuration](operations/site-configuration.md).
- As a theme or consent-adapter developer, use [integration contracts](integrations/index.md).
- To understand future work and its provenance, read the [roadmap](roadmap.md),
  [ideas](ideas.md), [traceability index](traceability.md) and
  [project history](project-history.md).

### Sources of truth

| Question | Authoritative source |
| --- | --- |
| What must the product do? | `docs/requirements/` |
| How do editors use the block? | `docs/user/` |
| Which public interfaces can developers integrate with? | `docs/integrations/` |
| How is the system structured and why? | `docs/architecture/` and its ADRs |
| How is a change built and verified? | `docs/development/` and `docs/testing/` |
| Which platform, tool and test versions are current? | `docs/development/versions.md` |
| Where are dated audit findings and mitigations recorded? | `docs/audits/` |
| Where is the separate WordPress/Codex MCP investigation? | `docs/mcp/` |
| How do CI, packaging, release and maintenance work? | `docs/operations/` |
| What might or will be developed next? | `docs/ideas.md` and `docs/roadmap.md` |
| What work is currently actionable? | GitHub issues and milestones |
| What was actually shipped? | Git tags, GitHub releases and release notes |
| What code is currently executed? | The source tree and generated production build |

Documentation describes required behavior, stable contracts and architectural
intent. Source code remains the authoritative implementation. When the two
disagree, the discrepancy must be resolved explicitly; neither is silently
assumed to supersede the other.

## Documentation governance

The [documentation policy](documentation-policy.md) defines identifiers,
statuses, links, ownership, change impact and release reconciliation. It also
states what must be explicit so that a human or AI system can build a
functionally equivalent implementation rather than reproduce source bytes.
