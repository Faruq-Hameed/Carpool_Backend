import CustomException from '@/exceptions/CustomException';
import { StatusCodes } from 'http-status-codes';

export class TokenException extends CustomException {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor() {
    super('Oops! Invalid or Expired Token!');

    Object.setPrototypeOf(this, TokenException.prototype);
  }

  serialize(): any {
    return {
      statusCode: this.statusCode,
      status: 'error',
      message: this.message,
    };
  }
}

// export default TokenException;
