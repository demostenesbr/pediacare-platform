import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  dispatch(channel: 'email' | 'sms' | 'push' | 'whatsapp', payload: Record<string, string>) {
    return {
      accepted: true,
      channel,
      payload,
      timestamp: new Date().toISOString(),
    };
  }
}
