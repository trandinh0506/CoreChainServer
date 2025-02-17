const adminService = require("../Services/admin.Service");
class adminController {
    async createProject(req, res) {
        const data = req.body.data;
        result = await adminService.createProject(data);
        res.status(res.status).json(result.message);
    }
    async getProjects(req, res) {
        const result = await adminService.getProjects();
        res.status(res.status).json(result.message);
    }
}

module.exports = new adminController();
