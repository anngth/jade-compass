# Development

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server `http://localhost:3000` |
| `pnpm build` | Production build |
| `pnpm start` | Run prod build |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript (`tsc --noEmit`) |
| `pnpm audit` | Security audit deps |
| `pnpm analyze` | Bundle analysis (`ANALYZE=true pnpm build`) |
| `pnpm release` | Release + auto versioning |
| `pnpm release:patch` | Patch release |
| `pnpm release:minor` | Minor release |
| `pnpm release:major` | Major release |
| `pnpm changelog` | Extract changelog from commits |

> npm works too (`npm run dev`). Repo use **pnpm**.

**Node.js** — 18+ works; **20 recommended** (CI use Node 20).

## Environment

Copy `.env.example` → `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `SESSION_SECRET` | Prod only | Encrypt API keys in httpOnly cookie. Gen: `openssl rand -base64 32` |

Dev: fallback secret when `SESSION_SECRET` unset. **Prod deploy without it = bad.**

API keys from UI — not server env vars. See [API Key Flow](./state-management.md#api-key-flow).

## CI

`.github/workflows/ci.yml` on push/PR to `main`/`master`:

1. `pnpm install --frozen-lockfile`
2. `pnpm type-check`
3. `pnpm audit --audit-level=moderate`
4. `pnpm build`

CI **no run lint** — run `pnpm lint` locally before PR.

## Coding Style

- **TypeScript** — strict; explicit types for public APIs
- **Indent** — 2 spaces
- **Files** — kebab-case (`game-context.tsx`, `use-provider-data.ts`)
- **Components** — PascalCase in kebab files; default export for single component
- **Hooks** — `use-` prefix, typed return
- **Imports** — `@/` alias for `src/`
- **Styling** — Tailwind; no inline styles
- **Icons** — `lucide-react`

## Debug

`pnpm dev` auto-enable logs (`NODE_ENV=development`).

Prod browser debug toggles (`logger.ts`):

- URL query `?debug_logs=1`
- `localStorage.setItem("DEBUG_LOGS", "1")`
- `window.__DEBUG_LOGS__ = true`

Also: browser console + React DevTools Profiler.

## Troubleshooting Build

```bash
rm -rf node_modules .next
pnpm install
pnpm build
```

### TypeScript Errors

```bash
pnpm type-check
```

Fix: update types, add interfaces, fix imports/exports.
