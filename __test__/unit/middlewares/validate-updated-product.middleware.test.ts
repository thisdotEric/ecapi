import { mustBeValidUpdatedProduct } from '../../../src/middlewares';
import { UpdatedProductSchema } from '../../../src/middlewares/validate-updated-product.middleware';
import { Request, Response } from 'express';

describe('mustBeValidUpdatedProduct middleware', () => {
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
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      UpdatedProductSchema.safeParse = jest
        .fn()
        .mockReturnValue({ success: true });

      // @ts-ignore
      await mustBeValidUpdatedProduct(req, res, next);

      expect(res.send).not.toHaveBeenCalledWith('Invalid product details');
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('user has provided an INVALID  product details', () => {
    test("should return status of 400 and 'Invalid/Incomplete product details' message", async () => {
      const req_body = {
        name: 'product',
        tags: 60,
      };

      const req: Partial<Request> = {
        body: req_body,
      };

      UpdatedProductSchema.safeParse = jest
        .fn()
        .mockReturnValue({ success: false });

      // @ts-ignore
      await mustBeValidUpdatedProduct(req, res, next);

      expect(res.send).toHaveBeenCalledWith('Invalid product details');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
