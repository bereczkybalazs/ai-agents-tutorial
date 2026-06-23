
import { Agent, MemorySession, run } from "@openai/agents";

const agent = new Agent({
  name: "Tour guide",
  instructions: "Answer with compact travel facts.",
  model: "gpt-5.4-nano",
});

const session = new MemorySession();

const firstTurn = await run(
  agent,
  "What city is the Golden Gate Bridge in?",
  { session },
);
console.log(firstTurn.finalOutput);

const secondTurn = await run(agent, "What state is it in?", { session });

console.log(secondTurn.finalOutput);

const thirdTurn = await run(agent, "What country is it in?", { session });

console.log(thirdTurn.finalOutput);

const fourthTurn = await run(agent, "How big is it?", { session });

console.log(fourthTurn.finalOutput);