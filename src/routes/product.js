const express = require("express");
const { upload } = require("./../middleware/multer");

const { requireSignin, adminMiddleware } = require("../common-middleware");
const {
  createProduct,
  getProductsBySlug,
  getAllProduct,
  getProductDetailsById,

  editProduct,
  getProductIds,
  getProducts,
} = require("../controller/product");

const router = express.Router();

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPictures"),
  createProduct
);
router.get("/product/get-products", getAllProduct);

router.get("/product/id/:slug", getProductDetailsById);
router.get("/products/id/get-Ids", getProductIds);
router.put("/products/edit/:productId", editProduct);
router.get("/product/filter", getProducts);

module.exports = router;
