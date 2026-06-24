import { createTool } from "@mastra/core/tools";

import { API_BASE_URL, storesResponseSchema, type StoresResponse } from "../../types.js";
import { getStateFromContext } from "./shared.js";

export const listStores = createTool({
  id: "listStores",
  description: "List ALDI stores so the user can choose the best location.",
  inputSchema: undefined,
  outputSchema: storesResponseSchema,
  execute: async (_input, context): Promise<StoresResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/stores`);

    if (!response.ok) {
      throw new Error(`Store list failed with status ${response.status}`);
    }

    const data = storesResponseSchema.parse(await response.json());
    const state = getStateFromContext(context);
    if (state) {
      state.storeOptions = data.stores;
    }

    return data;
  },
});
