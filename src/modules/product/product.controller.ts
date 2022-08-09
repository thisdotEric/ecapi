import { Request, Response } from 'express';
import { IProduct } from './product.model';
import ProductService from './product.service';

export default class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Get a single product based on the given product_id
   */
  public async get(req: Request, res: Response) {
    const product_id = req.params.product_id as string;
    const user_id = req.user.user_id;

    try {
      const product = await this.productService.get(user_id, product_id);

      res.status(200);
      res.json(product);
    } catch (error) {
      res.sendStatus(404);
    }
  }

  /**
   * Get all products associated with the currently logged in user
   */
  public async getAll(req: Request, res: Response) {
    try {
      const products = await this.productService.getAll(req.user.user_id);

      res.status(200);
      res.json(products);
    } catch (error) {
      res.sendStatus(404);
    }
  }

  /**
   * Create a new product and will be associated to the currently logged in user
   */
  public async create(req: Request, res: Response) {
    const product = req.body as IProduct;
    const user_id = req.user.user_id as string;

    try {
      const savedProduct = await this.productService.create(user_id, product);

      res.status(201);
      res.json(savedProduct);
    } catch (error) {
      res.status(400);
      res.send('Unable to save the product');
    }
  }

  /**
   * Delete a product based on the given product_id and the currently logged in user
   */
  public async delete(req: Request, res: Response) {
    const product_id = req.params.product_id as string;

    try {
      const deleted = await this.productService.delete(
        req.user.user_id,
        product_id
      );

      res.sendStatus(deleted ? 200 : 500);
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  }

  /**
   * Update a product based on the given product_id and the currently logged in user
   */
  public async update(req: Request, res: Response) {
    const product_id = req.params.product_id as string;
    const product = req.body as Partial<IProduct>;

    try {
      const newlyUpdatedProduct = await this.productService.update(
        req.user.user_id,
        product_id,
        product
      );

      res.json(newlyUpdatedProduct);
    } catch (error) {
      res.status(404);
      res.send(error.message);
    }
  }
}
