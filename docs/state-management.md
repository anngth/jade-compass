# State and Security

## State

- `src/contexts/settings-context.tsx` stores rounds, choices, language, provider, and model through `useSettings()`.
- `src/games/relic-expedition/context/game-context.tsx` stores the active story, round, choices, and outcome through `useGame()`.
- Non-secret settings are debounced into `localStorage`.
- API keys are held separately in `sessionStorage` and disappear when the tab closes.

## API-Key Session

```text
UI API key
→ sessionStorage
→ POST /api/session
→ encrypted httpOnly cookie
→ server-side provider call
```

Security invariants:

- Story and connection request bodies never contain API keys.
- The cookie is httpOnly, `sameSite=lax`, secure in production, and expires after 24 hours.
- AES-GCM protects the payload; `SESSION_SECRET` is required in production.
- A 401 response triggers one client session re-sync and retry.
- Legacy keys are removed from `localStorage`.

Session implementation lives in `src/lib/session/`; client synchronization lives in `src/lib/api/llm-session.ts`.

## Other Controls

- Zod validates API and LLM data.
- `src/proxy.ts` applies IP-based rate limits and protects LLM endpoints.
- `next.config.ts` defines browser security headers.
- API keys must never be committed or logged.

See [Architecture](./architecture.md#request-protection) for exact rate-limit values.
