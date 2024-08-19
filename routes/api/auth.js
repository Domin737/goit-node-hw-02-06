const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const auth = require("../../middleware/auth");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", auth, authController.logout);
router.get("/current", auth, authController.getCurrent);

module.exports = router;
