import type { ContentLanguageType } from "@/types/llm";

export interface INarrativeState {
  location: string;
  status: string;
  initItems: string[];
  storyProgress?: string;
}

export interface IChoice {
  id: string;
  title: string;
  summary: string;
  isCorrect: boolean;
  consequence: string;
  finalItems: string[];
}

export interface IGameRound {
  intro: string;
  round: number;
  location: string;
  narrativeState: INarrativeState;
  choices: IChoice[];
  failureSummary?: string;
}

export interface IFullStoryResponse {
  intro: string;
  rounds: IGameRound[];
  overallTheme: string;
}

export interface IGameConfig {
  rounds?: number;
  choicesPerRound?: number;
  contentLanguage?: ContentLanguageType;
}

export interface IGameState {
  status: "idle" | "playing" | "victory" | "failure";
  currentRound: number;
  narrativeState: INarrativeState;
  choiceHistory: IChoice[];
  failureReason?: string;
  intro?: string;
  overallTheme?: string;
}
