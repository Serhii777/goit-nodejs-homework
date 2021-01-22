// const mongoose = require("mongoose");
const userModel = require("./user.model");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const _ = require("lodash");

const {
  NotFoundError,
  UnauthorizedError,
} = require("../errors/error.constructor");

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

      const [userForResponse] = this.prepareUsersResponse([user]);

      res.status(200).json(userForResponse);
    } catch (error) {
      next(error);
    }
  }

  async _getCurrentUser(req, res, next) {
    const [userForResponse] = this.prepareUsersResponse([req.user]);

    return res.status(200).json(userForResponse);
  }

  async authorizeUser(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");

      if (!authorizationHeader) {
        throw new UnauthorizedError("User not authorized Header");
      }

      const token = authorizationHeader.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({ message: "No JWT token found in header" });
      }

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized JWT"));
      }

      const user = await userModel.findById(userId);

      if (!user || user.token !== token) {
        throw new UnauthorizedError("User not authorized ID");
      }

      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;

      const userToUpdate = await userModel.findUserByIdAndUpdate(
        userId,
        req.body
      );

      if (!userToUpdate) {
        throw new NotFoundError("User not authorized");
      }

      return res.status(200).send({ message: `User ${userToUpdate} updated` });
    } catch (error) {
      next(error);
    }
  }

  async updateSubscription(req, res, next) {
    try {
      const { _id: userId } = req.user;

      const subscriptionToUpdate = await userModel.findUserByIdAndUpdate(
        userId,
        req.body
      );

      if (!subscriptionToUpdate) {
        throw new NotFoundError("User not authorized");
      }

      return res.status(200).send({
        message: `Subscription of user (${subscriptionToUpdate.email}) has been updated`,
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
        throw new NotFoundError("User not found");
      }

      return res
        .status(200)
        .send({ message: `User ${deleteUser.email} deleted` });
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

  validateUpdateSubscription(req, res, next) {
    const validationRules = Joi.object({
      subscription: Joi.string().valid("free", "pro", "premium").required(),
    });

    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }

  prepareUsersResponse = (users) => {
    return users.map((user) => {
      const { email, subscription, _id } = user;

      return { id: _id, email, subscription };
    });
  };

  prepareResponse = ({ email, subscription }) => ({ email, subscription });
}

module.exports = new UserController();
