# Testing

There is no automated test runner yet. Until one is added, every change should run the relevant static checks and production build.

## Minimum Verification

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm audit
```

Manually verify affected routes and keyboard interaction for UI changes. Do not use real provider calls in routine tests.

## Test Priorities

When introducing a runner, prefer Vitest and React Testing Library. Add coverage in this order:

1. Session encryption, request validation, and rate limiting.
2. Story schemas, response parsing, and utility functions.
3. Provider adapters with mocked network responses.
4. Game transitions from setup through victory and failure.
5. Critical route-level E2E flows.
