import { getModelForClass } from '@typegoose/typegoose';
import { Router } from 'express';
import {
  mustHaveValidJWT,
  validateCreateUserInput,
  mustHaveValidLoginInput,
  mustBeValidUpdatedUser,
} from '../../middlewares';

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

router.get('/', mustHaveValidJWT, userController.getAll.bind(userController));

router.get('/me', mustHaveValidJWT, userController.get.bind(userController));

router.delete(
  '/',
  mustHaveValidJWT,
  userController.delete.bind(userController)
);

router.patch(
  '/',
  mustHaveValidJWT,
  mustBeValidUpdatedUser,
  userController.update.bind(userController)
);

router.post(
  '/sessions',
  mustHaveValidLoginInput,
  userController.login.bind(userController)
);

export default router;
