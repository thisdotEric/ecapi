import { Request, Response } from 'express';
import ProductController from '../../../src/modules/product/product.controller';
import { IProductService } from '../../../src/modules/product/product.interface';
import { ICreatedProduct } from '../../../src/modules/product/product.model';
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
});
