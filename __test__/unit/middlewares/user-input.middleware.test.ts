import { Request, Response } from 'express';
import { validateCreateUserInput } from '../../../src/middlewares';
import {
  CreateUserInputSchema,
  emailSchema,
} from '../../../src/middlewares/user-input.middleware';
import { z } from 'zod';

describe('validateCreateUserInput middleware', () => {
  let res: Partial<Response>;
  let next: jest.Mock;

  let body: z.infer<typeof CreateUserInputSchema>;

  beforeEach(() => {
    res = {
      status: jest.fn(),
      sendStatus: jest.fn(),
      send: jest.fn(),
    };

    next = jest.fn();

    body = {
      name: 'name',
      email: 'valid@gmail.com',
      password: 'password',
      confirm_password: 'password',
    };
  });

  describe('user has provided VALID request body', () => {
    test("should call the 'next' function", async () => {
      const req: Partial<Request> = {
        body,
      };

      jest.spyOn(CreateUserInputSchema, 'parse').mockReturnValue(body);
      CreateUserInputSchema.safeParse = jest
        .fn()
        .mockReturnValue({ success: true });
      emailSchema.parse = jest.fn().mockReturnValue('valid@gmail.com');

      // @ts-ignore
      await validateCreateUserInput(req, res, next);

      expect(res.sendStatus).not.toHaveBeenCalledWith(400);
      expect(res.status).not.toHaveBeenCalledWith(400);
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('user has provided request body with UNMATCHING passwords', () => {
    test("should send status of 400 and 'Password does not match' message", async () => {
      const req_body = {
        ...body,
        confirm_password: 'password1',
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      CreateUserInputSchema.safeParse = jest
        .fn()
        .mockReturnValue({ success: true });
      jest.spyOn(CreateUserInputSchema, 'parse').mockReturnValue(req_body);

      // @ts-ignore
      await validateCreateUserInput(req, res, next);

      expect(res.sendStatus).not.toHaveBeenCalledWith(400);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Password does not match');
      expect(next).not.toHaveBeenCalled();
    });
  });
});
