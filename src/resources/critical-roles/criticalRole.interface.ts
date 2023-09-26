import { IPagination } from "../../utils/interfaces/paginate.interface";

export interface ICreateCriticalRole {
  jobRole: {
    id: string;
    name: string;
  };
  maxVacantTime: {
    length: number;
    date: Date;
  };
  talentRequired: number;
  criticality: string;
  department: string;
}

export interface IAnalytics {
  totalCriticalRole: number;
  totalTalents: number;
  vacantRoles: number;
}

export interface IGetCriticalRoles extends IPagination {
  department?: string;
  "jobRole.name"?: string;
  recent?: string;
  date?: Date;
  search?: string;
}

export interface IGetCriticalRole {
  companyId: string;
}

export interface IUpdateCriticalRoles {
  jobRole?: {
    id?: string;
    name?: string;
  };
  maxVacantTime?: {
    length?: number;
    date?: Date;
  };
  talentRequired?: number;
  criticality?: string;
  department?: string;
}
