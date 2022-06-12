const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

//Register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    password,
    email,
    avatr: {
      public_id: "temp user id",
      url: "temp_url",
    },
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Enter email and password", 400));
  }
  //User = Model
  //user = that individual user
  //check if that user exists
  const user = await User.findOne({ email }).select("+password");

  //if that user not found
  if (!user) {
    return next(new ErrorHandler("Incorrect username or password", 401));
  }

  //check if that users passwords match
  const passwordsMatch = user.comparePasswords(password);

  if (!passwordsMatch) {
    return next(new ErrorHandler("Invalid username or password", 401));
  }

  sendToken(user, 200, res);
});
