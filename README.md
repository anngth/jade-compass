![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/nguyenthanhan/jade-compass-relic-expedition?utm_source=oss&utm_medium=github&utm_campaign=nguyenthanhan%2Fjade-compass-relic-expedition&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
[![Release and Deploy](https://github.com/nguyenthanhan/jade-compass-relic-expedition/workflows/Deploy%20and%20Release/badge.svg)](https://github.com/nguyenthanhan/jade-compass-relic-expedition/actions/workflows/deploy-and-release.yml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black)](https://vercel.com/heimers-projects/jade-compass-relic-expedition)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

# Jade Compass

A retro pixel-art home for Jade Compass adventure games, built with Next.js, React, and TypeScript. It currently links to the playable **Relic Expedition** and the early concept page for **Astral Codex**.

## 🚀 Quick Start

**Prerequisites**: Node.js 18+ (recommended: 20+), pnpm

1. **Clone & Install**:

```bash
git clone https://github.com/nguyenthanhan/jade-compass-relic-expedition.git
cd jade-compass-relic-expedition
pnpm install
```

2. **Configure environment** (optional for local dev, required for production):

```bash
cp .env.example .env.local
# Set SESSION_SECRET — see .env.example for details
```

3. **Run Development Server**:

```bash
pnpm dev
```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Game Routes

- `/` — Jade Compass home
- `/relic-expedition` — playable treasure hunting adventure
- `/astral-codex` — concept page for the planned second game

## 🎯 How to Play

1. **Configure**: Set rounds (2–10), choices per round (2–5), and content language (English/Vietnamese)
2. **Choose Provider**: Select an AI provider and enter your API key
3. **Make Choices**: Each round has multiple choices, but only one leads forward
4. **Find Treasure**: Survive all rounds to claim the Jade Compass

**Controls**: Mouse clicks, number keys (1–5), or Tab/Enter for accessibility

## 🤖 LLM Providers

**Setup**: Get API key → Select provider → Enter key → (Optional) Choose model

Supported providers (direct API and AI SDK variants):

- **OpenAI** — GPT-5, GPT-4o models
- **OpenRouter** — DeepSeek, Qwen, Kimi (free tier)
- **Anthropic** — Claude Opus 4, Sonnet 4, Haiku 4.5
- **Google** — Gemini 3.5 Flash, Gemini 2.5 Pro/Flash
- **Mistral** — Mistral Large, Medium, Small
- **Groq** — Llama, Qwen (via AI SDK)

See [docs/llm-providers.md](./docs/llm-providers.md) for the full list and architecture.

## 🎨 Features

- Retro pixel-art style with custom animations
- Choice-based progression with multiple endings
- Full keyboard navigation and ARIA labels
- Content generation in English or Vietnamese
- Responsive design, Next.js 16 + React 19

## 📝 Scripts

| Category | Commands |
|----------|----------|
| Development | `pnpm dev`, `pnpm build`, `pnpm start` |
| Quality | `pnpm lint`, `pnpm type-check`, `pnpm audit` |
| Analysis | `pnpm analyze` |
| Release | `pnpm release`, `pnpm release:patch/minor/major`, `pnpm changelog` |

## 🔒 Security

- **API Keys**: Stored in browser sessionStorage; synced to an encrypted httpOnly cookie via `/api/session`
- **LLM Requests**: Handled server-side via API routes; keys are never included in request bodies
- **Session**: Requires `SESSION_SECRET` in production (see `.env.example`)
- **Rate Limiting**: Per-session (or per-IP fallback) via middleware
- **Headers**: CSP, X-Frame-Options, and related security headers in `next.config.ts`

See [docs/state-management.md](./docs/state-management.md) for the full API key flow.

## 📚 Documentation

Technical documentation for contributors and agents:

- [docs/README.md](./docs/README.md) — Documentation index
- [docs/architecture.md](./docs/architecture.md) — Project structure, API routes
- [docs/development.md](./docs/development.md) — Environment, CI, commands
- [AGENTS.md](./AGENTS.md) — Agent quick reference

---

**Ready for adventure?** Start your treasure hunt now! 🗺️💎
