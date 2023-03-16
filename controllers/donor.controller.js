const {
  registerDonor,
  authenticateDonor,
  setDonorProfile,
  retrieveRequestHistory,
  updateRequestStatus,
  retrieveRequest,
  newSpamReport,
} = require("../services/donor.service");
const { responseHandler } = require("../utils/responseHandler");
const formidable = require("formidable")
const cloudinaryUpload = require("../utils/cloudinary")

exports.signup = async (req, res) => {
  try {
    const check = await registerDonor(req.body);

    if (!check[0]) return responseHandler(res, check[1], 400, false, null);

    return responseHandler(res, "Signup successful", 201, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const check = await authenticateDonor(email, password);

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

exports.profileSetup = async (req, res) => {
  try {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseHandler(res, "Error - Upload required photo", 400, false, null)
      }
      const { photo } = files
      if (!photo) return responseHandler(res, "Error - Upload required photo", 400, false, null)

      let photoUrl;

      await cloudinaryUpload(photo.filepath).then((downloadURL) => {
        photoUrl = downloadURL;
      })
        .catch((error) => {
          console.error(error);
        });

      fields.photo = photoUrl
      console.log(fields)
      const check = await setDonorProfile(req.user, fields)

      if (!check[0]) return responseHandler(res, check[1], 400, false);

      return responseHandler(res, check[1], 200, true);
    })
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

exports.updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body
    const check = await updateRequestStatus(requestId, status)

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, `Donation request ${status} successfully`, 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}

exports.reportSpam = async (req, res) => {
  try {
    const { reportedHospital, requestId } = req.body

    const check = await newSpamReport(reportedHospital, req.user, requestId)

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, `Spam reported successfully`, 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}

exports.getPendingRequests =  async (req, res) => {
  try {
    const check = await retrieveRequest(req.user)

    if (!check[0]) return responseHandler(res, check[1], 400, false);

    return responseHandler(res, `Spam reported successfully`, 200, true, check[1]);
  } catch (error) {
    console.error(error);
    return responseHandler(res, "An error occurred. Server error", 500, false);
  }
}