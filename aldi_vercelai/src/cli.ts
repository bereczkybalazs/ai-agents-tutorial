import "dotenv/config";

import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool, type ModelMessage } from "ai";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { initialState, stateSummary } from "./state.js";
import { getRecipeDetails } from "./tools/getRecipeDetails.js";
import { getRoutePlan } from "./tools/getRoutePlan.js";
import { getStoreGrid } from "./tools/getStoreGrid.js";
import { listStores } from "./tools/listStores.js";
import { searchRecipes } from "./tools/searchRecipes.js";
import type { ToolContext, ToolDefinition } from "./tools/shared.js";

const MODEL = process.env.ALDI_MODEL ?? "gpt-5.5";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY.");
}

const tools = [
  searchRecipes,
  getRecipeDetails,
  listStores,
  getStoreGrid,
  getRoutePlan,
] as const satisfies ReadonlyArray<ToolDefinition<any>>;

const baseInstructions = `
You are a friendly console shopping assistant for ALDI.

Goal:
Guide the user through one smooth conversation:
1. Search recipes.
2. Help them choose one recipe.
3. Ask for portions.
4. Ask whether to skip pantry staples.
5. Fetch recipe details and present a recommended basket.
6. Ask for a store.
7. Generate the route.
8. Present a clear pickup order and concise route summary.

Rules:
- Use tools instead of inventing recipes, stores, basket items, or route details.
- Be concise and practical.
- If recipe search returns no results, ask the user for another dish or ingredient.
- After the user chooses a recipe, ask for portions if you do not have them yet.
- After portions are known, ask whether to skip common pantry staples such as salt, pepper, sugar and oil.
- Once you have recipeId, portions, and excludePantry, call getRecipeDetails immediately.
- When presenting the basket, use the recommended product selection based on max_profit_option_id, but do not mention profit or margin.
- Describe the basket as fitting the recipe well and using suitable pack sizes.
- After showing the basket, ask which ALDI store to use.
- If you need store options, call listStores.
- If the user names a city or partial store name, use the listed stores to match it.
- If there are multiple plausible store matches, ask the user to choose from a numbered list.
- Once you know the store, call getRoutePlan.
- After getRoutePlan, call getStoreGrid so you can include a small 9x9 ASCII map.
- Keep the final route presentation readable:
  - show total steps
  - show pickup order
  - mention checkout
  - include a compact ASCII grid legend

Selection handling:
- The user may answer with a number like "1" or "2". Interpret that against the most recent list shown in the conversation.
- The current state summary is included below and may help with recipe/store IDs.

Formatting:
- Use short paragraphs and simple bullets when listing recipes, basket items, or route stops.
- Prices should be shown in GBP with 2 decimals using the pound symbol.
- When you show the basket, include the estimated total from the recommended picks.
- For route output, use the stop labels from the API and include steps between major stops when helpful.
`;

const buildSystemPrompt = (context: ToolContext): string => {
  return `${baseInstructions}

Current state summary:
${stateSummary(context.state)}`;
};

const toAiTool = (
  definition: ToolDefinition<any>,
  context: ToolContext,
) =>
  tool({
    description: definition.description,
    inputSchema: definition.schema,
    execute: (args: any) => definition.execute(args, context),
  });

const buildAiTools = (context: ToolContext) =>
  Object.fromEntries(
    tools.map((definition) => [
      definition.name,
      toAiTool(definition, context),
    ]),
  );

const runAssistantTurn = async (
  history: ModelMessage[],
  userInput: string,
  context: ToolContext,
): Promise<{
  assistantText: string;
  nextHistory: ModelMessage[];
}> => {
  const result = await generateText({
    model: openai(MODEL),
    system: buildSystemPrompt(context),
    messages: [...history, { role: "user", content: userInput }],
    tools: buildAiTools(context),
    stopWhen: stepCountIs(12),
  });

  return {
    assistantText: result.text,
    nextHistory: [
      ...history,
      { role: "user", content: userInput },
      ...result.response.messages,
    ],
  };
};

const main = async (): Promise<void> => {
  const context: ToolContext = {
    state: initialState(),
  };

  let history: ModelMessage[] = [];
  let nextInput =
    "Greet the user and ask what kind of dish, ingredient, or meal they feel like.";

  const rl = readline.createInterface({ input, output });

  console.log("ALDI Shopping Assistant");
  console.log(`Using AI SDK (OpenAI provider) model: ${MODEL}`);
  console.log("Type `exit` to quit.\n");

  while (true) {
    const { assistantText, nextHistory } = await runAssistantTurn(
      history,
      nextInput,
      context,
    );

    history = nextHistory;

    if (assistantText.trim()) {
      console.log(`\nAssistant:\n${assistantText.trim()}`);
    }

    let userInput: string;
    try {
      userInput = await rl.question("\nYou: ");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "stdin closed unexpectedly";
      console.log(`\nSession ended: ${message}`);
      break;
    }

    if (userInput.trim().toLowerCase() === "exit") {
      break;
    }

    nextInput = userInput;
  }

  rl.close();
};

await main();
