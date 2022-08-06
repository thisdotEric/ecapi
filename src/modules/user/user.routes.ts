import { Router } from 'express';
import { validateCreateUserInput } from '../../middlewares/user-input.middleware';
import { mustHaveValidJWT } from '../../middlewares/validate-jwt.middleware';
import UserController from './user.controller';
import UserService from './user.service';

const router = Router();

const userController = new UserController(new UserService());

router.post('/', validateCreateUserInput, userController.create);
router.get('/', mustHaveValidJWT, userController.create);

export default router;
