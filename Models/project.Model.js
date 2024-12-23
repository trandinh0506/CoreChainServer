const mongoose = require("mongoose");
const projectSchema = require("../Schemas/project.Schema");
const projectModel = mongoose.model("projects", projectSchema);

module.exports = projectModel;
