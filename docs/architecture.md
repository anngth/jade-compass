# Architecture

## Overview

**Jade Compass: Relic Expedition** — 2D pixel-art treasure hunt. Next.js + React + TypeScript. AI generate adventure story from player choices.

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
              └── page.tsx
                    └── GameProvider  # game state, story, choices
                          └── GameRouter (dynamic imports)
                                ├── HomePage    (status: idle)
                                ├── GamePage    (status: playing)
                                ├── VictoryPage (status: victory)
                                └── FailurePage (status: failure)
```

Pages lazy-load via `next/dynamic` in `src/app/page.tsx`.

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
│   └── page.tsx
├── components/
│   ├── error-boundary.tsx
│   ├── home/                    # Game config screen
│   ├── pages/                   # home, game, victory, failure
│   └── ui/                      # button, card, input, select
├── contexts/
│   ├── game-context.tsx         # Game state
│   └── settings-context.tsx     # Settings (rounds, provider, model, lang)
├── hooks/
│   └── use-provider-data.ts     # Lazy-load provider metadata
├── lib/
│   ├── api/
│   │   ├── llm-api.ts           # Client API calls
│   │   └── validate-llm-request.ts  # Server request validation
│   ├── providers/               # LLM adapter layer
│   ├── schemas/                 # Zod schemas (settings, full-story)
│   ├── session/                 # Encrypted session cookie
│   ├── api-key-storage.ts       # sessionStorage for API keys
│   ├── logger.ts
│   └── story-seed.ts
├── middleware.ts                # Rate limit + session guard
├── types/
│   └── game.ts
└── utils/
    ├── debounce.ts
    ├── response-parser.ts
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
| `src/app/page.tsx` | Main page, route by game state |
| `src/contexts/game-context.tsx` | Game state |
| `src/contexts/settings-context.tsx` | Player settings (`useSettings`) |
| `src/lib/providers/` | LLM integration |
| `src/lib/session/api-session.ts` | Encrypted session cookie |
| `src/types/game.ts` | Type definitions |
