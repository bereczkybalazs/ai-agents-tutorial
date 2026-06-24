import "dotenv/config";

import { MemorySession, run } from "@openai/agents";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { aldiAgent } from "./agent.js";
import { initialState } from "./state.js";
import type { AldiRunContext } from "./types.js";

const main = async (): Promise<void> => {
  const state = initialState();
  const context: AldiRunContext = { state };
  const session = new MemorySession();
  const rl = readline.createInterface({ input, output });

  console.log("ALDI Shopping Assistant");
  console.log("Type `exit` to quit.\n");

  let nextInput =
    "Greet the user and ask what kind of dish, ingredient, or meal they feel like.";

  while (true) {
    const result = await run(aldiAgent, nextInput, {
      session,
      context,
    });

    const outputText = String(result.finalOutput ?? "").trim();
    if (outputText) {
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
