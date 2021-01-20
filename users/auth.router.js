const { Router } = require("express");
const router = Router();

const authController = require("../users/auth.controller");
const { authorizeUser } = require("../users/middlewares/authMiddlewares");

router.post(
  "/auth/register",
  authController.validateCreateUser,
  authController.createUser
);

router.put("/auth/login", authController.validateLogin, authController.login);

router.patch("/auth/logout", authorizeUser, authController.logout);

module.exports = router;
