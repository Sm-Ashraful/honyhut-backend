const express = require("express");
const { requireSignin, adminMiddleware } = require("../../common-middleware");
const { initialData } = require("../../controller/Admin/initialData");
const router = express.Router();

router.post("/initialdata", requireSignin, adminMiddleware, initialData);

module.exports = router;
