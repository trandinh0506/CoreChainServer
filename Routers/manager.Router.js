const express = require("express");
const managerController = require("../Controllers/managerController");

const managerRouter = express.Router();

managerRouter.post("/allocateTasks", managerController.allocateTasks);

module.exports = managerRouter;
