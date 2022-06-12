const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.errorCode = err.errorCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name == "CastError") {
    const message = `Resourse Not Found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.errorCode).json({
    success: false,
    message: err.message,
  });
};
