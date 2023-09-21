import { HttpStatus } from "http-status";
export interface IHttpResponse {
  status: HttpStatus;
  data: any;
}
