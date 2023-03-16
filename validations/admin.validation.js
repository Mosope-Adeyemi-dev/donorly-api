const Joi = require("joi");

exports.v_adminSignup = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required().min(8).max(64),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required()
})

exports.v_adminLogin = Joi.object({
    password: Joi.string().required().min(8).max(64),
    email: Joi.string().email().required(),
})

exports.v_deactivateHospital = Joi.object({
    hospitalId: Joi.string().required(),
    reportId: Joi.string()
})