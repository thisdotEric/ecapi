import { Request, Response } from 'express';
import ProductController from '../../../src/modules/product/product.controller';
import { IProductService } from '../../../src/modules/product/product.interface';
import { ICreatedProduct } from '../../../src/modules/product/product.model';
import { createProductInput } from '../../helpers';

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

        const mockedProductService: IProductService = {
          create: jest.fn().mockReturnValue(newProduct),
        };
        const productController = new ProductController(mockedProductService);

        const req: Partial<Request> = {
          body: productInput,
        };

        // @ts-ignore
        await productController.create(req, res);

        expect(req.body).not.toBe(null);
        expect(res.json).toHaveBeenCalledWith(newProduct);
        expect(res.status).toHaveBeenCalledWith(201);
      });
    });
  });
});
