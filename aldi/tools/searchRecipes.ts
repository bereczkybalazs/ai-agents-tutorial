import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

import { API_BASE_URL, type AldiRunContext, type RecipesResponse } from "../types.js";

export const searchRecipes = tool({
  name: "searchRecipes",
  description: "Search ALDI recipes by dish, ingredient, or meal idea.",
  parameters: z.object({
    query: z.string().min(1),
  }),
  async execute(
    { query },
    runContext?: RunContext<AldiRunContext>,
  ): Promise<RecipesResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/recipes?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error(`Recipe search failed with status ${response.status}`);
    }

    const data = (await response.json()) as RecipesResponse;
    if (runContext?.context?.state) {
      runContext.context.state.lastRecipeQuery = query;
      runContext.context.state.recipeOptions = data.recipes;
    }

    return data;
  },
});
