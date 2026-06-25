import { z } from "zod";

import { API_BASE_URL, type RecipesResponse } from "../types.js";
import type { ToolDefinition } from "./shared.js";

type SearchRecipesArgs = {
  query: string;
};

export const searchRecipes: ToolDefinition<SearchRecipesArgs> = {
  name: "searchRecipes",
  description: "Search ALDI recipes by dish, ingredient, or meal idea.",
  schema: z.object({
    query: z.string().min(1),
  }),
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Dish, ingredient, or meal idea to search for.",
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  async execute({ query }, context): Promise<RecipesResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/recipes?q=${encodeURIComponent(query)}`,
    );

    if (!response.ok) {
      throw new Error(`Recipe search failed with status ${response.status}`);
    }

    const data = (await response.json()) as RecipesResponse;
    context.state.lastRecipeQuery = query;
    context.state.recipeOptions = data.recipes;

    return data;
  },
};
