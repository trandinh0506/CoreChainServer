const express = require("express");
const managerController = require("../Controllers/manager.Controller");

const managerRouter = express.Router();

router.use((req, res, next) => {
    const decoded = req.user;
    if (decoded.role !== "manager") {
        res.status(403).json({ message: "Forbidden denied" });
    }
    next();
});

managerRouter.post("/tasks", managerController.allocateTasks);

module.exports = managerRouter;
