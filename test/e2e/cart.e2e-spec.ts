import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CartController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/cart (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/cart')
      .send({ userId: 'test-user' })
      .expect(200);
  });

  it('/api/cart/items (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/cart/items')
      .send({
        userId: 'test-user',
        sku: 'SKU123',
        quantity: 2,
      })
      .expect(201);
  });
});
