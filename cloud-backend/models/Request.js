const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  userId: String,
  vm_name: String,
  plan: String,
  status: { type: String, default: "waiting" },
  vm_ip: { type: String, default: "" }
});

module.exports = mongoose.model("Request", RequestSchema);
