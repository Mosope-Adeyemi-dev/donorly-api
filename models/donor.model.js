const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const donorSchema = mongoose.Schema({
    fullname: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
    },
    bloodGroup: {
        type: String,
    },
    genotype: String,
    nextOfKinEmail: String,
    location: String,
    profileComplete: {
        type: Boolean,
        default: false,
        required: true,
    },
    photo: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi7XhRa7l5Tms56aUTAMDB4M4veYq29Os9sA&usqp=CAU'
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
}, { timestamps: true})

donorSchema.pre("save", async function (next) {
    try {
      const hashedPassword = bcrypt.hashSync(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });

module.exports = mongoose.model("Donor", donorSchema)