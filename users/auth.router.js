const { Router } = require("express");
const router = Router();

const authController = require("./auth.controller");
const userController = require("./user.controller");

router.post(
  "/register",
  authController.validateCreateUser,
  authController.createUser
);

router.put("/login", authController.validateLogin, authController.login);

router.patch("/logout", userController.authorizeUser, authController.logout);

module.exports = router;
