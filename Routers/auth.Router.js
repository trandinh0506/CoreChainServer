const express = require("express");
const adminRoute = require("./admin.Router");
const managerRoute = require("./manager.Router");
const blockchainRoute = require("./blockchain.Router");
const { authMdw } = require("../Middlewares/auth.Middleware");
const authController = require("../Controllers/auth.Controller");

const authRouter = express.Router();
authRouter.use(authMdw);

authRouter.use("/admin", adminRoute);
authRouter.use("/manager", managerRoute);
authRouter.use("/blockchain", blockchainRoute);
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);

module.exports = authRouter;
