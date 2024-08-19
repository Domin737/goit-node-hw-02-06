const express = require("express");
const router = express.Router();
const Joi = require("joi");
const User = require("../../models/user");
const authController = require("../../controllers/authController");
const auth = require("../../middleware/auth");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", auth, authController.logout);
router.get("/current", auth, authController.getCurrent);

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

module.exports = router;
