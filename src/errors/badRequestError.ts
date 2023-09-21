import IErrorMessage from "../utils/interfaces/error.interface";
import CustomError from "./customError";
import httpStatus from "http-status";

export class BadRequestError extends CustomError {
  public statusCode = httpStatus.BAD_REQUEST;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialize(): IErrorMessage[] {
    return [{ status: false, message: this.message }];
  }
}
