const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter full name"],
    maxLength: [30, "Name cannot be more than 30 characters"],
    minLength: [4, "Name Cannot be 3 charactes"],
  },
  email: {
    type: String,
    required: [true, "Enter an email"],
    validator: [validator.isEmail, "Enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Enter password"],
    minlength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_url: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswrodExpire: Date,
});

// encrypt password here
userSchema.pre("save", async function (next) {
  //if not handling password skip ...
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

//JwT token
userSchema.methods.getJwtToken = function () {
  //user._id, secret, expiry
  return jsonwebtoken.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//compare encrypted passwords
userSchema.methods.comparePasswords = async function (enteredPassword) {
  return await bcrypt.compare(this.password, enteredPassword);
};

module.exports = mongoose.model("User", userSchema);
