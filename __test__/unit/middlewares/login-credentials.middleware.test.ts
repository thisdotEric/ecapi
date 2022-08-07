import { Request, Response } from 'express';
import { mustProvideValidLoginCredentials } from '../../../src/middlewares';

describe('mustProvideValidLoginCredentials middleware', () => {
  const res: Partial<Response> = {
    status: jest.fn(),
    sendStatus: jest.fn(),
    send: jest.fn(),
  };

  const next = jest.fn();

  describe('user has provided request body with complete email and password', () => {
    test("should call the 'next' function and proceed to the next middleware", async () => {
      const req: Partial<Request> = {
        body: {
          email: 'johndoe@gmail.com',
          password: 'password',
        },
      };

      // @ts-ignore
      await mustProvideValidLoginCredentials(req, res, next);

      expect(res.status).not.toHaveBeenCalledWith();
      expect(res.send).not.toHaveBeenCalledWith();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('user has provided NULL/EMPTY request body', () => {
    test("should return status 400 and 'Missing email and password' error message", async () => {
      const req: Partial<Request> = {
        body: null,
      };

      // @ts-ignore
      await mustProvideValidLoginCredentials(req, res, next);

      expect(req.body).toBe(null);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Missing email and password');
    });
  });

  describe('user has provided an INCOMPLETE request body', () => {
    test("should return status 400 and 'Incomplete login credentials' error message", async () => {
      const loginCredentials = {
        email: null,
        password: '',
      };

      const req: Partial<Request> = {
        body: loginCredentials,
      };

      // @ts-ignore
      await mustProvideValidLoginCredentials(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Incomplete login credentials');
    });
  });
});
