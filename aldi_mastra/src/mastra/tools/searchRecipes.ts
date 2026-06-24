import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { API_BASE_URL, recipesResponseSchema, type RecipesResponse } from "../../types.js";
import { getStateFromContext } from "./shared.js";

export const searchRecipes = createTool({
  id: "searchRecipes",
  description: "Search ALDI recipes by dish, ingredient, or meal idea.",
  inputSchema: z.object({
    query: z.string().min(1),
  }),
  outputSchema: recipesResponseSchema,
  execute: async ({ query }, context): Promise<RecipesResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/api/recipes?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error(`Recipe search failed with status ${response.status}`);
    }

    const data = recipesResponseSchema.parse(await response.json());
    const state = getStateFromContext(context);
    if (state) {
      state.lastRecipeQuery = query;
      state.recipeOptions = data.recipes;
    }

    return data;
  },
});
