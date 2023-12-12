const express = require("express");
const { upload } = require("./../middleware/multer");

const { requireSignin, adminMiddleware } = require("../common-middleware");
const {
  createProduct,
  getProductsBySlug,
  getAllProduct,
  getProductDetailsById,
  getProductByType,
  editProduct,
  getProductIds,
  getCarAromaTherapyProduct,
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
router.get("/products/slug/:slug", getProductsBySlug);
router.get("/product/id/:productId", getProductDetailsById);
router.get("/products/type/:productType", getProductByType);
router.get("/products/id/get-Ids", getProductIds);
router.put("/products/edit/:productId", editProduct);
router.get("/product/car-aroma-therapy", getCarAromaTherapyProduct);

module.exports = router;
