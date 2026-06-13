# Relic Expedition Logic

## States

`IGameState.status` selects the screen in `src/app/relic-expedition/page.tsx`:

| Status | Screen |
|---|---|
| `idle` | Setup/home |
| `playing` | Current round and choices |
| `victory` | Completed all rounds |
| `failure` | Selected an incorrect choice |

## Flow

1. The player selects rounds, choices per round, language, provider, and model.
2. `startGame()` creates a seed and requests one complete story from `/api/generate-story`.
3. The server validates the request, calls the provider, and validates the full response with Zod.
4. The client stores all rounds and advances locally; gameplay makes no additional LLM calls.
5. An incorrect choice ends the game. Completing every round wins.

Configuration limits are 2-10 rounds and 2-5 choices per round. Supported content languages are English and Vietnamese.

Players can use mouse, Tab/Enter, or number keys 1-5.
