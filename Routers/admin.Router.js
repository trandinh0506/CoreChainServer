const express = require("express");
const authen = require("../Services/authen.Service");
const router = express.Router();

router.use((req, res, next) => {
    const decoded = req.user;
    if (decoded.role !== "admin") {
        res.status(403).json({ message: "Forbidden denied" });
    }
    next();
});

module.exports = router;
