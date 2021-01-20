const { Router } = require("express");
const contactController = require("./contact.controller");

const contactRouter = Router();
// const { asyncWrapper } = require("../helpers/helpers");


contactRouter.post(
  "/",
  contactController.validateCreateContact,
  contactController.createContact
);

contactRouter.get("/", contactController.getContacts);

contactRouter.get(
  "/:id",
  contactController.validateContactById,
  contactController.getContactById
);

contactRouter.put(
  "/:id",
  contactController.validateContactById,
  contactController.validateUpdateContact,
  contactController.updateContact
);

contactRouter.patch(
  "/:id",
  contactController.validateContactById,
  contactController.validateUpdateContact,
  contactController.updateContact
);

contactRouter.delete(
  "/:id",
  contactController.validateContactById,
  contactController.removeContact
);

module.exports = contactRouter;
