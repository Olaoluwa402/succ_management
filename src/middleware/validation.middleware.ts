import { Request, Response, RequestHandler, NextFunction } from "express";
import Joi from "joi";

import { RequestValidationError } from "../errors";

export enum valType {
  BODY = "BODY",
  PARAMS = "PARAMS",
  QEURY = "QEURY",
}

function validationMiddleware(
  Schema: Joi.Schema,
  type: valType
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      if (type == valType.PARAMS) {
        const value = await Schema.validateAsync(req.params, validationOptions);
        req.params = value;
        return next();
      }

      if (type == valType.QEURY) {
        const value = await Schema.validateAsync(req.query, validationOptions);
        req.query = value;
        return next();
      }
      const value = await Schema.validateAsync(req.body, validationOptions);
      req.body = value;
      return next();
    } catch (e: any) {
      const errors: string[] = [];

      e.details.forEach((error: Joi.ValidationErrorItem) => {
        errors.push(error.message);
      });
      res.status(400).send({ errors });
    }
  };
}

export default validationMiddleware;
