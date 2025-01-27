const mongoose = require("mongoose");
const userSchema = require("../Schemas/user.Schema");
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
