const express = require("express");
const ContactController = require("./contact.controller.js");

const router = express.Router();

router.get("/", ContactController.listContacts);
router.get("/:id", ContactController.getById);

router.post(
  "/",
  ContactController.validateAddContact,
  ContactController.addContact
);

router.put(
  "/:id",
  ContactController.validateUpdateContact,
  ContactController.updateContact
);

router.patch(
  "/:id",
  ContactController.validateUpdateContact,
  ContactController.updateContact
);

router.delete("/:id", ContactController.removeContact);

module.exports = router;
