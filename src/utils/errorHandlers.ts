// import { logger } from '@/config/logger';
// import { config } from '@/config/dev';
import { type ErrorRequestHandler } from 'express';
// ErrorHandler.js
const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const errStatus: number =
    typeof err.statusCode === 'number' ? err.statusCode : 500;
  const errMsg: string =
    typeof err.message === 'string' ? err.message : 'Something went wrong';

  // logger.error(err);

  res.status(errStatus).json({
    message: errStatus === 500 ? 'Internal Server Error' : errMsg,
    data: {},
    stack: process.env.environment === 'development' ? err.stack : {},
  });
};
export default ErrorHandler;
