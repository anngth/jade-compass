"use client";

import dynamic from "next/dynamic";
import { GameProvider, useGame } from "@/games/relic-expedition/context/game-context";

const HomePage = dynamic(() =>
  import("@/games/relic-expedition/components/screens/home").then((mod) => ({
    default: mod.HomePage,
  }))
);
const GamePage = dynamic(() =>
  import("@/games/relic-expedition/components/screens/game").then((mod) => ({
    default: mod.GamePage,
  }))
);
const VictoryPage = dynamic(() =>
  import("@/games/relic-expedition/components/screens/victory").then((mod) => ({
    default: mod.VictoryPage,
  }))
);
const FailurePage = dynamic(() =>
  import("@/games/relic-expedition/components/screens/failure").then((mod) => ({
    default: mod.FailurePage,
  }))
);

function GameRouter() {
  const { gameState, isRestoring } = useGame();

  if (isRestoring) {
    return (
      <div role="status" className="grid min-h-screen place-items-center font-pixel text-[var(--primary)]">
        Loading adventure…
      </div>
    );
  }

  switch (gameState.status) {
    case "idle":
      return <HomePage />;
    case "playing":
      return <GamePage />;
    case "victory":
      return <VictoryPage />;
    case "failure":
      return <FailurePage />;
    default:
      return <HomePage />;
  }
}

export default function RelicExpeditionPage() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
