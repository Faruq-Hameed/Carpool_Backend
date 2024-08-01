import { Router } from 'express';
import { isValidObjectId, managerAuthenticator } from '@/middlewares';
import {
  login,
  passwordChange,
  passwordReset,
} from '@/controllers/backoffice/authControllers';
import storeLoginActivity from '@/middlewares/loginActivity';

const authRouter = Router();

authRouter.post('/', [login, storeLoginActivity]);

authRouter.use([managerAuthenticator]);

authRouter.put('/password-change', passwordChange);

authRouter.put('/:id/password-reset', isValidObjectId, passwordReset);

export default authRouter;
