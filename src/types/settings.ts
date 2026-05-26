import type { IGameConfig } from "@/games/relic-expedition/types";
import type { IProviderConfig } from "@/types/llm";

export interface ISettings {
  selectedKeyName?: string;
  gameConfig?: IGameConfig;
  providerConfig?: IProviderConfig;
}
