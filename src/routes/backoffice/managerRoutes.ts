import { Router } from 'express';
import {
  createManager,
  getManagerById,
  getAllManagers,
  deleteAManager,
  updateManager,
  getLoginActivities,
} from '@/controllers/backoffice/managerControllers';
import { managerAuthenticator } from '@/middlewares';

const managerRouter = Router();

managerRouter.use([managerAuthenticator]);

managerRouter.post('/', createManager);
managerRouter.get('/', getAllManagers);
managerRouter.get('/:id/login_activity', getLoginActivities);
managerRouter.delete('/:id', deleteAManager);

managerRouter.get('/:id', getManagerById);
managerRouter.put('/:id', updateManager);

export default managerRouter;
