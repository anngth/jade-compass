import { z } from "zod";
import { IFullStoryResponse } from "@/games/relic-expedition/types";
import {
  SCENE_SUMMARY_MAX_LENGTH,
  SHORT_STATUS_MAX_LENGTH,
} from "@/games/relic-expedition/lib/story-limits";
import { parseToFullStoryResponse } from "@/games/relic-expedition/utils/response-parser";

export interface ValidateFullStoryOptions {
  rounds?: number;
  choicesPerRound?: number;
}

const NarrativeStateSchema = z.object({
  location: z.string().describe("Current player location."),
  status: z.string().describe("Full current character condition."),
  shortStatus: z
    .string()
    .max(SHORT_STATUS_MAX_LENGTH)
    .describe("HUD-friendly character status label, max 48 characters."),
  initItems: z
    .array(z.string())
    .describe("Inventory before the player makes a choice."),
  storyProgress: z
    .string()
    .optional()
    .describe("Summary of story events up to this point."),
});

const ChoiceSchema = z.object({
  id: z.string().min(1).describe("Stable choice id."),
  title: z
    .string()
    .min(1)
    .describe("Short player action label, max 6 words. Do not reveal correctness."),
  summary: z
    .string()
    .describe(
      "One-sentence intended action from the player's perspective. Do not reveal whether it is safe, fatal, correct, or optimal.",
    ),
  isCorrect: z.boolean().describe("True for exactly one choice per round."),
  consequence: z
    .string()
    .describe(
      "Actual outcome after choosing, including the logic behind success or failure.",
    ),
  finalItems: z
    .array(z.string())
    .describe("Inventory after this choice resolves."),
});

const GameRoundSchema = z.object({
  intro: z.string().describe("Detailed current scene description."),
  sceneSummary: z
    .string()
    .max(SCENE_SUMMARY_MAX_LENGTH)
    .describe(
      "Player-facing 1-2 sentence decision prompt, max 180 characters. Include fair clues without revealing the correct choice.",
    ),
  round: z.number().int().positive(),
  location: z.string(),
  narrativeState: NarrativeStateSchema,
  choices: z
    .array(ChoiceSchema)
    .min(1)
    .refine(
      (choices) => choices.filter((choice) => choice.isCorrect).length === 1,
      "Each round must have exactly one correct choice.",
    ),
  failureSummary: z.string().optional(),
});

export const FullStoryResponseSchema = z.object({
  intro: z.string(),
  overallTheme: z.string(),
  rounds: z.array(GameRoundSchema).min(1),
});

/** Schema for Vercel AI SDK generateObject (structured output). */
export const FullStoryObjectSchema = FullStoryResponseSchema;

function assertGeneratedStoryShape(
  storyData: IFullStoryResponse,
  options: ValidateFullStoryOptions,
) {
  const { rounds, choicesPerRound } = options;

  if (rounds !== undefined && storyData.rounds.length !== rounds) {
    throw new Error(
      `Generated story must include exactly ${rounds} rounds, received ${storyData.rounds.length}.`,
    );
  }

  if (choicesPerRound !== undefined) {
    const invalidRound = storyData.rounds.find(
      (round) => round.choices.length !== choicesPerRound,
    );
    if (invalidRound) {
      throw new Error(
        `Round ${invalidRound.round} must include exactly ${choicesPerRound} choices, received ${invalidRound.choices.length}.`,
      );
    }
  }
}

export function validateFullStoryResponse(
  raw: unknown,
  options: ValidateFullStoryOptions = {},
): IFullStoryResponse {
  const parsed = parseToFullStoryResponse(raw);
  const storyData = FullStoryResponseSchema.parse(parsed);
  assertGeneratedStoryShape(storyData, options);
  return storyData;
}
