import {
  LLMProvider,
  ContentLanguageType,
} from "@/types/llm";
import { IFullStoryResponse } from "@/games/relic-expedition/types";
import { logger } from "@/lib/logger";

export abstract class BaseLLMProvider implements LLMProvider {
  abstract name: string;
  protected apiKey: string;
  protected apiBase: string;
  protected model: string;

  constructor(apiKey: string, apiBase: string, model: string) {
    this.apiKey = apiKey;
    this.apiBase = apiBase;
    this.model = model;
  }

  abstract generateFullStory(
    totalRounds: number,
    choicesPerRound: number,
    contentLanguage: ContentLanguageType,
    seed: string
  ): Promise<IFullStoryResponse>;

  protected createFullStorySystemPrompt({
    contentLanguage,
  }: {
    contentLanguage: ContentLanguageType;
  }): string {
    return `You are a narrative designer for a treasure-hunting adventure game called "Jade Compass: Relic Expedition".

Your task is to create a COMPLETE, CONNECTED story spanning multiple rounds. The story must:
- Maintain continuity between rounds
- Build tension as the player progresses
- Reference previous events and choices
- Culminate in finding the legendary Jade Compass
- Be written ENTIRELY in ${contentLanguage}

Your response must be in standard JSON format with no plain text, no markdown, no additional explanations, minimal, and no whitespace or end line.

The game theme is ALWAYS treasure hunting with elements like:
- Ancient ruins, mysterious temples, hidden caves,...
- Maps, compasses, artifacts, relics,...
- Traps, puzzles, rival treasure hunters,...
- Exotic locations with logical connections,...

Each round should BUILD upon the previous one, creating a cohesive adventure story.`;
  }

  protected createFullStoryPrompt(
    totalRounds: number,
    choicesPerRound: number,
    plusFormat: boolean = false
  ): string {
    return (
      `Generate a complete ${totalRounds}-round treasure hunting adventure.

Requirements:
1. Create a compelling introduction that sets up the adventure
2. Generate ${totalRounds} interconnected rounds forming a complete story arc
3. Each round must have exactly ${choicesPerRound} choices
4. Only ONE correct choice (isCorrect: true) per round
5. Ensure the correct answer position varies between rounds
6. Each choice must have clear consequences that affect the story
7. Maintain consistency in setting and characters
8. Include rich descriptions of locations, characters, and items
9. Each round should meaningfully advance the plot
10. The ending should be satisfying and consistent with the story flow
11. Because a wrong choice immediately ends the game, every round must be fair: include enough clues in sceneSummary and/or intro for a careful player to infer the correct choice
12. Wrong choices must still feel plausible; do not make them silly, obviously fatal, or obviously inferior
13. Do not reveal correctness in player-facing choice title or summary; avoid words like safe, correct, fatal, doomed, obvious, best, or trap unless all choices are equally subtle
14. sceneSummary is a player-facing 1-2 sentence decision prompt, max 180 characters
15. intro is the richer scene description for players who want more detail
16. initItems is the initial items in the inventory before the choice is made
17. finalItems is the final items in the inventory after the choice is made
18. storyProgress is the summary of story events up to this point
19. location is the current location
20. status is the full current status of the character
21. shortStatus is a HUD-friendly status label, max 48 characters
22. choice title must be a short player action, max 6 words
23. choice summary must describe the player's intended action in 1 sentence, not the outcome
24. consequence is the actual outcome after choosing; explain the logic behind success or failure here
25. isCorrect is the correct choice
26. id is the id of the choice
` + (plusFormat ? this.createResponseFormat() : "")
    );
  }

  private createResponseFormat(): string {
    return `
Response Format (JSON only):
{
  "intro": "Compelling introduction to the adventure",
  "overall_theme": "Main theme of the story",
  "rounds": [
    {
      "round": 1,
      "location": "Current location",
      "intro": "Detailed description of the current situation",
      "sceneSummary": "Player-facing 1-2 sentence scene summary, max 180 characters",
      "narrativeState": {
        "location": "Current location",
        "status": "Character's full current condition",
        "shortStatus": "HUD-friendly status, max 48 characters",
        "initItems": ["current", "inventory", "items"],
        "storyProgress": "Summary of story events up to this point"
      },
      "choices": [
        {
          "id": "r1_c1",
          "title": "Player action, max 6 words",
          "summary": "Intended action from the player's perspective; do not reveal outcome",
          "isCorrect": true,
          "consequence": "Actual outcome after choosing; explain why this succeeds or fails",
          "finalItems": ["final", "inventory", "items"]
        },
        {
          "id": "r1_c2",
          "title": "Player action, max 6 words",
          "summary": "Intended action from the player's perspective; do not reveal outcome",
          "isCorrect": false,
          "consequence": "Actual outcome after choosing; explain why this succeeds or fails",
          "finalItems": ["final", "inventory", "items"]
        }
      ]
    }
  ]
}`;
  }

  // Helper methods for consistent logging
  protected logRequest(
    method: string,
    requestId: string,
    prompt: string,
    systemPrompt: string,
    metadata?: Record<string, unknown>
  ) {
    logger.group(`[LLM ${this.name}] ${method} #${requestId}`);
    logger.log("model:", this.model);
    if (metadata) logger.log("meta:", metadata);
    logger.log("system length:", systemPrompt.length);
    logger.log("prompt length:", prompt.length);
    logger.groupEnd();
  }

  protected logResponse(
    requestId: string,
    response?: string | object,
    json?: object,
    parsedResponse?: object,
    responseTime?: number,
    error?: string,
    metadata?: Record<string, unknown>
  ) {
    logger.group(`[LLM Response] #${requestId}`);
    if (typeof responseTime === "number") logger.log("ms:", responseTime);
    if (metadata) logger.log("meta:", metadata);
    if (error) {
      logger.error("error:", error);
    }
    if (response) {
      logger.log("response received:", typeof response === "string" ? `[${response.length} chars]` : "[object]");
    }
    if (json) {
      logger.log("json keys:", Object.keys(json));
    }
    if (parsedResponse) {
      logger.log("parsed rounds:", (parsedResponse as { rounds?: unknown[] }).rounds?.length ?? 0);
    }
    logger.groupEnd();
  }

  generateRequestId(): string {
    // Simple unique-ish id for debugging
    const rand = Math.random().toString(36).slice(4, 16);
    return `${Date.now().toString(36)}-${rand}`;
  }

  abstract testModelsAvailability(): Promise<void>;
  abstract testConnection(): Promise<void>;
}
