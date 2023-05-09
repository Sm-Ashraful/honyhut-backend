const express = require("express");
const shortid = require("shortid");

const { addCategory, getCategory } = require("../controller/category");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid, generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/category/create", upload.single("categoryImage"), addCategory);
