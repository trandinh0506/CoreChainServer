const managerService = require("../Services/manager.Service");

class managerController {
    async allocateTasks(req, res) {
        const data = req.body.data;
        const result = await managerService.allocateTasks(data);
        res.status(result.status).json(result.message);
        
    }
}

module.exports = managerController();