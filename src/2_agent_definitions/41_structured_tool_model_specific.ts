import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const getWeather = tool({
  name: "get_weather",
  description: "Return the weather for a given city.",
  parameters: z.object({ city: z.string(), country: z.string() }),
  async execute({ city, country }) {
    return `The weather in ${city}, ${country} is sunny.`;
  },
});

const agent = new Agent({
  name: "Weather bot",
  instructions: "You are a helpful weather bot.",
  model: "gpt-5.5",
  tools: [getWeather],
});

const result = await run(
  agent,
  "What is the weather in Tokyo?",
);

console.log(result.finalOutput);

// The output depends on the model used.
// For example, gpt-5.5 will return the weather in Tokyo, Japan.
// For example, gpt-4o-mini will return the weather in Tokyo.
