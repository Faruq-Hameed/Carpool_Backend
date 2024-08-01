import express from 'express';
import type { Application, Request, Response } from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import {
  userRouter,
  productRouter,
  rateRouter,
  contentRouter,
  studentAmbassadorRouter,
} from '@/routes';

import {
  productRouter as productBackOfficeRouter,
  rateRouter as rateBackOfficeRouter,
  contentRouter as contentBackOfficeRouter,
  studentAmbassadorRouter as studentAmbassadorBackOfficeRouter,
  managerRouter,
  customerRouter as customerBackOfficeRouter,
  transactionRouter as transactionBackOfficeRouter,
  orderRouter as orderBackOfficeRouter,
  analyticsRouter as analyticsBackofficeRouter,
  paymentRouter as paymentBackOfficeRouter,
  authRouter as authBackOfficeRouter,
} from '@/routes/backoffice';
import ErrorHandler from '@/utils/errorHandlers';

dotenv.config();

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger
app.use(logger('dev'));

// BACK-OFFICE ROUTE
app.use('/api/v2/backoffice/rates', rateBackOfficeRouter);
app.use('/api/v2/backoffice/contents', contentBackOfficeRouter);
app.use('/api/v2/backoffice/products', productBackOfficeRouter);
app.use(
  '/api/v2/backoffice/student-ambassador',
  studentAmbassadorBackOfficeRouter,
);
app.use('/api/v2/backoffice/managers', managerRouter);
app.use('/api/v2/backoffice/customers', customerBackOfficeRouter);
app.use('/api/v2/backoffice/transactions', transactionBackOfficeRouter);
app.use('/api/v2/backoffice/orders', orderBackOfficeRouter);
app.use('/api/v2/backoffice/analytics', analyticsBackofficeRouter);
app.use('/api/v2/backoffice/payments', paymentBackOfficeRouter);
app.use('/api/v2/backoffice/auth', authBackOfficeRouter);

// DEFAULT ROUTE
app.use('/api/v2/users', userRouter);
app.use('/api/v2/rates', rateRouter);
app.use('/api/v2/products', productRouter);
app.use('/api/v2/contents', contentRouter);
app.use('/api/v2/student-ambassador', studentAmbassadorRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('<h1>Welcome!</h1>');
});

// error handler
app.use(ErrorHandler);

/** Invalid api route */
app.use('*', (req: Request, res: Response) => {
  // res.status(404).send('<h1>Page not found!</h1>'); // though not expected but its better to retun a response trackable by the client
  return res.status(404).send({ message: 'Page not found!', data: null });
});
