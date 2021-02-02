const { Router } = require("express");
const router = Router();

const userController = require("./user.controller");
const { uploadFile, upload, minifyImage } = require("./file.controller");
const { asyncWrapper } = require("../helpers/helpers");

router.get(
  "/current",
  userController.authorizeUser,
  userController.getCurrentUser
);

router.patch(
  "/user",
  userController.authorizeUser,
  userController.validateUpdateUser,
  userController.updateSubscription
);

router.patch(
  "/avatars",
  userController.authorizeUser,
  uploadFile,
  minifyImage,
  userController.validateUpdateAvatar,
  userController.updateUserAvatar,
  asyncWrapper(upload)
);

router.get("/", userController.getUsers);

router.get(
  "/:id",
  userController.authorizeUser,
  userController.getUserById
);

router.put(
  "/:id",
  userController.authorizeUser,
  userController.validateUpdateUser,
  userController.updateUser
);

router.delete(
  "/:id",
  userController.authorizeUser,
  userController.deleteUserById
);

module.exports = router;
