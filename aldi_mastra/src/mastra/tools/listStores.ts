import { createTool } from "@mastra/core/tools";

import { storesResponseSchema, type StoresResponse } from "../../types.js";
import { fetchApi, getStateFromContext } from "./shared.js";

export const listStores = createTool({
  id: "listStores",
  description: "List ALDI stores so the user can choose the best location.",
  inputSchema: undefined,
  outputSchema: storesResponseSchema,
  execute: async (_input, context): Promise<StoresResponse> => {
    const data = await fetchApi("/api/stores", storesResponseSchema, "Store list");
    const state = getStateFromContext(context);
    if (state) {
      state.storeOptions = data.stores;
    }

    return data;
  },
});
