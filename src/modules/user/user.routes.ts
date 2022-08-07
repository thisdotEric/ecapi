import { getModelForClass } from '@typegoose/typegoose';
import { Router } from 'express';
import { validateCreateUserInput } from '../../middlewares/user-input.middleware';
import { mustHaveValidJWT } from '../../middlewares/validate-jwt.middleware';
import UserController from './user.controller';
import { User } from './user.model';
import UserService from './user.service';

const router = Router();

const UserModel = getModelForClass(User);
const userController = new UserController(new UserService(UserModel));

router.post(
  '/',
  validateCreateUserInput,
  userController.create.bind(userController)
);

router.get('/', userController.get.bind(userController));

router.delete(
  '/',
  mustHaveValidJWT,
  userController.delete.bind(userController)
);

router.patch('/', mustHaveValidJWT, userController.update.bind(userController));

export default router;
