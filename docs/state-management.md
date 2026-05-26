# State Management & Security

## Contexts

| Context | File | Hook | Responsibility |
|---------|------|------|----------------|
| Relic game | `games/relic-expedition/context/game-context.tsx` | `useGame()` | Round, choices, story |
| Settings | `contexts/settings-context.tsx` | `useSettings()` | Rounds, choices, provider, model, contentLanguage |

Settings (no API keys) auto-save to `localStorage` (`jadeCompassSettings`), debounced. Context values memoized.

## Hooks

| Hook | File | Description |
|------|------|-------------|
| `useProviderData` | `hooks/use-provider-data.ts` | Lazy-load provider metadata |
| `useSettings` | `contexts/settings-context.tsx` | Settings + test connection |

## API Key Flow

```
User enter API key in UI
        │
        ▼
sessionStorage (api-key-storage.ts)     ← browser-only, gone on tab close
        │
        ▼
syncApiSession() → POST /api/session
        │
        ▼
Encrypted httpOnly cookie (api-session.ts)   ← AES-GCM, 24h TTL
        │
        ▼
Server read key from cookie for LLM calls
```

Key points:

- **sessionStorage** — client keys (`jadeCompassApiKeys` in `api-key-storage.ts`)
- **localStorage** — game settings only; keys stripped before save
- **Request bodies** — never have keys (`withoutApiKeys` in `llm-session.ts`)
- **401** — client auto-retry after re-sync (`fetchWithSessionRetry`)
- Legacy keys in localStorage cleaned via `clearLegacyApiKeysFromLocalStorage()`

## Session

- Create via `POST /api/session`
- Cookie: **httpOnly**, **secure** in prod, **sameSite: lax**
- Payload: AES-GCM encrypt; key from `SESSION_SECRET` via HKDF
- `SESSION_SECRET` **required in prod** (`.env.example`)
- Middleware require session for protected routes
- Logic in `src/lib/session/`

## Security

- **API Keys** — never commit/log. Client: sessionStorage. Server: encrypted httpOnly cookie only
- **Validation** — Zod (`src/lib/schemas/`, `src/games/relic-expedition/lib/schemas/`); server: `validate-llm-request.ts`
- **Rate Limit** — 10 req/min `/api/*` via middleware
- **Headers** — CSP, X-Frame-Options, etc. in `next.config.ts`
- **Error Boundaries** — `components/shared/error-boundary.tsx`

## Performance

- Immutable state updates
- Debounced settings save (300ms)
- Proper deps in useEffect/useMemo
- React.memo, useMemo, useCallback where fit
