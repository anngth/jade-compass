import { expect, test, type Page, type Route } from "@playwright/test";
import type { IFullStoryResponse } from "../../src/games/relic-expedition/types";

const expeditionPath = "/relic-expedition";
const saveKey = "jade-compass:relic-expedition";
const fakeKey = "qa-fake-key";
const finalConsequence = "The compass gate opens and the expedition is complete.";
const previousItem = "Old brass token";

interface SavedExpedition {
  version: number;
  story: IFullStoryResponse;
  choiceIndexes: number[];
}

declare global {
  interface Window {
    generationRequests: number;
    generationResponsesRead: number;
  }
}

function storyFixture(theme: string, rounds: number): IFullStoryResponse {
  return {
    intro: "Follow the lanterns to the Jade Compass.",
    overallTheme: theme,
    rounds: Array.from({ length: rounds }, (_, index) => {
      const round = index + 1;
      const location = `Lantern Gate ${round}`;
      return {
        round,
        location,
        intro: "A lantern hangs over the safe path.",
        sceneSummary: "One route is lit and the other is dark.",
        narrativeState: {
          location,
          status: "Ready to cross",
          shortStatus: "Ready",
          initItems: [previousItem],
        },
        choices: [
          {
            id: `lantern-${round}`,
            title: "Follow the Lantern",
            summary: "Take the path lit by the lantern.",
            isCorrect: true,
            consequence: round === rounds ? finalConsequence : "You reach the next gate.",
            finalItems: round === rounds ? [] : [previousItem],
          },
          {
            id: `dark-${round}`,
            title: "Enter the Dark Tunnel",
            summary: "Take the unlit path.",
            isCorrect: false,
            consequence: "The dark tunnel closes behind you.",
            finalItems: [],
          },
        ],
      };
    }),
  };
}

function readSave(page: Page): Promise<SavedExpedition | null> {
  return page.evaluate((key) => {
    const saved = sessionStorage.getItem(key);
    return saved === null ? null : JSON.parse(saved);
  }, saveKey);
}

function roundLabel(page: Page, current: number, total: number) {
  return page.getByText(`${current}/${total}`, { exact: true });
}

function choice(page: Page, index: number) {
  return page.getByRole("button", { name: new RegExp(`^Choice ${index}:`) });
}

function pendingRoute() {
  let capture!: (route: Route) => void;
  const request = new Promise<Route>((resolve) => {
    capture = resolve;
  });
  return { capture, request };
}

async function mockSession(page: Page): Promise<void> {
  await page.route("**/api/session", (route) => route.fulfill({ json: { ok: true } }));
}

test("Vietnamese sample restores progress and replays locally without an API key", async ({
  page,
}) => {
  const apiRequests: string[] = [];
  await page.route("**/api/**", (route) => {
    apiRequests.push(route.request().url());
    return route.abort();
  });

  await page.goto(expeditionPath);
  await expect(page.getByRole("button", { name: "Enter API Key" })).toBeDisabled();
  await page.getByRole("spinbutton").first().fill("5");
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.getByRole("button", { name: "Vietnamese", exact: true }).click();
  await page.getByRole("button", { name: "Play Sample" }).click();

  const sampleHeading = page.getByRole("heading", { name: "Kho báu dưới chân triều" });
  await expect(sampleHeading).toBeVisible();
  await expect(roundLabel(page, 1, 2)).toBeVisible();
  const original = await readSave(page);
  expect(original).toMatchObject({ version: 1, choiceIndexes: [] });

  await choice(page, 1).click();
  await expect(roundLabel(page, 2, 2)).toBeVisible();
  await page.reload();
  await expect(sampleHeading).toBeVisible();
  await expect(roundLabel(page, 2, 2)).toBeVisible();
  await expect(page.getByRole("button", { name: /Last Result/ })).toContainText(
    "Gạt cần hình trăng",
  );
  expect(await readSave(page)).toEqual({ ...original, choiceIndexes: [0] });

  await choice(page, 1).click();
  const gameOver = page.getByRole("heading", { name: "GAME OVER" });
  await expect(gameOver).toBeVisible();
  await page.reload();
  await expect(gameOver).toBeVisible();
  expect(await readSave(page)).toEqual({ ...original, choiceIndexes: [0, 0] });

  await page.getByRole("button", { name: "Replay Story" }).click();
  await expect(sampleHeading).toBeVisible();
  await expect(roundLabel(page, 1, 2)).toBeVisible();
  expect(await readSave(page)).toEqual(original);

  await choice(page, 2).click();
  await page.getByRole("button", { name: "New Adventure" }).click();
  await expect(page.getByRole("button", { name: "Play Sample" })).toBeVisible();
  expect(await readSave(page)).toBeNull();
  expect(apiRequests).toEqual([]);
});

