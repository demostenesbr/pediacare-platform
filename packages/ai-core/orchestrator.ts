export type AgentStep = {
  id: string;
  agent: string;
  run: (input: string) => Promise<string>;
};

export async function runPipeline(initialDraft: string, steps: AgentStep[]) {
  let cursor = initialDraft;
  const trace: Record<string, string> = {};

  for (const step of steps) {
    cursor = await step.run(cursor);
    trace[step.id] = cursor;
  }

  return {
    finalOutput: cursor,
    trace,
  };
}
