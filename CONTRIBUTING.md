# Contributing to They Will Not Be Forgotten

Thank you for contributing to this project. Please read these guidelines before opening a PR.

## Team

| Role | Name | Responsibility |
|---|---|---|
| Senior Developer | Maram | Architecture, DevOps, code review |
| Junior Developer (Frontend) | Angham | React UI, map, victim pages |
| Junior Developer (Backend) | Marah | API, database, admin panel |

## Workflow

1. Pick up or create a GitHub Issue
2. Branch from `develop`: `git checkout -b feature/your-feature-name develop`
3. Make your changes with small, focused commits
4. Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`
5. Push and open a PR against `develop`
6. Request review from a teammate
7. Address all feedback before merge

## Branch naming

| Pattern | Use |
|---|---|
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `chore/*` | Maintenance |

## Code standards

- TypeScript everywhere — no plain `.js` files
- Prettier + ESLint enforced in CI
- All display strings in `src/i18n/` — no hardcoded UI text
- Never commit `.env` files
- PRs should be under 300 lines changed

## Commit message format

```
feat: add countdown timer to victim profile
fix: map markers not rendering on Safari
chore: update dependencies
docs: update API reference
```
