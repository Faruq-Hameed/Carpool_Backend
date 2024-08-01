import CustomException from '@/exceptions/CustomException';
import { StatusCodes } from 'http-status-codes';

export class ProviderException extends CustomException {
  public statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message: string | null = null) {
    super(message ?? 'Provider Cannot be Reached. Please try again later.');

    Object.setPrototypeOf(this, ProviderException.prototype);
  }

  serialize(): any {
    return {
      statusCode: this.statusCode,
      status: 'error',
      message: this.message,
    };
  }
}

// export default ProviderException;
