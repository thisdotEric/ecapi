import {
  ICreatedProduct,
  IProduct,
} from '../../../src/modules/product/product.model';
import ProductService, {
  ProductModelType,
} from '../../../src/modules/product/product.service';
import { createProductInput } from '../../helpers';

describe('Product service test', () => {
  describe('create()', () => {
    describe("user has provided complete product and the owners' user_id", () => {
      test('should save and return the newly created product', async () => {
        const product: IProduct = createProductInput();
        const user_id = 'user_id';
        const product_id = 'product_id';

        const expectedProduct: ICreatedProduct = {
          product_id,
          ...product,
        };

        const mockProductModel: Partial<ProductModelType> = {
          create: jest
            .fn()
            .mockReturnValue({ _id: product_id, ...expectedProduct }),
        };

        // @ts-ignore
        const productService = new ProductService(mockProductModel);
        const createdProduct = await productService.create(user_id, product);

        expect(mockProductModel.create).toHaveBeenCalledWith({
          ...product,
          user_id,
        });
        expect(createdProduct).toStrictEqual(expectedProduct);
      });
    });

    describe("user has provided complete product but EMPTY/NULL owners' user_id", () => {
      test('should save and return the newly created product', async () => {
        const product: IProduct = createProductInput();
        const user_id = 'user_id';
        const product_id = 'product_id';

        const expectedProduct: ICreatedProduct = {
          product_id,
          ...product,
        };

        const mockProductModel: Partial<ProductModelType> = {
          create: jest
            .fn()
            .mockReturnValue({ _id: product_id, ...expectedProduct }),
        };

        // @ts-ignore
        const productService = new ProductService(mockProductModel);
        const createdProduct = await productService.create(user_id, product);

        expect(mockProductModel.create).toHaveBeenCalledWith({
          ...product,
          user_id,
        });
        expect(createdProduct).toStrictEqual(expectedProduct);
      });
    });
  });

  describe('get()', () => {
    describe('user has provided product_id and user_id', () => {
      test('should return the product based on the product_id', async () => {
        const product: IProduct = createProductInput();
        const user_id = 'user_id';
        const product_id = 'product_id';

        const expectedProduct: ICreatedProduct = {
          product_id,
          ...product,
        };

        const mockProductModel: Partial<ProductModelType> = {
          findOne: jest
            .fn()
            .mockReturnValue({ _id: product_id, ...expectedProduct }),
        };

        // @ts-ignore
        const productService = new ProductService(mockProductModel);
        const returnedProduct = await productService.get(user_id, product_id);

        expect(mockProductModel.findOne).toHaveBeenCalled();
        expect(returnedProduct).toStrictEqual(expectedProduct);
      });
    });

    describe('user has provided an INVALID product_id OR user_id', () => {
      test("should throw an error 'Product not found'", async () => {
        const user_id = '';
        const product_id = '';

        const mockProductModel: Partial<ProductModelType> = {
          findOne: jest.fn().mockReturnValue(null),
        };

        // @ts-ignore
        const productService = new ProductService(mockProductModel);

        try {
          await productService.get(user_id, product_id);
        } catch (error) {
          expect(mockProductModel.findOne).toHaveBeenCalled();
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Product not found');
        }
      });
    });
  });

  describe('getAll()', () => {
    describe('user has provided user_id', () => {
      test('should return ALL the products based on the product_id', async () => {
        const product: IProduct = createProductInput();
        const user_id = 'user_id';
        const product_id = 'product_id';

        const expectedProducts: ICreatedProduct[] = [
          {
            product_id,
            ...product,
          },
        ];

        const mockProductModel: Partial<ProductModelType> = {
          find: jest.fn().mockReturnValue([{ _id: product_id, ...product }]),
        };

        // @ts-ignore
        const productService = new ProductService(mockProductModel);
        const returnedProducts = await productService.getAll(user_id);

        expect(mockProductModel.find).toHaveBeenCalledWith({ user_id });
        expect(returnedProducts).toStrictEqual(expectedProducts);
      });
    });

    // describe('user has provided an INVALID product_id OR user_id', () => {
    //   test("should throw an error 'Product not found'", async () => {
    //     const user_id = '';
    //     const product_id = '';

    //     const mockProductModel: Partial<ProductModelType> = {
    //       findOne: jest.fn().mockReturnValue(null),
    //     };

    //     // @ts-ignore
    //     const productService = new ProductService(mockProductModel);

    //     try {
    //       await productService.get(user_id, product_id);
    //     } catch (error) {
    //       expect(mockProductModel.findOne).toHaveBeenCalled();
    //       expect(error).toBeInstanceOf(Error);
    //       expect(error.message).toBe('Product not found');
    //     }
    //   });
    // });
  });

  describe('delete()', () => {
    describe('user has provided a valid product_id', () => {
      test('should delete the product and return true', async () => {
        const product_id = 'product_id';
        const user_id = 'user_id';

        const mockProductModel: Partial<ProductModelType> = {
          findOneAndDelete: jest
            .fn()
            .mockReturnValue({ _id: product_id, ...createProductInput() }),
        };

        // @ts-ignore
        const productService = new ProductService(mockProductModel);
        const deleted = await productService.delete(user_id, product_id);

        expect(mockProductModel.findOneAndDelete).toHaveBeenCalledWith({
          _id: product_id,
          user_id,
        });
        expect(deleted).toBeTruthy();
      });
    });

    describe('user has provided an INVALID product_id', () => {
      test("should throw an error 'Product not found'", async () => {
        const product_id = '';
        const user_id = '';

        const mockProductModel: Partial<ProductModelType> = {
          findOneAndDelete: jest.fn().mockReturnValue(null),
        };

        // @ts-ignore
        const productService = new ProductService(mockProductModel);

        try {
          await productService.delete(user_id, product_id);
        } catch (error) {
          expect(mockProductModel.findOneAndDelete).toHaveBeenCalledWith({
            _id: product_id,
            user_id,
          });
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Product not found');
        }
      });
    });
  });

  describe('update()', () => {
    describe('user has provided a valid user_id, product_id and fields of the product to be updated', () => {
      test('should update and return the updated product informations', async () => {
        const product_id = 'product_id';
        const user_id = 'user_id';

        const productToBeUpdated: Partial<IProduct> = {
          name: 'new name',
          description: 'updated description',
        };

        const returnedUpdatedProduct: ICreatedProduct = {
          product_id: product_id,
          ...createProductInput(),
          ...productToBeUpdated,
        };

        const mockProductModel: Partial<ProductModelType> = {
          findOneAndUpdate: jest.fn().mockReturnValue({
            _id: product_id,
            ...createProductInput(),
            ...productToBeUpdated,
          }),
        };

        // @ts-ignore
        const productService = new ProductService(mockProductModel);
        const updatedProduct = await productService.update(
          user_id,
          product_id,
          productToBeUpdated
        );

        expect(updatedProduct).not.toBe(null);
        expect(returnedUpdatedProduct).toStrictEqual(updatedProduct);
        expect(mockProductModel.findOneAndUpdate).toHaveBeenCalledWith(
          {
            _id: product_id,
            user_id,
          },
          { ...productToBeUpdated },
          { returnDocument: 'after' }
        );
      });
    });
  });
});
