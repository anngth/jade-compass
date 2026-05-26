import type {
  IFullStoryResponse,
  IGameConfig,
} from "@/games/relic-expedition/types";
import type { IProviderConfig } from "@/types/llm";
import {
  fetchWithSessionRetry,
  parseSessionApiError,
  withoutApiKeys,
} from "@/lib/api/llm-session";

interface GenerateStoryRequest {
  providerConfig: Omit<IProviderConfig, "apiKeyManager">;
  gameConfig: IGameConfig;
  seed?: string;
}

export async function generateStory(
  providerConfig: IProviderConfig,
  gameConfig: IGameConfig,
  seed?: string
): Promise<IFullStoryResponse> {
  const body: GenerateStoryRequest = {
    providerConfig: withoutApiKeys(providerConfig),
    gameConfig,
    seed,
  };

  const response = await fetchWithSessionRetry(
    "/api/generate-story",
    body,
    providerConfig
  );

  if (!response.ok) {
    throw new Error(await parseSessionApiError(response));
  }

  return response.json();
}
