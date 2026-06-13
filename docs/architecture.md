# Architecture

Jade Compass uses Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Zod, and pnpm. It deploys to Vercel.

## Runtime Structure

```text
src/
├── app/
│   ├── api/                    # session, story generation, provider test
│   ├── relic-expedition/       # playable game route
│   └── astral-codex/           # concept route
├── components/                 # shared and primitive UI
├── contexts/                   # application settings
├── games/relic-expedition/     # game feature
├── hooks/                      # shared React hooks
├── lib/
│   ├── api/                    # client/server request helpers
│   ├── providers/              # LLM adapters
│   ├── schemas/                # platform validation
│   └── session/                # encrypted API-key cookie
├── proxy.ts                    # API protection
├── types/
└── utils/
```

`src/app/layout.tsx` provides the error boundary and settings context. Relic Expedition adds its game context and selects screens from `gameState.status`.

## API

All API routes use the Edge Runtime.

| Route | Methods | Purpose |
|---|---|---|
| `/api/session` | POST, DELETE | Create or clear the encrypted API-key session |
| `/api/generate-story` | POST | Generate and validate a complete story |
| `/api/test-connection` | POST | Verify the selected provider |

API keys come from the encrypted cookie, never from story or connection request bodies.

## Request Protection

`src/proxy.ts` applies:

- 5 requests/minute per trusted client IP for `/api/session`
- 10 requests/minute per trusted client IP for other API routes
- a 5,000-key in-memory store with oldest-key eviction
- a session-cookie requirement for story generation and connection tests

The store is per process, so limits are not globally consistent across serverless instances. Use a distributed store if strict global enforcement becomes necessary.

`next.config.ts` defines CSP, frame, content-type, referrer, permissions, and development-origin configuration.
