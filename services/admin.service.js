const adminModel = require("../models/admin.model");
const { translateError } = require("../utils/mongo_helper");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/token");
const verifyPasswordPolicy = require("../utils/passwordPolicy");
const passwordOperations = require("../utils/password");
const donorModel = require("../models/donor.model");
const hospitalModel = require("../models/hospital.model");
const reportModel = require("../models/report.model");

exports.registerAdmin = async (body) => {
  try {
    const { name, email, password, phoneNumber } = body;

    if (!(await verifyPasswordPolicy(password)))
      return [false, "Password is too weak."];

    const user = await adminModel.create({
      name,
      email,
      phoneNumber,
      password,
    });
    console.log(user);
    if (!user) return [false, "Failed to signup"];

    return [true, user];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to signup"];
  }
};

exports.authenticateAdmin = async (email, password) => {
  try {
    const user = await adminModel.findOne({ email });
    console.log(user);

    if (!user) return [false, "Incorrect email or password"];

    const { name, phoneNumber } = user;

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
        },
      },
    ];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "login failed"];
  }
};

exports.retrieveDonors = async () => {
  try {
    const donors = await donorModel.find();
    return [true, donors];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to retrieve donors"];
  }
};

exports.retrieveHospitals = async () => {
  try {
    const hospitals = await hospitalModel.find();
    return [true, hospitals];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to retrieve hospitals"];
  }
};

exports.retrieveReports = async () => {
  try {
    const reports = await reportModel.aggregate([
      {
        $match: {
          status: "Unresolved",
        },
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "reportedHospital",
          foreignField: "_id",
          as: "hospital",
        },
      },
    ]);
    return [true, reports];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to retrieve reports"];
  }
};

exports.deactivateHospital = async (id, reportId) => {
  try {
    const result = await hospitalModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (reportId)
      await reportModel.findByIdAndUpdate(reportId, { status: "Resolved" });

    return [true, result];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to activate accounts"];
  }
};

exports.reactivateHospital = async (id) => {
  try {
    const result = await hospitalModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    return [true, result];
  } catch (error) {
    console.log(error);
    return [false, translateError(error) || "Unable to activate account"];
  }
};
