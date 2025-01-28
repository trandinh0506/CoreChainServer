const userModel = require("../Models/user.Model");
const projectModel = require("../Models/project.Model");
class CommonService {
    async getProfile(userId) {
        try {
            const user = await userModel.findById(userId).select("-password");
            return { status: 200, user };
        } catch (err) {
            return {
                status: 500,
                message: "Internal Server Error",
                err: err.message,
            };
        }
    }
    async getAllTasks(projectId) {
        try {
            const project = await projectModel
                .findById(projectId)
                .select("tasks")
                .lean();

            return { status: 200, tasks: project.tasks || [] };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }
}

module.exports = new CommonService();
