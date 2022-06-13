const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

/**
 * @POST
 * create product
 */
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

/**
 * @PUT
 */
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  console.log("updateProduct");
  if (!product) {
    return res.status(500).json({
      success: false,
      error: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    status: true,
    product,
  });
});

/**
 * @GET
 */
exports.getAllProducts = catchAsyncError(async (req, res) => {
  const { query } = req;
  const productCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), query)
    .search()
    .filter()
    .pagination(query?.limit);
  const products = await apiFeatures.query;
  console.log("reched here");
  res.status(200).json({
    success: true,
    totalResults: products.length,
    productCount,
    products,
  });
});
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (product)
    res.status(200).json({
      status: true,
      product,
    });
});

/**
 * @DELETE
 */
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res.status(500).json({
      success: false,
      error: "Product not found",
    });
  }

  res.status(200).json({
    status: true,
    msg: "Deleted product",
    id,
  });
});
