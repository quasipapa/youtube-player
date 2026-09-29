# Project version matrix

This matrix is the central human-readable overview of current platform,
development, test and CI versions. The linked executable configuration remains
authoritative. `npm run check:docs` verifies the concrete values against those
sources and against technical references that must remain synchronized.

| Concern | Current value | Applies to | Authoritative configuration |
| --- | --- | --- | --- |
| Supported WordPress minimum | `6.1` | Installed plugin runtime | Plugin header and `readme.txt` |
| Supported PHP minimum | `8.0` | Installed plugin runtime and compatibility analysis | `composer.json`, plugin header and `readme.txt` |
| Node.js minimum and CI selection | `22.22.2` | Local development, CI and release workflow | `package.json` and workflow `NODE_VERSION` |
| npm minimum | `10.2.3` | Local development | `package.json` |
| Composer | `2.9.5` | Local container commands and CI PHP jobs | `scripts/composer.sh` and `.github/workflows/ci.yml` |
| Playwright | `1.63.0` | Browser test package, server and container image | `package.json` and `scripts/local-tests.sh` |
| Daily WordPress | Current stable release when provisioned | Local manual development | `.wp-env.json` |
| Daily PHP | `8.3` | Local manual development | `.wp-env.json` |
| Integration WordPress | `6.6` | Isolated WordPress, browser and Plugin Check tests | `.wp-env.test.json` |
| Integration PHP | `8.3` | Isolated WordPress, browser and Plugin Check tests | `.wp-env.test.json` |
| CI PHP matrix | `8.0, 8.3` | PHP lint and unit jobs | `.github/workflows/ci.yml` |
| GitHub runner | `ubuntu-24.04` | CI and release jobs | GitHub workflow `runs-on` values |

Exact values remain in requirements or ADRs when they are part of a supported
platform contract or recorded decision. Dated audit records preserve the values
observed during that audit. Other current documentation links to this matrix
instead of copying version numbers.

When a version changes, update its authoritative configuration, every coupled
technical reference and this matrix in the same change. Follow the
[intentional dependency update procedure](setup.md#intentional-dependency-updates)
and run `npm run check:docs` before review.
