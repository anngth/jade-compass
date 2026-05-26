# Game Logic & Flow

## Game States

Four values in `IGameState.status`:

| Status | UI | Component |
|--------|-----|-----------|
| `idle` | Home / config | `games/relic-expedition/components/screens/home.tsx` |
| `playing` | Gameplay | `games/relic-expedition/components/screens/game.tsx` |
| `victory` | Win | `games/relic-expedition/components/screens/victory.tsx` |
| `failure` | Game over | `games/relic-expedition/components/screens/failure.tsx` |

`GameRouter` in `src/app/relic-expedition/page.tsx` routes by `gameState.status`.

## Flow

1. **Setup** — rounds (2–10), choices/round (2–5), lang (English/Vietnamese)
2. **Provider** — pick provider, enter API key, optional model
3. **Start** — full story in one LLM call via `startGame()` in `game-context.tsx`
4. **Play** — choices round-by-round from pre-generated data
5. **End** — win (find Jade Compass) or lose on wrong choice

## Rules

- Multiple options per round, one correct
- Wrong choice → `failure` immediately
- Clear all rounds → `victory`
- Endings vary by player decisions (LLM consequence text)

## Story Generation

Player start game:

1. `createStorySeed()` — reproducibility seed (`story-seed.ts`)
2. `generateStory()` → `POST /api/generate-story` with config + seed
3. LLM return **full story upfront** (intro + all rounds)
4. **Server-side** Zod validate + parse — providers via `validateFullStoryResponse()` (`games/relic-expedition/lib/schemas/full-story.ts` + `games/relic-expedition/utils/response-parser.ts`); API route via `FullStoryResponseSchema.parse()`
5. Client receive validated JSON → store in `allRounds`; `makeChoice()` advance locally — no more LLM calls during play

## Controls

- **Mouse** — click choice buttons
- **Keyboard** — 1–5 quick select (`game.tsx`)
- **A11y** — Tab/Enter nav
