
import { Agent, Runner } from "@openai/agents";

const quickFactAgent = new Agent({
  name: "Quick travel fact",
  instructions: "Give one compact travel fact in a single sentence.",
  model: "gpt-5.4-nano",
});

const itineraryAgent = new Agent({
  name: "Weekend itinerary planner",
  instructions:
    "Outline a short weekend plan as three bullet points: morning, afternoon, evening.",
});

const runner = new Runner({
  model: "gpt-5.5",
});

const quickResult = await runner.run(
  quickFactAgent,
  "What city is the Golden Gate Bridge in?",
);
console.log(quickResult.finalOutput);

const itineraryResult = await runner.run(
  itineraryAgent,
  "Plan a two-day weekend in San Francisco for a first-time visitor.",
);
console.log(itineraryResult.finalOutput);

// Model fallback priority
// 1. The model specified in the Agent constructor, it overwrites the model specified in the Runner constructor.
// 2. The model specified in the Runner constructor, it overwrites the default model from OPENAI_DEFAULT_MODEL.
// 3. The default model from OPENAI_DEFAULT_MODEL.
