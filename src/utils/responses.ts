import safeCompare from "safe-compare";
import { Response } from "express";

interface SuccessResponseData {
  statusCode: number;
  message: string;
  payload?: any;
  token?: string | null;
}

const successResponse = async (res: Response, data: SuccessResponseData) => {
  let { payload, statusCode, message, token } = data;
  return res
    .status(statusCode)
    .send({ payload, statusCode, message, status: "success", token });
};

export { successResponse };
