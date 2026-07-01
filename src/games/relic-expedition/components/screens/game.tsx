"use client";

import React, { memo, useEffect, useState, useCallback } from "react";
import { useGame } from "@/games/relic-expedition/context/game-context";
import { useSettings } from "@/contexts/settings-context";
import { IChoice } from "@/games/relic-expedition/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MapPin,
  Package,
  Route,
  Sparkles,
} from "lucide-react";

interface ChoiceCardProps {
  choice: IChoice;
  index: number;
  className: string;
  onClick: () => void;
}

interface HudChipProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const HudChip = memo(function HudChip({
  icon: Icon,
  label,
  value,
}: HudChipProps) {
  return (
    <div className="min-w-0 border border-[var(--border)] bg-[var(--muted)]/10 px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon
          className="h-4 w-4 shrink-0 text-[var(--primary)]"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="font-pixel text-[10px] uppercase text-[var(--muted-foreground)]">
            {label}
          </p>
          <p
            className="truncate font-retro text-sm text-[var(--card-foreground)]"
            title={value}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
});

const ChoiceCard = memo(function ChoiceCard({
  choice,
  index,
  className,
  onClick,
}: ChoiceCardProps) {
  const choiceLabel = `Choice ${index + 1}: ${choice.title}. ${choice.summary}`;

  return (
    <Card
      key={choice.id}
      className={className}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={choiceLabel}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="grid grid-cols-[auto_1fr] items-start gap-3 text-base leading-6">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--border)] font-pixel text-xs text-[var(--primary)]">
            {index + 1}
          </span>
          <span className="min-w-0">{choice.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-retro text-sm leading-6 text-[var(--muted-foreground)]">
          {choice.summary}
        </p>
      </CardContent>
    </Card>
  );
});

