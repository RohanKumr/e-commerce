const express = require("express");
const {
  registerUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  changePassword,
  updateProfile,
  getAllUsers,
  getAdminUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorisedRoles } = require("../middleware/auth");
const router = express.Router();

// Admin
router
  .route("/admin/all-users")
  .get(isAuthenticatedUser, authorisedRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorisedRoles("admin"), getAdminUser);

// Auth

// Public
router.route("/register").post(registerUser);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/password/reset/:resetToken").put(resetPassword);
router.route("/profile").get(isAuthenticatedUser, getUserDetails);
router.route("/change-password").put(isAuthenticatedUser, changePassword);
router.route("/update-profile").put(isAuthenticatedUser, updateProfile);

module.exports = router;
