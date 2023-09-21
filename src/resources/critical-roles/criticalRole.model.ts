import { boolean } from "joi";
import mongoose, { Schema, Document } from "mongoose";

export interface ICriticalRole extends Document {
  jobRole: {
    id: string;
    name: string;
  };
  companyId: string;
  department: string;
  maxVacantTime: {
    length: number;
    date: Date;
  };
  talentRequired: number;
  criticality: string;
  isDeleted: boolean;
}

const CriticalRoleSchema = new Schema<ICriticalRole>({
  jobRole: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  companyId: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  maxVacantTime: {
    length: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  talentRequired: {
    type: Number,
    required: true,
  },
  criticality: {
    type: String,
    required: true,
  },
});

const CriticalRole = mongoose.model<ICriticalRole>(
  "CriticalRole",
  CriticalRoleSchema
);

export default CriticalRole;
