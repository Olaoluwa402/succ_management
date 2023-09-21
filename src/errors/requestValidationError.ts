import Joi from "joi";
import CustomError from "./customError";
import IErrorMessage from "../utils/interfaces/error.interface";
import httpStatus from "http-status";

interface CustomValidationError {
  field: string;
  message: string;
}

export class RequestValidationError extends CustomError {
  public statusCode = httpStatus.BAD_REQUEST;
  public errors: CustomValidationError[] | any;

  constructor(validationResult: Joi.ValidationResult) {
    super("Invalid request parameters");
    this.errors = validationResult.error ? validationResult.error.details : [];

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize(): IErrorMessage[] {
    return this.errors.map((err: any) => {
      return { message: err.message, field: err.context?.key || "unknown" };
    });
  }
}
