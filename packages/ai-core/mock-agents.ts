import { AgentStep } from './orchestrator';

function withTag(tag: string): AgentStep['run'] {
  return async (input: string) => `[${tag}] ${input}`;
}

export const mockPipelineSteps: AgentStep[] = [
  { id: 'content', agent: 'content-agent', run: withTag('content-structured') },
  { id: 'seo', agent: 'seo-agent', run: withTag('seo-optimized') },
  { id: 'legal', agent: 'legal-agent', run: withTag('legal-reviewed') },
];
