// paymentRoutes.js

const express = require("express");
const { CreatePayment } = require("../controller/Payment");

const router = express.Router();

router.use(express.json());

router.post("/car/product/payment", CreatePayment);

module.exports = router;
