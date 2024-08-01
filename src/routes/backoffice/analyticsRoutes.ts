import { Router } from 'express';
import {
  getUserAnalyticsSummary,
  getTopTradersList,
  getOrderSummary,
} from '@/controllers/backoffice/analytics';

const analyticsRouter = Router();

analyticsRouter.get('/', getUserAnalyticsSummary);
analyticsRouter.get('/traders', getTopTradersList);
analyticsRouter.get('/orders', getOrderSummary);
export default analyticsRouter;
