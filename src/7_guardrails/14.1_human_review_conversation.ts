import { Agent, run, RunState, tool } from '@openai/agents';
import OpenAI from 'openai';
import { z } from 'zod';

const cancelOrder = tool({
  name: 'cancel_order',
  description: 'Cancel a customer order.',
  parameters: z.object({ orderId: z.number() }),
  needsApproval: true,
  async execute({ orderId }) {
    return `Cancelled order ${orderId}`;
  },
});

const agent = new Agent({
  name: 'Support agent',
  instructions: 'Handle support requests and ask for approval when needed.',
  model: 'gpt-5.4-nano',
  tools: [cancelOrder],
});

async function startAgentRun(conversationId: string) {
  return run(agent, 'Cancel order 123.', { conversationId });
}

type AgentRunResult = Awaited<ReturnType<typeof startAgentRun>>;

type PendingReview = {
  conversationId: string;
  serializedState: string;
  interruptions: NonNullable<AgentRunResult['interruptions']>;
};

const pendingReviews = new Map<string, PendingReview>();

function queuePendingReview(conversationId: string, result: AgentRunResult) {
  if (!result.interruptions?.length) {
    return;
  }

  pendingReviews.set(conversationId, {
    conversationId,
    serializedState: result.state.toString(),
    interruptions: result.interruptions,
  });

  for (const interruption of result.interruptions) {
    console.log(
      `Pending review queued for conversation ${conversationId}: ${interruption.name}(${interruption.arguments})`,
    );
  }
}

async function adminApproveByConversationId(conversationId: string) {
  const pending = pendingReviews.get(conversationId);
  if (!pending) {
    throw new Error(`No pending review for conversation ${conversationId}`);
  }

  console.log(`Admin approving conversation ${conversationId}`);

  const state = await RunState.fromString(agent, pending.serializedState);
  for (const interruption of pending.interruptions) {
    state.approve(interruption);
  }

  pendingReviews.delete(conversationId);

  return run(agent, state, { conversationId });
}

const client = new OpenAI();
const { id: conversationId } = await client.conversations.create({});

console.log(`Conversation ID: ${conversationId}`);

const initialResult = await startAgentRun(conversationId);

if (initialResult.interruptions?.length) {
  queuePendingReview(conversationId, initialResult);
  const resumedResult = await adminApproveByConversationId(conversationId);
  console.log(resumedResult.finalOutput);
} else {
  console.log(initialResult.finalOutput);
}
