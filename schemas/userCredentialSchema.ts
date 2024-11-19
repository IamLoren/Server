import Joi from "joi";

export const signUpSchema = Joi.object({
    firstName: Joi.string().max(20).required(),
    lastName: Joi.string().max(20).required(),
    email: Joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).max(50).required(),
    password: Joi.string().min(8).max(100).required(),
    role: Joi.string().required(),
    terms: Joi.bool()
    .valid(true)
    .required()
    .messages({
        'any.only': 'You must accept the terms and conditions',
        'any.required': 'You must accept the terms and conditions'
      }),
})

export const signInSchema = Joi.object({
    email: Joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    password: Joi.string().min(8).required(),
})