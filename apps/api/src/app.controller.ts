import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API metadata' })
  getRoot() {
    return this.appService.getApiMetadata();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return this.appService.getHealth();
  }
}
