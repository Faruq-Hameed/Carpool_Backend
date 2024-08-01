import { Router } from 'express';
import * as contentController from '@/controllers/backoffice/contentControllers';
import { managerAuthenticator } from '@/middlewares';
const { addContent } = contentController;

const contentRouter = Router();

contentRouter.use([managerAuthenticator]);

contentRouter.post('/', addContent);

export default contentRouter;
