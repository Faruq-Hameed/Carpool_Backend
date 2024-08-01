import { Router } from 'express';
import * as transactionController from '@/controllers/backoffice/transactionController';
import { isValidObjectId, managerAuthenticator } from '@/middlewares';
const { getTransactions, getUserTransactions, getTransactionById } =
  transactionController;

const transactionRouter = Router();

transactionRouter.use([managerAuthenticator]);

transactionRouter.get('/', getTransactions);

transactionRouter.get('/:id', isValidObjectId, getTransactionById);

transactionRouter.get('/:id/user', isValidObjectId, getUserTransactions);

export default transactionRouter;
