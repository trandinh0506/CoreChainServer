const managerService = require("../Services/manager.Service");

class managerController {
    async allocateTasks(req, res) {
        const data = req.body.data;
        const result = await managerService.allocateTasks(data);
        res.status(result.status).json(result.message);
    }
    async getAllTasks(req, res) {
        const data = req.body.data;
        const result = managerService.getAllTasks(data);
        res.status(result.status).json(result.message);
    }
    async getProjects(req, res) {
        const result = await managerService.getProjects(req.user.userId);
        res.status(result.status).json(result.message);
    }
}

module.exports = new managerController();
