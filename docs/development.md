# Development

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

- **Node.js 22+** required (vinext).
- **`SESSION_SECRET`** — required in production; encrypts API keys in the httpOnly cookie. Generate with `openssl rand -base64 32`.
- Provider API keys are entered by the player, not stored in server env vars.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Local production server |
| `pnpm lint` | ESLint |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm audit` | Dependency audit (moderate+) |
| `pnpm release[:patch\|:minor\|:major]` | Release workflow |
| `pnpm changelog` | Changelog extraction |

## Verification

No automated test runner yet. Before merging, run what applies to your change:

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm audit
```

Manually check affected routes and keyboard interaction for UI work. Do not use real LLM calls for routine checks.

When adding tests, prefer Vitest and React Testing Library, starting with session/validation, story schemas, provider mocks, then game flow.

## CI and deploy

**CI** (`ci.yml`): frozen lockfile install, type-check, build. Run lint and audit locally.

**Deploy**: Cloudflare Workers Git integration — push to `main` → production; PRs → preview. Set `SESSION_SECRET` via `wrangler secret put SESSION_SECRET`.

**Release** (`release.yml`): creates a GitHub Release on `v*` tags only; does not deploy.

## Conventions

- TypeScript strict; explicit types at public boundaries.
- Kebab-case files, PascalCase components, `use-` hooks, `@/` imports.
- Tailwind and existing UI primitives over one-off styles.
- Never log API keys. Use toast/error patterns for user-facing failures.
- Update the one doc that owns the behavior you changed.
