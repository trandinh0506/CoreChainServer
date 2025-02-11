const express = require("express");
const adminController = require("../Controllers/admin.Controller");
const router = express.Router();

router.use((req, res, next) => {
    const decoded = req.user;
    if (decoded.role !== "admin") {
        res.status(403).json({ message: "Forbidden denied" });
    }
    next();
});

router.post("/create-project", adminController.createProject);

module.exports = router;
