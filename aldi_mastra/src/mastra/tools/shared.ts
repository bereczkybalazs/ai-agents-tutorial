import axios from "axios";
import { z } from "zod";

import { API_BASE_URL, ALDI_STATE_KEY } from "../../types.js";
import type { AldiAssistantState } from "../../types.js";

export const getStateFromContext = (
  context: { requestContext?: { get: (key: string) => unknown } } | undefined,
): AldiAssistantState | undefined => {
  return context?.requestContext?.get(ALDI_STATE_KEY) as AldiAssistantState | undefined;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchApi = async <TSchema extends z.ZodTypeAny>(
  path: string,
  schema: TSchema,
  errorLabel: string,
  query?: Record<string, string | number | boolean | undefined>,
): Promise<z.infer<TSchema>> => {
  try {
    const { data } = await apiClient.get(path, { params: query });
    return schema.parse(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      throw new Error(
        status
          ? `${errorLabel} failed with status ${status}`
          : `${errorLabel} failed: ${error.message}`,
      );
    }

    throw error;
  }
};
