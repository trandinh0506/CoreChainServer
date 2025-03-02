const express = require("express");
const adminController = require("../Controllers/admin.Controller");
const router = express.Router();

router.use((req, res, next) => {
    const decoded = req.user;
    if (decoded.role !== "admin") {
        return res.status(403).json({ message: "Forbidden denied" });
    }
    next();
});

router.post("/project", adminController.createProject);
router.get("/projects", adminController.getProjects);
router.get("/managers", adminController.getManagers);
router.patch("/edit-project:projectId", adminController.editProject);
module.exports = router;
