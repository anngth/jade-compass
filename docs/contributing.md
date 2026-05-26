# Contributing

## Commits

- Imperative, concise subjects (`feat: add victory screen`, `refactor: simplify model lists`)
- Optional [Conventional Commits](https://www.conventionalcommits.org/) for changelog
- Small scope; no big multi-feature PRs

## Pull Requests

- Clear description, link issues
- Screenshots for UI changes
- Test notes
- CI pass before merge (type-check, audit, build)
- Run `pnpm lint` locally — not in CI yet
- **Update docs** when behavior change

## Documentation Standards

> Code change make docs wrong → update docs same PR/commit.

### When Update Docs

- Add/remove/rename files, dirs, modules
- Add API routes, providers, middleware rules
- Change game flow, state, security model
- Add npm/pnpm scripts or env vars
- Upgrade major deps (Next.js, React, AI SDK)
- Change model lists or provider config

### Which Files

| Change | Docs |
|--------|------|
| Directory structure | `docs/architecture.md`, `AGENTS.md` |
| Game logic | `docs/game-logic.md` |
| New provider | `docs/llm-providers.md` |
| Scripts / env vars | `docs/development.md`, `.env.example`, `README.md` |
| UI/UX | `docs/ui-ux.md` |
| State/security | `docs/state-management.md` |

Also: **README.md**, **CHANGELOG.md**, **JSDoc** for complex/public APIs.

## Performance

- Minimal deps, tree-shake
- Code split routes (dynamic imports in `page.tsx`)
- Next.js Image for static assets
- Bundle size: `pnpm analyze`

## Error Handling

- Extract meaningful errors from Error objects
- Graceful fallback when LLM down
- Log for debug (never log API keys)
- Toast for user-facing errors
