
import { Agent, run } from "@openai/agents";
import OpenAI from "openai";

const agent = new Agent({
  name: "Assistant",
  instructions: "Reply very concisely.",
  model: "gpt-5.4-nano",
});

const client = new OpenAI();
const { id: conversationId } = await client.conversations.create({});

console.log(`Conversation ID: ${conversationId}`);

const first = await run(agent, "What city is the Golden Gate Bridge in?", {
  conversationId,
});
console.log(first.finalOutput);

const second = await run(agent, "What state is it in?", {
  conversationId,
});
console.log(second.finalOutput);
