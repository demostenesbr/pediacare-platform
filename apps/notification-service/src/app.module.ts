import { Module } from '@nestjs/common';
import { EmailController } from './controllers/email.controller';
import { HealthController } from './controllers/health.controller';
import { PushController } from './controllers/push.controller';
import { SmsController } from './controllers/sms.controller';
import { WhatsAppController } from './controllers/whatsapp.controller';
import { NotificationService } from './services/notification.service';

@Module({
  controllers: [HealthController, EmailController, SmsController, PushController, WhatsAppController],
  providers: [NotificationService],
})
export class AppModule {}
