import { ICreateTalent } from "./talent.interface";
import Talent from './talent.model';




class TalentRepository{
    constructor(){
}
async createTalent(data: ICreateTalent){
       const exist = await Talent.findOne({criticalRoleId:data.criticalRoleId, "talent.employeeId":data.talent.employeeId})       
       if(exist){
        throw new Error("Talent already added to critical role")
       }
         const talent = await Talent.create( data);
     return talent;
    }
      
    async getTalents(criticalRoleId: string){
        try{
       const exist = await Talent.find({criticalRoleId})
       if(!exist){
        throw new Error("Talent not found")
       }       
         return exist;
    }catch(error: any){
        throw new Error(error.message);
    }
    }

    async deleteTalent(id: string) {
        try {
         const deletedTalent = await Talent.findById(id);
    if (!deletedTalent) {
            throw new Error("Talent not found")
          }
    await Talent.deleteOne({_id:id})
          return "Talent removed successfully";
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
}

export default TalentRepository;