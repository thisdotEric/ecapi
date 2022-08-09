import { mustBeValidProduct, ProductSchema } from '../../../src/middlewares';
import { Request, Response } from 'express';

describe('mustBeValidProduct middleware', () => {
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

  describe('user has provided a valid product details', () => {
    test("should call the 'next' function", async () => {
      const req_body = {
        name: 'product',
        description: 'description',
        price: 10,
        tags: ['product'],
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      ProductSchema.safeParse = jest.fn().mockReturnValue({ success: true });

      // @ts-ignore
      await mustBeValidProduct(req, res, next);

      expect(res.send).not.toHaveBeenCalledWith(
        'Invalid/Incomplete product details'
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('user has provided an INVALID  product details', () => {
    test("should return status of 400 and 'Invalid/Incomplete product details' message", async () => {
      const req_body = {
        name: 'product',
        description: 50,
        price: 'invalidprice',
        tags: 60,
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      ProductSchema.safeParse = jest.fn().mockReturnValue({ success: false });

      // @ts-ignore
      await mustBeValidProduct(req, res, next);

      expect(res.send).toHaveBeenCalledWith(
        'Invalid/Incomplete product details'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
