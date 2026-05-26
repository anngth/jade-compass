# UI/UX Guidelines

## Design System

- **Theme** — retro pixel-art adventure
- **Palette** — earth tones (parchment bg), jade green primary, gold accents
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

Dark mode via `prefers-color-scheme: dark`.

## Button Variants

Use: `default`, `outline`, `secondary`, `destructive`.

## Component Groups

| Group | Directory | Description |
|-------|-----------|-------------|
| Home | `src/components/home/` | Setup, AI config, intro |
| Game | `src/components/pages/game.tsx` | Choices, progress |
| Pages | `src/components/pages/` | Victory, failure, home |
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
