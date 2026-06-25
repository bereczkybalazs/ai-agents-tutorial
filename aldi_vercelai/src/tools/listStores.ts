import { z } from "zod";

import { API_BASE_URL, type StoresResponse } from "../types.js";
import type { ToolDefinition } from "./shared.js";

type ListStoresArgs = Record<string, never>;

export const listStores: ToolDefinition<ListStoresArgs> = {
  name: "listStores",
  description: "List ALDI stores so the user can choose the best location.",
  schema: z.object({}),
  parameters: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
  async execute(_args, context): Promise<StoresResponse> {
    const response = await fetch(`${API_BASE_URL}/api/stores`);

    if (!response.ok) {
      throw new Error(`Store list failed with status ${response.status}`);
    }

    const data = (await response.json()) as StoresResponse;
    context.state.storeOptions = data.stores;

    return data;
  },
};
