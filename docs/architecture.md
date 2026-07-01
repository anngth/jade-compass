# Architecture

React 19 · TypeScript · Next.js 16 App Router API · Tailwind CSS 4 · Zod · pnpm · [vinext](https://github.com/cloudflare/vinext) · Cloudflare Workers (`wrangler.jsonc`).

## Layout

```text
src/
├── app/                    # routes and API handlers
│   ├── api/                # session, generate-story, test-connection
│   ├── relic-expedition/
│   └── astral-codex/
├── components/ui/          # shared primitives
├── contexts/               # settings
├── games/relic-expedition/ # game UI, state, schemas
├── lib/
│   ├── api/                # client/server helpers
│   ├── providers/          # LLM adapters
│   ├── session/            # encrypted API-key cookie
│   └── schemas/
├── proxy.ts                # API rate limits and session guard
└── types/
```

`src/app/layout.tsx` wraps the app with settings context and an error boundary. Relic Expedition adds `GameProvider` and switches screens from `gameState.status`.

## API routes

| Route | Methods | Purpose |
| --- | --- | --- |
| `/api/session` | POST, DELETE | Create or clear encrypted API-key session |
| `/api/generate-story` | POST | Generate and validate a full story |
| `/api/test-connection` | POST | Verify provider connectivity |

API keys come from the encrypted cookie, never from request bodies. Routes run on Cloudflare Workers (`nodejs_compat`). Per-route `export const runtime = "edge"` has no effect under vinext.

## Request protection

`src/proxy.ts`:

- 5 req/min per IP on `/api/session`
- 10 req/min per IP on other API routes
- In-memory store (5,000 keys, oldest evicted first) — per instance, not global
- Session cookie required for story generation and connection tests

Security headers (CSP, frame options, etc.) are in `next.config.ts`.
