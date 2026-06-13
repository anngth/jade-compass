# LLM Providers

## Structure

`src/lib/providers/` contains:

- `base.ts` - provider contract and shared prompt behavior
- `provider-factory.ts` - selects an adapter
- `provider-data.ts` - provider metadata and model options
- `openai.ts`, `anthropic.ts`, `google.ts`, `mistral.ts` - direct API adapters
- `vercel.ts` - OpenAI, Anthropic, Google, Groq, Mistral, and OpenRouter through AI SDK

Direct OpenRouter uses the OpenAI-compatible adapter. The authoritative provider IDs and model lists are in `provider-data.ts` and `src/types/llm.ts`.

## Request Path

```text
UI
→ src/lib/api/llm-session.ts
→ /api/generate-story or /api/test-connection
→ src/lib/api/validate-llm-request.ts
→ provider-factory.ts
→ provider adapter
```

The client removes API keys from request bodies. The server reads them from the encrypted session and validates provider, model, and game configuration.

## Adding a Provider

1. Implement the provider contract in `src/lib/providers/`.
2. Add its ID and types in `src/types/llm.ts`.
3. Add metadata and models in `provider-data.ts`.
4. Register it in `provider-factory.ts`.
5. Add setup UI support if required.
6. Test connection, successful generation, invalid output, and provider errors with mocked network responses.

Keep adapters interchangeable, validate structured output, and return actionable errors without exposing credentials.
