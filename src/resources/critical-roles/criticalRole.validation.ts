import Joi from "joi";

const criticalRole = Joi.object({
  jobRole: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
  maxVacantTime: Joi.object({
    length: Joi.number().required(),
    date: Joi.date().required(),
  }).required(),
  talentRequired: Joi.number().required(),
  department: Joi.number().required(),
  criticality: Joi.string().required(),
});

const GetCriticalRoles = Joi.object({
  department: Joi.string().optional(),
  jobRoleName: Joi.string().optional(),
  page: Joi.string().optional(),
  limit: Joi.string().optional(),
});

const UpdateCriticalRoles = Joi.object({
  jobRole: Joi.object({
    id: Joi.string().optional(),
    name: Joi.string().optional(),
  }).optional(),
  maxVacantTime: Joi.object({
    length: Joi.number().optional(),
    date: Joi.date().optional(),
  }).optional(),
  talentRequired: Joi.number().optional(),
  department: Joi.number().optional(),
  criticality: Joi.string().optional(),
});

export { criticalRole, GetCriticalRoles, UpdateCriticalRoles };
