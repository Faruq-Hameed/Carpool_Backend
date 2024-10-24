import { Router } from 'express';
import {
  createUser,
  getUser,
  createOtp,
  verifyOtp,
  getUserById,
} from '@/controllers/users';

const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/otp', createOtp);
userRouter.post('/otp/verify', verifyOtp);
userRouter.get('/', getUser);
userRouter.put('/:id', getUserById);
userRouter.delete('/:id', getUserById);
// userRouter.get('/:id', getUserById);

export default userRouter;
