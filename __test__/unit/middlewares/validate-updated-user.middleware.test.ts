import {
  UpdatedUserSchema,
  mustBeValidUpdatedUser,
} from '../../../src/middlewares/validate-updated-user.middleware';
import { Request, Response } from 'express';

describe('mustBeValidUpdatedUser middleware', () => {
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

  describe('user has provided a valid user details', () => {
    test("should call the 'next' function", async () => {
      const req_body = {
        name: 'name',
        description: 'email@gmail.com',
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      UpdatedUserSchema.safeParse = jest
        .fn()
        .mockReturnValue({ success: true });

      // @ts-ignore
      await mustBeValidUpdatedUser(req, res, next);

      expect(res.send).not.toHaveBeenCalledWith('Invalid updated user details');
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('user has provided an INVALID  product details', () => {
    test("should return status of 400 and 'Invalid updated user details' message", async () => {
      const req_body = {
        name: 12,
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      UpdatedUserSchema.safeParse = jest
        .fn()
        .mockReturnValue({ success: false });

      // @ts-ignore
      await mustBeValidUpdatedUser(req, res, next);

      expect(res.send).toHaveBeenCalledWith('Invalid updated user details');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
