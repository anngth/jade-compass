# Agent Instructions

Jade Compass is a Next.js 16, React 19, TypeScript adventure-game hub. Relic Expedition is playable; Astral Codex is currently a concept route.

## Working Rules

- Use `pnpm` and follow existing TypeScript, Tailwind, and component patterns.
- Keep changes scoped. Do not refactor unrelated code.
- Never log, persist, or send API keys in request bodies.
- Preserve the retro adventure theme, keyboard access, and responsive behavior.
- Search the repository before assuming a path or API is current.
- Update the relevant document when behavior, structure, configuration, or security changes.

## Key Paths

- `src/app/` - routes and API handlers
- `src/games/relic-expedition/` - game UI, state, schemas, and story flow
- `src/lib/providers/` - direct and AI SDK LLM adapters
- `src/lib/session/` - encrypted API-key session
- `src/contexts/settings-context.tsx` - player settings
- `src/proxy.ts` - API rate limits and session guard
- `next.config.ts` - Next.js and security-header configuration

## Verification

Run the checks relevant to the change:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm audit
```

Documentation index: [`docs/README.md`](./docs/README.md).
