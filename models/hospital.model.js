const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const hospitalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    location: String,
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
}, { timestamps: true})

hospitalSchema.pre("save", async function (next) {
    try {
      const hashedPassword = bcrypt.hashSync(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });

module.exports = mongoose.model("Hospital", hospitalSchema)