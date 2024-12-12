const express = require("express");
const managerController = require("../Controllers/managerController");

const managerRouter = express.Router();

managerRouter.patch("/allocateTasks", managerController.allocateTasks);

managerRouter.get("/getAllTasks", managerController.getAllTasks);


module.exports = managerRouter;
