const jsonwebtoken = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");

const isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  //get token from cookie;
  const { token } = req.cookies;
  !token && next(new ErrorHandler("Login required", 401));
  const decodedData = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});

module.exports = isAuthenticatedUser;
