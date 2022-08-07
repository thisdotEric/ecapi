import { IProductService } from './product.interface';
import { ICreatedProduct, IProduct } from './product.model';

export default class ProductService implements IProductService {
  public async create(
    user_id: string,
    product: IProduct
  ): Promise<ICreatedProduct> {
    console.log(user_id);

    return {
      product_id: '',
      ...product,
    };
  }
}
