// const { User } = require("./user.model");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./user.model");
const userController = require("./user.controller");

class AuthController {
  constructor() {
    this._costFactor = 10;
  }

  get createUser() {
    return this._createUser.bind(this);
  }

  async _createUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const existingUser = await userModel.findUserByEmail(email);

      if (existingUser) {
        return res
          .status(409)
          .send({ message: `User with such email ${email} already exists!` });
      }

      const passwordHash = await bcrypt.hash(password, this._costFactor);

      const user = await userModel.create({
        ...req.body,
        password: passwordHash,
      });

      return res
        .status(201)
        .json({ message: `email ${user.email} registered successfully!` });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findUserByEmail(email);

      if (!user) {
        return res.status(401).send({
          message: `No users with username ${user} found!`,
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({ message: "Wrong password!" });
      }

      const token = await jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET
      );

      const updatedUser = await userModel.updateToken(user._id, token);

      return res.status(200).json({
        token,
        user: {
          ...userController.prepareResponse(updatedUser),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;

      await userModel.updateToken(user._id, null);

      return res
        .status(200)
        .send({ message: `User ${user.email} is logged out` });
    } catch (error) {
      next(error);
    }
  }

  validateCreateUser(req, res, next) {
    const validationRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }

  validateLogin(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = signInRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }
}

module.exports = new AuthController();
