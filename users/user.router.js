const { Router } = require("express");
const router = Router();

const userController = require("./user.controller");
const { authorizeUser } = require("../users/middlewares/authMiddlewares");

router.get("/current", authorizeUser, userController.getCurrentUser);

router.get("/", userController.getUsers);

router.get("/:id", userController.validateId, userController.getUserById);

router.put(
  "/:id",
  userController.validateId,
  userController.validateUpdateUser,
  userController.updateUser
);

router.patch(
  "/users",
  authorizeUser,
  userController.validateUpdateSubscription,
  userController.updateSubscription
);

router.delete("/:id", userController.validateId, userController.deleteUserById);

module.exports = router;
