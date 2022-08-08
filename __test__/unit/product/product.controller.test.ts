import { Request, Response } from 'express';
import ProductController from '../../../src/modules/product/product.controller';
import { IProductService } from '../../../src/modules/product/product.interface';
import {
  ICreatedProduct,
  IProduct,
} from '../../../src/modules/product/product.model';
import { createProductInput } from '../../helpers';

type User = {
  user: {
    user_id: string;
  };
};

describe('Product controller test', () => {
  const res: Partial<Response> = {
    json: jest.fn().mockImplementation((data) => data),
    sendStatus: jest.fn(),
    status: jest.fn(),
    send: jest.fn(),
  };

  describe('create()', () => {
    describe('user has provided complete details of the product to be added', () => {
      test('should return the newly created product and status code 201', async () => {
        const productInput = createProductInput();

        const newProduct: ICreatedProduct = {
          product_id: 'newproduct_id',
          ...productInput,
        };

        const mockedProductService: Partial<IProductService> = {
          create: jest.fn().mockReturnValue(newProduct),
        };

        // @ts-ignore
        const productController = new ProductController(mockedProductService);

        const req: Partial<Request & User> = {
          body: productInput,
          user: {
            user_id: 'user_id',
          },
        };

        // @ts-ignore
        await productController.create(req, res);

        expect(req.body).not.toBe(null);
        expect(res.json).toHaveBeenCalledWith(newProduct);
        expect(res.status).toHaveBeenCalledWith(201);
      });
    });
  });

  describe('get()', () => {
    describe('user has provided product id', () => {
      test('should return the product associated with the product_id and status code 200', async () => {
        const productInput = createProductInput();
        const product_id = 'product_id';
        const user_id = 'user_id';

        const product: ICreatedProduct = {
          product_id,
          ...productInput,
        };

        const mockedProductService: Partial<IProductService> = {
          get: jest.fn().mockReturnValue(product),
        };

        // @ts-ignore
        const productController = new ProductController(mockedProductService);

        const req: Partial<Request & User> = {
          params: {
            product_id,
          },
          user: {
            user_id,
          },
        };

        // @ts-ignore
        await productController.get(req, res);

        expect(req.params).not.toBe(null);
        expect(mockedProductService.get).toHaveBeenLastCalledWith(
          req.user!.user_id,
          req.params!.product_id
        );
        expect(res.json).toHaveBeenCalledWith(product);
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });
  });

  describe('getAll()', () => {
    describe('user has a valid user_id', () => {
      test('should return ALL the products associated to the given user_id', async () => {
        const products = [createProductInput(), createProductInput()];
        const user_id = 'user_id';

        const mockedProductService: Partial<IProductService> = {
          getAll: jest.fn().mockReturnValue(products),
        };

        // @ts-ignore
        const productController = new ProductController(mockedProductService);

        const req: Partial<Request & User> = {
          user: {
            user_id,
          },
        };

        // @ts-ignore
        await productController.getAll(req, res);

        expect(mockedProductService.getAll).toHaveBeenLastCalledWith(
          req.user!.user_id
        );
        expect(res.json).toHaveBeenCalledWith(products);
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });
  });

  describe('delete()', () => {
    describe('user has a valid user_id and product_id', () => {
      test('should delete the product and send 200 status code', async () => {
        const mockedProductService: Partial<IProductService> = {
          delete: jest.fn().mockReturnValue(true),
        };

        // @ts-ignore
        const productController = new ProductController(mockedProductService);

        const req: Partial<Request & User> = {
          params: {
            product_id: 'product_id',
          },
          user: {
            user_id: 'user_id',
          },
        };

        // @ts-ignore
        await productController.delete(req, res);

        expect(mockedProductService.delete).toHaveBeenLastCalledWith(
          req.user!.user_id,
          req.params!.product_id
        );
        expect(res.json).not.toHaveBeenCalledWith();
      });
    });

    describe('user has provided an invalid product_id', () => {
      test('should send status of 404 not found', async () => {
        const mockedProductService: Partial<IProductService> = {
          delete: jest.fn().mockReturnValue(false),
        };

        // @ts-ignore
        const productController = new ProductController(mockedProductService);

        const req: Partial<Request & User> = {
          params: {
            product_id: 'product_id',
          },
          user: {
            user_id: 'user_id',
          },
        };

        try {
          // @ts-ignore
          await productController.delete(req, res);
        } catch (error) {
          expect(mockedProductService.delete).toHaveBeenLastCalledWith(
            req.params!.product_id
          );
          expect(res.json).not.toHaveBeenCalledWith();
          expect(res.sendStatus).not.toHaveBeenCalledWith();
          expect(res.status).toHaveBeenCalledWith(404);
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Product not found');
        }
      });
    });
  });

  describe('update()', () => {
    describe('user has a valid product_id and fields to be updated on the request body', () => {
      test('should update and return rhe product then send 200 status code', async () => {
        const product_id = 'product_id';
        const user_id = 'user_id';
        const product = createProductInput();

        const productInput: Partial<IProduct> = {
          name: 'Jag',
        };

        const updatedProduct: ICreatedProduct = {
          product_id,
          ...product,

          // Spread the updated product
          ...productInput,
        };

        const mockedProductService: Partial<IProductService> = {
          update: jest.fn().mockReturnValue(updatedProduct),
        };

        // @ts-ignore
        const productController = new ProductController(mockedProductService);

        const req: Partial<Request & User> = {
          params: {
            product_id,
          },
          user: {
            user_id,
          },
          body: productInput,
        };

        // @ts-ignore
        await productController.update(req, res);

        expect(mockedProductService.update).toHaveBeenLastCalledWith(
          req.user!.user_id,
          req.params!.product_id,
          req.body
        );
        expect(res.json).toHaveBeenCalledWith(updatedProduct);
      });
    });
  });
});
