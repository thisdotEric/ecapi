import { ICreatedProduct, IProduct } from './product.model';

export interface IProductService {
  create(user_id: string, product: IProduct): Promise<ICreatedProduct>;
}
