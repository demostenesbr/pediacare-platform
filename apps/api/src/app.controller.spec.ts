import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API metadata', () => {
      const result = appController.getRoot();
      expect(result.name).toBe('pediacare-platform-api');
      expect(result.docs).toBe('/api/docs');
    });

    it('should return health payload', () => {
      const health = appController.getHealth();
      expect(health.status).toBe('ok');
      expect(health.service).toBe('api');
    });
  });
});
