import { mustHaveValidLoginInput } from '../../../src/middlewares';
import { LoginInputSchema } from '../../../src/middlewares/login-user-input.middleware';
import { Request, Response } from 'express';

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

      LoginInputSchema.safeParse = jest.fn().mockReturnValue({ success: true });

      // @ts-ignore
      await mustHaveValidLoginInput(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(400);
      expect(res.send).not.toHaveBeenCalledWith(
        'Invalid password or email form'
      );
    });
  });

  describe('user has provided INVALID email and password form', () => {
    test("should return status 400 and 'Error parsing login input' message", async () => {
      const req_body = {
        email: 'email',
        password: '',
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      LoginInputSchema.safeParse = jest
        .fn()
        .mockReturnValue({ success: false });

      // @ts-ignore
      await mustHaveValidLoginInput(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid password or email form');
    });
  });
});
