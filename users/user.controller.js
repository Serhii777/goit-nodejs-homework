// const mongoose = require("mongoose");
const userModel = require("./user.model");
const Joi = require("joi");
const _ = require("lodash");

const { NotFoundError } = require("../errors/error.constructor");

// Joi.objectId = require("joi-objectid")(Joi);
const {
  Types: { ObjectId },
} = require("mongoose");

class UserController {
  get getUsers() {
    return this._getUsers.bind(this);
  }

  get getUserById() {
    return this._getUserById.bind(this);
  }

  get getCurrentUser() {
    return this._getCurrentUser.bind(this);
  }

  async _getUsers(req, res, next) {
    try {
      const users = await userModel.find();

      console.log(users);

      return res.status(200).json(this.prepareUsersResponse(users));
    } catch (error) {
      next(error);
    }
  }

  async _getUserById(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await userModel.findById(userId);

      if (!user) {
        return res
          .status(404)
          .json({ message: `No user wiyh id ${user} found!` });
      }

      const [userForResponse] = this.prepareUsersResponse([users]);

      res.status(200).json(userForResponse);
    } catch (error) {
      next(error);
    }
  }

  async _getCurrentUser(req, res, next) {
    const [userForResponse] = prepareUsersResponse([req.user]);

    return res.status(200).json(userForResponse);
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;

      const userToUpdate = await userModel.findUserByIdAndUpdate(
        userId,
        req.body
      );

      if (!userToUpdate) {
        // return res.status(404).send();
        throw new NotFoundError("User not authorized");
      }

      const updateUserForResponse = this.prepareUsersResponse([userToUpdate]);

      return res
        .status(204)
        .send(
          { message: `User ${userToUpdate} updated` },
          updateUserForResponse
        );
    } catch (error) {
      next(error);
    }
  }

  async updateSubscription(req, res, next) {
    try {
      const userId = req.params.id;

      const subscriptionToUpdate = await userModel.findUserByIdAndUpdate(
        userId,
        req.body
      );

      if (!userToUpdate) {
        // return res.status(404).send();
        throw new NotFoundError("User not authorized");
      }

      const updateSubscripForResponse = this.prepareUsersResponse([
        subscriptionToUpdate,
      ]);
      return res
        .status(204)
        .send({
          message: "User's subscription updated",
          updateSubscripForResponse,
        });
    } catch (error) {
      next();
    }
  }

  async deleteUserById(req, res, next) {
    try {
      const userId = req.params.id;

      const deleteUser = await userModel.findByIdAndDelete(userId);

      if (!deleteUser) {
        return res.status(404).send();
        // throw new NotFoundError();
      }

      return res.status(204).send({ message: `User ${deleteUser} deleted` });
      //   return res.status(204).send({ message: "User deleted" });
    } catch (error) {
      next(error);
    }
  }

  validateId(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Wrong id" });
    }

    next();
  }

  validateUpdateUser(req, res, next) {
    const validationRules = Joi.object({
      email: Joi.string(),
      password: Joi.string(),
    });

    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }

  validateUpdateSubscription() {
    const validationRules = Joi.object({
      subscription: Joi.string().valid("free", "pro", "premium").required(),
    });

    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }

  prepareUsersResponse(users) {
    return users.map((user) => {
      const { email, subscription, _id } = user;

      return { id: _id, email, subscription };
    });
  }
}

module.exports = new UserController();
