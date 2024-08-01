import express from 'express';
import type { Application, Request, Response } from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';

import ErrorHandler from '@/utils/errorHandlers';

dotenv.config();

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger
app.use(logger('dev'));

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('<h1>Welcome! to LYFT.ng</h1>');
});

// error handler
app.use(ErrorHandler);

/** Invalid api route */
app.use('*', (req: Request, res: Response) => {
  // res.status(404).send('<h1>Page not found!</h1>'); // though not expected but its better to retun a response trackable by the client
  return res.status(404).send({ message: 'Page not found!', data: null });
});
