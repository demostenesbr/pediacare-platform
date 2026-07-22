import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('email')
export class EmailController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  send(@Body() payload: { to: string; subject: string; message: string }) {
    return this.notificationService.dispatch('email', payload);
  }
}
