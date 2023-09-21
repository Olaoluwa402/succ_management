import { ICreateTalent } from "./talent.interface";
import TalentRepository from "./talent.repository";
import { Talent } from "./talent.model";

class TalentService {
  private talentRepository = new TalentRepository();
  constructor() {}

  async createTalent(data: ICreateTalent): Promise<Talent | Error> {
    try {
      const result = await this.talentRepository.createTalent(data);
      
      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getTalents(criticalRoleId:string): Promise<Talent[] | Error> {
    try {
      const talents = await this.talentRepository.getTalents(criticalRoleId)
      return talents;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteTalent(id: string) {
    try {
      const deletedTalent = await this.talentRepository.deleteTalent(id)
      return deletedTalent;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default TalentService;
