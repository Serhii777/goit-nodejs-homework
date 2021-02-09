const { Router } = require("express");
const router = Router();

const authController = require("./auth.controller");
const authValidator = require("./auth.validator");
const userController = require("../users/user.controller");

router.post(
  "/sign-up",
  authValidator.validateSignUp,
  authController.signUp
);

router.put("/sign-in", authValidator.validateSignIn, authController.signIn);

router.get("/verify/:verificationToken", authController.verifyEmail);

router.patch("/logout", userController.authorizeUser, authController.logout);

module.exports = router;
