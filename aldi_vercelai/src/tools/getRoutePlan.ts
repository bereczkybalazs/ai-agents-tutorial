import { z } from "zod";

import { API_BASE_URL, type RoutePlanResponse } from "../types.js";
import type { ToolDefinition } from "./shared.js";

type GetRoutePlanArgs = {
  storeId: number;
  recipeId: number;
  excludePantry: boolean;
};

export const getRoutePlan: ToolDefinition<GetRoutePlanArgs> = {
  name: "getRoutePlan",
  description:
    "Generate the optimal in-store pickup route for the selected recipe and store.",
  schema: z.object({
    storeId: z.number().int().positive(),
    recipeId: z.number().int().positive(),
    excludePantry: z.boolean(),
  }),
  parameters: {
    type: "object",
    properties: {
      storeId: {
        type: "number",
        description: "The chosen ALDI store ID.",
      },
      recipeId: {
        type: "number",
        description: "The chosen recipe ID.",
      },
      excludePantry: {
        type: "boolean",
        description: "Whether pantry staples should be excluded.",
      },
    },
    required: ["storeId", "recipeId", "excludePantry"],
    additionalProperties: false,
  },
  async execute(
    { storeId, recipeId, excludePantry },
    context,
  ): Promise<RoutePlanResponse> {
    const params = new URLSearchParams({
      recipe_id: String(recipeId),
      exclude_pantry: String(excludePantry),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/stores/${storeId}/route-plan?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error(`Route plan failed with status ${response.status}`);
    }

    const data = (await response.json()) as RoutePlanResponse;
    const store = context.state.storeOptions?.find((item) => item.id === storeId);

    context.state.selectedStoreId = storeId;
    context.state.selectedStoreName = store?.name ?? data.store_name;
    context.state.routePlan = data;

    return data;
  },
};
