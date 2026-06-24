import { tool } from "@openai/agents";
import { z } from "zod";

import { API_BASE_URL, type StoreGridResponse } from "../types.js";

export const getStoreGrid = tool({
  name: "getStoreGrid",
  description:
    "Fetch the 9x9 ALDI store grid so the final route can be visualized for the user.",
  parameters: z.object({
    storeId: z.number().int().positive(),
  }),
  async execute({ storeId }): Promise<StoreGridResponse> {
    const response = await fetch(`${API_BASE_URL}/api/stores/${storeId}/grid`);

    if (!response.ok) {
      throw new Error(`Store grid failed with status ${response.status}`);
    }

    return (await response.json()) as StoreGridResponse;
  },
});
