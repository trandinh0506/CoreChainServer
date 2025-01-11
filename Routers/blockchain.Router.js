const express = require("express");

const blockchainController = require("../Controllers/blockchain.Controller");

const blockchainRouter = express.Router();

blockchainRouter.get("/", blockchainController.home);

blockchainRouter.post("/add-block", blockchainController.addBlock);

blockchainRouter.get("/validate", blockchainController.validate);

module.exports = blockchainRouter;
