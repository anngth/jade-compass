# Repository Guidelines

## Project Structure & Module Organization

Jade Compass is a React 19 and TypeScript app using the Next.js App Router API through vinext, deployed to Cloudflare Workers. Routes live in `src/app`, including `/`, `/relic-expedition`, `/astral-codex`, and API routes under `src/app/api`. Shared UI is in `src/components/ui`, libraries in `src/lib`, hooks and contexts in `src/hooks` and `src/contexts`, and Relic Expedition code in `src/games/relic-expedition`. Static assets live in `public`; technical docs live in `docs`.

## Build, Test, and Development Commands

Use Node.js 22+ and pnpm.

- `pnpm dev` starts the local vinext development server.
- `pnpm lint` runs ESLint across the repository.
- `pnpm type-check` runs `tsc --noEmit`.
- `pnpm build` creates a production build.
- `pnpm start` runs the local production server.
- `pnpm audit` checks dependencies at moderate severity or higher.

## Coding Style & Naming Conventions

Use TypeScript strict mode and keep public boundaries explicitly typed. Prefer the `@/` alias for imports from `src`. Follow existing naming: kebab-case filenames such as `new-adventure-card.tsx`, PascalCase React components, and `use-` prefixed hooks. Use Tailwind classes and existing UI primitives before adding custom patterns. ESLint uses Next core-web-vitals and TypeScript rules; avoid `any` unless the context justifies it.

## Testing Guidelines

See [`docs/development.md#verification`](./docs/development.md#verification). No automated test runner yet — run lint, type-check, build, and audit as relevant; manually verify UI routes and keyboard behavior.

## Commit & Pull Request Guidelines

Git history follows Conventional Commit-style prefixes, for example `fix: harden and migrate API proxy`, `docs: consolidate repository documentation`, and `chore: update package.json`. Keep commits focused and imperative. Pull requests should include a problem/solution summary, verification commands, linked issues when applicable, and screenshots for visible UI changes.

## Security & Configuration Tips

Copy `.env.example` to `.env.local` for local configuration. `SESSION_SECRET` is required in production and should be generated with `openssl rand -base64 32`. Never log API keys or include them in request bodies; use the existing session and API route flow.

Documentation index: [`docs/README.md`](./docs/README.md).
