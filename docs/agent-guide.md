# Agent Guide

Quick ref for AI agents on this repo.

## Essential Files

| File | Role |
|------|------|
| `src/app/page.tsx` | Gateway to Jade Compass games |
| `src/app/relic-expedition/page.tsx` | Relic Expedition routing (dynamic imports) |
| `src/app/astral-codex/page.tsx` | Astral Codex concept page |
| `src/games/relic-expedition/context/game-context.tsx` | Relic game state, story gen |
| `src/contexts/settings-context.tsx` | Settings, API key sync (`useSettings`) |
| `src/lib/providers/` | LLM integration |
| `src/lib/session/api-session.ts` | Encrypted session cookie |
| `src/types/llm.ts` | Provider/LLM types |
| `src/games/relic-expedition/types/` | Relic game types |
| `src/middleware.ts` | Rate limit + session guard |
| `src/lib/api/llm-session.ts` | Session + provider test calls |
| `src/games/relic-expedition/lib/api/generate-story.ts` | Relic story client call |

## Commands

```bash
pnpm dev              # Dev server
pnpm build            # Prod build
pnpm lint             # ESLint
pnpm type-check       # TypeScript
pnpm analyze          # Bundle analysis
```

## Common Tasks

### Add AI Provider

1. Class in `src/lib/providers/`
2. Implement base interface
3. Metadata in `provider-data.ts`
4. Register in `provider-factory.ts`
5. Update UI (`src/games/relic-expedition/components/setup/`)
6. Update `docs/llm-providers.md`

### Modify Game Logic

1. Types → `src/games/relic-expedition/types/`
2. Context → `src/games/relic-expedition/context/game-context.tsx`
3. UI → `src/games/relic-expedition/components/screens/`
4. Test end-to-end
5. Update `docs/game-logic.md` if flow change

### Update UI

| Type | Directory |
|------|-----------|
| Relic setup | `src/games/relic-expedition/components/setup/` |
| Relic screens | `src/games/relic-expedition/components/screens/` |
| Reusable | `src/components/ui/` |

### Add Feature

1. Define types
2. Update context if global state needed
3. Create/update components
4. Add routing if needed
5. **Update docs** — [Contributing](./contributing.md#documentation-standards)

## Guidelines

- **Path wrong** → search codebase, fix docs
- **Doc/code mismatch** → fix same task/PR — [Contributing](./contributing.md#documentation-standards)
- **Unsure** → search first, don't assume

## Decision Framework

### AI Providers

- Use AI when user has valid API key
- Pick provider by user keys + preference
- Graceful fail, clear errors

### Component Architecture

| Pattern | Use when |
|---------|----------|
| Context | Global game state, settings |
| Props | Component-specific data |
| Local State | UI-only |
| Custom Hooks | Reusable logic (`hooks/`, `contexts/`) |

## Troubleshooting

Build issues → [Development — Troubleshooting Build](./development.md#troubleshooting-build)

### API Key / Session

- Check **sessionStorage** (`jadeCompassApiKeys`) in DevTools
- Verify `SESSION_SECRET` in prod
- Test `/api/test-connection`
- 401 auto-retry — [API Key Flow](./state-management.md#api-key-flow)

### Performance

- `pnpm analyze` — bundle size
- React DevTools Profiler — re-renders
- Review memoization

## Checklist

### Before

- [ ] Read relevant `docs/`
- [ ] Know current arch
- [ ] Check existing impl

### After

- [ ] TypeScript strict
- [ ] ESLint pass
- [ ] Error handling + a11y
- [ ] **Update docs if code ≠ description**
