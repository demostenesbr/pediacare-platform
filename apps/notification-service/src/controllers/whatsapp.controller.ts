import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('whatsapp')
export class WhatsAppController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post('send')
    send(@Body() payload: { to: string; message: string }) {
        return this.notificationService.dispatch('whatsapp', payload);
    }
}