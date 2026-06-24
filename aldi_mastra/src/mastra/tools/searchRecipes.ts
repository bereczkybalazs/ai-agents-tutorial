import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { recipesResponseSchema, type RecipesResponse } from "../../types.js";
import { fetchApi, getStateFromContext } from "./shared.js";

export const searchRecipes = createTool({
  id: "searchRecipes",
  description: "Search ALDI recipes by dish, ingredient, or meal idea.",
  inputSchema: z.object({
    query: z.string().min(1),
  }),
  outputSchema: recipesResponseSchema,
  execute: async ({ query }, context): Promise<RecipesResponse> => {
    const data = await fetchApi(
      "/api/recipes",
      recipesResponseSchema,
      "Recipe search",
      { q: query },
    );
    const state = getStateFromContext(context);
    if (state) {
      state.lastRecipeQuery = query;
      state.recipeOptions = data.recipes;
    }

    return data;
  },
});
