import CustomException from '@/exceptions/CustomException';
import { StatusCodes } from 'http-status-codes';

export class ForbiddenException extends CustomException {
  statusCode = StatusCodes.FORBIDDEN;

  constructor(message: string | null = null) {
    super(message ?? 'Unauthorized Access');

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }

  serialize(): any {
    return {
      statusCode: this.statusCode,
      status: 'error',
      message: this.message,
    };
  }
}

// export default ForbiddenException;
