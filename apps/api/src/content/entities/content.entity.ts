export class ContentEntity {
  id: string;
  title: string;
  summary: string;
  body: string;
  channel: 'linkedin' | 'medium';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
