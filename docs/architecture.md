# Architecture

## Overview

**Jade Compass** — pixel-art home for Jade Compass adventure games. Next.js + React + TypeScript. Relic Expedition is playable; Astral Codex is a concept destination.

**Repository**: [nguyenthanhan/jade-compass-relic-expedition](https://github.com/nguyenthanhan/jade-compass-relic-expedition)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui, Radix UI |
| Icons | Lucide React |
| Validation | Zod |
| Toast | Sonner |
| Package Manager | pnpm |
| Deployment | Vercel |

## Provider Hierarchy

```
RootLayout (layout.tsx)
  └── ErrorBoundary
        └── SettingsProvider          # settings, API keys, session sync
              ├── page.tsx                         # Jade Compass home
              ├── astral-codex/page.tsx            # concept page
              └── relic-expedition/page.tsx
                    └── GameProvider               # game state, story, choices
                          └── GameRouter (dynamic imports)
                                ├── HomePage       (status: idle)
                                ├── GamePage       (status: playing)
                                ├── VictoryPage    (status: victory)
                                └── FailurePage    (status: failure)
```

Relic Expedition pages lazy-load via `next/dynamic` in `src/app/relic-expedition/page.tsx`.

## Project Structure

```
src/
├── app/                         # Next.js App Router
│   ├── api/
│   │   ├── generate-story/      # POST — generate story (edge)
│   │   ├── session/             # POST/DELETE — session mgmt (edge)
│   │   └── test-connection/     # POST — test provider (edge)
│   ├── globals.css
│   ├── layout.tsx
│   ├── astral-codex/
│   │   └── page.tsx              # Concept page for planned second game
│   ├── relic-expedition/
│   │   └── page.tsx              # Playable game route
│   └── page.tsx
├── components/
│   ├── shared/                  # Cross-game components
│   └── ui/                      # button, card, input, select
├── contexts/
│   └── settings-context.tsx     # Settings, provider, model, API key sync
├── games/
│   └── relic-expedition/
│       ├── components/
│       │   ├── setup/           # Relic setup/config screen
│       │   └── screens/         # Relic home, game, victory, failure
│       ├── context/             # Relic game state
│       ├── lib/                 # Relic story API, seed, schemas
│       ├── types/
│       └── utils/
├── hooks/
│   └── use-provider-data.ts     # Lazy-load provider metadata
├── lib/
│   ├── api/
│   │   ├── llm-session.ts       # Session sync + provider test calls
│   │   ├── llm-api.ts           # Compatibility re-exports
│   │   └── validate-llm-request.ts  # Server request validation
│   ├── providers/               # LLM adapter layer
│   ├── schemas/                 # Platform Zod schemas
│   ├── session/                 # Encrypted session cookie
│   ├── api-key-storage.ts       # sessionStorage for API keys
│   └── logger.ts
├── middleware.ts                # Rate limit + session guard
├── types/
│   ├── llm.ts
│   ├── settings.ts
│   └── game.ts                  # Compatibility type re-exports
└── utils/
    ├── debounce.ts
    └── string.ts
```

## API Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/session` | POST, DELETE | Create/delete encrypted session cookie |
| `/api/generate-story` | POST | Generate story via LLM (key from cookie) |
| `/api/test-connection` | POST | Test provider (key from cookie) |

All routes: **Edge Runtime**. Keys **never** in request bodies — see [State Management & Security](./state-management.md#api-key-flow).

## Middleware

`src/middleware.ts`:

- **Rate limit** all `/api/*` — 10 req/min per session or IP
- **Session guard** — `/api/generate-story`, `/api/test-connection` need valid session cookie

> In-memory rate limit store. Serverless multi-instance → effective limit = `MAX_REQUESTS × instance count`.

## Security Headers

`next.config.ts`:

- Content-Security-Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy, Permissions-Policy

## Entry Points

| File | Role |
|------|------|
| `src/app/page.tsx` | Jade Compass home linking to adventure games |
| `src/app/relic-expedition/page.tsx` | Relic Expedition route by game state |
| `src/app/astral-codex/page.tsx` | Concept destination for the planned second game |
| `src/games/relic-expedition/context/game-context.tsx` | Relic Expedition game state |
| `src/contexts/settings-context.tsx` | Player settings (`useSettings`) |
| `src/lib/providers/` | LLM integration |
| `src/lib/session/api-session.ts` | Encrypted session cookie |
| `src/types/llm.ts` | Provider and LLM type definitions |
| `src/games/relic-expedition/types/` | Relic game type definitions |
