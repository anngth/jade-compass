# UI/UX

## Visual System

- `/` uses midnight teal and orange.
- `/relic-expedition` uses parchment, jade green, and gold.
- `/astral-codex` uses violet and cyan.
- Orbitron is used for display text and Space Mono for body text.
- Pixel assets use crisp rendering and restrained CSS animation.

Theme tokens and scoped route themes live in `src/app/globals.css`. Reuse existing variables and primitives from `src/components/ui/` instead of introducing one-off styling.

## Component Ownership

| Area | Path |
|---|---|
| Shared primitives | `src/components/ui/` |
| Cross-game components | `src/components/shared/` |
| Relic setup | `src/games/relic-expedition/components/setup/` |
| Relic screens | `src/games/relic-expedition/components/screens/` |

## Interaction Requirements

- Preserve keyboard navigation and visible focus states.
- Keep number-key choice shortcuts where applicable.
- Add ARIA labels to controls without visible labels.
- Maintain mobile layouts and readable contrast.
- Use Sonner for transient feedback and the shared error boundary for render failures.
