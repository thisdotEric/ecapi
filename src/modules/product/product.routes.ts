import { getModelForClass } from '@typegoose/typegoose';
import { Router } from 'express';
import ProductController from './product.controller';
import { Product } from './product.model';
import ProductService from './product.service';

const productModel = getModelForClass(Product);

const productController = new ProductController(
  new ProductService(productModel)
);

const router = Router();

router.post('/', productController.create.bind(productController));

export default router;
