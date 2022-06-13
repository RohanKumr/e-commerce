const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorisedRoles } = require("../middleware/auth");
const router = express.Router();

//Authoried Users
router
  .route("/products/new")
  .post(isAuthenticatedUser, authorisedRoles("admin"), createProduct);

router
  .route("/product/:id")
  .get(getProductDetails)
  .put(isAuthenticatedUser, authorisedRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorisedRoles("admin"), deleteProduct);

router.route("/products").get(isAuthenticatedUser, getAllProducts);
module.exports = router;
