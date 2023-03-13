const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const reportSchema = mongoose.Schema({
    reportedHospital: {
        type: mongoose.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    reporter: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    requestId: {
        type: mongoose.Types.ObjectId,
        ref: "Request",
        required: true,
    }
}, { timestamps: true})

module.exports = mongoose.model("Report", reportSchema)