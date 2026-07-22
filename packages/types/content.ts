export type ContentChannel = 'linkedin' | 'medium';

export type ContentRecord = {
  id: string;
  title: string;
  summary: string;
  body: string;
  channel: ContentChannel;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateContentInput = {
  title: string;
  summary: string;
  body: string;
  channel: ContentChannel;
  tags?: string[];
};
