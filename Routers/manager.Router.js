const express = require("express");
const managerController = require("../Controllers/manager.Controller");

const managerRouter = express.Router();

managerRouter.post("/tasks", managerController.allocateTasks);

module.exports = managerRouter;
