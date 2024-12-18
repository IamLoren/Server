import Joi from "joi";

export const createOrderSchema = Joi.object({
    carId: Joi.string().required(),
    clientId: Joi.string().required(),
    clientEmail: Joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    phoneNumber: Joi.string().min(8).required(),
    createdBy: Joi.string().valid("user", "admin").required(),
    time: Joi.object({
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
    }).required(),
    cost: Joi.number().positive().required(),
    orderType: Joi.string()
    .valid('rent', 'oil change', 'repair', 'maintenance', 'insurance')
    .when('createdBy', {
      is: Joi.valid('user'), 
      then: Joi.valid('rent'), 
      otherwise: Joi.valid('rent', 'oil change', 'repair', 'maintenance', 'insurance'), // Адмін може вибирати всі типи
    })
    .required(),
    orderStatus: Joi.string()
    .valid("active", "inProgress", "completed"),
    adminApprove: Joi.bool(),
    additionally: Joi.string().optional().allow('', null),
})

export const updateOrderSchema = Joi.object({
    carId: Joi.string().required(),
    clientId: Joi.string().required(),
    clientEmail: Joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    phoneNumber: Joi.string().min(8).required(),
    createdBy: Joi.string().valid("user", "admin").required(),
    time: Joi.object({
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
    }).required(),
    cost: Joi.number().positive().required(),
    orderType: Joi.string()
    .valid("rent", "oil change", "repair", "maintenance", "insurance")
    .required(),
    orderStatus: Joi.string()
    .valid("active", "inProgress", "completed")
    .required(),
    adminApprove: Joi.bool(),
    additionally: Joi.string().optional().allow('', null),
})