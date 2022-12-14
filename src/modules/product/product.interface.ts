import { ICreatedProduct, IProduct } from './product.model';

export interface IProductService {
  create(user_id: string, product: IProduct): Promise<ICreatedProduct>;
  get(user_id: string, product_id: string): Promise<ICreatedProduct>;
  getAll(user_id: string): Promise<ICreatedProduct[]>;
  delete(user_id: string, product_id: string): Promise<boolean>;
  update(
    user_id: string,
    product_id: string,
    updatedProduct: Partial<IProduct>
  ): Promise<ICreatedProduct>;
}
