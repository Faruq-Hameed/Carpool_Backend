import { Router } from 'express';
// import { userController, authController } from '@/controllers/users/';
import * as userController from '@/controllers/backoffice/userControllers';
import * as authController from '@/controllers/backoffice/authControllers';
import { isValidObjectId } from '@/middlewares';

export const userRouter = Router();

userRouter.post('/login', authController.login);

userRouter.post('/', userController.createUser);

userRouter.get(
  ['/username', '/email'],
  userController.getUserByUsernameOrEmail,
);

userRouter.use('/:id', isValidObjectId); // validate objectId

userRouter.get('/:id', userController.getUserById);

/** protected routes */
// userRouter.use(authController.auth); // auth middlware

userRouter
  .route('/:id')
  .put(userController.updateUser)
  .delete(userController.deleteUser);

/** Admin protected routes */
// userRouter.use(authController.admin); // admin auth middlware

userRouter.get('/', userController.getAllUsers);
