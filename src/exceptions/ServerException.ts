import CustomException from '@/exceptions/CustomException';
import { StatusCodes } from 'http-status-codes';

/**
 * Represents an exception that occurs when a bad request is made.
 */
export class ServerException extends CustomException {
  public statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ServerException.prototype);
  }

  /**
   * Serializes the exception into an error message object.
   * @returns The serialized error message object.
   */
  serialize(): any {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

// export default ConflictException;
