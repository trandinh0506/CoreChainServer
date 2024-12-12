const mongoose = require("mongoose");
const projectSchema = require("../Schemas/project.Schema");
const projectModel = mongoose.Model("projects", projectSchema);

module.exports = projectModel;