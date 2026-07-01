# State & Security

## Client state

| Context | Stores |
| --- | --- |
| `settings-context.tsx` | Rounds, choices, language, provider, model |
| `game-context.tsx` | Active story, round, choice history, outcome |

Settings (non-secret) debounce to `localStorage`. API keys live in `sessionStorage` and clear when the tab closes.

## API-key session

```text
UI key → sessionStorage → POST /api/session → encrypted httpOnly cookie → server provider call
```

- Keys never appear in story or connection request bodies.
- Cookie: httpOnly, `sameSite=lax`, secure in production, 24h expiry.
- Payload: AES-GCM; requires `SESSION_SECRET` in production.
- 401 triggers one client re-sync and retry.
- Legacy keys removed from `localStorage`.

Implementation: `src/lib/session/`, client sync in `src/lib/api/llm-session.ts`.

## Other controls

- Zod validation on API and LLM payloads.
- Rate limits and session guard in `src/proxy.ts` (see [Architecture](./architecture.md#request-protection)).
- Security headers in `next.config.ts`.
- Never commit or log API keys.
