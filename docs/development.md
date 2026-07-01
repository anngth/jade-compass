# Development

## Setup

Use Node.js 22+ (required by vinext) and pnpm:

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

`SESSION_SECRET` is required in production to encrypt API keys. Generate one with `openssl rand -base64 32`. Provider keys are entered by the player and are not server environment variables.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Development server (`vinext dev`) |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript validation |
| `pnpm build` | Production build (`vinext build`) |
| `pnpm start` | Local production server (`vinext start`) |
| `pnpm audit` | Dependency security audit |
| `pnpm release[:patch\|:minor\|:major]` | Release workflow |
| `pnpm changelog` | Generate changelog content |

CI (`ci.yml`) installs with the frozen lockfile, then runs type-check and build. Run lint and audit locally because CI does not currently include them.

## Deployment

Cloudflare Workers builds and deploys via its native Git integration (Workers Builds), not GitHub Actions: pushes to `main` deploy to production, pull requests get a preview deployment. Configure and inspect this in the Cloudflare dashboard for the `jade-compass` Worker.

`SESSION_SECRET` must be set on the Worker with `wrangler secret put SESSION_SECRET` — it is not managed by Git integration or CI.

`release.yml` (GitHub Actions) only creates a GitHub Release with changelog content when a `v*` tag is pushed; it does not deploy anything.

## Conventions

- TypeScript strict mode; use explicit types at public boundaries.
- Kebab-case filenames, PascalCase components, and `use-` prefixed hooks.
- Use the `@/` alias for `src/`.
- Prefer Tailwind classes and existing UI primitives.
- Never log API keys.
- Return meaningful errors and show user-facing failures through existing toast/error patterns.

## Change Checklist

Before merging:

1. Run the relevant lint, type-check, build, audit, and tests.
2. Include screenshots for visible UI changes.
3. Update documentation only when its described behavior changes.
4. Keep commits and pull requests focused.

Update the primary document for the changed area instead of copying the same information into multiple files.