export function GamePage() {
  const { gameState, makeChoice, currentRoundData, isLoading } = useGame();
  const { settings } = useSettings();

  const [selectedChoice, setSelectedChoice] = useState<IChoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResultRoundOpen, setLastResultRoundOpen] = useState<number | null>(
    null,
  );
  const [sceneDetailsRoundOpen, setSceneDetailsRoundOpen] = useState<
    number | null
  >(null);

  const handleChoice = useCallback(
    async (choice: IChoice) => {
      if (isProcessing) return;

      setSelectedChoice(choice);
      setIsProcessing(true);

      try {
        await makeChoice(choice);
      } catch (error) {
        console.error("Error making choice:", error);
        throw error;
      } finally {
        setIsProcessing(false);
        setSelectedChoice(null);
      }
    },
    [isProcessing, makeChoice],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!currentRoundData || isProcessing) return;

      // Early return if user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      // Check for digit keys using e.code
      let digit: number | null = null;
      if (e.code.startsWith("Digit")) {
        digit = parseInt(e.code.replace("Digit", ""));
      } else if (e.code.startsWith("Numpad")) {
        digit = parseInt(e.code.replace("Numpad", ""));
      }

      if (digit && digit >= 1 && digit <= currentRoundData.choices.length) {
        const choice = currentRoundData.choices[digit - 1];
        handleChoice(choice);
      }
    },
    [currentRoundData, isProcessing, handleChoice],
  );

  // Memoize choice card class names
  const getChoiceCardClassName = useCallback(
    (choice: IChoice) => {
      const baseClasses =
        "cursor-pointer transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]";
      const selectedClasses =
        selectedChoice?.id === choice.id ? "ring-4 ring-[var(--primary)]" : "";
      const processingClasses =
        isProcessing && selectedChoice?.id !== choice.id ? "opacity-50" : "";

      return `${baseClasses} ${selectedClasses} ${processingClasses}`.trim();
    },
    [selectedChoice?.id, isProcessing],
  );

  // Memoize choice click handler
  const createChoiceClickHandler = useCallback(
    (choice: IChoice) => {
      return () => handleChoice(choice);
    },
    [handleChoice],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading || !currentRoundData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)] mx-auto" />
          <p className="font-pixel text-lg">Loading adventure...</p>
        </div>
      </div>
    );
  }

  const items =
    currentRoundData.narrativeState.initItems ??
    gameState.narrativeState.initItems ??
    [];
  const itemsDisplay = items.length ? items.join(", ") : "None";
  const currentLocation =
    currentRoundData.narrativeState.location ||
    gameState.narrativeState.location;
  const currentStatus =
    currentRoundData.narrativeState.shortStatus ||
    gameState.narrativeState.shortStatus ||
    currentRoundData.narrativeState.status ||
    gameState.narrativeState.status;
  const currentProgress =
    currentRoundData.narrativeState.storyProgress ||
    gameState.narrativeState.storyProgress;
  const lastChoice =
    gameState.choiceHistory[gameState.choiceHistory.length - 1];
  const sceneSummary = currentRoundData.sceneSummary || currentRoundData.intro;
  const hasSceneDetails =
    currentRoundData.intro && currentRoundData.intro !== sceneSummary;
  const showLastResult = lastResultRoundOpen === gameState.currentRound;
  const showSceneDetails = sceneDetailsRoundOpen === gameState.currentRound;
  const sceneDetailsPanelId = `scene-details-panel-${gameState.currentRound}`;
  const lastResultPanelId = `last-result-panel-${gameState.currentRound}`;

  return (
    <div className="min-h-screen px-3 py-4 sm:px-4">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {gameState.overallTheme && (
              <h1 className="truncate font-pixel text-xl text-[var(--accent)] sm:text-2xl">
                {gameState.overallTheme}
              </h1>
            )}
            {gameState.intro && gameState.currentRound === 1 && (
              <p className="mt-2 max-w-3xl font-retro text-sm leading-6 text-[var(--muted-foreground)] sm:text-base">
                {gameState.intro}
              </p>
            )}
          </div>
          <div className="shrink-0 border border-[var(--border)] bg-[var(--primary)]/10 px-3 py-2 text-left sm:text-right">
            <p className="font-pixel text-[10px] uppercase text-[var(--muted-foreground)]">
              Round
            </p>
            <p className="font-pixel text-lg text-[var(--primary)]">
              {gameState.currentRound}/{settings?.gameConfig?.rounds}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <HudChip icon={MapPin} label="Location" value={currentLocation} />
          <HudChip icon={Sparkles} label="Status" value={currentStatus} />
          <HudChip icon={Package} label="Items" value={itemsDisplay} />
        </div>
        {currentProgress && (
          <HudChip icon={Route} label="Progress" value={currentProgress} />
        )}

        <Card>
          <CardContent className="space-y-4 pt-4">
            {sceneSummary && (
              <div>
                <h2 className="mb-2 font-pixel text-sm uppercase text-[var(--primary)]">
                  Current Scene
                </h2>
                <p className="font-retro text-base leading-7 text-[var(--card-foreground)]">
                  {sceneSummary}
                </p>
              </div>
            )}

            {hasSceneDetails && (
              <div className="border-t border-[var(--border)] pt-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 text-left"
                  onClick={() =>
                    setSceneDetailsRoundOpen((round) =>
                      round === gameState.currentRound
                        ? null
                        : gameState.currentRound,
                    )
                  }
                  aria-expanded={showSceneDetails}
                  aria-controls={sceneDetailsPanelId}
                >
                  <span className="font-pixel text-xs uppercase text-[var(--muted-foreground)]">
                    Scene Details
                  </span>
                  {showSceneDetails ? (
                    <ChevronUp
                      className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]"
                      aria-hidden="true"
                    />
                  )}
                </button>
                {showSceneDetails && (
                  <p
                    id={sceneDetailsPanelId}
                    className="mt-3 font-retro text-sm leading-6 text-[var(--muted-foreground)]"
                  >
                    {currentRoundData.intro}
                  </p>
                )}
              </div>
            )}

            {lastChoice && gameState.currentRound > 1 && (
              <div className="border-t border-[var(--border)] pt-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 text-left"
                  onClick={() =>
                    setLastResultRoundOpen((round) =>
                      round === gameState.currentRound
                        ? null
                        : gameState.currentRound,
                    )
                  }
                  aria-expanded={showLastResult}
                  aria-controls={lastResultPanelId}
                >
                  <span className="min-w-0">
                    <span className="block font-pixel text-xs uppercase text-[var(--muted-foreground)]">
                      Last Result
                    </span>
                    <span className="block truncate font-retro text-sm font-semibold text-[var(--primary)]">
                      {lastChoice.title}
                    </span>
                  </span>
                  {showLastResult ? (
                    <ChevronUp
                      className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-[var(--muted-foreground)]"
                      aria-hidden="true"
                    />
                  )}
                </button>
                {showLastResult && (
                  <p
                    id={lastResultPanelId}
                    className="mt-3 bg-[var(--accent)]/10 p-3 font-retro text-sm leading-6 text-[var(--muted-foreground)]"
                  >
                    {lastChoice.consequence}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <section aria-labelledby="choices-heading" className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2
              id="choices-heading"
              className="font-pixel text-sm uppercase text-[var(--primary)]"
            >
              Choose Your Move
            </h2>
            <p className="font-retro text-xs text-[var(--muted-foreground)]">
              Press 1-{currentRoundData.choices.length}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {currentRoundData?.choices.map((choice, index) => (
              <ChoiceCard
                key={choice.id}
                choice={choice}
                index={index}
                className={getChoiceCardClassName(choice)}
                onClick={createChoiceClickHandler(choice)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
export default GamePage;
