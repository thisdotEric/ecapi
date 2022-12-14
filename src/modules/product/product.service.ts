import { ReturnModelType } from '@typegoose/typegoose';
import {
  BeAnObject,
  IObjectWithTypegooseFunction,
} from '@typegoose/typegoose/lib/types';
import { IProductService } from './product.interface';
import { ICreatedProduct, IProduct, Product } from './product.model';
import { Document, Types } from 'mongoose';

export type ProductModelType = ReturnModelType<typeof Product, BeAnObject>;

type ProductDoc = Document<any, BeAnObject, Product> &
  Product &
  IObjectWithTypegooseFunction & {
    _id: Types.ObjectId;
  };

export default class ProductService implements IProductService {
  constructor(private readonly productModel: ProductModelType) {}

  // Helper method to transform product document to ICreatedProduct
  private _toProduct(product: ProductDoc): ICreatedProduct {
    return {
      product_id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
    };
  }

  /**
   * Get a single product using the provided user_id and product_id
   * @param user_id
   * @param product_id
   * @returns a single product object
   */
  public async get(
    user_id: string,
    product_id: string
  ): Promise<ICreatedProduct> {
    const product = await this.productModel.findOne({
      _id: product_id,
      user_id,
    });

    if (!product) throw new Error('Product not found');

    return this._toProduct(product);
  }

  /**
   *  Get all products associated with the given user_id
   * @param user_id
   * @returns an array of products
   */
  public async getAll(user_id: string): Promise<ICreatedProduct[]> {
    const products = await this.productModel.find({ user_id });

    if (!products) throw new Error('Products not found');

    return products.map((product) => this._toProduct(product));
  }

  /**
   * Create a new product and associate it with the given user_id
   * @param user_id
   * @param product
   * @returns the newly created product
   */
  public async create(
    user_id: string,
    product: IProduct
  ): Promise<ICreatedProduct> {
    const newProduct = await this.productModel.create({ ...product, user_id });

    if (newProduct == null) throw new Error('Failed to save the product');

    return this._toProduct(newProduct);
  }

  /**
   * Delete a product based on the given user_id and product_id
   * @param user_id
   * @param product_id
   * @returns true if the product is successfully deleted, throws an exception otherwise
   */
  public async delete(user_id: string, product_id: string): Promise<boolean> {
    const deletedProduct = await this.productModel.findOneAndDelete({
      _id: product_id,
      user_id,
    });

    if (!deletedProduct) throw new Error('Product not found');

    return true;
  }

  /**
   * Update a product based on the given updated product, product_id and user_id
   * @param user_id
   * @param product_id
   * @param updatedProduct
   * @returns the updated product
   */
  public async update(
    user_id: string,
    product_id: string,
    updatedProduct: Partial<IProduct>
  ): Promise<ICreatedProduct> {
    const returnedUpdatedProduct = await this.productModel.findOneAndUpdate(
      {
        _id: product_id,
        user_id,
      },
      {
        ...updatedProduct,
      },
      { returnDocument: 'after' }
    );

    if (!returnedUpdatedProduct) throw new Error('Product not found');

    return this._toProduct(returnedUpdatedProduct);
  }
}
