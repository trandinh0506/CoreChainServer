const projectModel = require("../Models/project.Model");
class managerService {
    async allocateTasks(data) {
        try {
            const {userId, projectId, task, deadline, status} = data;
            const newTask = 
                {userId, task, deadline, status};
            await projectModel.updateOne(
                { _id: projectId },
                { $push: { tasks: newTask } }
            );
            return {status: 200, message: "update task successfully!" }
            
        } catch(err) {
            return {status: 500, message: err.message}
        }
    }
    async getAllTasks(data) {
        try {
            const {projectId} = data;
            const project = await projectModel.findById(projectId).select("tasks").lean();

            return { status: 200, message: project.tasks || [] };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }
}

module.exports = new managerService();