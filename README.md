[![Release](https://github.com/anngth/jade-compass/workflows/Release/badge.svg)](https://github.com/anngth/jade-compass/actions/workflows/release.yml)
[![Deploy on Cloudflare Workers](https://img.shields.io/badge/Deploy%20on-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

# Jade Compass

Retro pixel-art hub for Jade Compass adventure games. **Relic Expedition** is playable; **Astral Codex** is a concept route.

Built with React 19, TypeScript, and the Next.js App Router API via [vinext](https://github.com/cloudflare/vinext), deployed to Cloudflare Workers.

## Quick start

**Requires:** Node.js 22+, pnpm

```bash
git clone https://github.com/anngth/jade-compass.git
cd jade-compass
pnpm install
cp .env.example .env.local   # optional locally
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For production, set `SESSION_SECRET` in `.env.local` or as a Worker secret (`openssl rand -base64 32`).

## Routes

| Path                | Description                   |
| ------------------- | ----------------------------- |
| `/`                 | Home                          |
| `/relic-expedition` | Treasure-hunting adventure    |
| `/astral-codex`     | Planned second game (concept) |

## Scripts

| Command           | Purpose                 |
| ----------------- | ----------------------- |
| `pnpm dev`        | Development server      |
| `pnpm build`      | Production build        |
| `pnpm start`      | Local production server |
| `pnpm lint`       | ESLint                  |
| `pnpm type-check` | TypeScript check        |
| `pnpm audit`      | Dependency audit        |

## Documentation

Technical docs live in [`docs/`](./docs/README.md): architecture, development, game logic, LLM providers, security, and UI guidelines.

Agent-oriented repo notes: [`AGENTS.md`](./AGENTS.md).

## License

MIT
