# Development

## Setup

Use Node.js 20 and pnpm:

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

`SESSION_SECRET` is required in production to encrypt API keys. Generate one with `openssl rand -base64 32`. Provider keys are entered by the player and are not server environment variables.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Development server |
| `pnpm lint` | ESLint |
| `pnpm type-check` | TypeScript validation |
| `pnpm build` | Production build |
| `pnpm audit` | Dependency security audit |
| `pnpm analyze` | Bundle analysis |
| `pnpm release[:patch\|:minor\|:major]` | Release workflow |
| `pnpm changelog` | Generate changelog content |

CI installs with the frozen lockfile, then runs type-check, audit, and build. Run lint locally because CI does not currently include it.

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
