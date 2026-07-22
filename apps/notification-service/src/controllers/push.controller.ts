import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';

@Controller('push')
export class PushController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post('send')
    send(@Body() payload: { toDevice: string; title: string; message: string }) {
        return this.notificationService.dispatch('push', payload);
    }
}