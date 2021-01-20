const jwt = require("jsonwebtoken");
const userModel = require("../user.model");
const { UnauthorizedError } = require("../../errors/error.constructor");

module.exports.authorizeUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization") || "";
    if (!authorizationHeader) {
      throw new UnauthorizedError("User not authorized");
    }

    const token = authorizationHeader.replace("Bearer", "");

    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (err) {
      next(new UnauthorizedError("User not authorized"));
    }

    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      throw new UnauthorizedError("User not authorized");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};