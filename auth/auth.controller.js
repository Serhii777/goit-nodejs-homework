const fs = require("fs");
const https = require("https");
const sgMail = require("@sendgrid/mail");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { AvatarGenerator } = require("random-avatar-generator");

const userModel = require("../users/user.model");
const {
  NotFoundError,
  UnauthorizedError,
} = require("../errors/error.constructor");

class AuthController {
  constructor() {
    this._costFactor = 10;
  }

  get signUp() {
    return this._signUp.bind(this);
  }

  get signIn() {
    return this._signIn.bind(this);
  }

  async _signUp(req, res, next) {
    try {
      const { email, password } = req.body;

      const existingUser = await userModel.findUserByEmail(email);

      if (existingUser) {
        return res
          .status(409)
          .send({ message: `User with such email ${email} already exists!` });
      }

      const passwordHash = await bcrypt.hash(password, this._costFactor);

      const generator = new AvatarGenerator();
      const userAvatar = await generator.generateRandomAvatar();

      const user = await userModel.create({
        ...req.body,
        password: passwordHash,
        avatarURL: userAvatar,
      });

      const file = fs.createWriteStream(`public/images/${user._id}.svg`);
      https.get(userAvatar, function (res) {
        res.pipe(file);
      });

      await this.sendVerificationEmail(user);

      return res.status(201).json({
        id: user._id,
        email: user.email,
        avatarURL: user.avatarURL,
        path: file.path,
      });
    } catch (error) {
      next(error);
    }
  }

  async _signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const token = await this.checkUser(email, password);

      return res.status(200).json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkUser(email, password) {
    const user = await userModel.findUserByEmail(email);

    if (!user || user.status !== "Verified") {
      throw new UnauthorizedError("Authentication failed!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Authentication failed!");
    }

    const token = await jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: 1000 * 60 * 60 * 12 }
    );

    await userModel.updateToken(user._id, token);

    return token;
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

  async verifyEmail(req, res, next) {
    try {
      const {
        params: { verificationToken },
      } = req;
      // const { verificationToken } = req.params;

      const userToVerify = await userModel.findByVerificationToken(
        verificationToken
      );

      if (!userToVerify) {
        throw new NotFoundError("User not found!");
      }

      const result = await userModel.verifyUser(userToVerify._id);

      return res.status(200).send("You're user syccessfully verified");
    } catch (error) {
      next(error);
    }
  }

  async sendVerificationEmail(user) {
    try {
      const verificationToken = uuidv4();

      await userModel.createVerificationToken(user._id, verificationToken);

      const msg = {
        to: user.email,
        from: process.env.SENDER_EMAIL_ADDRESS,
        subject: "Email verification",
        html: `<div><h1>Hello my friend!</h1><h3>Welcome to our application.</h3><p>You can verify your email by: <a href='${process.env.SITE_DOMAIN}/auth/verify/${verificationToken}'>Click here</a></p></div>`,
      };

      await sgMail.send(msg);
      console.log("Email sent successfully!");
    } catch (error) {
      console.log("error", error);
    }
  }
}

module.exports = new AuthController();
