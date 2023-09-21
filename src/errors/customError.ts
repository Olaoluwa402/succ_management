import IErrorMessage from "../utils/interfaces/error.interface";
import HttpStatus from "http-status";

abstract class CustomError extends Error {
  public statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
  public message: string;

  protected constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serialize(): IErrorMessage[];
}

export default CustomError;
