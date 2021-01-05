const contacts = require("../db/contacts");
const Joi = require("joi");

class ContactController {
  listContacts(req, res) {
    res.json(contacts);
  }

  getById = (req, res) => {
    const contactIndex = this.findContactById(res, req.params.id);

    res.json(contacts[contactIndex]);
  };

  addContact(req, res, next) {
    const newContact = {
      ...req.body,
      id: contacts.length + 1,
    };

    contacts.push(newContact);

    return res.status(201).send();
  }

  validateAddContact(req, res, next) {
    const schemaValidate = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      phone: Joi.string().required(),
    });

    const resultValidate = schemaValidate.validate(req.body);

    if (resultValidate.error) {
      return res.status(400).send({ message: "missing required name field" });
    }

    next();
  }

  updateContact = (req, res) => {
    try {
      const contactIndex = this.findContactById(res, req.params.id);

      const updatedContact = {
        ...contacts[contactIndex],
        ...req.body,
      };

      contacts[contactIndex] = updatedContact;

      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  };

  removeContact = (req, res, next) => {
    try {
      const contactIndex = this.findContactById(res, req.params.id);

      contacts.splice(contactIndex, 1);

      res.status(200).send({ message: "contact deleted" });
    } catch (error) {
      next(error);
    }
  };

  validateUpdateContact(req, res, next) {
    const schemaValidateContact = Joi.object({
      name: Joi.string().alphanum().min(3).max(30),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      phone: Joi.string(),
    }).min(1);

    const resultValidateContact = schemaValidateContact.validate(req.body);

    if (resultValidateContact.error) {
      return res.status(400).send({ message: "missing fields" });
    }

    next();
  }

  findContactById(res, contactId) {
    const contactIndex = parseInt(contactId);

    const findContactIndex = contacts.findIndex(
      ({ id }) => id === contactIndex
    );

    if (findContactIndex === -1) {
      return res.status(404).send({ message: "Not found" });
    }
    return findContactIndex;
  }
}

module.exports = new ContactController();
