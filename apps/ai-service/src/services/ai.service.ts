import { Injectable } from '@nestjs/common';
import { aiConfig } from '../config/ai.config';

@Injectable()
export class AiService {
  rewriteForChannel(draft: string, channel: 'linkedin' | 'medium') {
    const opening = channel === 'linkedin' ? 'Post de impacto:' : 'Artigo tecnico:';

    return {
      model: aiConfig.model,
      channel,
      output: `${opening} ${draft}`,
    };
  }
}
