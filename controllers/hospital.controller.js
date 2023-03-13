const {
  registerHospital,
  authenticateHospital,
  getAllDonors,
  requestDonation,
  updateAcceptedRequest,
  retrieveRequestHistory,
} = require("../services/hospital.service");
const { responseHandler } = require("../utils/responseHandler");

exports.signup = async (req, res) => {
  try {
    const check = await registerHospital(req.body);

    if (!check[0]) return responseHandler(res, check[1], 400, false, null);

    return responseHandler(res, "Signup successful", 201, true);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const check = await authenticateHospital(email, password);

    if (!check[0]) return responseHandler(res, check[1], 400, false, null);

    const { token, user } = check[1];

    res.cookie("authToken", token, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, //24hrs
      httpOnly: true,
    });

    return responseHandler(res, "Login successful", 200, true, {
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
};

exports.retrieveDonors = async (req, res) => {
  try {
    const check = await getAllDonors()

    if (!check[0]) return responseHandler(res, "unable to retrieve list of donors", 400, false);

    return responseHandler(res, "Donors retrieved successfully", 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}

exports.requestDonorDonation = async (req, res) => {
  try {
    const check = await requestDonation(req.body.donor, req.user)

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, "Donation request sent successfully", 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}

exports.completeRequest = async (req, res) => {
  try {
    const check = await updateAcceptedRequest(req.body.requestId)

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, "Donation request updated successfully", 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}

exports.requestHistory = async (req, res) => {
  try {
    const check = await retrieveRequestHistory(req.user)

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, "Donation requests retrieved successfully", 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}