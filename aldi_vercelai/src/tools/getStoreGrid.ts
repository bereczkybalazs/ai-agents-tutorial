import { z } from "zod";

import { API_BASE_URL, type StoreGridResponse } from "../types.js";
import type { ToolDefinition } from "./shared.js";

type GetStoreGridArgs = {
  storeId: number;
};

export const getStoreGrid: ToolDefinition<GetStoreGridArgs> = {
  name: "getStoreGrid",
  description:
    "Fetch the 9x9 ALDI store grid so the final route can be visualized for the user.",
  schema: z.object({
    storeId: z.number().int().positive(),
  }),
  parameters: {
    type: "object",
    properties: {
      storeId: {
        type: "number",
        description: "The chosen ALDI store ID.",
      },
    },
    required: ["storeId"],
    additionalProperties: false,
  },
  async execute({ storeId }): Promise<StoreGridResponse> {
    const response = await fetch(`${API_BASE_URL}/api/stores/${storeId}/grid`);

    if (!response.ok) {
      throw new Error(`Store grid failed with status ${response.status}`);
    }

    return (await response.json()) as StoreGridResponse;
  },
};
