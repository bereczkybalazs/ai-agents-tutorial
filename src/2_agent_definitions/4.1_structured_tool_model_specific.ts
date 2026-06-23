import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const getWeather = tool({
  name: "get_weather",
  description: "Return the weather for a given city.",
  parameters: z.object({ city: z.string(), country: z.string() }),
  async execute({ city, country }) {
    console.log(`Executing get_weather with city: ${city} and country: ${country}`);
    const output = `The weather in ${city}, ${country} is sunny.`;
    console.log(`Output: ${output}`);
    return output;
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

// The output depends on the model used.
// For example, gpt-5.5 will return the weather in Tokyo, Japan.
// For example, gpt-4o-mini will return the weather in Tokyo.
// The output depends on the model used

// The tool prameters are
// For gpt-5.5, the tool parameters are Executing get_weather with city: Tokyo and country: Japan
// For gpt-4o-mini, the tool parameters are Executing get_weather with city: Tokyo and country: JP
