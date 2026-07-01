import { IProviderConfig, ProviderDataType, ProviderType } from "@/types/llm";

// ─── OpenAI ──────────────────────────────────────────────────────────────────
// Current text-capable API model options, checked against OpenAI docs on 2026-06-14.
const OPENAI_MODELS = [
  { value: "gpt-5.5" },
  { value: "gpt-5.4" },
  { value: "gpt-5.4-mini" },
  { value: "gpt-5.4-nano" },
  { value: "__custom__", label: "Custom Model (Enter below)" },
];

// ─── Anthropic ───────────────────────────────────────────────────────────────
// Current Claude API IDs, checked against Anthropic docs on 2026-06-14.
const ANTHROPIC_MODELS = [
  { value: "claude-fable-5" },
  { value: "claude-opus-4-8" },
  { value: "claude-sonnet-4-6" },
  { value: "claude-haiku-4-5-20251001" },
  { value: "__custom__", label: "Custom Model (Enter below)" },
];

// ─── Google ───────────────────────────────────────────────────────────────────
// Current Gemini API text-output model options, checked against Google docs on 2026-06-14.
const GOOGLE_MODELS = [
  { value: "gemini-3.5-flash" },
  { value: "gemini-3.1-pro-preview" },
  { value: "gemini-3-flash-preview" },
  { value: "gemini-3.1-flash-lite" },
  { value: "gemini-2.5-pro" },
  { value: "gemini-2.5-flash" },
  { value: "gemini-2.5-flash-lite" },
  { value: "__custom__", label: "Custom Model (Enter below)" },
];

// ─── Groq ─────────────────────────────────────────────────────────────────────
// Groq docs expose the Models API as the source of truth for active IDs.
const GROQ_MODELS = [
  { value: "openai/gpt-oss-120b" },
  { value: "meta-llama/llama-4-scout-17b-16e-instruct" },
  { value: "llama-3.3-70b-versatile" },
  { value: "llama-3.1-8b-instant" },
  { value: "qwen/qwen3-32b" },
  { value: "__custom__", label: "Custom Model (Enter below)" },
];

// ─── Mistral ──────────────────────────────────────────────────────────────────
// Current generalist chat models, checked against Mistral docs on 2026-06-14.
const MISTRAL_MODELS = [
  { value: "mistral-medium-3-5" },
  { value: "mistral-small-2603" },
  { value: "mistral-large-2512" },
  { value: "ministral-3-14b-2512" },
  { value: "ministral-3-8b-2512" },
  { value: "ministral-3-3b-2512" },
  { value: "__custom__", label: "Custom Model (Enter below)" },
];

// ─── OpenRouter (free tier) ───────────────────────────────────────────────────
// Current free models from OpenRouter's public Models API, checked on 2026-06-14.
const OPENROUTER_MODELS = [
  { value: "nex-agi/nex-n2-pro:free" },
  { value: "nvidia/nemotron-3-ultra-550b-a55b:free" },
  { value: "openai/gpt-oss-20b:free" },
  { value: "deepseek/deepseek-r1-0528:free" },
  { value: "qwen/qwen3-235b-a22b:free" },
  { value: "__custom__", label: "Custom Model (Enter below)" },
];

export const providerData: ProviderDataType = {
  // Popular Providers
  openrouter: {
    providerName: "OpenRouter",
    apiBase: "https://openrouter.ai/api/v1",
    link: "openrouter.ai/keys",
    models: OPENROUTER_MODELS,
    defaultModel: OPENROUTER_MODELS[0].value,
  },
  openai: {
    providerName: "OpenAI",
    apiBase: "https://api.openai.com/v1",
    link: "platform.openai.com/api-keys",
    models: OPENAI_MODELS,
    defaultModel: OPENAI_MODELS[0].value,
  },
  anthropic: {
    providerName: "Anthropic",
    apiBase: "https://api.anthropic.com/v1",
    link: "console.anthropic.com/account/keys",
    models: ANTHROPIC_MODELS,
    defaultModel: ANTHROPIC_MODELS[2].value, // claude-sonnet-4-6
  },
  google: {
    providerName: "Google",
    apiBase: "https://generativelanguage.googleapis.com",
    link: "aistudio.google.com/app/apikey",
    models: GOOGLE_MODELS,
    defaultModel: GOOGLE_MODELS[0].value, // gemini-3.5-flash
  },
  mistral: {
    providerName: "Mistral",
    apiBase: "https://api.mistral.ai",
    link: "console.mistral.ai/api-keys",
    models: MISTRAL_MODELS,
    defaultModel: MISTRAL_MODELS[0].value,
  },
  // AI SDK Providers
  "openai-ai-sdk": {
    providerName: "OpenAI (AI SDK)",
    apiBase: "https://api.openai.com/v1",
    link: "platform.openai.com/api-keys",
    models: OPENAI_MODELS,
    defaultModel: OPENAI_MODELS[0].value,
  },
  "anthropic-ai-sdk": {
    providerName: "Anthropic (AI SDK)",
    apiBase: "https://api.anthropic.com",
    link: "console.anthropic.com/account/keys",
    models: ANTHROPIC_MODELS,
    defaultModel: ANTHROPIC_MODELS[2].value,
  },
  "google-ai-sdk": {
    providerName: "Google (AI SDK)",
    apiBase: "https://generativelanguage.googleapis.com",
    link: "aistudio.google.com/app/apikey",
    models: GOOGLE_MODELS,
    defaultModel: GOOGLE_MODELS[0].value,
  },
  "groq-ai-sdk": {
    providerName: "Groq (AI SDK)",
    apiBase: "https://api.groq.com/openai/v1",
    link: "console.groq.com/keys",
    models: GROQ_MODELS,
    defaultModel: GROQ_MODELS[0].value,
  },
  "mistral-ai-sdk": {
    providerName: "Mistral (AI SDK)",
    apiBase: "https://api.mistral.ai",
    link: "console.mistral.ai/api-keys",
    models: MISTRAL_MODELS,
    defaultModel: MISTRAL_MODELS[0].value,
  },
  "openrouter-ai-sdk": {
    providerName: "OpenRouter (AI SDK)",
    apiBase: "https://openrouter.ai/api/v1",
    link: "openrouter.ai/keys",
    models: OPENROUTER_MODELS,
    defaultModel: OPENROUTER_MODELS[0].value,
  },
};

/** Normalize saved settings when a provider model list changes. */
export function resolveSavedProviderModel(
  provider: ProviderType,
  config: Pick<IProviderConfig, "model" | "customModel">,
): Pick<IProviderConfig, "model" | "customModel"> {
  const providerInfo = providerData[provider];
  if (!providerInfo) {
    return {
      model: config.model,
      customModel: config.customModel,
    };
  }

  if (config.model === "__custom__") {
    return {
      model: "__custom__",
      customModel: config.customModel?.trim() || "",
    };
  }

  const selectedModel = config.model ?? providerInfo.defaultModel;
  const knownModels = providerInfo.models.map((entry) => entry.value);
  if (knownModels.includes(selectedModel)) {
    return {
      model: selectedModel,
      customModel: config.customModel,
    };
  }

  return {
    model: providerInfo.defaultModel,
    customModel: "",
  };
}

/** Resolve a saved or configured model to a provider API model ID. */
export function resolveProviderModel(
  provider: ProviderType,
  config: Pick<IProviderConfig, "model" | "customModel">,
): string {
  const saved = resolveSavedProviderModel(provider, config);
  if (saved.model === "__custom__" && saved.customModel?.trim()) {
    return saved.customModel.trim();
  }
  return saved.model ?? providerData[provider]?.defaultModel ?? "";
}
