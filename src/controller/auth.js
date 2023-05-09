const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
exports.signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({
        message: "User already registered",
      });
    }

    const { name, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);

    const _user = new User({
      name,
      email,
      hash_password,
      username: shortid.generate(),
    });

    const savedUser = await _user.save();
    if (savedUser) {
      const token = jwt.sign(
        { _id: savedUser._id, role: savedUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "48h",
        }
      );
      res.cookie("token", token, { expiresIn: "48h" });
      return res.status(201).json({
        message: "Sign Up successfully...!",
        token: token,
        user: {
          _id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Something Went Wrong",
    });
  }
};
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ message: "Invalid User Name or Password" });
    }

    const isPasswordValid = await user.authenticate(req.body.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid User Name or Password" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "48h",
      }
    );

    const { _id, name, email, role } = user;

    res.cookie("token", token, { expiresIn: "48h" });

    return res.status(200).json({
      token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: "Something Went Wrong" });
  }
};
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully.....!",
  });
};
