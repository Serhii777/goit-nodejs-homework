// const contacts = require("../db/contacts.json");
const Joi = require("joi");
// Joi.objectid = require('joi-objectid')(Joi);
const contactModel = require("./contact.model");

const {
  Types: { ObjectId },
} = require("mongoose");

class ContactController {
  async createContact(req, res, next) {
    try {
      const contact = await contactModel.crete(req.body);

      return ers.status(201).json(contact);
    } catch (error) {
      next(error);
    }
  }

  async getContacts(req, res, next) {
    try {
      const contacts = await contactModel.find();

      return res.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getContactById(req, res, next) {
    try {
      const contactId = req.params.id;

      const contact = await contactModel.findById(contactId);

      if (!contact) {
        return status(404).send();
      }

      return res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  }

  async removeContact(req, res, next) {
    try {
      const contactId = req.params.id;

      const contactToUpdate = await contactModel.findByIdAndDelete(contactId);

      if (!contactToUpdate) {
        return res.status(404).send();
      }

      res.status(200).send({ message: "contact deleted" });
    } catch (error) {
      next(error);
    }
  }

  async updateContact(req, res, next) {
    try {
      const contactId = req.params.id;

      const updateResult = await contactModel.findContactByIdAndUpdate(
        contactId,
        req.body
      );
      if (!updateResult) {
        return res.status(404).send();
      }
      return res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  }

  validateCreateContact(req, res, next) {
    const schemaValidate = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string().required(),
    });

    const resultValidate = schemaValidate.validate(req.body);

    if (resultValidate.error) {
      return res.status(400).send({ message: "missing required name field" });
    }

    next();
  }

  validateUpdateContact(req, res, next) {
    const schemaValidateContact = Joi.object({
      name: Joi.string().alphanum().min(3).max(30),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
      phone: Joi.string(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string().required(),
    }).min(1);

    const resultValidateContact = schemaValidateContact.validate(req.body);

    if (resultValidateContact.error) {
      return res.status(400).send({ message: "missing fields" });
    }

    next();
  }

  validateContactById(req, res, next) {
    const { id } = req.params;

    if (!Object.isValid(id)) {
      return res.status(400).send();
    }
    next();
  }
}

module.exports = new ContactController();
