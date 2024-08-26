const express = require("express");
const router = express.Router();
const Joi = require("joi");
const User = require("../../models/user");
const authController = require("../../controllers/authController");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", auth, authController.logout);
router.get("/current", auth, authController.getCurrent);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const { path: tempUpload, originalname } = req.file;
      const jimp = require("jimp");
      const fs = require("fs/promises");
      const path = require("path");

      const avatarDir = path.join(__dirname, "../../public/avatars");
      const { _id: id } = req.user;
      const newFileName = `${id}_${originalname}`;
      const resultUpload = path.join(avatarDir, newFileName);

      const image = await jimp.read(tempUpload);
      await image.resize(250, 250).writeAsync(tempUpload);
      await fs.rename(tempUpload, resultUpload);

      const avatarURL = `/avatars/${newFileName}`;
      await User.findByIdAndUpdate(req.user._id, { avatarURL });

      res.json({ avatarURL });
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/subscription", auth, async (req, res, next) => {
  try {
    const schema = Joi.object({
      subscription: Joi.string().valid("starter", "pro", "business").required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
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
  } catch (error) {
    next(error);
  }
});

router.get("/verify/:verificationToken", authController.verifyEmail);
router.post("/verify", authController.resendVerificationEmail);

module.exports = router;
