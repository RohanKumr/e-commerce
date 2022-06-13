const express = require("express");
const {
  registerUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const router = express.Router();

//AUTH
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/password/reset/:resetToken").put(resetPassword);

module.exports = router;
