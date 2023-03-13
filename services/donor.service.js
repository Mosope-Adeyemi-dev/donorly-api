const donorModel = require("../models/donor.model");
const { translateError } = require("../utils/mongo_helper");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/token");
const verifyPasswordPolicy = require("../utils/passwordPolicy");
const passwordOperations = require("../utils/password");
const requestModel = require("../models/request.model");
const reportModel = require("../models/report.model");

exports.registerDonor = async (body) => {
  try {
    const { email, password } =
      body;

    if (!(await verifyPasswordPolicy(password)))
      return [false, "Password is too weak."];

    const user = await donorModel.create({
      email,
      password,
    });
    console.log(user);
    if (!user) return [false, "Failed to signup"];

    return [true, { token: await createToken(user.id) }];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to signup"];
  }
};

exports.authenticateDonor = async (email, password) => {
  try {
    const user = await donorModel.findOne({ email });
    console.log(user);

    if (!user) return [false, "Incorrect email or password"];

    const { fullname, photo, phoneNumber, createdAt } = user;

    if (!user.isActive)
      return [false, "Account deactivated. Contact support for help."];

    if (!(await passwordOperations.comparePassword(password, user.password)))
      return [false, "Incorrect email or password"];

    return [
      true,
      {
        token: await createToken(user.id),
        user: {
          email,
          fullname,
          phoneNumber,
          photo,
          createdAt
        },
      },
    ];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "login failed"];
  }
};

exports.setDonorProfile = async (id, body) => {
  try {
    body.profileComplete = true

    const updatedUser = await donorModel.findByIdAndUpdate(id, body, { new: true })
    console.log(updatedUser)

    if (!updatedUser) return [false, "Failed to save user profile"]

    return [true, "Profile saved successfully"]
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Failed to save user profile"];
  }
}

exports.retrieveRequestHistory = async (requestedDonor) => {
  try {
    const requests = await requestModel.find({ requestedDonor })

    if (!requests) return [false, "No records found"]

    return [true, requests]
  } catch (error) {
    console.error(error)
    return [false, translateError(error) || "Failed to retrieve donation requests"];
  }
}

exports.updateRequestStatus = async (requestId, status) => {
  try {
    const updatedRequest = await requestModel.findByIdAndUpdate(requestId, { status }, { new: true })

    if (!updatedRequest) return [false, "Unable to update donation request"]

    return [true, updatedRequest]
  } catch (error) {
    console.error(error)
    return [false, translateError(error) || "Failed to update donation request"];
  }
}

exports.newSpamReport = async (reportedHospital, reporter, requestId) => {
  try {
    const report = await reportModel.create({
      reportedHospital,
      reporter,
      requestId
    })
  
    if(!report) return [false, "Unable to report spam"]

    return [true, report]
  } catch (error) {
    console.error(error)
    return [false, translateError(error) || "Failed to update donation request"];
  }
}