const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const requestSchema = mongoose.Schema({
    requestingHospital: {
        type: mongoose.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    requestedDonor: {
        type: mongoose.Types.ObjectId,
        ref: "Donor",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "rejected, completed"],
        default: "pending"
    },
}, { timestamps: true})

module.exports = mongoose.model("Request", requestSchema)