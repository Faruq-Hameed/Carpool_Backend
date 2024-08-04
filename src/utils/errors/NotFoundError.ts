import CustomError from '@/utils/CustomError';
import { StatusCodes } from 'http-status-codes';

/** Not found Exception */
export default class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
