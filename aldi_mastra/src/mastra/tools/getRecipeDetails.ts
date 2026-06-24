import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import {
  API_BASE_URL,
  recipeDetailsResponseSchema,
  type RecipeDetailsResponse,
} from "../../types.js";
import { getStateFromContext } from "./shared.js";

export const getRecipeDetails = createTool({
  id: "getRecipeDetails",
  description:
    "Fetch scaled recipe ingredients, pantry filtering, and ALDI product options.",
  inputSchema: z.object({
    recipeId: z.number().int().positive(),
    portions: z.number().int().positive(),
    excludePantry: z.boolean(),
  }),
  outputSchema: recipeDetailsResponseSchema,
  execute: async (
    { recipeId, portions, excludePantry },
    context,
  ): Promise<RecipeDetailsResponse> => {
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

    const data = recipeDetailsResponseSchema.parse(await response.json());
    const state = getStateFromContext(context);
    if (state) {
      const recipeName =
        state.recipeOptions?.find((recipe) => recipe.id === recipeId)?.name ??
        data.recipe.name;

      state.selectedRecipeId = recipeId;
      state.selectedRecipeName = recipeName;
      state.portions = portions;
      state.excludePantry = excludePantry;
      state.recipeDetails = data;
    }

    return data;
  },
});
