import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import {
  routePlanResponseSchema,
  type RoutePlanResponse,
} from "../../types.js";
import { fetchApi, getStateFromContext } from "./shared.js";

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
    const data = await fetchApi(
      `/api/stores/${storeId}/route-plan`,
      routePlanResponseSchema,
      "Route plan",
      {
        recipe_id: recipeId,
        exclude_pantry: excludePantry,
      },
    );
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
