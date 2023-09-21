import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/customError";
import HttpStatus from "http-status";

/**
 * A Error Handler middleware.
 */

const errorHandler = async (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handling custom errors/exceptions
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ status: false, errors: err.serialize() });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
    status: false,
    message: "Internal Server Error",
  });
};

export default errorHandler;
