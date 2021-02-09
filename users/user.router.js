const { Router } = require("express");
const router = Router();

const userController = require("./user.controller");
const userValidator = require("./user.validator");
const { uploadFile, upload, minifyImage } = require("../files/file.controller");
const { asyncWrapper } = require("../helpers/helpers");

router.get(
  "/current",
  userController.authorizeUser,
  userController.getCurrentUser
);

router.patch(
  "/user",
  userController.authorizeUser,
  userValidator.validateUpdateUser,
  userController.updateSubscription
);

router.patch(
  "/avatars",
  userController.authorizeUser,
  uploadFile,
  minifyImage,
  userValidator.validateUpdateAvatar,
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
  userValidator.validateUpdateUser,
  userController.updateUser
);

router.delete(
  "/:id",
  userController.authorizeUser,
  userController.deleteUserById
);

module.exports = router;
