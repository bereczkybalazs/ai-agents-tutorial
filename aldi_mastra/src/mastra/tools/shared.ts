import type { AldiAssistantState } from "../../types.js";
import { ALDI_STATE_KEY } from "../../types.js";

export const getStateFromContext = (
  context: { requestContext?: { get: (key: string) => unknown } } | undefined,
): AldiAssistantState | undefined => {
  return context?.requestContext?.get(ALDI_STATE_KEY) as AldiAssistantState | undefined;
};
