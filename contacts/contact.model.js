const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, unique: true, required: true },
  email: {
    type: String,
    validate: (value) => value.includes("@"),
    unique: true,
    required: true,
  },
  phone: { type: String, default: "098-789-78-78", required: true },
  subscription: { type: String, default: "free", required: true },
  password: { type: String, default: "password", required: true },
  token: { type: String, required: false },
});

contactSchema.static.findContactByIdAndUpdate = findContactByIdAndUpdate;

async function findContactByIdAndUpdate(contactId, updateParams) {
  return this.findByIdAndUpdate(
    contactId,
    {
      $set: updateParams,
    },
    {
      new: true,
    }
  );
}

const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
