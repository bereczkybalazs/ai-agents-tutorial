import { Agent, InputGuardrailTripwireTriggered, run } from '@openai/agents';
import { z } from 'zod';

const guardrailAgent = new Agent({
  name: 'Homework check',
  model: 'gpt-5.4-nano',
  instructions: 'Detect whether the user is asking for math homework help.',
  outputType: z.object({
    isMathHomework: z.boolean(),
    reasoning: z.string(),
  }),
});

const agent = new Agent({
  name: 'Customer support',
  instructions: 'Help customers with support questions.',
  model: 'gpt-5.4-nano',
  inputGuardrails: [
    {
      name: 'Math homework guardrail',
      runInParallel: false,
      async execute({ input, context }) {
        const result = await run(guardrailAgent, input, { context });
        return {
          outputInfo: result.finalOutput,
          tripwireTriggered: result.finalOutput?.isMathHomework === true,
        };
      },
    },
  ],
});


const historyResult = await run(agent, 'Can you tell me who is the president of the United States?');
console.log(historyResult.finalOutput);

try {
  const mathResult = await run(agent, 'Can you solve 2x + 3 = 11 for me?');
  console.log(mathResult.finalOutput);
} catch (error) {
  if (error instanceof InputGuardrailTripwireTriggered) {
    console.log('Guardrail blocked the request.');
  }
}
