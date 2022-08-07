import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { IProductService } from './product.interface';
import { ICreatedProduct, IProduct, Product } from './product.model';

export type ProductModelType = ReturnModelType<typeof Product, BeAnObject>;

export default class ProductService implements IProductService {
  constructor(private readonly productModel: ProductModelType) {}

  public async create(
    user_id: string,
    product: IProduct
  ): Promise<ICreatedProduct> {
    const newProduct = await this.productModel.create({ ...product, user_id });

    if (newProduct == null) throw new Error('Failed to save the product');

    return {
      product_id: newProduct._id,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      tags: newProduct.tags,
    };
  }
}
