import { IHttpResponse } from "../utils/interfaces/http.interface";

export const httpResponse = (res: IHttpResponse) => {
  return {
    status: res.status,
    data: res.data,
  };
};
