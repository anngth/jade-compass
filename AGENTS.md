# Repository Guidelines

## Overview

**Jade Compass** — pixel-art home for Jade Compass adventure games. Relic Expedition is playable; Astral Codex is a concept destination. Next.js + React + TypeScript.

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

- `src/app/page.tsx` — Jade Compass home linking to adventure games
- `src/app/relic-expedition/page.tsx` — Relic Expedition game routing (dynamic imports)
- `src/app/astral-codex/page.tsx` — Astral Codex concept page
- `src/games/relic-expedition/context/game-context.tsx` — Relic game state
- `src/contexts/settings-context.tsx` — settings (`useSettings`)
- `src/lib/providers/` — LLM integration
- `src/lib/session/api-session.ts` — encrypted session cookie
- `src/middleware.ts` — rate limit + session guard
- `src/types/llm.ts` — provider/LLM types
- `src/games/relic-expedition/types/` — Relic game types

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
├── components/       # shared/, ui/
├── contexts/         # settings-context
├── games/            # relic-expedition feature code
├── hooks/            # use-provider-data
├── lib/              # providers/, api/, schemas/, session/
├── middleware.ts
├── types/            # platform/shared types
└── utils/
```

## Agent Guidelines

- **Docs** — code ≠ description → update docs. See [contributing](./docs/contributing.md#documentation-standards)
- **Paths wrong** — search codebase, fix docs
- **Tasks** — see [agent-guide](./docs/agent-guide.md)

---

Treasure hunt game. Keep theme consistent. Adventure engaging.
