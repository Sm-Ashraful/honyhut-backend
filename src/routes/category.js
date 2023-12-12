const express = require("express");
const { upload } = require("./../middleware/multer");
const { requireSignin, adminMiddleware } = require("../common-middleware");

const {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategories,
} = require("../controller/category");
const router = express.Router();

router.post(
  "/category/create",
  requireSignin,
  adminMiddleware,
  upload.single("categoryImage"),
  addCategory
);
router.get("/category/getcategory", getCategories);
router.post("/category/delete", requireSignin, adminMiddleware, deleteCategory);
router.post(
  "/category/updateCategories",
  requireSignin,
  adminMiddleware,
  updateCategories
);

module.exports = router;
