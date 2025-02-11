const commonService = require("../Services/commonAuth.Service");
class CommonController {
    async getProfile(req, res) {
        const result = await commonService.getProfile(req.user.userId);
        if (result.status === 200) {
            res.status(result.status).json(result.user);
            return;
        }
        res.status(result.status).json(result.message);
    }
    async getAllTasks(req, res) {
        const result = await commonService.getAllTasks(req.header.projectId);
        if (result.status === 200) {
            res.status(result.status).json(result.tasks);
            return;
        }
        res.status(result.status).json(result.message);
    }
    async updateProfile(req, res) {
        const userId = req.user.userId;
        const data = req.body.data;
        const result = await commonService.updateProfile(userId, data);
        res.status(result.status).json(result.message);
    }
}

module.exports = new CommonController();
