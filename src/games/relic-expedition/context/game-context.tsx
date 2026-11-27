"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { logger } from "@/lib/logger";
import type {
  IFullStoryResponse,
  IGameState,
  IGameRound,
} from "@/games/relic-expedition/types";
import { generateStory } from "@/games/relic-expedition/lib/api/generate-story";
import { FullStoryResponseSchema } from "@/games/relic-expedition/lib/schemas/full-story";
import {
  readExpedition,
  writeExpedition,
  type Expedition,
} from "@/games/relic-expedition/lib/saved-expedition";
import { sampleStories } from "@/games/relic-expedition/lib/sample-stories";
import { createStorySeed } from "@/games/relic-expedition/lib/story-seed";
import { useSettings } from "@/contexts/settings-context";
import { toast } from "sonner";

interface GameContextType {
  gameState: IGameState;
  totalRounds: number;
  currentRoundData: IGameRound | null;
  isRestoring: boolean;
  isLoading: boolean;
  startGame: () => Promise<void>;
  startSample: () => void;
  makeChoice: (choiceIndex: number) => void;
  replayGame: () => void;
  resetGame: () => void;
}

const defaultGameState: IGameState = {
  status: "idle",
  currentRound: 0,
  narrativeState: {
    location: "Unknown",
    status: "Ready",
    shortStatus: "Ready",
    initItems: [],
  },
  choiceHistory: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { settings, apiKey } = useSettings();
  const [expedition, setExpedition] = useState<Expedition | null | undefined>(
    undefined,
  );
  const latestExpedition = useRef<typeof expedition>(undefined);
  const pendingGeneration = useRef<symbol | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const restored = readExpedition();
    latestExpedition.current = restored;
    // Start from the same snapshot on the server and during hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpedition(restored);
    return () => {
      pendingGeneration.current = null;
    };
  }, []);

  const { gameState, currentRoundData, totalRounds } = useMemo(() => {
    if (!expedition) {
      return { gameState: defaultGameState, currentRoundData: null, totalRounds: 0 };
    }

    const { story, choiceIndexes } = expedition;
    const choiceHistory = choiceIndexes.map(
      (index, round) => story.rounds[round].choices[index],
    );
    const lastChoice = choiceHistory.at(-1);
    const totalRounds = story.rounds.length;
    const status: IGameState["status"] =
      lastChoice?.isCorrect === false
        ? "failure"
        : choiceHistory.length === totalRounds
          ? "victory"
          : "playing";
    const currentRound = choiceHistory.length + (status === "playing" ? 1 : 0);
    const currentRoundData = story.rounds[currentRound - 1];

    return {
      gameState: {
        status,
        currentRound,
        narrativeState: currentRoundData.narrativeState,
        choiceHistory,
        failureReason: status === "failure" ? lastChoice?.consequence : undefined,
        intro: story.intro,
        overallTheme: story.overallTheme,
      },
      currentRoundData,
      totalRounds,
    };
  }, [expedition]);

  const updateExpedition = useCallback((next: Expedition | null) => {
    latestExpedition.current = next;
    setExpedition(next);
    writeExpedition(next);
  }, []);

  const beginStory = useCallback((story: IFullStoryResponse) => {
    updateExpedition({ story, choiceIndexes: [] });
  }, [updateExpedition]);

  const startGame = useCallback(async () => {
    const { providerConfig, gameConfig } = settings;
    if (pendingGeneration.current || latestExpedition.current !== null) return;
    if (!providerConfig || !apiKey?.trim()) return;

    const request = Symbol();
    pendingGeneration.current = request;
    setIsLoading(true);

    try {
      const story = await generateStory(
        providerConfig,
        {
          rounds: gameConfig?.rounds ?? 2,
          choicesPerRound: gameConfig?.choicesPerRound ?? 2,
          contentLanguage: gameConfig?.contentLanguage ?? "English",
        },
        createStorySeed(),
      );
      if (pendingGeneration.current === request) {
        beginStory(FullStoryResponseSchema.parse(story));
      }
    } catch (error) {
      if (pendingGeneration.current !== request) return;
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to start game: " + message);
      logger.error("Start game error:", error);
    } finally {
      if (pendingGeneration.current === request) {
        pendingGeneration.current = null;
        setIsLoading(false);
      }
    }
  }, [apiKey, beginStory, settings]);

  const startSample = useCallback(() => {
    if (pendingGeneration.current || latestExpedition.current !== null) return;

    const language = settings.gameConfig?.contentLanguage;
    beginStory(sampleStories[language === "Vietnamese" ? language : "English"]);
  }, [beginStory, settings.gameConfig?.contentLanguage]);

  const makeChoice = useCallback(
    (choiceIndex: number) => {
      if (
        !expedition ||
        expedition !== latestExpedition.current ||
        gameState.status !== "playing" ||
        !currentRoundData?.choices[choiceIndex]
      ) {
        return;
      }

      updateExpedition({
        story: expedition.story,
        choiceIndexes: [...expedition.choiceIndexes, choiceIndex],
      });
    },
    [currentRoundData, expedition, gameState.status, updateExpedition],
  );

  const replayGame = useCallback(() => {
    const current = latestExpedition.current;
    if (current && !pendingGeneration.current) beginStory(current.story);
  }, [beginStory]);

  const resetGame = useCallback(() => {
    if (!pendingGeneration.current) updateExpedition(null);
  }, [updateExpedition]);

  const contextValue: GameContextType = {
    gameState,
    totalRounds,
    currentRoundData,
    isRestoring: expedition === undefined,
    isLoading,
    startGame,
    startSample,
    makeChoice,
    replayGame,
    resetGame,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {isLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div role="status" className="bg-[var(--background)] pixel-border pixel-shadow px-6 py-5 text-center">
            <div className="font-pixel text-[var(--primary)] mb-3">
              LOADING…
            </div>
            <div className="flex gap-1 justify-center mb-2" aria-hidden="true">
              <span className="w-3 h-3 bg-[var(--primary)] animate-bounce [animation-delay:-0.2s]" />
              <span className="w-3 h-3 bg-[var(--primary)]/80 animate-bounce [animation-delay:-0.1s]" />
              <span className="w-3 h-3 bg-[var(--primary)]/60 animate-bounce" />
            </div>
            <div className="font-retro text-base text-[var(--muted-foreground)]">
              Generating your adventure…
            </div>
          </div>
        </div>
      )}
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
