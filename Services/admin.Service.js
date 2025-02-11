const projectModel = require("../Models/project.Model");

class AdminService {
    async createProject(project) {
        try {
            const { managerId, projectName, deadline } = project;

            if (!managerId || !projectName || !deadline) {
                return { status: 400, message: "Missing required fields" };
            }

            const newProject = new projectModel({
                managerId,
                projectName,
                deadline,
            });

            const savedProject = await newProject.save();

            return {
                success: true,
                message: {
                    message: "Project created successfully",
                    data: savedProject.id,
                },
            };
        } catch (error) {
            return {
                status: 500,
                message:
                    error.message ||
                    "An error occurred while creating the project",
            };
        }
    }
}

module.exports = new AdminService();
