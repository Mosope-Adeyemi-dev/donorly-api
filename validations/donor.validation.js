const Joi = require("joi");

exports.v_donorSignup = Joi.object({
    password: Joi.string().required().min(8).max(64),
    email: Joi.string().email().required(),
})

exports.v_donorLogin = Joi.object({
    password: Joi.string().required().min(8).max(64),
    email: Joi.string().email().required(),
})

exports.v_donorUploadDetails = Joi.object({
    fullname: Joi.string().required(),
    location: Joi.string().required(),
    dob: Joi.date().required(),
    bloodGroup: Joi.string().required().valid("A+", "B+", "AB+", "O+", "O-", "A-", "B-", "AB-"),
    genotype: Joi.string().required().valid("AA", "AS", "AC", "SS", "SC", "CC"),
    nextOfKinEmail: Joi.string().email().required(),
})

exports.v_updateRequest = Joi.object({
    status: Joi.string().required().valid("rejected", "accepted"),
    requestId: Joi.string().required()
})

exports.v_reportSpam = Joi.object({
    requestId: Joi.string().required(),
    reportedHospital: Joi.string().required()
})