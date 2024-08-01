import { Router } from 'express';
import { resourcesController } from '@/controllers';
import { isValidObjectId } from '@/middlewares';
const { getRate, getAllRates, getRatesByProduct } = resourcesController;

const rateRouter = Router();

rateRouter.get('/:id/product', [isValidObjectId], getRatesByProduct);

rateRouter.get('/:id', [isValidObjectId], getRate);

rateRouter.get('/', getAllRates);

export default rateRouter;
