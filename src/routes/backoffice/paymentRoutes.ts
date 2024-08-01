import { Router } from 'express';
import {
  fetchPayments,
  fetchPaymentById,
  updatePayment,
} from '@/controllers/backoffice/paymentControllers';
import { isValidObjectId, managerAuthenticator } from '@/middlewares';

const paymentRouter = Router();

paymentRouter.use([managerAuthenticator]);

paymentRouter.get('/', fetchPayments);

paymentRouter.get('/:id', isValidObjectId, fetchPaymentById);

paymentRouter.put('/:id', isValidObjectId, updatePayment);

export default paymentRouter;
