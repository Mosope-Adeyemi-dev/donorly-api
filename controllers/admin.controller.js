const {
  registerAdmin,
  authenticateAdmin,
  retrieveDonors,
  retrieveHospitals,
  retrieveReports,
  deactivateHospital,
} = require("../services/admin.service");
const { responseHandler } = require("../utils/responseHandler");

exports.signup = async (req, res) => {
  try {
    const check = await registerAdmin(req.body);

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

    const check = await authenticateAdmin(email, password);

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

exports.getAllDonors = async (req, res) => {
  try {
    const check = await retrieveDonors()

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, `Donors retrieved successfully`, 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}

exports.getAllHospitals = async (req, res) => {
  try {
    const check = await retrieveHospitals()

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, `Hospitals retrieved successfully`, 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}

exports.getAllReports = async (req, res) => {
  try {
    const check = await retrieveReports()

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, `Reports retrieved successfully`, 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}

exports.deactivateHospitalAccount = async (req, res) => {
  try {
    const check = await deactivateHospital(req.body.hospitalId)

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, `Account suspended successfully`, 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}