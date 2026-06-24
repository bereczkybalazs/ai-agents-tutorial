import { RunContext, tool } from "@openai/agents";
import { z } from "zod";

import { API_BASE_URL, type AldiRunContext, type StoresResponse } from "../types.js";

export const listStores = tool({
  name: "listStores",
  description: "List ALDI stores so the user can choose the best location.",
  parameters: z.object({}),
  async execute(
    _args,
    runContext?: RunContext<AldiRunContext>,
  ): Promise<StoresResponse> {
    const response = await fetch(`${API_BASE_URL}/api/stores`);

    if (!response.ok) {
      throw new Error(`Store list failed with status ${response.status}`);
    }

    const data = (await response.json()) as StoresResponse;
    if (runContext?.context?.state) {
      runContext.context.state.storeOptions = data.stores;
    }

    return data;
  },
});
