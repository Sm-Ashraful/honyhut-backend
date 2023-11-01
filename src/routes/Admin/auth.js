const express = require("express");
const {
  signup,
  signin,
  signout,
  getUsers,
  getUserById,
} = require("../../controller/Admin/auth");
const {
  validateSignupRequest,
  validateSigninRequest,
  isRequestValidated,
} = require("../../Validator/authValidator");
const { requireSignin, adminMiddleware } = require("../../common-middleware");

const router = express.Router();

router.post("/admin/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/admin/signin", validateSigninRequest, isRequestValidated, signin);
router.post("/admin/signout", signout);
router.get("/admin/get-all-users", requireSignin, adminMiddleware, getUsers);
router.get("/admin/get-user-by-id/:userId", getUserById);

// router.post("/profile", requireSignin, (req, res) => {
//   res.status(200).json({ user: "profile" });
// });

module.exports = router;
