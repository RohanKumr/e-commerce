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
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorisedRoles("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorisedRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorisedRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);
router.route("/products").get(getAllProducts);
module.exports = router;
