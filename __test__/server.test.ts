import { Application } from 'express';
import supertest from 'supertest';
import App from '../src/server';
import { testLogger } from './helpers';

describe('[GET /]: Home route test', () => {
  let server: Application;

  beforeEach(() => {
    server = new App(testLogger).server;
  });

  test('should return status 200 and empty response body', async () => {
    const { statusCode, body } = await supertest(server).get('/');

    expect(statusCode).toBe(200);
    expect(body).toEqual({});
  });
});
