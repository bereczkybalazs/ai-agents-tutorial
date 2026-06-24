import { Agent, handoff, run } from '@openai/agents';

const billingAgent = new Agent({ name: 'Billing agent' });
const refundAgent = new Agent({ name: 'Refund agent' });

const triageAgent = Agent.create({
  name: 'Triage agent',
  model: 'gpt-5.4-nano',
  handoffs: [billingAgent, handoff(refundAgent)],
});

const result = await run(
  triageAgent,
  'The student is having trouble with their history homework.',
);

console.log(result.lastAgent?.name);
console.log(result.finalOutput);


const billingResult = await run(
  billingAgent,
  'The student is having trouble with their billing.',
);

console.log(billingResult.lastAgent?.name);
console.log(billingResult.finalOutput);


