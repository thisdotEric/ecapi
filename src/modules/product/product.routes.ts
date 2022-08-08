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

// Important, this middleware will be applied to all routes
router.use(mustHaveValidJWT);

router.post('/', productController.create.bind(productController));

router.get('/', productController.getAll.bind(productController));

router.get('/:product_id', productController.get.bind(productController));

router.delete('/:product_id', productController.delete.bind(productController));

router.patch('/:product_id', productController.update.bind(productController));

export default router;
