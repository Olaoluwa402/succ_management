import Joi from 'joi';


const talent = Joi.object({
  criticalRoleId:Joi.string().required(),
  talent: Joi.object({
    employeeId: Joi.string().required(),
    employeeName: Joi.string().required(),
    employeeEmail: Joi.string().required(),
    employmentDate: Joi.date().required()
  }).required(),
})

export default { talent };

