import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import {
  API_BASE_URL,
  routePlanResponseSchema,
  type RoutePlanResponse,
} from "../../types.js";
import { getStateFromContext } from "./shared.js";

export const getRoutePlan = createTool({
  id: "getRoutePlan",
  description:
    "Generate the optimal in-store pickup route for the selected recipe and store.",
  inputSchema: z.object({
    storeId: z.number().int().positive(),
    recipeId: z.number().int().positive(),
    excludePantry: z.boolean(),
  }),
  outputSchema: routePlanResponseSchema,
  execute: async (
    { storeId, recipeId, excludePantry },
    context,
  ): Promise<RoutePlanResponse> => {
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

    const data = routePlanResponseSchema.parse(await response.json());
    const state = getStateFromContext(context);
    if (state) {
      const store = state.storeOptions?.find((item) => item.id === storeId);

      state.selectedStoreId = storeId;
      state.selectedStoreName = store?.name ?? data.store_name;
      state.routePlan = data;
    }

    return data;
  },
});
