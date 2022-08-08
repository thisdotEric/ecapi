import { getModelForClass } from '@typegoose/typegoose';
import { Router } from 'express';
import { mustHaveValidJWT } from '../../middlewares';
import ProductController from './product.controller';
import { Product } from './product.model';
import ProductService from './product.service';

const productModel = getModelForClass(Product);

const productController = new ProductController(
  new ProductService(productModel)
);

const router = Router();

router.post(
  '/',
  mustHaveValidJWT,
  productController.create.bind(productController)
);

router.get(
  '/',
  mustHaveValidJWT,
  productController.getAll.bind(productController)
);

router.get(
  '/:product_id',
  mustHaveValidJWT,
  productController.get.bind(productController)
);

router.delete(
  '/:product_id',
  mustHaveValidJWT,
  productController.delete.bind(productController)
);

export default router;
