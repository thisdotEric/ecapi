import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { IProductService } from './product.interface';
import { ICreatedProduct, IProduct, Product } from './product.model';

export type ProductModelType = ReturnModelType<typeof Product, BeAnObject>;

export default class ProductService implements IProductService {
  constructor(private readonly productModel: ProductModelType) {}

  public async get(
    user_id: string,
    product_id: string
  ): Promise<ICreatedProduct> {
    const product = await this.productModel.findOne({
      _id: product_id,
      user_id,
    });

    console.log(product);

    if (!product) throw new Error('Product not found');

    return {
      product_id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
    };
  }

  public async getAll(user_id: string): Promise<ICreatedProduct[]> {
    const products = await this.productModel.find({ user_id });

    if (!products) throw new Error('Products not found');

    return products.map((product) => ({
      product_id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
    }));
  }

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
