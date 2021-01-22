const { Router } = require("express");
const router = Router();

const userController = require("./user.controller");

router.get(
  "/current",
  userController.authorizeUser,
  userController.getCurrentUser
);

router.patch(
  "/user",
  userController.authorizeUser,
  userController.validateUpdateSubscription,
  userController.updateSubscription
);

router.get("/", userController.getUsers);

router.get("/:id", userController.validateId, userController.getUserById);

router.put(
  "/:id",
  userController.validateId,
  userController.validateUpdateUser,
  userController.updateUser
);

router.delete("/:id", userController.validateId, userController.deleteUserById);

module.exports = router;