test("AI start ignores duplicate activation, retries a failure, and discards a stale response", async ({
  page,
}) => {
  await mockSession(page);
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.generationRequests = 0;
    window.generationResponsesRead = 0;

    window.fetch = async (input, init) => {
      const url = new URL(input instanceof Request ? input.url : input, location.href);
      if (url.pathname !== "/api/generate-story") return originalFetch(input, init);

      window.generationRequests++;
      const response = await originalFetch(input, init);
      const originalJson = response.json.bind(response);

      response.json = async () => {
        const body = await originalJson();
        // Observe the next task after the app has consumed the JSON body.
        setTimeout(() => window.generationResponsesRead++, 0);
        return body;
      };

      return response;
    };
  });

  const initial = pendingRoute();
  const stale = pendingRoute();
  const requestBodies: (string | null)[] = [];
  const generatedTheme = "The Lantern Vault";
  await page.route("**/api/generate-story", (route) => {
    requestBodies.push(route.request().postData());
    switch (requestBodies.length) {
      case 1:
        return initial.capture(route);
      case 2:
        return route.fulfill({ json: storyFixture(generatedTheme, 2) });
      case 3:
        return stale.capture(route);
      default:
        return route.abort();
    }
  });

  await page.goto("/");
  const openExpedition = () => page.getByRole("link", { name: "Start expedition" }).click();
  await openExpedition();
  await page.getByPlaceholder("Enter your API key here").fill(fakeKey);
  const start = page.getByRole("button", { name: "Start Adventure", exact: true });
  await expect(start).toBeEnabled();

  // Trigger both activations in one browser task, before waiting on a network response.
  await start.evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });
  const failedRoute = await initial.request;
  await expect(start).toBeDisabled();
  await expect(page.getByRole("button", { name: "Play Sample" })).toBeDisabled();
  expect(await page.evaluate(() => window.generationRequests)).toBe(1);

  await failedRoute.fulfill({ status: 500, json: { error: "QA generation failed" } });
  await expect(page.getByText(/QA generation failed/)).toBeVisible();
  await expect(start).toBeEnabled();
  await start.click();
  await expect(page.getByRole("heading", { name: generatedTheme })).toBeVisible();
  expect(requestBodies).toHaveLength(2);
  expect(await page.evaluate(() => window.generationRequests)).toBe(2);
  await expect.poll(() => page.evaluate(() => window.generationResponsesRead)).toBe(2);

  await choice(page, 2).click();
  await page.getByRole("button", { name: "New Adventure" }).click();
  await start.click();
  const staleRoute = await stale.request;
  await page.goBack();
  await expect(page.getByRole("link", { name: "Start expedition" })).toBeVisible();
  await openExpedition();
  await page.getByRole("button", { name: "Play Sample" }).click();
  const sampleHeading = page.getByRole("heading", { name: "The Tidekeeper's Vault" });
  await expect(sampleHeading).toBeVisible();
  const sampleSave = await readSave(page);
  expect(sampleSave).toMatchObject({ choiceIndexes: [] });
  // The pending request and the replacement run must share a browser document.
  expect(await page.evaluate(() => window.generationRequests)).toBe(3);

  await staleRoute.fulfill({ json: storyFixture("Stale AI story", 2) });
  await expect.poll(() => page.evaluate(() => window.generationResponsesRead)).toBe(3);
  expect(await readSave(page)).toEqual(sampleSave);
  await page.reload();
  await expect(sampleHeading).toBeVisible();
  expect(await readSave(page)).toEqual(sampleSave);
  expect(requestBodies).toHaveLength(3);
  for (const body of requestBodies) {
    expect(body).toBeTruthy();
    expect(body).not.toContain(fakeKey);
  }
});

test("keyboard shortcuts advance once per key press and victory shows the last choice result", async ({
  page,
}) => {
  await mockSession(page);
  await page.route("**/api/generate-story", (route) =>
    route.fulfill({ json: storyFixture("The Four Lanterns", 4) }),
  );
  await page.goto(expeditionPath);
  await page.getByPlaceholder("Enter your API key here").fill(fakeKey);
  await page.getByRole("button", { name: "Start Adventure", exact: true }).click();
  await expect(roundLabel(page, 1, 4)).toBeVisible();

  for (const modifier of ["Control", "Alt", "Meta", "Shift"]) {
    await page.keyboard.press(`${modifier}+Digit1`);
    expect((await readSave(page))?.choiceIndexes).toEqual([]);
  }
  await page.evaluate(() => {
    const input = document.createElement("input");
    input.id = "temporary-keyboard-test-input";
    document.body.append(input);
    input.focus();
  });
  await page.keyboard.press("Digit1");
  await expect(page.locator("#temporary-keyboard-test-input")).toHaveValue("1");
  expect((await readSave(page))?.choiceIndexes).toEqual([]);
  await page.locator("#temporary-keyboard-test-input").evaluate((input) => input.remove());

  const advanceWhileHeld = async (key: string, currentRound: number) => {
    await page.keyboard.down(key);
    await expect(roundLabel(page, currentRound + 1, 4)).toBeVisible();
    // Refocus the next choice so a repeated activation reaches its handler.
    await choice(page, 1).focus();
    await page.keyboard.down(key);
    await page.keyboard.up(key);
    expect((await readSave(page))?.choiceIndexes).toHaveLength(currentRound);
  };

  await advanceWhileHeld("Digit1", 1);
  await advanceWhileHeld("Enter", 2);
  await advanceWhileHeld("Space", 3);
  await expect(page.getByText(previousItem, { exact: true })).toBeVisible();
  await page.keyboard.press("Numpad1");

  const victory = page.getByRole("heading", { name: "VICTORY!" });
  await expect(victory).toBeVisible();
  await expect(page.getByText("You recovered the Jade Compass.")).toBeVisible();
  await expect(page.getByText(finalConsequence, { exact: true })).toBeVisible();
  await expect(page.getByText("Final Inventory:", { exact: true }).locator("..")).toHaveText(
    /Final Inventory:\s*None/,
  );
  await expect(page.getByText("Rounds Completed:", { exact: true }).locator("..")).toHaveText(
    /Rounds Completed:\s*4/,
  );
  await expect(page.getByText(previousItem, { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(victory).toBeVisible();
  await expect(page.getByText(finalConsequence, { exact: true })).toBeVisible();
});
