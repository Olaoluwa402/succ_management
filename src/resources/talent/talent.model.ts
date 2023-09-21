 import { string } from 'joi';
import mongoose, { Schema, Document, ObjectId } from 'mongoose';


 export interface Talent extends Document {
  criticalRoleId: ObjectId;
 talent:{
  employeeName:string,
  employeeId:ObjectId,
  employeeEmail:string,
  employmentDate:Date
 }
}

 const TalentSchema = new Schema<Talent>({
  criticalRoleId: {
    type: Schema.Types.ObjectId,
    ref:"CriticalRole",
   required: true,
  },

  talent: {
    employeeId:{
      type:String,
      required: true
    },
    employeeName:{
      type:String,
      required:true
    },
    employeeEmail:{
      type:String,
      required:true,
    },
    employmentDate:{
      type:String,
      required:true,
    }
 }

});

 const Talent = mongoose.model<Talent>('Talent', TalentSchema);
 export default Talent;
