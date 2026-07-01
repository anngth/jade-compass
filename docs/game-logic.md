# Relic Expedition Logic

## States

`IGameState.status` selects the screen in `src/app/relic-expedition/page.tsx`:

| Status | Screen |
| --- | --- |
| `idle` | Setup |
| `playing` | Current round and choices |
| `victory` | All rounds completed |
| `failure` | Incorrect choice |

## Flow

1. Player configures rounds (2–10), choices per round (2–5), language, provider, and model.
2. `startGame()` requests one complete story from `/api/generate-story`.
3. Server validates the response (Zod + round/choice counts).
4. Client stores all rounds and advances locally — no further LLM calls during play.
5. Wrong choice ends the run; surviving all rounds wins.

## Story shape

Each round has:

- **`sceneSummary`** — compact decision prompt (max 180 chars), shown by default
- **`intro`** — richer scene detail, expandable in UI
- **`narrativeState.shortStatus`** — HUD status (max 48 chars); **`status`** is the full condition for summaries

The parser compacts overlong values and syncs top-level `location` with `narrativeState.location`.

Rounds must be fair deduction puzzles: clues in `sceneSummary` and/or `intro`, plausible wrong choices. Choice `title`/`summary` describe intended action only; outcomes go in `consequence`.

Languages: English, Vietnamese. Controls: mouse, number keys 1–5, Tab/Enter.
