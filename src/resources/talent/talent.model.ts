import { string } from "joi";
import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface Talent extends Document {
  criticalRoleId: ObjectId;
  companyId: string;
  talent: {
    employeeName: string;
    employeeId: ObjectId;
    employeeEmail: string;
    employmentDate: Date;

    employeeJobRole: {
      id: string;
      name: string;
    };
    staffId: string;
    department: string;
    mentor: {
      id: string;
      name: string;
    };
  };
}

const TalentSchema = new Schema<Talent>({
  criticalRoleId: {
    type: Schema.Types.ObjectId,
    ref: "CriticalRole",
    required: true,
  },
  companyId: {
    type: String,
    required: true,
  },
  talent: {
    employeeId: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      required: true,
    },
    employmentDate: {
      type: String,
      required: true,
    },
  },
});

const Talent = mongoose.model<Talent>("Talent", TalentSchema);
export default Talent;
