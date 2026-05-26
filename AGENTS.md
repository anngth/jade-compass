# Repository Guidelines

## Overview

**Jade Compass: Relic Expedition** — 2D pixel-art treasure hunt. Next.js + React + TypeScript. AI generate adventure story from player choices.

**Repository**: [nguyenthanhan/jade-compass-relic-expedition](https://github.com/nguyenthanhan/jade-compass-relic-expedition)

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Frontend** — React 19, TypeScript 5
- **Styling** — Tailwind CSS 4
- **UI** — shadcn/ui, Radix UI, Lucide Icons
- **Validation** — Zod
- **Package Manager** — pnpm
- **Deployment** — Vercel

## Documentation

Full docs in [`docs/`](./docs/README.md):

| Document                                               | Contents                          |
| ------------------------------------------------------ | --------------------------------- |
| [docs/architecture.md](./docs/architecture.md)         | Structure, API routes, middleware |
| [docs/game-logic.md](./docs/game-logic.md)             | States, flow, story gen           |
| [docs/development.md](./docs/development.md)           | Commands, env, CI                 |
| [docs/ui-ux.md](./docs/ui-ux.md)                       | Design system, CSS vars           |
| [docs/llm-providers.md](./docs/llm-providers.md)       | Providers, add new                |
| [docs/state-management.md](./docs/state-management.md) | Context, API key flow, security   |
| [docs/agent-guide.md](./docs/agent-guide.md)           | Agent quick start, tasks          |
| [docs/contributing.md](./docs/contributing.md)         | Commits, PRs, doc standards       |
| [docs/testing.md](./docs/testing.md)                   | Test guidelines                   |
| [docs/future.md](./docs/future.md)                     | Roadmap, tech debt                |

Index: [docs/README.md](./docs/README.md)

## Quick Reference

### Entry Points

- `src/app/page.tsx` — main page, routing (dynamic imports)
- `src/contexts/game-context.tsx` — game state
- `src/contexts/settings-context.tsx` — settings (`useSettings`)
- `src/lib/providers/` — LLM integration
- `src/lib/session/api-session.ts` — encrypted session cookie
- `src/middleware.ts` — rate limit + session guard
- `src/types/game.ts` — types

### Commands

```bash
pnpm dev          # Dev server http://localhost:3000
pnpm build        # Prod build
pnpm lint         # ESLint
pnpm type-check   # TypeScript
pnpm analyze      # Bundle analysis
```

### Structure (summary)

```
src/
├── app/api/          # generate-story, session, test-connection
├── components/       # home/, pages/, ui/, error-boundary
├── contexts/         # game-context, settings-context
├── hooks/            # use-provider-data
├── lib/              # providers/, api/, schemas/, session/
├── middleware.ts
├── types/
└── utils/
```

## Agent Guidelines

- **Docs** — code ≠ description → update docs. See [contributing](./docs/contributing.md#documentation-standards)
- **Paths wrong** — search codebase, fix docs
- **Tasks** — see [agent-guide](./docs/agent-guide.md)

---

Treasure hunt game. Keep theme consistent. Adventure engaging.
