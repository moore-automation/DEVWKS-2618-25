# DEVWKS-2618: Keeping Compliant with Open-Source Automation and NSO

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

Hands-on workshop: integrate Cisco NSO into a GitLab CI/CD pipeline with pyATS testing and compliance reporting.

**Workshop site:** [moore-automation.github.io/DEVWKS-2618](https://moore-automation.github.io/DEVWKS-2618/)

**Duration:** ~45 minutes

## What you'll learn

- CI/CD fundamentals for network services
- NSO package development in GitLab (`developer/nso_cicd`)
- Automated testing with pyATS and Robot Framework
- NSO compliance reporting in the pipeline

## Prerequisites

- NSO Reservable Sandbox (or equivalent lab)
- VPN access when required
- Node.js 20+ (for local site development and production build)

## Lab environment

| Component | URL / notes |
|-----------|-------------|
| GitLab | `http://devtools-gitlab.lab.devnetsandbox.local/developer/nso_cicd` |
| NSO Development | `http://10.10.20.47:8080` |
| NSO Production | `http://10.10.20.48:8080` |
| Login | `developer` / `C1sco12345` |

Use the workshop GitLab hostname for Web IDE (not `localhost:2080`).

The full GitLab project (`packages/`, `tests/loopback-test/`, `pipeline_utils/`) is provisioned on the DevTools VM. This repo does not import as that tree.

## Develop and build the workshop site locally

```bash
cd site && npm ci && npm run dev
```

Or from the repo root:

```bash
make docs-dev      # http://localhost:5173
make docs-build    # writes to docs/ with SITE_BASE=/DEVWKS-2618/
make docs-lint
```

Production output goes to `docs/` (gitignored). Publish that folder to GitHub Pages using your usual process after `make docs-build`.

### Optional pre-push hook

Run lint and build before every push:

```bash
git config core.hooksPath .githooks
```

The hook runs `make docs-lint` and `make docs-build` from the repo root.

## Repository layout

| Path | Purpose |
|------|---------|
| `site/` | Vite + React workshop presentation (source) |
| `resources/` | Reference scripts and `.gitlab-ci.yml` for workshop copy blocks (not a GitLab import seed) |
| `.githooks/` | Optional git hooks (`pre-push` runs site lint + build) |

## Authors

- **Ed Moore** — [@moore-automation](https://github.com/moore-automation)
- **David Quezada**
- **Jorge Mira**

## License

Apache License 2.0 — see [LICENSE](LICENSE).
