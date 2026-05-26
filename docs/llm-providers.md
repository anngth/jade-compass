# LLM Provider Development

## Architecture

- **Base Provider** (`base.ts`) — LLM provider contract
- **Provider Factory** (`provider-factory.ts`) — create/manage instances
- **Provider Data** (`provider-data.ts`) — metadata, models, API base URLs
- **Individual Providers** — per AI service impl

```
src/lib/providers/
├── base.ts
├── provider-factory.ts
├── provider-data.ts
├── openai.ts          # OpenAI + OpenRouter (shared, diff API base)
├── anthropic.ts
├── google.ts
├── mistral.ts
└── vercel.ts          # All AI SDK providers
```

> OpenRouter **no separate file** — reuse `openai.ts`, diff API base.

## Registered Providers

### Direct API

| ID | File | Models (examples) |
|----|------|-------------------|
| `openai` | `openai.ts` | gpt-5, gpt-5-mini, gpt-4o, gpt-4o-mini |
| `openrouter` | `openai.ts` | deepseek, qwen, moonshotai (free tier) |
| `anthropic` | `anthropic.ts` | claude-opus-4, claude-sonnet-4, claude-haiku-4-5 |
| `google` | `google.ts` | gemini-3.5-flash, gemini-2.5-pro, gemini-2.5-flash |
| `mistral` | `mistral.ts` | mistral-large, mistral-medium, ministral-8b |

### AI SDK (via `vercel.ts`)

| ID | Backend |
|----|---------|
| `openai-ai-sdk` | OpenAI |
| `anthropic-ai-sdk` | Anthropic |
| `google-ai-sdk` | Google Gemini |
| `groq-ai-sdk` | Groq |
| `mistral-ai-sdk` | Mistral |
| `openrouter-ai-sdk` | OpenRouter |

Models in `provider-data.ts`. Custom model via `__custom__`.

## Best Practices

- **Adapter Pattern** — same interface all providers
- **Error Handling** — clear msgs, graceful recovery
- **Type Safety** — strict response/error types
- **Format Templates** — JSON templates (`plusFormat: true`) for parse consistency
- **Testing** — mock network; no real API in dev
- **CORS** — proper cross-origin config
- **`testConnection()`** — meaningful error msgs

## Add New Provider

1. Create class in `src/lib/providers/`
2. Implement base interface
3. Add metadata + models to `provider-data.ts`
4. Register in `provider-factory.ts`
5. Update UI (`src/games/relic-expedition/components/setup/`)
6. Test sample requests
7. **Update docs** if arch change

## Integration Layers

### Client (`src/lib/api/llm-session.ts`, `src/games/relic-expedition/lib/api/generate-story.ts`)

- `syncApiSession()` / `clearApiSession()` — encrypted session cookie
- `generateStory()` / `testProviderConnection()` — call API routes (keys stripped from body)
- Auto-retry 401 after re-sync session

### Server (`src/lib/api/validate-llm-request.ts`)

- Validate provider, model, game config on API routes
- Read keys from encrypted cookie via `readSessionApiKeys()`
- Used by `/api/generate-story`, `/api/test-connection`, `/api/session`

### Hooks

- `src/hooks/use-provider-data.ts` — lazy-load provider metadata for UI
