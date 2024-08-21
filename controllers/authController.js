const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const gravatar = require("gravatar");
const jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      console.log("Signup validation error:", error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (user) {
      console.log("Signup error: Email in use");
      return res.status(409).json({ message: "Email in use" });
    }

    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);

    const newUser = new User({ email, password, avatarURL });
    await newUser.save();

    console.log("New user signed up:", newUser);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.log("Signup error:", error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = req.user;
    user.token = null;
    await user.save();
    console.log("User logged out:", user.email);
    res.status(204).send();
  } catch (error) {
    console.log("Logout error:", error);
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    console.log("Get current user data:", req.user);
    res.status(200).json({ email, subscription });
  } catch (error) {
    console.log("Get current user error:", error);
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    const avatarDir = path.join(__dirname, "../public/avatars");
    const { _id: id } = req.user;
    const newFileName = `${id}_${originalname}`;
    const resultUpload = path.join(avatarDir, newFileName);

    const image = await jimp.read(tempUpload);
    await image.resize(250, 250).writeAsync(tempUpload);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = `/avatars/${newFileName}`;
    await User.findByIdAndUpdate(req.user._id, { avatarURL });

    console.log("Avatar updated for user:", req.user.email);

    res.json({ avatarURL });
  } catch (error) {
    console.log("Update avatar error:", error);
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const schema = Joi.object({
      subscription: Joi.string().valid("starter", "pro", "business").required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      console.log(
        "Update subscription validation error:",
        error.details[0].message
      );
      return res.status(400).json({ message: error.details[0].message });
    }

    const { subscription } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscription },
      { new: true }
    );

    console.log("Subscription updated for user:", user.email);

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    console.log("Update subscription error:", error);
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrent,
  updateAvatar,
  updateSubscription,
};
