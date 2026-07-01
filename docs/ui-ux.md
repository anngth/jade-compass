# UI/UX

## Themes

| Route | Palette |
| --- | --- |
| `/` | Midnight teal and orange |
| `/relic-expedition` | Parchment, jade green, gold |
| `/astral-codex` | Violet and cyan |

Orbitron (display) · Space Mono (body) · crisp pixel assets · restrained CSS animation.

Tokens and route themes: `src/app/globals.css`. Reuse `src/components/ui/` primitives.

## Component paths

| Area | Path |
| --- | --- |
| Primitives | `src/components/ui/` |
| Shared | `src/components/shared/` |
| Relic setup | `src/games/relic-expedition/components/setup/` |
| Relic screens | `src/games/relic-expedition/components/screens/` |

## Interaction

- Keyboard navigation and visible focus states.
- Number-key shortcuts for choices where applicable.
- ARIA labels on unlabeled controls.
- Mobile-friendly layout and contrast.
- Sonner toasts; shared error boundary for render failures.

## Relic Expedition game screen

Primary path: current scene → choices. HUD shows round, location, status, items, progress using `sceneSummary` and `shortStatus`. Previous consequences and scene details collapsed by default. Choice cards are keyboard-reachable (Tab/Enter/Space) in addition to number keys.
