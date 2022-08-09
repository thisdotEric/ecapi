import { mustHaveValidLoginInput } from '../../../src/middlewares';
import { LoginInputSchema } from '../../../src/middlewares/login-user-input.middleware';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

describe('mustHaveValidLoginInput middleware', () => {
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    res = {
      status: jest.fn(),
      sendStatus: jest.fn(),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  describe('user has provided VALID email and password form', () => {
    test("should call the 'next' function", async () => {
      const req_body = {
        email: 'valid@gmail.com',
        password: 'VALIDpassword',
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      jest.spyOn(LoginInputSchema, 'parse').mockReturnValue(req_body);

      // @ts-ignore
      await mustHaveValidLoginInput(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('user has provided INVALID email and password form', () => {
    test("should return status 400 and 'Error parsing login input' message", async () => {
      const req_body = {
        email: 'invalidemail',
        password: '',
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      LoginInputSchema.parse = jest.fn().mockReturnValue(undefined);

      try {
        // @ts-ignore
        await mustHaveValidLoginInput(req, res, next);
      } catch (error) {
        expect(error).toBeInstanceOf(ZodError);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Invalid password or email form');
      }
    });
  });
});
