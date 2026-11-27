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

1. For a generated story, the player configures rounds (2–10), choices per round (2–5), language, provider, and model. Start Adventure locks both start buttons while one request to `/api/generate-story` is pending. The server validates the response and checks its round and choice counts.
2. Play Sample starts a local story in the selected content language. Each version has two rounds and two choices per round.
3. Both modes advance through the loaded story locally. A wrong choice ends the run. Choosing correctly through the last round wins, and the victory screen shows that choice's consequence and final inventory.
4. The game saves a versioned story and choice indexes in `sessionStorage`. A same-tab reload restores the round, history, and result. An invalid save returns to setup. If storage is unavailable, the current run stays playable in memory.
5. After a loss, Replay Story restarts the same story with an empty choice history. New Adventure clears the saved run and opens setup.

## Story shape

Each round has:

- **`sceneSummary`** — compact decision prompt (max 180 chars), shown by default
- **`intro`** — richer scene detail, expandable in UI
- **`narrativeState.shortStatus`** — HUD status (max 48 chars); **`status`** is the full condition for summaries

The parser compacts overlong values and syncs top-level `location` with `narrativeState.location`.

Rounds must be fair deduction puzzles: clues in `sceneSummary` and/or `intro`, plausible wrong choices. Choice `title`/`summary` describe intended action only; outcomes go in `consequence`.

Languages: English, Vietnamese. Select with a pointer, the number row or numeric keypad, or Tab followed by Enter or Space. Held keys and modified shortcuts do not advance the story.
