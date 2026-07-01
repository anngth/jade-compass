# Architecture

Jade Compass uses the Next.js 16 App Router API, React 19, TypeScript, Tailwind CSS 4, Zod, and pnpm. It runs on [vinext](https://github.com/cloudflare/vinext) (a Vite-based Next.js reimplementation) and deploys to Cloudflare Workers, configured via `wrangler.jsonc`. Cloudflare's Git integration (Workers Builds) builds and deploys automatically on push; see [Development](./development.md#deployment).

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

Routes run in the Cloudflare Workers runtime (`nodejs_compat` enabled in `wrangler.jsonc`). `src/proxy.ts` runs as Next.js 16 Proxy (Node.js runtime by default). vinext ignores the per-route `runtime` segment config, so any `export const runtime = "edge"` left in route files has no effect under this deployment.

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
