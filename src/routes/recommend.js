const express = require("express");
const { getRecommendProducts } = require("../controller/recommand");

const router = express.Router();
router.get("/recommend/get-recommend-products", getRecommendProducts);
module.exports = router;
