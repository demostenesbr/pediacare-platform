import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiMetadata() {
    return {
      name: 'pediacare-platform-api',
      version: '1.0.0',
      docs: '/api/docs',
      modules: ['content-crud', 'agent-support'],
    };
  }

  getHealth() {
    return {
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString(),
    };
  }
}
