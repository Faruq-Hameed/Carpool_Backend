import { StatusCodes } from 'http-status-codes';

abstract class CustomException extends Error {
  public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
  public message: string;

  protected constructor(message: string ) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, CustomException.prototype);
  }

  abstract serialize(): any;
}

export default CustomException
