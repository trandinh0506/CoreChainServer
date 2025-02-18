const adminService = require("../Services/admin.Service");
class adminController {
    async createProject(req, res) {
        const data = req.body.data;
        const result = await adminService.createProject(data);
        res.status(result.status).json(result.message);
    }
    async getProjects(req, res) {
        const result = await adminService.getProjects();
        res.status(result.status).json(result.message);
    }
    async editProject(req, res) {
        const projectId = req.params.projectId;
        const data = req.body.data;
        const result = await adminService.editProject(projectId, data);
        res.status(result.status).json(result.message);
    }
    async getManagers(req, res) {
        const result = await adminService.getManagers();
        res.status(result.status).json(result.message);
    }
}

module.exports = new adminController();
