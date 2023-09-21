import { Router, Response, Request, NextFunction } from "express";
import { IController } from "../../utils/interfaces/controller.interface";
import CriticalRoleService from "./criticalRole.services";
import validationMiddleware from "../../middleware/validation.middleware";
import {
  GetCriticalRoles,
  criticalRole,
  UpdateCriticalRoles,
} from "./criticalRole.validation";

import httpStatus from "http-status";
import { valType } from "../../middleware/validation.middleware";
import { NotFoundError } from "../../errors";
import { successResponse } from "../../utils/responses";

class CriticalRoleController implements IController {
  public path = "/role";
  public router = Router();
  private criticalRoleService = new CriticalRoleService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(criticalRole, valType.BODY),
      this.createCriticalRole
    );
    this.router.get(
      `${this.path}/allRoles`,
      validationMiddleware(GetCriticalRoles, valType.QEURY),
      this.getRoles
    );
    this.router.get(`${this.path}/:id`, this.getRole);

    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(UpdateCriticalRoles, valType.BODY),
      this.updateRole
    );

    this.router.delete(`${this.path}/:id`, this.deleteRole);
  }

  private createCriticalRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const data = req.body;
      const companyId = "req.user.companyID";
      console.log(data, "data");
      const createdRole = await this.criticalRoleService.createCriticalRole(
        companyId,
        data
      );

      return successResponse(res, {
        statusCode: httpStatus.CREATED,
        payload: createdRole,
        message: "critical role created",
      });
    } catch (error: any) {
      // pass error down to the set error handler middleware
      next(error);
    }
  };

  private getRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const query = req.query;
      const companyId = "req.user.companyID";
      const roles = await this.criticalRoleService.getCriticalRoles(
        companyId,
        query
      );

      return successResponse(res, {
        statusCode: httpStatus.CREATED,
        payload: roles,
        message: "critical roles",
      });
    } catch (error: any) {
      // pass error down to the error handler
      next(error);
    }
  };

  private getRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const criticalRoleId = req.params.id;
      const companyId = "req.user.companyID";
      const role = await this.criticalRoleService.getCriticalRole(
        criticalRoleId,
        companyId
      );

      if (!role) {
        throw new NotFoundError("Role Not found");
      }

      return successResponse(res, {
        statusCode: httpStatus.CREATED,
        payload: role,
        message: "critical role",
      });
    } catch (error: any) {
      next(error);
    }
  };

  private updateRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const criticalRoleId = req.params.id;
      const companyId = "req.user.companyID";
      const role = await this.criticalRoleService.updateCriticalRole(
        criticalRoleId,
        companyId,
        req.body
      );

      return successResponse(res, {
        statusCode: httpStatus.CREATED,
        message: role,
      });
    } catch (error: any) {
      next(error);
    }
  };

  private deleteRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      console.log(req.body, "body");
      const criticalRoleId = req.params.id;
      const companyId = "req.user.companyID";
      const role = await this.criticalRoleService.deleteCriticalRole(
        criticalRoleId,
        companyId
      );

      res.status(201).json({ status: httpStatus.OK, data: role });
    } catch (error: any) {
      next(error);
    }
  };
}

export default CriticalRoleController;
