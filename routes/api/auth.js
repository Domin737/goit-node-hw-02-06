const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);

router.all("/logout", (req, res) => {
  res.status(405).json({ message: "Method Not Allowed" });
});

router.get("/current", auth, authController.getCurrent);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  authController.updateAvatar
);

router.patch("/subscription", auth, authController.updateSubscription);

router.get("/verify/:verificationToken", authController.verifyEmail);
router.post("/verify", authController.resendVerificationEmail);

module.exports = router;
