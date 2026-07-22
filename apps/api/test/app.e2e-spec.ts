import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.status).toBe('ok');
      });
  });

  it('/content CRUD flow', async () => {
    const created = await request(app.getHttpServer())
      .post('/content')
      .send({
        title: 'Post para LinkedIn com agentes de IA',
        summary: 'Resumo curto para demonstrar o fluxo de CRUD e API.',
        body: 'Corpo do conteudo com explicacao da arquitetura, DTO e infraestrutura.',
        channel: 'linkedin',
        tags: ['linkedin', 'ia', 'mvp'],
      })
      .expect(201);

    const id = created.body.id;

    await request(app.getHttpServer())
      .get('/content')
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body)).toBe(true);
      });

    await request(app.getHttpServer())
      .patch(`/content/${id}`)
      .send({ title: 'Post atualizado para LinkedIn' })
      .expect(200)
      .expect((response) => {
        expect(response.body.title).toBe('Post atualizado para LinkedIn');
      });

    await request(app.getHttpServer())
      .delete(`/content/${id}`)
      .expect(200)
      .expect({ deleted: true, id });
  });

  afterEach(async () => {
    await app.close();
  });
});
