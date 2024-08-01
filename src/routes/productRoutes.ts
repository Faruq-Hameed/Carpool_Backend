import Router from 'express';
import { resourcesController } from '@/controllers';
import { isValidObjectId } from '@/middlewares';
const { getAllProducts, getProduct } = resourcesController;

const productRouter = Router();

productRouter.get('/:id', [isValidObjectId], getProduct);

productRouter.get('/', getAllProducts);

export default productRouter;
