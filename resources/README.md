# Workshop resources (reference only)

Reference copies of lab scripts and the canonical `.gitlab-ci.yml` used by the interactive workshop site (`site/`). These files are **not** a complete GitLab project import.

The live lab project `developer/nso_cicd` on the DevTools VM includes the full tree (`packages/loopback/`, `tests/loopback-test/`, `pipeline_utils/environments.yml`, etc.). Students work there in the Web IDE; paths in the pipeline YAML match that layout.

## Contents

| File | Role |
|------|------|
| `.gitlab-ci.yml` | NSO 6.4.4 pipeline (source for site copy block + `site/public/assets/gitlab-ci.yml`) |
| `apply.py` | RESTCONF apply script (workshop step 7) |
| `compliance.py` | NSO compliance reporting (workshop step 8) |
| `pre_check.robot` | Robot Framework pre-checks (workshop step 6) |
| `loopback-template.xml` | Example loopback template XML |
| `loopback-test.py` | pyATS loopback test (reference; CI uses `tests/loopback-test/` on GitLab) |
| `environments.yml` | NSO/lab variable reference (GitLab uses `pipeline_utils/environments.yml`) |

The interactive workshop guide is published at [moore-automation.github.io/DEVWKS-2618](https://moore-automation.github.io/DEVWKS-2618/).
