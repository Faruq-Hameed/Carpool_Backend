import express from 'express';
import type { Application, Request, Response } from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';

import ErrorHandler from '@/utils/errorHandlers';
import userRouter from '@/routes/userRoutes';
import carRouter from '@/routes/carRoutes';

dotenv.config();

export const app: Application = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger
app.use(logger('dev'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/cars', carRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Welcome to Lyft API' });
});

// error handler
app.use(ErrorHandler);

/** Invalid api route */
app.use('*', (req: Request, res: Response) => {
  // res.status(404).send('<h1>Page not found!</h1>'); // though not expected but its better to retun a response trackable by the client
  return res.status(404).send({ message: 'Page not found!', data: null });
});
