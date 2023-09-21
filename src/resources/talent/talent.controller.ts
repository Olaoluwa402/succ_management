import { Router, Response, Request, NextFunction } from "express";
import { IController } from "../../utils/interfaces/controller.interface";
import TalentService from "./talent.services";
import validationMiddleware from "../../middleware/validation.middleware";
import httpStatus from "http-status";

class TalentController implements IController {
  public path = "/talent";
  public router = Router();
  private talentService = new TalentService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(`${this.path}/create`, this.createTalent);

    this.router.get(`${this.path}/:criticalRoleId`, this.getTalents);

    this.router.delete(`${this.path}/:id`, this.deleteTalent);
  }

  private createTalent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const data = req.body;
      const createdTalent = await this.talentService.createTalent(data);
      res.status(201).json({ status: httpStatus.OK, data: createdTalent });
    } catch (error: any) {
      next(error);
    }
  };

  private getTalents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const criticalRoleId = req.params.criticalRoleId;
      const getTalents = await this.talentService.getTalents(criticalRoleId);
      res.status(201).json({ status: httpStatus.OK, data: getTalents });
    } catch (error: any) {
      next(error);
    }
  };

  private deleteTalent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const id = req.params.id;
      const deletedTalent = await this.talentService.deleteTalent(id);
      res.status(201).json({ deletedTalent });
    } catch (error: any) {
      next(error);
    }
  };
}

export default TalentController;
