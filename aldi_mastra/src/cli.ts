import "dotenv/config";

import { RequestContext } from "@mastra/core/request-context";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { initialState } from "./state.js";
import { ALDI_STATE_KEY } from "./types.js";
import { aldiAgent } from "./mastra/agents/aldi-agent.js";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type AgentResult = {
  text?: unknown;
  outputText?: unknown;
  response?: { messages?: Array<{ content?: unknown }> };
};

const lastMessageText = (messages: Array<{ content?: unknown }> | undefined): string => {
  if (!Array.isArray(messages)) {
    return "";
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const content = messages[index]?.content;
    if (typeof content === "string" && content.trim()) {
      return content;
    }
  }

  return "";
};

const extractOutputText = (result: unknown): string => {
  if (!result || typeof result !== "object") {
    return "";
  }

  const { text, outputText, response } = result as AgentResult;
  return typeof text === "string"
    ? text
    : typeof outputText === "string"
      ? outputText
      : lastMessageText(response?.messages);
};

const main = async (): Promise<void> => {
  const state = initialState();
  const history: ConversationMessage[] = [];
  const rl = readline.createInterface({ input, output });

  console.log("ALDI Shopping Assistant");
  console.log("Type `exit` to quit.\n");

  let nextInput =
    "Greet the user and ask what kind of dish, ingredient, or meal they feel like.";

  while (true) {
    const requestContext = new RequestContext();
    requestContext.set(ALDI_STATE_KEY, state);

    const result = await aldiAgent.generate(nextInput, {
      requestContext,
      context: history as never,
    });

    const outputText = extractOutputText(result).trim();
    history.push({ role: "user", content: nextInput });
    if (outputText) {
      history.push({ role: "assistant", content: outputText });
      console.log(`\nAssistant:\n${outputText}`);
    }

    let userInput: string;
    try {
      userInput = await rl.question("\nYou: ");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "stdin closed unexpectedly";
      console.log(`\nSession ended: ${message}`);
      break;
    }

    if (userInput.trim().toLowerCase() === "exit") {
      break;
    }

    nextInput = userInput;
  }

  rl.close();
};

await main();
