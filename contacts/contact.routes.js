const { Router } = require("express");
const ContactController = require("./contact.controller.js");

const contactRouter = Router();

contactRouter.get("/", ContactController.getContacts);
contactRouter.get(
  "/:id",
  ContactController.validateContactById,
  ContactController.getContactById
);

contactRouter.post(
  "/",
  ContactController.validateCreateContact,
  ContactController.createContact
);

contactRouter.put(
  "/:id",
  ContactController.validateContactById,
  ContactController.validateUpdateContact,
  ContactController.updateContact
);

contactRouter.patch(
  "/:id",
  ContactController.validateContactById,
  ContactController.validateUpdateContact,
  ContactController.updateContact
);

contactRouter.delete(
  "/:id",
  ContactController.validateContactById,
  ContactController.removeContact
);

module.exports = contactRouter;
