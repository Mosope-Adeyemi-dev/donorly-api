const Joi = require("joi");

exports.v_hospitalSignup = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required().min(8).max(64),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    location: Joi.string().required()
})

exports.v_hospitalLogin = Joi.object({
    password: Joi.string().required().min(8).max(64),
    email: Joi.string().email().required(),
})

exports.v_requestDonation = Joi.object({
    donor: Joi.string().required()
})

exports.v_updateRequest = Joi.object({
    requestId: Joi.string().required()
})