import Router from 'express';
import { resourcesController } from '@/controllers';
const { getContentByName, getAllContents } = resourcesController;

const contentRouter = Router();

contentRouter.get('/', getAllContents);

contentRouter.get('/get-single-content/:name', getContentByName);

export default contentRouter;
