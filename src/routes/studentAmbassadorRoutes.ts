import Router from 'express';
import { studentAmbassadorController } from '@/controllers';
const { addAmbassador } = studentAmbassadorController;

const studentAmbassadorRouter = Router();

studentAmbassadorRouter.post('/', addAmbassador);

export default studentAmbassadorRouter;
