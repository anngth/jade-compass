# UI/UX Guidelines

## Design System

- **Theme** — route-specific retro adventure themes
- **Palette** — Relic Expedition keeps earth tones (parchment bg), jade green primary, gold accents; `/` uses a midnight teal/orange home theme; `/astral-codex` uses a cosmic violet/cyan theme
- **Typography** — Orbitron (headings, `.font-pixel`) + Space Mono (body, `.font-retro`)
- **Animations** — CSS transitions, bounce loading dots, pixel-border
- **Rendering** — `image-rendering: pixelated` for crisp pixels

## CSS Variables

`src/app/globals.css`:

| Variable | Purpose |
|----------|---------|
| `--background`, `--foreground` | Page bg + text |
| `--card`, `--card-foreground` | Card surfaces |
| `--primary`, `--primary-foreground` | Jade green — buttons, accents |
| `--secondary`, `--accent` | Muted gold |
| `--destructive` | Danger/error |
| `--muted`, `--muted-foreground` | Subdued text/bg |
| `--border`, `--input`, `--ring` | Borders, focus rings |

Relic Expedition uses the root variables and dark mode via `prefers-color-scheme: dark`. Route-specific themes use scoped classes in `globals.css`: `.theme-jade-home` and `.theme-astral-codex`.

## Button Variants

Use: `default`, `outline`, `secondary`, `destructive`.

## Component Groups

| Group | Directory | Description |
|-------|-----------|-------------|
| Relic setup | `src/games/relic-expedition/components/setup/` | Setup, AI config, intro |
| Relic game | `src/games/relic-expedition/components/screens/game.tsx` | Choices, progress |
| Relic screens | `src/games/relic-expedition/components/screens/` | Victory, failure, home |
| UI | `src/components/ui/` | button, card, input, select |

### Home Components

| File | Purpose |
|------|---------|
| `game-header.tsx` | Page header |
| `introduction-card.tsx` | Intro + controls help |
| `new-adventure-card.tsx` | Round/choice/lang config |
| `ai-configuration-card.tsx` | Provider + API key |
| `model-selector.tsx` | Model dropdown |
| `constants.ts` | Home constants |
| `index.ts` | Barrel exports |

## Overlays & Feedback

- **Loading overlay** — fullscreen pixel spinner during story gen (`game-context.tsx`)
- **Toasts** — Sonner for errors/connection (`layout.tsx` themed)
- **Error boundary** — `error-boundary.tsx` catch render errors

## Accessibility

- Full keyboard nav
- Keys 1–5 quick choice select
- ARIA labels
- Focus indicators
- Mobile responsive
