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

    async getProjects(managerId) {
        console.log({ managerId });
        try {
            const projects = await projectModel.find({ managerId });
            console.log({ projects });
            if (projects.length === 0) {
                return {
                    status: 204,
                    message: {
                        message: "No projects found for this manager",
                        data: [],
                    },
                };
            }

            return {
                status: 200,
                message: {
                    message: "Projects retrieved successfully",
                    data: projects,
                },
            };
        } catch (error) {
            return {
                status: 500,
                message: error.message || "Internal Server Error",
            };
        }
    }
}

module.exports = new managerService();
