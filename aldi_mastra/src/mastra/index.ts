import { Mastra } from "@mastra/core";

import { aldiAgent } from "./agents/aldi-agent.js";

export const mastra = new Mastra({
  agents: { aldiAgent },
});
