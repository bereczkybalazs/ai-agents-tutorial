
import { Agent, run } from "@openai/agents";

const summarizer = new Agent({
  name: "Summarizer",
  instructions: "Generate a 10 words summary of the supplied text.",
});

const agentWithSummarizer = new Agent({
  name: "Research assistant",
  tools: [
    summarizer.asTool({
      toolName: "summarize_text",
      toolDescription: "Generate a concise summary of the supplied text.",
    }),
  ],
});

console.log('Using summarizer as tool:');

const resultSummarized = await run(
  agentWithSummarizer,
  "Explain the causes, major events, and lasting impact of the French Revolution and summarize the result.",
);

console.log(resultSummarized.finalOutput);

console.log('--------------------------------');

const agentWithoutSummarizer = new Agent({
  name: "Research assistant",
});

console.log('Using no summarizer as tool:');

const resultUnsummarized = await run(
  agentWithoutSummarizer,
  "Explain the causes, major events, and lasting impact of the French Revolution and summarize the result.",
);

console.log(resultUnsummarized.finalOutput);