import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

import {
  API_BASE_URL,
  type AldiRunContext,
  type RecipeDetailsResponse,
} from "../types.js";

export const getRecipeDetails = tool({
  name: "getRecipeDetails",
  description:
    "Fetch scaled recipe ingredients, pantry filtering, and ALDI product options.",
  parameters: z.object({
    recipeId: z.number().int().positive(),
    portions: z.number().int().positive(),
    excludePantry: z.boolean(),
  }),
  async execute(
    { recipeId, portions, excludePantry },
    runContext?: RunContext<AldiRunContext>,
  ): Promise<RecipeDetailsResponse> {
    const params = new URLSearchParams({
      portions: String(portions),
      exclude_pantry: String(excludePantry),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/recipes/${recipeId}?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`Recipe details failed with status ${response.status}`);
    }

    const data = (await response.json()) as RecipeDetailsResponse;
    if (runContext?.context?.state) {
      const recipeName =
        runContext.context.state.recipeOptions?.find(
          (recipe) => recipe.id === recipeId,
        )?.name ?? data.recipe.name;

      runContext.context.state.selectedRecipeId = recipeId;
      runContext.context.state.selectedRecipeName = recipeName;
      runContext.context.state.portions = portions;
      runContext.context.state.excludePantry = excludePantry;
      runContext.context.state.recipeDetails = data;
    }

    return data;
  },
});
