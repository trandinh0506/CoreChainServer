const express = require("express");
const managerController = require("../Controllers/manager.Controller");

const managerRouter = express.Router();

managerRouter.patch("/allocateTasks", managerController.allocateTasks);

managerRouter.get("/getAllTasks", managerController.getAllTasks);

module.exports = managerRouter;
