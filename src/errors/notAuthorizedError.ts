import CustomError from "./customError";
import IErrorMessage from "../utils/interfaces/error.interface";
//@ts-ignore
import httpStatus from "http-status";

export class NotAuthorizedError extends CustomError {
  statusCode = httpStatus.UNAUTHORIZED;

  constructor(message = "Unauthorized Access") {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serialize(): IErrorMessage[] {
    return [{ status: false, message: this.message }];
  }
}
