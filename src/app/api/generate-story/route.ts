export const runtime = "edge";

import { NextResponse } from "next/server";
import { ProviderFactory } from "@/lib/providers/provider-factory";
import { validateLlmRequest } from "@/lib/api/validate-llm-request";
import { createStorySeed } from "@/games/relic-expedition/lib/story-seed";
import { validateFullStoryResponse } from "@/games/relic-expedition/lib/schemas/full-story";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerConfig, gameConfig } = await validateLlmRequest(body);

    const provider = await ProviderFactory.create(providerConfig);
    const rounds = gameConfig?.rounds ?? 2;
    const choicesPerRound = gameConfig?.choicesPerRound ?? 2;
    const contentLanguage = gameConfig?.contentLanguage ?? "English";
    const seed =
      typeof body.seed === "string" && body.seed.length > 0
        ? body.seed
        : createStorySeed();

    const storyData = validateFullStoryResponse(
      await provider.generateFullStory(
        rounds,
        choicesPerRound,
        contentLanguage,
        seed,
      ),
      { rounds, choicesPerRound },
    );

    if (!storyData?.rounds?.length) {
      return NextResponse.json(
        { error: "Failed to generate story data" },
        { status: 502 },
      );
    }

    return NextResponse.json(storyData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate story";
    const status = message.includes("API key") || message.includes("session")
      ? 401
      : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
