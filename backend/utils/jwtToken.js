//Create token & save in cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  //cookie options
  const options = {
    expires: new Date(
      //5 days from now in ms
      //1 day (ms) == 24(hours) * 60 (mins) * 60 (secs) * 1000 (ms)
      //5 (days) = 5 * 1 day(ms)
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

module.exports = sendToken;
