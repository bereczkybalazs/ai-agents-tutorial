import { Agent, run } from "@openai/agents";

const startedAt = performance.now();

const historyTutor = new Agent({
  name: "History tutor",
  instructions: "Answer history questions clearly and concisely.",
  model: "gpt-4o-mini",
});

const mathTutor = new Agent({
  name: "Math tutor",
  model: "gpt-4o-mini",
  instructions: "Explain math step by step and include worked examples.",
});

const triageAgent = Agent.create({
  name: "Homework triage",
  instructions: "Route each homework question to the right specialist.",
  model: "gpt-4o-mini",
  handoffs: [historyTutor, mathTutor],
});

const result = await run(
  triageAgent,
  "Who was the first president of the United States?",
);

// const result = await run(
//   triageAgent,
//   "What is the square root of 16?",
// );

const resultCreationMs = performance.now() - startedAt;

console.log(result.finalOutput);
console.log(result.lastAgent?.name);
console.log(`Result creation took ${resultCreationMs.toFixed(0)}ms`);

