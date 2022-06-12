const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");
const isAuthenticatedUser = require("../middleware/auth");
const router = express.Router();

router.route("/products/new").post(createProduct);

router
  .route("/product/:id")
  .get(getProductDetails)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/products").get(isAuthenticatedUser, getAllProducts);
module.exports = router;
