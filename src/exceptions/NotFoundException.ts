import CustomException from '@/exceptions/CustomException';
import { StatusCodes } from 'http-status-codes';

export class NotFoundException extends CustomException {
  statusCode = StatusCodes.NOT_FOUND;

  constructor(message: string | null = null) {
    super(message ?? 'Resource / Route Not found');

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }

  serialize(): any {
    return {
      statusCode: this.statusCode,
      status: 'error',
      message: this.message,
    };
  }
}

// export default NotFoundException;
