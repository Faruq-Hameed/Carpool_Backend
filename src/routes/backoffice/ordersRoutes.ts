import { Router } from 'express';
import {
  fetchOrderById,
  fetchOrders,
  updateOrder,
  creditOrder,
} from '@/controllers/backoffice/ordersController';
import {
  fileUploader,
  isValidObjectId,
  managerAuthenticator,
} from '@/middlewares';

const orderRouter = Router();

orderRouter.use([managerAuthenticator]);

orderRouter.get('/', fetchOrders);

orderRouter.get('/:id', isValidObjectId, fetchOrderById);

orderRouter.put(
  '/process-order/:id',
  isValidObjectId,
  fileUploader,
  updateOrder,
);

orderRouter.put('/credit-order/:id', isValidObjectId, creditOrder);

export default orderRouter;
