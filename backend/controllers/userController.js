const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//Register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return next(new ErrorHandler("User already exists", 403));
  }

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

exports.login = catchAsyncError(async (req, res, next) => {
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
  const passwordsMatch = await user.comparePasswords(password);

  if (!passwordsMatch) {
    return next(new ErrorHandler("Invalid username or password", 401));
  }

  sendToken(user, 200, res);
});

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: true,
    message: "Logged out",
  });
});

//GENERATE RESET PASSWORD
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false }); //since we havent stored values from the above function

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Password reset token: \n\n ${resetPasswordUrl}\n\n Please ignore if it was not you.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Arrivals password recovery",
      message,
    });

    res.status(200).json({
      status: true,
      message: `Email sent to ${user.email} successfully `,
    });
  } catch (err) {
    console.log("caught err catch  ");
    user.resetPasswordToken = undefined;
    user.resetPasswrodExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});

//RESET password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { resetToken } = req.params;

  if (!resetToken) {
    return next(new ErrorHandler("reset token not found", 404));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswrodExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset token invalid or expired, please try again.", 404)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("passwords do not match.", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});
