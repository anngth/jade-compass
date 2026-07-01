# LLM Providers

## Layout

`src/lib/providers/`:

| File | Role |
| --- | --- |
| `base.ts` | Contract and shared prompts |
| `provider-factory.ts` | Adapter selection |
| `provider-data.ts` | Metadata, models, model resolution |
| `openai.ts`, `anthropic.ts`, `google.ts`, `mistral.ts` | Direct API adapters |
| `vercel.ts` | AI SDK adapters (OpenAI, Anthropic, Google, Groq, Mistral, OpenRouter) |

OpenRouter (direct) uses the OpenAI-compatible adapter. Model lists and provider IDs: `provider-data.ts`, `src/types/llm.ts`.

Retired model IDs in saved settings are normalized on load via `resolveSavedProviderModel()`. API calls use `resolveProviderModel()` (including custom models).

## Request path

```text
UI → llm-session.ts → /api/generate-story | /api/test-connection
    → validate-llm-request.ts → provider-factory → adapter
```

Keys stay out of request bodies; the server reads them from the encrypted session.

## Adding a provider

1. Implement adapter in `src/lib/providers/`.
2. Add ID/types in `src/types/llm.ts`.
3. Add metadata in `provider-data.ts`.
4. Register in `provider-factory.ts`.
5. Wire setup UI if needed.
6. Verify connection, generation, invalid output, and errors (mocked network).

Keep adapters interchangeable. Validate structured output via `validateFullStoryResponse()`.
