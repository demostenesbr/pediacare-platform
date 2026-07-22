import { Body, Controller, Get, Post } from '@nestjs/common';
import { AiService } from '../services/ai.service';

type RewritePayload = {
  draft: string;
  channel: 'linkedin' | 'medium';
};

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('health')
  health() {
    return { status: 'ok', service: 'ai-service', timestamp: new Date().toISOString() };
  }

  @Post('rewrite')
  rewrite(@Body() payload: RewritePayload) {
    return this.aiService.rewriteForChannel(payload.draft, payload.channel);
  }
}
