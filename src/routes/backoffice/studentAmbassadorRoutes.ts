import Router from 'express';
import * as studentAmbassadorController from '@/controllers/backoffice/studentAmbassadorControllers';
import { managerAuthenticator } from '@/middlewares';
const { getAllAmbassadors, exportAmbassadors } = studentAmbassadorController;

const studentAmbassadorRouter = Router();

studentAmbassadorRouter.use([managerAuthenticator]);

studentAmbassadorRouter.get('/', getAllAmbassadors);

studentAmbassadorRouter.get('/export', exportAmbassadors);

export default studentAmbassadorRouter;
