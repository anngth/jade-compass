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
| `pnpm test:e2e` | Run Relic Expedition browser tests against the local production build |
| `pnpm audit` | Dependency audit (moderate+) |
| `pnpm release[:patch\|:minor\|:major]` | Release workflow |
| `pnpm changelog` | Changelog extraction |

## Verification

Before merging, run the checks that apply to your change.

```bash
pnpm lint
pnpm type-check
pnpm build
pnpm audit
```

### Browser tests

Install the Playwright browser once and again after a Playwright upgrade. On Linux CI, use `--with-deps` to install system libraries as well.

```bash
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
```

The suite starts and stops the production server on port 4273. It covers sample play and recovery, AI request retries and navigation, keyboard selection, and the victory screen. AI responses are mocked. No provider credentials are required. CI retains browser traces for failed tests for seven days.

Manually check other affected routes and keyboard interactions for UI work.

When adding tests, prefer Vitest and React Testing Library, starting with session/validation, story schemas, provider mocks, then game flow.

## CI and deploy

CI (`ci.yml`) installs from the frozen lockfile, type-checks, builds and runs the Chromium suite for pull requests and pushes to main or master. Run lint and audit locally.

**Deploy**: Cloudflare Workers Git integration — push to `main` → production; PRs → preview. Set `SESSION_SECRET` via `wrangler secret put SESSION_SECRET`.

**Release** (`release.yml`): creates a GitHub Release on `v*` tags only; does not deploy.

## Conventions

- TypeScript strict; explicit types at public boundaries.
- Kebab-case files, PascalCase components, `use-` hooks, `@/` imports.
- Tailwind and existing UI primitives over one-off styles.
- Never log API keys. Use toast/error patterns for user-facing failures.
- Update the one doc that owns the behavior you changed.
