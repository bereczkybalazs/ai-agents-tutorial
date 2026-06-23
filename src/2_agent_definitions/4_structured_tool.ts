import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const getWeather = tool({
  name: "get_weather",
  description: "Return the weather for a given city.",
  parameters: z.object({ city: z.string() }),
  async execute({ city }) {
    return `The weather in ${city} is sunny.`;
  },
});

const agent = new Agent({
  name: "Weather bot",
  instructions: "You are a helpful weather bot.",
  model: "gpt-4o-mini",
  tools: [getWeather],
});

const result = await run(
  agent,
  "What is the weather in Tokyo?",
);

console.log(result.finalOutput);
