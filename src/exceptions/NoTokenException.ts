import CustomException from '@/exceptions/CustomException';
import { StatusCodes } from 'http-status-codes';

export class NoTokenException extends CustomException {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor() {
    super('Authentication Required');

    Object.setPrototypeOf(this, NoTokenException.prototype);
  }

  serialize(): any {
    return {
      statusCode: this.statusCode,
      status: 'error',
      message: this.message,
    };
  }
}

// export default NoTokenException;
