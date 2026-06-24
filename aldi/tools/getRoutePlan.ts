import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

import {
  API_BASE_URL,
  type AldiRunContext,
  type RoutePlanResponse,
} from "../types.js";

export const getRoutePlan = tool({
  name: "getRoutePlan",
  description:
    "Generate the optimal in-store pickup route for the selected recipe and store.",
  parameters: z.object({
    storeId: z.number().int().positive(),
    recipeId: z.number().int().positive(),
    excludePantry: z.boolean(),
  }),
  async execute(
    { storeId, recipeId, excludePantry },
    runContext?: RunContext<AldiRunContext>,
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
    if (runContext?.context?.state) {
      const store = runContext.context.state.storeOptions?.find(
        (item) => item.id === storeId,
      );

      runContext.context.state.selectedStoreId = storeId;
      runContext.context.state.selectedStoreName =
        store?.name ?? data.store_name;
      runContext.context.state.routePlan = data;
    }

    return data;
  },
});
