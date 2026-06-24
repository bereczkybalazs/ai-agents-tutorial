import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import {
  recipeDetailsResponseSchema,
  type RecipeDetailsResponse,
} from "../../types.js";
import { fetchApi, getStateFromContext } from "./shared.js";

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
    const data = await fetchApi(
      `/api/recipes/${recipeId}`,
      recipeDetailsResponseSchema,
      "Recipe details",
      {
        portions,
        exclude_pantry: excludePantry,
      },
    );
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
