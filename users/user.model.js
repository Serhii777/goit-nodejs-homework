const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: (value) => value.includes("@"),
    required: true,
  },
  password: { type: String, default: "password", required: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: { type: String, default: "free", required: false },
});

userSchema.static.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.static.findUserByEmail = findUserByEmail;
userSchema.static.updateToken = updateToken;

async function findUserByIdAndUpdate(userId, updateParams) {
  return this.findByIdAndUpdate(
    userId,
    {
      $set: updateParams,
    },
    {
      new: true,
    }
  );
}

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, { token: newToken });
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
