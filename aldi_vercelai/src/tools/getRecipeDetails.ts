import { z } from "zod";

import { API_BASE_URL, type RecipeDetailsResponse } from "../types.js";
import type { ToolDefinition } from "./shared.js";

type GetRecipeDetailsArgs = {
  recipeId: number;
  portions: number;
  excludePantry: boolean;
};

export const getRecipeDetails: ToolDefinition<GetRecipeDetailsArgs> = {
  name: "getRecipeDetails",
  description:
    "Fetch scaled recipe ingredients, pantry filtering, and ALDI product options.",
  schema: z.object({
    recipeId: z.number().int().positive(),
    portions: z.number().int().positive(),
    excludePantry: z.boolean(),
  }),
  parameters: {
    type: "object",
    properties: {
      recipeId: {
        type: "number",
        description: "The chosen recipe ID.",
      },
      portions: {
        type: "number",
        description: "Desired serving count.",
      },
      excludePantry: {
        type: "boolean",
        description: "Whether pantry staples should be excluded.",
      },
    },
    required: ["recipeId", "portions", "excludePantry"],
    additionalProperties: false,
  },
  async execute(
    { recipeId, portions, excludePantry },
    context,
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
    const recipeName =
      context.state.recipeOptions?.find((recipe) => recipe.id === recipeId)?.name ??
      data.recipe.name;

    context.state.selectedRecipeId = recipeId;
    context.state.selectedRecipeName = recipeName;
    context.state.portions = portions;
    context.state.excludePantry = excludePantry;
    context.state.recipeDetails = data;

    return data;
  },
};
