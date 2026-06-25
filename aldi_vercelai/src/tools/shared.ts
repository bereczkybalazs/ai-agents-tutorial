import type { ZodType } from "zod";

import type { AldiAssistantState } from "../types.js";

type JsonSchema = Record<string, unknown>;

export type ToolContext = {
  state: AldiAssistantState;
};

export type ToolDefinition<TArgs> = {
  name: string;
  description: string;
  schema: ZodType<TArgs>;
  parameters: JsonSchema;
  execute: (args: TArgs, context: ToolContext) => Promise<unknown>;
};
