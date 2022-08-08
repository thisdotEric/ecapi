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
      email: 'email',
      password: 'password',
      confirm_password: 'password',
    };
  });

  describe('user has provided NULL request body', () => {
    test('should send a status of 400', async () => {
      const req: Partial<Request> = {
        body: null,
      };

      // @ts-ignore
      await validateCreateUserInput(req, res, next);

      expect(res.sendStatus).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('user has provided VALID request body', () => {
    test("should call the 'next' function", async () => {
      const req: Partial<Request> = {
        body,
      };

      jest.spyOn(CreateUserInputSchema, 'parse').mockReturnValue(body);
      emailSchema.parse = jest.fn().mockResolvedValue('');

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

      jest.spyOn(CreateUserInputSchema, 'parse').mockReturnValue(req_body);
      emailSchema.parse = jest.fn().mockResolvedValue('');

      // @ts-ignore
      await validateCreateUserInput(req, res, next);

      expect(res.sendStatus).not.toHaveBeenCalledWith(400);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Password does not match');
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("user has provided request body with ATLEAST ONE property has a value of '' or null", () => {
    test("should send status of 400 and 'Invalid request body form' message", async () => {
      const req: Partial<Request> = {
        body: {
          name: 'null',
          email: '',
          password: null,
          confirm_password: 'password1',
        },
      };

      CreateUserInputSchema.parse = jest.fn().mockReturnValue(undefined);
      emailSchema.parse = jest.fn().mockReturnValue('');

      // @ts-ignore
      await validateCreateUserInput(req, res, next);

      expect(res.sendStatus).not.toHaveBeenCalledWith(400);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid request body form');
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('user has provided an INVALID email', () => {
    test("should send status of 400 and 'Invalid email' message", async () => {
      const req_body = {
        ...body,
        email: 'john@gmail.com',
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      CreateUserInputSchema.parse = jest.fn().mockReturnValue(req_body);
      emailSchema.parse = jest.fn().mockReturnValue('');

      // @ts-ignore
      await validateCreateUserInput(req, res, next);

      expect(res.sendStatus).not.toHaveBeenCalledWith(400);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid email');
      expect(next).not.toHaveBeenCalled();
    });
  });
});
