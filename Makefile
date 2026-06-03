.PHONY: help docs-dev docs-build docs-lint docs-preview docs-clean

SITE_BASE ?= /DEVWKS-2618/

help:
	@echo "DEVWKS-2618: NSO CI/CD Workshop"
	@echo ""
	@echo "Workshop site (Vite + React):"
	@echo "  make docs-dev      - Dev server (http://localhost:5173)"
	@echo "  make docs-build    - Production build → docs/ (SITE_BASE=$(SITE_BASE))"
	@echo "  make docs-lint     - ESLint for site/"
	@echo "  make docs-preview  - Preview production build"
	@echo "  make docs-clean    - Remove docs/ build output"
	@echo ""
	@echo "Publish: run docs-build, then deploy docs/ to GitHub Pages"
	@echo "Optional: git config core.hooksPath .githooks  (lint+build before push)"
	@echo ""

docs-dev:
	cd site && npm run dev

docs-build:
	cd site && npm ci && SITE_BASE=$(SITE_BASE) npm run build

docs-lint:
	cd site && npm run lint

docs-preview: docs-build
	cd site && npm run preview

docs-clean:
	rm -rf docs/
