const Joi = require("joi");
const NotFoundError = require("../errors/error.constructor");
const contactModel = require("./contact.model");

const {
  Types: { ObjectId },
} = require("mongoose");

class ContactController {
  async createContact(req, res, next) {
    try {
      const contact = await contactModel.create(req.body);

      return res.status(201).send({ message: "contact created" });
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
        return status(404).json(contact);
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

      const contactToUpdate = await contactModel.findByIdAndUpdate(
        contactId,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      if (!contactToUpdate) {
        throw new NotFoundError();
      }
      return res.status(200).send({ message: "contact updated" });
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
    });

    const resultValidate = schemaValidate.validate(req.body);

    if (resultValidate.error) {
      return res.status(400).send(resultValidate.error);
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
      subscription: Joi.string(),
      password: Joi.string(),
    }).min(1);

    const resultValidateContact = schemaValidateContact.validate(req.body);

    if (resultValidateContact.error) {
      return res.status(400).send(resultValidateContact.error);
    }

    next();
  }

  validateContactById(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      throw new NotFoundError();
    }
    next();
  }
}

module.exports = new ContactController();
