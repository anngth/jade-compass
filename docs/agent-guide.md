# Agent Guide

Quick ref for AI agents on this repo.

## Essential Files

| File | Role |
|------|------|
| `src/app/page.tsx` | Main page, routing (dynamic imports) |
| `src/contexts/game-context.tsx` | Game state, story gen |
| `src/contexts/settings-context.tsx` | Settings, API key sync (`useSettings`) |
| `src/lib/providers/` | LLM integration |
| `src/lib/session/api-session.ts` | Encrypted session cookie |
| `src/types/game.ts` | Types |
| `src/middleware.ts` | Rate limit + session guard |
| `src/lib/api/llm-api.ts` | Client API calls |

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
5. Update UI (`src/components/home/`)
6. Update `docs/llm-providers.md`

### Modify Game Logic

1. Types → `src/types/game.ts`
2. Context → `src/contexts/game-context.tsx`
3. UI → `src/components/pages/`
4. Test end-to-end
5. Update `docs/game-logic.md` if flow change

### Update UI

| Type | Directory |
|------|-----------|
| Home | `src/components/home/` |
| Game | `src/components/pages/` |
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
