import type { ContentRecord, CreateContentInput } from '../types/content';

export class ContentClient {
  constructor(private readonly baseUrl: string) {}

  async list(channel?: 'linkedin' | 'medium'): Promise<ContentRecord[]> {
    const suffix = channel ? `?channel=${channel}` : '';
    const response = await fetch(`${this.baseUrl}/content${suffix}`);
    if (!response.ok) {
      throw new Error(`Failed to list content: ${response.status}`);
    }
    return response.json();
  }

  async create(input: CreateContentInput): Promise<ContentRecord> {
    const response = await fetch(`${this.baseUrl}/content`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`Failed to create content: ${response.status}`);
    }

    return response.json();
  }
}
