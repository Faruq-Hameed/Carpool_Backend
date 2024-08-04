import { Router } from 'express';
import { createUser, getUser, createOtp, verifyOtp } from '@/controllers/users';

const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/otp', createOtp);
userRouter.post('/otp/verify', verifyOtp);
userRouter.get('/', getUser);

export default userRouter;
