# Testing Guidelines

## Status

No test runner yet.

## When Add Tests

- `*.test.ts` / `*.test.tsx` colocated or in `__tests__/`
- React Testing Library for components
- Mock `fetch` for provider calls
- Add `"test": "vitest"` (or Jest) to `package.json`

## Scope

| Layer | Guidance |
|-------|----------|
| Providers | Mock `src/lib/providers/` |
| Components | Interactions, a11y, responsive |
| Utilities | Unit test `response-parser.ts`, `string.ts`, `debounce.ts` |
| API Routes | Mock LLM responses, validate errors |
| Game Flow | Integration: home → game → victory/failure |

## Checklist

- [ ] Unit tests — utilities
- [ ] Component tests — UI
- [ ] Integration tests — game flow
- [ ] E2E — critical paths
