const express = require("express");
const { signup, signin } = require("../controller/auth");
const { requireSignin } = require("../common-middleware");
const {
  validateSignupRequest,
  validateSigninRequest,
  isRequestValidated,
} = require("../Validator/authValidator");

const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSigninRequest, isRequestValidated, signin);

router.post("/profile", requireSignin, (req, res) => {
  res.status(200).json({ user: "profile" });
});

module.exports = router;
