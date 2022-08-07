import { Request, Response } from 'express';
import { IProduct } from './product.model';
import ProductService from './product.service';

export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  public async create(req: Request, res: Response) {
    const product = req.body as IProduct;
    const user_id = '';

    try {
      const savedProduct = await this.productService.create(user_id, product);

      res.status(201);
      res.json(savedProduct);
    } catch (error) {
      res.status(400);
      res.send('Unable to save the product');
    }
  }
}
