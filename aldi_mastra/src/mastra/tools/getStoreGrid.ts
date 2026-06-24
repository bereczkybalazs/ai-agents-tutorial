import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { storeGridResponseSchema, type StoreGridResponse } from "../../types.js";
import { fetchApi } from "./shared.js";

export const getStoreGrid = createTool({
  id: "getStoreGrid",
  description:
    "Fetch the 9x9 ALDI store grid so the final route can be visualized for the user.",
  inputSchema: z.object({
    storeId: z.number().int().positive(),
  }),
  outputSchema: storeGridResponseSchema,
  execute: async ({ storeId }): Promise<StoreGridResponse> => {
    return fetchApi(
      `/api/stores/${storeId}/grid`,
      storeGridResponseSchema,
      "Store grid",
    );
  },
});
