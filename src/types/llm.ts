import type { IFullStoryResponse } from "@/games/relic-expedition/types";

export interface LLMProvider {
  name: string;

  generateFullStory(
    totalRounds: number,
    choicesPerRound: number,
    contentLanguage: ContentLanguageType,
    seed: string
  ): Promise<IFullStoryResponse>;

  generateRequestId(): string;

  testModelsAvailability(): Promise<void>;
  testConnection(): Promise<void>;
}

export interface IProviderConfig {
  provider?: ProviderType;
  apiBase?: string;
  apiKeyManager?: { [key in ProviderType]?: string };
  model?: string;
  customModel?: string;
}

export type ContentLanguageType = "Vietnamese" | "English";

export type PopularProviderType =
  | "openrouter"
  | "openai"
  | "anthropic"
  | "google"
  | "mistral";

export type AISDKProviderType =
  | "openai-ai-sdk"
  | "anthropic-ai-sdk"
  | "google-ai-sdk"
  | "groq-ai-sdk"
  | "mistral-ai-sdk"
  | "openrouter-ai-sdk";

export type ProviderType = PopularProviderType | AISDKProviderType;

export type ProviderDataType = {
  [key in ProviderType]: {
    providerName: string;
    apiBase: string;
    link: string;
    models: { value: string; label?: string }[];
    defaultModel: string;
  };
};
