import { Router } from 'express';
import * as rateController from '@/controllers/backoffice/rateControllers';
import { isValidObjectId, managerAuthenticator } from '@/middlewares';
const {
  addRate,
  getAllRates,
  getRate,
  getRatesByProduct,
  deleteRate,
  updateRate,
} = rateController;

const rateRouter = Router();

rateRouter.use([managerAuthenticator]);

rateRouter.get('/', getAllRates);

rateRouter.post('/', addRate);

rateRouter.get('/:id/product', getRatesByProduct);

rateRouter.get('/:id', getRate);

rateRouter.put('/:id', [isValidObjectId], updateRate);

rateRouter.delete('/:id', [isValidObjectId], deleteRate);

export default rateRouter;
