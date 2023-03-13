const hospitalModel = require("../models/hospital.model");
const { translateError } = require("../utils/mongo_helper");
const { createToken } = require("../utils/token");
const verifyPasswordPolicy = require("../utils/passwordPolicy");
const passwordOperations = require("../utils/password");
const donorModel = require("../models/donor.model");
const requestModel = require("../models/request.model");

exports.registerHospital = async (body) => {
  try {
    const { name, email, password, phoneNumber, location, licenseNumber } =
      body;

    if (!(await verifyPasswordPolicy(password)))
      return [false, "Password is too weak."];

    const user = await hospitalModel.create({
      name,
      email,
      phoneNumber,
      password,
      location,
      licenseNumber,
    });
    console.log(user);
    if (!user) return [false, "Failed to signup"];

    return [true, user];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to signup"];
  }
};

exports.authenticateHospital = async (email, password) => {
  try {
    const user = await hospitalModel.findOne({ email });
    console.log(user);

    if (!user) return [false, "Incorrect email or password"];

    const { name, phoneNumber, createdAt, location, licenseNumber } = user;

    if (!user.isActive)
      return [false, "Account deactivated. Contact support for help"];

    if (!(await passwordOperations.comparePassword(password, user.password)))
      return [false, "Incorrect email or password"];

    return [
      true,
      {
        token: await createToken(user.id),
        user: {
          email,
          name,
          phoneNumber,
          location,
          licenseNumber,
          createdAt
        },
      },
    ];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "login failed"];
  }
};

exports.getAllDonors = async () => {
  try {
    const donors = await donorModel.find({ profileComplete: true, isActive: true }).select("-password")

    return [true, donors]
  } catch (error) {
    console.error(error)
    return [false, translateError(error) || "Unable to retrieve donors"];
  }
}

exports.requestDonation = async (requestedDonor, requestingHospital) => {
  try {
    const request = await requestModel.create({
      requestedDonor,
      requestingHospital,
    })

    if(!request) return [false, "Unable to request donation"]

    console.log(request)
    return [true, request]
  } catch (error) {
    console.error(error)
    return [false, translateError(error) || "Unable to send donation request"];
  }
}

exports.updateAcceptedRequest =  async (requestId) => {
  try {
    const request = await requestModel.findById(requestId)

    if(request.status != "accepted") return [false, "Donation request can not be updated until donor accepts request."]

    const updatedRequest = await requestModel.findByIdAndUpdate(requestId, { status: "completed"})

    if(!updatedRequest) return [false, "Unable to update donation request"]

    return [true, updatedRequest]
  } catch (error) {
    console.error(error)
    return [false, translateError(error) || "Failed to update donation request"];
  }
}

exports.retrieveRequestHistory = async (requestingHospital) => {
  try {
    const requests = await requestModel.find({ requestingHospital })

    if(!requests) return [false, "No records found"]

    return [true, requests]
  } catch (error) {
    console.error(error)
    return [false, translateError(error) || "Failed to retrieve donation requests"];
  }
}