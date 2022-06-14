const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

//crypto is a built in module
const crypto = require("crypto");

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
  resetPasswordExpire: Date,
});

// ENCRYPT password here
userSchema.pre("save", async function (next) {
  //if not handling password skip ...
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

// JwT token
userSchema.methods.getJwtToken = function () {
  //user._id, secret, expiry
  return jsonwebtoken.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// COMPARE encrypted passwords
userSchema.methods.comparePasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// RESET passwords
userSchema.methods.getResetPasswordToken = function () {
  /**
   * crypto is an inbuilt feature
   * crypto.randomBytes(20) = <Buffer bb ac 7a 43 82 6c 68 65 34 d0 6b bb 52 38 f5 03 94 a3 94 06>
   * crypto.randomBytes(20).toString() = l�OJ��� L���n�?��
   * crypto.randomBytes(20).toString("hex") = 1ec9dac8d84a158d5db466846d8c7d6b55f432a8
   *
   */
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
