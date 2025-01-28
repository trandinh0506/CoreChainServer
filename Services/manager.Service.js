const projectModel = require("../Models/project.Model");
class managerService {
    async allocateTasks(data) {
        try {
            const { staffId, projectId, title, description, deadline } = data;
            const newTask = {
                staffId,
                title,
                description,
                deadline,
                completed: false,
            };
            await projectModel.updateOne(
                { _id: projectId },
                { $push: { tasks: newTask } }
            );
            return { status: 200, message: "Task allocated successfully!" };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }
    async getAllTasks(data) {
        try {
            const { projectId } = data;
            const project = await projectModel
                .findById(projectId)
                .select("tasks")
                .lean();

            return { status: 200, message: project.tasks || [] };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }
}

module.exports = new managerService();
