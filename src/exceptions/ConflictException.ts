import CustomException from '@/exceptions/CustomException';
import { StatusCodes } from 'http-status-codes';

/**
 * Represents an exception that occurs when a bad request is made.
 */
export class ConflictException extends CustomException {
  public statusCode = StatusCodes.CONFLICT;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ConflictException.prototype);
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
