const jsonwebtoken = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  //get token from cookie;
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Login kaun karega bhai?", 401));
  }
  const decodedData = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);
  next();
});

exports.authorisedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} does not have access to perform this operation`,
          403
        )
      );
    }

    next();
  };
};
