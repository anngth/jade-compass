import { z } from "zod";
import { FullStoryResponseSchema } from "@/games/relic-expedition/lib/schemas/full-story";
import type { IFullStoryResponse } from "@/games/relic-expedition/types";

const STORAGE_KEY = "jade-compass:relic-expedition";
const SAVE_VERSION = 1;

export interface Expedition {
  story: IFullStoryResponse;
  choiceIndexes: number[];
}

const SavedExpeditionSchema = z.object({
  version: z.literal(SAVE_VERSION),
  story: FullStoryResponseSchema,
  choiceIndexes: z.array(z.number().int().nonnegative()),
}).refine(({ story, choiceIndexes }) =>
  choiceIndexes.every((index, round) => {
    const choice = story.rounds[round]?.choices[index];
    return choice && (choice.isCorrect || round === choiceIndexes.length - 1);
  }),
);

export function readExpedition(): Expedition | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) return null;

    const parsed = SavedExpeditionSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return parsed.data;
  } catch {
    // Malformed saves or unavailable storage leave setup available.
  }

  writeExpedition(null);
  return null;
}

export function writeExpedition(expedition: Expedition | null): void {
  try {
    if (expedition) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: SAVE_VERSION, ...expedition }),
      );
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // The current expedition can continue in memory.
  }
}
