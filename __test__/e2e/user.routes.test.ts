import supertest from 'supertest';
import { Application } from 'express';
import App from '../../src/server';
import { createUserInput, testLogger } from '../helpers';

const USER_ROUTE = '/users';

describe('User routes test', () => {
  describe('[POST /users]: Create new user', () => {
    let server: Application;

    beforeEach(() => {
      server = new App(testLogger).server;
    });

    describe('user has provided name, email, password and confirm password on the request body', () => {
      test('should return status 200 and newly created user', async () => {
        const userInput = createUserInput();

        const { statusCode } = await supertest(server)
          .post(USER_ROUTE)
          .send(userInput);

        expect(statusCode).toBe(200);
      });
    });

    describe('user has provided an incomplete request body', () => {
      test('should return status 400', async () => {
        const { statusCode, text } = await supertest(server)
          .post(USER_ROUTE)
          .send({
            name: '',
            email: '',
            password: 'pass',
            confirm_password: 'pass',
          });

        expect(statusCode).toBe(400);
        expect(text).toBe('Null or empty values not allowed');
      });
    });

    describe('user has provided different passwords', () => {
      test('should return status 400', async () => {
        const { statusCode, text } = await supertest(server)
          .post(USER_ROUTE)
          .send({
            ...createUserInput(),
            confirm_password: 'pass1',
          });

        expect(statusCode).toBe(400);
        expect(text).toBe('Password does not match');
      });
    });
  });
});
