const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = mongoose.Schema({
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
    }
}, { timestamps: true})

adminSchema.pre("save", async function (next) {
    try {
      const hashedPassword = bcrypt.hashSync(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
});

module.exports = mongoose.model("Admin", adminSchema)