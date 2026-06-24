import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import {
  API_BASE_URL,
  storeGridResponseSchema,
  type StoreGridResponse,
} from "../../types.js";

export const getStoreGrid = createTool({
  id: "getStoreGrid",
  description:
    "Fetch the 9x9 ALDI store grid so the final route can be visualized for the user.",
  inputSchema: z.object({
    storeId: z.number().int().positive(),
  }),
  outputSchema: storeGridResponseSchema,
  execute: async ({ storeId }): Promise<StoreGridResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/stores/${storeId}/grid`);

    if (!response.ok) {
      throw new Error(`Store grid failed with status ${response.status}`);
    }

    return storeGridResponseSchema.parse(await response.json());
  },
});
