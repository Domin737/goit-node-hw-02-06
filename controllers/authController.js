const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const gravatar = require("gravatar");
const sgMail = require("@sendgrid/mail");
const jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const { handleAsync } = require("../utils/asyncHandler");
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");
const {
  validateUserSignup,
  validateSubscription,
  validateEmail,
} = require("../utils/validators");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signup = handleAsync(async (req, res) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const user = await User.findOne({ email });
  if (user) {
    throw new ConflictError("Email in use");
  }

  const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);

  const newUser = new User({ email, password, avatarURL });
  await newUser.save();

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Please verify your email",
    html: `<a href="${req.protocol}://${req.get("host")}/api/users/verify/${
      newUser.verificationToken
    }">Click to verify your email</a>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    console.error(error.response?.body);
    console.log("User created, but verification email failed to send");
  }

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
    message: "User created successfully",
  });
});

const login = handleAsync(async (req, res) => {
  const { email, password } = req.body;

  const { error } = validateUserSignup(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError("Email or password is wrong");
  }

  if (!user.verify) {
    throw new UnauthorizedError(
      "Email not verified. Please check your email for verification link."
    );
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
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
});

const logout = handleAsync(async (req, res) => {
  const user = req.user;
  user.token = null;
  await user.save();
  res.status(204).send();
});

const getCurrent = handleAsync(async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
});

const updateAvatar = handleAsync(async (req, res) => {
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

  res.json({ avatarURL });
});

const updateSubscription = handleAsync(async (req, res) => {
  const { error } = validateSubscription(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const { subscription } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { subscription },
    { new: true }
  );

  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
});

const verifyEmail = handleAsync(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  user.verify = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json({ message: "Verification successful" });
});

const resendVerificationEmail = handleAsync(async (req, res) => {
  const { email } = req.body;

  const { error } = validateEmail(req.body);
  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.verify) {
    throw new BadRequestError("Verification has already been passed");
  }

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Please verify your email",
    html: `<a href="${req.protocol}://${req.get("host")}/api/users/verify/${
      user.verificationToken
    }">Click to verify your email</a>`,
  };

  await sgMail.send(msg);
  res.status(200).json({ message: "Verification email sent" });
});

module.exports = {
  signup,
  login,
  logout,
  getCurrent,
  updateAvatar,
  updateSubscription,
  verifyEmail,
  resendVerificationEmail,
};
