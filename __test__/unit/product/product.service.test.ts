import {
  ICreatedProduct,
  IProduct,
} from '../../../src/modules/product/product.model';
import ProductService from '../../../src/modules/product/product.service';

describe('Product service test', () => {
  describe('create()', () => {
    describe("user has provided complete product and the owners' user_id", () => {
      test('should save and return the newly created product', async () => {
        const productService = new ProductService();
        const user_id = 'user_id';

        const product: IProduct = {
          name: 'product',
          description: 'description',
          price: 10.22,
          tags: ['tag1', ' tag2'],
        };

        const expectedProduct: ICreatedProduct = {
          ...product,
          product_id: expect.any(String),
        };

        const createdProduct = await productService.create(user_id, product);

        expect(createdProduct).toStrictEqual(expectedProduct);
      });
    });
  });
});
