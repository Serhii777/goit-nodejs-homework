const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, unique: true, required: true },
  email: {
    type: String,
    validate: (value) => value.includes("@"),
    required: true,
  },
  phone: { type: String, default: "000-000-0000", required: true },
  subscription: { type: String, default: "free", required: true },
  password: { type: String, default: "password", required: true },
  token: { type: String, default: "free", required: false },
});

const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
