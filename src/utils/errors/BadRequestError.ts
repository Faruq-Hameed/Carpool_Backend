import { StatusCodes } from 'http-status-codes';
import CustomError from '../CustomError';

export default class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
