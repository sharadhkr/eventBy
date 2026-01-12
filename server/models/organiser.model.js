const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const organiserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: String,
  companyName: String,
}, { timestamps: true });

organiserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model("Organiser", organiserSchema);
